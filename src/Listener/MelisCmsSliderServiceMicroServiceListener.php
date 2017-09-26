<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Listener;

use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;
use MelisCore\Listener\MelisCoreGeneralListener;

class MelisCmsSliderServiceMicroServiceListener extends MelisCoreGeneralListener implements ListenerAggregateInterface
{

    public function attach(EventManagerInterface $events)
    {
        $sharedEvents      = $events->getSharedManager();

        $callBackHandler = $sharedEvents->attach(
            '*',
            array(
                'melis_core_microservice_amend_data',
            ),
            function($e){

                $sm = $e->getTarget()->getServiceLocator();
                $params = $e->getParams();
                $tool = $sm->get('MelisCoreTool');

                $module  = isset($params['module'])  ? $params['module']  : null;
                $service = isset($params['service']) ? $params['service'] : null;
                $method  = isset($params['method'])  ? $params['method']  : null;
                $post    = isset($params['post'])  ? $params['post']  : null;
                $results = isset($params['results'])  ? $params['results']  : null;

                if($module == 'MelisCmsSlider' && $service == 'MelisCmsSliderService' && $method == 'getSlider') {
                    $results = $tool->convertObjectToArray($results);
                    
                }
                if($module == 'MelisCmsSlider' && $service == 'MelisCmsSliderService' && $method == 'getSliderList') {
                    $results = $tool->convertObjectToArray($results);
                    
                }

                if($module == 'MelisCmsSlider' && $service == 'MelisCmsSliderService' && $method == 'getSliderByPageId') {
                    $results = $tool->convertObjectToArray($results);
                    
                }
                return array(
                    'module'  => $module,
                    'service' => $service,
                    'method'  => $method,
                    'post'    => $post,
                    'results' => $results
                );
            },
            -1000);

        $this->listeners[] = $callBackHandler;
    }
}