var filterActive = true;
var BLACKLIST = "BLACKLIST";

function setFilterActive(active){
    filterActive = active;
}

function getRedirectUrl(oldUrl) {
    //return chrome.extension.getURL("redirect.html") + "?path=" + oldUrl;
    return chrome.extension.getURL("redirect.html");
}

function parseURLToFilter(url){
    if (url.indexOf("://") == -1){
        url = "http://".concat(url);
    }
    var a = $('<a>', { href:url } )[0];
    console.log(a.hostname);
    url = a.hostname;
    if (url.indexOf("www.") == -1){
        return "*://*.".concat(url, "/*");
    }

    return "*://".concat(url, "/*");
}

function redirectRequest(details){
    if (filterActive)
        return {redirectUrl: getRedirectUrl(details.url)};
}

function Filter(urls){
    this.urls = urls;
}

// Update the redirect with new urls
function updateFilter(urls){
    if (chrome.webRequest.onBeforeRequest.hasListener(redirectRequest)){
        chrome.webRequest.onBeforeRequest.removeListener(redirectRequest);
    }
    if ( !(urls == null || urls.length == 0)){
        var filter = new Filter(urls);
        chrome.webRequest.onBeforeRequest.addListener(redirectRequest, filter, ["blocking"]);
    }
}

// Updates the redirect with URLs stored in chrome storage using key
function updateFilterFromStorage(key){
    chrome.storage.sync.get(key, function(items){
        var urls = items[key];
        updateFilter(urls);
    });
}

function updateBlocklistInStorage(blocklist){
    chrome.storage.sync.set({"BLACKLIST": blacklist});
}

function addBlockedSite(site, callback){ 
    console.log('add');
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            blacklist = [];
        }
        if (blacklist.indexOf(site) != -1){
            return;
        }
        blacklist.push(site);
        blacklist.sort();
        updateBlocklistInStorage(blocklist);
        updateFilter(blacklist);
        if (typeof callback !== "undefined"){
            console.log("callback");
            callback(blacklist);
        }
    });
}

function removeBlockedSite(site, callback){
    // Remove site from blocklist
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            return;
        }
        var index = blacklist.indexOf(site);
        blacklist.splice(index, 1);
        updateBlocklistInStorage(blocklist);
        updateFilter(blacklist);
        if (typeof callback !== "undefined"){
            callback(blacklist);
        }
    });
}

function removeBlockedSiteByIndex(index, callback){
    // Remove site from blocklist
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            return;
        }
        blacklist.splice(index, 1);
        updateBlocklistInStorage(blocklist);
        updateFilter(blacklist);
        if (typeof callback !== "undefined"){
            callback(blacklist);
        }
    });
}

function removeAllBlockedSites(callback){
    updateBlocklistInStorage([]);
    updateFilter([]);
    if (typeof callback !== "undefined"){
        callback([]);
    }
}

updateFilterFromStorage("BLACKLIST");