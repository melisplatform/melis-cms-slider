<?php 

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Listener;

use Laminas\EventManager\EventManagerInterface;
use Laminas\EventManager\ListenerAggregateInterface;
use MelisCore\Listener\MelisGeneralListener;

class MelisCmsSliderFlashMessengerListener extends MelisGeneralListener implements ListenerAggregateInterface
{
	
    public function attach(EventManagerInterface $events, $priority = 1)
    {
        $identifier = 'MelisCmsSlider';

        /**
         * Events
         */
        $eventsName = [
            'meliscmsslider_delete_details_end',
            'meliscmsslider_save_details_end',
            'meliscmsslider_add_slider_end',
            'meliscmsslider_delete_slider_end',
        ];

        $priority = -1000;

        /**
         * Attaching Events listiners
         */
        $this->attachEventListener($events, $identifier, $eventsName, [$this, 'logMessages'], $priority);
    }
}