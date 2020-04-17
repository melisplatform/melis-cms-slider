<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Controller;

use Laminas\View\Model\ViewModel;
use Laminas\View\Model\JsonModel;
use Laminas\Validator\File\Size;
use Laminas\Validator\File\IsImage;
use Laminas\Validator\File\Upload;
use Laminas\File\Transfer\Adapter\Http;
use Laminas\Session\Container;
use MelisCore\Controller\AbstractActionController;

class MelisSetupController extends AbstractActionController
{
    public function setupFormAction()
    {
        return null;

    }

    public function setupResultAction()
    {
        return null;
    }
}