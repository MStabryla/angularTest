var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var xpath = require("xpath");
var xdom = require("xmldom").DOMParser;
var NodeAPI = require("easynodeapi")

http.createServer(function (req, res) {
    var API = NodeAPI(req,res);
    var tem = fs.readFileSync("czasopisma.xml","utf-8");
    var doc = new xdom().parseFromString(tem);
    API.OnUrl("GET","/",function(){
        API.View("./index.html");
    })
    API.OnUrl("GET","/image",function(){
        var result = xpath.select("//czasopisma/zmienne/*",doc);
        var ddane = [];
        for(var i=0;i<result.length;i++)
        {
            /*for(var j=0;j<result[i].childNodes.length;j++)
            {
                if(result[i].childNodes[j].firstChild)
                    console.log(i + " " + j + " - ",result[i].childNodes[j].firstChild.nodeValue)
            }*/
            ddane.push({src:result[i].childNodes[1].firstChild.nodeValue,klik:result[i].childNodes[3].firstChild.nodeValue});
        }
        ddane = ddane.sort(function(a,b){return a.src})
        API.Json({tem:ddane});
    })
    API.OnUrl("POST","/years",function(){
        API.GetPOSTData(function(data){
            console.log("//czasopisma/lata/" + data.npaper);
            var result = xpath.select("//czasopisma/lata/" + data.npaper,doc);
            var ddane = result[0].childNodes[0].data.split(",");
            /*for(var i=0;i<result.length;i++)
            {
                console.log(i,result[i].childNodes[0].data);
                for(var j=0;j<result[i].childNodes.length;j++)
                {
                    if(result[i].childNodes[j].firstChild)
                        console.log(i + " " + j + " - ",result[i].childNodes[j].firstChild.nodeValue)
                }
                ddane.push({src:result[i].childNodes[1].firstChild.nodeValue,klik:result[i].childNodes[3].firstChild.nodeValue});
            }
            ddane = ddane.sort(function(a,b){return a.src})*/
            API.Json({tem:ddane});
        })
    })
    API.OnUrl("POST","/papers",function(){
        API.GetPOSTData(function(data){
            console.log("//czasopisma/" + data.npaper + "/*[ @rok = " + data.year + " ]");
            var result;
            if(data.year != "Wszystkie")
            {
                result = xpath.select("//czasopisma/" + data.npaper + "/*[ @rok = '" + data.year + "' ]",doc);
            }
            else{
                result = xpath.select("//czasopisma/" + data.npaper + "/*",doc);
            }
            var ddane = [];
            console.log(data.year == "nr specjalny" && data.npaper == "Bajtek",data.year,data.year == "nr specjalny",data.npaper,data.npaper == "Bajtek")
            for(var i=0;i<result.length;i++)
            {
                console.log(i, i == 0 ? result[i].attributes : "");
                for(var j=0;j<result[i].childNodes.length;j++)
                {
                    if(result[i].childNodes[j].firstChild)
                        console.log(i + " " + j + " - ",result[i].childNodes[j].firstChild.nodeValue)
                }
                var r = result[i];
                var elem = {};
                if(result[i].childNodes.length > 0 && data.year == "nr specjalne" && data.npaper == "Bajtek"){
                    elem = {
                        nazwa:r.childNodes[1].firstChild.nodeValue,
                        numer:r.childNodes[3].firstChild.nodeValue + "/" + r.childNodes[5].firstChild.nodeValue,
                        wydawca:r.childNodes[7].firstChild.nodeValue,
                        format:r.childNodes[9].firstChild.nodeValue,
                        stron:r.childNodes[11].firstChild.nodeValue,
                        min:data.npaper + "/" + r.childNodes[13].firstChild.nodeValue,
                        plik:r.childNodes[15].firstChild.nodeValue,
                        scan:r.childNodes[17].firstChild.nodeValue,
                        prze:r.childNodes[19].firstChild.nodeValue,
                        pod:r.childNodes[21].firstChild.nodeValue,
                    }
                }
                else if(result[i].childNodes.length > 0)
                {
                    elem = {
                        nazwa:r.childNodes[1].firstChild.nodeValue,
                        numer:r.childNodes[3].firstChild.nodeValue,
                        wydawca:r.childNodes[5].firstChild.nodeValue,
                        format:r.childNodes[7].firstChild.nodeValue,
                        stron:r.childNodes[9].firstChild.nodeValue,
                        min:data.npaper + "/" + r.childNodes[11].firstChild.nodeValue,
                        plik:data.npaper + "/" + r.childNodes[13].firstChild.nodeValue,
                        scan:r.childNodes[15].firstChild.nodeValue,
                        prze:r.childNodes[17].firstChild.nodeValue,
                        pod:r.childNodes[19].firstChild.nodeValue,
                    }
                    //ddane.push(elem);
                    //console.log(elem,ddane);
                }
                else if(result[i].attributes[1])
                {
                    elem = {
                        brak:result[i].attributes[1].value
                    }
                }
                ddane.push(elem);
                //console.log(elem);
            }
            API.Json({tem:ddane});
        })
    })
    API.Default(function(){
        API.File("./" + req.url);
    })
    API.Server();
}).listen(3000);