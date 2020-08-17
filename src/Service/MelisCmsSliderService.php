<?php

/**
 * Melis Technology (http://www.melistechnology.com)
*
* @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
*
*/

namespace MelisCmsSlider\Service;

use MelisCmsSlider\Entity\MelisCmsSlider;
use Laminas\Db\Sql\Delete;
use MelisCore\Service\MelisGeneralService;

/**
 *
 * This service handles the slider system of Melis.
 *
 */
class MelisCmsSliderService extends MelisGeneralService
{
    /**
     * This service retrieves  a list of sliders
     * 
     * @param int|null $start The mysql start, mainly used for pagination 
     * @param int|null $limit The mysql limit, mainly used for pagination
     * @param varchar|null $order The mysql ordering function, sets the order on how datas are retrieved
     * @param varchar|null $search Searches the table for the provided query, searcheable columns : mcslide_id, mcslide_name
     * 
     * @return array MelisCmsSlider[]
     */
    public function getSliderList($start = null, $limit = null, $order = null, $search = null )
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = array();
   
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_list_start', $arrayParameters);
    
        // Service implementation start
        $sliderTable = $this->getServiceManager()->get('MelisCmsSliderTable');
        $sliders = $sliderTable->getSliderList($arrayParameters['start'], $arrayParameters['limit'], $arrayParameters['order'], $arrayParameters['search']);
       
        foreach($sliders as $slider){
            $results[] = $this->getSlider($slider->mcslide_id);
        }
        // Service implementation end
        
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_list_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service retrieves a specific slider
     * 
     * @param int $sliderId The slider id to be fetch
     * 
     * @return MelisCmsSlider[]
     */
    public function getSlider($sliderId, $status = null)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = array();
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_start', $arrayParameters);
       
        // Service implementation start
        $sliderTable = $this->getServiceManager()->get('MelisCmsSliderTable');
        $sliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        $customSliderEnt = new MelisCmsSlider();
        
        $sliderDetails = array();
        foreach($sliderTable->getEntryById($arrayParameters['sliderId']) as $slider){
            foreach($sliderDetailTable->getSliderDetailsByOrder($arrayParameters['sliderId'], $arrayParameters['status']) as $sliderDetail){                
                $sliderDetails[] = $sliderDetail;
            }
           
            $customSliderEnt->setId($slider->mcslide_id);
            $customSliderEnt->setSlider($slider);
            $customSliderEnt->setSliderDetails($sliderDetails);
            $results = $customSliderEnt;
        }
        
        // Service implementation end
    
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service retrieves the slider details
     * 
     * @param int $sliderDetailId The slider details to be fetch
     * 
     * @return MelisCmsSliderDetails[]
     */
    public function getSliderDetails($sliderDetailId)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = array();
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_details_start', $arrayParameters);
        
        // Service implementation start
        $sliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        foreach($sliderDetailTable->getEntryById($arrayParameters['sliderDetailId']) as $sliderDetail){
            $results = $sliderDetail;
        }
        
        // Service implementation end
        
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_details_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service retrieves the slider details by page id
     *
     * @param int $pageId The slider details to be fetch based on the paged id column
     *
     * @return MelisCmsSliderDetails[]
     */
    public function getSliderByPageId($pageId, $status = null)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = array();
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_by_page_id_start', $arrayParameters);
       
        // Service implementation start
        $sliderTable = $this->getServiceManager()->get('MelisCmsSliderTable');
        $sliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        $customSliderEnt = new MelisCmsSlider();
        
        $sliderDetails = array();
        foreach($sliderTable->getEntryByField('mcslide_page_id', $arrayParameters['pageId']) as $slider){
           
            foreach($sliderDetailTable->getSliderDetailsByOrder($slider->mcslide_id, $arrayParameters['status']) as $sliderDetail){                
                $sliderDetails[] = $this->getSliderDetails($sliderDetail->mcsdetail_id);
            }
           
            $customSliderEnt->setId($slider->mcslide_id);
            $customSliderEnt->setSlider($slider);
            $customSliderEnt->setSliderDetails($sliderDetails);
            $results = $customSliderEnt;
        }
        
