var filterActive = true;

function setFilterActive(active){
    filterActive = active;
}

function getRedirectUrl(oldUrl) {
    //return chrome.extension.getURL("redirect.html") + "?path=" + oldUrl;
    return chrome.extension.getURL("redirect.html");
}

function redirectRequest(details){
    if (filterActive)
        return {redirectUrl: getRedirectUrl(details.url)};
}

function Filter(urls){
    this.urls = urls;
}

// Update the redirect with new urls
function bindFilter(urls){
    if (chrome.webRequest.onBeforeRequest.hasListener(redirectRequest)){
        chrome.webRequest.onBeforeRequest.removeListener(redirectRequest);
    }
    if (urls == null || urls.length == 0){
        urls = ["empty"];
    }
    var filter = new Filter(urls);
    chrome.webRequest.onBeforeRequest.addListener(redirectRequest, filter, ["blocking"]);
}

// Updates the redirect with URLs stored in chrome storage using key
function updateFilter(key){
    chrome.storage.sync.get(key, function(items){
        var urls = items[key];
        bindFilter(urls);
    });
}

updateFilter("BLACKLIST");