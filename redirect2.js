function getRedirectUrl() {
    return "http://google.ca";
}

function redirectRequest(details){
    return {redirectUrl: getRedirectUrl()};
}

chrome.webRequest.onBeforeRequest.addListener(redirectRequest,
{urls: ["http://reddit.com/*"]},
["blocking"]);

alert("success");