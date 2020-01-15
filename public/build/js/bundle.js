$(function(){
	var $body = $("body");
	
		$body.on("click", '.sliderInfo', function() {
			var $this 	= $(this),
				tableId = $this.closest('tr').attr('id'),
				name 	= $this.closest('tr').find("td:nth-child(2)").text();
			
				toolSlider.openSliderPage(name, tableId);
		});

		//removes modal elements when clicking outside
		$body.on("click", function (e) {
			if ( $(e.target).hasClass('modal') ) {
				$('#id_MMelisCmsSlider_slider_new_container').modal('hide');
				$('#id_MelisCmsSlider_modal_form_container').modal('hide');
			}
		});
			
		$body.on("click", '.sliderListRefresh', function() {
			melisHelper.zoneReload("id_MelisCmsSlider_list_content_table", "MelisCmsSlider_list_content_table", {});
		});
		
		$body.on("click", '.sliderEntryInfo', function() {
			var $this 		= $(this),
				detailId 	= $this.closest('tr').attr('id'),
				sliderId 	= $this.closest('tr').data('sliderid');

				melisCoreTool.pending('.sliderEntryInfo');
			
				// initialation of local variable
				zoneId 		= 'id_MelisCmsSlider_modal_form';
				melisKey 	= 'MelisCmsSlider_modal_form';
				modalUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';

				// requesitng to create modal and display after
				melisHelper.createModal(zoneId, melisKey, false, {'detailId': detailId, 'sliderId': sliderId}, modalUrl, function() {
					melisCoreTool.done('.sliderEntryInfo');
				});
		});
		
		$body.on("click", '.addSliderData', function() {
			var $this 		= $(this),
				sliderId 	= $this.data('sliderid');

				melisCoreTool.pending('.addSliderData');
				
				// initialation of local variable
				zoneId 		= 'id_MelisCmsSlider_modal_form';
				melisKey 	= 'MelisCmsSlider_modal_form';
				modalUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';

				// requesitng to create modal and display after
				melisHelper.createModal(zoneId, melisKey, false, {'sliderId': sliderId}, modalUrl, function() {
					melisCoreTool.done('.addSliderData');
				});
		});
		
		$body.on("click", '.addSlider', function() {
			melisCoreTool.pending('.addSlider');

			// initialation of local variable
			zoneId 		= 'id_MMelisCmsSlider_slider_new';
			melisKey 	= 'MMelisCmsSlider_slider_new';
			modalUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';

			// requesitng to create modal and display after
			melisHelper.createModal(zoneId, melisKey, false, {}, modalUrl, function() {
				melisCoreTool.done('.addSlider');
			});
		});	
		
		$body.on("click", '.sliderEdit', function() {
			var $this 		= $(this),
				sliderId 	= $this.closest('tr').attr('id');

				melisCoreTool.pending('.sliderEdit');

				// initialation of local variable
				zoneId 		= 'id_MMelisCmsSlider_slider_new';
				melisKey 	= 'MMelisCmsSlider_slider_new';
				modalUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';
				
				// requesitng to create modal and display after
				melisHelper.createModal(zoneId, melisKey, false, {'sliderId': sliderId}, modalUrl, function() {
					melisCoreTool.done('.sliderEdit');
				});
		});
		
		$body.on("click", "#saveNewSlider", function() {
			var ajaxUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderList/saveSlider',
				dataString 	= $('#sliderForm').serializeArray();

			melisCoreTool.pending('#saveNewSlider');
			
			$.ajax({
				type        : 'POST', 
				url         : ajaxUrl,
				data		: dataString,
				dataType    : 'json',
				encode		: true,
			}).done(function(data){
				if(data.success){
						$("#id_MMelisCmsSlider_slider_new_container").modal("hide");
						melisHelper.melisOkNotification( data.textTitle, data.textMessage );
						melisHelper.zoneReload("id_MelisCmsSlider_list_content_table", "MelisCmsSlider_list_content_table", {});
						melisCore.flashMessenger();
				}else{
					melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
				}	
			}).fail(function(){
				alert( translations.tr_meliscore_error_message );
			});
			melisCoreTool.done('#saveNewSlider');
		});
		
		$body.on("click", "#saveSliderDetails", function() {
			var ajaxUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderDetails/saveDetailsForm',
				sliderId 	= $('form#sliderDetailsForm input[name=mcsdetail_mcslider_id]').val(),
				tmpForm 	= $('#sliderDetailsForm').get(0),
				sliderData 	= new FormData(tmpForm);
			
				$('#sliderDetails .make-switch div').each(function(){
					var $this 		= $(this),
						field 		= $this.find('input').attr('name'),
						status 		= $this.hasClass('switch-on'),
						saveStatus 	= 0;

						if ( status ) {
							saveStatus = 1;
						}
						sliderData.append(field,saveStatus);
				});
				
				$.ajax({
					type        : 'POST', 
					url         : ajaxUrl,
					data		: sliderData,
					dataType    : 'json',
					processData : false,
					cache       : false,
					contentType : false,
					encode		: true,
					xhr: function() {
						var fileXhr = $.ajaxSettings.xhr();

							if ( fileXhr.upload ) {
								fileXhr.upload.addEventListener('progress',toolSlider.progress, false);
							}

							return fileXhr;
					},
				}).done(function(data){
					if(data.success){
							$("div.progressContent").addClass("hidden");
							$("#id_MelisCmsSlider_modal_form_container").modal("hide");
							melisHelper.melisOkNotification( data.textTitle, data.textMessage );
							melisHelper.zoneReload(sliderId+"_id_MelisCmsSlider_content_tabs_properties_details", "MelisCmsSlider_content_tabs_properties_details", {'sliderId' : sliderId});
					}else{
						melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
					}
					melisCore.flashMessenger();
				}).fail(function(){
					alert( translations.tr_meliscore_error_message );
				});
		});
		
		$body.on("click", ".sliderEntryDelete", function() { 
			var $this 		= $(this),
				detailsId 	= $this.closest('tr').attr('id'),
				sliderId 	= $this.closest('tr').data('sliderid'),
				ajaxUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderDetails/deleteDetails',
				dataString 	= [];

				dataString.push({
					name : 'detailsId',
					value: detailsId,
				});
				
				melisCoreTool.pending(this);
				
				melisCoreTool.confirm(
					translations.tr_MelisCmsSliderDetails_common_label_yes,
					translations.tr_MelisCmsSliderDetails_common_label_no,
					translations.tr_MelisCmsSliderDetails_page_delete_detail, 
					translations.tr_MelisCmsSliderDetails_delete_confirm,
					function() {
						$.ajax({
							type        : 'POST', 
							url         : ajaxUrl,
							data		: dataString,
							dataType    : 'json',
							encode		: true,
						}).done(function(data){
							if(data.success){				
									melisHelper.melisOkNotification( data.textTitle, data.textMessage );
									melisHelper.zoneReload(sliderId+"_id_MelisCmsSlider_content_tabs_properties_details", "MelisCmsSlider_content_tabs_properties_details", {'sliderId' : sliderId});
							}else{
								melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
							}		
							melisCore.flashMessenger();	
						}).fail(function(){
							alert( translations.tr_meliscore_error_message );
						});
				});
				
				melisCoreTool.done(this);
		});
		
		$body.on("click", ".sliderDelete", function() { 
			var $this 		= $(this),
				sliderId 	= $(this).closest('tr').attr('id'),
				ajaxUrl 	= 'melis/MelisCmsSlider/MelisCmsSliderList/deleteSlider',
				dataString 	= [];

				dataString.push({
					name : 'sliderId',
					value: sliderId,
				});

				melisCoreTool.pending(this);
				
				melisCoreTool.confirm(
					translations.tr_MelisCmsSliderDetails_common_label_yes,
					translations.tr_MelisCmsSliderDetails_common_label_no,
					translations.tr_MelisCmsSliderDetails_page_delete_slider, 
					translations.tr_MelisCmsSliderDetails_delete_slider_confirm,
					function() {
						$.ajax({
							type        : 'POST', 
							url         : ajaxUrl,
							data		: dataString,
							dataType    : 'json',
							encode		: true,
						}).done(function(data){
							if(data.success){				
								melisHelper.melisOkNotification( data.textTitle, data.textMessage);
								melisHelper.tabClose(  sliderId + "_id_MelisCmsSlider_page");
								melisHelper.zoneReload("id_MelisCmsSlider_list_content_table", "MelisCmsSlider_list_content_table", {});
							}else{
								melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
							}		
							melisCore.flashMessenger();	
						}).fail(function(){
							alert( translations.tr_meliscore_error_message );
						});
				});
				
				melisCoreTool.done(this);
		});
		
		$body.on("click", "#generateInputFindPageTree span", function() {
			melisLinkTree.createInputTreeModal('#mcslide_page_id');
		});

		$body.on("click", ".sliderTable tbody tr td", function() {
			$(this).trigger("click");

			console.log("sliderTable table tbody tr td clicked!");
		});
});

