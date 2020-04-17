# melis-cms-slider

MelisCmsSlider provides a full Slider system for Melis Platform, including templating plugins.

## Getting Started

These instructions will get you a copy of the project up and running on your machine.  
This Melis Platform module is made to work with the MelisCore.

### Prerequisites

You will need to install melisplatform/melis-cms in order to have this module running.  
This will automatically be done when using composer.

### Installing

Run the composer command:
```
composer require melisplatform/melis-cms-slider
```

**[See Full documentation on Melis CMS Slider here](https://www.melistechnology.com/MelisTechnology/resources/documentation/module/melis-cms-slider/PresentationofTheSliderManagemen)**

### Database    

Database model is accessible on the MySQL Workbench file:  
/melis-cms-slider/install/sql/model  
Database will be installed through composer and its hooks.  
In case of problems, SQL files are located here:  
/melis-cms-slider/install/sql  

## Tools & Elements provided

* Slider Tool
* Melis Templating Slider Plugin (SliderShow)
* News with Sliders when MelisCmsNews Module is installed

## Running the code

### MelisCmsSlider Services  

MelisCmsSlider provides many services to be used in other modules:  

* MelisCmsNewsService  
Services to retrieve lists of sliders, slider details and save sliders  
File: /melis-cms-slider/src/Service/MelisCmsSliderService.php  
```
// Get the service
$sliderService = $this->getServiceManager()->get('MelisCmsSliderService');  
// Get slider by id
$data = $sliderService->getSlider($sliderId);  
```

### MelisSlider Forms  

#### Forms factories
All Melis CMS Slider forms are built using Form Factories.  
All form configuration are available in the file: /melis-cms-slider/config/app.forms.php  
Any module can override or add items in this form by building the keys in an array and marge it in the Module.php config creation part.  
``` 
return array(
	'plugins' => array(

		// MelisCmsNews array
		'MelisCmsSlider' => array(

			// Form key
			'forms' => array(

				// MelisCmsNews Properties form
				'MelisTechnologySlider_details_form' => array(
					'attributes' => array(
						'name' => 'sliderDetailsForm',
						'id' => 'sliderDetailsForm',
						'enctype' => "multipart/form-data",
						'method' => 'POST',
						'action' => '',
					),
					'hydrator'  => 'Laminas\Stdlib\Hydrator\ArraySerializable',
					'elements' => array(  
						array(
							'spec' => array(
									...
							),
						),
					),
					'input_filter' => array(      
						'mcsdetail_id' => array(
								...
						),   
					),
				),
			), 
		),
	),
),
``` 

#### Forms elements
MelisCmsSlider provides form elements to be used in forms:  
* CmsSliderSelect: a dropdown to select a slider  


### Listening to services and update behavior with custom code  
Most services trigger events so that the behavior can be modified.  
```  
public function attach(EventManagerInterface $events)
{
    $sharedEvents      = $events->getSharedManager();
        
	$callBackHandler = $sharedEvents->attach(
		'MelisCmsSlider',
		array(
			'meliscmsslider_delete_details_end',    
		),
		function($e){

			$sm = $e->getTarget()->getEvent()->getApplication()->getServiceManager()
			$sm = $e->getTarget()->getEvent()->getApplication()->getServiceManager()
    		$params = $e->getParams();
    		
    		// Custom code here

    	},
    100);
    
    $this->listeners[] = $callBackHandler;
}
```  


## Authors

* **Melis Technology** - [www.melistechnology.com](https://www.melistechnology.com/)

See also the list of [contributors](https://github.com/melisplatform/melis-cms-slider/contributors) who participated in this project.


## License

This project is licensed under the OSL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details