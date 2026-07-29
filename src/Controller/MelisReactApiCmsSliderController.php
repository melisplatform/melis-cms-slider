<?php

namespace MelisCmsSlider\Controller;

use MelisReactApi\Controller\CapabilityGuardTrait;

use Laminas\Http\PhpEnvironment\Response as HttpResponse;
use MelisCore\Controller\MelisAbstractActionController;
use MelisCore\Controller\MelisReactKeysetListTrait;

/**
 * API REST pour l'outil Slider de MelisCmsSlider
 * (tables melis_cms_slider + melis_cms_slider_details).
 *
 * Couche API (shared) du back-office React ; l'UI est livrée par une BRIQUE du module
 * MelisCmsSlider (gating modulaire). Calqué sur le gabarit full-React (SiteRedirect).
 *
 * Deux niveaux d'édition imbriqués : SLIDER (conteneur) > SLIDES (la liste de slides d'un
 * slider) > SLIDE (une slide individuelle).
 *
 * Routes :
 *   GET    /melis/react-api/sliders                      → liste des sliders (+ recherche, slideCount)
 *   GET    /melis/react-api/sliders/stats               → KPI (sliders, slides, slides actives)
 *   GET    /melis/react-api/sliders/:id                 → un slider
 *   POST   /melis/react-api/sliders/save                → créer / renommer un slider
 *   DELETE /melis/react-api/sliders/delete/:id          → supprimer un slider (+ slides + fichiers image)
 *   GET    /melis/react-api/sliders/:id/slides          → les slides d'un slider (ordonnées)
 *   POST   /melis/react-api/sliders/slides/reorder      → réordonner les slides ({sliderId, ids:[...]})
 *   POST   /melis/react-api/sliders/slide/upload        → uploader une image de slide (multipart) → { path }
 *   GET    /melis/react-api/sliders/slide/:id           → une slide
 *   POST   /melis/react-api/sliders/slide/save          → créer / modifier une slide
 *   DELETE /melis/react-api/sliders/slide/delete/:id    → supprimer une slide (+ reorder + fichier image)
 *
 * Contraintes métier (reprises du legacy MelisCmsSlider{List,Details}Controller) :
 *   - mcslide_name requis (≤ 255). mcslide_page_id optionnel (entier, NULL si vide).
 *   - slide : statut 0/1, ordre auto-calculé (max+1) si absent, image stockée sous
 *     /media/sliders/<sliderId>/<fichier> (extensions jpg,jpeg,gif,png,webp).
 *   - delete slider : supprime les slides, leurs fichiers image et le dossier.
 *   - delete slide : supprime le fichier image puis re-séquence l'ordre (1..n).
 */
class MelisReactApiCmsSliderController extends MelisAbstractActionController
{
    use CapabilityGuardTrait;
    use MelisReactKeysetListTrait;

    /** melisKey of the RIGHTS-BEARING menu node (rights_checkbox_disable=false) — same convention as
     *  MelisCmsNews / MelisCmsProspects / MelisCmsSiteRobot / MelisNewsletter. It serves BOTH uses of
     *  this constant: the canAccess() gate below and, via CapabilityGuardTrait, the capability lookup.
     *
     *  It used to be `melis_cms_slider_tool` — the wrapper, which is NOT where capabilities are
     *  declared (react.capabilities.php keys them on `meliscms_slider_tools_section`). Capabilities
     *  resolve through MELIS_KEY, and Capabilities::isAllowed is DEFAULT-ALLOW on an unknown tool, so
     *  every denyUnlessCan() in this controller silently passed: a non-admin denied edit/delete in the
     *  rights UI was still served by the API. The wrapper stays reachable either way — it is inferred
     *  from this granted child via configIsParentOf. */
    private const MELIS_KEY = 'meliscms_slider_tools_section';

    private const IMG_EXT = ['jpg', 'jpeg', 'gif', 'png', 'webp'];

    // ═══════════════════════════ NIVEAU SLIDER ═══════════════════════════

