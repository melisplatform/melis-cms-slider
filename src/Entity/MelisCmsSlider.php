<?php 

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Entity;

class MelisCmsSlider
{
	protected $id;
	protected $slider;
	protected $sliderDetails;
 
	public function getId()
	{
	    return $this->id;
	}
	
	public function setId($id)
	{
	    $this->id = $id;
	}
	
	public function getSlider()
	{
	    return $this->slider;
	}
	
	public function setSlider($slider)
	{
	    $this->slider = $slider;
	}
	
	public function getSliderDetails()
	{
	    return $this->sliderDetails;
	}
	
	public function setSliderDetails($sliderDetails)
	{
	    $this->sliderDetails = $sliderDetails;
	}
	
    public function getArrayCopy()
    {
        return get_object_vars($this);
    }
}