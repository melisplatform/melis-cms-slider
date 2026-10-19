<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2016 Melis Technology (http://www.melistechnology.com)
 *
 */

namespace MelisCmsSlider\Validator;

use Laminas\Validator\AbstractValidator;

/**
 * Slide link safe for a front href: http(s), mailto, tel or a relative URL only.
 * Same rule as MelisReactApiCmsSliderController::isSafeUrl(): the legacy form saved
 * "javascript:…" links that the React tool refuses (Mantis #0011249).
 */
class SafeUrl extends AbstractValidator
{
    const UNSAFE = 'unsafeUrl';

    protected $messageTemplates = [
        self::UNSAFE => 'tr_MelisCmsSliderDetails_link_invalid',
    ];

    public function isValid($value)
    {
        $this->setValue($value);

        $url = trim((string) $value);
        if ($url === '') {
            return true;
        }

        // Hidden spaces/control characters in the scheme (e.g. "java\tscript:") are ignored by browsers
        $probe = preg_replace('/[\s\x00-\x1F\x7F]+/', '', $url);
        // No explicit scheme (":" before any "/", "?" or "#") → relative URL
        if (!preg_match('#^([a-zA-Z][a-zA-Z0-9+.\-]*):#', (string) $probe, $m)) {
            return true;
        }

        if (in_array(strtolower($m[1]), ['http', 'https', 'mailto', 'tel'], true)) {
            return true;
        }

        $this->error(self::UNSAFE);
        return false;
    }
}
