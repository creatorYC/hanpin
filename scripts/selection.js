
class Select{

    constructor(){
        this.startSelect = 0;   // 选中文字的起始位置
        this.endSelect = 0;     // 选中文字的结束位置
    }

    // 获取选中内容
    getSelectedText(){
        if(window.getSelection){
            return window.getSelection().toString();
        }else if(document.getSelection){
            return document.getSelection();
        }else if(document.selection){
            console.log("-------" + document.selection.selectionStart);
            console.log("-------" + document.selection.selectionEnd);
            return document.selection.createRange().text;
        }else{
            return "";
        }
    }

    // 组装需要发送的消息
    getSelectedMessage(){
        const text = this.getSelectedText();
        let message = {
            method: "getSelection",     //消息的类别，备用
            data: text
        };
        return message;
    }

    // 发送消息
    setSelectionMessage(message){
        chrome.runtime.sendMessage(message, function(response){
            var retData = response.retData;
            // console.log("selection: " + retData);
            if(retData.method === "return_pinyin"){
                console.log("selection: " + retData.data);
                var panel = document.getElementById("pop_box");
                if(panel){
                    panel.innerText = retData.data;
                }else{
                    panel.innerText = "Hello";
                }
            } 
        });
    }

    // 生成图标
    getImage(){
        var img = new Image();
        var src = chrome.extension.getURL('images/icon.png');
        img.src = src;
        img.style.display = 'none';
        img.style.position = "absolute";
        img.style.cursor = 'pointer';
        document.body.appendChild(img);
        return img;
    }

    // 鼠标弹起事件
    listenMouseUp(img){
        var that = this;
        document.onmouseup = function(e){
            var e = e || window.event;
            var sh = window.pageYOffset || document.documentElement.scrollTop || 
                        document.body.scrollTop || 0;
            var left = (e.clientX - 30 < 0) ? e.clientX + 15 : e.clientX - 30;
            var top = (e.clientY - 30 < 0) ? e.clientY + sh + 15 : e.clientY + sh - 30;
            
            setTimeout(function(){  // 异步调用，避免onmouseup与onclick事件冲突
                // 有选中的内容
                if(that.getSelectedText().length > 0){
                    img.style.display = "inline";
                    img.style.left = left + "px";
                    img.style.top = top + "px";
                }
            }, 200);
        };

        // 点击图片
        img.onclick = function(e){
            var message = that.getSelectedMessage();
            setTimeout(function(){
                that.setSelectionMessage(message);
            }, 200);

            var e = e || window.event;
            var sh = window.pageYOffset || document.documentElement.scrollTop || 
                        document.body.scrollTop || 0;            
            setTimeout(function(){  // 创建panel
                that.createPopPanel(e.clientX+30, e.clientY+sh);
            }, 100);
        };

        // 鼠标松开会触发document的mouseup事件/冒泡
        img.onmouseup = function(e){
            var e = e || window.event;
            e.cancelBubble = true;
        }
        return this;
    }

    // 监听页面点击事件
    listenDocumentClick(img){
        document.onclick = function(e){
            img.style.display = "none";
            var panel = document.getElementById("pop_box");
            if(panel){  // 移除panel
                console.log("selection: " + e.target.id);
                var targetId = e.target.id;
                if(!targetId || targetId !== "pop_box"){
                    document.body.removeChild(panel);
                }
            }
        };
        return this;
    }

    createPopPanel(left, top) {
        var panel = document.createElement('div');
        panel.id = 'pop_box';
        // panel.innerText = "Hello World!";
        panel.style.left = left + "px";
        panel.style.top = top + "px";
        document.body.appendChild(panel);
    }
}

// export default Select;

const selection = new Select();
var img = selection.getImage();
selection.listenDocumentClick(img).listenMouseUp(img);//