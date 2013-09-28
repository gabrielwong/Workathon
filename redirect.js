var blocker = function () {

    this.filter = function () {
        this.urls = ["http://reddit.com/*"];
        this.types = ["main_frame"];
    };
    
    this.updateFilter = function () {
        chrome.storage.sync.get("blacklist", function (blacklist) {
            for (var url in blacklist) {
                this.urls.filter.push(url);
            }
        });
    };
    
    this.getRedirectSite = function () {
        return chrome.extension.getURL("redirect.html");
    };
    
    this.onBeforeRequest = function (details) {
        chrome.tabs.update({"url" : this.getRedirectSite()});
    };
};
    
chrome.webRequest.onBeforeRequest.addListener(blocker.onBeforeRequest, blocker.filter);