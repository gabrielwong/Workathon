var BLACKLIST = "BLACKLIST";

function parseURLToFilter(url){
    var a = $('<a>', { href:url } )[0];
    if (url.indexOf("www.") == -1){
        return "*://*.".concat(a.hostname);
    }

    return "*://".concat(a.hostname, "/*");
}

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

// update list, param is list of sites
function updateVisualList(blacklist){
    // the number of elements in the list
    var nItems = blacklist.length;
    // the unordered list
    var listElement = $("#lsblack");

    // empty the contents of the list
    listElement.empty();

    // for each element in the parameter (list of sites)
    for (var i = 0; i < nItems; i++){
        // <li>
        var listItem = document.createElement("li");

        removeButtonSpan = document.createElement("span");
        removeButtonSpan.class = "spanBtnRemove";
        removeButton = document.createElement("img");
        removeButton.src = "remove.png";
        removeButton.class = "btnRemove";
        removeButton.css = {"position": "fixed", "top": "0px"};
        //$(removeButton).click(removeBlockedSite);
        $(removeButton).on("click", removeBlockedSite);
        removeButtonSpan.appendChild(removeButton);
        listItem.appendChild(removeButtonSpan);

        blockedSiteSpan = document.createElement("span");
        blockedSiteSpan.class = "blockSiteSpan"
        blockedSiteSpan.innerHTML = " " + blacklist[i];
        listItem.appendChild(blockedSiteSpan);

        listElement.append(listItem);
    }
}

function addInputSite(){
    var field = $("#blacklist_input");
    var site = parseURLToFilter(field.val());
    field.val('http://');
    if(!site) {
        return;
    }
    
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            blacklist = [];
        }
        if ($.inArray(site, blacklist) != -1){
            return;
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