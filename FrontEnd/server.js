var express=require('express');

var app=express();

app.get('/', function (req, res) 
{
    res.sendFile( __dirname + "/" + "index.html" );
})

app.get("/register",function(req,res){
    details = {
        name : req.query.name,
        email : req.query.email,
        password : req.query.password,
        type : req.query.type
    }

});
        
   
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s//", host, port);
});