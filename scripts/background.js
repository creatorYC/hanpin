
class Background{

    listenMessage(){
        chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse){
                if(message.method === "getSelection"){
                    // console.log("background: "+message.data);
                    var data = message.data;
                    // var pinyin = require("pinyin");
                    // var resp = pinyin(data);
                    // console.log("background: "+resp);
                    sendResponse({farewell: data});
                }
            }
        );
        return this;
    }
}

const background = new Background();
background.listenMessage();
