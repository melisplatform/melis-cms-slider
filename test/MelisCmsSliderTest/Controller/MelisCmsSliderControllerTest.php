<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSliderTest\Controller;

use MelisCore\ServiceManagerGrabber;
use Zend\Test\PHPUnit\Controller\AbstractHttpControllerTestCase;
class MelisCmsSliderControllerTest extends AbstractHttpControllerTestCase
{
    protected $traceError = false;
    protected $sm;
    protected $method = 'save';

    public function setUp()
    {
        $this->sm  = new ServiceManagerGrabber();
    }

    /**
     * Get getSliderTable table
     * @return mixed
     */
    private function getSliderTable()
    {
        $conf = $this->sm->getPhpUnitTool()->getTable('MelisCmsSlider', __METHOD__);
        return $this->sm->getTableMock(new $conf['model'], $conf['model_table'], $conf['db_table_name'], $this->method);
    }
    /**
     * Get getSliderDetailsTable table
     * @return mixed
     */
    private function getSliderDetailsTable()
    {
        $conf = $this->sm->getPhpUnitTool()->getTable('MelisCmsSlider', __METHOD__);
        return $this->sm->getTableMock(new $conf['model'], $conf['model_table'], $conf['db_table_name'], $this->method);
    }


    public function getPayload($method)
    {
        return $this->sm->getPhpUnitTool()->getPayload('MelisCmsSlider', $method);
    }

    /**
     * START ADDING YOUR TESTS HERE
     */

    public function testFetchAllData()
    {
        $data1 = $this->getSliderTable()->fetchAll()->toArray();
        $data2 = $this->getSliderDetailsTable()->fetchAll()->toArray();
        $this->assertTrue((is_array($data1) && is_array($data2)));
    }

    public function testInsertData()
    {
        $payloads = $this->getPayload(__METHOD__);
        $this->method = 'fetchAll';
        // catch the insert id
        $id = $this->getSliderTable()->save($payloads['melis_cms_slider']);
        $this->getSliderDetailsTable()->save(array_merge($payloads['melis_cms_slider_details'], array('mcsdetail_mcslider_id'=> $id)));
    }


    public function testTableAccessWithPayloadFromConfig()
    {
        $payloads = $this->getPayload(__METHOD__);
        $sliderTable =  $payloads['melis_cms_slider'];
        $sliderDetailsTable =  $payloads['melis_cms_slider_details'];

        $data1 = $this->getSliderTable()->getEntryByField($sliderTable['column'], $sliderTable['value'])->current();
        $data2 = $this->getSliderDetailsTable()->getEntryByField($sliderDetailsTable['column'], $sliderDetailsTable['value'])->current();

        $this->assertTrue((!empty($data1) && !empty($data2)));
    }

    public function testRemoveData()
    {
        $payloads = $this->getPayload(__METHOD__);
        $sliderTable =  $payloads['melis_cms_slider'];
        $sliderDetailsTable =  $payloads['melis_cms_slider_details'];

        $this->method = 'fetchAll';
        $this->getSliderTable()->deleteByField($sliderTable['column'], $sliderTable['value']);
        $this->getSliderDetailsTable()->deleteByField($sliderDetailsTable['column'], $sliderDetailsTable['value']);
        $this->assertTrue(true);
    }



}

