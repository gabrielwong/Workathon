chrome.webRequest.onBeforeRequest.addListener(function(){
    return {redirectUrl: "chrome://extensions"};
},
{urls: "http://*.reddit.com/*"},
["blocking"]);