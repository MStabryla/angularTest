# API do tworzenia serwera http w Node.js

## Tuorial

### Instalacja

#### Instalacja pakietu
```
npm install easynodeapi
```

#### Montowanie pakietu
```javascript
var EasyAPI = require("easynodeapi");
http.createServer(function(req,res){
    var API = new EasyAPI(req,res)
    //code
    API.Server();
}).listen(3000)

```

### Podstawowe funkcje

#### API.View() - Odesłanie pliku HTML

```javascript
API.View("Ścieszka_do_pliku_HTML");
//res - argument z http.createServer
```
#### API.File() - Odesłanie dowolnego plik prze protokół http

```javascript
API.File("Ścieszka_do_pliku")
```

#### API.OnUrl - Wykonanie funkcji po wywołaniu url

```javascript
API.OnUrl(req,"metoda_http","url",function(){
    //funkcja do wykonania gdy przyjdzie odpowiedź na dany url z podaną metodą
})
```

#### API.OnPOSTUrl - wykonanie funkcji dla żądania POST po wywołaniu url
```javascript
API.OnPOSTUrl(req,"url",function(){
    //funkcja do wykonania gdy przyjdzie odpowiedź na dany url z podaną metodą
})
```

### i analogicznie dla żądania GET
```javascript
API.OnGETUrl(req,"url",function(){
    //funkcja do wykonania gdy przyjdzie odpowiedź na dany url z podaną metodą
})
```

#### API.Json - wysyła obiekt JSON do klienta

```javascript
API.Json(obiekt)
```

#### ViewLang - odsyła plik html związane z pierwszym akceptowanym językiem przez klienta

```javascript
API.ViewLang(req,res,"folder_plików_html","nazwa_strony")
```

#### GetPOSTData - odczytuje dane z żądania POST klienta
```javascript
API.GetPOSTData(function(data){
//data - obiekt z danymi przesyłanymi przez POST
})
```

####SendPOSTData - analogicznie jak wyżej tylko z przesłaniem od razu obiektu do klienta metodą POST
```javascript
API.SendPOSTData(function(data){
//data - można dodawać właściwości które zostaną przesłane do użytkownika
});
```
#### Server - ustawia tzw. serwer, czyli obsługę poszczególnych żądań ustawionych przed tą funkcją

```javascript
//wszystkie funkcje OnUrl
API.Server(); //obsługa wszystkich dodanych żądań
```