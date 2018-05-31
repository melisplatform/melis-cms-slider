<?php 

return array(
    'plugins' => array(
        'meliscore' => array(
            'datas' => array(),
            'interface' => array(
                'meliscore_leftmenu' => array(
                    'interface' => array(
        			    'meliscms_toolstree_section' =>  array(
        			    	'interface' => array(
								'meliscms_news_tools_section' => array(
                                    'conf' => array(
                                        'id' => 'id_meliscms_news_tools_section',
                                        'name' => 'tr_MelisCmsSlider_manager',
                                        'icon' => 'fa-image',
                                        'rights_checkbox_disable' => true,
                                        'melisKey' => 'meliscms_news_tools_section',
                                    ),
        			    			'interface' => array(
		        			    		'MelisCmsSlider_left' => array(
		        			    			'conf' => array(
		        			    				'type' => '/MelisCmsSlider/interface/MelisCmsSlider_list/interface/MelisCmsSlider_left_menu',
		        			    			),
		        			    		),
        			    			),
								),
        			    	),
        			    ),
                    ),
                ),
            ),
        ),
		'meliscore_dashboard' => array(),
        'MelisCmsSlider' => array(
            'conf' => array(
                'id' => '',
                'name' => 'tr_MelisCmsSlider_manager',
                'rightsDisplay' => 'none',
                'sliders' => array(
                    'minUploadSize' => 1,
                    'maxUploadSize' => 10500000,
                    'imagesPath' => '/media/sliders/',
                ),                
            ),
            'ressources' => array(
                'js' => array(
                    '/MelisCmsSlider/js/tools/slider.tool.js',
                    '/MelisCmsSlider/assets/switch/bootstrap-switch.js',
                ),
                
                'css' => array(
                    '/MelisCmsSlider/css/sliders.css',
                ),
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
            ),
            'datas' => array(
                
            ),
            'interface' => array(
                'MelisCmsSlider_list' => array(

                    'conf' => array(
                        'name' => 'tr_MelisCmsSlider_manager',
                        'rightsDisplay' => 'referencesonly',
                    ),
                    'interface' => array(
                        'MelisCmsSlider_left_menu' => array(
                            'conf' => array(
                                'id' => 'id_MelisCmsSlider_list',
                                'name' => 'tr_MelisCmsSlider_manager',
                                'melisKey' => 'MelisCmsSlider_left_menu',
                                'icon' => 'fa-columns',
                                'rights_checkbox_disable' => true,
                                'follow_regular_rendering' => false,
                            ),
                            'forward' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-page',
                                'jscallback' => '',
                                'jsdatas' => array()
                            ),
                            'interface' => array(
                                'MelisCmsSlider_list_header' => array(
                                    'conf' => array(
                                        'id' => 'id_MelisCmsSlider_list_header',
                                        'melisKey' => 'MelisCmsSlider_list_header',
                                        'name' => 'tr_MelisCmsSlider_list_header',
                                    ),
                                    'forward' => array(
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderList',
                                        'action' => 'render-table-list-header',
                                    ),
                                    'interface' => array(
                                        'MelisCmsSlider_list_header_left' => array(
                                            'conf' => array(
                                                'id' => 'id_MelisCmsSlider_list_header_left',
                                                'melisKey' => 'MelisCmsSlider_list_header_left',
                                                'name' => 'tr_MelisCmsSlider_list_header_left',
                                            ),
                                            'forward' => array(
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderList',
                                                'action' => 'render-table-list-header-left',
                                            ),
                                            'interface' => array(
                                                'MelisCmsSlider_list_header_title' => array(
                                                    'conf' => array(
                                                        'id' => 'id_MelisCmsSlider_list_header_title',
                                                        'melisKey' => 'MelisCmsSlider_list_header_title',
                                                        'name' => 'tr_MelisCmsSlider_list_header_title',
                                                    ),
                                                    'forward' => array(
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderList',
                                                        'action' => 'render-table-list-header-title',
                                                    ),
                                                ),
                                            ),
                                        ),
                                        'MelisCmsSlider_list_header_right' => array(
                                            'conf' => array(
                                                'id' => 'id_MelisCmsSlider_list_header_right',
                                                'melisKey' => 'MelisCmsSlider_list_header_right',
                                                'name' => 'tr_MelisCmsSlider_list_header_right',
                                            ),
                                            'forward' => array(
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderList',
                                                'action' => 'render-table-list-header-right',
                                            ),
                                            'interface' => array(
                                                'MelisCmsSlider_list_header_right_add' => array(
                                                    'conf' => array(
                                                        'id' => 'id_MelisCmsSlider_list_header_right_add',
                                                        'melisKey' => 'MelisCmsSlider_list_header_right_add',
                                                        'name' => 'tr_MelisCmsSlider_list_header_right_add',
                                                    ),
                                                    'forward' => array(
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderList',
                                                        'action' => 'render-table-list-header-right-add',
                                                    ),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                                'MelisCmsSlider_list_content' => array(
                                    'conf' => array(
                                        'id' => 'id_MelisCmsSlider_list_content',
                                        'melisKey' => 'MelisCmsSlider_list_content',
                                        'name' => 'tr_MelisCmsSlider_list_content',
                                    ),
                                    'forward' => array(
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderList',
                                        'action' => 'render-table-list-content',
                                    ),
                                    'interface' => array(
                                        'MelisCmsSlider_list_content_table' => array(
                                            'conf' => array(
                                                'id' => 'id_MelisCmsSlider_list_content_table',
                                                'melisKey' => 'MelisCmsSlider_list_content_table',
                                                'name' => 'tr_MelisCmsSlider_list_content_table',
                                            ),
                                            'forward' => array(
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderList',
                                                'action' => 'render-table-list-content-table',
                                            ),
                                        ), 
                                    ),
                                ),
                            ),
                        ),
                    ),                    
                ),
                'MelisCmsSlider' => array(
                    'interface' => array(
                        'MelisCmsSlider_page' => array(
                            'conf' => array(
                                'id' => 'id_MelisCmsSlider_page',
                                'melisKey' => 'MelisCmsSlider_page',
                                'name' => 'tr_MelisCmsSlider_page',
                            ),
                            'forward' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-slider-page',
                            ),
                            'interface' => array(
                                'MelisCmsSlider_header' => array(
                                    'conf' => array(
                                        'id' => 'id_MelisCmsSlider_header',
                                        'melisKey' => 'MelisCmsSlider_header',
                                        'name' => 'tr_MelisCmsSlider_header',
                                    ),
                                    'forward' => array(
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderDetails',
                                        'action' => 'render-slider-header',
                                    ),
                                    'interface' => array(
                                        'MelisCmsSlider_header_left' => array(
                                            'conf' => array(
                                                'id' => 'id_MelisCmsSlider_header_left',
                                                'melisKey' => 'MelisCmsSlider_header_left',
                                                'name' => 'tr_MelisCmsSlider_header_left',
                                            ),
                                            'forward' => array(
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderDetails',
                                                'action' => 'render-slider-header-left',
                                            ),
                                            'interface' => array(
                                                'MelisCmsSlider_header_title' => array(
                                                    'conf' => array(
                                                        'id' => 'id_MelisCmsSlider_header_title',
                                                        'melisKey' => 'MelisCmsSlider_header_title',
                                                        'name' => 'tr_MelisCmsSlider_header_title',
                                                    ),
                                                    'forward' => array(
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderDetails',
                                                        'action' => 'render-slider-header-title',
                                                    ),
                                                ),
                                            ),
                                        ),
                                        'MelisCmsSlider_header_right' => array(
                                            'conf' => array(
                                                'id' => 'id_MelisCmsSlider_header_right',
                                                'melisKey' => 'MelisCmsSlider_header_right',
                                                'name' => 'tr_MelisCmsSlider_header_right',
                                            ),
                                            'forward' => array(
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderDetails',
                                                'action' => 'render-slider-header-right',
                                            ),
                                            'interface' => array(
                                
                                            ),
                                        ),
                                    ),
                                ),
                                'MelisCmsSlider_content' => array(
                                    'conf' => array(
                                        'id' => 'id_MelisCmsSlider_content',
                                        'melisKey' => 'MelisCmsSlider_content',
                                        'name' => 'tr_MelisCmsSlider_content',
                                    ),
                                    'forward' => array(
                                        'module' => 'MelisCmsSlider',
                                        'controller' => 'MelisCmsSliderDetails',
                                        'action' => 'render-slider-page-content',
                                    ),
                                    'interface' => array(
                                        'MelisCmsSlider_content_tabs_properties' => array(
                                            'conf' => array(
                                                'id' => 'id_MelisCmsSlider_content_tabs_properties',
                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties',
                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties',
                                                'icon' => 'glyphicons tag',
                                            ),
                                            'forward' => array(
                                                'module' => 'MelisCmsSlider',
                                                'controller' => 'MelisCmsSliderDetails',
                                                'action' => 'render-slider-page-tabs-main',
                                            ),
                                            'interface' => array(
                                                'MelisCmsSlider_content_tabs_properties_header' => array(
                                                    'conf' => array(
                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_header',
                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_header',
                                                        'name' => 'tr_MelisCmsSlider_content_tabs_properties_header',
                                                    ),
                                                    'forward' => array(
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderDetails',
                                                        'action' => 'render-slider-tabs-content-header',
                                                    ),
                                                    'interface' => array(
                                                        'MelisCmsSlider_content_tabs_properties_header_left' => array(
                                                            'conf' => array(
                                                                'id' => 'id_MelisCmsSlider_content_tabs_properties_header_left',
                                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_left',
                                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties_header_left',
                                                            ),
                                                            'forward' => array(
                                                                'module' => 'MelisCmsSlider',
                                                                'controller' => 'MelisCmsSliderDetails',
                                                                'action' => 'render-slider-tabs-content-header-left',
                                                            ),
                                                            'interface' => array(
                                                                'MelisCmsSlider_content_tabs_properties_header_title' => array(
                                                                    'conf' => array(
                                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_header_title',
                                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_title',
                                                                        'name' => 'tr_MelisCmsSlider_content_tabs_properties',
                                                                    ),
                                                                    'forward' => array(
                                                                        'module' => 'MelisCmsSlider',
                                                                        'controller' => 'MelisCmsSliderDetails',
                                                                        'action' => 'render-slider-tabs-content-header-title',
                                                                    ),
                                                                ),
                                                            ),
                                                        ),
                                                        'MelisCmsSlider_content_tabs_properties_header_right' => array(
                                                            'conf' => array(
                                                                'id' => 'id_MelisCmsSlider_content_tabs_properties_header_right',
                                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_right',
                                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties_header_right',
                                                            ),
                                                            'forward' => array(
                                                                'module' => 'MelisCmsSlider',
                                                                'controller' => 'MelisCmsSliderDetails',
                                                                'action' => 'render-slider-tabs-content-header-left',
                                                            ),
                                                            'interface' => array(
                                                                'MelisCmsSlider_content_tabs_properties_header_add' => array(
                                                                    'conf' => array(
                                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_header_add',
                                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_header_add',
                                                                        'name' => 'tr_MelisCmsSlider_content_tabs_properties_header_add',
                                                                    ),
                                                                    'forward' => array(
                                                                        'module' => 'MelisCmsSlider',
                                                                        'controller' => 'MelisCmsSliderDetails',
                                                                        'action' => 'render-slider-tabs-content-header-add',
                                                                    ),
                                                                ),
                                                            ),
                                                        ),
                                                    ),
                                                ),
                                                'MelisCmsSlider_content_tabs_properties_details' => array(
                                                    'conf' => array(
                                                        'id' => 'id_MelisCmsSlider_content_tabs_properties_details',
                                                        'melisKey' => 'MelisCmsSlider_content_tabs_properties_details',
                                                        'name' => 'tr-MelisCmsSlider_content_tabs_properties_details',
                                                    ),
                                                    'forward' => array(
                                                        'module' => 'MelisCmsSlider',
                                                        'controller' => 'MelisCmsSliderDetails',
                                                        'action' => 'render-slider-tabs-content-details',
                                                    ),
                                                    'interface' => array(
                                                        'MelisCmsSlider_content_tabs_properties_details_main' => array(
                                                            'conf' => array(
                                                                'id' => 'id_MelisCmsSlider_content_tabs_properties_details_main',
                                                                'melisKey' => 'MelisCmsSlider_content_tabs_properties_details_main',
                                                                'name' => 'tr_MelisCmsSlider_content_tabs_properties_details_main',
                                                            ),
                                                            'forward' => array(
                                                                'module' => 'MelisCmsSlider',
                                                                'controller' => 'MelisCmsSliderDetails',
                                                                'action' => 'render-slider-tabs-properties-details-main',
                                                            ),
                                                        ),
                                                    ),
                                                ),
                                            ),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
                'meliscmsslider_select_slider' => array(
                    'conf' => array(
                        'id' => 'id_meliscmsslider_select_slider',
                        'name' => 'tr_meliscmsslider_select_slider',
                        'melisKey' => 'meliscmsslider_select_slider',
                    ),
                    'forward' => array(
                        'module' => 'MelisCmsSlider',
                        'controller' => 'MelisCmsSliderDetails',
                        'action' => 'render-select-slider',
                    ),
                ),
                'MelisCmsSlider_modal' => array(
                    'conf' => array(
                        'id' => 'id_MelisCmsSlider_modal',
                        'name' => 'tr_MelisCmsSlider_modal',
                        'melisKey' => 'MelisCmsSlider_modal',
                    ),
                    'forward' => array(
                        'module' => 'MelisCmsSlider',
                        'controller' => 'MelisCmsSliderDetails',
                        'action' => 'render-modal',
                    ),
                    'interface' => array(
                        'MelisCmsSlider_modal_form' => array(
                            'conf' => array(
                                'id' => 'id_MelisCmsSlider_modal_form',
                                'name' => 'tr_MelisCmsSlider_modal_form',
                                'melisKey' => 'MelisCmsSlider_modal_form',
                            ),
                            'forward' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-modal-form',
                            ),
                        ),
                        'MMelisCmsSlider_slider_new' => array(
                            'conf' => array(
                                'id' => 'id_MMelisCmsSlider_slider_new',
                                'name' => 'tr_MMelisCmsSlider_slider_new',
                                'melisKey' => 'MMelisCmsSlider_slider_new',
                            ),
                            'forward' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-modal-form',
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),

);