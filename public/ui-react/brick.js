(function(react, react_jsx_runtime) {
	//#region src/slider-api.ts
	/**
	* Client de l'API Slider pour la brique MelisCmsSlider.
	*
	* Appelle la couche REST partagée (module MelisReactApi) :
	*   /melis/react-api/sliders[/...]
	* Contrat `{ success, data, error }` (comme les outils natifs). La brique ne peut pas
	* importer les modules de l'hôte (`@/lib/...`) — ce client est donc autonome.
	*
	* Deux niveaux imbriqués : SLIDER (conteneur) > SLIDE (détail).
	*/
	var XHR_HEADER = { "X-Requested-With": "XMLHttpRequest" };
	async function apiFetch(url, opts) {
		const res = await fetch(url, {
			...opts,
			headers: {
				...XHR_HEADER,
				...opts?.headers ?? {}
			},
			credentials: "include"
		});
		if (!res.ok) {
			let msg = `HTTP ${res.status}`;
			try {
				const d = await res.json();
				if (d.error) msg = d.error;
			} catch {}
			throw new Error(msg);
		}
		const data = await res.json();
		if (!data.success) throw new Error(data.error ?? "API error");
		return data.data;
	}
	var BASE = "/melis/react-api/sliders";
	async function fetchSliders(params = {}) {
		const qs = new URLSearchParams();
		qs.set("limit", String(params.limit ?? 25));
		if (params.search) qs.set("search", params.search);
		if (params.sort) qs.set("sort", params.sort);
		if (params.dir) qs.set("dir", params.dir);
		if (params.after) qs.set("after", params.after);
		return apiFetch(`${BASE}?${qs}`);
	}
	async function fetchSliderStats() {
		return apiFetch(`${BASE}/stats`);
	}
	async function fetchSlider(id) {
		return apiFetch(`${BASE}/${id}`);
	}
	async function saveSlider(payload) {
		return apiFetch(`${BASE}/save`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
	}
	async function deleteSlider(id) {
		await apiFetch(`${BASE}/delete/${id}`, { method: "DELETE" });
	}
	async function fetchSlides(sliderId) {
		return apiFetch(`${BASE}/${sliderId}/slides`);
	}
	async function fetchSlide(id) {
		return apiFetch(`${BASE}/slide/${id}`);
	}
	async function saveSlide(payload) {
		return apiFetch(`${BASE}/slide/save`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
	}
	async function deleteSlide(id) {
		await apiFetch(`${BASE}/slide/delete/${id}`, { method: "DELETE" });
	}
	async function reorderSlides(sliderId, ids) {
		await apiFetch(`${BASE}/slides/reorder`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				sliderId,
				ids
			})
		});
	}
	/** Upload multipart d'une image de slide → chemin web stocké (/media/sliders/<id>/<fichier>). */
	async function uploadSlideImage(sliderId, file) {
		const fd = new FormData();
		fd.append("image", file);
		return apiFetch(`${BASE}/slide/upload?sliderId=${sliderId}`, {
			method: "POST",
			body: fd
		});
	}
	var _stale = false;
	function markSliderListStale() {
		_stale = true;
	}
	function consumeSliderListStale() {
		const s = _stale;
		_stale = false;
		return s;
	}
	//#endregion
	//#region src/ui.tsx
	function currentLang$1() {
		return (document.documentElement.lang || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
	}
	var DICT$1 = {
		fr: {
			title: "Sliders",
			subtitle: "Carrousels et leurs slides",
			new: "Nouveau slider",
			search: "Rechercher un slider…",
			empty: "Aucun slider trouvé",
			count: "{n} sliders — fin de la liste",
			kpi_sliders: "Sliders",
			kpi_slides: "Slides",
			kpi_active: "Slides actives",
			col_id: "ID",
			col_name: "Nom",
			col_page: "Page liée",
			col_slides: "Slides",
			columns: "Colonnes",
			export: "Exporter",
			cols_visible: "Visibles",
			cols_hidden: "Masquées",
			drag_here: "Glisser ici",
			reset: "Réinitialiser",
			reset_filters: "Réinitialiser les filtres",
			edit: "Modifier",
			open: "Ouvrir les slides",
			rename: "Renommer",
			del: "Supprimer",
			cancel: "Annuler",
			save: "Enregistrer",
			back: "Retour",
			refresh: "Rafraîchir",
			loading: "Chargement…",
			saved: "Enregistré ✓",
			none: "—",
			del_slider_title: "Supprimer le slider",
			del_slider_confirm: "Supprimer « {n} » et toutes ses slides ? Action irréversible.",
			new_slider_title: "Nouveau slider",
			rename_slider_title: "Renommer le slider",
			f_name: "Nom du slider",
			f_name_ph: "Mon slider",
			f_page: "Page liée (optionnel)",
			f_page_ph: "— Choisir une page —",
			f_page_none: "— Aucune —",
			err_save: "Erreur lors de la sauvegarde",
			no_access: "Vous n’avez pas les droits pour consulter cette liste.",
			slides_of: "Slides de « {n} »",
			add_slide: "Ajouter une slide",
			no_slides: "Aucune slide. Cliquez sur « Ajouter une slide ».",
			count_slides: "{n} slides — fin de la liste",
			s_order: "Ordre",
			s_status: "Statut",
			s_image: "Image",
			s_title: "Titre",
			s_sub1: "Sous-titre",
			s_link: "Lien",
			active: "Active",
			inactive: "Inactive",
			reorder_hint: "Glissez une ligne pour réordonner.",
			del_slide_title: "Supprimer la slide",
			del_slide_confirm: "Supprimer cette slide ? Action irréversible.",
			new_slide_title: "Nouvelle slide",
			edit_slide_title: "Modifier la slide",
			f_status: "Active",
			f_title: "Titre",
			f_sub1: "Sous-titre 1",
			f_sub2: "Description 1 (HTML)",
			f_sub3: "Description 2 (HTML)",
			f_link: "Lien",
			f_image: "Image",
			f_image_hint: "JPG, PNG, GIF ou WebP.",
			uploading: "Envoi…",
			remove_img: "Retirer l’image",
			choose_img: "Choisir une image"
		},
		en: {
			title: "Sliders",
			subtitle: "Carousels and their slides",
			new: "New slider",
			search: "Search a slider…",
			empty: "No slider found",
			count: "{n} sliders — end of list",
			kpi_sliders: "Sliders",
			kpi_slides: "Slides",
			kpi_active: "Active slides",
			col_id: "ID",
			col_name: "Name",
			col_page: "Linked page",
			col_slides: "Slides",
			columns: "Columns",
			export: "Export",
			cols_visible: "Visible",
			cols_hidden: "Hidden",
			drag_here: "Drag here",
			reset: "Reset",
			reset_filters: "Reset filters",
			edit: "Edit",
			open: "Open slides",
			rename: "Rename",
			del: "Delete",
			cancel: "Cancel",
			save: "Save",
			back: "Back",
			refresh: "Refresh",
			loading: "Loading…",
			saved: "Saved ✓",
			none: "—",
			del_slider_title: "Delete slider",
			del_slider_confirm: "Delete “{n}” and all its slides? This is irreversible.",
			new_slider_title: "New slider",
			rename_slider_title: "Rename slider",
			f_name: "Slider name",
			f_name_ph: "My slider",
			f_page: "Linked page (optional)",
			f_page_ph: "— Choose a page —",
			f_page_none: "— None —",
			err_save: "Error while saving",
			no_access: "You do not have permission to view this list.",
			slides_of: "Slides of “{n}”",
			add_slide: "Add a slide",
			no_slides: "No slide yet. Click “Add a slide”.",
			count_slides: "{n} slides — end of list",
			s_order: "Order",
			s_status: "Status",
			s_image: "Image",
			s_title: "Title",
			s_sub1: "Subtitle",
			s_link: "Link",
			active: "Active",
			inactive: "Inactive",
			reorder_hint: "Drag a row to reorder.",
			del_slide_title: "Delete slide",
			del_slide_confirm: "Delete this slide? This is irreversible.",
			new_slide_title: "New slide",
			edit_slide_title: "Edit slide",
			f_status: "Active",
			f_title: "Title",
			f_sub1: "Subtitle 1",
			f_sub2: "Description 1 (HTML)",
			f_sub3: "Description 2 (HTML)",
			f_link: "Link",
			f_image: "Image",
			f_image_hint: "JPG, PNG, GIF or WebP.",
			uploading: "Uploading…",
			remove_img: "Remove image",
			choose_img: "Choose an image"
		}
	};
	function useT() {
		const lang = currentLang$1();
		return (key, vars) => {
			let s = DICT$1[lang][key] ?? key;
			if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
			return s;
		};
	}
	function makeCan(melisKey) {
		return (cap) => window.MelisCan?.(melisKey, cap) ?? true;
	}
	var card$1 = {
		border: "1px solid var(--color-border)",
		background: "var(--color-card)",
		borderRadius: 12,
		boxShadow: "0 1px 2px rgba(0,0,0,.04)"
	};
	var inputCss = {
		height: 40,
		width: "100%",
		boxSizing: "border-box",
		borderRadius: 8,
		border: "1px solid var(--color-input,var(--color-border))",
		background: "var(--color-card)",
		color: "var(--color-foreground)",
		padding: "0 12px",
		fontSize: 14,
		outline: "none"
	};
	var textareaCss = {
		...inputCss,
		height: "auto",
		minHeight: 90,
		padding: "10px 12px",
		resize: "vertical",
		fontFamily: "inherit"
	};
	var btnPrimary$1 = {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		height: 36,
		padding: "0 14px",
		borderRadius: 8,
		border: 0,
		background: "var(--color-primary)",
		color: "var(--color-primary-foreground,#fff)",
		fontSize: 14,
		fontWeight: 500,
		cursor: "pointer"
	};
	var btnGhost$1 = {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		height: 36,
		padding: "0 12px",
		borderRadius: 8,
		border: "1px solid var(--color-border)",
		background: "var(--color-card)",
		color: "var(--color-foreground)",
		fontSize: 14,
		cursor: "pointer"
	};
	var ACCENT_BG = "var(--accent, var(--color-accent, rgba(0,0,0,.06)))";
	var ACCENT_FG = "var(--accent-foreground, var(--color-accent-foreground, var(--color-foreground)))";
	function ghostHover(baseBg = "var(--color-card)", baseFg = "var(--color-foreground)") {
		return {
			onMouseEnter: (e) => {
				e.currentTarget.style.background = ACCENT_BG;
				e.currentTarget.style.color = ACCENT_FG;
			},
			onMouseLeave: (e) => {
				e.currentTarget.style.background = String(baseBg);
				e.currentTarget.style.color = String(baseFg);
			}
		};
	}
	var iconBtn = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: 28,
		height: 28,
		borderRadius: 6,
		border: 0,
		background: "transparent",
		color: "var(--color-muted-foreground)",
		cursor: "pointer"
	};
	var th = {
		textAlign: "left",
		padding: "10px 16px",
		fontSize: 11,
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: ".04em",
		color: "var(--color-muted-foreground)",
		whiteSpace: "nowrap"
	};
	var td = {
		padding: "10px 16px",
		fontSize: 14,
		color: "var(--color-foreground)",
		borderTop: "1px solid var(--color-border)"
	};
	var label = {
		display: "block",
		fontSize: 13,
		fontWeight: 500,
		marginBottom: 4,
		color: "var(--color-foreground)"
	};
	var hint = {
		marginTop: 4,
		fontSize: 12,
		color: "var(--color-muted-foreground)"
	};
	var pageWrap = {
		display: "flex",
		flexDirection: "column",
		gap: 20,
		padding: 24,
		height: "100%",
		boxSizing: "border-box",
		overflow: "auto"
	};
	var sIcon$2 = {
		width: 15,
		height: 15,
		flexShrink: 0
	};
	var PencilIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon$2,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 20h9" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" })]
	});
	var TrashIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon$2,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" })
	});
	var PlusIcon$1 = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon$2,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" })
	});
	var ImageIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon$2,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "3",
				width: "18",
				height: "18",
				rx: "2"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "9",
				cy: "9",
				r: "2"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" })
		]
	});
	var LayersIcon$1 = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon$2,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 2 9 5-9 5-9-5 9-5Z" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 12 9 5 9-5" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 17 9 5 9-5" })
		]
	});
	var GripIcon$1 = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: {
			width: 13,
			height: 13,
			flexShrink: 0,
			color: "var(--color-muted-foreground)"
		},
		viewBox: "0 0 24 24",
		fill: "currentColor",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "9",
				cy: "6",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "15",
				cy: "6",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "9",
				cy: "12",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "15",
				cy: "12",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "9",
				cy: "18",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "15",
				cy: "18",
				r: "1.5"
			})
		]
	});
	var ResetIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon$2,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 2v6h6" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 13a9 9 0 1 0 3-7.7L3 8" })]
	});
	function Kpi({ label: lbl, value }) {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				...card$1,
				display: "flex",
				flexDirection: "column",
				gap: 2,
				padding: 16,
				flex: 1,
				minWidth: 140
			},
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				style: {
					fontSize: 12,
					color: "var(--color-muted-foreground)"
				},
				children: lbl
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				style: {
					fontSize: 22,
					fontWeight: 700
				},
				children: value == null ? "…" : value
			})]
		});
	}
	var visibleCols = (c) => c.filter((x) => x.visible);
	function makeColStore(key, defaults) {
		const load = () => {
			try {
				const raw = localStorage.getItem(key);
				if (!raw) return defaults;
				const saved = JSON.parse(raw);
				const ordered = saved.map((s) => {
					const d = defaults.find((c) => c.id === s.id);
					return d ? {
						id: d.id,
						visible: s.visible
					} : null;
				}).filter(Boolean);
				const missing = defaults.filter((d) => !saved.find((s) => s.id === d.id));
				return [...ordered, ...missing];
			} catch {
				return defaults;
			}
		};
		const save = (c) => {
			try {
				localStorage.setItem(key, JSON.stringify(c));
			} catch {}
		};
		return {
			load,
			save,
			defaults
		};
	}
	var panelCss$1 = {
		display: "flex",
		flexDirection: "column",
		gap: 2,
		minHeight: 130,
		maxHeight: "min(48vh, 320px)",
		overflowY: "auto",
		minWidth: 0,
		borderRadius: 8,
		border: "1px dashed var(--color-border)",
		padding: 6
	};
	var panelTitle$1 = {
		padding: "0 6px 4px",
		fontSize: 10,
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: ".06em",
		color: "var(--color-muted-foreground)"
	};
	function ColManager({ anchorRef, cols, labelFor, onChange, onSave, defaults, onClose }) {
		const t = useT();
		const [dragId, setDragId] = (0, react.useState)(null);
		const [over, setOver] = (0, react.useState)(null);
		const [pos, setPos] = (0, react.useState)(null);
		const shown = cols.filter((c) => c.visible);
		const hidden = cols.filter((c) => !c.visible);
		(0, react.useLayoutEffect)(() => {
			const anchor = anchorRef.current;
			if (!anchor) return;
			const rect = anchor.getBoundingClientRect();
			const margin = 8;
			const spaceBelow = window.innerHeight - rect.bottom - margin;
			const spaceAbove = rect.top - margin;
			const width = Math.min(380, window.innerWidth - margin * 2);
			const left = Math.min(Math.max(margin, rect.right - width), window.innerWidth - width - margin);
			if (spaceBelow >= 200 || spaceBelow >= spaceAbove) setPos({
				top: rect.bottom + 6,
				left,
				width,
				maxHeight: Math.max(160, spaceBelow - 6)
			});
			else setPos({
				bottom: window.innerHeight - rect.top + 6,
				left,
				width,
				maxHeight: Math.max(160, spaceAbove - 6)
			});
		}, [anchorRef]);
		function drop(panel) {
			if (!dragId) return;
			const upd = {
				...cols.find((c) => c.id === dragId),
				visible: panel === "visible"
			};
			let vList = shown.filter((c) => c.id !== dragId);
			const hList = hidden.filter((c) => c.id !== dragId);
			if (panel === "visible") {
				const dst = over?.id;
				if (!dst || dst === "__panel__") vList = [...vList, upd];
				else {
					const i = vList.findIndex((c) => c.id === dst);
					vList = i === -1 ? [...vList, upd] : [
						...vList.slice(0, i),
						upd,
						...vList.slice(i)
					];
				}
				const next = [...vList, ...hList];
				onChange(next);
				onSave(next);
			} else {
				const next = [
					...vList,
					...hList,
					upd
				];
				onChange(next);
				onSave(next);
			}
			setDragId(null);
			setOver(null);
		}
		function item(col, panel) {
			const isOver = over?.id === col.id && over?.panel === panel;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				draggable: true,
				onDragStart: (e) => {
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.setData("text/plain", col.id);
					setDragId(col.id);
				},
				onDragEnd: () => {
					setDragId(null);
					setOver(null);
				},
				onDragOver: (e) => {
					e.preventDefault();
					e.stopPropagation();
					e.dataTransfer.dropEffect = "move";
					if (over?.id !== col.id || over?.panel !== panel) setOver({
						id: col.id,
						panel
					});
				},
				onDrop: (e) => {
					e.preventDefault();
					drop(panel);
				},
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					borderRadius: 8,
					padding: "6px 8px",
					fontSize: 14,
					cursor: "grab",
					userSelect: "none",
					opacity: dragId === col.id ? .4 : 1,
					background: isOver ? "color-mix(in srgb, var(--color-primary) 12%, transparent)" : "transparent",
					boxShadow: isOver ? "0 0 0 1px color-mix(in srgb, var(--color-primary) 35%, transparent)" : "none"
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GripIcon$1, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: {
						flex: 1,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap"
					},
					children: labelFor(col.id)
				})]
			}, col.id);
		}
		if (!pos) return null;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				...card$1,
				position: "fixed",
				left: pos.left,
				zIndex: 50,
				width: pos.width,
				maxHeight: pos.maxHeight,
				overflowY: "auto",
				display: "flex",
				flexDirection: "column",
				...pos.top != null ? { top: pos.top } : { bottom: pos.bottom }
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "10px 12px",
						borderBottom: "1px solid var(--color-border)"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							fontSize: 14,
							fontWeight: 600
						},
						children: t("columns")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						style: {
							...iconBtn,
							width: 22,
							height: 22
						},
						onClick: onClose,
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 8,
						padding: 12
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: panelCss$1,
						onDragOver: (e) => {
							e.preventDefault();
							if (over?.id !== "__panel__" || over?.panel !== "hidden") setOver({
								id: "__panel__",
								panel: "hidden"
							});
						},
						onDrop: (e) => {
							e.preventDefault();
							drop("hidden");
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							style: panelTitle$1,
							children: t("cols_hidden")
						}), hidden.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 11,
								color: "var(--color-muted-foreground)",
								opacity: .5,
								padding: "16px 0"
							},
							children: t("drag_here")
						}) : hidden.map((c) => item(c, "hidden"))]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: panelCss$1,
						onDragOver: (e) => {
							e.preventDefault();
							if (over?.id !== "__panel__" || over?.panel !== "visible") setOver({
								id: "__panel__",
								panel: "visible"
							});
						},
						onDrop: (e) => {
							e.preventDefault();
							drop("visible");
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							style: panelTitle$1,
							children: t("cols_visible")
						}), shown.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 11,
								color: "var(--color-muted-foreground)",
								opacity: .5,
								padding: "16px 0"
							},
							children: t("drag_here")
						}) : shown.map((c) => item(c, "visible"))]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						borderTop: "1px solid var(--color-border)",
						padding: 6
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						style: {
							...btnGhost$1,
							width: "100%",
							height: 30,
							border: 0,
							justifyContent: "center",
							color: "var(--color-muted-foreground)",
							background: "transparent"
						},
						onClick: () => {
							onChange(defaults);
							onSave(defaults);
						},
						...ghostHover("transparent", "var(--color-muted-foreground)"),
						children: t("reset")
					})
				})
			]
		});
	}
	function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 60,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 12,
				boxSizing: "border-box",
				background: "rgba(0,0,0,.5)"
			},
			onClick: (e) => {
				if (e.target === e.currentTarget) onCancel();
			},
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...card$1,
					padding: 24,
					width: "100%",
					maxWidth: 380
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
						style: {
							fontSize: 16,
							fontWeight: 600,
							margin: 0
						},
						children: title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						style: {
							fontSize: 14,
							color: "var(--color-muted-foreground)",
							marginTop: 8
						},
						children: message
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "flex-end",
							gap: 8,
							marginTop: 20
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							style: btnGhost$1,
							onClick: onCancel,
							children: useT()("cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							style: {
								...btnGhost$1,
								borderColor: "#fca5a5",
								color: "#dc2626"
							},
							onClick: onConfirm,
							children: confirmLabel
						})]
					})
				]
			})
		});
	}
	//#endregion
	//#region src/shared/useIsNarrow.ts
	/**
	* True when the viewport is narrower than `breakpoint`. Drives every responsive decision on
	* this brick as a JS ternary (inline styles) instead of a CSS media query — see the
	* `melis-react-mobile-responsive` skill for why.
	*/
	function useIsNarrow(breakpoint = 640) {
		const [narrow, setNarrow] = (0, react.useState)(() => window.innerWidth < breakpoint);
		(0, react.useEffect)(() => {
			const onResize = () => setNarrow(window.innerWidth < breakpoint);
			window.addEventListener("resize", onResize);
			return () => window.removeEventListener("resize", onResize);
		}, [breakpoint]);
		return narrow;
	}
	//#endregion
	//#region src/ExportModal.tsx
	function getXLSX() {
		return window.MelisXLSX ?? null;
	}
	function currentLang() {
		return (document.documentElement.lang || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
	}
	var DICT = {
		fr: {
			export: "Exporter",
			title: "Exporter les données",
			subtitle: "{n} lignes avec les filtres actifs",
			included: "Incluses",
			excluded: "Exclues",
			drag_here: "Glisser ici",
			download: "Télécharger {fmt}",
			exporting: "Export…",
			error: "Erreur lors de l’export",
			cancel: "Annuler"
		},
		en: {
			export: "Export",
			title: "Export data",
			subtitle: "{n} rows with the active filters",
			included: "Included",
			excluded: "Excluded",
			drag_here: "Drag here",
			download: "Download {fmt}",
			exporting: "Exporting…",
			error: "Error during export",
			cancel: "Cancel"
		}
	};
	function tr(key, vars) {
		let s = DICT[currentLang()][key] ?? key;
		if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
		return s;
	}
	var card = {
		border: "1px solid var(--color-border)",
		background: "var(--color-card)",
		borderRadius: 12,
		boxShadow: "0 1px 2px rgba(0,0,0,.04)"
	};
	var panelCss = {
		display: "flex",
		flexDirection: "column",
		gap: 2,
		minHeight: 100,
		maxHeight: "min(48vh, 320px)",
		overflowY: "auto",
		minWidth: 0,
		borderRadius: 8,
		border: "1px dashed var(--color-border)",
		padding: 6
	};
	var panelTitle = {
		padding: "0 6px 4px",
		fontSize: 10,
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: ".06em",
		color: "var(--color-muted-foreground)"
	};
	var btnGhost = {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		height: 34,
		padding: "0 12px",
		borderRadius: 8,
		border: "1px solid var(--color-border)",
		background: "var(--color-card)",
		color: "var(--color-foreground)",
		fontSize: 14,
		cursor: "pointer"
	};
	var btnPrimary = {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		height: 34,
		padding: "0 14px",
		borderRadius: 8,
		border: 0,
		background: "var(--color-primary)",
		color: "var(--color-primary-foreground,#fff)",
		fontSize: 14,
		fontWeight: 500,
		cursor: "pointer"
	};
	var GripIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: {
			width: 13,
			height: 13,
			flexShrink: 0,
			color: "var(--color-muted-foreground)"
		},
		viewBox: "0 0 24 24",
		fill: "currentColor",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "9",
				cy: "6",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "15",
				cy: "6",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "9",
				cy: "12",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "15",
				cy: "12",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "9",
				cy: "18",
				r: "1.5"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "15",
				cy: "18",
				r: "1.5"
			})
		]
	});
	var DownloadIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: {
			width: 15,
			height: 15,
			flexShrink: 0
		},
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" })
	});
	var ExcelIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: {
			width: 16,
			height: 16,
			flexShrink: 0
		},
		viewBox: "0 0 24 24",
		fill: "none",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "1",
				y: "1",
				width: "22",
				height: "22",
				rx: "3",
				fill: "#217346"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("line", {
				x1: "7.5",
				y1: "7.5",
				x2: "16.5",
				y2: "16.5",
				stroke: "white",
				strokeWidth: "2.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("line", {
				x1: "16.5",
				y1: "7.5",
				x2: "7.5",
				y2: "16.5",
				stroke: "white",
				strokeWidth: "2.5",
				strokeLinecap: "round"
			})
		]
	});
	var CsvIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: {
			width: 16,
			height: 16,
			flexShrink: 0
		},
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14 2v6h6M16 13H8M16 17H8M10 9H8" })]
	});
	function ExportModal({ cols, labelFor, fetchAll, getCell, filename, sheetName, total, onClose }) {
		const narrow = useIsNarrow();
		const xlsx = getXLSX();
		const [included, setIncluded] = (0, react.useState)(() => cols.filter((c) => c.visible));
		const [excluded, setExcluded] = (0, react.useState)(() => cols.filter((c) => !c.visible));
		const [format, setFormat] = (0, react.useState)(xlsx ? "xlsx" : "csv");
		const [exporting, setExporting] = (0, react.useState)(false);
		const [dragId, setDragId] = (0, react.useState)(null);
		const [over, setOver] = (0, react.useState)(null);
		function drop(panel) {
			if (!dragId) return;
			const src = [...included, ...excluded].find((c) => c.id === dragId);
			let inc = included.filter((c) => c.id !== dragId);
			let exc = excluded.filter((c) => c.id !== dragId);
			if (panel === "included") {
				const dst = over?.id;
				if (!dst || dst === "__panel__") inc = [...inc, src];
				else {
					const i = inc.findIndex((c) => c.id === dst);
					inc = i === -1 ? [...inc, src] : [
						...inc.slice(0, i),
						src,
						...inc.slice(i)
					];
				}
			} else exc = [...exc, src];
			setIncluded(inc);
			setExcluded(exc);
			setDragId(null);
			setOver(null);
		}
		function item(col, panel) {
			const isOver = over?.id === col.id && over?.panel === panel;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				draggable: true,
				onDragStart: (e) => {
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.setData("text/plain", col.id);
					setDragId(col.id);
				},
				onDragEnd: () => {
					setDragId(null);
					setOver(null);
				},
				onDragOver: (e) => {
					e.preventDefault();
					e.stopPropagation();
					e.dataTransfer.dropEffect = "move";
					if (over?.id !== col.id || over?.panel !== panel) setOver({
						id: col.id,
						panel
					});
				},
				onDrop: (e) => {
					e.preventDefault();
					drop(panel);
				},
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					borderRadius: 8,
					padding: "6px 8px",
					fontSize: 14,
					cursor: "grab",
					userSelect: "none",
					opacity: dragId === col.id ? .4 : 1,
					background: isOver ? "color-mix(in srgb, var(--color-primary) 12%, transparent)" : "transparent",
					boxShadow: isOver ? "0 0 0 1px color-mix(in srgb, var(--color-primary) 35%, transparent)" : "none"
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GripIcon, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: {
						flex: 1,
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap"
					},
					children: labelFor(col.id)
				})]
			}, col.id);
		}
		const ph = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			style: {
				flex: 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: 11,
				color: "var(--color-muted-foreground)",
				opacity: .5,
				padding: "12px 0"
			},
			children: tr("drag_here")
		});
		async function doExport() {
			if (included.length === 0) return;
			setExporting(true);
			try {
				const all = await fetchAll();
				const header = included.map((c) => labelFor(c.id));
				const rows = all.map((it) => included.map((c) => getCell(it, c.id)));
				const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
				if (format === "xlsx" && xlsx) {
					const ws = xlsx.utils.aoa_to_sheet([header, ...rows]);
					const wb = xlsx.utils.book_new();
					xlsx.utils.book_append_sheet(wb, ws, sheetName);
					xlsx.writeFile(wb, `${filename}-${dateStr}.xlsx`);
				} else {
					const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`).join(",")).join("\n");
					const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
					const url = URL.createObjectURL(blob);
					const a = Object.assign(document.createElement("a"), {
						href: url,
						download: `${filename}-${dateStr}.csv`
					});
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
				}
				onClose();
			} catch (e) {
				alert(e instanceof Error ? e.message : tr("error"));
			} finally {
				setExporting(false);
			}
		}
		const tab = (active) => ({
			flex: 1,
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			gap: 8,
			height: 36,
			borderRadius: 6,
			border: 0,
			fontSize: 14,
			fontWeight: 500,
			cursor: "pointer",
			background: active ? "var(--color-card)" : "transparent",
			color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)",
			boxShadow: active ? "0 1px 2px rgba(0,0,0,.06)" : "none"
		});
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 60,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 12,
				boxSizing: "border-box",
				background: "rgba(0,0,0,.5)"
			},
			onClick: (e) => {
				if (e.target === e.currentTarget) onClose();
			},
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...card,
					width: "100%",
					maxWidth: 480
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "space-between",
							padding: "16px 20px",
							borderBottom: "1px solid var(--color-border)"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: 14,
								fontWeight: 600,
								margin: 0
							},
							children: tr("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							style: {
								fontSize: 12,
								color: "var(--color-muted-foreground)",
								margin: "2px 0 0"
							},
							children: tr("subtitle", { n: total })
						})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							style: {
								border: 0,
								background: "transparent",
								cursor: "pointer",
								color: "var(--color-muted-foreground)",
								fontSize: 16
							},
							onClick: onClose,
							children: "✕"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							padding: 16,
							display: "flex",
							flexDirection: "column",
							gap: 16
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 4,
								padding: 4,
								borderRadius: 8,
								border: "1px solid var(--color-border)",
								background: "color-mix(in srgb, var(--color-muted,#888) 12%, transparent)"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								style: tab(format === "xlsx"),
								disabled: !xlsx,
								onClick: () => xlsx && setFormat("xlsx"),
								title: xlsx ? "" : "XLSX indisponible",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExcelIcon, {}), "Excel (.xlsx)"]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								style: tab(format === "csv"),
								onClick: () => setFormat("csv"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CsvIcon, {}), "CSV (.csv)"]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "grid",
								gridTemplateColumns: narrow ? "1fr" : "1fr 1fr",
								gap: 8
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: panelCss,
								onDragOver: (e) => {
									e.preventDefault();
									if (over?.id !== "__panel__" || over?.panel !== "excluded") setOver({
										id: "__panel__",
										panel: "excluded"
									});
								},
								onDrop: (e) => {
									e.preventDefault();
									drop("excluded");
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									style: panelTitle,
									children: tr("excluded")
								}), excluded.length === 0 ? ph() : excluded.map((c) => item(c, "excluded"))]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: panelCss,
								onDragOver: (e) => {
									e.preventDefault();
									if (over?.id !== "__panel__" || over?.panel !== "included") setOver({
										id: "__panel__",
										panel: "included"
									});
								},
								onDrop: (e) => {
									e.preventDefault();
									drop("included");
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									style: panelTitle,
									children: tr("included")
								}), included.length === 0 ? ph() : included.map((c) => item(c, "included"))]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "flex-end",
							gap: 8,
							padding: "12px 16px",
							borderTop: "1px solid var(--color-border)"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							style: btnGhost,
							onClick: onClose,
							disabled: exporting,
							children: tr("cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							style: {
								...btnPrimary,
								opacity: included.length === 0 || exporting ? .6 : 1
							},
							onClick: doExport,
							disabled: exporting || included.length === 0,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(DownloadIcon, {}), exporting ? tr("exporting") : tr("download", { fmt: format.toUpperCase() })]
						})]
					})
				]
			})
		});
	}
	//#endregion
	//#region src/ViewToggle.tsx
	var sIcon$1 = {
		width: 15,
		height: 15,
		flexShrink: 0
	};
	var SparkIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon$1,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" })
	});
	var LayoutIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon$1,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
			x: "3",
			y: "3",
			width: "18",
			height: "18",
			rx: "2"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 9h18M9 21V9" })]
	});
	function ViewToggle({ mode, onChange, compact = false }) {
		const tab = (active) => ({
			display: "inline-flex",
			alignItems: "center",
			gap: 6,
			height: 30,
			padding: compact ? "0 8px" : "0 12px",
			borderRadius: 6,
			border: 0,
			fontSize: 12,
			fontWeight: 500,
			cursor: "pointer",
			background: active ? "var(--color-card)" : "transparent",
			color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)",
			boxShadow: active ? "0 1px 2px rgba(0,0,0,.06)" : "none"
		});
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "inline-flex",
				gap: 4,
				padding: 4,
				borderRadius: 8,
				border: "1px solid var(--color-border)",
				background: "color-mix(in srgb, var(--color-muted,#888) 12%, transparent)"
			},
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				style: tab(mode === "react"),
				onClick: () => onChange("react"),
				title: compact ? "New" : void 0,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SparkIcon, {}), !compact && "New"]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				style: tab(mode === "iframe"),
				onClick: () => onChange("iframe"),
				title: compact ? "Old" : void 0,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LayoutIcon, {}), !compact && "Old"]
			})]
		});
	}
	//#endregion
	//#region src/PagePicker.tsx
	async function fetchTreeNodes(nodeId) {
		try {
			const res = await fetch(`/melis/MelisCms/TreeSites/get-tree-pages-by-page-id?nodeId=${encodeURIComponent(String(nodeId))}`, {
				headers: { "X-Requested-With": "XMLHttpRequest" },
				credentials: "include"
			});
			if (!res.ok) return [];
			const data = await res.json();
			let nodes = [];
			if (Array.isArray(data)) nodes = data;
			else if (Array.isArray(data?.data)) nodes = data.data;
			else if (Array.isArray(data?.tree)) nodes = data.tree;
			nodes.forEach((n) => {
				if (typeof n.title === "string") n.title = n.title.replace(/<[^>]*>/g, "").trim();
			});
			return nodes;
		} catch {
			return [];
		}
	}
	var box = {
		borderRadius: 8,
		border: "1px solid var(--color-border,#e5e7eb)",
		background: "var(--color-background,#fff)"
	};
	var btn = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 8,
		height: 40,
		width: "100%",
		boxSizing: "border-box",
		padding: "0 12px",
		cursor: "pointer",
		fontSize: 14,
		color: "var(--color-foreground)",
		...box
	};
	function Node({ node, depth, onPick }) {
		const [open, setOpen] = (0, react.useState)(false);
		const [children, setChildren] = (0, react.useState)(null);
		const [loading, setLoading] = (0, react.useState)(false);
		async function toggle() {
			if (!node.lazy) return;
			const next = !open;
			setOpen(next);
			if (next && children === null) {
				setLoading(true);
				setChildren(await fetchTreeNodes(node.key));
				setLoading(false);
			}
		}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 4,
				padding: "4px 6px",
				paddingLeft: 6 + depth * 16
			},
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: toggle,
				style: {
					width: 18,
					height: 18,
					border: 0,
					background: "transparent",
					cursor: node.lazy ? "pointer" : "default",
					color: "var(--color-muted-foreground,#6b7280)",
					fontSize: 11
				},
				children: node.lazy ? open ? "▾" : "▸" : "·"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => onPick(node.key, node.title),
				style: {
					flex: 1,
					textAlign: "left",
					border: 0,
					background: "transparent",
					cursor: "pointer",
					fontSize: 13,
					padding: "2px 4px",
					borderRadius: 6,
					color: "var(--color-foreground)"
				},
				children: node.title
			})]
		}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			style: {
				paddingLeft: 24 + depth * 16,
				fontSize: 12,
				color: "var(--color-muted-foreground)"
			},
			children: "…"
		}), (children ?? []).map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Node, {
			node: c,
			depth: depth + 1,
			onPick
		}, c.key))] })] });
	}
	function PagePicker({ value, title, onChange, placeholder, noneLabel }) {
		const [open, setOpen] = (0, react.useState)(false);
		const [roots, setRoots] = (0, react.useState)(null);
		const ref = (0, react.useRef)(null);
		(0, react.useEffect)(() => {
			function onDoc(e) {
				if (ref.current && !ref.current.contains(e.target)) setOpen(false);
			}
			document.addEventListener("mousedown", onDoc);
			return () => document.removeEventListener("mousedown", onDoc);
		}, []);
		async function openPanel() {
			setOpen((o) => !o);
			if (roots === null) setRoots(await fetchTreeNodes(-1));
		}
		const display = value ? title || `Page #${value}` : placeholder || "— choisir une page —";
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			ref,
			style: { position: "relative" },
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				style: btn,
				onClick: openPanel,
				type: "button",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: {
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						color: value ? "inherit" : "var(--color-muted-foreground)"
					},
					children: display
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: { color: "var(--color-muted-foreground)" },
					children: "▾"
				})]
			}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...box,
					position: "absolute",
					zIndex: 70,
					top: 44,
					left: 0,
					right: 0,
					maxHeight: 320,
					overflow: "auto",
					boxShadow: "0 8px 24px rgba(0,0,0,.18)",
					padding: 6
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					onClick: () => {
						onChange(0, "");
						setOpen(false);
					},
					type: "button",
					style: {
						width: "100%",
						textAlign: "left",
						border: 0,
						background: "transparent",
						cursor: "pointer",
						fontSize: 13,
						padding: "6px 8px",
						borderRadius: 6,
						color: "var(--color-muted-foreground)",
						fontStyle: "italic"
					},
					children: noneLabel || "— Aucune —"
				}), roots === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						padding: 12,
						fontSize: 13,
						color: "var(--color-muted-foreground)"
					},
					children: "Chargement…"
				}) : roots.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						padding: 12,
						fontSize: 13,
						color: "var(--color-muted-foreground)"
					},
					children: "Aucune page"
				}) : roots.map((n) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Node, {
					node: n,
					depth: 0,
					onPick: (id, t) => {
						onChange(id, t);
						setOpen(false);
					}
				}, n.key))]
			})]
		});
	}
	//#endregion
	//#region src/use-keyset-list.ts
	function useKeysetList(opts) {
		const LIMIT = opts.limit ?? 25;
		const [items, setItems] = (0, react.useState)(opts.initial?.items ?? []);
		const [total, setTotal] = (0, react.useState)(opts.initial?.total ?? 0);
		const [loading, setLoading] = (0, react.useState)(false);
		const [hasMore, setHasMore] = (0, react.useState)(opts.initial?.hasMore ?? false);
		const [sortCol, setSortCol] = (0, react.useState)(opts.initial?.sortCol ?? opts.defaultSort ?? "id");
		const [sortDir, setSortDir] = (0, react.useState)(opts.initial?.sortDir ?? opts.defaultDir ?? "desc");
		const cursorRef = (0, react.useRef)(opts.initial?.cursor ?? null);
		const loadingRef = (0, react.useRef)(false);
		const reqIdRef = (0, react.useRef)(0);
		const sentinelRef = (0, react.useRef)(null);
		const fetcherRef = (0, react.useRef)(opts.fetcher);
		fetcherRef.current = opts.fetcher;
		const runLoad = (0, react.useCallback)(async (reset) => {
			if (!reset && loadingRef.current) return;
			const myReq = ++reqIdRef.current;
			loadingRef.current = true;
			setLoading(true);
			const after = reset ? void 0 : cursorRef.current ?? void 0;
			try {
				const res = await fetcherRef.current({
					limit: LIMIT,
					sort: sortCol,
					dir: sortDir,
					after
				});
				if (myReq !== reqIdRef.current) return;
				cursorRef.current = res.nextCursor;
				setHasMore(res.nextCursor !== null);
				setTotal(res.total);
				setItems((prev) => reset ? res.items : [...prev, ...res.items]);
			} catch {} finally {
				if (myReq === reqIdRef.current) {
					setLoading(false);
					loadingRef.current = false;
				}
			}
		}, [
			sortCol,
			sortDir,
			LIMIT
		]);
		const didInitRef = (0, react.useRef)(false);
		(0, react.useEffect)(() => {
			if (!didInitRef.current) {
				didInitRef.current = true;
				if (opts.skipInitial) return;
			}
			runLoad(true);
		}, [
			...opts.deps,
			sortCol,
			sortDir
		]);
		(0, react.useEffect)(() => {
			if (!sentinelRef.current || !hasMore) return;
			const obs = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) runLoad(false);
			}, { rootMargin: "120px" });
			obs.observe(sentinelRef.current);
			return () => obs.disconnect();
		}, [hasMore, runLoad]);
		const toggleSort = (0, react.useCallback)((id) => {
			setSortCol((cur) => {
				if (cur === id) {
					setSortDir((d) => d === "asc" ? "desc" : "asc");
					return cur;
				}
				setSortDir(id === "id" ? "desc" : "asc");
				return id;
			});
		}, []);
		/** Force un rechargement depuis le début (refresh / reset filtres). */
		const reload = (0, react.useCallback)(() => {
			cursorRef.current = null;
			runLoad(true);
		}, [runLoad]);
		/** Retire un élément localement (après delete) sans recharger. */
		const removeLocal = (0, react.useCallback)((pred) => {
			setItems((prev) => prev.filter((it) => !pred(it)));
			setTotal((t) => Math.max(0, t - 1));
		}, []);
		/** Snapshot pour le cache module-level. */
		const snapshot = () => ({
			items,
			total,
			cursor: cursorRef.current,
			hasMore,
			sortCol,
			sortDir
		});
		return {
			items,
			setItems,
			total,
			loading,
			hasMore,
			sentinelRef,
			sortCol,
			sortDir,
			setSortCol,
			setSortDir,
			toggleSort,
			reload,
			removeLocal,
			snapshot
		};
	}
	//#endregion
	//#region src/shared/ExpandableRow.tsx
	/**
	* Per-row "+" toggle (leftmost column of a table) that reveals the columns currently hidden
	* via column collapse on narrow viewports — same visibility source as the desktop ColManager,
	* just surfaced per-row. Pair with <HiddenColsRow>. Inline styles only — a brick can't use the
	* host's Tailwind classes.
	*/
	var sIcon = {
		width: 13,
		height: 13,
		flexShrink: 0
	};
	var PlusIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" })
	});
	var MinusIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5 12h14" })
	});
	function ExpandToggle({ expanded, onClick }) {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
			type: "button",
			onClick,
			"aria-expanded": expanded,
			style: {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: 24,
				height: 24,
				borderRadius: 6,
				border: "1px solid var(--color-border)",
				background: "transparent",
				color: "var(--color-muted-foreground)",
				cursor: "pointer",
				padding: 0
			},
			children: expanded ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MinusIcon, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon, {})
		});
	}
	/**
	* Detail row shown under an expanded row — one label/value pair per hidden column.
	* Two columns side by side on desktop; a single stacked column on narrow viewports (a 2-col
	* grid there fights for width against wrapped long values).
	*/
	function HiddenColsRow({ cols, labelFor, renderValue, colSpan, narrow }) {
		const hidden = cols.filter((c) => !c.visible);
		if (hidden.length === 0) return null;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
			colSpan,
			style: {
				padding: "10px 16px",
				borderTop: "1px solid var(--color-border)",
				background: "var(--color-muted,rgba(0,0,0,.02))",
				width: 0
			},
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: !narrow && hidden.length > 1 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
					columnGap: 24,
					rowGap: 10
				},
				children: hidden.map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "auto minmax(0, 1fr)",
						alignItems: "baseline",
						gap: 8,
						fontSize: 13
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: ".04em",
							color: "var(--color-muted-foreground)"
						},
						children: [labelFor(c.id), ":"]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							minWidth: 0,
							maxWidth: 220,
							overflowWrap: "break-word",
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden"
						},
						children: renderValue(c.id)
					})]
				}, c.id))
			})
		}) });
	}
	//#endregion
	//#region src/SliderList.tsx
	/** Icône de tri neutre/asc/desc — mêmes tracés que lucide ArrowUpDown/ArrowUp/ArrowDown. */
	function SortIcon({ dir }) {
		const p = {
			width: 12,
			height: 12,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 2,
			strokeLinecap: "round",
			strokeLinejoin: "round",
			style: {
				flexShrink: 0,
				opacity: dir ? 1 : .3
			}
		};
		if (dir === "asc") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			...p,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m5 12 7-7 7 7" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 19V5" })]
		});
		if (dir === "desc") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			...p,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 5v14" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m19 12-7 7-7-7" })]
		});
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			...p,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m21 16-4 4-4-4" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M17 20V4" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 8 4-4 4 4" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M7 4v16" })
			]
		});
	}
	var MELIS_KEY = "MelisCmsSlider_left_menu";
	var can$2 = makeCan("meliscms_slider_tools_section");
	var COL_LABEL$1 = {
		id: "col_id",
		name: "col_name",
		page: "col_page",
		slides: "col_slides"
	};
	var colStore$1 = makeColStore("melis-slider-cols-v1", [
		{
			id: "id",
			visible: false
		},
		{
			id: "name",
			visible: true
		},
		{
			id: "page",
			visible: true
		},
		{
			id: "slides",
			visible: true
		}
	]);
	var ESSENTIAL_COLS$1 = new Set(["name"]);
	var RenameIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: {
			width: 15,
			height: 15,
			flexShrink: 0
		},
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.41 2.41 0 0 0 3.414 0l6.586-6.586a2.41 2.41 0 0 0 0-3.414z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
			cx: "7.5",
			cy: "7.5",
			r: "1.2",
			fill: "currentColor"
		})]
	});
	function SliderList({ active, onOpen, mode, onModeChange }) {
		const t = useT();
		const narrow = useIsNarrow();
		const [stats, setStats] = (0, react.useState)(null);
		const [expanded, setExpanded] = (0, react.useState)(/* @__PURE__ */ new Set());
		const [searchInput, setSearchInput] = (0, react.useState)("");
		const [search, setSearch] = (0, react.useState)("");
		const [toDelete, setToDelete] = (0, react.useState)(null);
		const [editSlider, setEditSlider] = (0, react.useState)(null);
		const [tick, setTick] = (0, react.useState)(0);
		const [cols, setCols] = (0, react.useState)(colStore$1.load);
		const colsAnchorRef = (0, react.useRef)(null);
		const [showCols, setShowCols] = (0, react.useState)(false);
		const [showExport, setShowExport] = (0, react.useState)(false);
		const [frameLoaded, setFrameLoaded] = (0, react.useState)(false);
		(0, react.useEffect)(() => {
			if (mode === "iframe") setFrameLoaded(true);
		}, [mode]);
		(0, react.useEffect)(() => {
			fetchSliderStats().then(setStats).catch(() => null);
		}, [tick]);
		const { items, total, loading, hasMore, sentinelRef, sortCol, sortDir, toggleSort, reload, removeLocal } = useKeysetList({
			fetcher: (a) => fetchSliders({
				...a,
				search
			}),
			deps: [search, tick],
			defaultSort: "id",
			defaultDir: "desc"
		});
		(0, react.useEffect)(() => {
			if (active && consumeSliderListStale()) setTick((x) => x + 1);
		}, [active]);
		const displayCols = narrow ? cols.map((c) => ({
			...c,
			visible: ESSENTIAL_COLS$1.has(c.id)
		})) : cols;
		const hasHidden = narrow;
		const toggleExpand = (id) => setExpanded((prev) => {
			const next = new Set(prev);
			if (!next.delete(id)) next.add(id);
			return next;
		});
		function resetFilters() {
			setSearchInput("");
			setSearch("");
			reload();
		}
		async function confirmDelete() {
			if (!toDelete) return;
			try {
				await deleteSlider(toDelete.id);
				removeLocal((s) => s.id === toDelete.id);
				setToDelete(null);
				setTick((x) => x + 1);
			} catch {
				setToDelete(null);
			}
		}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				...pageWrap,
				...narrow ? { padding: 16 } : {}
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: narrow ? { minWidth: 0 } : void 0,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", {
							style: {
								fontSize: 20,
								fontWeight: 700,
								margin: 0,
								...narrow ? {
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								} : {}
							},
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							style: {
								fontSize: 14,
								color: "var(--color-muted-foreground)",
								margin: "2px 0 0",
								...narrow ? {
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								} : {}
							},
							children: t("subtitle")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							...narrow ? {
								flexShrink: 0,
								flexDirection: "column"
							} : {}
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: narrow ? {
								display: "flex",
								alignItems: "center",
								gap: 8
							} : { display: "contents" },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ViewToggle, {
								mode,
								compact: narrow,
								onChange: onModeChange
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								style: btnGhost$1,
								onClick: () => setTick((x) => x + 1),
								title: t("refresh"),
								children: "↻"
							})]
						}), can$2("create") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							style: {
								...btnPrimary$1,
								...narrow ? {
									width: "100%",
									justifyContent: "center"
								} : {}
							},
							onClick: () => setEditSlider("new"),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon$1, {}), t("new")]
						})]
					})]
				}),
				frameLoaded && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						...card$1,
						display: mode === "iframe" ? "flex" : "none",
						flex: 1,
						minHeight: 480,
						overflow: "hidden"
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("iframe", {
						src: `/melis/react-tool-page?key=${encodeURIComponent("MelisCmsSlider_left_menu")}`,
						style: {
							flex: 1,
							width: "100%",
							border: 0
						},
						title: "Slider — Vue Melis",
						sandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						display: mode === "react" ? "flex" : "none",
						flexDirection: "column",
						gap: 20
					},
					children: !can$2("list") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...card$1,
							padding: "40px 16px",
							textAlign: "center",
							fontSize: 14,
							color: "var(--color-muted-foreground)"
						},
						children: t("no_access")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 12,
								flexWrap: "wrap"
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Kpi, {
									label: t("kpi_sliders"),
									value: stats?.sliders ?? null
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Kpi, {
									label: t("kpi_slides"),
									value: stats?.slides ?? null
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Kpi, {
									label: t("kpi_active"),
									value: stats?.active ?? null
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 8,
								flexWrap: "wrap"
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									style: {
										...inputCss,
										height: 36,
										flex: 1,
										minWidth: narrow ? 0 : 220,
										...narrow ? { flexBasis: "100%" } : {}
									},
									value: searchInput,
									onChange: (e) => setSearchInput(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && setSearch(searchInput.trim()),
									placeholder: t("search")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									style: {
										...btnGhost$1,
										height: 36,
										...narrow ? {
											flex: "1 1 100%",
											justifyContent: "center"
										} : {}
									},
									onClick: resetFilters,
									...ghostHover("var(--color-card)", "var(--color-foreground)"),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ResetIcon, {}), t("reset_filters")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									ref: colsAnchorRef,
									style: {
										position: "relative",
										...narrow ? { flex: "1 1 calc(50% - 4px)" } : {}
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										style: {
											...btnGhost$1,
											height: 36,
											...narrow ? {
												width: "100%",
												justifyContent: "center"
											} : {}
										},
										onClick: () => setShowCols((v) => !v),
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GripIcon$1, {}), t("columns")]
									}), showCols && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColManager, {
										anchorRef: colsAnchorRef,
										cols,
										labelFor: (id) => t(COL_LABEL$1[id]),
										onChange: setCols,
										onSave: colStore$1.save,
										defaults: colStore$1.defaults,
										onClose: () => setShowCols(false)
									})]
								}),
								can$2("export") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									style: {
										...btnGhost$1,
										height: 36,
										...narrow ? {
											flex: "1 1 calc(50% - 4px)",
											justifyContent: "center"
										} : {}
									},
									onClick: () => setShowExport(true),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(DownloadIcon, {}), t("export")]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								...card$1,
								overflow: "hidden",
								flexShrink: 0
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("table", {
									style: {
										width: "100%",
										borderCollapse: "collapse",
										...narrow ? {} : { minWidth: 560 }
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("thead", {
										style: { background: "var(--color-muted,rgba(0,0,0,.03))" },
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
											hasHidden && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { style: {
												...th,
												width: 32
											} }),
											visibleCols(displayCols).map(({ id }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
												style: {
													...th,
													cursor: "pointer",
													...id === "id" ? { width: 70 } : {},
													...sortCol === id ? { color: "var(--color-primary)" } : {}
												},
												onClick: () => toggleSort(id),
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
													style: {
														display: "inline-flex",
														alignItems: "center",
														gap: 4
													},
													children: [t(COL_LABEL$1[id]), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SortIcon, { dir: sortCol === id ? sortDir : null })]
												})
											}, id)),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { style: {
												...th,
												width: 110
											} })
										] })
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tbody", { children: items.length === 0 && !loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
										style: {
											...td,
											textAlign: "center",
											color: "var(--color-muted-foreground)",
											padding: "40px 16px"
										},
										colSpan: visibleCols(displayCols).length + (hasHidden ? 1 : 0) + 1,
										children: t("empty")
									}) }) : items.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
										hasHidden && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
											style: td,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandToggle, {
												expanded: expanded.has(s.id),
												onClick: () => toggleExpand(s.id)
											})
										}),
										visibleCols(displayCols).map(({ id }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("td", {
											style: {
												...td,
												...id === "id" ? {
													color: "var(--color-muted-foreground)",
													fontVariantNumeric: "tabular-nums"
												} : {}
											},
											children: [
												id === "id" && s.id,
												id === "name" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													onClick: () => onOpen(s.id, s.name),
													style: {
														background: "transparent",
														border: 0,
														padding: 0,
														color: "var(--color-foreground)",
														fontSize: 14,
														fontWeight: 600,
														cursor: "pointer",
														textAlign: "left"
													},
													children: s.name || t("none")
												}),
												id === "page" && (s.pageId ?? t("none")),
												id === "slides" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
													style: {
														display: "inline-flex",
														alignItems: "center",
														gap: 6,
														color: "var(--color-muted-foreground)"
													},
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LayersIcon$1, {}), s.slideCount]
												})
											]
										}, id)),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
											style: td,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												style: {
													display: "flex",
													justifyContent: "flex-end",
													gap: 4
												},
												children: [
													can$2("open") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														style: iconBtn,
														title: t("open"),
														onClick: () => onOpen(s.id, s.name),
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PencilIcon, {})
													}),
													can$2("rename") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														style: iconBtn,
														title: t("rename"),
														onClick: () => setEditSlider(s),
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RenameIcon, {})
													}),
													can$2("delete") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
														style: {
															...iconBtn,
															color: "var(--color-destructive,#ef4444)"
														},
														title: t("del"),
														onClick: () => setToDelete(s),
														children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TrashIcon, {})
													})
												]
											})
										})
									] }), hasHidden && expanded.has(s.id) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HiddenColsRow, {
										cols: displayCols,
										labelFor: (id) => t(COL_LABEL$1[id]),
										renderValue: (id) => id === "id" ? s.id : id === "name" ? s.name || t("none") : id === "page" ? s.pageId ?? t("none") : id === "slides" ? s.slideCount : "",
										colSpan: visibleCols(displayCols).length + 2,
										narrow
									})] }, s.id)) })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									ref: sentinelRef,
									style: { height: 1 }
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										padding: "10px 16px",
										textAlign: "center",
										fontSize: 12,
										color: "var(--color-muted-foreground)"
									},
									children: loading ? t("loading") : !hasMore && items.length > 0 ? t("count", { n: total }) : ""
								})
							]
						})
					] })
				}),
				toDelete && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmModal, {
					title: t("del_slider_title"),
					message: t("del_slider_confirm", { n: toDelete.name || "#" + toDelete.id }),
					confirmLabel: t("del"),
					onConfirm: confirmDelete,
					onCancel: () => setToDelete(null)
				}),
				editSlider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SliderModal, {
					slider: editSlider === "new" ? null : editSlider,
					onClose: () => setEditSlider(null),
					onSaved: () => {
						setEditSlider(null);
						setTick((x) => x + 1);
					}
				}),
				showExport && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExportModal, {
					cols,
					labelFor: (id) => t(COL_LABEL$1[id]),
					fetchAll: async () => {
						const all = [];
						let after;
						for (;;) {
							const r = await fetchSliders({
								search,
								sort: sortCol,
								dir: sortDir,
								after,
								limit: 100
							});
							all.push(...r.items);
							if (!r.nextCursor) break;
							after = r.nextCursor;
						}
						return all;
					},
					getCell: (s, id) => id === "id" ? s.id : id === "name" ? s.name : id === "page" ? s.pageId ?? "" : id === "slides" ? s.slideCount : "",
					filename: "sliders",
					sheetName: t("title"),
					total,
					onClose: () => setShowExport(false)
				})
			]
		});
	}
	function SliderModal({ slider, onClose, onSaved }) {
		const t = useT();
		const isEdit = !!slider;
		const [name, setName] = (0, react.useState)(slider?.name ?? "");
		const [pageId, setPageId] = (0, react.useState)(slider?.pageId ?? 0);
		const [pageTitle, setPageTitle] = (0, react.useState)("");
		const [saving, setSaving] = (0, react.useState)(false);
		const [error, setError] = (0, react.useState)(null);
		async function submit() {
			setError(null);
			if (!name.trim()) {
				setError(t("f_name") + " *");
				return;
			}
			setSaving(true);
			try {
				await saveSlider({
					id: slider?.id ?? null,
					name: name.trim(),
					pageId: pageId ? pageId : null
				});
				onSaved();
			} catch (e) {
				setError(e instanceof Error ? e.message : t("err_save"));
			} finally {
				setSaving(false);
			}
		}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				inset: 0,
				zIndex: 60,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 12,
				boxSizing: "border-box",
				background: "rgba(0,0,0,.5)"
			},
			onClick: (e) => {
				if (e.target === e.currentTarget) onClose();
			},
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...card$1,
					width: "100%",
					maxWidth: 420
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							padding: "16px 20px",
							borderBottom: "1px solid var(--color-border)"
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: 15,
								fontWeight: 600,
								margin: 0
							},
							children: isEdit ? t("rename_slider_title") : t("new_slider_title")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							padding: 20,
							display: "flex",
							flexDirection: "column",
							gap: 16
						},
						children: [
							error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									...card$1,
									borderColor: "#fca5a5",
									background: "#fef2f2",
									color: "#b91c1c",
									padding: "8px 12px",
									fontSize: 13
								},
								children: error
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_name")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								style: inputCss,
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: t("f_name_ph"),
								maxLength: 255,
								autoFocus: true
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_page")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PagePicker, {
								value: pageId,
								title: pageTitle,
								onChange: (id, ttl) => {
									setPageId(id);
									setPageTitle(ttl);
								},
								placeholder: t("f_page_ph"),
								noneLabel: t("f_page_none")
							})] })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "flex-end",
							gap: 8,
							padding: "12px 16px",
							borderTop: "1px solid var(--color-border)"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							style: btnGhost$1,
							onClick: onClose,
							disabled: saving,
							children: t("cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							style: btnPrimary$1,
							onClick: submit,
							disabled: saving,
							children: saving ? "…" : t("save")
						})]
					})
				]
			})
		});
	}
	//#endregion
	//#region src/SlideEditor.tsx
	var can$1 = makeCan("meliscms_slider_tools_section");
	function SlideEditor({ sliderId, slideId, onBack, onSaved }) {
		const t = useT();
		const narrow = useIsNarrow();
		const isEdit = slideId !== "new";
		const fileRef = (0, react.useRef)(null);
		const [status, setStatus] = (0, react.useState)(1);
		const [title, setTitle] = (0, react.useState)("");
		const [sub1, setSub1] = (0, react.useState)("");
		const [sub2, setSub2] = (0, react.useState)("");
		const [sub3, setSub3] = (0, react.useState)("");
		const [link, setLink] = (0, react.useState)("");
		const [img, setImg] = (0, react.useState)("");
		const [loading, setLoading] = (0, react.useState)(isEdit);
		const [uploading, setUploading] = (0, react.useState)(false);
		const [saving, setSaving] = (0, react.useState)(false);
		const [error, setError] = (0, react.useState)(null);
		const [saved, setSaved] = (0, react.useState)(false);
		(0, react.useEffect)(() => {
			if (!isEdit) return;
			setLoading(true);
			fetchSlide(slideId).then((s) => {
				setStatus(s.status);
				setTitle(s.title);
				setSub1(s.sub1);
				setSub2(s.sub2);
				setSub3(s.sub3);
				setLink(s.link);
				setImg(s.img);
			}).catch((e) => setError(e instanceof Error ? e.message : t("err_save"))).finally(() => setLoading(false));
		}, [slideId]);
		async function onPickFile(e) {
			const file = e.target.files?.[0];
			if (!file) return;
			setError(null);
			setUploading(true);
			try {
				const { path } = await uploadSlideImage(sliderId, file);
				setImg(path);
			} catch (err) {
				setError(err instanceof Error ? err.message : t("err_save"));
			} finally {
				setUploading(false);
				if (fileRef.current) fileRef.current.value = "";
			}
		}
		async function submit() {
			setError(null);
			setSaving(true);
			try {
				await saveSlide({
					id: isEdit ? slideId : null,
					sliderId,
					status,
					title,
					sub1,
					sub2,
					sub3,
					link,
					img
				});
				setSaved(true);
				setTimeout(() => onSaved(), 400);
			} catch (e) {
				setError(e instanceof Error ? e.message : t("err_save"));
			} finally {
				setSaving(false);
			}
		}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: 20,
				padding: narrow ? 16 : 24,
				height: "100%",
				boxSizing: "border-box",
				overflow: "auto"
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 12,
							...narrow ? { minWidth: 0 } : {}
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							style: {
								...btnGhost$1,
								height: 32,
								padding: "0 10px",
								...narrow ? { flexShrink: 0 } : {}
							},
							onClick: onBack,
							children: ["← ", t("back")]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: 18,
								fontWeight: 700,
								margin: 0,
								...narrow ? {
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								} : {}
							},
							children: isEdit ? t("edit_slide_title") : t("new_slide_title")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 10
						},
						children: [saved && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 14,
								color: "#059669"
							},
							children: t("saved")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							style: btnPrimary$1,
							onClick: submit,
							disabled: saving || loading || uploading,
							children: saving ? "…" : t("save")
						})]
					})]
				}),
				error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						...card$1,
						borderColor: "#fca5a5",
						background: "#fef2f2",
						color: "#b91c1c",
						padding: "8px 14px",
						fontSize: 14
					},
					children: error
				}),
				loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						padding: 48,
						textAlign: "center",
						color: "var(--color-muted-foreground)"
					},
					children: t("loading")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: narrow ? "minmax(0,1fr)" : "minmax(0,2fr) minmax(0,1fr)",
						gap: 16,
						alignItems: "start"
					},
					children: [can$1("slides.properties") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							...card$1,
							padding: 20,
							display: "flex",
							flexDirection: "column",
							gap: 16
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_title")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								style: inputCss,
								value: title,
								onChange: (e) => setTitle(e.target.value),
								maxLength: 255
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_sub1")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								style: inputCss,
								value: sub1,
								onChange: (e) => setSub1(e.target.value),
								maxLength: 255
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_sub2")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								style: textareaCss,
								value: sub2,
								onChange: (e) => setSub2(e.target.value)
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_sub3")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								style: textareaCss,
								value: sub3,
								onChange: (e) => setSub3(e.target.value)
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_link")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								style: {
									...inputCss,
									fontFamily: "monospace"
								},
								value: link,
								onChange: (e) => setLink(e.target.value),
								placeholder: "https://…"
							})] })
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 16
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								...card$1,
								padding: 20
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: label,
								children: t("f_status")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								onClick: () => setStatus((s) => s ? 0 : 1),
								style: {
									display: "inline-flex",
									alignItems: "center",
									gap: 8,
									height: 36,
									padding: "0 12px",
									borderRadius: 8,
									border: "1px solid var(--color-border)",
									background: "var(--color-card)",
									cursor: "pointer",
									fontSize: 14,
									color: "var(--color-foreground)"
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										width: 34,
										height: 20,
										borderRadius: 999,
										background: status ? "#10b981" : "#ef4444",
										position: "relative",
										transition: "background .15s"
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: {
										position: "absolute",
										top: 2,
										left: status ? 16 : 2,
										width: 16,
										height: 16,
										borderRadius: 999,
										background: "#fff",
										transition: "left .15s"
									} })
								}), status ? t("active") : t("inactive")]
							})]
						}), can$1("slides.image") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								...card$1,
								padding: 20
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
									style: label,
									children: t("f_image")
								}),
								img ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: 8
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
										src: img,
										alt: "",
										style: {
											width: "100%",
											height: "auto",
											maxHeight: 180,
											objectFit: "contain",
											borderRadius: 8,
											border: "1px solid var(--color-border)",
											background: "var(--color-muted,#f3f4f6)"
										}
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											gap: 8,
											flexWrap: "wrap"
										},
										children: [can$1("slides.image.create") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											style: {
												...btnGhost$1,
												height: 32
											},
											onClick: () => fileRef.current?.click(),
											disabled: uploading,
											children: uploading ? t("uploading") : t("choose_img")
										}), can$1("slides.image.delete") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											style: {
												...btnGhost$1,
												height: 32,
												color: "var(--color-destructive,#ef4444)"
											},
											onClick: () => setImg(""),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TrashIcon, {}), t("remove_img")]
										})]
									})]
								}) : can$1("slides.image.create") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									onClick: () => fileRef.current?.click(),
									disabled: uploading,
									style: {
										...card$1,
										width: "100%",
										minHeight: 110,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										gap: 8,
										border: "1px dashed var(--color-border)",
										cursor: "pointer",
										color: "var(--color-muted-foreground)",
										background: "transparent"
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImageIcon, {}), uploading ? t("uploading") : t("choose_img")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									style: hint,
									children: t("f_image_hint")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/jpeg,image/png,image/gif,image/webp",
									style: { display: "none" },
									onChange: onPickFile
								})
							]
						})]
					})]
				})
			]
		});
	}
	//#endregion
	//#region src/SliderEditor.tsx
	var can = makeCan("meliscms_slider_tools_section");
	var COL_LABEL = {
		id: "col_id",
		status: "s_status",
		image: "s_image",
		title: "s_title",
		sub1: "s_sub1",
		link: "s_link",
		order: "s_order"
	};
	var colStore = makeColStore("melis-slider-slides-cols-v2", [
		{
			id: "id",
			visible: true
		},
		{
			id: "status",
			visible: true
		},
		{
			id: "image",
			visible: true
		},
		{
			id: "title",
			visible: true
		},
		{
			id: "sub1",
			visible: true
		},
		{
			id: "link",
			visible: true
		}
	]);
	var ESSENTIAL_COLS = new Set(["title"]);
	function SliderEditor({ sliderId, sliderName, onSaved }) {
		const t = useT();
		const narrow = useIsNarrow();
		const [expanded, setExpanded] = (0, react.useState)(/* @__PURE__ */ new Set());
		const [view, setView] = (0, react.useState)({ kind: "list" });
		const [slides, setSlides] = (0, react.useState)([]);
		const [loading, setLoading] = (0, react.useState)(false);
		const [toDelete, setToDelete] = (0, react.useState)(null);
		const [dragId, setDragId] = (0, react.useState)(null);
		const [overId, setOverId] = (0, react.useState)(null);
		const [tick, setTick] = (0, react.useState)(0);
		const [cols, setCols] = (0, react.useState)(colStore.load);
		const colsAnchorRef = (0, react.useRef)(null);
		const [showCols, setShowCols] = (0, react.useState)(false);
		(0, react.useEffect)(() => {
			if (view.kind !== "list") return;
			setLoading(true);
			fetchSlides(sliderId).then((r) => setSlides(r.items)).catch(() => null).finally(() => setLoading(false));
		}, [
			sliderId,
			view.kind,
			tick
		]);
		async function confirmDelete() {
			if (!toDelete) return;
			try {
				await deleteSlide(toDelete.id);
				setToDelete(null);
				setTick((x) => x + 1);
				onSaved();
			} catch {
				setToDelete(null);
			}
		}
		async function handleDrop(targetId, e) {
			const srcId = dragId ?? (Number(e.dataTransfer.getData("text/plain")) || null);
			if (srcId == null || srcId === targetId) {
				setDragId(null);
				setOverId(null);
				return;
			}
			const from = slides.findIndex((s) => s.id === srcId);
			const to = slides.findIndex((s) => s.id === targetId);
			if (from === -1 || to === -1) {
				setDragId(null);
				setOverId(null);
				return;
			}
			const next = [...slides];
			const [moved] = next.splice(from, 1);
			next.splice(to, 0, moved);
			setSlides(next.map((s, i) => ({
				...s,
				order: i + 1
			})));
			setDragId(null);
			setOverId(null);
			try {
				await reorderSlides(sliderId, next.map((s) => s.id));
			} catch {
				setTick((x) => x + 1);
			}
		}
		const displayCols = narrow ? [...cols.map((c) => ({
			...c,
			visible: ESSENTIAL_COLS.has(c.id)
		})), {
			id: "order",
			visible: false
		}] : cols;
		const hasHidden = narrow;
		const toggleExpand = (id) => setExpanded((prev) => {
			const next = new Set(prev);
			if (!next.delete(id)) next.add(id);
			return next;
		});
		if (view.kind !== "list") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SlideEditor, {
			sliderId,
			slideId: view.kind === "edit" ? view.id : "new",
			onBack: () => setView({ kind: "list" }),
			onSaved: () => {
				setView({ kind: "list" });
				setTick((x) => x + 1);
				onSaved();
			}
		});
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				...pageWrap,
				...narrow ? { padding: 16 } : {}
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: narrow ? { minWidth: 0 } : void 0,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: 18,
								fontWeight: 700,
								margin: 0,
								...narrow ? {
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								} : {}
							},
							children: t("slides_of", { n: sliderName || "#" + sliderId })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							style: {
								fontSize: 13,
								color: "var(--color-muted-foreground)",
								margin: "2px 0 0",
								...narrow ? {
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap"
								} : {}
							},
							children: t("reorder_hint")
						})]
					}), can("slides.create") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						style: {
							...btnPrimary$1,
							...narrow ? {
								flexShrink: 0,
								padding: "0 10px"
							} : {}
						},
						onClick: () => setView({ kind: "new" }),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon$1, {}), t("add_slide")]
					})]
				}),
				!can("slides.list") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						...card$1,
						padding: "40px 16px",
						textAlign: "center",
						fontSize: 14,
						color: "var(--color-muted-foreground)"
					},
					children: t("no_access")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						justifyContent: "flex-end"
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						ref: colsAnchorRef,
						style: {
							position: "relative",
							...narrow ? { flex: 1 } : {}
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							style: {
								...btnGhost$1,
								height: 36,
								...narrow ? {
									width: "100%",
									justifyContent: "center"
								} : {}
							},
							onClick: () => setShowCols((v) => !v),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GripIcon$1, {}), t("columns")]
						}), showCols && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColManager, {
							anchorRef: colsAnchorRef,
							cols,
							labelFor: (id) => t(COL_LABEL[id]),
							onChange: setCols,
							onSave: colStore.save,
							defaults: colStore.defaults,
							onClose: () => setShowCols(false)
						})]
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						...card$1,
						overflow: "hidden",
						flexShrink: 0
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("table", {
						style: {
							width: "100%",
							borderCollapse: "collapse",
							...narrow ? {} : { minWidth: 640 }
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("thead", {
							style: { background: "var(--color-muted,rgba(0,0,0,.03))" },
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { style: {
									...th,
									width: 40
								} }),
								hasHidden && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { style: {
									...th,
									width: 32
								} }),
								!narrow && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: {
										...th,
										width: 50
									},
									children: t("s_order")
								}),
								visibleCols(displayCols).map(({ id }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: {
										...th,
										...id === "id" ? { width: 70 } : id === "status" ? { width: 70 } : id === "image" ? { width: 80 } : {}
									},
									children: t(COL_LABEL[id])
								}, id)),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { style: {
									...th,
									width: 80
								} })
							] })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tbody", { children: slides.length === 0 && !loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
							style: {
								...td,
								textAlign: "center",
								color: "var(--color-muted-foreground)",
								padding: "40px 16px"
							},
							colSpan: visibleCols(displayCols).length + (hasHidden ? 1 : 0) + (narrow ? 2 : 3),
							children: t("no_slides")
						}) }) : slides.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", {
							draggable: can("slides.edit"),
							onDragStart: (e) => {
								if (!can("slides.edit")) return;
								e.dataTransfer.effectAllowed = "move";
								e.dataTransfer.setData("text/plain", String(s.id));
								setDragId(s.id);
							},
							onDragEnd: () => {
								setDragId(null);
								setOverId(null);
							},
							onDragOver: (e) => {
								if (!can("slides.edit")) return;
								e.preventDefault();
								e.dataTransfer.dropEffect = "move";
								if (overId !== s.id) setOverId(s.id);
							},
							onDrop: (e) => {
								if (!can("slides.edit")) return;
								e.preventDefault();
								handleDrop(s.id, e);
							},
							style: {
								cursor: can("slides.edit") ? "grab" : "default",
								opacity: dragId === s.id ? .4 : 1,
								background: overId === s.id && dragId !== s.id ? "color-mix(in srgb, var(--color-primary) 8%, transparent)" : "transparent"
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: {
										...td,
										color: "var(--color-muted-foreground)",
										textAlign: "center"
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GripIcon$1, {})
								}),
								hasHidden && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: td,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandToggle, {
										expanded: expanded.has(s.id),
										onClick: () => toggleExpand(s.id)
									})
								}),
								!narrow && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: {
										...td,
										color: "var(--color-muted-foreground)",
										fontVariantNumeric: "tabular-nums"
									},
									children: s.order
								}),
								visibleCols(displayCols).map(({ id }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("td", {
									style: {
										...td,
										...id === "id" ? {
											color: "var(--color-muted-foreground)",
											fontVariantNumeric: "tabular-nums"
										} : {},
										...id === "sub1" ? {
											color: "var(--color-muted-foreground)",
											maxWidth: 220,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap"
										} : {},
										...id === "link" ? {
											fontFamily: "monospace",
											fontSize: 12,
											color: "var(--color-muted-foreground)",
											maxWidth: 180,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap"
										} : {}
									},
									children: [
										id === "id" && s.id,
										id === "status" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											title: s.status ? t("active") : t("inactive"),
											style: {
												display: "inline-block",
												width: 10,
												height: 10,
												borderRadius: 999,
												background: s.status ? "#22c55e" : "#ef4444"
											}
										}),
										id === "image" && (s.img ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
											src: s.img,
											alt: "",
											style: {
												width: 56,
												height: 34,
												objectFit: "cover",
												borderRadius: 4,
												border: "1px solid var(--color-border)"
											}
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: {
												color: "var(--color-muted-foreground)",
												display: "inline-flex"
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImageIcon, {})
										})),
										id === "title" && (s.title || /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: { color: "var(--color-muted-foreground)" },
											children: "—"
										})),
										id === "sub1" && s.sub1,
										id === "link" && s.link
									]
								}, id)),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: td,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											justifyContent: "flex-end",
											gap: 4
										},
										children: [can("slides.edit") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											style: iconBtn,
											title: t("edit"),
											onClick: () => setView({
												kind: "edit",
												id: s.id
											}),
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PencilIcon, {})
										}), can("slides.delete") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											style: {
												...iconBtn,
												color: "var(--color-destructive,#ef4444)"
											},
											title: t("del"),
											onClick: () => setToDelete(s),
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TrashIcon, {})
										})]
									})
								})
							]
						}), hasHidden && expanded.has(s.id) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HiddenColsRow, {
							cols: displayCols,
							labelFor: (id) => t(COL_LABEL[id]),
							renderValue: (id) => id === "id" ? s.id : id === "order" ? s.order : id === "status" ? s.status ? t("active") : t("inactive") : id === "image" ? s.img ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
								src: s.img,
								alt: "",
								style: {
									width: 56,
									height: 34,
									objectFit: "cover",
									borderRadius: 4,
									border: "1px solid var(--color-border)"
								}
							}) : "—" : id === "title" ? s.title || "—" : id === "sub1" ? s.sub1 : id === "link" ? s.link : "",
							colSpan: visibleCols(displayCols).length + 3,
							narrow
						})] }, s.id)) })]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							padding: "10px 16px",
							textAlign: "center",
							fontSize: 12,
							color: "var(--color-muted-foreground)"
						},
						children: loading ? t("loading") : t("count_slides", { n: slides.length })
					})]
				})] }),
				toDelete && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmModal, {
					title: t("del_slide_title"),
					message: t("del_slide_confirm"),
					confirmLabel: t("del"),
					onConfirm: confirmDelete,
					onCancel: () => setToDelete(null)
				})
			]
		});
	}
	//#endregion
	//#region src/SliderPage.tsx
	/**
	* Reflète le sous-onglet actif dans l'URL : /[section]/[tool]/:id (comme l'outil Utilisateurs).
	* COSMÉTIQUE (history.replaceState) — PAS de navigation React Router (pattern sous-onglets in-tool,
	* état local). Le host (ToolTabBar) ne réécrit pas l'URL de cet outil (SELF_MANAGED_URL).
	*/
	function reflectSubTabUrl(seg) {
		const base = window.location.pathname.replace(/\/(?:new|\d+)$/, "");
		const next = seg != null && seg !== "" ? `${base}/${seg}` : base;
		if (window.location.pathname !== next) window.history.replaceState(window.history.state, "", next);
	}
	/**
	* Sous-onglets ouverts, RESTAURÉS APRÈS UN F5.
	*
	* L'URL ne suffit pas : le bundle de la brique est chargé en différé (React.lazy) et l'hôte peut
	* avoir remis l'URL sur la base avant que SliderPage ne fasse son 1er rendu — l'id lu à ce
	* moment-là est alors déjà perdu. On persiste donc la liste des sliders ouverts (et l'onglet actif)
	* en sessionStorage, comme le fait le store d'onglets de l'hôte (`melis-open-tabs`), et
	* `reflectSubTabUrl` remet ensuite l'id dans l'URL. L'URL reste un point d'entrée valable
	* (deep-link depuis l'extérieur) : elle alimente l'état de boot quand le storage est vide.
	*/
	var SUBTABS_KEY = "melis-slider-subtabs";
	function sliderIdFromUrl() {
		const m = window.location.pathname.match(/\/(\d+)$/);
		return m ? Number(m[1]) : null;
	}
	/** Id présent dans l'URL au chargement du bundle — snapshot le plus précoce possible. */
	var URL_BOOT_ID = sliderIdFromUrl();
	function loadBootState() {
		let open = [];
		let activeId = null;
		try {
			const raw = sessionStorage.getItem(SUBTABS_KEY);
			if (raw) {
				const p = JSON.parse(raw);
				if (Array.isArray(p.open)) open = p.open.filter((o) => o && typeof o.id === "number");
				if (typeof p.activeId === "number") activeId = p.activeId;
			}
		} catch {}
		if (URL_BOOT_ID != null) {
			if (!open.some((o) => o.id === URL_BOOT_ID)) open = [...open, {
				id: URL_BOOT_ID,
				name: ""
			}];
			activeId = URL_BOOT_ID;
		}
		if (activeId != null && !open.some((o) => o.id === activeId)) activeId = null;
		return {
			open,
			activeId
		};
	}
	function saveBootState(open, activeId) {
		try {
			sessionStorage.setItem(SUBTABS_KEY, JSON.stringify({
				open,
				activeId
			}));
		} catch {}
	}
	var LayersIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		width: "13",
		height: "13",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		style: { flexShrink: 0 },
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 2 9 5-9 5-9-5 9-5Z" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 12 9 5 9-5" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 17 9 5 9-5" })
		]
	});
	function SubTabBar({ tabs, activeId, onBack, onSelect, onClose }) {
		const t = useT();
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "stretch",
				borderBottom: "1px solid var(--color-border,#e5e7eb)",
				background: "var(--color-background,#fff)",
				padding: "0 8px",
				overflowX: "auto",
				flexShrink: 0
			},
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				onClick: onBack,
				style: {
					marginRight: 4,
					flexShrink: 0,
					display: "inline-flex",
					alignItems: "center",
					padding: "6px 8px",
					fontSize: 12,
					color: "var(--color-muted-foreground,#6b7280)",
					background: "transparent",
					border: 0,
					cursor: "pointer",
					whiteSpace: "nowrap"
				},
				children: ["← ", t("back")]
			}), tabs.map((tab) => {
				const isActive = activeId === tab.id;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					onClick: () => onSelect(tab.id),
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
						padding: "0 10px",
						fontSize: 12,
						fontWeight: 500,
						cursor: "pointer",
						whiteSpace: "nowrap",
						userSelect: "none",
						borderBottom: isActive ? "2px solid var(--color-primary,#cb4040)" : "2px solid transparent",
						color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground,#6b7280)",
						background: isActive ? "var(--color-background,#fff)" : "transparent"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LayersIcon, {}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								maxWidth: 160,
								overflow: "hidden",
								textOverflow: "ellipsis"
							},
							children: tab.name || "#" + tab.id
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							onClick: (e) => {
								e.stopPropagation();
								onClose(tab.id);
							},
							style: {
								marginLeft: 2,
								borderRadius: 4,
								padding: 2,
								border: 0,
								background: "transparent",
								cursor: "pointer",
								color: "inherit",
								lineHeight: 0
							},
							title: t("back"),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								strokeLinecap: "round",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M18 6 6 18M6 6l12 12" })
							})
						})
					]
				}, tab.id);
			})]
		});
	}
	function SliderPage() {
		const [boot] = (0, react.useState)(loadBootState);
		const [view, setView] = (0, react.useState)(boot.activeId != null ? {
			kind: "edit",
			id: boot.activeId
		} : { kind: "list" });
		const [open, setOpen] = (0, react.useState)(boot.open);
		const [mode, setMode] = (0, react.useState)("react");
		(0, react.useEffect)(() => {
			window.__melisSetToolView?.(MELIS_KEY, mode);
		}, [mode]);
		(0, react.useEffect)(() => {
			for (const o of boot.open) {
				if (o.name) continue;
				fetchSlider(o.id).then((s) => setOpen((prev) => prev.map((p) => p.id === o.id ? {
					...p,
					name: s.name
				} : p))).catch(() => {
					setOpen((prev) => prev.filter((p) => p.id !== o.id));
					setView((v) => v.kind === "edit" && v.id === o.id ? { kind: "list" } : v);
				});
			}
		}, [boot]);
		function changeMode(m) {
			setMode(m);
			if (m === "iframe") setView({ kind: "list" });
		}
		function openEditor(id, name) {
			setOpen((prev) => prev.some((o) => o.id === id) ? prev.map((o) => o.id === id ? {
				...o,
				name
			} : o) : [...prev, {
				id,
				name
			}]);
			setView({
				kind: "edit",
				id
			});
		}
		function closeEditor(id) {
			setOpen((prev) => {
				const rest = prev.filter((o) => o.id !== id);
				setView((v) => v.kind === "edit" && v.id === id ? rest.length ? {
					kind: "edit",
					id: rest[rest.length - 1].id
				} : { kind: "list" } : v);
				return rest;
			});
		}
		const activeId = view.kind === "edit" ? view.id : null;
		(0, react.useEffect)(() => {
			reflectSubTabUrl(activeId);
		}, [activeId]);
		(0, react.useEffect)(() => {
			saveBootState(open, activeId);
		}, [open, activeId]);
		(0, react.useEffect)(() => {
			const onClosed = (e) => {
				const path = e.detail?.path ?? "";
				if (!/\/slider$/.test(path)) return;
				setOpen([]);
				setView({ kind: "list" });
			};
			window.addEventListener("melis:tab-closed", onClosed);
			return () => window.removeEventListener("melis:tab-closed", onClosed);
		}, []);
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				height: "100%"
			},
			children: [mode === "react" && open.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SubTabBar, {
				tabs: open,
				activeId,
				onBack: () => setView({ kind: "list" }),
				onSelect: (id) => setView({
					kind: "edit",
					id
				}),
				onClose: closeEditor
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					flex: 1,
					minHeight: 0
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						height: "100%",
						display: view.kind === "list" ? "block" : "none"
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SliderList, {
						active: view.kind === "list",
						onOpen: openEditor,
						mode,
						onModeChange: changeMode
					})
				}), open.map((o) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						height: "100%",
						display: activeId === o.id ? "block" : "none"
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SliderEditor, {
						sliderId: o.id,
						sliderName: o.name,
						onSaved: () => markSliderListStale()
					})
				}, o.id))]
			})]
		});
	}
	//#endregion
	//#region src/brick.tsx
	window.__melisRegisterBrick?.({
		id: "slider",
		Component: SliderPage
	});
	//#endregion
})(MelisReact, MelisReactJsxRuntime);
