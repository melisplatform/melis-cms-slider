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
            'tools' => [
                'MelisCmsSlider_list' => [
                    'table' => [
                        'target' => '#sliderList',
                        'ajaxUrl' => '/melis/MelisCmsSlider/MelisCmsSliderList/renderTableListData',
                        'dataFunction' => '',
                        'ajaxCallback' => '',
                        'filters' => [
                            'left' => [
                                'table-list-table-filter-limit' => [
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-limit'
                                ],
                            ],
                
                            'center' => [
                                'table-list-table-filter-search' => [
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-search'
                                ],
                            ],
                
                            'right' => [
                                'table-list-table-filter-refresh' => [
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-refresh'
                                ],
                            ],
                        ],
                
                        'columns' => [
                            'mcslide_id' => [
                                'text' => 'tr_MelisCmsSlider_list_col_id',
                                'css' => ['width' => '10%', 'padding-right' => '0'],
                                'sortable' => true,
                            ],
                            'mcslide_name' => [
                                'text' => 'tr_MelisCmsSlider_list_col_name',
                                'css' => ['width' => '10%', 'padding-right' => '0'],
                                'sortable' => true,
                            ],
                            'mcslide_page_id' => [
                                'text' => 'tr_MelisCmsSliderDetails_slider_page_id',
                                'css' => ['width' => '10%', 'padding-right' => '0'],
                                'sortable' => true,
                            ],
                        ],
                
                        'searchables' => [],
                        'actionButtons' => [
                            'edit' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-content-action-edit'
                            ],
                            'info' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-content-action-info'
                            ],
                            'delete' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderList',
                                'action' => 'render-table-list-content-action-delete'
                            ],
                        ],
                    ],
                ],
                'MelisCmsSlider_details' => [
                    'table' => [
                        'target' => '#sliderDetails',
                        'ajaxUrl' => '/melis/MelisCmsSlider/MelisCmsSliderDetails/renderTableListData',
                        'dataFunction' => 'initSliderDetails',
                        'ajaxCallback' => '',
                        'filters' => [
                            'left' => [
                                'table-list-table-filter-limits' => [
                                    'module' => 'MelisCmsSlider',
                                    'controller' => 'MelisCmsSliderList',
                                    'action' => 'render-table-list-content-filter-limit'
                                ],
                            ],
                
                            'center' => [],
                
                            'right' => [],
                        ],
                
                        'columns' => [
                            'mcsdetail_order' => [
                                'text' => '<i class="fa fa-plus"> </i>',
                                'css' => ['width' => '1%', 'padding-right' => '0', 'visible' => false],
                                'sortable' => true,
                            ],
                            'mcsdetail_id' => [
                                'text' => 'tr_MelisCmsSliderDetails_list_col_id',
                                'css' => ['width' => '5%', 'padding-right' => '0'],
                                'sortable' => true,
                            ],
                            'mcsdetail_status' => [
                                'text' => 'tr_MelisCmsSliderDetails_list_col_status',
                                'css' => ['width' => '10%', 'padding-right' => '0'],
                                'sortable' => false,
                            ],
                            'mcsdetail_img' => [
                                'text' => 'tr_MelisCmsSliderDetails_list_col_image',
                                'css' => ['width' => '10%', 'padding-right' => '0', 'display' => 'none'],
                                'sortable' => false,
                            ],
                            'mcsdetail_title' => [
                                'text' => 'tr_MelisCmsSliderDetails_list_col_name',
                                'css' => ['width' => '25%', 'padding-right' => '0'],
                                'sortable' => true,
                            ],
                            'mcsdetail_sub1' => [
                                'text' => 'tr_MelisCmsSliderDetails_list_col_sub1',
                                'css' => ['width' => '30%', 'padding-right' => '0'],
                                'sortable' => true,
                            ],
                            'mcsdetail_link' => [
                                'text' => 'tr_MelisCmsSliderDetails_list_col_link',
                                'css' => ['width' => '20%', 'padding-right' => '0'],
                                'sortable' => false,
                            ],
                        ],
                        'searchables' => [],
                        'actionButtons' => [
                            'info' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-slider-content-action-info'
                            ],
                            'delete' => [
                                'module' => 'MelisCmsSlider',
                                'controller' => 'MelisCmsSliderDetails',
                                'action' => 'render-slider-content-action-delete'
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
