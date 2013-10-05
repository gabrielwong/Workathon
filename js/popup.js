$(document).ready(function () {
    $("#block").click(function () {
        chrome.tabs.query({active:true,currentWindow:true},function(tab){
            chrome.runtime.getBackgroundPage(function(page){
                var site = page.parseURLToFilter(tab[0].url);
                page.addBlockedSite(site);
            });
        });
    });
    $("#div-settings").click(function(){
    	alert("LOL. It won't be that easy!");
    });
});
