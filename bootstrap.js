const url = "http://localhost:3000/api/cameras";

var callBackGetSuccess = function(data) 
{
    var element = document.getElementById("zoneResults");
    var numero = document.getElementById("queryNumber").value;
    
    for(var i=0; i<data.length; i++)
    {
        console.log(data[i]._id);
    }
    element.innerHTML = "les données sont : " + data[numero]._id;
}

function buttonClickGET() 
{
    $.get(url, callBackGetSuccess).done(function() 
    {
    })
    
    .fail(function() 
    {
        alert("error");
    })
    
    .always(function() 
    {    
    });
}

