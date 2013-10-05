var blocks;
var HOURS = 24,
	WEEK = 7,
	hourlyResolution = 4,	// The number of blocks per hour
	topOffset = 0;			// Number of blocks shifted down

function scheduleSelection(selection){
	if (typeof selection === "undefined"){
		var selected = new Array(WEEK * HOURS * hourlyResolution);
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

/**
* Returns the time at the beginning of a block. The index corresponds to the block's position in the widget.
**/
function getEventTime(index){
	var day = Math.floor(index % WEEK);
	var blockOfDay = Math.floor(index / WEEK) + topOffset;
	var hour = Math.floor(blockOfDay / hourlyResolution);
	var minute = (60 / hourlyResolution) * (blockOfDay % hourlyResolution);

	return {day: day, hour: hour, minute: minute};
}

function onScheduleChange(){
	var selected = scheduleSelection();
	var events = [];
	var previousSelected = false;
	var eventObject = null;
	for (var i = 0; i < blocks.length; i++){
		var index = ( (i * WEEK) + Math.floor(i / (HOURS * hourlyResolution))) % (selected.length);
		if (selected[index]){
			if(!previousSelected){
				previousSelected = true;
				eventObject = {start : getEventTime(index)};
			}
		} else{
			if (previousSelected){
				previousSelected = false;
				eventObject.stop = getEventTime(index);
				events.push(eventObject);
				eventObject = null;
			}
		}
	}
	if (eventObject != null){
		eventObject.stop = getEventTime(i);
		events.push(eventObject);
	}
	console.log(events);
}

$(document).ready( function(){
	var fragment = document.createDocumentFragment();

	blocks = new Array(WEEK * HOURS * hourlyResolution);

	for (var i = 0; i < blocks.length; i++){
		blocks[i] = document.createElement("li");
		fragment.appendChild(blocks[i]);
	}

	$("#selectable").append(fragment);
	$( "#selectable" ).extendedselectable();
	$("#selectable").bind("extendedselectablestop", onScheduleChange);
});