// var h = window.innerHeight;
// var w = window.innerWidth;

function window_on(website) {
    overlay_on();
    document.getElementById("mini-window").style.width = "100%";
    // 在移动设备上使用更小的左侧距离
    if (window.innerWidth <= 768) {
        document.getElementById("mini-window").style.left = "30px";
        document.getElementById("btn-close").style.left = "50px";
    } else {
        document.getElementById("mini-window").style.left = "60px";
        document.getElementById("btn-close").style.left = "80px";
    }
    document.body.style.backgroundColor = "rgba(0,0,0,0.5)";

    // remove iframe
    var ifrm = document.getElementById('mini-iframe');
    var parent = ifrm.parentNode;
    parent.removeChild(ifrm);

    // create a new iframe
    var nifrm = document.createElement("iframe");
    nifrm.id = 'mini-iframe';
    parent.appendChild(nifrm);
    nifrm.setAttribute("src", website);
    nifrm.setAttribute("height", "100%");
    nifrm.setAttribute("width", "100%");
    nifrm.setAttribute("frameBorder", "0");
}

function window_off() {
    document.getElementById("mini-window").style.width = "0";
    document.getElementById("mini-window").style.left = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("btn-close").style.left = "-50px";
}

function overlay_on() {
    document.getElementById("mini-overlay").style.display = "block";
}

function overlay_off() {
    window_off();
    document.getElementById("mini-overlay").style.display = "none";
}