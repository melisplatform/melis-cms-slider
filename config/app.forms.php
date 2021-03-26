<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

return [
    'plugins' => [
        'MelisCmsSlider' => [
            'forms' => [
                'MelisTechnologySlider_details_form' => [
                    'attributes' => [
                        'name' => 'sliderDetailsForm',
                        'id' => 'sliderDetailsForm',
                        'enctype' => "multipart/form-data",
                        'method' => 'POST',
                        'action' => '',
                    ],
                    'hydrator'  => 'Laminas\Hydrator\ArraySerializable',
                    'elements' => [
                        [
                            'spec' => [
                                'name' => 'mcsdetail_title',
                                'type' => 'MelisText',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_name',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_list_col_name tooltip',
                                ],
                                'attributes' => [
                                    'id' => 'mcsdetail_title',
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_sub1',
                                'type' => 'MelisText',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_sub1',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_list_col_sub1 tooltip',
                                ],
                                'attributes' => [
                                    'id' => 'mcsdetail_sub1',
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_sub2',
                                'type' => 'Textarea',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_desc1',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_list_col_desc1 tooltip',
                                    'templates' => '/melis/MelisCore/MelisTinyMce/getTinyTemplates',
                                    'site_id' => '',
                                    'prefix' => '',
                                ],
                                'attributes' => [
                                    'id' => 'mcsdetail_sub2',
                                    'meliscore-tinymce-textarea' => true
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_sub3',
                                'type' => 'Textarea',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_desc2',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_list_col_desc2 tooltip',
                                    'templates' => '/melis/MelisCore/MelisTinyMce/getTinyTemplates',
                                    'site_id' => '',
                                    'prefix' => '',
                                ],
                                'attributes' => [
                                    'id' => 'mcsdetail_sub3',
                                    'meliscore-tinymce-textarea' => true
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_link',
                                'type' => 'MelisText',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_link',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_list_col_link tooltip',
                                ],
                                'attributes' => [
                                    'id' => 'mcsdetail_link',
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_img',
                                'type' => 'file',
                                'attributes' => [
                                    'id' => 'mcsdetail_img',
                                    'value' => '',
                                    'class' => 'filestyle',
                                    'label' => 'Upload',
                                    //'required' => 'required',
                                ],
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_list_col_image',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_list_col_image tooltip',
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_id',
                                'type' => 'hidden',
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_mcslider_id',
                                'type' => 'hidden',
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcsdetail_order',
                                'type' => 'hidden',
                            ],
                        ],
                    ],
                    'input_filter' => [
                        'mcsdetail_id' => [
                            'name'     => 'mcsdetail_id',
                            'required' => false,
                            'validators' => [
                                [
                                    'name'    => 'IsInt',
                                    'options' => [
                                        'messages' => [
                                            \Laminas\I18n\Validator\IsInt::NOT_INT => 'tr_meliscms_tool_platform_not_digit',
                                            \Laminas\I18n\Validator\IsInt::INVALID => 'tr_meliscms_tool_platform_not_digit',
                                        ]
                                    ]
                                ],
                            ],
                            'filters' => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                        'mcsdetail_title' => [
                            'name'     => 'mcsdetail_title',
                            'required' => false,
                            'validators' => [
                                [
                                    'name'    => 'StringLength',
                                    'options' => [
                                        'encoding' => 'UTF-8',
                                        'max'      => 255,
                                        'messages' => [
                                            \Laminas\Validator\StringLength::TOO_LONG => 'tr_MelisTechnologyEditionsEditor_error_long',
                                        ],
                                    ],
                                ],
                            ],
                            'filters'  => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                        'mcsdetail_sub1' => [
                            'name'     => 'mcsdetail_sub1',
                            'required' => false,
                            'validators' => [
                                [
                                    'name'    => 'StringLength',
                                    'options' => [
                                        'encoding' => 'UTF-8',
                                        'max'      => 255,
                                        'messages' => [
                                            \Laminas\Validator\StringLength::TOO_LONG => 'tr_MelisTechnologyEditionsEditor_error_long',
                                        ],
                                    ],
                                ],
                            ],
                            'filters'  => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                        'mcsdetail_sub2' => [
                            'name'     => 'mcsdetail_sub2',
                            'required' => false,
                            'validators' => [
                            ],
                        ],
                        'mcsdetail_sub3' => [
                            'name'     => 'mcsdetail_sub3',
                            'required' => false,
                            'validators' => [
                            ],
                        ],
                        'mcsdetail_link' => [
                            'name'     => 'mcsdetail_link',
                            'required' => false,
                            'validators' => [
                            ],
                            'filters'  => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                        'mcsdetail_img' => [
                            'name'     => 'mcsdetail_img',
                            'required' => false,
                            'validators' => [
                            ],
                            'filters'  => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                    ],
                ],
                'MelisTechnologySlider_slider_form' => [
                    'attributes' => [
                        'name' => 'sliderForm',
                        'id' => 'sliderForm',
                        'method' => 'POST',
                        'action' => '',
                    ],
                    'hydrator'  => 'Laminas\Hydrator\ArraySerializable',
                    'elements' => [
                        [
                            'spec' => [
                                'name' => 'mcslide_name',
                                'type' => 'MelisText',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_slider_name',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_slider_name2 tooltip',
                                ],
                                'attributes' => [
                                    'id' => 'mcslide_name',
                                    'required' => 'required',
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcslide_page_id',
                                'type' => 'MelisText',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_slider_page_id',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_slider_page_id tooltip',
                                    'button' => 'fa fa-sitemap',
                                    'button-id' => 'generateInputFindPageTree',
                                ],
                                'attributes' => [
                                    'id' => 'mcslide_page_id',
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcslide_id',
                                'type' => 'hidden',
                            ],
                        ],
                    ],
                    'input_filter' => [
                        'mcslide_id' => [
                            'name'     => 'mcslide_id',
                            'required' => false,
                            'validators' => [
                                [
                                    'name'    => 'IsInt',
                                    'options' => [
                                        'messages' => [
                                            \Laminas\I18n\Validator\IsInt::NOT_INT => 'tr_meliscms_tool_platform_not_digit',
                                            \Laminas\I18n\Validator\IsInt::INVALID => 'tr_meliscms_tool_platform_not_digit',
                                        ]
                                    ]
                                ],
                            ],
                            'filters' => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                        'mcslide_name' => [
                            'name'     => 'mcslide_name',
                            'required' => true,
                            'validators' => [
                                [
                                    'name'    => 'StringLength',
                                    'options' => [
                                        'encoding' => 'UTF-8',
                                        'max'      => 255,
                                        'messages' => [
                                            \Laminas\Validator\StringLength::TOO_LONG => 'tr_MelisTechnologyEditionsEditor_error_long',
                                        ],
                                    ],
                                ],
                                [
                                    'name' => 'NotEmpty',
                                    'options' => [
                                        'messages' => [
                                            \Laminas\Validator\NotEmpty::IS_EMPTY => 'tr_MelisCmsSliderDetails_input_empty',
                                        ],
                                    ],
                                ],
                            ],
                            'filters'  => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                        'mcslide_page_id' => [
                            'name'     => 'mcslide_page_id',
                            'required' => false,
                            'validators' => [
                                [
                                    'name'    => '\Laminas\I18n\Validator\IsInt',
                                    'options' => [
                                        'messages'=> [
                                            \Laminas\I18n\Validator\IsInt::NOT_INT   => 'tr_MelisCmsSliderDetails_input_invalid_digit',
                                        ],
                                    ],
                                ],
                            ],
                            'filters'  => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                    ],
                ],
                'meliscmsslider_select_slider_form' => [
                    'attributes' => [
                        'name' => 'selectSliderForm',
                        'id' => 'selectSliderForm',
                        'method' => 'POST',
                        'action' => '',
                    ],
                    'hydrator'  => 'Laminas\Hydrator\ArraySerializable',
                    'elements' => [
                        [
                            'spec' => [
                                'name' => 'cnews_slider_id',
                                'type' => 'CmsSliderSelect',
                                'options' => [
                                    'label' => 'tr_MelisCmsSliderDetails_slider_name',
                                    'tooltip' => 'tr_MelisCmsSliderDetails_slider_name tooltip',
                                    'empty_option' => 'tr_meliscmsliderdetails_common_label_choose',
                                    'disable_inarray_validator' => true,
                                ],
                                'attributes' => [
                                    'id' => 'cnews_slider_id',
                                ],
                            ],
                        ],
                        [
                            'spec' => [
                                'name' => 'mcslide_id',
                                'type' => 'hidden',
                            ],
                        ],
                    ],
                    'input_filter' => [
                        'cnews_slider_id' => [
                            'name'     => 'cnews_slider_id',
                            'required' => false,
                            'validators' => [],
                            'filters'  => [
                                ['name' => 'StripTags'],
                                ['name' => 'StringTrim'],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
