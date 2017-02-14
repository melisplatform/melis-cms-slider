<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Form\Factory;

use Zend\ServiceManager\ServiceLocatorInterface;
use MelisCore\Form\Factory\MelisSelectFactory;

/**
 * MelisCommerce Countries select factory
 */
class CmsSliderSelectFactory extends MelisSelectFactory
{
	protected function loadValueOptions(ServiceLocatorInterface $formElementManager)
	{
		$sliders = array();
	    $serviceManager = $formElementManager->getServiceLocator();		
		$sliderSvc = $serviceManager->get('MelisCmsSliderService');	
		$melisTool = $serviceManager->get('MelisCoreTool');
		
		foreach($sliderSvc->getSliderList(null, null, 'mcslide_name ASC') as $s){
		    $slider = $s->getSlider();
		    $sliders[$slider->mcslide_id] = $slider->mcslide_name; 
		}
		
		return $sliders;
	}

}