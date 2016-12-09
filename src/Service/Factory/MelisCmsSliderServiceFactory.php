<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Service\Factory;

use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\ServiceManager\FactoryInterface;
use MelisCmsSlider\Service\MelisCmsSliderService;

class MelisCmsSliderServiceFactory implements FactoryInterface
{
	public function createService(ServiceLocatorInterface $sl)
	{ 
	    $MelisCmsSliderService = new MelisCmsSliderService();
	    $MelisCmsSliderService->setServiceLocator($sl);
	    return $MelisCmsSliderService;
	}

}