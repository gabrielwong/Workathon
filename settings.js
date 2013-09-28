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

function addInputSite(){
    var field = $("#blacklist_input");
    var site = field.val();
    field.val('');
    if(!site) {
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
}

function removeAllBlockedSites(){
    chrome.storage.sync.remove(["BLACKLIST"], function(){
            updateFilter(["empty"]);
            updateVisualList([]);
        });
}

$(document).ready(function () {
    $("#add_settings_img").click(addInputSite);

    // Process field if enter is pressed
    $("#blacklist_input").keyup(function(event){
        if(event.keyCode == 13){
            addInputSite();
        }
    });
    $("#remove_all_img").click(removeAllBlockedSites);

    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            blacklist = [];
        }
        updateVisualList(blacklist);
    });
});