$(document).ready(function(){
    $("#add_settings_img").click(function(){
        var website = $(document).getElementById("blacklist_input").value;
        if(!website) {
             message('Error: No value specified');
return;    
        }
        chrome.storage.sync.set({'value': website}, function() {
        message('Saved.');
        }
    });
});