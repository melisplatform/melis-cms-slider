<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Model\Tables;

use Zend\Db\TableGateway\TableGateway;

class MelisCmsSliderTable extends MelisEcomGenericTable 
{
    protected $tableGateway;
    protected $idField;
    
    public function __construct(TableGateway $tableGateway)
    {
        parent::__construct($tableGateway);
        $this->idField = 'mcslide_id';
    }
    
    public function getSliderList($start = null, $limit = null, $order = null, $search = null )
    {
        $select = $this->tableGateway->getSql()->select();
        $clause = array();
        
        if(!is_null($search)){
            $search = '%'.$search.'%';
            $select->where->NEST->like('mcslide_id', $search)
            ->or->like('mcslide_name', $search);
        }
        
        if (!is_null($start))
        {
            $select->offset($start);
        }
        
        if (!is_null($limit)&&$limit!=-1)
        {
            $select->limit($limit);
        }
        
        if (!is_null($order))
        {
            $select->order($order);
        }
        
        $resultData = $this->tableGateway->selectWith($select);
        return $resultData;
    }
    
}