        // Service implementation end
    
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_by_page_id_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service saves the MelisCmsSlider data
     * 
     * @param array $slider The array of data that corresponds to the table melis_cms_slider
     * @param int|null $sliderId The slider id, if specified an update will be performed otherwise a new slider will be saved
     *  
     * @return int|null The slider id created/updated or null on error
     */
    public function saveSlider($slider, $sliderId = null)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = null;
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_details_start', $arrayParameters);
        
        // Service implementation start
        $sliderTable = $this->getServiceManager()->get('MelisCmsSliderTable');
        try{
            $results = $sliderTable->save($arrayParameters['slider'], $arrayParameters['sliderId']);
        }catch(\Exception $e){
            echo $e->getMessage();
        }
        
        // Service implementation end
        
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_get_slider_details_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service saves the slider details data
     * 
     * @param array $sliderDetail The data array corresponding to the table melis_cms_slider_details
     * @param int|null $sliderDetailId The slider detail id, if specified an update will be performed otherwise a new slider details will be saved
     * 
     * @return int|null The slider detail id created/updated or null on error
     */
    public function saveSliderDetails($sliderDetail, $sliderDetailId = null)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = null;
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_save_details_start', $arrayParameters);
        
        // Service implementation start
        $sliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        try{
            $results = $sliderDetailTable->save($arrayParameters['sliderDetail'], $arrayParameters['sliderDetailId']);
        }catch(\Exception $e){
            echo $e->getMessage();
        }        
       
        // Service implementation end
        
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_save_details_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service deletes the slider and the slider details associdated with it
     * 
     * @param int $sliderId The slider id to be deleted
     * 
     * @return booelan true|false true on success, false on error
     */
    public function deleteSlider($sliderId)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = false;
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_delete_details_start', $arrayParameters);
        
        // Service implementation start
        $sliderTable = $this->getServiceManager()->get('MelisCmsSliderTable');
        $sliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        $details = $sliderDetailTable->getEntryByField('mcsdetail_mcslider_id', $arrayParameters['sliderId']);
        try{
            $results = $sliderTable->deleteById($arrayParameters['sliderId']);
            foreach ($details as $detail){
                $this->deleteSliderDetails($detail->mcsdetail_id);
            }
            $results = true;
        }catch(\Exception $e){
            echo $e->getMessage();
        }
         
        // Service implementation end
        
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_delete_details_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service deletes the slider details
     * 
     * @param int $sliderDetailId the slider detail id to be Delete
     * 
     * @return boolean true|false True on success or false on error
     */
    public function deleteSliderDetails($sliderDetailId)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = false;
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_delete_details_start', $arrayParameters);
        
        // Service implementation start
        $sliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        try{
            $results = $sliderDetailTable->deleteById($arrayParameters['sliderDetailId']);
            $results = true;
        }catch(\Exception $e){
            echo $e->getMessage();
        }
         
        // Service implementation end
        
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_delete_details_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
    
    /**
     * This service updates the ordering of the slider details
     * 
     * @param int $sliderDetailId the slider detail id to be updated
     * @param int $mcsdetail_order the new order of the slider details
     * 
     * @return int|null Returns int id of the updated slider details or null on error
     */
    public function updateSliderDetailsOrdering($sliderDetailId, $mcsdetail_order)
    {
        // Event parameters prepare
        $arrayParameters = $this->makeArrayFromParameters(__METHOD__, func_get_args());
        $results = null;
        
        // Sending service start event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_delete_details_start', $arrayParameters);
        
        // Service implementation start
        $sliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        $data = array('mcsdetail_order' => $arrayParameters['mcsdetail_order']);
        try{
            $results = $sliderDetailTable->save($data,$arrayParameters['sliderDetailId']);
        }catch(\Exception $e){
            echo $e->getMessage();
        }
         
        // Service implementation end
        
        // Adding results to parameters for events treatment if needed
        $arrayParameters['results'] = $results;
        // Sending service end event
        $arrayParameters = $this->sendEvent('meliscmsslider_service_delete_details_end', $arrayParameters);
         
        return $arrayParameters['results'];
    }
}