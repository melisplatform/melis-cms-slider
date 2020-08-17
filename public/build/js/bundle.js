$(function() {
	var e = $("body");
	e.on("click", ".sliderInfo", function() {
		var e = $(this),
			i = e.closest("tr").attr("id"),
			t = e
				.closest("tr")
				.find("td:nth-child(2)")
				.text();
		toolSlider.openSliderPage(t, i);
	}),
		e.on("click", function(e) {
			$(e.target).hasClass("modal") &&
				($("#id_MMelisCmsSlider_slider_new_container").modal("hide"),
				$("#id_MelisCmsSlider_modal_form_container").modal("hide"));
		}),
		e.on("click", ".sliderListRefresh", function() {
			melisHelper.zoneReload(
				"id_MelisCmsSlider_list_content_table",
				"MelisCmsSlider_list_content_table",
				{}
			);
		}),
		e.on("click", ".sliderEntryInfo", function() {
			var e = $(this),
				i = e.closest("tr").attr("id"),
				t = e.closest("tr").data("sliderid");
			melisCoreTool.pending(".sliderEntryInfo"),
				(zoneId = "id_MelisCmsSlider_modal_form"),
				(melisKey = "MelisCmsSlider_modal_form"),
				(modalUrl = "/melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal"),
				melisHelper.createModal(
					zoneId,
					melisKey,
					!1,
					{ detailId: i, sliderId: t },
					modalUrl,
					function() {
						melisCoreTool.done(".sliderEntryInfo");
					}
				);
		}),
		e.on("click", ".addSliderData", function() {
			var e = $(this),
				i = e.data("sliderid");
			melisCoreTool.pending(".addSliderData"),
				(zoneId = "id_MelisCmsSlider_modal_form"),
				(melisKey = "MelisCmsSlider_modal_form"),
				(modalUrl = "/melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal"),
				melisHelper.createModal(
					zoneId,
					melisKey,
					!1,
					{ sliderId: i },
					modalUrl,
					function() {
						melisCoreTool.done(".addSliderData");
					}
				);
		}),
		e.on("click", ".addSlider", function() {
			melisCoreTool.pending(".addSlider"),
				(zoneId = "id_MMelisCmsSlider_slider_new"),
				(melisKey = "MMelisCmsSlider_slider_new"),
				(modalUrl = "/melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal"),
				melisHelper.createModal(zoneId, melisKey, !1, {}, modalUrl, function() {
					melisCoreTool.done(".addSlider");
				});
		}),
		e.on("click", ".sliderEdit", function() {
			var e = $(this),
				i = e.closest("tr").attr("id");
			melisCoreTool.pending(".sliderEdit"),
				(zoneId = "id_MMelisCmsSlider_slider_new"),
				(melisKey = "MMelisCmsSlider_slider_new"),
				(modalUrl = "/melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal"),
				melisHelper.createModal(
					zoneId,
					melisKey,
					!1,
					{ sliderId: i },
					modalUrl,
					function() {
						melisCoreTool.done(".sliderEdit");
					}
				);
		}),
		e.on("click", "#saveNewSlider", function() {
			var e = $("#sliderForm").serializeArray();
			melisCoreTool.pending("#saveNewSlider"),
				$.ajax({
					type: "POST",
					url: "/melis/MelisCmsSlider/MelisCmsSliderList/saveSlider",
					data: e,
					dataType: "json",
					encode: !0,
				})
					.done(function(e) {
						e.success
							? ($("#id_MMelisCmsSlider_slider_new_container").modal("hide"),
							  melisHelper.melisOkNotification(e.textTitle, e.textMessage),
							  melisHelper.zoneReload(
									"id_MelisCmsSlider_list_content_table",
									"MelisCmsSlider_list_content_table",
									{}
							  ),
							  melisCore.flashMessenger())
							: melisHelper.melisKoNotification(
									e.textTitle,
									e.textMessage,
									e.errors
							  );
					})
					.fail(function() {
						alert(translations.tr_meliscore_error_message);
					}),
				melisCoreTool.done("#saveNewSlider");
		}),
		e.on("click", "#saveSliderDetails", function() {
			var e = $(
					"form#sliderDetailsForm input[name=mcsdetail_mcslider_id]"
				).val(),
				i = $("#sliderDetailsForm").get(0),
				t = new FormData(i);
			$("#sliderDetails .make-switch div").each(function() {
				var e = $(this),
					i = e.find("input").attr("name"),
					s = e.hasClass("switch-on"),
					a = 0;
				s && (a = 1), t.append(i, a);
			}),
				$.ajax({
					type: "POST",
					url: "/melis/MelisCmsSlider/MelisCmsSliderDetails/saveDetailsForm",
					data: t,
					dataType: "json",
					processData: !1,
					cache: !1,
					contentType: !1,
					encode: !0,
					xhr: function() {
						var e = $.ajaxSettings.xhr();
						return (
							e.upload &&
								e.upload.addEventListener("progress", toolSlider.progress, !1),
							e
						);
					},
				})
					.done(function(i) {
						i.success
							? ($("div.progressContent").addClass("hidden"),
							  $("#id_MelisCmsSlider_modal_form_container").modal("hide"),
							  melisHelper.melisOkNotification(i.textTitle, i.textMessage),
							  melisHelper.zoneReload(
									e + "_id_MelisCmsSlider_content_tabs_properties_details",
									"MelisCmsSlider_content_tabs_properties_details",
									{ sliderId: e }
							  ))
							: melisHelper.melisKoNotification(
									i.textTitle,
									i.textMessage,
									i.errors
							  ),
							melisCore.flashMessenger();
					})
					.fail(function() {
						alert(translations.tr_meliscore_error_message);
					});
		}),
		e.on("click", ".sliderEntryDelete", function() {
			var e = $(this),
				i = e.closest("tr").attr("id"),
				t = e.closest("tr").data("sliderid"),
				s = [];
			s.push({ name: "detailsId", value: i }),
				melisCoreTool.pending(this),
				melisCoreTool.confirm(
					translations.tr_MelisCmsSliderDetails_common_label_yes,
					translations.tr_MelisCmsSliderDetails_common_label_no,
					translations.tr_MelisCmsSliderDetails_page_delete_detail,
					translations.tr_MelisCmsSliderDetails_delete_confirm,
					function() {
						$.ajax({
							type: "POST",
							url: "/melis/MelisCmsSlider/MelisCmsSliderDetails/deleteDetails",
							data: s,
							dataType: "json",
							encode: !0,
						})
							.done(function(e) {
								e.success
									? (melisHelper.melisOkNotification(
											e.textTitle,
											e.textMessage
									  ),
									  melisHelper.zoneReload(
											t + "_id_MelisCmsSlider_content_tabs_properties_details",
											"MelisCmsSlider_content_tabs_properties_details",
											{ sliderId: t }
									  ))
									: melisHelper.melisKoNotification(
											e.textTitle,
											e.textMessage,
											e.errors
									  ),
									melisCore.flashMessenger();
							})
							.fail(function() {
								alert(translations.tr_meliscore_error_message);
							});
					}
				),
				melisCoreTool.done(this);
		}),
		e.on("click", ".sliderDelete", function() {
			var e =
					($(this),
					$(this)
						.closest("tr")
						.attr("id")),
				i = [];
			i.push({ name: "sliderId", value: e }),
				melisCoreTool.pending(this),
				melisCoreTool.confirm(
					translations.tr_MelisCmsSliderDetails_common_label_yes,
					translations.tr_MelisCmsSliderDetails_common_label_no,
					translations.tr_MelisCmsSliderDetails_page_delete_slider,
					translations.tr_MelisCmsSliderDetails_delete_slider_confirm,
					function() {
						$.ajax({
							type: "POST",
							url: "/melis/MelisCmsSlider/MelisCmsSliderList/deleteSlider",
							data: i,
							dataType: "json",
							encode: !0,
						})
							.done(function(i) {
								i.success
									? (melisHelper.melisOkNotification(
											i.textTitle,
											i.textMessage
									  ),
									  melisHelper.tabClose(e + "_id_MelisCmsSlider_page"),
									  melisHelper.zoneReload(
											"id_MelisCmsSlider_list_content_table",
											"MelisCmsSlider_list_content_table",
											{}
									  ))
									: melisHelper.melisKoNotification(
											i.textTitle,
											i.textMessage,
											i.errors
									  ),
									melisCore.flashMessenger();
							})
							.fail(function() {
								alert(translations.tr_meliscore_error_message);
							});
					}
				),
				melisCoreTool.done(this);
		}),
		e.on("click", "#generateInputFindPageTree span", function() {
			melisLinkTree.createInputTreeModal("#mcslide_page_id");
		});
});
var toolSlider = {
	refreshTable: function() {
		melisHelper.zoneReload(
			"id_MelisTechnology_table_list_content_table",
			"MelisTechnology_table_list_content_table"
		);
	},
	openSliderPage: function(e, i, t, s) {
		melisHelper.disableAllTabs(),
			melisHelper.tabOpen(
				e,
				"fa fa-columns",
				i + "_id_MelisCmsSlider_page",
				"MelisCmsSlider_page",
				{ sliderId: i },
				"id_meliscms_slider_tools_section"
			),
			melisHelper.enableAllTabs();
	},
	progress: function(e) {
		if (
			($("div.progressContent").removeClass("hidden"),
			$("div.progressContent > div.progress > div.progress-bar").attr(
				"aria-valuenow",
				0
			),
			$("div.progressContent > div.progress > div.progress-bar").css(
				"width",
				"0%"
			),
			$("div.progressContent > div.progress > span.status").html(""),
			e.lengthComputable)
		) {
			var i = e.total,
				t = e.loaded,
				s = (100 * t) / i;
			$("div.progressContent > div.progress > div.progress-bar").attr(
				"aria-valuenow",
				s
			),
				$("div.progressContent > div.progress > div.progress-bar").css(
					"width",
					s + "%"
				),
				s > 100
					? $("div.progressContent").addClass("hidden")
					: $("div.progressContent > div.progress > span.status").html(
							Math.round(s) + "%"
					  );
		}
	},
};
(window.initSliderDetails = function(data, tblSettings) {
	var sliderId = $("#" + tblSettings.sTableId).data("sliderid");
	(data.sliderId = sliderId),
		$("#" + sliderId + "_sliderDetails").on("row-reorder.dt", function(
			e,
			diff,
			edit
		) {
			for (
				var result =
						"Reorder started on row: " + edit.triggerRow.data()[1] + "<br>",
					i = 0,
					ien = diff.length;
				i < ien;
				i++
			) {
				var rowData = eval("$" + sliderId + "_sliderDetails")
					.row(diff[i].node)
					.data();
				result +=
					rowData[1] +
					" updated to be in position " +
					diff[i].newData +
					" (was " +
					diff[i].oldData +
					")<br>";
			}
			if (!$.isEmptyObject(diff)) {
				var dataString = new Array(),
					prdNodes = new Array();
				$.each(diff, function() {
					prdNodes.push(this.node.id + "-" + this.newPosition);
				}),
					dataString.push({ name: "sliderOrderData", value: prdNodes.join() }),
					(dataString = $.param(dataString)),
					$.ajax({
						type: "POST",
						url:
							"/melis/MelisCmsSlider/MelisCmsSliderDetails/reOrderSliderDetails",
						data: dataString,
						dataType: "json",
						encode: !0,
					})
						.done(function(e) {
							e.success || alert(translations.tr_meliscore_error_message);
						})
						.fail(function() {
							alert(translations.tr_meliscore_error_message);
						});
			}
		});
}),
	(function(e) {
		"use strict";
		e.fn.bootstrapSwitch = function(i) {
			var t = 'input[type!="hidden"]',
				s = {
					init: function() {
						return this.each(function() {
							var i,
								s,
								a,
								l,
								r,
								d,
								n = e(this),
								o = n.closest("form"),
								c = "",
								m = n.attr("class"),
								f = "ON",
								h = "OFF",
								p = !1,
								u = !1;
							e.each(["switch-mini", "switch-small", "switch-large"], function(
								e,
								i
							) {
								m.indexOf(i) >= 0 && (c = i);
							}),
								n.addClass("has-switch"),
								void 0 !== n.data("on") && (r = "switch-" + n.data("on")),
								void 0 !== n.data("on-label") && (f = n.data("on-label")),
								void 0 !== n.data("off-label") && (h = n.data("off-label")),
								void 0 !== n.data("label-icon") && (p = n.data("label-icon")),
								void 0 !== n.data("text-label") && (u = n.data("text-label")),
								(s = e("<span>")
									.addClass("switch-left")
									.addClass(c)
									.addClass(r)
									.html(f)),
								(r = ""),
								void 0 !== n.data("off") && (r = "switch-" + n.data("off")),
								(a = e("<span>")
									.addClass("switch-right")
									.addClass(c)
									.addClass(r)
									.html(h)),
								(l = e("<label>")
									.html("&nbsp;")
									.addClass(c)
									.attr("for", n.find(t).attr("id"))),
								p && l.html('<i class="icon ' + p + '"></i>'),
								u && l.html("" + u),
								(i = n
									.find(t)
									.wrap(e("<div>"))
									.parent()
									.data("animated", !1)),
								!1 !== n.data("animated") &&
									i.addClass("switch-animate").data("animated", !0),
								i
									.append(s)
									.append(l)
									.append(a),
								n
									.find(">div")
									.addClass(
										n.find(t).is(":checked") ? "switch-on" : "switch-off"
									),
								n.find(t).is(":disabled") && e(this).addClass("deactivate");
							var _ = function(e) {
								n.parent("label").is(".label-change-switch") ||
									e
										.siblings("label")
										.trigger("mousedown")
										.trigger("mouseup")
										.trigger("click");
							};
							n.on("keydown", function(i) {
								32 === i.keyCode &&
									(i.stopImmediatePropagation(),
									i.preventDefault(),
									_(e(i.target).find("span:first")));
							}),
								s.on("click", function(i) {
									_(e(this));
								}),
								a.on("click", function(i) {
									_(e(this));
								}),
								n.find(t).on("change", function(i, t) {
									var s = e(this),
										a = s.parent(),
										l = s.is(":checked"),
										r = a.is(".switch-off");
									if ((i.preventDefault(), a.css("left", ""), r === l)) {
										if (
											(l
												? a.removeClass("switch-off").addClass("switch-on")
												: a.removeClass("switch-on").addClass("switch-off"),
											!1 !== a.data("animated") && a.addClass("switch-animate"),
											"boolean" == typeof t && t)
										)
											return;
										a.parent().trigger("switch-change", { el: s, value: l });
									}
								}),
								n.find("label").on("mousedown touchstart", function(i) {
									var t = e(this);
									(d = !1),
										i.preventDefault(),
										i.stopImmediatePropagation(),
										t.closest("div").removeClass("switch-animate"),
										t.closest(".has-switch").is(".deactivate")
											? t.unbind("click")
											: t
													.closest(".switch-on")
													.parent()
													.is(".radio-no-uncheck")
											? t.unbind("click")
											: (t.on("mousemove touchmove", function(i) {
													var t = e(this).closest(".make-switch"),
														s =
															(i.pageX ||
																i.originalEvent.targetTouches[0].pageX) -
															t.offset().left,
														a = (s / t.width()) * 100;
													(d = !0),
														a < 25 ? (a = 25) : a > 75 && (a = 75),
														t.find(">div").css("left", a - 75 + "%");
											  }),
											  t.on("click touchend", function(i) {
													var t = e(this),
														s = e(i.target),
														a = s.siblings("input");
													i.stopImmediatePropagation(),
														i.preventDefault(),
														t.unbind("mouseleave"),
														d
															? a.prop(
																	"checked",
																	!(parseInt(t.parent().css("left")) < -25)
															  )
															: a.prop("checked", !a.is(":checked")),
														(d = !1),
														a.trigger("change");
											  }),
											  t.on("mouseleave", function(i) {
													var t = e(this),
														s = t.siblings("input");
													i.preventDefault(),
														i.stopImmediatePropagation(),
														t.unbind("mouseleave"),
														t.trigger("mouseup"),
														s
															.prop(
																"checked",
																!(parseInt(t.parent().css("left")) < -25)
															)
															.trigger("change");
											  }),
											  t.on("mouseup", function(i) {
													i.stopImmediatePropagation(),
														i.preventDefault(),
														e(this).unbind("mousemove");
											  }));
								}),
								"injected" !== o.data("bootstrapSwitch") &&
									(o.bind("reset", function() {
										setTimeout(function() {
											o.find(".make-switch").each(function() {
												var i = e(this).find(t);
												i.prop("checked", i.is(":checked")).trigger("change");
											});
										}, 1);
									}),
									o.data("bootstrapSwitch", "injected"));
						});
					},
					toggleActivation: function() {
						var i = e(this);
						i.toggleClass("deactivate"),
							i.find(t).prop("disabled", i.is(".deactivate"));
					},
					isActive: function() {
						return !e(this).hasClass("deactivate");
					},
					setActive: function(i) {
						var s = e(this);
						i
							? (s.removeClass("deactivate"), s.find(t).removeAttr("disabled"))
							: (s.addClass("deactivate"),
							  s.find(t).attr("disabled", "disabled"));
					},
					toggleState: function(i) {
						var t = e(this).find(":checkbox");
						t.prop("checked", !t.is(":checked")).trigger("change", i);
					},
					toggleRadioState: function(i) {
						var t = e(this).find(":radio");
						t.not(":checked")
							.prop("checked", !t.is(":checked"))
							.trigger("change", i);
					},
					toggleRadioStateAllowUncheck: function(i, t) {
						var s = e(this).find(":radio");
						i
							? s.not(":checked").trigger("change", t)
							: s
									.not(":checked")
									.prop("checked", !s.is(":checked"))
									.trigger("change", t);
					},
					setState: function(i, s) {
						e(this)
							.find(t)
							.prop("checked", i)
							.trigger("change", s);
					},
					setOnLabel: function(i) {
						e(this)
							.find(".switch-left")
							.html(i);
					},
					setOffLabel: function(i) {
						e(this)
							.find(".switch-right")
							.html(i);
					},
					setOnClass: function(i) {
						var t = e(this).find(".switch-left"),
							s = "";
						void 0 !== i &&
							(void 0 !== e(this).attr("data-on") &&
								(s = "switch-" + e(this).attr("data-on")),
							t.removeClass(s),
							(s = "switch-" + i),
							t.addClass(s));
					},
					setOffClass: function(i) {
						var t = e(this).find(".switch-right"),
							s = "";
						void 0 !== i &&
							(void 0 !== e(this).attr("data-off") &&
								(s = "switch-" + e(this).attr("data-off")),
							t.removeClass(s),
							(s = "switch-" + i),
							t.addClass(s));
					},
					setAnimated: function(i) {
						var s = e(this)
							.find(t)
							.parent();
						void 0 === i && (i = !1),
							s.data("animated", i),
							s.attr("data-animated", i),
							!1 !== s.data("animated")
								? s.addClass("switch-animate")
								: s.removeClass("switch-animate");
					},
					setSizeClass: function(i) {
						var t = e(this),
							s = t.find(".switch-left"),
							a = t.find(".switch-right"),
							l = t.find("label");
						e.each(["switch-mini", "switch-small", "switch-large"], function(
							e,
							t
						) {
							t !== i
								? (s.removeClass(t), a.removeClass(t), l.removeClass(t))
								: (s.addClass(t), a.addClass(t), l.addClass(t));
						});
					},
					status: function() {
						return e(this)
							.find(t)
							.is(":checked");
					},
					destroy: function() {
						var i,
							t = e(this),
							s = t.find("div"),
							a = t.closest("form");
						return (
							s.find(":not(input)").remove(),
							(i = s.children()),
							i.unwrap().unwrap(),
							i.unbind("change"),
							a && (a.unbind("reset"), a.removeData("bootstrapSwitch")),
							i
						);
					},
				};
			return s[i]
				? s[i].apply(this, Array.prototype.slice.call(arguments, 1))
				: "object" != typeof i && i
				? void e.error("Method " + i + " does not exist!")
				: s.init.apply(this, arguments);
		};
	})(jQuery);
