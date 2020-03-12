<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Listener;

use Zend\EventManager\EventManagerInterface;
use Zend\EventManager\ListenerAggregateInterface;
use MelisCore\Listener\MelisCoreGeneralListener;

class MelisCmsSliderToolCreatorEditionTypeListener extends MelisCoreGeneralListener implements ListenerAggregateInterface
{
    public function attach(EventManagerInterface $events)
    {
        $sharedEvents      = $events->getSharedManager();

        $this->listeners[] = $sharedEvents->attach(
            '*',
            'melis_toolcreator_input_edition_type_options',
            function ($e) {
                $sm = $e->getTarget()->getServiceLocator();
                $params = $e->getParams();
                $params['valueOptions']['CmsSliderSelect'] = $sm->get('translator')->translate('tr_MelisCmsSlider_header_title');
            }
        );
    }
}