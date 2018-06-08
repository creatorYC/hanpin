
class Background{

    listenMessage(){
        chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse){
                if(message.method === "getSelection"){
                    // console.log("background: " + message.data);
                    var data = message.data;
                    var pinyin = require("pinyin");
                    // 获取自定义的选项
                    var optionsStr = localStorage.options.split(",");
                    var options = {
                        heteronym: false,
                        segment: false
                    };
                    for(let i = 0; i < optionsStr.length; i++){
                        console.log("--" + optionsStr[i]);
                        if(optionsStr[i] === "heteronym"){ // 多音字
                            options.heteronym = true;
                        }else if(optionsStr[i] === "segment"){ // 分词
                            options.segment = true;
                        }
                    }
                    var result = pinyin(data, options);
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
