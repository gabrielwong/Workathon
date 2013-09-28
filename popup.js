$(document).ready(function(){
    $('a').click(function(){
       chrome.tabs.create({url: $(this).attr('href')});
    });
    
    $("a").mouseenter(function() {
        $(this).css({"padding-top": 2});
    });
    
    $("a").mouseleave(function() {
        $(this).css({"padding-top": 0});
    });
});