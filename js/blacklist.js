
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

        removeButton = document.createElement("img");
        removeButton.src = "remove.png";
        removeButton.class = "btnRemove";
        removeButton.css = {"position": "fixed", "top": "0px"};
        $(removeButton).on("click", function(eventObject){
            var target = eventObject.target;
            var index = $(target).parent().index();
            //var index = listElement.index(target);
            chrome.runtime.getBackgroundPage(function(page){
                console.log(index);
                page.removeBlockedSiteByIndex(index, function(blocklist){
                    updateVisualList(blocklist);
                });
            });
        });
        listItem.appendChild(removeButton);

        blockedSiteSpan = document.createElement("span");
        blockedSiteSpan.class = "blockSiteSpan"
        blockedSiteSpan.innerHTML = " " + blacklist[i];
        listItem.appendChild(blockedSiteSpan);

        listElement.append(listItem);
    }
}

function addSiteFromField(){
    var field = $("#blacklist_input");
    var site = field.val();
    chrome.runtime.getBackgroundPage(function(page){
        site = page.parseURLToFilter(site);
        page.addBlockedSite(site, function(blacklist){
            updateVisualList(blacklist);
        });
    });
}

function removeAllBlockedSites(){
    chrome.runtime.getBackgroundPage(function(page){
        page.removeAllBlockedSites(function(blacklist){
            updateVisualList(blacklist);
        });
    });
}


$(document).ready(function () {
    $("#add_settings_img").click(addSiteFromField);

    // Process field if enter is pressed
    $("#blacklist_input").keyup(function(event){
        if(event.keyCode == 13){
            addSiteFromField();
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