var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var xpath = require("xpath");
var xdom = require("xmldom").DOMParser;
var NodeAPI = require("easynodeapi")

http.createServer(function (req, res) {
    var API = NodeAPI(req,res);
    API.OnUrl("GET","/",function(){
        API.View("./index.html");
    })
    API.OnUrl("GET","/image",function(){
        var tem = fs.readFileSync("czasopisma.xml","utf-8");
        var doc = new xdom().parseFromString(tem);
        var result = xpath.select("//czasopisma/zmienne/*",doc);
        var ddane = [];
        for(var i=0;i<result.length;i++)
        {
            /*for(var j=0;j<result[i].childNodes.length;j++)
            {
                if(result[i].childNodes[j].firstChild)
                    console.log(i + " " + j + " - ",result[i].childNodes[j].firstChild.nodeValue)
            }*/
            ddane.push(/*result[i].nodeName + "/" + */result[i].childNodes[1].firstChild.nodeValue);
        }
        ddane = ddane.sort();
        API.Json({tem:ddane});
    })
    API.Default(function(){
        API.File("./" + req.url);
    })
    API.Server();
}).listen(3000);