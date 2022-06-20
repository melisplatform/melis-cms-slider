<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

return [
    'plugins' => [
        'meliscore' => [
            'datas' => [],
            'interface' => [
                'meliscore_leftmenu' => [
                    'interface' => [
                        'meliscms_toolstree_section' => [
                            'interface' => [
                                'melis_cms_slider_tool' => [
                                    'conf' => [
                                        'id' => 'id_melis_cms_slider_tool',
                                        'name' => 'tr_MelisCmsSlider_manager',
                                        'icon' => 'fa-image',
                                        'rights_checkbox_disable' => true,
                                        'melisKey' => 'melis_cms_slider_tool'
                                    ],
                                    'interface' => [
                                        'MelisCmsSlider_left' => [
                                            'conf' => [
                                                'id' => 'id_meliscms_slider_tools_section',
                                                'name' => 'tr_MelisCmsSlider_manager',
                                                'icon' => 'fa-image',
                                                'rights_checkbox_disable' => false,
                                                'melisKey' => 'meliscms_slider_tools_section',
                                                'type' => '/MelisCmsSlider/interface/MelisCmsSlider_list/interface/MelisCmsSlider_left_menu',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
//        'meliscore_dashboard' => [],
        'MelisCmsSlider' => [
            'conf' => [
                'id' => '',
                'name' => 'tr_MelisCmsSlider_manager',
                'rightsDisplay' => 'none',
                'sliders' => [
                    'minUploadSize' => 1,
                    'maxUploadSize' => 10500000,
                    'imagesPath' => '/media/sliders/',
                ],
            ],
            'ressources' => [
                'js' => [
                    '/MelisCmsSlider/js/tools/slider.tool.js',
                    '/MelisCmsSlider/assets/switch/bootstrap-switch.js',
                ],

                'css' => [
                    '/MelisCmsSlider/css/sliders.css',
                ],
                /**
                 * the "build" configuration compiles all assets into one file to make
                 * lesser requests
                 */
                'build' => [
                    // lists of assets that will be loaded in the layout
                    'css' => [
                        '/MelisCmsSlider/build/css/bundle.css',

                    ],
                    'js' => [
                        '/MelisCmsSlider/build/js/bundle.js',
                    ]
                ]
            ],
            'datas' => [

            ],
            'interface' => [
                'MelisCmsSlider_list' => [

                    'conf' => [
                        'name' => 'tr_MelisCmsSlider_manager',
                        'rightsDisplay' => 'referencesonly',
                    ],
                    'interface' => [
                        'MelisCmsSlider_left_menu' => [
                            'conf' => [
                                'id' => 'id_MelisCmsSlider_list',
                                'name' => 'tr_MelisCmsSlider_manager',
                                'melisKey' => 'MelisCmsSlider_left_menu',
                                'icon' => 'fa-columns',
                                'rights_checkbox_disable' => true,
                                'follow_regular_rendering' => false,
                            ],
                            'forward' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-page',
                                'jscallback' => '',
                                'jsdatas' => []
                            ],
                            'interface' => [
                                'MelisCmsSlider_list_header' => [
                                    'conf' => [
                                        'id' => 'id_MelisCmsSlider_list_header',
                                        'melisKey' => 'MelisCmsSlider_list_header',
                                        'name' => 'tr_MelisCmsSlider_list_header',
                                    ],
                                    'forward' => [
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderList',
                                        'action' => 'render-table-list-header',
                                    ],
                                    'interface' => [
                                        'MelisCmsSlider_list_header_left' => [
                                            'conf' => [
                                                'id' => 'id_MelisCmsSlider_list_header_left',
                                                'melisKey' => 'MelisCmsSlider_list_header_left',
                                                'name' => 'tr_MelisCmsSlider_list_header_left',
                                            ],
                                            'forward' => [
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderList',
                                                'action' => 'render-table-list-header-left',
                                            ],
                                            'interface' => [
                                                'MelisCmsSlider_list_header_title' => [
                                                    'conf' => [
                                                        'id' => 'id_MelisCmsSlider_list_header_title',
                                                        'melisKey' => 'MelisCmsSlider_list_header_title',
                                                        'name' => 'tr_MelisCmsSlider_list_header_title',
                                                    ],
                                                    'forward' => [
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderList',
                                                        'action' => 'render-table-list-header-title',
                                                    ],
                                                ],
                                            ],
                                        ],
                                        'MelisCmsSlider_list_header_right' => [
                                            'conf' => [
                                                'id' => 'id_MelisCmsSlider_list_header_right',
                                                'melisKey' => 'MelisCmsSlider_list_header_right',
                                                'name' => 'tr_MelisCmsSlider_list_header_right',
                                            ],
                                            'forward' => [
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderList',
                                                'action' => 'render-table-list-header-right',
                                            ],
                                            'interface' => [
                                                'MelisCmsSlider_list_header_right_add' => [
                                                    'conf' => [
                                                        'id' => 'id_MelisCmsSlider_list_header_right_add',
                                                        'melisKey' => 'MelisCmsSlider_list_header_right_add',
                                                        'name' => 'tr_MelisCmsSlider_list_header_right_add',
                                                    ],
                                                    'forward' => [
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderList',
                                                        'action' => 'render-table-list-header-right-add',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                'MelisCmsSlider_list_content' => [
                                    'conf' => [
                                        'id' => 'id_MelisCmsSlider_list_content',
                                        'melisKey' => 'MelisCmsSlider_list_content',
                                        'name' => 'tr_MelisCmsSlider_list_content',
                                    ],
                                    'forward' => [
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderList',
                                        'action' => 'render-table-list-content',
                                    ],
                                    'interface' => [
                                        'MelisCmsSlider_list_content_table' => [
                                            'conf' => [
                                                'id' => 'id_MelisCmsSlider_list_content_table',
                                                'melisKey' => 'MelisCmsSlider_list_content_table',
                                                'name' => 'tr_MelisCmsSlider_list_content_table',
                                            ],
                                            'forward' => [
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderList',
                                                'action' => 'render-table-list-content-table',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                'MelisCmsSlider' => [
                    'interface' => [
                        'MelisCmsSlider_page' => [
                            'conf' => [
                                'id' => 'id_MelisCmsSlider_page',
                                'melisKey' => 'MelisCmsSlider_page',
                                'name' => 'tr_MelisCmsSlider_page',
                            ],
                            'forward' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-slider-page',
                            ],
                            'interface' => [
                                'MelisCmsSlider_header' => [
                                    'conf' => [
                                        'id' => 'id_MelisCmsSlider_header',
                                        'melisKey' => 'MelisCmsSlider_header',
                                        'name' => 'tr_MelisCmsSlider_header',
                                    ],
                                    'forward' => [
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderDetails',
                                        'action' => 'render-slider-header',
                                    ],
                                    'interface' => [
                                        'MelisCmsSlider_header_left' => [
                                            'conf' => [
                                                'id' => 'id_MelisCmsSlider_header_left',
                                                'melisKey' => 'MelisCmsSlider_header_left',
                                                'name' => 'tr_MelisCmsSlider_header_left',
                                            ],
                                            'forward' => [
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderDetails',
                                                'action' => 'render-slider-header-left',
                                            ],
                                            'interface' => [
                                                'MelisCmsSlider_header_title' => [
                                                    'conf' => [
                                                        'id' => 'id_MelisCmsSlider_header_title',
                                                        'melisKey' => 'MelisCmsSlider_header_title',
                                                        'name' => 'tr_MelisCmsSlider_header_title',
                                                    ],
                                                    'forward' => [
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderDetails',
                                                        'action' => 'render-slider-header-title',
                                                    ],
                                                ],
                                            ],
                                        ],
                                        'MelisCmsSlider_header_right' => [
                                            'conf' => [
                                                'id' => 'id_MelisCmsSlider_header_right',
                                                'melisKey' => 'MelisCmsSlider_header_right',
                                                'name' => 'tr_MelisCmsSlider_header_right',
                                            ],
                                            'forward' => [
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderDetails',
                                                'action' => 'render-slider-header-right',
                                            ],
                                            'interface' => [

                                            ],
                                        ],
                                    ],
                                ],
                                'MelisCmsSlider_content' => [
                                    'conf' => [
                                        'id' => 'id_MelisCmsSlider_content',
                                        'melisKey' => 'MelisCmsSlider_content',
                                        'name' => 'tr_MelisCmsSlider_content',
                                    ],
                                    'forward' => [
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderDetails',
                                        'action' => 'render-slider-page-content',
                                    ],
                                    'interface' => [
                                        'MelisCmsSlider_content_tabs_properties' => [
                                            'conf' => [
                                                'id' => 'id_MelisCmsSlider_content_tabs_properties',
                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties',
                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties',
                                                'icon' => 'glyphicons tag',
                                            ],
                                            'forward' => [
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderDetails',
                                                'action' => 'render-slider-page-tabs-main',
                                            ],
                                            'interface' => [
                                                'MelisCmsSlider_content_tabs_properties_header' => [
                                                    'conf' => [
                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_header',
                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_header',
                                                        'name' => 'tr_MelisCmsSlider_content_tabs_properties_header',
                                                    ],
                                                    'forward' => [
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderDetails',
                                                        'action' => 'render-slider-tabs-content-header',
                                                    ],
                                                    'interface' => [
                                                        'MelisCmsSlider_content_tabs_properties_header_left' => [
                                                            'conf' => [
                                                                'id' => 'id_MelisCmsSlider_content_tabs_properties_header_left',
                                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_left',
                                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties_header_left',
                                                            ],
                                                            'forward' => [
                                                                'module' => 'MelisCmsSlider',
                                                                'controller' => 'MelisCmsSliderDetails',
                                                                'action' => 'render-slider-tabs-content-header-left',
                                                            ],
                                                            'interface' => [
                                                                'MelisCmsSlider_content_tabs_properties_header_title' => [
                                                                    'conf' => [
                                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_header_title',
                                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_title',
                                                                        'name' => 'tr_MelisCmsSlider_content_tabs_properties',
                                                                    ],
                                                                    'forward' => [
                                                                        'module' => 'MelisCmsSlider',
                                                                        'controller' => 'MelisCmsSliderDetails',
                                                                        'action' => 'render-slider-tabs-content-header-title',
                                                                    ],
                                                                ],
                                                            ],
                                                        ],
                                                        'MelisCmsSlider_content_tabs_properties_header_right' => [
                                                            'conf' => [
                                                                'id' => 'id_MelisCmsSlider_content_tabs_properties_header_right',
                                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_right',
                                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties_header_right',
                                                            ],
                                                            'forward' => [
                                                                'module' => 'MelisCmsSlider',
                                                                'controller' => 'MelisCmsSliderDetails',
                                                                'action' => 'render-slider-tabs-content-header-left',
                                                            ],
                                                            'interface' => [
                                                                'MelisCmsSlider_content_tabs_properties_header_add' => [
                                                                    'conf' => [
                                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_header_add',
                                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_add',
                                                                        'name' => 'tr_MelisCmsSlider_content_tabs_properties_header_add',
                                                                    ],
                                                                    'forward' => [
                                                                        'module' => 'MelisCmsSlider',
                                                                        'controller' => 'MelisCmsSliderDetails',
                                                                        'action' => 'render-slider-tabs-content-header-add',
                                                                    ],
                                                                ],
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                                'MelisCmsSlider_content_tabs_properties_details' => [
                                                    'conf' => [
                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_details',
                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_details',
                                                        'name' => 'tr-MelisCmsSlider_content_tabs_properties_details',
                                                    ],
                                                    'forward' => [
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderDetails',
                                                        'action' => 'render-slider-tabs-content-details',
                                                    ],
                                                    'interface' => [
                                                        'MelisCmsSlider_content_tabs_properties_details_main' => [
                                                            'conf' => [
                                                                'id' => 'id_MelisCmsSlider_content_tabs_properties_details_main',
                                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties_details_main',
                                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties_details_main',
                                                            ],
                                                            'forward' => [
                                                                'module' => 'MelisCmsSlider',
                                                                'controller' => 'MelisCmsSliderDetails',
                                                                'action' => 'render-slider-tabs-properties-details-main',
                                                            ],
                                                        ],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                'meliscmsslider_select_slider' => [
                    'conf' => [
                        'id' => 'id_meliscmsslider_select_slider',
                        'name' => 'tr_meliscmsslider_select_slider',
                        'melisKey' => 'meliscmsslider_select_slider',
                    ],
                    'forward' => [
                        'module' => 'MelisCmsSlider',
                        'controller' => 'MelisCmsSliderDetails',
                        'action' => 'render-select-slider',
                    ],
                ],
                'meliscmsslider_select_slider_blog' => [
                    'conf' => [
                        'id' => 'id_meliscmsslider_select_slider_blog',
                        'name' => 'tr_meliscmsslider_select_slider_blog',
                        'melisKey' => 'meliscmsslider_select_slider_blog',
                    ],
                    'forward' => [
                        'module' => 'MelisCmsSlider',
                        'controller' => 'MelisCmsSliderDetails',
                        'action' => 'render-select-slider-blog',
                    ],
                ],
                'MelisCmsSlider_modal' => [
                    'conf' => [
                        'id' => 'id_MelisCmsSlider_modal',
                        'name' => 'tr_MelisCmsSlider_modal',
                        'melisKey' => 'MelisCmsSlider_modal',
                    ],
                    'forward' => [
                        'module' => 'MelisCmsSlider',
                        'controller' => 'MelisCmsSliderDetails',
                        'action' => 'render-modal',
                    ],
                    'interface' => [
                        'MelisCmsSlider_modal_form' => [
                            'conf' => [
                                'id' => 'id_MelisCmsSlider_modal_form',
                                'name' => 'tr_MelisCmsSlider_modal_form',
                                'melisKey' => 'MelisCmsSlider_modal_form',
                            ],
                            'forward' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-modal-form',
                            ],
                        ],
                        'MMelisCmsSlider_slider_new' => [
                            'conf' => [
                                'id' => 'id_MMelisCmsSlider_slider_new',
                                'name' => 'tr_MMelisCmsSlider_slider_new',
                                'melisKey' => 'MMelisCmsSlider_slider_new',
                            ],
                            'forward' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-modal-form',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
