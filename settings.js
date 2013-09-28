var BLACKLIST = "BLACKLIST";

function updateFilter(){
    chrome.runtime.getBackgroundPage(function(page) {
        page.updateFilter("BLACKLIST");
    });
}

function updateFilter(urls){
    chrome.runtime.getBackgroundPage(function(page) {
        page.bindFilter(urls);
    });
}

function updateVisualList(blacklist){
    var nItems = blacklist.length;
    var listElement = $("#lsblack");

    listElement.empty();

    for (var i = 0; i < nItems; i++){
        var listItem = document.createElement("li");

        removeButtonSpan = document.createElement("span");
        removeButtonSpan.id = "spanBtnRemove-" + i;
        removeButton = document.createElement("img");
        removeButton.src = "add_settings.png";
        removeButton.id = "btnRemove-" + i;
        removeButton.class = "btnRemove";
        removeButtonSpan.appendChild(removeButton);
        listItem.appendChild(removeButtonSpan);

        blockedSiteSpan = document.createElement("span");
        blockedSiteSpan.class = "blockSiteSpan"
        blockedSiteSpan.innerHTML = blacklist[i];
        listItem.appendChild(blockedSiteSpan);

        listElement.append(listItem);
    }
}

$(document).ready(function () {
    $("#add_settings_img").click(function () {
        var site = $("#blacklist_input").val();
        if(!site) {
            alert("Error: No value specified.");
            return;
        }
        
        chrome.storage.sync.get("BLACKLIST", function (items) {
            var blacklist = items["BLACKLIST"];
            if (blacklist == null){
                blacklist = [];
            }
            blacklist.push(site);
            blacklist.sort();
            chrome.storage.sync.set({"BLACKLIST": blacklist}, function () {
                updateFilter(blacklist);
                updateVisualList(blacklist);
            });
        });
    });
    $("#remove_all_img").click(function () {
        chrome.storage.sync.remove(["BLACKLIST"], function(){
            updateFilter(["empty"]);
            updateVisualList([]);
        });
    });

    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            blacklist = [];
        }
        updateVisualList(blacklist);
    });
});