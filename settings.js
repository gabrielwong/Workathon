$(document).ready(function () {
    $("#add_settings_img").click(function () {
        var site = $("#blacklist_input").val();
        if(!site) {
            alert("Error: No value specified.");
            return;
        }
        
        chrome.storage.sync.get("blacklist", function (items) {
            var blacklist = items["blacklist"];
            if (blacklist == null){
                blacklist = [];
            }
            blacklist.push(site);
            console.log(site);
            chrome.storage.sync.set({"blacklist": blacklist}, function () {
                alert("Saved");
            });
        });
    });
});