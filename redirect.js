function getRedirectUrl() {
    return "http://google.ca";
}

function redirectRequest(details){
    return {redirectUrl: getRedirectUrl()};
}

function Filter(urls){
    this.urls = urls;
    this.types = ["main_frame"];
}

function bindFilter(urls){
    if (chrome.webRequest.onBeforeRequest.hasListener(redirectRequest)){
        chrome.webRequest.onBeforeRequest.removeListener(redirectRequest);
    }
    var filter = new Filter(urls);
    chrome.webRequest.onBeforeRequest.addListener(redirectRequest,
                                                  filter,
                                                  ["blocking"]);
}

bindFilter(["http://reddit.com/*"]);

alert("success");