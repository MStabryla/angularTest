var XP = {
    xmlHub:{},
    getFile:function(path,callback){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(callback instanceof Function)
                {
                    XP.xmlHub = this.responseXML;
                    callback();
                }
            }
        };
        xhttp.open("GET", path, true);
        xhttp.send();
    },
    getElements:function(path){
        if(XP.xmlHub.evaluate){
            var nodes = XP.xmlHub.evaluate(path, XP.xmlHub, null, XPathResult.ANY_TYPE, null);
            var result = nodes.iterateNext();
            var table = [];
            while (result) {
                table.push(result);
                result = nodes.iterateNext();
            } 
            return table;
        }
        /*while(typeof $x == "undefined")
        {
            var dat = Date.now();
            console.log(dat);
        }*/
        /*var XMLelems = $x(path);
        if(XMLelems.length > 0)
        {
            return XMLelems;
        }
        else
        {
            console.error("Error: Xpath returns empty array");
            return null;
        }*/
    },
    getFirstElement:function(path){
        return XP.getElements(path)[0];
    },

}