var toolSlider = {
		
		refreshTable: function() {
			// reload the whole content of the tool
			melisHelper.zoneReload('id_MelisTechnology_table_list_content_table', 'MelisTechnology_table_list_content_table');
		},
		
		openSliderPage: function(name, id, navTabsGroup, callback) {
			var navTabsGroup = "id_meliscms_slider_tools_section";

				//melisHelper.tabOpen(name, 'fa fa-columns', id+'_id_MelisCmsSlider_page', 'MelisCmsSlider_page', { sliderId : id }, 'id_MelisCmsSlider_list');
				
				melisHelper.disableAllTabs();
				melisHelper.tabOpen(name, 'fa fa-columns', id+'_id_MelisCmsSlider_page', 'MelisCmsSlider_page', { sliderId : id }, navTabsGroup);
				melisHelper.enableAllTabs();
		},
		
		progress : function progress(e) {
			$("div.progressContent").removeClass("hidden");
			$("div.progressContent > div.progress > div.progress-bar").attr("aria-valuenow", 0);
			$("div.progressContent > div.progress > div.progress-bar").css("width", '0%');
			$("div.progressContent > div.progress > span.status").html("");

			if ( e.lengthComputable ) {
				var max 		= e.total,
					current 	= e.loaded,
					percentage 	= (current * 100)/max;

					$("div.progressContent > div.progress > div.progress-bar").attr("aria-valuenow", percentage);
					$("div.progressContent > div.progress > div.progress-bar").css("width", percentage+"%");

					if ( percentage > 100 ) {
						$("div.progressContent").addClass("hidden");
					}
					else {
						$("div.progressContent > div.progress > span.status").html(Math.round(percentage)+"%");
					}
			}
		}
    	
};

