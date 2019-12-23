# javascript 에서 native 로 메세지 전달


interfacename : **jsInterface**
### json 형식
```json
{ 
   "action" : "[action name]", 
   "callback" : "[function name]",
   "[value name]" : "[value]"
}
```
## javascript
### iOS 인지 알아보기
```js
// 디바이스가 iOS 인 경우 true 리턴
function iOS() {
  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}
```
### android 인지 알아보기
```js
function Android() {
   return /(android)/i.test(navigator.userAgent)
}
```
### 메시지 전송

```js
// Native 단으로 메시지 전송
function sendMessage(message) {
    if(iOS()) {
        window.webkit.messageHandlers.jsInterface.postMessage(message);
    }
    else if(Android()){
        var msg = JSON.stringify(message);
        window.jsInterface.postMessage(msg);
    }
}

```
### 예제 (TTS 실행)
```js
function speech_text(text) {
    var message = {
        "action" : "tts",
        "text" : text,
        "callback" : "ttsDidComplete"
    };
    sendMessage(message);
}

function ttsDidComplete(isSucess) {
// callback 
}
```
## iOS : swift
### 인터페이스 설정
```swift
let wkContentController = WKUserContentController()
wkContentController.add(self, name: "jsInterface")        
``` 

### 메시지 수신 및 실행
```swift
 func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
   guard let dic = message.body as? [String:Any],
   let action = dic["action"] as? String else {
      return
   }
   let callback = dic["callback"] as? String

   switch action {
   case "tts":
      if let text = dic["text"] as? String, let cb = callback {
      ...
      }
      default:
         break
   }
}
```
## android : kotlin
### 인터페이스 설정
```kotlin
val jsinterface = JsInterface()  
mWebView?.addJavascriptInterface(jsinterface,"jsInterface")
```
### 메시지 수신 및 실행
```kotlin
class JsInterface {
   var context: AppCompatActivity? = null
   @JavascriptInterface
   fun postMessage(message:String) {
      Log.d("test","[msg: " + message)
      val json = JSONObject(message)
      val action = json.getString("action")
      val callback = json.optString("callback")
      when (action) {
         "tts" -> {
            var text = json.getString("text")
            ...
         }
         else -> {
            ...
         }
      }
   }
}
```

# native에서 JS 실행
native 단의 기능 실행에 대한 콜백으로 결과값을 받아올 필요가 있을 때 사용합니다.
javaScript 펀션을 native 단에서 직접 실행합니다. 
매개변수로 값을 전달 받도록 구현하면 됩니다.
## 예제 iOS : swift
```swift
let js = "sendResult('test');"
self.webView.evaluateJavaScript(js) { (_, error) in
    debugPrint(error?.localizedDescription ?? "에러없음")
}
```
## 예제 Android : kotlin
```kotlin
val js = "javascript:sendResult('test');"
mWebView?.loadUrl(js)
```


# 인터페이스 정의
### 자동로그인, 페턴 라인 숨기기 등 설정값 전달 (웹뷰 로드시 실행)
```javascript
loadSettingValue(isAutoLoginMode,isPatternLineHideMode);
```

### logout 로그아웃 처리.
```json
{
	"action":"logout",
}
```

### changePatternPinNumber // 페턴번호 변경 호출
```json
{
	"action":"changePatternPinNumber"
}
```

### changeSimplePinNumber // 간편비밀번호 변경 호출
```json
{
	"action":"changeSimplePinNumber"
}
```

### toggleAutoLogin // 자동 로그인 설정 변경
```json
{
	"action":"toggleAutoLogin"
}
```

### toggleHidePatternLineMode // 페턴 라인 숨기기 모드 설정 변경
```json
{
	"action":"toggleHidePatternLineMode"
}
```

### showTransKeyPad // 보안 키패드 호출
```json
{
	"action" : "showTransKeyPad"
}
```
#### callback (키패드 입력시, 입력 완료시 호출됨.)
```javascript
resultTransKeyPad(result,isDone);
```

[Hybrid-web-app-android-demo](https://github.com/kongbaguni/Hybrid-web-app-android-demo)

[Hybrid-web-app-iOS-demo](https://github.com/kongbaguni/Hybrid-web-app-iOS-demo)
