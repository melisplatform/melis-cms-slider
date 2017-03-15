<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Controller\Plugin;

use MelisEngine\Controller\Plugin\MelisTemplatingPlugin;

/**
 * This plugin implements the business logic of the
 * "showSlider" plugin.
 * 
 * Please look inside app.plugins.php for possible awaited parameters
 * in front and back function calls.
 * 
 * front() and back() are the only functions to create / update.
 * front() generates the website view
 * back() generates the plugin view in template edition mode (TODO)
 * 
 * Configuration can be found in $pluginConfig / $pluginFrontConfig / $pluginBackConfig
 * Configuration is automatically merged with the parameters provided when calling the plugin.
 * Merge detects automatically from the route if rendering must be done for front or back.
 * 
 * How to call this plugin without parameters:
 * $plugin = $this->MelisCmsSliderShowSliderPlugin();
 * $pluginView = $plugin->render();
 *
 * How to call this plugin with custom parameters:
 * $plugin = $this->MelisCmsSliderShowSliderPlugin();
 * $parameters = array(
 *      'template_path' => 'MySiteTest/slider/slider-show'
 * );
 * $pluginView = $plugin->render($parameters);
 * 
 * How to add to your controller's view:
 * $view->addChild($pluginView, 'showSlider');
 * 
 * How to display in your controller's view:
 * echo $this->showSlider;
 * 
 * 
 */
class MelisCmsSliderShowSliderPlugin extends MelisTemplatingPlugin
{
    // the key of the configuration in the app.plugins.php
    public $configPluginKey = 'meliscmsslider';
    
    /**
     * This function gets the datas and create an array of variables
     * that will be associated with the child view generated.
     */
    public function front()
    {
        // Get the parameters and config from $this->pluginFrontConfig (default > hardcoded > get > post)
        
        $id = (!empty($this->pluginFrontConfig['sliderId'])) ? $this->pluginFrontConfig['sliderId'] : null;
        
        // Retrieving the Slider Data from Slider Service
        $sliderSrv = $this->getServiceLocator()->get('MelisCmsSliderService');
        $sliderEntity = $sliderSrv->getSlider($id, 1);
        // Getting the Slider details from Slider Entity
        $sliderDetails = $sliderEntity->getSliderDetails();
        
        $slider = array();
        if (!empty($sliderDetails))
        {
            foreach ($sliderDetails As $key => $val)
            {
                // Adding Slide data to return variable
                array_push($slider, $val);
            }
        }
        
        // Create an array with the variables that will be available in the view
        $viewVariables = array(
            'showSlider' => $slider
        );
        
        // return the variable array and let the view be created
        return $viewVariables;
    }
}
