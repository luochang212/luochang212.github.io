var h = window.innerHeight;
var w = window.innerWidth;

function window_on(website) {
    overlay_on();

    // 在移动设备上使用更小的左侧距离
    if (window.innerWidth <= 768) {
        w = window.innerWidth - 45;
        document.getElementById("mini-window").style.width = w.toString() + 'px';
        document.getElementById("btn-close").style.right = "calc(100vw - 65px)";
    } else {
        w = window.innerWidth - 60;
        document.getElementById("mini-window").style.width = w.toString() + 'px';
        document.getElementById("btn-close").style.right = "calc(100vw - 80px)";
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
    nifrm.setAttribute("height", h);
    nifrm.setAttribute("width", w);
    nifrm.setAttribute("frameBorder", "0");
}

function window_off() {
    document.getElementById("mini-window").style.width = "0";
    document.body.style.backgroundColor = "white";
    document.getElementById("btn-close").style.right = "-50px";
}

function overlay_on() {
    document.getElementById("mini-overlay").style.display = "block";
}

function overlay_off() {
    window_off();
    document.getElementById("mini-overlay").style.display = "none";
}