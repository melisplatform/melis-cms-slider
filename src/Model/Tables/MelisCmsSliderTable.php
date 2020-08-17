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

class MelisCmsSliderTable extends MelisGenericTable
{
    /**
     * Model table
     */
    const TABLE = 'melis_cms_slider';

    /**
     * Table primary key
     */
    const PRIMARY_KEY = 'mcslide_id';

    public function __construct()
    {
        $this->idField = self::PRIMARY_KEY;
    }

    public function getSliderList($start = null, $limit = null, $order = null, $search = null )
    {
        $select = $this->getTableGateway()->getSql()->select();
        $clause = array();
        
        if(!is_null($search)){
            $search = '%'.$search.'%';
            $select->where->NEST->like('mcslide_id', $search)
            ->or->like('mcslide_name', $search);
        }
        
        if(!is_null($start))
        {
            $select->offset((int) $start);
        }
        
        if (!is_null($limit)&&$limit!=-1)
        {
            $select->limit( (int) $limit);
        }
        
        if (!is_null($order))
        {
            $select->order($order);
        }
        
        $resultData = $this->getTableGateway()->selectWith($select);
        return $resultData;
    }
    
}