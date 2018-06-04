
class Select{

    //获取选中内容
    getSelectedText(){
        if(window.getSelection){
            return window.getSelection().toString();
        }else if(document.getSelection){
            return document.getSelection();
        }else if(document.selection){
            return document.selection.createRange().text;
        }else{
            return "";
        }
    }

    //组装需要发送的消息
    getSelectedMessage(){
        const text = this.getSelectedText();
        const data = {
            text: text
        };
        let message = {
            info: "",
            data: data
        };
        return message;
    }

    //发送消息
    setSelectionMessage(message){
        chrome.runtime.sendMessage(message, function(response){
            console.log(response.farewell);
        });
    }

    getImage(){
        var img = new Image();
        var src = chrome.extension.getURL('images/icon.png');
        img.src = src;
        img.style.display ='none';
        img.style.position = "absolute";
        img.style.cursor = 'pointer';
        document.body.appendChild(img);
        return img;
    }

    //鼠标弹起事件
    listenMouseUp(img){
        var that = this;
        document.onmouseup = function(e){
            var e = e || window.event;
            var sh = window.pageYOffset || document.documentElement.scrollTop || 
                        document.body.scrollTop || 0;
            var left = (e.clientX - 30 < 0) ? e.clientX + 15 : e.clientX - 30;
            var top = (e.clientY - 30 < 0) ? e.clientY + sh + 15 : e.clientY + sh - 30;
            // var left = e.clientX;
            // var top = e.clientY;
            
            setTimeout(function(){  //异步调用，避免onmouseup与onclick事件冲突
                //有选中的内容
                if(that.getSelectedText().length > 0){
                    img.style.display = "inline";
                    img.style.left = left + "px";
                    img.style.top = top + "px";
                }
            }, 200);
        };

        //点击图片
        // img.onclick = function(e){

        // };
        //鼠标松开会触发document的mouseup事件/冒泡
        img.onmouseup = function(e){
            var e = e || window.event;
            e.cancelBubble = true;
        }
        return this;
    }

    listenDocumentClick(img){
        document.onclick = function(e){
            img.style.display = "none";
        };
        return this;
    }
}

// export default Select;

const selection = new Select();
var img = selection.getImage();
selection.listenDocumentClick(img).listenMouseUp(img);//