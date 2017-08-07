function cmsSlider_init(pluginId){
    // declaring parameters variable for old / cross browser compatability
    if(typeof pluginId === "undefined") pluginId = null;

	// Checking if the plugin is not null
	if(pluginId == null || !$("#"+pluginId).length){
		return false;
	}
	
	var id = $("#"+pluginId);
	
	if(id.find(".carousel").length){
		id.find(".carousel").carousel();
	}else if(id.hasClass("carousel")){
		id.carousel();
	}
}

$(function(){
	cmsSlider_init("cms-slider");
})