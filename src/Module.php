<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\ModuleManager\ModuleManager;
use Zend\Stdlib\ArrayUtils;
use Zend\Session\Container;

// use MelisTechnologyCustom\Model\MelisTechnologyCustomTableList;
// use MelisTechnologyCustom\Model\Tables\MelisTechnologyCustomTableListColumnsTable;

use MelisCmsSlider\Listener\MelisCmsSliderFlashMessengerListener;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);
        $melisRoute = 0;
        $this->createTranslations($e);        
        $sm = $e->getApplication()->getServiceManager();
        $routeMatch = $sm->get('router')->match($sm->get('request'));
        
        if (!empty($routeMatch))
        {
            $routeName = $routeMatch->getMatchedRouteName();
            
            $module = explode('/', $routeName);
             
            if (!empty($module[0]))
            {
                if ($module[0] == 'melis-backoffice')
                    $melisRoute = true;
            }
        }
        
        if ($melisRoute)
        {
            // attach listeners for Melis
            $eventManager->attach(new MelisCmsSliderFlashMessengerListener());         
            
        }
    }
    
    public function init(ModuleManager $manager)
    {
    }

    public function getConfig()
    {
    	$config = array();
    	$configFiles = array(
    			include __DIR__ . '/../config/module.config.php',
    			include __DIR__ . '/../config/app.interface.php',
    			include __DIR__ . '/../config/app.tools.php',
    	        include __DIR__ . '/../config/app.forms.php',
    	        include __DIR__ . '/../config/diagnostic.config.php',
    	        include __DIR__ . '/../config/app.plugins.php',
    	);
    	
    	foreach ($configFiles as $file) {
    		$config = ArrayUtils::merge($config, $file);
    	} 
    	
    	return $config;
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }
    
    public function createTranslations($e)
    {
        $sm = $e->getApplication()->getServiceManager();
        $translator = $sm->get('translator');
    
        $container = new Container('meliscore');
        $locale = $container['melis-lang-locale'];

        if (!empty($locale)){
            
            $translationType = array(
                'interface',
            );
            
            foreach($translationType as $type){
            
                $transPath = "module/MelisModuleConfig/languages/MelisCmsSlider/$locale.$type.php";
            
                if(!file_exists($transPath)){
            
                    // if translation is not found, use melis default translations
                    $locale = (file_exists(__DIR__ . "/../language/$locale.$type.php"))? $locale : "en_EN";
                    $transPath = __DIR__ . "/../language/$locale.$type.php";
                }
            
                $translator->addTranslationFile('phparray', $transPath);
            }
        }
    }
 
}
