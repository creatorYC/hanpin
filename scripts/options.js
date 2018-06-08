
var btn = document.getElementById("btn");
btn.onclick = function customize(){
    var cb_opts = document.getElementsByName("py_option");
    var options = [];
    for(let i = 0; i < cb_opts.length; i++){
        if(cb_opts[i].checked){ // 选中
            options.push(cb_opts[i].value);
        }
    }
    var optionsStr = options.join(",");
    console.log("options: " + optionsStr);
    localStorage.options = optionsStr;
}

