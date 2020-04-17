<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Listener;

use Laminas\EventManager\EventManagerInterface;
use Laminas\EventManager\ListenerAggregateInterface;
use Laminas\Mvc\MvcEvent;
use MelisCore\Listener\MelisGeneralListener;

class MelisCmsSliderToolCreatorEditionTypeListener extends MelisGeneralListener implements ListenerAggregateInterface
{
    public function attach(EventManagerInterface $events, $priority = 1)
    {
        $this->attachEventListener(
            $events,
            '*',
            'melis_toolcreator_input_edition_type_options',
            function ($e) {
                $sm = $event->getTarget()->getEvent()->getApplication()->getServiceManager();
                $params = $e->getParams();
                $params['valueOptions']['CmsSliderSelect'] = $sm->get('translator')->translate('tr_MelisCmsSlider_header_title');
            }
        );
    }
}