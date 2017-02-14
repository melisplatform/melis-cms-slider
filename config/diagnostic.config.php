<?php

return array(

    'plugins' => array(
        'diagnostic' => array(
            'MelisCmsSlider' => array(
                // location of your test folder inside the module
                'testFolder' => 'test',
                // moduleTestName is the name of your test folder inside 'testFolder'
                'moduleTestName' => 'MelisCmsSliderTest',
                // this should be properly setup so we can recreate the factory of the database
                'db' => array(
                    // the keys will used as the function name when generated,
                    'getSliderTable' => array(
                        'model' => 'MelisCmsSlider\Model\MelisCmsSlider',
                        'model_table' => 'MelisCmsSlider\Model\Tables\MelisCmsSliderTable',
                        'db_table_name' => 'melis_cms_slider',
                    ),
                    'getSliderDetailsTable' => array(
                        'model' => 'MelisCmsSlider\Model\MelisCmsSliderDetail',
                        'model_table' => 'MelisCmsSlider\Model\Tables\MelisCmsSliderDetailTable',
                        'db_table_name' => 'melis_cms_slider_details',
                    ),
                ),
                // these are the various types of methods that you would like to give payloads for testing
                // you don't have to put all the methods in the test controller,
                // instead, just put the methods that will be needing or requiring the payloads for your test.
                'methods' => array(
                    'testInsertData' => array(
                        'payloads' => array(
                            // melis_cms_slider test data
                            'melis_cms_slider' => array(
                                'mcslide_name' => 'phpunit slider test',
                                'mcslide_date' => date('Y-m-d H:i:s'),
                            ),
                            // melis_cms_slider_details test data
                            'melis_cms_slider_details' => array(
                                'mcsdetail_status' => 1,
                                'mcsdetail_title' => 'php unit slider detail test',
                                'mcsdetail_sub1' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac felis pellentesque, hendrerit tortor a, interdum erat. Cras molestie venenatis.',
                                'mcsdetail_sub2' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac felis pellentesque, hendrerit tortor a, interdum erat. Cras molestie venenatis.',
                                'mcsdetail_sub3' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ac felis pellentesque, hendrerit tortor a, interdum erat. Cras molestie venenatis.',
                                'mcsdetail_link' => '#',
                                'mcsdetail_img' => '/media/tests/testimage1.jpg',
                                'mcsdetail_order' => 1,
                            ),
                        ), 
                    ),
                    'testTableAccessWithPayloadFromConfig' => array(
                        'payloads' => array(                            
                            'melis_cms_slider' => array(
                                'column' => 'mcslide_name',
                                'value' => 'phpunit slider test'
                            ),
                            'melis_cms_slider_details' => array(
                                'column' => 'mcsdetail_title',
                                'value' => 'php unit slider detail test',
                            ),                            
                        ),
                    ),
                    'testRemoveData' => array(
                        'payloads' => array(                            
                           'melis_cms_slider' => array(
                                'column' => 'mcslide_name',
                                'value' => 'phpunit slider test'
                            ),
                            'melis_cms_slider_details' => array(
                                'column' => 'mcsdetail_title',
                                'value' => 'php unit slider detail test',
                            ),                            
                        ),
                    ),
                ),
            ),
        ),
    ),


);

