<?php

return array(
    'plugins' => array(
        'meliscmsslider' => array(
            'conf' => array(
                // user rights exclusions
                'rightsDisplay' => 'none',
            ),
            'plugins' => array(
                'MelisCmsSliderShowSliderPlugin' => array(
                    'front' => array(
                        'template_path' => 'MelisCmsSlider/showslider',
                        'id' => 'showslider',
                        'sliderId' => 1,
                    ),
                    'melis' => array(
                        
                    ),
                ),
             ),
        ),
     ),
);