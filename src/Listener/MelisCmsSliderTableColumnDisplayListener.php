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

class MelisCmsSliderTableColumnDisplayListener extends MelisCoreGeneralListener implements ListenerAggregateInterface
{
    public function attach(EventManagerInterface $events)
    {
        $sharedEvents      = $events->getSharedManager();

        $this->listeners[] = $sharedEvents->attach(
            '*',
            'melis_toolcreator_col_display_options',
            function ($e) {

                $sm = $e->getTarget()->getServiceLocator();
                $params = $e->getParams();
                $params['valueOptions']['slider_name'] = $sm->get('translator')->translate('tr_MelisCmsSlider_header_title');
            }
        );

        $this->listeners[] = $sharedEvents->attach(
            '*',
            'melis_tool_column_display_slider_name',
            function($e){

                $sm = $e->getTarget()->getServiceLocator();
                $params = $e->getParams();

                $name = $params['data'];

                $sliderTbl    = $sm->get('MelisCmsSliderTable');
                $sliderData = $sliderTbl->getEntryById($params['data'])->current();
                if ($sliderData)
                    $name = $sliderData->mcslide_name;

                $params['data'] = $name;
            }
        );
    }
}