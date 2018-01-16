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

                    $request = $sm->get('Request');
                    $uri     = $request->getUri();
                    $scheme  = $uri->getScheme();
                    $host    = $uri->getHost();
                    $url     = $scheme . '://' . $host;

                    $sliderDetails = $results->getSliderDetails();

                    $ctr = 0;
                    foreach($sliderDetails as $item){
                        $curImg = $results->getSliderDetails()[$ctr]->mcsdetail_img;
                        $results->getSliderDetails()[$ctr]->mcsdetail_img = $url . $curImg;
                        $ctr++;
                    }

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