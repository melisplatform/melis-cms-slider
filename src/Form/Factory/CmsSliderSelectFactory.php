<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Form\Factory;

use Laminas\Form\Element\Select;
use Laminas\ServiceManager\ServiceManager;
use MelisCore\Form\Factory\MelisSelectFactory;
use Psr\Container\ContainerInterface;

/**
 * MelisCommerce Countries select factory
 */
class CmsSliderSelectFactory extends MelisSelectFactory
{
	protected function loadValueOptions(ServiceManager $serviceManager)
	{
		$sliders = [];
		$sliderSvc = $serviceManager->get('MelisCmsSliderService');

		foreach($sliderSvc->getSliderList(null, null, 'mcslide_name ASC') as $s){
		    $slider = $s->getSlider();
		    $sliders[$slider->mcslide_id] = $slider->mcslide_name; 
		}
		
		return $sliders;
	}
}