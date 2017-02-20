<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class MelisCmsSliderListController extends AbstractActionController
{
    /**
     * renders the page container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListPageAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        return $view;
    }
    
    /**
     * renders the header container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListHeaderAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        return $view;
    }
    
    /**
     * renders the table list page left header container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListHeaderLeftAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        return $view;
    }
    
    /**
     * renders the table list page right header container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListHeaderRightAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        return $view;
    }
    
    /**
     * renders the table list page right header container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListHeaderRightAddAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        return $view;
    }
    
    /**
     * renders the table list page title
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListHeaderTitleAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        return $view;
    }
    
    /**
     * renders the table list page content container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        return $view;
    }
    
    /**
     * renders the coupon list content table filter limit
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentFilterLimitAction()
    {
        return new ViewModel();
    }
    
    /**
     * renders the coupon list content table filter search
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentFilterSearchAction()
    {
        return new ViewModel();
    }
    
    /**
     * renders the coupon list content table filter refresh
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentFilterRefreshAction()
    {
        return new ViewModel();
    }
    
    /**
     * renders the coupon list content table action info
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentActionInfoAction()
    {
        return new ViewModel();
    }
    
    /**
     * renders the coupon list content table action edit
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentActionEditAction()
    {
        return new ViewModel();
    }
    
    /**
     * renders the coupon list content table action edit
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentActionDeleteAction()
    {
        return new ViewModel();
    }
    
    /**
     * renders the coupon list page table
     * @return \Zend\View\Model\ViewModel
     */
    public function renderTableListContentTableAction()
    {
        $columns = $this->getTool()->getColumns();
        $columns['actions'] = array('text' => 'Action');
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        $view->tableColumns = $columns;
        $view->getToolDataTableConfig = $this->getTool()->getDataTableConfiguration('#sliderList', true);
        return $view;
    }
    
    /**
     * renders the order list modal for updating order status
     * @return \Zend\View\Model\ViewModel
     */
    public function renderModalFormAction()
    {
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');        
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        
        $view = new ViewModel();  
        $melisCoreConfig = $this->serviceLocator->get('MelisCoreConfig');
        $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/MelisTechnologySlider_slider_form','MelisTechnologySlider_slider_form');
        $factory = new \Zend\Form\Factory();
        $formElements = $this->serviceLocator->get('FormElementManager');
        $factory->setFormElementManager($formElements);
    
        $form = $factory->createForm($appConfigForm);
        if(!empty($sliderId)){
            $data = $sliderSvc->getSlider($sliderId);
            $form->setData((array) $data->getSlider());
        }
        
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        $view->form = $form;
        return $view;
    }
    
    public function renderTableListDataAction()
    {
        $success = 0;
        $colId = array();
        $dataCount = 0;
        $draw = 0;
        $dataFiltered = 0;
        $tableData = array();
        $langId = $this->getTool()->getCurrentLocaleID();
        
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        
        if($this->getRequest()->isPost()) {
            $colId = array_keys($this->getTool()->getColumns());
            
            $sortOrder = $this->getRequest()->getPost('order');
            $sortOrder = $sortOrder[0]['dir'];
    
            $selCol = $this->getRequest()->getPost('order');
            $selCol = $colId[$selCol[0]['column']];
            $colOrder = $selCol. ' ' . $sortOrder;
            $draw = (int) $this->getRequest()->getPost('draw');
    
            $start = (int) $this->getRequest()->getPost('start');
            $length =  (int) $this->getRequest()->getPost('length');
    
            $search = $this->getRequest()->getPost('search');
            $search = $search['value'];
    
            $postValues = $this->getRequest()->getPost();
            
            $tmp = $sliderSvc->getSliderList(null, null, null, $search);
           
            $dataFiltered = count($tmp);
    
            $sliders = $sliderSvc->getSliderList($start, $length, $colOrder, $search);
            
            $dataCount = count($sliders);
            $c = 0;
            foreach($sliders as $slider){
                $tableData[$c]['DT_RowId'] = $slider->getId();
                $tableData[$c]['mcslide_id'] = $slider->getSlider()->mcslide_id;
                $tableData[$c]['mcslide_name'] = $slider->getSlider()->mcslide_name;
                $tableData[$c]['mcslide_page_id'] = $slider->getSlider()->mcslide_page_id;
                
                $c++;
            }
    
    
        }
        return new JsonModel(array (
            'draw' => (int) $draw,
            'recordsTotal' => $dataCount,
            'recordsFiltered' =>  $dataFiltered,
            'data' => $tableData,
        ));
    }
    
    public function saveSliderAction()
    {
        $this->getEventManager()->trigger('meliscmsslider_add_slider_start', $this, array());
        $melisTool = $this->getServiceLocator()->get('MelisCoreTool');
        $sliderId = null;
        $response = array();
        $success = 0;
        $errors  = array();
        $data = array();
        $textMessage = 'tr_MelisCmsSliderDetails_save_fail';
        $textTitle = 'tr_MelisCmsSliderDetails_slider_save_Title';
        
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        
        if($this->getRequest()->isPost()){
            $postValues = get_object_vars($this->getRequest()->getPost());
            
            // Preparing Log type code
            if (!empty($postValues['mcslide_id'])){
                $logTypeCode = 'CMS_SLIDER_UPDATE';
            }else{
                $logTypeCode = 'CMS_SLIDER_ADD';
            }
            
            $melisCoreConfig = $this->serviceLocator->get('MelisCoreConfig');
            $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/MelisTechnologySlider_slider_form','MelisTechnologySlider_slider_form');
            $factory = new \Zend\Form\Factory();
            $formElements = $this->serviceLocator->get('FormElementManager');
            $factory->setFormElementManager($formElements);            
            $form = $factory->createForm($appConfigForm);
            
            $form->setData($postValues);
            if($form->isValid()){
                $data = $form->getData();
                $id = $data['mcslide_id'];
                $data['mcslide_page_id'] = empty($data['mcslide_page_id'])? NULL : $data['mcslide_page_id'];
                unset($data['mcslide_id']);
                
                $sliderId = $sliderSvc->saveSlider($data, $id);
                
                if($sliderId){
                    $textMessage = 'tr_MelisCmsSliderDetails_slider_save_success';
                    $success = 1;
                }
            }else{
                $errors = $form->getMessages();
                foreach ($errors as $keyError => $valueError)
                {
                    foreach ($appConfigForm['elements'] as $keyForm => $valueForm)
                    {                        
                        if ($valueForm['spec']['name'] == $keyError &&
                            !empty($valueForm['spec']['options']['label']))
                            $errors[$keyError]['label'] = $valueForm['spec']['options']['label'];
                    }
                }
            }
        }
        
        $response = array(
            'success' => $success,
            'textTitle' => $textTitle,
            'textMessage' => $textMessage,
            'errors' => $errors,
            'chunk' => $data,
        );
        
        $this->getEventManager()->trigger('meliscmsslider_add_slider_end', $this, array_merge($response, array('typeCode' => $logTypeCode, 'itemId' => $sliderId)));
        return new JsonModel($response);
    }
    
    public function deleteSliderAction()
    {
        $this->getEventManager()->trigger('meliscmsslider_delete_slider_start', $this, array());
        $sliderId = null;
        $response = array();
        $success = 0;
        $errors  = array();
        $data = array();
        $textMessage = 'tr_MelisCmsSliderDetails_slider_delete_fail';
        $textTitle = 'tr_MelisCmsSliderDetails_slider_save_Title';
        
        $melisSliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        $sliderDetailsTable = $this->getServiceLocator()->get('MelisCmsSliderDetailTable');
        $melisCoreConfig = $this->getServiceLocator()->get('MelisCoreConfig');
        
        $confSlidersUpload = $melisCoreConfig->getItem('MelisCmsSlider/conf/sliders');
        
        if($this->getRequest()->isPost()) {
            $postValues = get_object_vars($this->getRequest()->getPost());
            $sliderId = $postValues['sliderId'];
            $fileUploadPath = null;
            //attempt to delete files first before deleting db data
            $details = $sliderDetailsTable->getEntryByField('mcsdetail_mcslider_id', $postValues['sliderId']);
            foreach($details as $detail){
                $fileUploadPath = 'public'. $detail->mcsdetail_img;
                if(file_exists($fileUploadPath)) {                
                    if(is_readable($fileUploadPath) && is_writable($fileUploadPath)) {                
                        unlink($fileUploadPath);
                    }
                }
            }
            
            //remove emptied folder
            if(file_exists('public'.$confSlidersUpload['imagesPath'].$postValues['sliderId'])){
                rmdir('public'.$confSlidersUpload['imagesPath'].$postValues['sliderId']);
            }
            //delete db data
            if($melisSliderSvc->deleteSlider($sliderId)){
                $success = 1;
                $textMessage = 'tr_MelisCmsSliderDetails_slider_delete_success';
            }
        }
        
        $response = array(
            'success' => $success,
            'textTitle' => $textTitle,
            'textMessage' => $textMessage,
            'errors' => $errors,
            'chunk' => $data,
        );
        
        $this->getEventManager()->trigger('meliscmsslider_delete_slider_end', $this, array_merge($response, array('typeCode' => 'CMS_SLIDER_DELETE', 'itemId' => $sliderId)));
        return new JsonModel($response);
    }
    
    /**
     * Returns the Tool Service Class
     * @return MelisCoreTool
     */
    private function getTool()
    {
        $melisTool = $this->getServiceLocator()->get('MelisCoreTool');
        $melisTool->setMelisToolKey('MelisCmsSlider', 'MelisCmsSlider_list');
    
        return $melisTool;
    
    }
    
}
