$(document).ready(function(){
	var body = $("body");
	
	body.on("click", '.sliderInfo', function(){
		var tableId = $(this).closest('tr').attr('id');
		var name = $(this).closest('tr').find("td:nth-child(2)").text();
		toolSlider.tabOpen(name, tableId);
	});

	//removes modal elements when clicking outside
	body.on("click", function (e) {
		if ($(e.target).hasClass('modal')) {
			$('#id_MMelisCmsSlider_slider_new_container').modal('hide');
			$('#id_MelisCmsSlider_modal_form_container').modal('hide');
		}
	});
		
	body.on("click", '.sliderListRefresh', function(){
		melisHelper.zoneReload("id_MelisCmsSlider_list_content_table", "MelisCmsSlider_list_content_table", {});
	});
	
	body.on("click", '.sliderEntryInfo', function(){
		melisCoreTool.pending('.sliderEntryInfo');
		var detailId = $(this).closest('tr').attr('id');
		var sliderId = $(this).closest('tr').data('sliderid');
		
		// initialation of local variable
		zoneId = 'id_MelisCmsSlider_modal_form';
		melisKey = 'MelisCmsSlider_modal_form';
		modalUrl = 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';
		// requesitng to create modal and display after
    	melisHelper.createModal(zoneId, melisKey, false, {'detailId': detailId, 'sliderId': sliderId}, modalUrl, function(){
    		melisCoreTool.done('.sliderEntryInfo');
    	});
	});
	
	body.on("click", '.addSliderData', function(){
		melisCoreTool.pending('.addSliderData');
		var sliderId = $(this).data('sliderid');
		
		// initialation of local variable
		zoneId = 'id_MelisCmsSlider_modal_form';
		melisKey = 'MelisCmsSlider_modal_form';
		modalUrl = 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';
		// requesitng to create modal and display after
    	melisHelper.createModal(zoneId, melisKey, false, {'sliderId': sliderId}, modalUrl, function(){
    		melisCoreTool.done('.addSliderData');
    	});
	});
	
	body.on("click", '.addSlider', function(){
		melisCoreTool.pending('.addSlider');
		// initialation of local variable
		zoneId = 'id_MMelisCmsSlider_slider_new';
		melisKey = 'MMelisCmsSlider_slider_new';
		modalUrl = 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';
		// requesitng to create modal and display after
    	melisHelper.createModal(zoneId, melisKey, false, {}, modalUrl, function(){
    		melisCoreTool.done('.addSlider');
    	});
	});	
	
	body.on("click", '.sliderEdit', function(){
		melisCoreTool.pending('.sliderEdit');
		var sliderId = $(this).closest('tr').attr('id');
		// initialation of local variable
		zoneId = 'id_MMelisCmsSlider_slider_new';
		melisKey = 'MMelisCmsSlider_slider_new';
		modalUrl = 'melis/MelisCmsSlider/MelisCmsSliderDetails/renderModal';
		// requesitng to create modal and display after
    	melisHelper.createModal(zoneId, melisKey, false, {'sliderId': sliderId}, modalUrl, function(){
    		melisCoreTool.done('.sliderEdit');
    	});
	});
	
	body.on("click", "#saveNewSlider", function(){
		melisCoreTool.pending('#saveNewSlider');
		var ajaxUrl = 'melis/MelisCmsSlider/MelisCmsSliderList/saveSlider';		
		var dataString = $('#sliderForm').serializeArray();
		
		$.ajax({
	        type        : 'POST', 
	        url         : ajaxUrl,
	        data		: dataString,
	        dataType    : 'json',
	        encode		: true,
	     }).success(function(data){
	    	 if(data.success){
	    		 	$("#id_MMelisCmsSlider_slider_new_container").modal("hide");
					melisHelper.melisOkNotification( data.textTitle, data.textMessage );
					melisHelper.zoneReload("id_MelisCmsSlider_list_content_table", "MelisCmsSlider_list_content_table", {});
					melisCore.flashMessenger();
			}else{
				melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
			}	
	     }).error(function(){
	    	 console.log('failed');
	     });
		melisCoreTool.done('#saveNewSlider');
		
	});
	
	body.on("click", "#saveSliderDetails", function(){
		var ajaxUrl = 'melis/MelisCmsSlider/MelisCmsSliderDetails/saveDetailsForm';
		var sliderId = $('form#sliderDetailsForm input[name=mcsdetail_mcslider_id]').val();
		var tmpForm = $('#sliderDetailsForm').get(0);		
		var sliderData = new FormData(tmpForm);
		
		$('#sliderDetails .make-switch div').each(function(){
			var field = $(this).find('input').attr('name');
			var status = $(this).hasClass('switch-on');
			var saveStatus = 0;
			if(status) {
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
				if(fileXhr.upload){
					fileXhr.upload.addEventListener('progress',toolSlider.progress, false);
				}
				return fileXhr;
			},
	     }).success(function(data){
	    	 if(data.success){
	    		 	$("div.progressContent").addClass("hidden");
	    		 	$("#id_MelisCmsSlider_modal_form_container").modal("hide");
					melisHelper.melisOkNotification( data.textTitle, data.textMessage );
					melisHelper.zoneReload(sliderId+"_id_MelisCmsSlider_content_tabs_properties_details", "MelisCmsSlider_content_tabs_properties_details", {'sliderId' : sliderId});
			}else{
				melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
			}
	    	 melisCore.flashMessenger();
	     }).error(function(){
	    	 console.log('failed');
	     });
		
		
	});
	
	body.on("click", ".sliderEntryDelete", function(){ 
		var detailsId   = $(this).closest('tr').attr('id');
		var sliderId = $(this).closest('tr').data('sliderid');
		var ajaxUrl = 'melis/MelisCmsSlider/MelisCmsSliderDetails/deleteDetails';
		var dataString = [];
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
			function(){
				$.ajax({
			        type        : 'POST', 
			        url         : ajaxUrl,
			        data		: dataString,
			        dataType    : 'json',
			        encode		: true,
			     }).success(function(data){
			    	if(data.success){				
							melisHelper.melisOkNotification( data.textTitle, data.textMessage );
							melisHelper.zoneReload(sliderId+"_id_MelisCmsSlider_content_tabs_properties_details", "MelisCmsSlider_content_tabs_properties_details", {'sliderId' : sliderId});
					}else{
						melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
					}		
					melisCore.flashMessenger();	
			     }).error(function(){
			    	 console.log('failed');
			     });
		});
		
		melisCoreTool.done(this);
	});
	
	body.on("click", ".sliderDelete", function(){ 
		var sliderId   = $(this).closest('tr').attr('id');		
		var ajaxUrl = 'melis/MelisCmsSlider/MelisCmsSliderList/deleteSlider';
		var dataString = [];
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
			function(){
				$.ajax({
			        type        : 'POST', 
			        url         : ajaxUrl,
			        data		: dataString,
			        dataType    : 'json',
			        encode		: true,
			    }).success(function(data){
			    	if(data.success){				
							melisHelper.melisOkNotification( data.textTitle, data.textMessage);
							melisHelper.tabClose(  sliderId + "_id_MelisCmsSlider_page");
							melisHelper.zoneReload("id_MelisCmsSlider_list_content_table", "MelisCmsSlider_list_content_table", {});
					}else{
						melisHelper.melisKoNotification(data.textTitle, data.textMessage, data.errors);				
					}		
					melisCore.flashMessenger();	
			    }).error(function(){
			    	alert( translations.tr_meliscore_error_message );
			    });
		});
		
		melisCoreTool.done(this);
	});
	
	body.on("click", '#generateInputFindPageTree span', function(){
		melisLinkTree.createInputTreeModal('#mcslide_page_id');
	});
	
});

