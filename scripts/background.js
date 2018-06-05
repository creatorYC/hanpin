
class Background{

    listenMessage(){
        chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse){
                if(message.method === "getSelection"){
                    // console.log("background: " + message.data);
                    var data = message.data;
                    var pinyin = require("pinyin");
                    var result = pinyin(data);
                    console.log("background: " + result);
                    let retData = {
                        method: "return_pinyin",
                        data: result
                    }
                    console.log("background: " + retData);
                    sendResponse({retData: retData});
                }
            }
        );
        return this;
    }
}

const background = new Background();
background.listenMessage();