window.initSliderDetails = function(data, tblSettings) {
	var sliderId = $("#" + tblSettings.sTableId).data("sliderid");

		data.sliderId = sliderId;
	
		$('#'+sliderId+'_sliderDetails').on( 'row-reorder.dt', function ( e, diff, edit ) {
			var result = 'Reorder started on row: '+edit.triggerRow.data()[1]+'<br>';

				for ( var i=0, ien=diff.length ; i<ien ; i++ ) {
					var rowData = eval('$'+sliderId+'_sliderDetails').row( diff[i].node ).data();

						result += rowData[1]+' updated to be in position '+ diff[i].newData+' (was '+diff[i].oldData+')<br>';
				}
				
				if ( !$.isEmptyObject(diff) ) {
					
					var dataString 	= new Array,
						prdNodes 	= new Array;
					
						$.each(diff, function(){
							prdNodes.push(this.node.id+'-'+this.newPosition);
						});
						
						dataString.push({
							name : "sliderOrderData",
							value: prdNodes.join()
						});
						
						dataString = $.param(dataString);
						
						$.ajax({
							type        : "POST", 
							url         : "/melis/MelisCmsSlider/MelisCmsSliderDetails/reOrderSliderDetails",
							data		: dataString,
							dataType    : "json",
							encode		: true
						}).done(function(data) {
							if(!data.success) {
								alert( translations.tr_meliscore_error_message );
							}
						}).fail(function() {
							alert( translations.tr_meliscore_error_message );
						});
				}
		});
};
/*! ============================================================
 * bootstrapSwitch v1.8 by Larentis Mattia @SpiritualGuru
 * http://www.larentis.eu/
 * 
 * Enhanced for radiobuttons by Stein, Peter @BdMdesigN
 * http://www.bdmdesign.org/
 *
 * Project site:
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */

