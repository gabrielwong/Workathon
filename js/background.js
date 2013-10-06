var BLACKLIST_KEY = "BLACKLIST";
var SCHEDULE_KEY = "SCHEDULE";
var schedule = null;

/**
* Returns whether the filter is active.
**/
function isFilterActive(){
    return isScheduledTime();
}

function withinEvent(event, day, hour, minute){
    return ! beforeStart(event, day, hour, minute) && ! afterStop(event, day, hour, minute);
}

function beforeStart(event, day, hour, minute){
    if (event.start.day > day)
        return true;
    if (event.start.day == day){
        if (event.start.hour > hour)
            return true;
        if (event.start.hour == hour && event.start.minute > minute)
            return true;
    }
    return false;
}

/**
* Returns whether the time specified is after the stop time.
* Returns true if the days, hours and minutes are equal.
**/
function afterStop(event, day, hour, minute){
    if (event.stop.day < day)
        return true;
    if (event.stop.day == day){
        if (event.stop.hour < hour)
            return true;
        if (event.stop.hour == hour && event.stop.minute <= minute)
            return true;
    }
    return false;
}

function isScheduledTime(){
    if (schedule == null)
        return false;
    if (schedule.length == 0)
        return false;

    var time = new Date();
    var day = time.getDay();
    var hour = time.getHours();
    var minute = time.getMinutes();

    // Binary search
    var check = Math.floor(schedule.length / 2),
        low = 0,
        high = schedule.length - 1;
    
    while (low <= high){
        var event = schedule[check];
        if (beforeStart(event, day, hour, minute)){
            high = check - 1;
        } else if (afterStop(event, day, hour, minute)){
                low = check + 1;
        } else {
            return true;
        }

        check = Math.floor((high + low) / 2);
    }
    return false;
}

/**
* Returns the URL to redirect to.
**/
function getRedirectUrl(oldUrl) {
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
function getFilter(urls){
    return {urls: urls};
}

/**
* Update the filter with new urls.
**/
function updateBlacklist(urls){
    if (chrome.webRequest.onBeforeRequest.hasListener(redirectRequest)){
        chrome.webRequest.onBeforeRequest.removeListener(redirectRequest);
    }
    if ( !(urls == null || urls.length == 0)){
        var filter = getFilter(urls);
        chrome.webRequest.onBeforeRequest.addListener(redirectRequest, filter, ["blocking"]);
    }
}

/**
* Updates the filter with URLs stored in storage using key.
**/
function updateBlacklistFromStorage(){
    chrome.storage.sync.get("BLACKLIST", function(items){
        var urls = items["BLACKLIST"];
        updateBlacklist(urls);
    });
}

/**
* Sets the list of blocked sites in storage to blacklist.
**/
function updateBlacklistInStorage(blacklist){
    chrome.storage.sync.set({"BLACKLIST": blacklist});
}

/**
* Adds site to the blacklist in storage. callback is executed at the end with parameter blacklist
* containing a list of currently blocked sites. Filters are updated.
**/
function addBlockedSite(site, callback){
    if (!site)
        return;
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
        updateBlacklistInStorage(blacklist);
        updateBlacklist(blacklist);
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
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            return;
        }
        var index = blacklist.indexOf(site);
        blacklist.splice(index, 1);
        updateBlacklistInStorage(blacklist);
        updateBlacklist(blacklist);
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
    chrome.storage.sync.get("BLACKLIST", function (items) {
        var blacklist = items["BLACKLIST"];
        if (blacklist == null){
            return;
        }
        blacklist.splice(index, 1);
        updateBlacklistInStorage(blacklist);
        updateBlacklist(blacklist);
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
    updateBlacklist([]);
    if (typeof callback !== "undefined"){
        callback([]);
    }
}

function updateSchedule(sched){
    schedule = sched;
}

function updateScheduleFromStorage(){
    chrome.storage.sync.get("SCHEDULE", function(items){
        var sched = items["SCHEDULE"];
        updateSchedule(sched);
    });
}

function updateScheduleInStorage(schedule){
    chrome.storage.sync.set({"SCHEDULE" : schedule});
}

updateBlacklistFromStorage();
updateScheduleFromStorage();