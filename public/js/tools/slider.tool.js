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