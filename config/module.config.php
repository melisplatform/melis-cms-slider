<?php

/**
 * Melis Technology (http://www.melistechnology.com]
 *
 * @copyright Copyright (c] 2015 Melis Technology (http://www.melistechnology.com]
 *
 */

return [
    'router' => [
        'routes' => [
            'melis-backoffice' => [
                'type'    => 'Segment',
                'options' => [
                    'route'    => '/melis[/]',
                ],
                'child_routes' => [
                    'application-MelisCmsSlider' => [
                        'type'    => 'Literal',
                        'options' => [
                            'route'    => 'MelisCmsSlider',
                            'defaults' => [
                                '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                'controller'    => 'CustomEdition',
                                'action'        => 'renderCustomTableEditor',
                            ],
                        ],
                        'may_terminate' => true,
                        'child_routes' => [
                            'default' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/[:controller[/:action]]',
                                    'constraints' => [
                                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                                    ],
                                    'defaults' => [],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    'service_manager' => [
        'aliases' => [
            // Service
            'MelisCmsSliderService'     => \MelisCmsSlider\Service\MelisCmsSliderService::class,
            // Tables
            'MelisCmsSliderTable'       => \MelisCmsSlider\Model\Tables\MelisCmsSliderTable::class,
            'MelisCmsSliderDetailTable' => \MelisCmsSlider\Model\Tables\MelisCmsSliderDetailTable::class,
        ],
    ],
    'controllers' => [
        'invokables' => [
            'MelisCmsSlider\Controller\MelisCmsSliderList'      => \MelisCmsSlider\Controller\MelisCmsSliderListController::class,
            'MelisCmsSlider\Controller\MelisCmsSliderDetails'   => \MelisCmsSlider\Controller\MelisCmsSliderDetailsController::class,
            'MelisCmsSlider\Controller\MelisSetup'              => \MelisCmsSlider\Controller\MelisSetupController::class,
        ],
    ],
    'controller_plugins' => [
        'invokables' => [
            'MelisCmsSliderShowSliderPlugin' => \MelisCmsSlider\Controller\Plugin\MelisCmsSliderShowSliderPlugin::class,
        ]
    ],
    'form_elements' => [
        'factories' => [
            'CmsSliderSelect' => \MelisCmsSlider\Form\Factory\CmsSliderSelectFactory::class,
        ]
    ],
    'view_helpers' => [
        'aliases' => [
            'MelisCmsSliderPlugin' => \MelisCmsSlider\View\Helper\MelisCmsSliderHelper::class,
        ],
    ],
    'view_manager' => [
        'template_map' => [
            'MelisCmsSlider/showslider'             => __DIR__ . '/../view/melis-cms-slider/plugins/showslider.phtml',
            'MelisCmsSlider/showslider/melis/form'  => __DIR__ . '/../view/melis-cms-slider/plugins/slider-modal-form.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
        'strategies' => [
            'ViewJsonStrategy',
        ],
    ],
];
