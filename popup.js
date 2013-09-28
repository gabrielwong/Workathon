$(document).ready(function(){
    $("a").mouseenter(function() {
        $(this).css({"padding-top": 2});
    });
    
    $("a").mouseleave(function() {
        $(this).css({"padding-top": 0});
    });
});