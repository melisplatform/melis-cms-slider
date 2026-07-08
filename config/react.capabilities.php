<?php

/**
 * Capacités d'outils — droits avancés du back-office React (module MelisCmsSlider).
 *
 * Même convention que melis-commerce/config/react.capabilities.php : chaque module déclare
 * ICI les capacités de SES outils, par `melisKey`, dans la clé mergée `melisReactToolCapabilities`
 * (lue par MelisReactApi\Service\Capabilities). Fichier VOLONTAIREMENT séparé (pas dans
 * module.config.php) ; mergé dans MelisCmsSlider\Module::getConfig(). Default-allow : un outil
 * non déclaré, ou une capacité absente, reste permis.
 *
 * L'outil Slider est à TROIS niveaux d'édition imbriqués (comme Produits/Comptes de commerce) :
 *   1. Sliders    — la LISTE des sliders (SliderList)        → list/create/edit/delete/export
 *   2. Slides     — les SLIDES d'un slider (SliderEditor)    → list/create/edit/delete   (onglet `slides`)
 *   3. Slide      — le FORMULAIRE d'une slide (SlideEditor)  → onglets `properties` (contenu)
 *                                                              et `image` (upload/suppression)
 *
 * `Capabilities::flatten()` aplati cet arbre en clés `chemin` (accès à l'onglet) et
 * `chemin.action`, en chaîne complète : `slides`, `slides.create`, `slides.image`,
 * `slides.image.create`… — exactement les chaînes passées à `MelisCan(melisKey, cap)` côté React.
 *
 * Les `label` sont des clés de traduction Melis existantes (`tr_…`, résolues dans la locale
 * courante par rightsCapabilitiesAction). N'inclure QUE les actions réellement présentes.
 */

return [
    'melisReactToolCapabilities' => [
        // ⚠️ Clé = melisKey du NŒUD PORTEUR DE DROITS du menu (celui avec rights_checkbox_disable=false),
        // = `meliscms_slider_tools_section` (app.interface.php). C'est le `nodeKey = melisKey||key` que
        // RightsTreeView utilise pour rattacher les capacités — PAS `melis_cms_slider_tool` (garde
        // d'accès du contrôleur react-api, avec rights_checkbox_disable=true → pas de cases de droits).
        'meliscms_slider_tools_section' => [
            // Niveau 1 — liste des sliders (SliderList).
            'actions' => ['list', 'create', 'edit', 'delete', 'export'],
            'tabs' => [
                [
                    // Niveau 2 — slides d'un slider (SliderEditor). CRUD propre sur les slides.
                    'key' => 'slides', 'label' => 'tr_MelisCmsSliderDetails_save_title', // "Slides"
                    'actions' => ['list', 'create', 'edit', 'delete'], // pas d'export au niveau slides
                    'tabs' => [
                        // Niveau 3 — formulaire d'une slide (SlideEditor).
                        // Properties : accès au bloc contenu (titre / sous-titres / lien / statut).
                        ['key' => 'properties', 'label' => 'tr_MelisCmsSlider_content_tabs_properties'], // "Properties"
                        // Image : upload / suppression de l'image de la slide.
                        ['key' => 'image', 'label' => 'tr_MelisCmsSliderDetails_list_col_image', // "Image"
                            'actions' => ['create', 'delete']],
                    ],
                ],
            ],
        ],
    ],
];
