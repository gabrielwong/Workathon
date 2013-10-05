var BLACKLIST = "BLACKLIST";

/**
* Returns whether the filter is active.
**/
function isFilterActive(){
    return true;
}

/**
* Returns the URL to redirect to.
**/
function getRedirectUrl(oldUrl) {
    //return chrome.extension.getURL("redirect.html") + "?path=" + oldUrl;
    return chrome.extension.getURL("redirect.html");
}


/**
* Parses the URL input by the user and returns a format usable for filters.
**/
function parseURLToFilter(url){
    if (url.indexOf("://") == -1){
        url = "http://".concat(url);
    }
    var a = document.createElement("a");
    a.href = url;
    url = a.hostname;
    if (url.indexOf("www.") == -1){
        return "*://*.".concat(url, "/*");
    }
    return "*://".concat(url, "/*");
}

/**
* Redirects HTTP requests if the filter is active.
* Is added to chrome.webRequest.onBeforeRequest listener.
**/
function redirectRequest(details){
    if (isFilterActive())
        return {redirectUrl: getRedirectUrl(details.url)};
}

/**
* Filter object to be used with webRequest.onBeforeRequest listener.
**/
function Filter(urls){
    this.urls = urls;
}

/**
* Update the filter with new urls.
**/
function updateFilter(urls){
    if (chrome.webRequest.onBeforeRequest.hasListener(redirectRequest)){
        chrome.webRequest.onBeforeRequest.removeListener(redirectRequest);
    }
    if ( !(urls == null || urls.length == 0)){
        var filter = new Filter(urls);
        chrome.webRequest.onBeforeRequest.addListener(redirectRequest, filter, ["blocking"]);
    }
}

/**
* Updates the filter with URLs stored in storage using key.
**/
function updateFilterFromStorage(key){
    chrome.storage.sync.get(key, function(items){
        var urls = items[key];
        updateFilter(urls);
    });
}

/**
* Sets the list of blocked sites in storage to blacklist.
**/
function updateBlacklistInStorage(blacklist){
    chrome.storage.sync.set({BLACKLIST: blacklist});
}

/**
* Adds site to the blacklist in storage. callback is executed at the end with parameter blacklist
* containing a list of currently blocked sites. Filters are updated.
**/
function addBlockedSite(site, callback){
    chrome.storage.sync.get(BLACKLIST, function (items) {
        var blacklist = items[BLACKLIST];
        if (blacklist == null){
            blacklist = [];
        }
        if (blacklist.indexOf(site) != -1){
            return;
        }
        blacklist.push(site);
        blacklist.sort();
        updateBlacklistInStorage(blacklist);
        updateFilter(blacklist);
        if (typeof callback !== "undefined"){
            callback(blacklist);
        }
    });
}

/**
* Removes site from the blacklist in storage. callback is executed at the end with parameter blacklist
* containing a list of currently blocked sites. Filters are updated.
**/
function removeBlockedSite(site, callback){
    // Remove site from blocklist
    chrome.storage.sync.get(BLACKLIST, function (items) {
        var blacklist = items[BLACKLIST];
        if (blacklist == null){
            return;
        }
        var index = blacklist.indexOf(site);
        blacklist.splice(index, 1);
        updateBlacklistInStorage(blacklist);
        updateFilter(blacklist);
        if (typeof callback !== "undefined"){
            callback(blacklist);
        }
    });
}

/**
* Removes the index-th site (0 indexed) from the blacklist in storage. callback is executed at the end with parameter blacklist
* containing a list of currently blocked sites. Filters are updated.
**/
function removeBlockedSiteByIndex(index, callback){
    // Remove site from blocklist
    chrome.storage.sync.get(BLACKLIST, function (items) {
        var blacklist = items[BLACKLIST];
        if (blacklist == null){
            return;
        }
        blacklist.splice(index, 1);
        updateBlacklistInStorage(blacklist);
        updateFilter(blacklist);
        if (typeof callback !== "undefined"){
            callback(blacklist);
        }
    });
}

/**
* Removes all sites from the blacklist in storage. callback is executed at the end with parameter blacklist
* containing a list of currently blocked sites (for compatibility). Filters are updated.
**/
function removeAllBlockedSites(callback){
    updateBlacklistInStorage([]);
    updateFilter([]);
    if (typeof callback !== "undefined"){
        callback([]);
    }
}

updateFilterFromStorage(BLACKLIST);