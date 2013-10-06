var HOURS = 24,
	WEEK = 7,
	hourlyResolution = 4,	// The number of blocks per hour
	topOffset = 0;			// Number of blocks shifted down

/**
* Returns a boolean array of which blocks in the schedule are selected. Or sets the schedule based on selection (boolean array).
**/
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
function indexToTime(index){
	var day = Math.floor(index % WEEK);
	var blockOfDay = Math.floor(index / WEEK) + topOffset;
	var hour = Math.floor(blockOfDay / hourlyResolution);
	var minute = (60 / hourlyResolution) * (blockOfDay % hourlyResolution);

	return {day: day, hour: hour, minute: minute};
}

/**
* Converts a time to the index of the block whose start is the time.
**/
function timeToIndex(time){
	// Inverse of index to time
	return time.day + (Math.floor(time.minute * hourlyResolution / 60) + time.hour * hourlyResolution - topOffset) * WEEK;
}

/**
* Returns the index of the next block sequentially.
**/
function nextIndex(index){
	var day = index % WEEK;
	var blockOfDay = Math.floor(index / WEEK);

	blockOfDay++;
	if (blockOfDay > (HOURS * hourlyResolution)){
		blockOfDay %= HOURS * hourlyResolution;
		day = (day + 1) % WEEK;
	}

	return day + blockOfDay * WEEK;
}

/**
* Converts a boolean array of selected blocks to schedule events.
**/
function booleanToSchedule(selected){
	var schedule = [];
	var previousSelected = false;
	var eventObject = null;
	for (var i = 0; i < WEEK * HOURS * hourlyResolution; i++){
		var index = ( (i * WEEK) + Math.floor(i / (HOURS * hourlyResolution))) % (WEEK * HOURS * hourlyResolution);
		if (selected[index]){
			if(!previousSelected){
				previousSelected = true;
				eventObject = {start : indexToTime(index)};
			}
		} else{
			if (previousSelected){
				previousSelected = false;
				eventObject.stop = indexToTime(index);
				schedule.push(eventObject);
				eventObject = null;
			}
		}
	}
	if (eventObject != null){
		eventObject.stop = indexToTime(0);
		schedule.push(eventObject);
	}

	return schedule;
}

/**
* Converts schedule events to a boolean array of selected blocks.
**/
function scheduleToBoolean(schedule){
	var howMany = (WEEK * HOURS * hourlyResolution);
	var selected = [];
	while (howMany--){
		selected.push(false);
	}
	for (var i = 0; i < schedule.length; i++){
		var index = timeToIndex(schedule[i].start);
		var stopIndex = timeToIndex(schedule[i].stop);
		while(index != stopIndex){
			selected[index] = true;
			index = nextIndex(index);
		}
	}

	return selected;
}

/**
* Called when the schedule changes.
**/
function onScheduleChange(){
	var selected = scheduleSelection();
	var schedule = booleanToSchedule(selected);
	
	chrome.runtime.getBackgroundPage(function(page){
		page.updateSchedule(schedule);
		page.updateScheduleInStorage(schedule);
	});
}

$(document).ready( function(){
	var fragment = document.createDocumentFragment();

	for (var i = 0; i < WEEK * HOURS * hourlyResolution; i++){
		var block = document.createElement("li");
		fragment.appendChild(block);
	}

	$("#selectable").append(fragment);
	$( "#selectable" ).extendedselectable();
	$("#selectable").bind("extendedselectablestop", onScheduleChange);
	chrome.storage.sync.get("SCHEDULE", function(items){
		var schedule = items["SCHEDULE"];
		var selected = scheduleToBoolean(schedule);
		scheduleSelection(selected);
	});
});