<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

return array(
    'router' => array(
        'routes' => array(
            'melis-backoffice' => array(
                'type'    => 'Segment',
                'options' => array(
                    'route'    => '/melis[/]',
                ),
                'child_routes' => array(
                    'application-MelisCmsSlider' => array(
                        'type'    => 'Literal',
                        'options' => array(
                            'route'    => 'MelisCmsSlider',
                            'defaults' => array(
                                '__NAMESPACE__' => 'MelisCmsSlider\Controller',
                                'controller'    => 'CustomEdition',
                                'action'        => 'renderCustomTableEditor',
                            ),
                        ),
                        'may_terminate' => true,
                        'child_routes' => array(
                            'default' => array(
                                'type'    => 'Segment',
                                'options' => array(
                                    'route'    => '/[:controller[/:action]]',
                                    'constraints' => array(
                                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                                    ),
                                    'defaults' => array(
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
    'translator' => array(
    	'locale' => 'en_EN',
	),
    'service_manager' => array(
        'invokables' => array(
            
        ),
        'aliases' => array(
            'translator' => 'MvcTranslator',
            'MelisCmsSliderTable' => 'MelisCmsSlider\Model\Tables\MelisCmsSliderTable',
            'MelisCmsSliderDetailTable' => 'MelisCmsSlider\Model\Tables\MelisCmsSliderDetailTable',
        ),
        'factories' => array(
            //services
            'MelisCmsSliderService' => 'MelisCmsSlider\Service\Factory\MelisCmsSliderServiceFactory',
            
            //tables
            'MelisCmsSlider\Model\Tables\MelisCmsSliderTable' => 'MelisCmsSlider\Model\Tables\Factory\MelisCmsSliderTableFactory',
            'MelisCmsSlider\Model\Tables\MelisCmsSliderDetailTable' => 'MelisCmsSlider\Model\Tables\Factory\MelisCmsSliderDetailTableFactory',
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'MelisCmsSlider\Controller\MelisCmsSliderList' => 'MelisCmsSlider\Controller\MelisCmsSliderListController',
            'MelisCmsSlider\Controller\MelisCmsSliderDetails' => 'MelisCmsSlider\Controller\MelisCmsSliderDetailsController',
            ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'template_map' => array(
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
    'asset_manager' => array(
        'resolver_configs' => array(
            'aliases' => array(
                'MelisCmsSlider/' => __DIR__ . '/../public/',
            ),
        ),
    ),
);
