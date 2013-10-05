var blocks;
var HOURS = 24,
	HOURLY_RESOLUTION = 4,
	WEEK = 7;

function scheduleSelection(selection){
	if (typeof selection === "undefined"){
		var selected = new Array(WEEK * HOURS * HOURLY_RESOLUTION);
		$("#selectable").children().each(function(){
			var index = $("#selectable li").index(this);
			var thisSelected = $(this).hasClass("ui-selected");
			selected[index] = thisSelected;
		});
		return selected;
	}
	$("#selectable").children().each(function(){
		var index = $("#selectable li").index(this);
		var obj = $(this);
		if (selection[index]){
			obj.addClass("ui-selected");
		} else{
			obj.removeClass("ui-selected");
		}
	});
}



function onScheduleChange(){}

$(document).ready( function(){
	var fragment = document.createDocumentFragment();

	blocks = new Array(WEEK * HOURS * HOURLY_RESOLUTION);

	for (var i = 0; i < blocks.length; i++){
		blocks[i] = document.createElement("li");
		fragment.appendChild(blocks[i]);
	}

	$("#selectable").append(fragment);
	$( "#selectable" ).extendedselectable();
	$("#selectable").bind("extendedselectablestop", onScheduleChange);
});