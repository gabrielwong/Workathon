function getRedirectUrl() {
    return "http://google.ca";
}

function redirectRequest(details){
    return {redirectUrl: getRedirectUrl()};
}

var filter = {
    urls : ["http://reddit.com/*"]
}

chrome.webRequest.onBeforeRequest.addListener(redirectRequest,
                                              filter,
                                              ["blocking"]);

alert("success");