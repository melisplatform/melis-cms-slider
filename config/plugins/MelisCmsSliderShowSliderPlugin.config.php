<?php

return array(
    'plugins' => array(
        'meliscmsslider' => array(
            'conf' => array(
                // user rights exclusions
                'rightsDisplay' => 'none',
            ),
            'plugins' => array(
                'MelisCmsSliderShowSliderPlugin' => array(
                    'front' => array(
                        'template_path' => array('MelisCmsSlider/showslider'),
                        'id' => 'showslider',
                        'sliderId' => 1,
                        
                        // List the files to be automatically included for the correct display of the plugin
                        // To overide a key, just add it again in your site module
                        // To delete an entry, use the keyword "disable" instead of the file path for the same key
                        'files' => array(
                            'css' => array(
                            ),
                            'js' => array(
                                '/MelisCmsSlider/plugins/js/plugin.cmsSlider.init.js'
                            ),
                        ),
                    ),
                    'melis' => array(
                        'name' => 'tr_MelisCmsSliderShowSliderPlugin_Name',
                        'thumbnail' => '/MelisCmsSlider/plugins/images/MelisCmsSliderShowSliderPlugin_thumb.jpg',
                        'description' => 'tr_MelisCmsSliderShowSliderPlugin_Description',
                        'files' => array(
                            'css' => array(
                            ),
                            'js' => array(
                                '/MelisCmsSlider/plugins/js/plugin.cmsSlider.init.js'
                            ),
                        ),
                        'js_initialization' => array(),
                        'modal_form' => array(
                            'cms_slider_plugin_tab_01' => array(
                                'tab_title' => 'tr_melis_Plugins_Template',
                                'tab_icon'  => 'fa fa-cog',
                                'tab_form_layout' => 'MelisCmsSlider/showslider/melis/form',
                                'attributes' => array(
                                    'name' => 'cms_slider_plugin_tab_01',
                                    'id' => 'cms_slider_plugin_tab_01',
                                    'method' => '',
                                    'action' => '',
                                ),
                                'hydrator'  => 'Zend\Stdlib\Hydrator\ArraySerializable',
                                'elements' => array(
                                    array(
                                        'spec' => array(
                                            'name' => 'template_path',
                                            'type' => 'MelisEnginePluginTemplateSelect',
                                            'options' => array(
                                                'label' => 'tr_melis_Plugins_Template',
                                                'tooltip' => 'tr_melis_Plugins_Template tooltip',
                                                'empty_option' => 'tr_melis_Plugins_Choose',
                                                'disable_inarray_validator' => true,
                                            ),
                                            'attributes' => array(
                                                'id' => 'id_page_tpl_id',
                                                'class' => 'form-control',
                                                'required' => 'required',
                                            ),
                                        ),
                                    ),

                                    array(
                                        'spec' => array(
                                            'name' => 'sliderId',
                                            'type' => 'CmsSliderSelect',
                                            'options' => array(
                                                'label' => 'tr_MelisCmsSlider_manager',
                                                'tooltip' => 'tr_MelisCmsSlider_manager tooltip',
                                                'empty_option' => 'tr_melis_Plugins_Choose',
                                                'disable_inarray_validator' => true,
                                                'open_tool' => array(
                                                    'tool_name' => 'tr_MelisCmsSlider_manager',
                                                    'tooltip' => 'tr_MelisCmsSlider_manager edit',
                                                    'tool_icon' => 'fa-columns',
                                                    'tool_id' => 'id_MelisCmsSlider_list',
                                                    'tool_meliskey' => 'MelisCmsSlider_left_menu',
                                                ),
                                            ),
                                            'attributes' => array(
                                                'id' => 'sliderId',
                                                'class' => 'form-control',
                                                'required' => 'required',
                                            ),
                                        ),
                                    ),
                                ),
                                'input_filter' => array(
                                    'template_path' => array(
                                        'name'     => 'template_path',
                                        'required' => true,
                                        'validators' => array(
                                            array(
                                                'name' => 'NotEmpty',
                                                'options' => array(
                                                    'messages' => array(
                                                        \Zend\Validator\NotEmpty::IS_EMPTY => 'tr_front_template_path_empty',
                                                    ),
                                                ),
                                            ),
                                        ),
                                        'filters'  => array(
                                        ),
                                    ),

                                    'sliderId' => array(
                                        'name'     => 'sliderId',
                                        'required' => true,
                                        'validators' => array(
                                            array(
                                                'name' => 'NotEmpty',
                                                'options' => array(
                                                    'messages' => array(
                                                        \Zend\Validator\NotEmpty::IS_EMPTY => 'tr_MelisCmsSliderShowSliderPlugin_slider_id_empty',
                                                    ),
                                                ),
                                            ),
                                            array(
                                                'name' => 'IsInt',
                                                'options' => array(
                                                    'messages' => array(
                                                        \Zend\I18n\Validator\IsInt::NOT_INT => 'tr_MelisCmsSliderShowSliderPlugin_slider_id_invalid'
                                                    ),
                                                ),
                                            ),
                                        ),
                                        'filters'  => array(
                                        ),
                                    ),
                                )
                            )
                        )
                    ),
                ),
             ),
        ),
     ),
);