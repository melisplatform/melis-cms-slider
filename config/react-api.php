<?php

/**
 * Routes + contrôleurs React API fournis par MelisCmsSlider.
 *
 * Ces routes s'ajoutent aux child_routes de `melis-react-api` (défini dans MelisReactApi,
 * le bridge GÉNÉRIQUE). Modularité : les contrôleurs/routes/invokables d'un outil vivent
 * dans SON module, pas dans MelisReactApi. Laminas\Stdlib\ArrayUtils::merge() fusionne.
 * Les URLs ne changent pas. Capacités : cf. config/react.capabilities.php.
 * Mergé via MelisCmsSlider\Module::getConfig().
 */

return [
    'router' => [
        'routes' => [
            'melis-backoffice' => [
                'child_routes' => [
                    'melis-react-api' => [
                        'child_routes' => [
                            // ── Slider (MelisCmsSlider tool, UI via brick) — slider > slides > slide ──
                            // Ordre : routes spécifiques AVANT la catch-all /sliders/:id.
                            'sliders-list' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/sliders[/]',
                                    'defaults' => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'list',
                                    ],
                                ],
                            ],
                            'sliders-stats' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/sliders/stats[/]',
                                    'defaults' => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'stats',
                                    ],
                                ],
                            ],
                            'sliders-save' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/sliders/save[/]',
                                    'defaults' => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'save',
                                    ],
                                ],
                            ],
                            'sliders-slides-reorder' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/sliders/slides/reorder[/]',
                                    'defaults' => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'reorder',
                                    ],
                                ],
                            ],
                            'sliders-slide-upload' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/sliders/slide/upload[/]',
                                    'defaults' => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'slideUpload',
                                    ],
                                ],
                            ],
                            'sliders-slide-save' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'    => '/sliders/slide/save[/]',
                                    'defaults' => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'slideSave',
                                    ],
                                ],
                            ],
                            'sliders-slide-delete' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'       => '/sliders/slide/delete/:id',
                                    'constraints' => ['id' => '[0-9]+'],
                                    'defaults'    => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'slideDelete',
                                    ],
                                ],
                            ],
                            'sliders-slide-item' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'       => '/sliders/slide/:id',
                                    'constraints' => ['id' => '[0-9]+'],
                                    'defaults'    => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'slideGet',
                                    ],
                                ],
                            ],
                            'sliders-delete' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'       => '/sliders/delete/:id',
                                    'constraints' => ['id' => '[0-9]+'],
                                    'defaults'    => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'delete',
                                    ],
                                ],
                            ],
                            'sliders-slides' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'       => '/sliders/:id/slides[/]',
                                    'constraints' => ['id' => '[0-9]+'],
                                    'defaults'    => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'slides',
                                    ],
                                ],
                            ],
                            'sliders-item' => [
                                'type'    => 'Segment',
                                'options' => [
                                    'route'       => '/sliders/:id',
                                    'constraints' => ['id' => '[0-9]+'],
                                    'defaults'    => [
                                        '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                        'controller'    => 'MelisReactApiCmsSlider',
                                        'action'        => 'get',
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],

    'controllers' => [
        'invokables' => [
            'MelisCmsSlider\Controller\MelisReactApiCmsSlider' => \MelisCmsSlider\Controller\MelisReactApiCmsSliderController::class,
        ],
    ],
];