var toolSlider = {
		
		refreshTable: function() {
			// reload the whole content of the tool
			melisHelper.zoneReload('id_MelisTechnology_table_list_content_table', 'MelisTechnology_table_list_content_table');
		},
		
		tabOpen: function(name, id){
			melisHelper.tabOpen(name, 'fa fa-columns', id+'_id_MelisCmsSlider_page', 'MelisCmsSlider_page', { sliderId : id}, 'id_MelisCmsSlider_list');
		},
		
		progress : function progress(e) {
			$("div.progressContent").removeClass("hidden");
			$("div.progressContent > div.progress > div.progress-bar").attr("aria-valuenow", 0);
			$("div.progressContent > div.progress > div.progress-bar").css("width", '0%');
			$("div.progressContent > div.progress > span.status").html("");
			if(e.lengthComputable){
				var max = e.total;
				var current = e.loaded;
				var percentage = (current * 100)/max;
				$("div.progressContent > div.progress > div.progress-bar").attr("aria-valuenow", percentage);
				$("div.progressContent > div.progress > div.progress-bar").css("width", percentage+"%");

				if(percentage > 100)
				{
					$("div.progressContent").addClass("hidden");
				}
				else {
					$("div.progressContent > div.progress > span.status").html(Math.round(percentage)+"%");
				}
			}
		}
    	
}


window.initSliderDetails = function(data, tblSettings) {
	var sliderId = $("#" + tblSettings.sTableId).data("sliderid");
	data.sliderId = sliderId;
	
	$('#'+sliderId+'_sliderDetails').on( 'row-reorder.dt', function ( e, diff, edit ) {
	    var result = 'Reorder started on row: '+edit.triggerRow.data()[1]+'<br>';

	    for ( var i=0, ien=diff.length ; i<ien ; i++ ) {
	        var rowData = eval('$'+sliderId+'_sliderDetails').row( diff[i].node ).data();

	         result += rowData[1]+' updated to be in position '+ diff[i].newData+' (was '+diff[i].oldData+')<br>';
	    }
		
	    if(!$.isEmptyObject(diff)){
	        
	        var dataString = new Array;
	        var prdNodes = new Array;
	        
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
			     url         : "melis/MelisCmsSlider/MelisCmsSliderDetails/reOrderSliderDetails",
			     data		: dataString,
			     dataType    : "json",
			     encode		: true
			}).done(function(data) {
				if(!data.success) {
					alert( translations.tr_meliscore_error_message );
				}
			}).fail(function(){
				alert( translations.tr_meliscore_error_message );
			});
		}
		
	});
}

