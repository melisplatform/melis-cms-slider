<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Controller;

use Laminas\Validator\File\Extension;
use MelisCore\Controller\MelisAbstractActionController;
use MelisCore\Service\MelisCoreToolService;
use Laminas\File\Transfer\Adapter\Http;
use Laminas\Form\Factory;
use Laminas\Validator\File\IsImage;
use Laminas\Validator\File\Size;
use Laminas\View\Model\JsonModel;
use Laminas\View\Model\ViewModel;

class MelisCmsSliderDetailsController extends MelisAbstractActionController
{
    /**
     * renders the page container
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel render-coupon-page-tab-main
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
     * @return \Laminas\View\Model\ViewModel
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
            'serverSide' => 'false',
            'responsive' => array(
                'details' => array(
                    'type' => 'column'
                )
            ),
        );

        /**
         * rowReorder option for the fix: http://mantis.melistechnology.fr/view.php?id=4459
         * ::before / + button on mobile responsive doesn't show the other column details
         */
        if (!preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i', $_SERVER['HTTP_USER_AGENT']) || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i', substr($_SERVER['HTTP_USER_AGENT'], 0, 4))) {
            $defaultTblOptions['rowReorder'] = [
                'dataSrc' => 'mcsdetail_order',
                'selector' => 'td:nth-child(1)',
            ];
        }

        // if ($this->getTool()->isMobileDevice()) {
        //     $defaultTblOptions['rowReorder']['selector'] = "td:nth-child(2)";
        // }

        $view->tableColumns = $columns;
        $view->getToolDataTableConfig = $this->getTool()->getDataTableConfiguration('#'.$sliderId.'_sliderDetails', true, false, $defaultTblOptions);
        $view->melisKey = $melisKey;
        $view->sliderId = $sliderId;
        return $view;
    }

    /**
     * renders the order list modal container
     * @return \Laminas\View\Model\ViewModel
     */
    public function renderModalAction()
    {
        $id = $this->params()->fromQuery('id');
        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        $view->id = $id;
        $view->setTerminal(true);
        return $view;
    }

    /**
     * renders the order list modal for updating order status
     * @return \Laminas\View\Model\ViewModel
     */
    public function renderModalFormAction()
    {
        $sliderId = (int) $this->params()->fromQuery('sliderId', '');
        $detailId = (int) $this->params()->fromQuery('detailId', '');
        $view = new ViewModel();
        $data = array();
        $status = '';
        $sliderSvc = $this->getServiceManager()->get('MelisCmsSliderService');
        $details = $sliderSvc->getSliderDetails($detailId);
        $file = '';
        $melisCoreConfig = $this->getServiceManager()->get('MelisCoreConfig');
        $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/MelisTechnologySlider_details_form','MelisTechnologySlider_details_form');
        $factory = new Factory();
        $formElements = $this->getServiceManager()->get('FormElementManager');
        $factory->setFormElementManager($formElements);

        $form = $factory->createForm($appConfigForm);
        $title    = $this->getTool()->getTranslation('tr_MelisCmsSlider_detail_header_modal_add');
        if(!empty($detailId)){
            $sliderData = $sliderSvc->getSlider($sliderId)->getSlider();
            $siteId = $this->getSiteIdByPageId($sliderData->mcslide_page_id);
            // set site id for minitemplates
            $form->get('mcsdetail_sub2')->setOption('site_id', $siteId);
            $form->get('mcsdetail_sub3')->setOption('site_id', $siteId);
            $data = (array)$details;
            $file = $details->mcsdetail_img;
            $title = $this->getTool()->getTranslation('tr_MelisCmsSlider_list_header_modal_edit');
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
        $view->title = $title;
        $view->sliderId = $sliderId;
        $view->file = $file;
        $view->status = $status;
        return $view;
    }

    public function renderSelectSliderAction()
    {
        $newsId = (int) $this->params()->fromQuery('newsId', '');

        $melisCoreConfig = $this->getServiceManager()->get('MelisCoreConfig');
        $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/meliscmsslider_select_slider_form','meliscmsslider_select_slider_form');
        $factory = new Factory();
        $formElements = $this->getServiceManager()->get('FormElementManager');
        $factory->setFormElementManager($formElements);
        $form = $factory->createForm($appConfigForm);

        if(!empty($newsId)){
            $newsSvc = $this->getServiceManager()->get('MelisCmsNewsService');
            $data = $newsSvc->getNewsById($newsId);

            if (!empty($data) && is_array($data)) {
                $data = $data[0];
            }

            $form->setData((array) $data);
        }

        $view = new ViewModel();
        $melisKey = $this->params()->fromRoute('melisKey', '');

        $view->melisKey = $melisKey;
        $view->form = $form;
        return $view;
    }

    /*for CMS Blog use*/
    public function renderSelectSliderBlogAction()
    {        
        $blogId = (int) $this->params()->fromQuery('blogId', '');
        $melisCoreConfig = $this->getServiceManager()->get('MelisCoreConfig');
        $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/meliscmsslider_select_slider_blog_form','meliscmsslider_select_slider_blog_form');
        $factory = new Factory();
        $formElements = $this->getServiceManager()->get('FormElementManager');
        $factory->setFormElementManager($formElements);
        $form = $factory->createForm($appConfigForm);
        if(!empty($blogId)){
            $blogSvc = $this->getServiceManager()->get('MelisCmsBlogService');
            $data = $blogSvc->getBlogById($blogId);
            if (!empty($data) && is_array($data)) {
                $data = $data[0];
            }
            $form->setData((array) $data);
        }
        $view = new ViewModel();
        $view->setTemplate('melis-cms-slider/melis-cms-slider-details/render-select-slider');
        $melisKey = $this->params()->fromRoute('melisKey', '');
        $view->melisKey = $melisKey;
        $view->form = $form;
        return $view;
    }
    public function removeFileName($fileName)
    {
        $file = pathinfo($fileName, PATHINFO_FILENAME);

        $newFileName = $file;

        return $newFileName;
    }

    /**
     * @return JsonModel
     */
    public function saveDetailsFormAction()
    {
        $this->getEventManager()->trigger('meliscmsslider_save_details_start', $this, []);
        $melisTool = $this->getServiceManager()->get('MelisCoreTool');
        /** @var \MelisCmsSlider\Service\MelisCmsSliderService $melisSliderSvc */
        $melisSliderSvc = $this->getServiceManager()->get('MelisCmsSliderService');
        $melisSliderDetailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
        $sliderDetailsId = 0;
        $success = 0;
        $errors = [];
        $data = [];
        $textMessage = 'tr_MelisCmsSliderDetails_save_fail';
        $textTitle = 'tr_MelisCmsSliderDetails_save_title';
        $logTypeCode = 'CMS_SLIDER_DETAILS_UPDATE';

        if ($this->getRequest()->isPost()) {
            $postValues = $this->getRequest()->getPost()->toArray();

            // Cache the fields to be sanitized
            $sanitize = [
                'mcsdetail_title' => $postValues['mcsdetail_title'],
                'mcsdetail_sub1' => $postValues['mcsdetail_sub1'],
            ];
            $postValues = array_merge($postValues, $melisTool->sanitizePost($sanitize));

            if (empty($postValues['mcsdetail_id'])) {
                $logTypeCode = 'CMS_SLIDER_DETAILS_ADD';
            }

            $melisCoreConfig = $this->getServiceManager()->get('MelisCoreConfig');
            $appConfigForm = $melisCoreConfig->getFormMergedAndOrdered('MelisCmsSlider/forms/MelisTechnologySlider_details_form', 'MelisTechnologySlider_details_form');
            $factory = new Factory();
            $formElements = $this->getServiceManager()->get('FormElementManager');
            $factory->setFormElementManager($formElements);
            /** @var \Laminas\Form\Form $form */
            $form = $factory->createForm($appConfigForm);

            $confSlidersUpload = $melisCoreConfig->getItem('MelisCmsSlider/conf/sliders');
            $minSize = $confSlidersUpload['minUploadSize'];
            $maxSize = $confSlidersUpload['maxUploadSize'];
            $confSlidersPath = $confSlidersUpload['imagesPath'];

            $uploadedFile = $this->getRequest()->getFiles()->toArray()['mcsdetail_img'];
            $postValues = array_merge($postValues, $this->getRequest()->getFiles()->toArray());

            if (empty($uploadedFile['name'])) {
                $form->setData($postValues);

                if ($form->isValid()) {
                    $data = $form->getData();
                    $detailsId = $data['mcsdetail_id'];

                    if (empty($data['mcsdetail_order'])) {
                        $count = $melisSliderDetailTable->getLastOrderNum($data['mcsdetail_mcslider_id'])->current();
                        $data['mcsdetail_order'] = empty($count) ? 1 : $count->mcsdetail_order + 1;
                    }

                    unset($data['mcsdetail_id']);
                    unset($data['mcsdetail_img']);
                    $data['mcsdetail_status'] = $postValues['mcsdetail_status'];
                    $sliderDetailsId = $melisSliderSvc->saveSliderDetails($data, $detailsId);
                    if ($sliderDetailsId) {
                        $success = 1;
                        $textMessage = 'tr_MelisCmsSliderDetails_save_success';
                    }
                } else {
                    $errors = $form->getMessages();
                    foreach ($errors as $keyError => $valueError) {
                        foreach ($appConfigForm as $keyForm => $valueForm) {
                            if ($valueForm['spec']['name'] == $keyError &&
                                !empty($valueForm['spec']['options']['label']))
                                $errors[$keyError]['label'] = $valueForm['spec']['options']['label'];
                        }
                    }
                }
            } else {
                $fileName = $uploadedFile['name'];
                $size = new Size([
                    'min' => $minSize,
                    'max' => $maxSize,
                    'messages' => [
                        'fileSizeTooBig' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_too_big', [$this->formatBytes($maxSize)]),
                        'fileSizeTooSmall' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_too_small', [$this->formatBytes($minSize)]),
                        'fileSizeNotFound' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_file_does_not_exists'),
                    ]
                ]);

                $imageValidator = new IsImage([
                    'messages' => [
                        'fileIsImageFalseType' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_image_fileIsImageFalseType'),
                        'fileIsImageNotDetected' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_image_fileIsImageNotDetected'),
                        'fileIsImageNotReadable' => $this->getTool()->getTranslation('tr_MelisCmsSliderDetails_upload_image_fileIsImageNotReadable'),
                    ],
                ]);

                $validator = [$size, $imageValidator];

                //validate form
                $form->setData($postValues);

                if ($form->isValid()) {
                    $data = $form->getData();
                    if ($this->createFolder($data['mcsdetail_mcslider_id'])) {
                        $adapter = new Http();

                        // do saving
                        $adapter->setValidators($validator, $fileName);

                        if ($adapter->isValid()) {
                            $adapter->setDestination('public' . $confSlidersPath . $data['mcsdetail_mcslider_id'] . '/');
                            $newFileName = $this->renameIfDuplicateFile($confSlidersPath . $data['mcsdetail_mcslider_id'] . '/' . $fileName);
                            $savedDocFileName = 'public' . $newFileName;
                            $adapter->addFilter('Laminas\Filter\File\Rename', [
                                'target' => $savedDocFileName,
                                'overwrite' => true,
                            ]);

                            // if uploaded successfully
                            if ($adapter->receive()) {
                                $data['mcsdetail_img'] = $newFileName;
                                if (empty($data['mcsdetail_order'])) {
                                    $count = $melisSliderDetailTable->getLastOrderNum($data['mcsdetail_mcslider_id'])->current();
                                    $data['mcsdetail_order'] = empty($count) ? 1 : $count->mcsdetail_order + 1;
                                }

                                $detailsId = $data['mcsdetail_id'];
                                unset($data['mcsdetail_id']);
                                $data['mcsdetail_status'] = $postValues['mcsdetail_status'];

                                $sliderDetailsData = $melisSliderSvc->getSliderDetails($detailsId);
                                $sliderDetailsId = $melisSliderSvc->saveSliderDetails($data, $detailsId);

                                if ($sliderDetailsId) {
                                    if (!empty($sliderDetailsData)) {
                                        // if the file exists, delete the file after update
                                        if ($sliderDetailsData->mcsdetail_img && file_exists('public' . $sliderDetailsData->mcsdetail_img)) {
                                            unlink('public' . $sliderDetailsData->mcsdetail_img);
                                        }
                                    }
                                    $success = 1;
                                    $textMessage = 'tr_MelisCmsSliderDetails_save_success';
                                }
                            }
                        }
                    } else {
                        $textMessage = 'tr_MelisCmsSliderDetails_upload_path_rights_error';
                    }
                } else {
                    $errors = $form->getMessages();
                    foreach ($errors as $keyError => $valueError) {
                        foreach ($appConfigForm['elements'] as $keyForm => $valueForm)
                        {
                            if ($valueForm['spec']['name'] == $keyError &&
                                !empty($valueForm['spec']['options']['label']))
                                $errors[$keyError]['label'] = $valueForm['spec']['options']['label'];
                        }
                    }
                }
            }
        }

        $response = [
            'success' => $success,
            'textTitle' => $textTitle,
            'textMessage' => $textMessage,
            'errors' => $errors,
            'chunk' => $data,
        ];

        $this->getEventManager()->trigger(
            'meliscmsslider_save_details_end',
            $this,
            array_merge(
                $response,
                ['typeCode' => $logTypeCode, 'itemId' => $sliderDetailsId]
            )
        );

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
        $melisSliderSvc = $this->getServiceManager()->get('MelisCmsSliderService');

        if($this->getRequest()->isPost()) {
            $postValues = $this->getRequest()->getPost()->toArray();
            $sliderDetailsId = (int) $postValues['detailsId'];
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
        $this->getEventManager()->trigger('meliscmsslider_delete_details_end', $this, array_merge($response, array('typeCode' => 'CMS_SLIDER_DETAILS_DELETE', 'itemId' => $sliderDetailsId)));
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

        $sliderSvc = $this->getServiceManager()->get('MelisCmsSliderService');
        $img = '<img src="%s" width="50" height="auto">';
        if($this->getRequest()->isPost()) {
            $colId = array_keys($this->getTool()->getColumns());
            $sliderId = $this->getRequest()->getPost('sliderId');

            $sortOrder = $this->getRequest()->getPost('order');
//            $sortOrder = $sortOrder[0]['dir'];

            $selCol = $this->getRequest()->getPost('order');
//             $selCol = $colId[$selCol[0]['column']];
//             $colOrder = $selCol. ' ' . $sortOrder;
            $draw = (int) $this->getRequest()->getPost('draw');

            $start = (int) $this->getRequest()->getPost('start');
            $length =  (int) $this->getRequest()->getPost('length');

//            $search = $this->getRequest()->getPost('search');
//            $search = $search['value'];

            $postValues = $this->getRequest()->getPost();

            $tmp = $sliderSvc->getSlider($sliderId)->getSliderDetails();
            $dataFiltered = count($tmp);

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

        $sliderSvc = $this->getServiceManager()->get('MelisCmsSliderService');

        if($request->isPost()) {
            $postValues = $request->getPost()->toArray();

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
        $detailTable = $this->getServiceManager()->get('MelisCmsSliderDetailTable');
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
        $sliderSvc = $this->getServiceManager()->get('MelisCmsSliderService');
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
        $sliderSvc = $this->getServiceManager()->get('MelisCmsSliderService');
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
     * @return MelisCoreToolService
     */
    private function getTool()
    {
        $melisTool = $this->getServiceManager()->get('MelisCoreTool');
        $melisTool->setMelisToolKey('MelisCmsSlider', 'MelisCmsSlider_details');

        return $melisTool;

    }

    private function getSiteIdByPageId($pageId)
    {
        if ($pageId) {
            return $this->getServiceManager()->get('MelisEnginePage')->getDatasPage($pageId)->getMelisTemplate()->tpl_site_id ?? null;
        }
        return null;
    }
}
