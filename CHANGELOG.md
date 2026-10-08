# Changelog

## v6.0.5 - 2026-10-05
### Security
* Page-editor: internationalize the React UI (was hardcoded French)
### Added
* **plugin-config:** full-React config tab for melis-cms-slider plugin
### Changed
* I18n: fix wrong-language values and mismatched keys in interface translations

## v6.0.4 - 2026-09-23
### Security
* **security:** parameterised SQL for date filters, ORDER BY and hand-quoted values (audit item 11.0)

## v6.0.3 - 2026-08-20
### Security
* Gate mutating/data actions in legacy tool controllers (CWE-862)
### Fixed
* **slider-react:** use the code-xml </> icon for the "New" toggle
### Docs
* **melisai:** React back-office AI documentation for MelisCmsSlider

## v6.0.1 - 2026-08-10
### Dependencies & build
* **composer:** update docs/homepage links, swap zf2 keyword for laminas, bump php constraint to ^8.3|^8.5
* **deps-dev:** bump postcss from 8.5.15 to 8.5.26 in /ui-react

## v6.0.0 - 2026-08-10
### Security
* **cms-slider:** validate slider id (path traversal) + harden upload filename; add SECURITY.md
* Fix audit findings
* **slider:** advanced rights capabilities (tree/edition) + persistent brick (no reload on tab switch)
### Added
* **marketplace:** add React back-office screenshots (etc/MarketPlace/images/react)
* **slider-react:** sliders and slides open as sub-tabs of the host bar
* **webservices:** translatable service description for the token WS listing
* **slider-react:** outil Slider responsive mobile + parité StripTags avec le legacy
* **cms-react:** listes infinies keyset + tri server-side + icones de tri unifiees
* **rights:** gate the Sliders list on open / rename / delete
* **react:** add a "Reset filters" button to the tool list page(s)
* **slider:** reflete le /:id du sous-onglet d'edition dans l'URL (cosmetique replaceState)
* **slider-react:** PagePicker pour lier une page au slider (arbre lazy legacy, champ optionnel)
* **react:** add slider editor UI (SliderEditor, SlideEditor, ExportModal, SliderList, ViewToggle, slider-api) + rebuild brick
* **react:** brique React melis-cms-slider (ui-react source + build)
* Add MelisAI module documentation for AI consumption
### Fixed
* **mobile:** touch-compatible column drag-and-drop, KPI icons, translate New/Old toggle
* **rights:** make Slider's API capability checks actually enforce
* **rights:** align the Slider menu node array key with its melisKey
* **react:** éviter que le popover Colonnes soit rogné en bas de viewport
* **slider-react:** panneaux colonnes/export scrollables (évite le débordement)
* **react:** keep the legacy "Old" view legacy (no more hijack to the React editor)
* **slider:** toggles statut vert(ON)/rouge(OFF)
* Fix 9355
### Changed
* Persist tabs after refresh
* Columns button in edit slider and fix tabs
* **react-api:** outil(s) React-API du module dans leur module (modularité)
### Dependencies & build
* **composer:** bump melis-core/melis-engine/melis-front/melis-cms constraint to ^6.0
* Local WIP snapshot before reconcile (20260806-114605)
* **brick:** rebuild brick ui-react + sync vite/package-lock
### Docs
* **meliscmsslider:** rewrite as two-part doc (functional guide + technical reference with examples)
* Rename slider screenshots to convention and sync doc

## v5.3.4 - 2025-11-26
### Changed
* Open tool in plugin modal issue fixed

## v5.3.3 - 2025-07-15
### Security
* Cast int value to avoid sql injection
### Fixed
* Fix issue on slider plugin
### Changed
* Update query

## v5.3.2 - 2025-01-16
### Fixed
* Fixed quote problem on fr translations

## v5.3.1 - 2025-01-15
### Added
* Added extension validator on slider image upload

## v5.3.0 - 2024-09-25
### Fixed
* Fix jQuery issue
### Changed
* Notice and fixed the issue while also fixing 6383
* Bs5 tab
* JQuery 3.7.1 migration
* Update on jQuery migration

## v5.2.0 - 2024-06-06
* Maintenance release.

## v5.1.0 - 2024-02-13
* Maintenance release.

## v5.0.1 - 2023-05-24
### Added
* Added script to update table to utf8mb4
### Changed
* Renamed file

## v5.0.0 - 2022-06-22
### Added
* Add select slider interface for cms blog
### Changed
* Changed deprecated ArraySerializable to ArraySerializableHydrator and updated other functions affected by php 8
