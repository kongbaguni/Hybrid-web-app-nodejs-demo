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

function Android() {
    return /(android)/i.test(navigator.userAgent)
}

// Native 단으로 메시지 전송
function sendMessage(message) {
    if(iOS()) {
        window.webkit.messageHandlers.jsInterface.postMessage(message);
    }
    else if(Android()) {
        var msg = JSON.stringify(message);
        window.jsInterface.postMessage(msg);
    }
    else {
        //
    }
}

//팝업
function alertPopup(title,message) {
    if(iOS() == false && Android() == false) {
        
        alert(title+message);
        return;
    }
    
    var message = {
        'action' : 'alert',
        'title' : title,
        'message' : message
    };
    sendMessage(message);
}

//문서 스케너 호출
function callDocumentScanner() {
    var message = {
        'action' : 'documentScan'
    };
    sendMessage(message);
}

// 저장된 그림 모두 삭제
function resetPictures() {
    var message = {
        'action' : 'removePictures'
    };
    sendMessage(message);
}

// 특정 그림 삭제
function deletePicture(id) {
    var message = {
        'action' : 'removePicture',
        'id' : id
    };
    sendMessage(message);
}

// 이미지 저장
function toggleImageSave(id,isClosed) {
    var message = {
        'action' : 'toggleImageSave',
        'id' : id,
        'isClosed' : isClosed
    };
    sendMessage(message);
}

// 이미지 자세히 보기
function showImageDetail(id) {
    var message = {
        'action' : 'showImageDetail',
        'id':id
    };
    sendMessage(message);
}

function showOCR(id) {
    var message = {
        'action' : 'showOCR',
        'id':id
    };
    sendMessage(message);
}

// native 에서 웹단으로 이미지 정보 삽입
function sendScanedDocument(uuid,base64,time,delBtnTitle,regTimeTitle) {
    var scan = document.getElementById("scanOutput");
    var article = document.createElement("article");
    article.id = uuid
    
    var img = new Image();
    img.src = 'data:image/jpeg;base64,'+base64;
    
    var head = document.createElement("h2");
    var headLink = document.createElement("a");
    headLink.onclick = function() {
        $("#"+uuid+" img").slideToggle("slow", function() {
                                       $("#"+uuid+" p").slideToggle();
                                       toggleImageSave(uuid,$(this).is(":visible") == false);
                                       });
        return false;
    };
    
    headLink.innerText = uuid;
    head.appendChild(headLink);
    article.appendChild(head);
    
    var desc = document.createElement("P");
    var sup = document.createElement("sup");
    sup.innerText = regTimeTitle;
    desc.appendChild(sup);
    
    var timeSpan = document.createElement("Span");
    timeSpan.innerText = time;
    desc.appendChild(timeSpan);
    article.appendChild(desc);
    
    
    article.appendChild(img);
    
    if (scan.childNodes.count == 0) {
        scan.appendChild(article);
    } else {
        scan.insertBefore(article, scan.childNodes[0]);
    }
    
    var viewBtn = document.createElement("a");
    viewBtn.href = "#";
    viewBtn.innerText = "view"
    viewBtn.onclick = function() {
        showImageDetail(uuid);
        return false;
    };
    article.appendChild(viewBtn);
    
    var ocrBtn = document.createElement("a");
    ocrBtn.href = "#";
    ocrBtn.innerText = "ocr";
    ocrBtn.onclick = function() {
        showOCR(uuid);
        return false;
    };
    article.appendChild(ocrBtn);
    
    var delBtn = document.createElement("a");
    delBtn.class = "remove";
    delBtn.onclick = function () {
        deletePicture(uuid);
        return false;
    };
    delBtn.innerText = delBtnTitle;
    delBtn.href = "#";
    article.appendChild(delBtn);
}

function pictureToggle(id,isShow) {
    if (isShow == "true") {
        $("#"+id+" img").show();
        $("#"+id+" p").show();
    }
    else {
        $("#"+id+" img").hide();
        $("#"+id+" p").hide();
    }
}

// 이미지 전부 제거
function removeScanedPictures() {
    var scan = document.getElementById("scanOutput");
    while (scan.hasChildNodes()) {
        scan.removeChild(scan.firstChild);
    }
}

// 이미지 제거
function removeScanedPicture(id) {
    $("#"+id).slideUp(1000, function() {
                      $("#"+id).remove();
                      });
}

// 내용 수정하기
function changeText(selector,title) {
    $(selector).html(title);
}

var count = 0
function speech_text(text) {
    var message = {
        "action" : "tts",
        "text" : text
    };
    sendMessage(message);
}

/**
 * 음성 읽기 진행상태 queue에 읽을 객체가 남아 있으면 true, 아니면 false 리턴
 */
function ttsSpeaking(){
    if(window.speechSynthesis) {
        return synth.pending;
    } else {
        return false;
    }
}

function toast(message) {
    var message = {
        "action" : "toast",
        "message" : message
    };
    sendMessage(message);
}

function ttsTest() {
    var value = $("input#ttsTextInput").val();
    speech_text(value);
}
