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
use MelisCore\Listener\MelisGeneralListener;

class MelisCmsSliderTableColumnDisplayListener extends MelisGeneralListener implements ListenerAggregateInterface
{
    public function attach(EventManagerInterface $events, $priority = 1)
    {

        $this->attachEventListener(
            $events,
            '*',
            'melis_toolcreator_col_display_options',
            function ($e) {

                $sm = $event->getTarget()->getEvent()->getApplication()->getServiceManager();
                $params = $e->getParams();
                $params['valueOptions']['slider_name'] = $sm->get('translator')->translate('tr_MelisCmsSlider_header_title');
            }
        );

        $this->attachEventListener(
            $events,
            '*',
            'melis_tool_column_display_slider_name',
            function($e){

                $sm = $event->getTarget()->getEvent()->getApplication()->getServiceManager();
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