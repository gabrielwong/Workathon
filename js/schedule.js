var blocks;
var HOURS = 24,
	HOURLY_RESOLUTION = 4,
	WEEK = 7;

function getScheduleSelection(){}

function onScheduleChange(){}

$(document).ready( function(){
	var fragment = document.createDocumentFragment();

	blocks = new Array(HOURS * HOURLY_RESOLUTION);

	for (var i = 0; i < blocks.length; i++){
		blocks[i] = new Array(WEEK);
		for (var j = 0; j < blocks[i].length; j++){
			blocks[i][j] = document.createElement("li");
			fragment.appendChild(blocks[i][j]);
		}
	}



	$("#selectable").append(fragment);
	$( "#selectable" ).extendedselectable();
	$("#selectable").bind("extendedselectablestop", onScheduleChange);
});