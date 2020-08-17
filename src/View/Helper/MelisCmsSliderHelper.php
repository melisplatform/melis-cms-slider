<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2019 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\View\Helper;

use Laminas\ServiceManager\ServiceManager;
use Laminas\View\Helper\AbstractHelper;
use Laminas\Session\Container;
use Laminas\View\Model\ViewModel;

/**
 * This helper creates a menu inside the template to be used with the plugins
 *
 */
class MelisCmsSliderHelper extends AbstractHelper
{
	public $serviceManager;

    /**
     * @param ServiceManager $serviceManager
     */
	public function setServiceManager(ServiceManager $serviceManager)
	{
		$this->serviceManager = $serviceManager;
	}

	public function __invoke($sliderParameters)
	{
        /**
         * 'MelisCmsSliderShowSliderPlugin'
         *  - is the alias registered under Controller Plugins invokables
         *  (module.config.php > 'controller_plugins' > 'invokables')
         */
        $newsListPlugin = $this->serviceManager->get('ControllerPluginManager')->get('MelisCmsSliderShowSliderPlugin');
	    $newsListPluginView = $newsListPlugin->render($sliderParameters);
	    
	    $viewRender = $this->serviceManager->get('ViewRenderer');
	    $newsListHtml = $viewRender->render($newsListPluginView);

		return $newsListHtml;
	}
}