$(document).ready(function(){
    $("#trail-info-btn").click(function(){
        $("#open-list").empty();
        $("#closed-list").empty();
        jQuery.get('/abasin', function(data, status){
            if(status === "success"){
                const {openTrails, closedTrails} = data;
                for(let i = 0; i < openTrails.length; i++){
                    $("#open-list").append($("<li>").text(openTrails[i]));
                }
                for(let i = 0; i < closedTrails.length; i++){
                    $("#closed-list").append($("<li>").text(closedTrails[i]));
                }
            }
        })
    })
})