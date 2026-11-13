<?php

namespace MelisCmsSlider\Controller;

use Laminas\View\Model\JsonModel;
use Laminas\View\Model\ViewModel;
use MelisReactApi\Service\Capabilities;

/**
 * Action rights (React back-office "capabilities") for the LEGACY slider tool controllers.
 *
 * The rights editor lets an admin deny actions of the Slider tool (config/react.capabilities.php,
 * melisKey 'meliscms_slider_tools_section'), e.g. 'delete' or 'slides.delete'. Those denies live in
 * the user/role rights XML section '<meliscore_tool_capabilities>'. The React API enforced them, but
 * the legacy screens (/melis and the "Old" view inside React) ignored them, so a denied user could
 * still delete a slider there (Mantis #0011501). Enforced here, with the same action → capability
 * mapping as MelisReactApiCmsSliderController:
 *   - AJAX save/delete/reorder/list actions → error JsonModel when the capability is denied;
 *   - button-render actions → the framework's "no rights" view, so the button is not rendered.
 *
 * Default-allow + admin bypass, mirroring MelisReactApi\Controller\CapabilityGuardTrait. Soft
 * dependency on MelisReactApi (class_exists): a rights lookup must never fatal the tool.
 */
trait SliderCapabilityTrait
{
    /** Is a capability (e.g. 'delete', 'slides.create') allowed for the current user? Default-allow. */
    private function capAllowed(string $cap): bool
    {
        try {
            $sm   = $this->getServiceManager();
            $auth = $sm->get('MelisCoreAuth');
            if (!empty($auth->getIdentity()->usr_admin)) {
                return true; // admin ⇒ everything allowed
            }
            if (!class_exists(Capabilities::class)) {
                return true; // rights layer unavailable ⇒ don't block
            }
            return Capabilities::isAllowed(
                $sm->get('config'),
                (string) $auth->getAuthRights(),
                'meliscms_slider_tools_section',
                $cap
            );
        } catch (\Throwable) {
            return true;
        }
    }

    /** JSON refusal in the legacy tool's response shape (shown by melisKoNotification). */
    private function capDeniedJson(string $textTitle): JsonModel
    {
        $translator = $this->getServiceManager()->get('translator');
        return new JsonModel([
            'success'     => 0,
            'textTitle'   => $translator->translate($textTitle),
            'textMessage' => $translator->translate('tr_meliscore_microservice_api_key_no_access'),
            'errors'      => [],
            'datas'       => [],
        ]);
    }

    /** Empty DataTables answer for a list the user may not see. */
    private function capDeniedTable(): JsonModel
    {
        return new JsonModel([
            'draw' => (int) $this->getRequest()->getPost('draw', 0),
            'recordsTotal' => 0, 'recordsFiltered' => 0, 'data' => [],
        ]);
    }

    /**
     * View returned from a button-render action to HIDE the button when a capability is denied.
     *
     * Must be a ViewModel (NOT a Response): PluginViewController::generateRec() calls
     * $view->setVariable('zoneconfig', ...) on whatever the action returns. The framework's
     * rights-denied convention — `melis-core/plugin-view/disabled` + `norights` — makes generateRec
     * drop the zone, so the button is never echoed (same as the newsletter tool).
     */
    private function capHiddenView(): ViewModel
    {
        $view = new ViewModel();
        $view->setTemplate('melis-core/plugin-view/disabled');
        $view->setVariable('norights', true);
        return $view;
    }
}
