<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Model\Tables;

use Laminas\Db\TableGateway\TableGateway;
use MelisEngine\Model\Tables\MelisGenericTable;

class MelisCmsSliderDetailTable extends MelisGenericTable
{
    /**
     * Model table
     */
    const TABLE = 'melis_cms_slider_details';

    /**
     * Table primary key
     */
    const PRIMARY_KEY = 'mcsdetail_id';

    public function __construct()
    {
        $this->idField = self::PRIMARY_KEY;
    }

    public function getSliderDetailsByOrder($sliderId, $status = null)
    {
        $select = $this->getTableGateway()->getSql()->select();
        $clause = array();
        
        $select->where('mcsdetail_mcslider_id ='.$sliderId);
        if(!is_null($status)){
            $select->where('mcsdetail_status ='.$status);
        }
        
        $select->order('mcsdetail_order ASC');
        
        $resultData = $this->getTableGateway()->selectWith($select);
        
        return $resultData;
    }
    
    public function getLastOrderNum($sliderId)
    {
        $select = $this->getTableGateway()->getSql()->select();
        $select->where('mcsdetail_mcslider_id ='.$sliderId);
        $select->order('mcsdetail_order DESC');
        $select->limit(1);
    
        $resultData = $this->getTableGateway()->selectWith($select);
    
        return $resultData;
    }
}