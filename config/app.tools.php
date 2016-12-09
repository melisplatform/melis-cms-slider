<?php

return array(
    'plugins' => array(
        'MelisCmsSlider' => array(
            'tools' => array(
                'MelisCmsSlider_list' => array(
                    'table' => array(
                        'target' => '#sliderList',
                        'ajaxUrl' => 'melis/MelisCmsSlider/MelisCmsSliderList/renderTableListData',
                        'dataFunction' => '',
                        'ajaxCallback' => '',
                        'filters' => array(
                            'left' => array(
                                'table-list-table-filter-limit' => array(
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-limit'
                                ),
                            ),
                
                            'center' => array(
                                'table-list-table-filter-search' => array(
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-search'
                                ),
                            ),
                
                            'right' => array(
                                'table-list-table-filter-refresh' => array(
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-refresh'
                                ),
                            ),
                        ),
                
                        'columns' => array(
                            'mcslide_id' => array(
                                'text' => 'tr_MelisCmsSlider_list_col_id',
                                'css' => array('width' => '10%', 'padding-right' => '0'),
                                'sortable' => true,
                            ),
                            'mcslide_name' => array(
                                'text' => 'tr_MelisCmsSlider_list_col_name',
                                'css' => array('width' => '10%', 'padding-right' => '0'),
                                'sortable' => true,
                            ),
                            'mcslide_page_id' => array(
                                'text' => 'tr_MelisCmsSliderDetails_slider_page_id',
                                'css' => array('width' => '10%', 'padding-right' => '0'),
                                'sortable' => true,
                            ),
                        ),
                
                        'searchables' => array(),
                        'actionButtons' => array(
                            'info' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-content-action-info'
                            ),
                            'edit' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-content-action-edit'
                            ),
                            'delete' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-content-action-delete'
                            ),
                        ),
                    ),
                ),
                'MelisCmsSlider_details' => array(
                    'table' => array(
                        'target' => '#sliderDetails',
                        'ajaxUrl' => 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderTableListData',
                        'dataFunction' => 'initSliderDetails',
                        'ajaxCallback' => '',
                        'filters' => array(
                            'left' => array(
                                'table-list-table-filter-limits' => array(
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-limit'
                                ),
                            ),
                
                            'center' => array(),
                
                            'right' => array(),
                        ),
                
                        'columns' => array(
                            'mcsdetail_order' => array(
                                'text' => '<i class="fa fa-plus"> </i>',
                                'css' => array('width' => '1%', 'padding-right' => '0', 'visible' => false),
                                'sortable' => true,
                            ),
                            'mcsdetail_id' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_id',
                                'css' => array('width' => '5%', 'padding-right' => '0'),
                                'sortable' => false,
                            ),
                            'mcsdetail_status' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_status',
                                'css' => array('width' => '10%', 'padding-right' => '0'),
                                'sortable' => false,
                            ),
                            'mcsdetail_title' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_name',
                                'css' => array('width' => '15%', 'padding-right' => '0'),
                                'sortable' => false,
                            ),
                            'mcsdetail_sub1' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_sub1',
                                'css' => array('width' => '15%', 'padding-right' => '0'),
                                'sortable' => false,
                            ),
                            'mcsdetail_sub2' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_sub2',
                                'css' => array('width' => '15%', 'padding-right' => '0'),
                                'sortable' => false,
                            ),
                            'mcsdetail_sub3' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_sub3',
                                'css' => array('width' => '15%', 'padding-right' => '0'),
                                'sortable' => false,
                            ),
                            'mcsdetail_link' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_link',
                                'css' => array('width' => '10%', 'padding-right' => '0'),
                                'sortable' => false,
                            ),
                            'mcsdetail_img' => array(
                                'text' => 'tr_MelisCmsSliderDetails_list_col_image',
                                'css' => array('width' => '10%', 'padding-right' => '0', 'display' => 'none'),
                                'sortable' => false,
                            ),
                        ),
                
                        'searchables' => array(),
                        'actionButtons' => array(
                            'info' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-slider-content-action-info'
                            ),
                            'delete' => array(
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-slider-content-action-delete'
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
);
