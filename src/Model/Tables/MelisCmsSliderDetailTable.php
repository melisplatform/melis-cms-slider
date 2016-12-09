<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Model\Tables;

use Zend\Db\TableGateway\TableGateway;

class MelisCmsSliderDetailTable extends MelisEcomGenericTable 
{
    protected $tableGateway;
    protected $idField;
    
    public function __construct(TableGateway $tableGateway)
    {
        parent::__construct($tableGateway);
        $this->idField = 'mcsdetail_id';
    }
    
    public function getSliderDetailsByOrder($sliderId, $status = null)
    {
        $select = $this->tableGateway->getSql()->select();
        $clause = array();
        
        $select->where('mcsdetail_mcslider_id ='.$sliderId);
        if(!is_null($status)){
            $select->where('mcsdetail_status ='.$status);
        }
        
        $select->order('mcsdetail_order ASC');
        
        $resultData = $this->tableGateway->selectWith($select);
        
        return $resultData;
    }
    
    public function getLastOrderNum($sliderId)
    {
        $select = $this->tableGateway->getSql()->select();
        $select->where('mcsdetail_mcslider_id ='.$sliderId);
        $select->order('mcsdetail_order DESC');
        $select->limit(1);
    
        $resultData = $this->tableGateway->selectWith($select);
    
        return $resultData;
    }
    
}