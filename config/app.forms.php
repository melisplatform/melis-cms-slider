<?php
return array(
    'plugins' => array(
        'MelisCmsSlider' => array(
            'forms' => array(
                'MelisTechnologySlider_details_form' => array(
                    'attributes' => array(
                        'name' => 'sliderDetailsForm',
                        'id' => 'sliderDetailsForm',
                        'enctype' => "multipart/form-data",
                        'method' => 'POST',
                        'action' => '',
                    ),
                    'hydrator'  => 'Zend\Stdlib\Hydrator\ArraySerializable',
                    'elements' => array(
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_title',
                                'type' => 'MelisText',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_name',
                                ),
                                'attributes' => array(
                                    'id' => 'mcsdetail_title',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_sub1',
                                'type' => 'MelisText',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_sub1',
                                ),
                                'attributes' => array(
                                    'id' => 'mcsdetail_sub1',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_sub2',
                                'type' => 'MelisText',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_sub2',
                                ),
                                'attributes' => array(
                                    'id' => 'mcsdetail_sub2',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_sub3',
                                'type' => 'MelisText',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_sub3',
                                ),
                                'attributes' => array(
                                    'id' => 'mcsdetail_sub3',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_link',
                                'type' => 'MelisText',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_link',
                                ),
                                'attributes' => array(
                                    'id' => 'mcsdetail_link',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_img',
                                'type' => 'file',
                                'attributes' => array(
                                    'id' => 'mcsdetail_img',
                                    'value' => '',
                                    'class' => 'filestyle',
                                    'label' => 'Upload',
                                    //'required' => 'required',
                                ),
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_image',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_id',
                                'type' => 'hidden',
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_mcslider_id',
                                'type' => 'hidden',
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcsdetail_order',
                                'type' => 'hidden',
                            ),
                        ),
                    ),
                    'input_filter' => array(
                        'mcsdetail_title' => array(
                            'name'     => 'mcsdetail_title',
                            'required' => false,
                            'validators' => array(
                                array(
                                    'name'    => 'StringLength',
                                    'options' => array(
                                        'encoding' => 'UTF-8',
                                        'max'      => 255,
                                        'messages' => array(
                                            \Zend\Validator\StringLength::TOO_LONG => 'tr_MelisTechnologyEditionsEditor_error_long',
                                        ),
                                    ),
                                ),
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                        'mcsdetail_sub1' => array(
                            'name'     => 'mcsdetail_sub1',
                            'required' => false,
                            'validators' => array(
                                array(
                                    'name'    => 'StringLength',
                                    'options' => array(
                                        'encoding' => 'UTF-8',
                                        'max'      => 255,
                                        'messages' => array(
                                            \Zend\Validator\StringLength::TOO_LONG => 'tr_MelisTechnologyEditionsEditor_error_long',
                                        ),
                                    ),
                                ),
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                        'mcsdetail_sub2' => array(
                            'name'     => 'mcsdetail_sub2',
                            'required' => false,
                            'validators' => array(
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                        'mcsdetail_sub3' => array(
                            'name'     => 'mcsdetail_sub3',
                            'required' => false,
                            'validators' => array(
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                        'mcsdetail_link' => array(
                            'name'     => 'mcsdetail_link',
                            'required' => false,
                            'validators' => array(
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                        'mcsdetail_img' => array(
                            'name'     => 'mcsdetail_img',
                            'required' => false,
                            'validators' => array(
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                    ),
                ),
                'MelisTechnologySlider_slider_form' => array(
                    'attributes' => array(
                        'name' => 'sliderForm',
                        'id' => 'sliderForm',
                        'method' => 'POST',
                        'action' => '',
                    ),
                    'hydrator'  => 'Zend\Stdlib\Hydrator\ArraySerializable',
                    'elements' => array(
                        array(
                            'spec' => array(
                                'name' => 'mcslide_name',
                                'type' => 'MelisText',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_slider_name',
                                ),
                                'attributes' => array(
                                    'id' => 'mcsdetail_title',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcslide_page_id',
                                'type' => 'MelisText',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_slider_page_id',
                                ),
                                'attributes' => array(
                                    'id' => 'mcsdetail_title',
                                ),
                            ),
                        ),
                        array(
                            'spec' => array(
                                'name' => 'mcslide_id',
                                'type' => 'hidden',
                            ),
                        ),
                    ),
                    'input_filter' => array(
                        'mcslide_name' => array(
                            'name'     => 'mcslide_name',
                            'required' => false,
                            'validators' => array(
                                array(
                                    'name'    => 'StringLength',
                                    'options' => array(
                                        'encoding' => 'UTF-8',
                                        'max'      => 255,
                                        'messages' => array(
                                            \Zend\Validator\StringLength::TOO_LONG => 'tr_MelisTechnologyEditionsEditor_error_long',
                                        ),
                                    ),
                                ),
                                array(
                                    'name' => 'NotEmpty',
                                    'options' => array(
                                        'messages' => array(
                                            \Zend\Validator\NotEmpty::IS_EMPTY => 'tr_MelisTechnologyEditionsEditor_input_empty',
                                        ),
                                    ),
                                ),
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                        'mcslide_page_id' => array(
                            'name'     => 'mcslide_page_id',
                            'required' => false,
                            'validators' => array(
                                array(
                                    'name'    => '\Zend\I18n\Validator\IsInt',
                                    'options' => array(
                                        'messages'=> array(
                                            \Zend\I18n\Validator\IsInt::NOT_INT   => 'tr_MelisCmsSliderDetails_input_invalid_digit',
                                        ),
                                    ),
                                ),
                            ),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                    ),
                ),
                'meliscmsslider_select_slider_form' => array(
                    'attributes' => array(
                        'name' => 'selectSliderForm',
                        'id' => 'selectSliderForm',
                        'method' => 'POST',
                        'action' => '',
                    ),
                    'hydrator'  => 'Zend\Stdlib\Hydrator\ArraySerializable',
                    'elements' => array(
                        array(
                            'spec' => array(
                                'name' => 'cnews_slider_id',
                                'type' => 'CmsSliderSelect',
                                'options' => array(
                                    'label' => 'tr_MelisCmsSliderDetails_slider_name',
                                    'empty_option' => 'tr_meliscmsliderdetails_common_label_choose',
                                    'disable_inarray_validator' => true,
                                ),
                                'attributes' => array(
                                    'id' => 'cnews_slider_id',
                                ),
                            ),
                        ),                       
                        array(
                            'spec' => array(
                                'name' => 'mcslide_id',
                                'type' => 'hidden',
                            ),
                        ),
                    ),
                    'input_filter' => array(
                        'cnews_slider_id' => array(
                            'name'     => 'cnews_slider_id',
                            'required' => false,
                            'validators' => array(),
                            'filters'  => array(
                                array('name' => 'StripTags'),
                                array('name' => 'StringTrim'),
                            ),
                        ),
                    ),
                ),
            ),            
        ),
    ),
);
