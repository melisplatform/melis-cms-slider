---
title: MelisCmsSlider module
package: melisplatform/melis-cms-slider
doc_type: module-documentation
audience: [users, developers, ai]
language: en
module_version: unversioned
last_reviewed: 2026-06-08
maintainer: Melis Technology
keywords: [slider, carousel, slides, cms, melis, back-office, plugin, templating, show-slider]
screenshots_dir: ./images
---

# MelisCmsSlider — Functional & Technical Documentation (for AI)

> **What this is.** MelisCmsSlider is the **slider / carousel** system of the Melis platform: a
> back-office tool to build sliders (named carousels made of ordered slides — image, title,
> subtitles, link), and a **content block** to display a chosen slider on any page. It also
> provides a reusable **slider picker** that other modules (News, Blog) embed.
>
> **Two parts:** **[Part A — Functional Guide](#part-a--functional-guide)** (users) ·
> **[Part B — Technical Reference](#part-b--technical-reference)** (developers/AI, with examples).
> Consumed by the **MelisAI** MCP; the **[Screenshot index](#screenshot-index)** maps filenames.
> Reviewed 2026-06-08.

---
---

# PART A — Functional Guide

## A1. What MelisCmsSlider lets you do

- **Build sliders** — a slider is a named carousel; each **slide** has an image, a title, up to
  three subtitles, a link and a position in the carousel.
- **Reorder slides** by drag-and-drop, and turn individual slides on/off.
- **Show a slider on the site** — drop the **Show Slider** block onto a page and pick which
  slider to display.

## A2. The Slider tool (back-office) — a 3-level drill-down

**Where:** back-office left menu → **CMS** tools → **Slider manager** (image icon).

The tool works in three levels: **list of sliders → a slider's slides → a slide**.

### Level 1 — the list of sliders

You see **every slider on the platform** (sliders are global — they aren't tied to a single
site; a slider can optionally be linked to a page). Filter by limit/search; each row has
**Edit/open**, **Info** and **Delete**.

![Slider list](./images/meliscmsslider-tool-slider-list.png)
*Every slider on the platform — open one to manage its slides.*

To **create a slider**, click **Add**: a small modal asks for the slider's **name** and an
optional **landing page**. (The same modal renames an existing slider.)

![Create / rename slider](./images/meliscmsslider-tool-slider-new.png)
*The create/rename-slider modal — name + optional page.*

### Level 2 — inside a slider: its slides

Opening a slider lands on **its own page**: a Properties tab holding the **list of that slider's
slides** (order, status, image, title, subtitle, link), with **Add slide** and drag-to-reorder.

![A slider's slides](./images/meliscmsslider-tool-slider-edit-slidelist-tab-properties.png)
*A slider's page — the list of its slides, with add and drag-to-reorder.*

### Level 3 — editing a slide

Each slide is created/edited in a **modal**: upload its image, enter the title, the three
subtitles, the link and its order.

![Add / edit a slide](./images/meliscmsslider-tool-slider-edit-properties-slide-edit.png)
*The add/edit-slide modal — image, title, subtitles, link, order.*

## A3. Showing a slider on your website — the Show Slider block

From the **page editor** (MelisCms → Edition tab → plugins menu), drop the **Show Slider** block
onto a page.

![Show Slider in the plugin selector](./images/meliscmsslider-page-menu-plugins-selector.png)

Its settings (Properties tab) let you pick the **rendering template** and **which slider** to
display (with a shortcut to jump to the Slider manager).

![Show Slider — settings](./images/meliscmsslider-page-plugin-slider-config-properties-tab.png)
*Show Slider settings — choose the template and the slider to show.*

## A4. Used by other modules

When **MelisCmsNews** (or a Blog module) is installed, the same **slider picker** appears on a
news article / blog post so you can attach a slider to it. The slider tool itself works fully on
its own regardless.

## A5. Common tasks — "How do I…?"

- **Create a slider** → Slider manager → **Add** → name it → open it → **Add slide** for each image.
- **Reorder slides** → drag them in the slider's slide list.
- **Hide a slide temporarily** → toggle its status off.
- **Put a slider on a page** → page editor → Edition → drag **Show Slider** → pick the slider.

---
---

# PART B — Technical Reference

## B1. Metadata & dependencies

| Item | Value |
|---|---|
| Package | `melisplatform/melis-cms-slider` · category `cms` · namespace `MelisCmsSlider\` · dbdeploy |
| Requires | `melis-core`, `melis-engine`, `melis-front`, `melis-cms` (`^5.2`) |

## B2. Data model

| Table | Role | PK |
|---|---|---|
| `melis_cms_slider` | The slider container (`mcslide_name`, `mcslide_page_id`, `mcslide_date`) | `mcslide_id` |
| `melis_cms_slider_details` | A slide (status, image, title, sub1-3, link, order) — FK `mcsdetail_mcslider_id` | `mcsdetail_id` |

Gateways: `MelisCmsSliderTable`, `MelisCmsSliderDetailTable`. The tool's two DataTables are in
`config/app.tools.php`; the slide form in `config/app.forms.php` (fields `mcsdetail_title`,
`mcsdetail_sub1..3`, `mcsdetail_link`, `mcsdetail_img`, `mcsdetail_order`).

## B3. The service `MelisCmsSliderService` (with examples)

```php
$slider = $this->getServiceManager()->get('MelisCmsSliderService');

$one    = $slider->getSlider($sliderId, 1);          // container + active slides (status=1)
$byPage = $slider->getSliderByPageId($pageId, 1);    // the slider linked to a page
$list   = $slider->getSliderList(0, 10, 'mcslide_id', null);

$id     = $slider->saveSlider($data, $sliderId);            // create/update a slider
$did    = $slider->saveSliderDetails($slideData, $detailId);// create/update a slide
$slider->updateSliderDetailsOrdering($detailId, $newOrder); // reorder a slide
$slider->deleteSlider($sliderId);                           // delete slider + all its slides
```

`getSlider` / `getSliderByPageId` return a `MelisCmsSlider` entity (`src/Entity/`) with
`getSlider()` (container row) and `getSliderDetails()` (the slides). Methods:
`getSliderList`, `getSlider`, `getSliderDetails`, `getSliderByPageId`, `saveSlider`,
`saveSliderDetails`, `deleteSlider`, `deleteSliderDetails`, `updateSliderDetailsOrdering`.

**Events** (extend `MelisGeneralService`): each method fires `meliscmsslider_service_*_start`/`_end`.
⚠ Accuracy note: in the current source a few write methods **reuse** another method's event names
— `saveSlider` fires the `get_slider_details` events, and `deleteSliderDetails` /
`updateSliderDetailsOrdering` reuse `deleteSlider`'s `delete_details` events. So a listener on
`meliscmsslider_service_delete_details_end` also fires on reorders. Documented as-is.

```php
$sharedEvents->attach('MelisCmsSlider', 'meliscmsslider_service_delete_details_end', $fn, 50);
```

Micro-services (`config/app.microservice.php`) expose `getSliderList`, `getSlider`,
`getSliderDetails`, `getSliderByPageId`.

## B4. The Show Slider plugin & the reusable picker

- **Plugin**: `MelisCmsSliderShowSliderPlugin` (controller plugin) + view helper
  `MelisCmsSliderPlugin`, template `view/melis-cms-slider/plugins/showslider.phtml`, config
  `config/plugins/MelisCmsSliderShowSliderPlugin.config.php` (one **Properties** tab:
  `template_path`, `sliderId`). Extends engine's `MelisTemplatingPlugin`.
- **Reusable picker**: the `CmsSliderSelect` form element (`src/Form/Factory/CmsSliderSelectFactory.php`)
  and the `meliscmsslider_select_slider` interface (`renderSelectSliderAction`) — what News/Blog
  embed to attach a slider. A blog variant: `meliscmsslider_select_slider_blog`.

## B5. Controllers, listeners, cross-module

- Controllers: `MelisCmsSliderListController` (sliders list + create/rename modal),
  `MelisCmsSliderDetailsController` (slides list, add/edit/delete/reorder, image upload to
  `/media/sliders/`), `MelisSetupController`.
- Listeners: flash messenger, micro-service, table-column, tool-creator (back-office only).
- **Consumers**: News persists the chosen slider in `cnews_slider_id` and ships a listener that
  detaches a deleted slider from any news using it; Blog uses `cblog_slider_id`.

## B6. Quick code map

```
melis-cms-slider/
├── config/   module.config.php · app.interface.php · app.tools.php (2 tables) · app.forms.php
│            · app.microservice.php · plugins/MelisCmsSliderShowSliderPlugin.config.php
├── src/   Controller/ (List, Details, Setup, Plugin/Show) · Service/MelisCmsSliderService
│        · Entity/MelisCmsSlider · Model/Tables/ · Listener/ · Form/Factory/CmsSliderSelectFactory
│        · View/Helper/MelisCmsSliderHelper
├── view/ · public/ (tool JS/CSS + bootstrap-switch) · language/ · install/ (SQL)
└── etc/   MarketPlace + MelisAI/doc (this doc)
```

---

## Screenshot index

| Image file | Content |
|---|---|
| `meliscmsslider-tool-slider-list.png` | Slider list — every slider on the platform |
| `meliscmsslider-tool-slider-new.png` | Create/rename-slider modal (name + page) |
| `meliscmsslider-tool-slider-edit-slidelist-tab-properties.png` | A slider's page — its slide list |
| `meliscmsslider-tool-slider-edit-properties-slide-edit.png` | Add/edit-slide modal |
| `meliscmsslider-page-menu-plugins-selector.png` | Show Slider in the page editor's selector |
| `meliscmsslider-page-plugin-slider-config-properties-tab.png` | Show Slider — settings (template + slider) |

---

*Document for AI consumption (MelisAI MCP) — `melisplatform/melis-cms-slider`. Part A = functional;
Part B = technical with examples. Last reviewed 2026-06-08.*
