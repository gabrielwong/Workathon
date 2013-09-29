$(document).ready(function () {
    $("#block").click(function () {
        chrome.tabs.query({active:true,currentWindow:true},function(tab){ 
            addInputSite(tab[0].url);
        });
    });
});

function parseURLToFilter(url){
    var a = $('<a>', { href:url } )[0];

    return "*://*.".concat(a.hostname, "/*");
}

function addInputSite(url){
    var site = url;
    if(!site) {
        return;
    }
    
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            blacklist = [];
        }
        blacklist.push(parseURLToFilter(site));
        blacklist.sort();
        chrome.storage.sync.set({"BLACKLIST": blacklist}, function () {
            updateFilter("BLACKLIST");
        });
    });
}

function updateFilter(urls){
    chrome.runtime.getBackgroundPage(function(page) {
        page.updateFilters("BLACKLIST");
    });
}