$(document).ready(function(){
    console.log("ready");
    $("#trail-info-btn").click(function(){
        console.log("clicked");
        $("#open-list").empty();
        $("#closed-list").empty();
        jQuery.get('/status/bromley', function(data, status){
            console.log(status);
            if(status === "success"){
                console.log("here");
                const open = data.open;
                const closed = data.closed;
                for(let i = 0; i < open.length; i++){
                    $("#open-list").append($("<li>").text(open[i]));
                }
                for(let i = 0; i < closed.length; i++){
                    $("#closed-list").append($("<li>").text(closed[i]));
                }
                console.log(open.length + closed.length)
            }
        })
    })
})