    /** GET /sliders */
    public function listAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('list')) { return $denyCap; }

        try {
            $limit  = min(9999, max(1, (int) $this->params()->fromQuery('limit', 25)));
            $search = trim((string) ($this->params()->fromQuery('search', '') ?? ''));
            $sort   = (string) $this->params()->fromQuery('sort', 'id');
            $dir    = (string) $this->params()->fromQuery('dir', 'desc');
            $after  = (string) $this->params()->fromQuery('after', '');

            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');

            // Filtres (garde le scoping recherche existant : nom OU id).
            $filterWhere  = [];
            $filterParams = [];
            if ($search !== '') {
                $like           = '%' . $search . '%';
                $filterWhere[]  = '(s.mcslide_name LIKE ? OR CAST(s.mcslide_id AS CHAR) LIKE ?)';
                $filterParams[] = $like;
                $filterParams[] = $like;
            }

            // slide_count via sous-requête corrélée (plus de GROUP BY → compatible keyset).
            $slideCountExpr = '(SELECT COUNT(*) FROM melis_cms_slider_details d WHERE d.mcsdetail_mcslider_id = s.mcslide_id)';

            // Colonnes triables (en-tête du tableau) → expr SQL NON-NULL.
            $sortMap = [
                'id'     => 's.mcslide_id',
                'name'   => "COALESCE(s.mcslide_name, '')",
                'page'   => 'COALESCE(s.mcslide_page_id, 0)',
                'slides' => "COALESCE($slideCountExpr, 0)",
            ];

            [$rows, $total, $next] = $this->keysetList([
                'db'           => $db,
                'from'         => 'melis_cms_slider s',
                'selectCols'   => "s.mcslide_id, s.mcslide_name, s.mcslide_page_id, $slideCountExpr AS slide_count",
                'filterWhere'  => $filterWhere,
                'filterParams' => $filterParams,
                'sortMap'      => $sortMap,
                'idCol'        => 's.mcslide_id',
                'idAlias'      => 'mcslide_id',
                'sortKey'      => $sort,
                'dir'          => $dir,
                'after'        => $after,
                'limit'        => $limit,
            ]);

            $items = [];
            foreach ($rows as $row) {
                $items[] = $this->formatSlider((array) $row);
            }

            return $this->jsonResponse([
                'success' => true,
                'data'    => ['items' => $items, 'total' => $total, 'nextCursor' => $next],
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** GET /sliders/stats */
    public function statsAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('list')) { return $denyCap; }

        try {
            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            $sliders = (int) (iterator_to_array($db->query('SELECT COUNT(*) AS n FROM melis_cms_slider', []))[0]['n'] ?? 0);
            $row = (array) (iterator_to_array($db->query(
                'SELECT COUNT(*) AS total, SUM(CASE WHEN mcsdetail_status = 1 THEN 1 ELSE 0 END) AS active
                 FROM melis_cms_slider_details',
                []
            ))[0] ?? []);

            return $this->jsonResponse([
                'success' => true,
                'data'    => [
                    'sliders' => $sliders,
                    'slides'  => (int) ($row['total'] ?? 0),
                    'active'  => (int) ($row['active'] ?? 0),
                ],
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** GET /sliders/:id */
    public function getAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('edit')) { return $denyCap; }

        $id = (int) $this->params()->fromRoute('id', 0);
        if ($id <= 0) {
            return $this->jsonResponse(['success' => false, 'error' => 'Invalid ID'], 400);
        }
        try {
            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            $rows = iterator_to_array($db->query(
                'SELECT mcslide_id, mcslide_name, mcslide_page_id FROM melis_cms_slider WHERE mcslide_id = ?',
                [$id]
            ));
            if (!$rows) {
                return $this->jsonResponse(['success' => false, 'error' => 'Not found'], 404);
            }
            return $this->jsonResponse(['success' => true, 'data' => $this->formatSlider((array) $rows[0])]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** POST /sliders/save */
    public function saveAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }

        try {
            $body = json_decode($this->getRequest()->getContent(), true) ?? [];
            $id   = isset($body['id']) && $body['id'] ? (int) $body['id'] : null;
            if ($denyCap = $this->denyUnlessCan($id ? 'edit' : 'create')) { return $denyCap; }

            $name   = trim((string) ($body['name'] ?? ''));
            $pageId = isset($body['pageId']) && $body['pageId'] !== '' && $body['pageId'] !== null
                ? (int) $body['pageId'] : null;

            if ($name === '') {
                return $this->jsonResponse(['success' => false, 'error' => 'Le nom du slider est obligatoire.'], 400);
            }
            if (mb_strlen($name) > 255) {
                return $this->jsonResponse(['success' => false, 'error' => 'Le nom dépasse 255 caractères.'], 400);
            }

            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');

            if ($id) {
                if (!iterator_to_array($db->query('SELECT mcslide_id FROM melis_cms_slider WHERE mcslide_id = ?', [$id]))) {
                    return $this->jsonResponse(['success' => false, 'error' => 'Not found'], 404);
                }
                $db->query(
                    'UPDATE melis_cms_slider SET mcslide_name = ?, mcslide_page_id = ? WHERE mcslide_id = ?',
                    [$name, $pageId, $id]
                );
                return $this->jsonResponse(['success' => true, 'data' => ['id' => $id]]);
            }

            $db->query(
                'INSERT INTO melis_cms_slider (mcslide_name, mcslide_page_id, mcslide_date) VALUES (?, ?, NOW())',
                [$name, $pageId]
            );
            $newId = (int) iterator_to_array($db->query('SELECT LAST_INSERT_ID() AS id', []))[0]['id'];
            return $this->jsonResponse(['success' => true, 'data' => ['id' => $newId]], 201);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** DELETE /sliders/delete/:id */
    public function deleteAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('delete')) { return $denyCap; }

        $id = (int) $this->params()->fromRoute('id', 0);
        if ($id <= 0) {
            return $this->jsonResponse(['success' => false, 'error' => 'Invalid ID'], 400);
        }
        try {
            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            if (!iterator_to_array($db->query('SELECT mcslide_id FROM melis_cms_slider WHERE mcslide_id = ?', [$id]))) {
                return $this->jsonResponse(['success' => false, 'error' => 'Not found'], 404);
            }

            // Supprimer les fichiers image des slides puis le dossier (parité legacy).
            $slides = iterator_to_array($db->query(
                'SELECT mcsdetail_img FROM melis_cms_slider_details WHERE mcsdetail_mcslider_id = ?',
                [$id]
            ));
            foreach ($slides as $s) {
                $this->deleteImageFile((string) ($s['mcsdetail_img'] ?? ''));
            }
            $dir = $this->publicRoot() . '/media/sliders/' . $id;
            if (is_dir($dir)) { @rmdir($dir); }

            $db->query('DELETE FROM melis_cms_slider_details WHERE mcsdetail_mcslider_id = ?', [$id]);
            $db->query('DELETE FROM melis_cms_slider WHERE mcslide_id = ?', [$id]);

            return $this->jsonResponse(['success' => true, 'data' => null]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    // ═══════════════════════════ NIVEAU SLIDES ═══════════════════════════

    /** GET /sliders/:id/slides */
    public function slidesAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('list')) { return $denyCap; }

        $sliderId = (int) $this->params()->fromRoute('id', 0);
        if ($sliderId <= 0) {
            return $this->jsonResponse(['success' => false, 'error' => 'Invalid slider ID'], 400);
        }
        try {
            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            $rows = $db->query(
                'SELECT mcsdetail_id, mcsdetail_mcslider_id, mcsdetail_status, mcsdetail_title,
                        mcsdetail_sub1, mcsdetail_sub2, mcsdetail_sub3, mcsdetail_link,
                        mcsdetail_img, mcsdetail_order
                 FROM melis_cms_slider_details
                 WHERE mcsdetail_mcslider_id = ?
                 ORDER BY mcsdetail_order ASC, mcsdetail_id ASC',
                [$sliderId]
            );
            $items = [];
            foreach ($rows as $row) {
                $items[] = $this->formatSlide((array) $row);
            }
            return $this->jsonResponse(['success' => true, 'data' => ['items' => $items, 'total' => count($items)]]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** POST /sliders/slides/reorder  body: { sliderId, ids:[id,...] } */
    public function reorderAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('edit')) { return $denyCap; }

        try {
            $body     = json_decode($this->getRequest()->getContent(), true) ?? [];
            $sliderId = (int) ($body['sliderId'] ?? 0);
            $ids      = array_values(array_filter(array_map('intval', (array) ($body['ids'] ?? []))));
            if ($sliderId <= 0 || !$ids) {
                return $this->jsonResponse(['success' => false, 'error' => 'sliderId et ids requis.'], 400);
            }
            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            $order = 1;
            foreach ($ids as $sid) {
                $db->query(
                    'UPDATE melis_cms_slider_details SET mcsdetail_order = ? WHERE mcsdetail_id = ? AND mcsdetail_mcslider_id = ?',
                    [$order, $sid, $sliderId]
                );
                $order++;
            }
            return $this->jsonResponse(['success' => true, 'data' => null]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    // ═══════════════════════════ NIVEAU SLIDE ═══════════════════════════

    /** GET /sliders/slide/:id */
    public function slideGetAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('edit')) { return $denyCap; }

        $id = (int) $this->params()->fromRoute('id', 0);
        if ($id <= 0) {
            return $this->jsonResponse(['success' => false, 'error' => 'Invalid ID'], 400);
        }
        try {
            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            $rows = iterator_to_array($db->query(
                'SELECT mcsdetail_id, mcsdetail_mcslider_id, mcsdetail_status, mcsdetail_title,
                        mcsdetail_sub1, mcsdetail_sub2, mcsdetail_sub3, mcsdetail_link,
                        mcsdetail_img, mcsdetail_order
                 FROM melis_cms_slider_details WHERE mcsdetail_id = ?',
                [$id]
            ));
            if (!$rows) {
                return $this->jsonResponse(['success' => false, 'error' => 'Not found'], 404);
            }
            return $this->jsonResponse(['success' => true, 'data' => $this->formatSlide((array) $rows[0])]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** POST /sliders/slide/save */
    public function slideSaveAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }

        try {
            $body     = json_decode($this->getRequest()->getContent(), true) ?? [];
            $id       = isset($body['id']) && $body['id'] ? (int) $body['id'] : null;
            if ($denyCap = $this->denyUnlessCan($id ? 'edit' : 'create')) { return $denyCap; }

            $sliderId = (int) ($body['sliderId'] ?? 0);
            if ($sliderId <= 0) {
                return $this->jsonResponse(['success' => false, 'error' => 'sliderId obligatoire.'], 400);
            }

            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            if (!iterator_to_array($db->query('SELECT mcslide_id FROM melis_cms_slider WHERE mcslide_id = ?', [$sliderId]))) {
                return $this->jsonResponse(['success' => false, 'error' => 'Slider introuvable.'], 400);
            }

            $status = (int) (!empty($body['status']) ? 1 : 0);
            $title  = mb_substr(trim((string) ($body['title'] ?? '')), 0, 255);
            $sub1   = mb_substr(trim((string) ($body['sub1'] ?? '')), 0, 255);
            $sub2   = (string) ($body['sub2'] ?? '');
            $sub3   = (string) ($body['sub3'] ?? '');
            $link   = trim((string) ($body['link'] ?? ''));
            $img    = trim((string) ($body['img'] ?? ''));

            if ($id) {
                if (!iterator_to_array($db->query('SELECT mcsdetail_id FROM melis_cms_slider_details WHERE mcsdetail_id = ?', [$id]))) {
                    return $this->jsonResponse(['success' => false, 'error' => 'Not found'], 404);
                }
                $db->query(
                    'UPDATE melis_cms_slider_details
                     SET mcsdetail_status = ?, mcsdetail_title = ?, mcsdetail_sub1 = ?, mcsdetail_sub2 = ?,
                         mcsdetail_sub3 = ?, mcsdetail_link = ?, mcsdetail_img = ?
                     WHERE mcsdetail_id = ?',
                    [$status, $title, $sub1, $sub2, $sub3, $link, $img, $id]
                );
                return $this->jsonResponse(['success' => true, 'data' => ['id' => $id]]);
            }

            // Création : ordre = max(order) + 1 pour ce slider.
            $maxOrder = (int) (iterator_to_array($db->query(
                'SELECT COALESCE(MAX(mcsdetail_order), 0) AS m FROM melis_cms_slider_details WHERE mcsdetail_mcslider_id = ?',
                [$sliderId]
            ))[0]['m'] ?? 0);
            $order = isset($body['order']) && $body['order'] !== '' && $body['order'] !== null
                ? (int) $body['order'] : ($maxOrder + 1);

            $db->query(
                'INSERT INTO melis_cms_slider_details
                    (mcsdetail_mcslider_id, mcsdetail_status, mcsdetail_title, mcsdetail_sub1,
                     mcsdetail_sub2, mcsdetail_sub3, mcsdetail_link, mcsdetail_img, mcsdetail_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [$sliderId, $status, $title, $sub1, $sub2, $sub3, $link, $img, $order]
            );
            $newId = (int) iterator_to_array($db->query('SELECT LAST_INSERT_ID() AS id', []))[0]['id'];
            return $this->jsonResponse(['success' => true, 'data' => ['id' => $newId]], 201);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** DELETE /sliders/slide/delete/:id */
    public function slideDeleteAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('delete')) { return $denyCap; }

        $id = (int) $this->params()->fromRoute('id', 0);
        if ($id <= 0) {
            return $this->jsonResponse(['success' => false, 'error' => 'Invalid ID'], 400);
        }
        try {
            $db = $this->getServiceManager()->get('Laminas\Db\Adapter\AdapterInterface');
            $rows = iterator_to_array($db->query(
                'SELECT mcsdetail_id, mcsdetail_mcslider_id, mcsdetail_img FROM melis_cms_slider_details WHERE mcsdetail_id = ?',
                [$id]
            ));
            if (!$rows) {
                return $this->jsonResponse(['success' => false, 'error' => 'Not found'], 404);
            }
            $slide    = (array) $rows[0];
            $sliderId = (int) $slide['mcsdetail_mcslider_id'];

            $db->query('DELETE FROM melis_cms_slider_details WHERE mcsdetail_id = ?', [$id]);

            // Re-séquencer l'ordre des slides restantes (1..n) — parité legacy.
            $remaining = iterator_to_array($db->query(
                'SELECT mcsdetail_id FROM melis_cms_slider_details
                 WHERE mcsdetail_mcslider_id = ? ORDER BY mcsdetail_order ASC, mcsdetail_id ASC',
                [$sliderId]
            ));
            $order = 1;
            foreach ($remaining as $r) {
                $db->query('UPDATE melis_cms_slider_details SET mcsdetail_order = ? WHERE mcsdetail_id = ?',
                    [$order, (int) $r['mcsdetail_id']]);
                $order++;
            }

            $this->deleteImageFile((string) ($slide['mcsdetail_img'] ?? ''));

            return $this->jsonResponse(['success' => true, 'data' => null]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    /** POST /sliders/slide/upload  (multipart: field "image", query/post sliderId) → { path } */
    public function slideUploadAction(): HttpResponse
    {
        if ($deny = $this->denyUnlessAccess()) { return $deny; }
        if ($denyCap = $this->denyUnlessCan('edit')) { return $denyCap; }

        try {
            $sliderId = (int) ($this->params()->fromQuery('sliderId', 0) ?: $this->params()->fromPost('sliderId', 0));
            if ($sliderId <= 0) {
                return $this->jsonResponse(['success' => false, 'error' => 'sliderId obligatoire.'], 400);
            }
            $files = $this->getRequest()->getFiles()->toArray();
            $file  = $files['image'] ?? null;
            if (!$file || empty($file['name']) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
                return $this->jsonResponse(['success' => false, 'error' => 'Aucun fichier reçu.'], 400);
            }

            $ext = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, self::IMG_EXT, true)) {
                return $this->jsonResponse(['success' => false, 'error' => 'Extension non autorisée (jpg, jpeg, gif, png, webp).'], 400);
            }
            // Sécurité basique : doit être une vraie image.
            $info = @getimagesize((string) $file['tmp_name']);
            if ($info === false) {
                return $this->jsonResponse(['success' => false, 'error' => 'Le fichier n’est pas une image valide.'], 400);
            }

            $dir = $this->publicRoot() . '/media/sliders/' . $sliderId;
            if (!is_dir($dir) && !@mkdir($dir, 0777, true) && !is_dir($dir)) {
                return $this->jsonResponse(['success' => false, 'error' => 'Impossible de créer le dossier d’upload (droits).'], 500);
            }

            // Nom de fichier : espaces → "_", déduplication par suffixe _1, _2…
            $base = preg_replace('/\s+/', '_', pathinfo((string) $file['name'], PATHINFO_FILENAME));
            $base = preg_replace('/[^A-Za-z0-9_\-]/', '', (string) $base) ?: 'image';
            $filename = $base . '.' . $ext;
            $i = 1;
            while (file_exists($dir . '/' . $filename)) {
                $filename = $base . '_' . $i . '.' . $ext;
                $i++;
            }

            if (!@move_uploaded_file((string) $file['tmp_name'], $dir . '/' . $filename)) {
                // Fallback (certains environnements) : copie simple.
                if (!@copy((string) $file['tmp_name'], $dir . '/' . $filename)) {
                    return $this->jsonResponse(['success' => false, 'error' => 'Échec de l’écriture du fichier (droits).'], 500);
                }
            }
            @chmod($dir . '/' . $filename, 0664);

            $webPath = '/media/sliders/' . $sliderId . '/' . $filename;
            return $this->jsonResponse(['success' => true, 'data' => ['path' => $webPath]], 201);
        } catch (\Throwable $e) {
            return $this->errorResponse($e);
        }
    }

    // ═══════════════════════════ Helpers ═══════════════════════════

    private function formatSlider(array $r): array
    {
        return [
            'id'         => (int) $r['mcslide_id'],
            'name'       => (string) ($r['mcslide_name'] ?? ''),
            'pageId'     => isset($r['mcslide_page_id']) && $r['mcslide_page_id'] !== null ? (int) $r['mcslide_page_id'] : null,
            'slideCount' => isset($r['slide_count']) ? (int) $r['slide_count'] : 0,
        ];
    }

    private function formatSlide(array $r): array
    {
        return [
            'id'       => (int) $r['mcsdetail_id'],
            'sliderId' => (int) $r['mcsdetail_mcslider_id'],
            'status'   => (int) $r['mcsdetail_status'],
            'title'    => (string) ($r['mcsdetail_title'] ?? ''),
            'sub1'     => (string) ($r['mcsdetail_sub1'] ?? ''),
            'sub2'     => (string) ($r['mcsdetail_sub2'] ?? ''),
            'sub3'     => (string) ($r['mcsdetail_sub3'] ?? ''),
            'link'     => (string) ($r['mcsdetail_link'] ?? ''),
            'img'      => (string) ($r['mcsdetail_img'] ?? ''),
            'order'    => (int) $r['mcsdetail_order'],
        ];
    }

    /** Racine du dossier public (où sont servies les images). */
    private function publicRoot(): string
    {
        $cfg = $this->getServiceManager()->get('config');
        $root = $cfg['melis_project_root'] ?? getcwd();
        return rtrim((string) $root, '/\\') . '/public';
    }

    /** Supprime un fichier image (chemin web relatif, ex /media/sliders/5/x.png) sous public/. */
    private function deleteImageFile(string $webPath): void
    {
        $webPath = trim($webPath);
        if ($webPath === '') { return; }
        $abs = $this->publicRoot() . '/' . ltrim($webPath, '/');
        // Garde-fou : rester sous public/media/sliders/
        $base = $this->publicRoot() . '/media/sliders/';
        if (strpos($abs, $base) !== 0) { return; }
        if (is_file($abs)) { @chmod($abs, 0777); @unlink($abs); }
    }

    private function isAuthenticated(): bool
    {
        return $this->getServiceManager()->get('MelisCoreAuth')->hasIdentity();
    }

    /** Garde de droits : session + accès à l'outil (melisKey). 401/403/null. */
    private function denyUnlessAccess(): ?HttpResponse
    {
        if (!$this->isAuthenticated()) {
            return $this->jsonResponse(['success' => false, 'error' => 'Unauthenticated'], 401);
        }
        try {
            if (!$this->getServiceManager()->get('MelisCoreRights')->canAccess(self::MELIS_KEY)) {
                return $this->jsonResponse(['success' => false, 'error' => 'Forbidden'], 403);
            }
        } catch (\Throwable) {}
        return null;
    }

    private function jsonResponse(array $data, int $status = 200): HttpResponse
    {
        /** @var HttpResponse $response */
        $response = $this->getResponse();
        $response->setStatusCode($status);
        $response->getHeaders()->addHeaders([
            'Content-Type'           => 'application/json; charset=utf-8',
            'X-Content-Type-Options' => 'nosniff',
        ]);
        $response->setContent(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        return $response;
    }

    private function errorResponse(\Throwable $e, int $status = 500): HttpResponse
    {
        return $this->jsonResponse([
            'success' => false,
            'error'   => $e->getMessage(),
            'file'    => basename($e->getFile()) . ':' . $e->getLine(),
        ], $status);
    }
}
