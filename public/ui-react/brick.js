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
		if (params.search) qs.set("search", params.search);
		const q = qs.toString();
		return apiFetch(`${BASE}${q ? `?${q}` : ""}`);
	}
	async function fetchSliderStats() {
		return apiFetch(`${BASE}/stats`);
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
	var sIcon$1 = {
		width: 15,
		height: 15,
		flexShrink: 0
	};
	var PencilIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon$1,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 20h9" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" })]
	});
	var TrashIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon$1,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" })
	});
	var PlusIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon$1,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" })
	});
	var ImageIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon$1,
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
		style: sIcon$1,
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
	function ColManager({ cols, labelFor, onChange, onSave, defaults, onClose }) {
		const t = useT();
		const [dragId, setDragId] = (0, react.useState)(null);
		const [over, setOver] = (0, react.useState)(null);
		const shown = cols.filter((c) => c.visible);
		const hidden = cols.filter((c) => !c.visible);
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
				onDragStart: () => setDragId(col.id),
				onDragEnd: () => {
					setDragId(null);
					setOver(null);
				},
				onDragOver: (e) => {
					e.preventDefault();
					e.stopPropagation();
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
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				...card$1,
				position: "absolute",
				right: 0,
				top: "100%",
				marginTop: 6,
				zIndex: 50,
				width: 380,
				maxWidth: "calc(100vw - 1rem)"
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
							color: "var(--color-muted-foreground)"
						},
						onClick: () => {
							onChange(defaults);
							onSave(defaults);
						},
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
				onDragStart: () => setDragId(col.id),
				onDragEnd: () => {
					setDragId(null);
					setOver(null);
				},
				onDragOver: (e) => {
					e.preventDefault();
					e.stopPropagation();
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
								gridTemplateColumns: "1fr 1fr",
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
	var sIcon = {
		width: 15,
		height: 15,
		flexShrink: 0
	};
	var SparkIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		style: sIcon,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" })
	});
	var LayoutIcon = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		style: sIcon,
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
	function ViewToggle({ mode, onChange }) {
		const tab = (active) => ({
			display: "inline-flex",
			alignItems: "center",
			gap: 6,
			height: 30,
			padding: "0 12px",
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
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SparkIcon, {}), "New"]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				style: tab(mode === "iframe"),
				onClick: () => onChange("iframe"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LayoutIcon, {}), "Old"]
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
	//#region src/SliderList.tsx
	var MELIS_KEY = "MelisCmsSlider_left_menu";
	var can$1 = makeCan("melis_cms_slider_tool");
	var COL_LABEL = {
		id: "col_id",
		name: "col_name",
		page: "col_page",
		slides: "col_slides"
	};
	var colStore = makeColStore("melis-slider-cols-v1", [
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
	function SliderList({ active, onOpen }) {
		const t = useT();
		const [items, setItems] = (0, react.useState)([]);
		const [stats, setStats] = (0, react.useState)(null);
		const [loading, setLoading] = (0, react.useState)(false);
		const [searchInput, setSearchInput] = (0, react.useState)("");
		const [search, setSearch] = (0, react.useState)("");
		const [sortAsc, setSortAsc] = (0, react.useState)(false);
		const [toDelete, setToDelete] = (0, react.useState)(null);
		const [editSlider, setEditSlider] = (0, react.useState)(null);
		const [tick, setTick] = (0, react.useState)(0);
		const [cols, setCols] = (0, react.useState)(colStore.load);
		const [showCols, setShowCols] = (0, react.useState)(false);
		const [showExport, setShowExport] = (0, react.useState)(false);
		const [mode, setMode] = (0, react.useState)("react");
		const [frameLoaded, setFrameLoaded] = (0, react.useState)(false);
		(0, react.useEffect)(() => {
			fetchSliderStats().then(setStats).catch(() => null);
		}, [tick]);
		(0, react.useEffect)(() => {
			setLoading(true);
			fetchSliders({ search }).then((r) => setItems(r.items)).catch(() => null).finally(() => setLoading(false));
		}, [search, tick]);
		(0, react.useEffect)(() => {
			if (active && consumeSliderListStale()) setTick((x) => x + 1);
		}, [active]);
		const sorted = (0, react.useMemo)(() => [...items].sort((a, b) => sortAsc ? a.id - b.id : b.id - a.id), [items, sortAsc]);
		async function confirmDelete() {
			if (!toDelete) return;
			try {
				await deleteSlider(toDelete.id);
				setToDelete(null);
				setTick((x) => x + 1);
			} catch {
				setToDelete(null);
			}
		}
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: pageWrap,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", {
						style: {
							fontSize: 20,
							fontWeight: 700,
							margin: 0
						},
						children: t("title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						style: {
							fontSize: 14,
							color: "var(--color-muted-foreground)",
							margin: "2px 0 0"
						},
						children: t("subtitle")
					})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ViewToggle, {
								mode,
								onChange: (m) => {
									setMode(m);
									if (m === "iframe") setFrameLoaded(true);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								style: btnGhost$1,
								onClick: () => setTick((x) => x + 1),
								title: t("refresh"),
								children: "↻"
							}),
							can$1("create") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								style: btnPrimary$1,
								onClick: () => setEditSlider("new"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon, {}), t("new")]
							})
						]
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
						src: `/melis/react-tool-page?key=${encodeURIComponent(MELIS_KEY)}`,
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
					children: !can$1("list") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
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
										minWidth: 220
									},
									value: searchInput,
									onChange: (e) => setSearchInput(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && setSearch(searchInput.trim()),
									placeholder: t("search")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: { position: "relative" },
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										style: {
											...btnGhost$1,
											height: 36
										},
										onClick: () => setShowCols((v) => !v),
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GripIcon$1, {}), t("columns")]
									}), showCols && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColManager, {
										cols,
										labelFor: (id) => t(COL_LABEL[id]),
										onChange: setCols,
										onSave: colStore.save,
										defaults: colStore.defaults,
										onClose: () => setShowCols(false)
									})]
								}),
								can$1("export") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									style: {
										...btnGhost$1,
										height: 36
									},
									onClick: () => setShowExport(true),
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(DownloadIcon, {}), t("export")]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								...card$1,
								overflow: "hidden"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("table", {
								style: {
									width: "100%",
									borderCollapse: "collapse",
									minWidth: 560
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("thead", {
									style: { background: "var(--color-muted,rgba(0,0,0,.03))" },
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [visibleCols(cols).map(({ id }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("th", {
										style: {
											...th,
											...id === "id" ? {
												cursor: "pointer",
												width: 70
											} : {}
										},
										onClick: id === "id" ? () => setSortAsc((v) => !v) : void 0,
										children: [t(COL_LABEL[id]), id === "id" ? ` ${sortAsc ? "↑" : "↓"}` : ""]
									}, id)), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { style: {
										...th,
										width: 110
									} })] })
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tbody", { children: sorted.length === 0 && !loading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: {
										...td,
										textAlign: "center",
										color: "var(--color-muted-foreground)",
										padding: "40px 16px"
									},
									colSpan: visibleCols(cols).length + 1,
									children: t("empty")
								}) }) : sorted.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [visibleCols(cols).map(({ id }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("td", {
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
								}, id)), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: td,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											justifyContent: "flex-end",
											gap: 4
										},
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												style: iconBtn,
												title: t("open"),
												onClick: () => onOpen(s.id, s.name),
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PencilIcon, {})
											}),
											can$1("edit") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
												style: iconBtn,
												title: t("rename"),
												onClick: () => setEditSlider(s),
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RenameIcon, {})
											}),
											can$1("delete") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
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
								})] }, s.id)) })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									padding: "10px 16px",
									textAlign: "center",
									fontSize: 12,
									color: "var(--color-muted-foreground)"
								},
								children: loading ? t("loading") : t("count", { n: items.length })
							})]
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
					labelFor: (id) => t(COL_LABEL[id]),
					fetchAll: async () => (await fetchSliders({ search })).items,
					getCell: (s, id) => id === "id" ? s.id : id === "name" ? s.name : id === "page" ? s.pageId ?? "" : id === "slides" ? s.slideCount : "",
					filename: "sliders",
					sheetName: t("title"),
					total: items.length,
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
	function SlideEditor({ sliderId, slideId, onBack, onSaved }) {
		const t = useT();
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
				padding: 24,
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
							gap: 12
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							style: {
								...btnGhost$1,
								height: 32,
								padding: "0 10px"
							},
							onClick: onBack,
							children: ["← ", t("back")]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							style: {
								fontSize: 18,
								fontWeight: 700,
								margin: 0
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
						gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
						gap: 16,
						alignItems: "start"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
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
											gap: 8
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											style: {
												...btnGhost$1,
												height: 32
											},
											onClick: () => fileRef.current?.click(),
											disabled: uploading,
											children: uploading ? t("uploading") : t("choose_img")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											style: {
												...btnGhost$1,
												height: 32,
												color: "var(--color-destructive,#ef4444)"
											},
											onClick: () => setImg(""),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TrashIcon, {}), t("remove_img")]
										})]
									})]
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
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
	var can = makeCan("melis_cms_slider_tool");
	function SliderEditor({ sliderId, sliderName, onSaved }) {
		const t = useT();
		const [view, setView] = (0, react.useState)({ kind: "list" });
		const [slides, setSlides] = (0, react.useState)([]);
		const [loading, setLoading] = (0, react.useState)(false);
		const [toDelete, setToDelete] = (0, react.useState)(null);
		const [dragId, setDragId] = (0, react.useState)(null);
		const [overId, setOverId] = (0, react.useState)(null);
		const [tick, setTick] = (0, react.useState)(0);
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
		async function handleDrop(targetId) {
			if (dragId == null || dragId === targetId) {
				setDragId(null);
				setOverId(null);
				return;
			}
			const from = slides.findIndex((s) => s.id === dragId);
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
			style: pageWrap,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						style: {
							fontSize: 18,
							fontWeight: 700,
							margin: 0
						},
						children: t("slides_of", { n: sliderName || "#" + sliderId })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						style: {
							fontSize: 13,
							color: "var(--color-muted-foreground)",
							margin: "2px 0 0"
						},
						children: t("reorder_hint")
					})] }), can("create") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						style: btnPrimary$1,
						onClick: () => setView({ kind: "new" }),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlusIcon, {}), t("add_slide")]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						...card$1,
						overflow: "hidden"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("table", {
						style: {
							width: "100%",
							borderCollapse: "collapse",
							minWidth: 640
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("thead", {
							style: { background: "var(--color-muted,rgba(0,0,0,.03))" },
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { style: {
									...th,
									width: 40
								} }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: {
										...th,
										width: 50
									},
									children: t("s_order")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: {
										...th,
										width: 70
									},
									children: t("s_status")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: {
										...th,
										width: 80
									},
									children: t("s_image")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: th,
									children: t("s_title")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: th,
									children: t("s_sub1")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", {
									style: th,
									children: t("s_link")
								}),
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
							colSpan: 8,
							children: t("no_slides")
						}) }) : slides.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", {
							draggable: true,
							onDragStart: () => setDragId(s.id),
							onDragEnd: () => {
								setDragId(null);
								setOverId(null);
							},
							onDragOver: (e) => {
								e.preventDefault();
								if (overId !== s.id) setOverId(s.id);
							},
							onDrop: (e) => {
								e.preventDefault();
								handleDrop(s.id);
							},
							style: {
								cursor: "grab",
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
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: {
										...td,
										color: "var(--color-muted-foreground)",
										fontVariantNumeric: "tabular-nums"
									},
									children: s.order
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: td,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										title: s.status ? t("active") : t("inactive"),
										style: {
											display: "inline-block",
											width: 10,
											height: 10,
											borderRadius: 999,
											background: s.status ? "#22c55e" : "#ef4444"
										}
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: td,
									children: s.img ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
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
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: td,
									children: s.title || /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: { color: "var(--color-muted-foreground)" },
										children: "—"
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: {
										...td,
										color: "var(--color-muted-foreground)",
										maxWidth: 220,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap"
									},
									children: s.sub1
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: {
										...td,
										fontFamily: "monospace",
										fontSize: 12,
										color: "var(--color-muted-foreground)",
										maxWidth: 180,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap"
									},
									children: s.link
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", {
									style: td,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											justifyContent: "flex-end",
											gap: 4
										},
										children: [can("edit") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											style: iconBtn,
											title: t("edit"),
											onClick: () => setView({
												kind: "edit",
												id: s.id
											}),
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PencilIcon, {})
										}), can("delete") && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
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
						}, s.id)) })]
					}), loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							padding: "10px 16px",
							textAlign: "center",
							fontSize: 12,
							color: "var(--color-muted-foreground)"
						},
						children: t("loading")
					})]
				}),
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
		const [view, setView] = (0, react.useState)({ kind: "list" });
		const [open, setOpen] = (0, react.useState)([]);
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
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				height: "100%"
			},
			children: [open.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SubTabBar, {
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
						onOpen: openEditor
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
