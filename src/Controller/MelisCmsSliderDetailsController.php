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
use Zend\Validator\File\Size;
use Zend\Validator\File\IsImage;
use Zend\File\Transfer\Adapter\Http;

class MelisCmsSliderDetailsController extends AbstractActionController
{
    /**
     * renders the page container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderPageAction()
    {
        
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $this->setTableVariables($sliderId);        
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the page header container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderHeaderAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the page header left container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderHeaderLeftAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the page header right container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderHeaderRightAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the page header title
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderHeaderTitleAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->sliderName = $this->layout()->slider->mcslide_name;
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the page content container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderPageContentAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the page main content container
     * @return \Zend\View\Model\ViewModel render-coupon-page-tab-main
     */
    public function renderSliderPageTabsMainAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the tabs content header container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderTabsContentHeaderAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the tabs content header left container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderTabsContentHeaderLeftAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the tabs content header title
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderTabsContentHeaderTitleAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }

    /**
     * renders the tabs content header add button
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderTabsContentHeaderAddAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the tabs content details container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderTabsContentDetailsAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    public function renderSliderContentActionInfoAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    public function renderSliderContentActionDeleteAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the tabs content details main content
     * @return \Zend\View\Model\ViewModel
     */
    public function renderSliderTabsPropertiesDetailsMainAction()
    {
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $this->setTableVariables($sliderId);
        
        $columns = $this->getTool()->getColumns();
        $columns['actions'] = array('text'=> 'Action');
        $defaultTblOptions = array(
            'paging' => 'false',
            'searching' => 'false',
            'rowReorder' => array(
                'dataSrc' => 'mcsdetail_order',
                'selector' => 'td:nth-child(1)',
            ),
            'serverSide' => 'false',            
            'responsive' => array(
                'details' => array(
                    'type' => 'column'
                )
            )
        );
        
        $view->tableColumns = $columns;
        $view->getToolDataTableConfig = $this->getTool()->getDataTableConfiguration('#'.$sliderId.'_sliderDetails', true, false, $defaultTblOptions);
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }
    
    /**
     * renders the order list modal container
     * @return \Zend\View\Model\ViewModel
     */
    public function renderModalAction()
    {
        $id = $this->params()->fromQuery('id');
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        $view->id = $id;
        $view->setTerminal(false);
        return $view;
    }
    
    /**
     * renders the order list modal for updating order status
     * @return \Zend\View\Model\ViewModel
     */
    public function renderModalFormAction()
    {
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $detailId = (int) $this->params()->fromQuery('detailId', '');
        $view = new ViewModel();
        $data = array();
        $status = '';
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        $details = $sliderSvc->getSliderDetails($detailId);
        $file = '';
        $melisCoreConfig = $this->serviceLocator->get('MelisCoreConfig');
        $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/MelisTechnologySlider_details_form','MelisTechnologySlider_details_form');
        $factory = new \Zend\Form\Factory();
        $formElements = $this->serviceLocator->get('FormElementManager');
        $factory->setFormElementManager($formElements);
    
        $form = $factory->createForm($appConfigForm);
    
        if(!empty($detailId)){          
            $data = (array)$details;
            $file = $details->mcsdetail_img;
            if($data['mcsdetail_status']){
                $status = 'checked';
            }
        }else{
            $data = array('mcsdetail_mcslider_id' => $sliderId);
        }
        $form->setData($data);        
        
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        $view->form = $form;
        $view->sliderId = $sliderId;
        $view->file = $file;
        $view->status = $status;
        return $view;
    }
    
    public function renderSelectSliderAction()
    {
        $newsId = (int) $this->params()->fromQuery('newsId', '');
        
        $melisCoreConfig = $this->serviceLocator->get('MelisCoreConfig');
        $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/meliscmsslider_select_slider_form','meliscmsslider_select_slider_form');
        $factory = new \Zend\Form\Factory();
        $formElements = $this->serviceLocator->get('FormElementManager');
        $factory->setFormElementManager($formElements);
        $form = $factory->createForm($appConfigForm);
        
        if(!empty($newsId)){
            $newsSvc = $this->getServiceLocator()->get('MelisCmsNewsService');
            $data = $newsSvc->getNewsById($newsId);
            $form->setData((array) $data);
        }
        
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        
        $view->melisKey = $melisKey;
        $view->form = $form;
        return $view;
    }
    
    public function saveDetailsFormAction()
    {
        $this->getEventManager()->trigger('meliscmsslider_save_details_start', $this, array());
        $melisTool = $this->getServiceLocator()->get('MelisCoreTool');
        $melisSliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        $melisSliderDetailTable = $this->getServiceLocator()->get('MelisCmsSliderDetailTable');
        $sliderDetailsId = null;
        $response = array();
        $success = 0;
        $errors  = array();
        $data = array();
        $textMessage = 'tr_MelisCmsSliderDetails_save_fail';
        $textTitle = 'tr_MelisCmsSliderDetails_save_title';
        
        $melisCoreConfig = $this->getServiceLocator()->get('MelisCoreConfig');
        $melisCoreConfig = $this->serviceLocator->get('MelisCoreConfig');
        $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/MelisTechnologySlider_details_form','MelisTechnologySlider_details_form');
        $factory = new \Zend\Form\Factory();
        $formElements = $this->serviceLocator->get('FormElementManager');
        $factory->setFormElementManager($formElements);
        
        $form = $factory->createForm($appConfigForm);
        
        $postValues = get_object_vars($this->getRequest()->getPost());
        
        if($this->getRequest()->isPost()){
            $postValues = get_object_vars($this->getRequest()->getPost());           
            
            if (!empty($data['mcsdetail_id'])){
                $logTypeCode = 'CMS_SLIDER_DETAILS_UPDATE';
            }else{
                $logTypeCode = 'CMS_SLIDER_DETAILS_ADD';
            }
            
            $confSlidersUpload = $melisCoreConfig->getItem('MelisCmsSlider/conf/sliders');
            $minSize = $confSlidersUpload['minUploadSize'];
            $maxSize = $confSlidersUpload['maxUploadSize'];
            $confSlidersPath = $confSlidersUpload['imagesPath'];
            
            $uploadedFile = $this->getRequest()->getFiles()->toArray()['mcsdetail_img'];
            if(!empty($uploadedFile['name'])){                
                
                $fileName = $uploadedFile['name'];
                $formattedFileName = $this->getFormattedFileName($fileName);
                
                $size = new Size(array(
                    'min'=> $minSize,
                    'max' => $maxSize,
                    'messages' => array(
                        'fileSizeTooBig' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_too_big', array($this->formatBytes($maxSize))),
                        'fileSizeTooSmall' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_too_small', array($this->formatBytes($minSize))),
                        'fileSizeNotFound' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_file_does_not_exists'),
                    )
                ));
                
                $imageValidator = new IsImage(array(
                    'messages' => array(
                        'fileIsImageFalseType' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_image_fileIsImageFalseType'),
                        'fileIsImageNotDetected' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_image_fileIsImageNotDetected'),
                        'fileIsImageNotReadable' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_image_fileIsImageNotReadable'),
                    ),
                ));
                
                $validator = array($size, $imageValidator);
                
                //validate form
                $form->setData($postValues);
                
                if($form->isValid()) {
                    $data = $form->getData();
                    if($this->createFolder($data['mcsdetail_mcslider_id'])) {
                        $adapter = new Http();
                
                        // do saving
                        $adapter->setValidators($validator, $fileName);
                
                        if($adapter->isValid()){
                            $adapter->setDestination('public' . $confSlidersPath.$data['mcsdetail_mcslider_id'].'/');
                            $newFileName = $this->renameIfDuplicateFile($confSlidersPath .$data['mcsdetail_mcslider_id'].'/'. $fileName);
                            $savedDocFileName =  'public'.$newFileName;
                            $adapter->addFilter('File\Rename', array(
                                'target' => $savedDocFileName,
                                'overwrite' => true,
                            ));
                
                            // if uploaded successfully
                            if($adapter->receive()) {
                               
                                $data['mcsdetail_img'] = $newFileName;                                
                                if(empty($data['mcsdetail_order'])){
                                    $count = $melisSliderDetailTable->getLastOrderNum($data['mcsdetail_mcslider_id'])->current();
                                    $data['mcsdetail_order'] = empty($count)? 1 : $count->mcsdetail_order+1;
                                } 
                                
                                $detailsId = $data['mcsdetail_id'];
                                unset($data['mcsdetail_id']);
                                $data['mcsdetail_status'] = $postValues['mcsdetail_status'];
                                
                                $sliderDetailsId = $melisSliderSvc->saveSliderDetails($data, $detailsId);
                                if($sliderDetailsId) {
                                    $success = 1;
                                    $textMessage = 'tr_MelisCmsSliderDetails_save_success';
                                }
                            }
                        }
                    }else{
                        $textMessage = 'tr_MelisCmsSliderDetails_upload_path_rights_error';
                    }
                }else{
                    $errors = $form->getMessages();
                    foreach ($errors as $keyError => $valueError)
                    {
                        foreach ($appConfigForm as $keyForm => $valueForm)
                        {
                            if ($valueForm['spec']['name'] == $keyError &&
                                !empty($valueForm['spec']['options']['label']))
                                $errors[$keyError]['label'] = $valueForm['spec']['options']['label'];
                        }
                    }
                }
                
            }else{
                $form->setData($postValues);
                
                if($form->isValid()) {
                    $data = $form->getData();
                    $detailsId = $data['mcsdetail_id'];
                    if(empty($data['mcsdetail_order'])){
                        $count = $melisSliderDetailTable->getLastOrderNum($data['mcsdetail_mcslider_id'])->current();
                        $data['mcsdetail_order'] = empty($count)? 1 : $count->mcsdetail_order+1;
                    }                    
                    
                    unset($data['mcsdetail_id']);
                    unset($data['mcsdetail_img']);
                    $data['mcsdetail_status'] = $postValues['mcsdetail_status'];
                    if($melisSliderSvc->saveSliderDetails($data, $detailsId)) {
                        $success = 1;
                        $textMessage = 'tr_MelisCmsSliderDetails_save_success';
                    }
                }else{
                    $errors = $form->getMessages();
                    foreach ($errors as $keyError => $valueError)
                    {
                        foreach ($appConfigForm as $keyForm => $valueForm)
                        {
                            if ($valueForm['spec']['name'] == $keyError &&
                                !empty($valueForm['spec']['options']['label']))
                                $errors[$keyError]['label'] = $valueForm['spec']['options']['label'];
                        }
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
        $this->getEventManager()->trigger('meliscmsslider_save_details_end', $this, array_merge($response, array('typeCode' => $logTypeCode, 'itemId' => $sliderDetailsId)));
        return new JsonModel($response);
    }
    
    public function deleteDetailsAction()
    {
        
        $this->getEventManager()->trigger('meliscmsslider_delete_details_start', $this, array());
        $sliderDetailsId = null;
        $response = array();
        $success = 0;
        $errors  = array();
        $data = array();
        $textMessage = 'tr_MelisCmsSliderDetails_delete_fail';
        $textTitle = 'tr_MelisCmsSliderDetails_delete_Title';
        $melisSliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        
        if($this->getRequest()->isPost()) {
            $postValues = get_object_vars($this->getRequest()->getPost());
            $sliderDetailsId = $postValues['detailsId'];
            $tmp = $melisSliderSvc->getSliderDetails($sliderDetailsId);
            if($melisSliderSvc->deleteSliderDetails($sliderDetailsId)){
                $success = 1;
                $this->reOrder($tmp->mcsdetail_mcslider_id);
                $textMessage = 'tr_MelisCmsSliderDetails_delete_success';
                $fileUploadPath = 'public'.$tmp->mcsdetail_img;
               
                if(file_exists($fileUploadPath) && !empty($tmp->mcsdetail_img) ) {
                    
                    if(is_readable($fileUploadPath) && is_writable($fileUploadPath)) {    
                        chmod($fileUploadPath, 0777);
                        unlink($fileUploadPath);
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
        $this->getEventManager()->trigger('meliscmsslider_delete_details_end', $this, array_merge($response, array('typeCode' => 'DELETE_MC_SLIDER_DETAILS', 'itemId' => $sliderDetailsId)));
        return new JsonModel($response);
    }
    
    public function renderTableListDataAction()
    {
        $success = 0;
        $colId = array();
        $dataCount = 0;
        $draw = 0;
        $dataFiltered = 0;
        $tableData = array();
        
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        $img = '<img src="%s" width="50" height="50">';
        if($this->getRequest()->isPost()) {
            $colId = array_keys($this->getTool()->getColumns());
            $sliderId = $this->getRequest()->getPost('sliderId');
            
            $sortOrder = $this->getRequest()->getPost('order');
            $sortOrder = $sortOrder[0]['dir'];
            
            $selCol = $this->getRequest()->getPost('order');
//             $selCol = $colId[$selCol[0]['column']];
//             $colOrder = $selCol. ' ' . $sortOrder;
            $draw = (int) $this->getRequest()->getPost('draw');
            
            $start = (int) $this->getRequest()->getPost('start');
            $length =  (int) $this->getRequest()->getPost('length');
            
            $search = $this->getRequest()->getPost('search');
            $search = $search['value'];
            
            $postValues = $this->getRequest()->getPost();
            
            $tmp = $sliderSvc->getSlider($sliderId)->getSliderDetails();
            $dataFiltered = count($tmp);
//             echo '<pre>';
//             print_r($tmp->getSliderDetails());
//             echo '</pre>';
//             die();
            $tabelList = $sliderSvc->getSlider($sliderId)->getSliderDetails();
            $dataCount = count($tabelList);
            $c = 0;
            foreach($tabelList as $table){
                $details = $table;
                if($details->mcsdetail_status){                    
                    $status = '<span class="text-success"><i class="fa fa-fw fa-circle"></i></span>';
                }else{
                    $status = '<span class="text-danger"><i class="fa fa-fw fa-circle"></i></span>';
                }
                
                $title =  !empty($details->mcsdetail_title)? $this->getTool()->limitedText($details->mcsdetail_title, 30) : '&nbsp;';
                $sub1  =  !empty($details->mcsdetail_sub1)? $this->getTool()->limitedText($details->mcsdetail_sub1, 30): '&nbsp;';
                $sub2  =  !empty($details->mcsdetail_sub2)? $this->getTool()->limitedText($details->mcsdetail_sub2, 30): '&nbsp;';
                $sub3  =  !empty($details->mcsdetail_sub3)? $this->getTool()->limitedText($details->mcsdetail_sub3, 30): '&nbsp;';
                $link  =  !empty($details->mcsdetail_link)? $this->getTool()->limitedText($details->mcsdetail_link, 30): '&nbsp;';
                $image  =  !empty($details->mcsdetail_img)? sprintf($img, $details->mcsdetail_img): '&nbsp;';
                
                $tableData[$c]['DT_RowId']          = $details->mcsdetail_id;
                $tableData[$c]['DT_RowAttr']        = array('data-sliderid' => $sliderId);
                $tableData[$c]['DT_RowClass']       = 'is-draggable';
                $tableData[$c]['mcsdetail_order']   = $details->mcsdetail_order;
                $tableData[$c]['mcsdetail_id']      = $details->mcsdetail_id;
                $tableData[$c]['mcsdetail_status']  = $status;
                $tableData[$c]['mcsdetail_title']   = $title;
                $tableData[$c]['mcsdetail_sub1']    = $sub1;
                $tableData[$c]['mcsdetail_sub2']    = $sub2;
                $tableData[$c]['mcsdetail_sub3']    = $sub3;
                $tableData[$c]['mcsdetail_link']    = $link;
                $tableData[$c]['mcsdetail_img']     = $image;
                
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
    
    public function reOrderSliderDetailsAction()
    {
        $request = $this->getRequest();
        // Default Values
        $errors = array();
        $status  = 0;
        $textTitle = '';
        $textMessage = '';
        
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');

        if($request->isPost()) {
            $postValues = get_object_vars($request->getPost());

            $sliderOrder = explode(',', $postValues['sliderOrderData']);

            foreach ($sliderOrder As $val){
                $sliderOrderTmp = explode('-', $val);
                // Saving new Product Order
                $sliderSvc->updateSliderDetailsOrdering($sliderOrderTmp[0], ($sliderOrderTmp[1] + 1));
            }

            $status = 1;
        }

        $response = array(
            'success' => $status,
            'textTitle' => $textTitle,
            'textMessage' => $textMessage,
            'errors' => $errors,
        );

        return new JsonModel($response);
    }
    
    public function getFormattedFileName($fileName)
    {
        $file = pathinfo($fileName, PATHINFO_FILENAME);
        $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
        $newFileName = $file;
    
        return $newFileName;
    }
    
    public function renameIfDuplicateFile($filePath)
    {
        $detailTable = $this->getServiceLocator()->get('MelisCmsSliderDetailTable');
        $docData = $detailTable->getEntryByFieldUsingLike('mcsdetail_img', pathinfo($filePath, PATHINFO_DIRNAME).'/'.pathinfo($filePath, PATHINFO_FILENAME))->toArray();
        
        $totalFile = count($docData) ? '_' .count($docData) : null;
        $fileDir = pathinfo($filePath, PATHINFO_DIRNAME);
        $fileName = pathinfo($filePath, PATHINFO_FILENAME) . $totalFile;
        // replace space with underscores
        $fileName = str_replace(' ', '_', $fileName);
        $fileExt  = pathinfo($filePath, PATHINFO_EXTENSION) ? '.' . pathinfo($filePath, PATHINFO_EXTENSION) : '';
        $newFilePathAndName = $fileDir . '/'. $fileName . $fileExt;
    
        return $newFilePathAndName;
    
    }
    
    /**
    * Re orders the slider details
    * @param int $sliderId
    */
   private function reOrder($sliderId)
    {
        $data = array();
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        $details = $sliderSvc->getSlider($sliderId)->getSliderDetails();
        $i = 1;
        foreach($details as $detail){
        $data['mcsdetail_order'] = $i;
        $sliderSvc->saveSliderDetails($data, $detail->mcsdetail_id);
        $i++;
        }
    }
    
    private function formatBytes($bytes) {
        $size = $bytes;
        $units = array( 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
        $power = $size > 0 ? floor(log($size, 1024)) : 0;
        return round(number_format($size / pow(1024, $power), 2, '.', ',')) . ' ' . $units[$power];
    }
    
    /**
     * Creates a folder inside "public/media/commerce" with full permission (for now)
     * @param String $folderType, enum: category, product, variant
     * @param int $folderId
     * @return bool
     */
    private function createFolder($id)
    {
        $status = false;
        $path = 'public/media/sliders/'.$id.'/';
        if(file_exists($path)) {
//             chmod ( $path , 0777 );
            $status = true;
        }
        else {
            $status = mkdir($path, 0777, true);
            $this->createFolder($id);
        }
    
        return $status;
    }
    
    
    /**
     * sets the coupon data to the layout
     * @param unknown $couponId
     */
    private function setTableVariables($sliderId)
    {
        $layoutVar = array();
        $sliderSvc = $this->getServiceLocator()->get('MelisCmsSliderService');
        if($sliderId){
            $resultData = $sliderSvc->getSlider($sliderId);
            $layoutVar['slider'] = $resultData->getSlider();
            $layoutVar['sliderDetails'] = $resultData->getSliderDetails();
        }
        $this->layout()->setVariables( array_merge( array(
            'sliderId' => $sliderId,
        ), $layoutVar));
    }
    
    /**
     * Returns the Tool Service Class
     * @return MelisCoreTool
     */
    private function getTool()
    {
        $melisTool = $this->getServiceLocator()->get('MelisCoreTool');
        $melisTool->setMelisToolKey('MelisCmsSlider', 'MelisCmsSlider_details');
    
        return $melisTool;
    
    }
}
