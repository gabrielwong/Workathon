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

function removeBlockedSite(eventObject){
    var target = eventObject.target;
    var index = $(target).index();

    // Remove site from blocklist
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            return;
        }
        blacklist.splice(index, 1);
        chrome.storage.sync.set({"BLACKLIST": blacklist}, function () {
            updateFilter(blacklist);
        });
    });

    // Remove the entire list element from the list
    target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
}

function updateVisualList(blacklist){
    var nItems = blacklist.length;
    var listElement = $("#lsblack");

    listElement.empty();

    for (var i = 0; i < nItems; i++){
        var listItem = document.createElement("li");

        removeButtonSpan = document.createElement("span");
        removeButtonSpan.class = "spanBtnRemove";
        removeButton = document.createElement("img");
        removeButton.src = "add_settings.png";
        removeButton.class = "btnRemove";
        //$(removeButton).click(removeBlockedSite);
        $(removeButton).on("click", removeBlockedSite);
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