!function ($) {
  "use strict";

  $.fn['bootstrapSwitch'] = function (method) {
    var inputSelector = 'input[type!="hidden"]';
    var methods = {
      init: function () {
        return this.each(function () {
            var $element = $(this)
              , $div
              , $switchLeft
              , $switchRight
              , $label
              , $form = $element.closest('form')
              , myClasses = ""
              , classes = $element.attr('class')
              , color
              , moving
              , onLabel = "ON"
              , offLabel = "OFF"
              , icon = false
              , textLabel = false;

            $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
              if (classes.indexOf(el) >= 0)
                myClasses = el;
            });

            $element.addClass('has-switch');

            if ($element.data('on') !== undefined)
              color = "switch-" + $element.data('on');

            if ($element.data('on-label') !== undefined)
              onLabel = $element.data('on-label');

            if ($element.data('off-label') !== undefined)
              offLabel = $element.data('off-label');

            if ($element.data('label-icon') !== undefined)
              icon = $element.data('label-icon');

            if ($element.data('text-label') !== undefined)
              textLabel = $element.data('text-label');

            $switchLeft = $('<span>')
              .addClass("switch-left")
              .addClass(myClasses)
              .addClass(color)
              .html(onLabel);

            color = '';
            if ($element.data('off') !== undefined)
              color = "switch-" + $element.data('off');

            $switchRight = $('<span>')
              .addClass("switch-right")
              .addClass(myClasses)
              .addClass(color)
              .html(offLabel);

            $label = $('<label>')
              .html("&nbsp;")
              .addClass(myClasses)
              .attr('for', $element.find(inputSelector).attr('id'));

            if (icon) {
              $label.html('<i class="icon ' + icon + '"></i>');
            }

            if (textLabel) {
              $label.html('' + textLabel + '');
            }

            $div = $element.find(inputSelector).wrap($('<div>')).parent().data('animated', false);

            if ($element.data('animated') !== false)
              $div.addClass('switch-animate').data('animated', true);

            $div
              .append($switchLeft)
              .append($label)
              .append($switchRight);

            $element.find('>div').addClass(
              $element.find(inputSelector).is(':checked') ? 'switch-on' : 'switch-off'
            );

            if ($element.find(inputSelector).is(':disabled'))
              $(this).addClass('deactivate');

            var changeStatus = function ($this) {
              if ($element.parent('label').is('.label-change-switch')) {

              } else {
                $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
              }
            };

            $element.on('keydown', function (e) {
              if (e.keyCode === 32) {
                e.stopImmediatePropagation();
                e.preventDefault();
                changeStatus($(e.target).find('span:first'));
              }
            });

            $switchLeft.on('click', function (e) {
              changeStatus($(this));
            });

            $switchRight.on('click', function (e) {
              changeStatus($(this));
            });

            $element.find(inputSelector).on('change', function (e, skipOnChange) {
              var $this = $(this)
                , $element = $this.parent()
                , thisState = $this.is(':checked')
                , state = $element.is('.switch-off');

              e.preventDefault();

              $element.css('left', '');

              if (state === thisState) {

                if (thisState)
                  $element.removeClass('switch-off').addClass('switch-on');
                else $element.removeClass('switch-on').addClass('switch-off');

                if ($element.data('animated') !== false)
                  $element.addClass("switch-animate");

                if (typeof skipOnChange === 'boolean' && skipOnChange)
                  return;

                $element.parent().trigger('switch-change', {'el': $this, 'value': thisState})
              }
            });

            $element.find('label').on('mousedown touchstart', function (e) {
              var $this = $(this);
              moving = false;

              e.preventDefault();
              e.stopImmediatePropagation();

              $this.closest('div').removeClass('switch-animate');

              if ($this.closest('.has-switch').is('.deactivate')) {
                $this.unbind('click');
              } else if ($this.closest('.switch-on').parent().is('.radio-no-uncheck')) {
                $this.unbind('click');
              } else {
                $this.on('mousemove touchmove', function (e) {
                  var $element = $(this).closest('.make-switch')
                    , relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
                    , percent = (relativeX / $element.width()) * 100
                    , left = 25
                    , right = 75;

                  moving = true;

                  if (percent < left)
                    percent = left;
                  else if (percent > right)
                    percent = right;

                  $element.find('>div').css('left', (percent - right) + "%")
                });

                $this.on('click touchend', function (e) {
                  var $this = $(this)
                    , $target = $(e.target)
                    , $myRadioCheckBox = $target.siblings('input');

                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $this.unbind('mouseleave');

                  if (moving)
                    $myRadioCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
                  else
                    $myRadioCheckBox.prop("checked", !$myRadioCheckBox.is(":checked"));

                  moving = false;
                  $myRadioCheckBox.trigger('change');
                });

                $this.on('mouseleave', function (e) {
                  var $this = $(this)
                    , $myInputBox = $this.siblings('input');

                  e.preventDefault();
                  e.stopImmediatePropagation();

                  $this.unbind('mouseleave');
                  $this.trigger('mouseup');

                  $myInputBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
                });

                $this.on('mouseup', function (e) {
                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $(this).unbind('mousemove');
                });
              }
            });

            if ($form.data('bootstrapSwitch') !== 'injected') {
              $form.bind('reset', function () {
                setTimeout(function () {
                  $form.find('.make-switch').each(function () {
                    var $input = $(this).find(inputSelector);

                    $input.prop('checked', $input.is(':checked')).trigger('change');
                  });
                }, 1);
              });
              $form.data('bootstrapSwitch', 'injected');
            }
          }
        );
      },
      toggleActivation: function () {
        var $this = $(this);

        $this.toggleClass('deactivate');
        $this.find(inputSelector).prop('disabled', $this.is('.deactivate'));
      },
      isActive: function () {
        return !$(this).hasClass('deactivate');
      },
      setActive: function (active) {
        var $this = $(this);

        if (active) {
          $this.removeClass('deactivate');
          $this.find(inputSelector).removeAttr('disabled');
        }
        else {
          $this.addClass('deactivate');
          $this.find(inputSelector).attr('disabled', 'disabled');
        }
      },
      toggleState: function (skipOnChange) {
        var $input = $(this).find(':checkbox');
        $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
      },
      toggleRadioState: function (skipOnChange) {
        var $radioinput = $(this).find(':radio');
        $radioinput.not(':checked').prop('checked', !$radioinput.is(':checked')).trigger('change', skipOnChange);
      },
      toggleRadioStateAllowUncheck: function (uncheck, skipOnChange) {
        var $radioinput = $(this).find(':radio');
        if (uncheck) {
          $radioinput.not(':checked').trigger('change', skipOnChange);
        }
        else {
          $radioinput.not(':checked').prop('checked', !$radioinput.is(':checked')).trigger('change', skipOnChange);
        }
      },
      setState: function (value, skipOnChange) {
        $(this).find(inputSelector).prop('checked', value).trigger('change', skipOnChange);
      },
      setOnLabel: function (value) {
        var $switchLeft = $(this).find(".switch-left");
        $switchLeft.html(value);
      },
      setOffLabel: function (value) {
        var $switchRight = $(this).find(".switch-right");
        $switchRight.html(value);
      },
      setOnClass: function (value) {
        var $switchLeft = $(this).find(".switch-left");
        var color = '';
        if (value !== undefined) {
          if ($(this).attr('data-on') !== undefined) {
            color = "switch-" + $(this).attr('data-on')
          }
          $switchLeft.removeClass(color);
          color = "switch-" + value;
          $switchLeft.addClass(color);
        }
      },
      setOffClass: function (value) {
        var $switchRight = $(this).find(".switch-right");
        var color = '';
        if (value !== undefined) {
          if ($(this).attr('data-off') !== undefined) {
            color = "switch-" + $(this).attr('data-off')
          }
          $switchRight.removeClass(color);
          color = "switch-" + value;
          $switchRight.addClass(color);
        }
      },
      setAnimated: function (value) {
        var $element = $(this).find(inputSelector).parent();
        if (value === undefined) value = false;
        $element.data('animated', value);
        $element.attr('data-animated', value);

        if ($element.data('animated') !== false) {
          $element.addClass("switch-animate");
        } else {
          $element.removeClass("switch-animate");
        }
      },
      setSizeClass: function (value) {
        var $element = $(this);
        var $switchLeft = $element.find(".switch-left");
        var $switchRight = $element.find(".switch-right");
        var $label = $element.find("label");
        $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
          if (el !== value) {
            $switchLeft.removeClass(el);
            $switchRight.removeClass(el);
            $label.removeClass(el);
          } else {
            $switchLeft.addClass(el);
            $switchRight.addClass(el);
            $label.addClass(el);
          }
        });
      },
      status: function () {
        return $(this).find(inputSelector).is(':checked');
      },
      destroy: function () {
        var $element = $(this)
          , $div = $element.find('div')
          , $form = $element.closest('form')
          , $inputbox;

        $div.find(':not(input)').remove();

        $inputbox = $div.children();
        $inputbox.unwrap().unwrap();

        $inputbox.unbind('change');

        if ($form) {
          $form.unbind('reset');
          $form.removeData('bootstrapSwitch');
        }

        return $inputbox;
      }
    };

    if (methods[method])
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || !method)
      return methods.init.apply(this, arguments);
    else
      $.error('Method ' + method + ' does not exist!');
  };
}(jQuery);
