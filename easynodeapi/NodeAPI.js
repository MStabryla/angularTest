var fs = require("fs");
var qs = require("querystring");
console.log("Start API");
module.exports = function (req,res) {
    ServerFunc = [];
    return {
    res:res,
    req:req,
    ViewLang:function(static,page) {
        var data = fs.readdir(static,function(err,files){
            if(err){
                console.log("error ",err);
            }
            else
            {
                var alang = req.headers["accept-language"]
                for(var i=0;i<files.length;i++)
                {
                    if(alang.indexOf(files[i]) > -1)
                    {
                        console.log(static+"/"+files[i]+"/" + page);
                        fs.readFile(static+"/"+files[i]+"/" + page, function (error, data) {
                            if (error) {
                                res.write("Error");
                                res.end();
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.write(data);
                                res.end();
                                return;
                            }
                        })
                    }
                }
            }
        })
    },
    GetFile : function(dir,url){
        if(url.indexOf(".") > -1)
        {
            var roz = url.substring(url.indexOf(".")+1,url.length);
            var name = url.substring(1,url.indexOf("."));
            name = trans.Change(name,function(string){
            });
                fs.readFile(dir+"/"+roz+"/"+name+"."+roz, function (error, data) {
                    if (error) {
                        res.writeHead(404);
                        res.write("not found")
                        res.end();
                    }
                    else 
                    {
                        res.writeHead(200,{ 'Content-Type': 'text/'+roz })
                        res.write(data);
                        res.end();
                    }
                })
        }
    },
    View:function(file)
    {
        fs.readFile(file, function (error, data) {
            if (error) {
                res.write("Error ",error);
                res.end();
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        })
    },
    File:function(file)
    {
        var roz = file.substring(file.indexOf(".",1)+1,file.length);
        fs.readFile(file, function (error, data) {
            if (error) {
                res.write("Error ",error);
                console.log(error);
                res.end();
            }
            else {
                if(roz == "css"){
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                }
                else
                {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                }
                res.write(data);
                res.end();
            }
        })
    },
    Json:function(data)
    {
        res.writeHead(200, { 'Content-Type': "application/json" })
        res.write(JSON.stringify(data));
        res.end();
    },
    SendPOSTData:function(func)
    {
        var str = "";
        var obj = {};
        var dat = new Date();
        req.on("data", function (data) {
            str += data;
        })
        req.on("end", function (data) {
            obj = qs.parse(str);
            if (func)
            {
                func(obj);
            }
            res.end(JSON.stringify(obj));
        })
    },
    GetPOSTData:function(func){
        var str = "";
        var obj = {};
        var dat = new Date();
        req.on("data", function (data) {
            str += data;
        })
        req.on("end", function (data) {
            obj = qs.parse(str);
            if (func)
            {
                func(obj)
            }
        })
    },
    SavePOSTData: function (name,func) {
        var str = "";
        var obj = {};
        var dat = new Date();
        req.on("data", function (data) {
            str += data;
        })
        req.on("end", function (data) {
            obj = qs.parse(str);
            if (func)
            {
                func(obj)
            }
            this.Data[name] = obj;
        })
    },
    OnGETUrl: function (url, func) {
        var reqUrl = UrlFilter(url);
        ServerFunc.push({url:reqUrl,method:"GET",func:func});
    },
    OnPOSTUrl: function ( url, func) {
        var reqUrl = UrlFilter(url);
        ServerFunc.push({url:reqUrl,method:"POST",func:func});
    },
    OnUrl:function(method,url,func){
        var reqUrl = UrlFilter(url);
        ServerFunc.push({url:reqUrl,method:method,func:func});
    },
    Default:function(func){
        this.ServerDefault = func;
    },
    Tab:{
        RemFromArray:function (index,table)
        {
            if(index = table.length)
            {
                table.pop()
                return table;
            }
            else
            {
                for(var i=index;i<table.length-1;i++)
                {
                    table[index] = table[index + 1];
                }
                table.pop();
                return table;
            }
        }
    },
    executedReq:false,
    ServerDefault:null,
    Server:function(){
        if(!this.ServerDefault)
        {
            console.log("You must set the default response");
        }
        for(var i=0;i<ServerFunc.length;i++)
        {
            if (this.req.url == ServerFunc[i].url && this.req.method == ServerFunc[i].method)
            {
                ServerFunc[i].func();
                this.executedReq = true;
                return;
            }
        }
        if(!this.executedReq)
        {
            this.ServerDefault();
        }
    }
    }
}
function AddToObject(obj,name,value)
{
    eval("obj." + name + " = " + JSON.stringify(value));
    return obj;
}
function UrlFilter(url)
{
    var ret = "";
    for(var i=0;i<url.length;i++)
    {
        if(url[i] == "?")
        {
            return ret;
        }
        else
        {
            ret += url[i];
        }
    }
    return url;
}