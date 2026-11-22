function renderTip(template, context) {
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }
        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;
        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
}

String.prototype.renderTip = function (context) {
    return renderTip(this, context);
};

var re = /x/;
console.log(re);
re.toString = function() {
    showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000);
    return '';
};

document.addEventListener('copy', function (){
    showMessage('你都复制了些什么呀，转载要记得加上出处哦~~', 5000);
});

// —— 原生动画工具（替代 jQuery 的 fadeTo / fadeIn / fadeOut / stop / delay）——
// 对某个元素的动画互相打断：进入新动画前取消旧 requestAnimationFrame 和延迟定时器
function _fade(el, to, duration, done) {
    if (el._fadeRaf) cancelAnimationFrame(el._fadeRaf);
    if (el._fadeTimer) { clearTimeout(el._fadeTimer); el._fadeTimer = null; }
    var from = parseFloat(getComputedStyle(el).opacity);
    var start = null;
    function step(ts) {
        if (start === null) start = ts;
        var p = duration <= 0 ? 1 : Math.min((ts - start) / duration, 1);
        el.style.opacity = from + (to - from) * p;
        if (p < 1) {
            el._fadeRaf = requestAnimationFrame(step);
        } else {
            el._fadeRaf = null;
            if (done) done();
        }
    }
    el._fadeRaf = requestAnimationFrame(step);
}

// jQuery fadeIn/fadeOut 的原生等价：display 切换 + 透明度过渡
function _showHide(el, show, duration) {
    if (el._fadeRaf) cancelAnimationFrame(el._fadeRaf);
    if (show) {
        el.style.display = 'block';
        el.style.opacity = 0;
        void el.offsetWidth; // 强制 reflow，让过渡生效
        _fade(el, 1, duration);
    } else {
        _fade(el, 0, duration, function () { el.style.display = 'none'; });
    }
}

function initTips(){
    fetch(`${message_Path}message.json`, { cache: 'default' })
        .then(function (r) { return r.json(); })
        .then(function (result){
            result.mouseover.forEach(function (tips){
                document.querySelectorAll(tips.selector).forEach(function (el){
                    el.addEventListener('mouseover', function (){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: el.textContent});
                        showMessage(text, 3000);
                    });
                });
            });
            result.click.forEach(function (tips){
                document.querySelectorAll(tips.selector).forEach(function (el){
                    el.addEventListener('click', function (){
                        var text = tips.text;
                        if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                        text = text.renderTip({text: el.textContent});
                        showMessage(text, 3000);
                    });
                });
            });
        })
        .catch(function (){}); // 加载失败静默，与原 jQuery 版 success-only 行为一致
}
initTips();

(function (){
    var text;
    // if(document.referrer !== ''){
    //     var referrer = document.createElement('a');
    //     referrer.href = document.referrer;
    //     text = '嗨！来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友！';
    //     var domain = referrer.hostname.split('.')[1];
    //     if (domain == 'baidu') {
    //         text = '嗨！ 来自 百度搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
    //     }else if (domain == 'so') {
    //         text = '嗨！ 来自 360搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
    //     }else if (domain == 'google') {
    //         text = '嗨！ 来自 谷歌搜索 的朋友！<br>欢迎访问<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
    //     }
    // }else {
    //     if (window.location.href == `${home_Path}`) { //主页URL判断，需要斜杠结尾
            var now = (new Date()).getHours();
            if (now > 23 || now <= 5) {
                text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？';
            } else if (now > 5 && now <= 7) {
                text = '早上好！一日之计在于晨，美好的一天就要开始了！';
            } else if (now > 7 && now <= 11) {
                text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
            } else if (now > 11 && now <= 14) {
                text = '中午了，工作了一个上午，现在是午餐时间！';
            } else if (now > 14 && now <= 17) {
                text = '午后很容易犯困呢，今天的运动目标完成了吗？';
            } else if (now > 17 && now <= 19) {
                text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~~';
            } else if (now > 19 && now <= 21) {
                text = '晚上好，今天过得怎么样？';
            } else if (now > 21 && now <= 23) {
                text = '已经这么晚了呀，早点休息吧，晚安~~';
            } else {
                text = '嗨~ 快来逗我玩吧！';
            }
        // }else {
        //     text = '欢迎阅读<span style="color:#0099cc;">「 ' + document.title.split(' - ')[0] + ' 」</span>';
        // }
    // }
    showMessage(text, 12000);
})();

// window.setInterval(showHitokoto,30000);

// function showHitokoto(){
//     $.getJSON('https://v1.hitokoto.cn/',function(result){
//         showMessage(result.hitokoto, 5000);
//     });
// }


function showMessage(text, timeout){
    if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
    var msg = document.querySelector('.message');
    msg.innerHTML = text;
    if (timeout === null) timeout = 5000;
    hideMessage(timeout);
}

function hideMessage(timeout){
    var msg = document.querySelector('.message');
    // 等价于原 .stop().css('opacity',1)：打断进行中的淡入淡出，直接满透明度显示
    if (msg._fadeRaf) cancelAnimationFrame(msg._fadeRaf);
    if (msg._fadeTimer) { clearTimeout(msg._fadeTimer); msg._fadeTimer = null; }
    msg.style.opacity = 1;
    if (timeout === null) timeout = 5000;
    msg._fadeTimer = setTimeout(function(){ _fade(msg, 0, 200); }, timeout);
}

function initLive2d (){
    var hideBtn = document.querySelector('.hide-button');
    var landlord = document.getElementById('landlord');
    hideBtn.style.display = 'none'; // 等价原 .fadeOut(0)
    hideBtn.addEventListener('click', function () {
        landlord.style.display = 'none';
    });
    landlord.addEventListener('mouseenter', function () {
        _showHide(hideBtn, true, 600);
    });
    landlord.addEventListener('mouseleave', function () {
        _showHide(hideBtn, false, 600);
    });
    var click_number = 0;
    document.getElementById('live2d').addEventListener('click', function() {
        click_number = click_number + 1;
        var textArray;
        if (click_number <= 8) {
            textArray = ["不要动手动脚的！快把手拿开~~", "真…真的是不知羞耻！","Hentai！", "再摸的话我可要报警了！⌇●﹏●⌇", "110吗，这里有个变态一直在摸我(ó﹏ò｡)","人家已经不是小孩子了！", "哎呀！别碰我！"];
        } else {
            textArray = ["不要动手动脚的！快把手拿开~~", "真…真的是不知羞耻！","Hentai！", "再摸的话我可要报警了！⌇●﹏●⌇", "110吗，这里有个变态一直在摸我(ó﹏ò｡)", "|´・ω・)ノ", "ヾ(≧∇≦*)ゝ", "（╯‵□′）╯︵┴─┴", "￣﹃￣", "(/ω＼)", "(๑•̀ㅁ•́ฅ)", "୧(๑•̀⌄•́๑)૭", "٩(ˊᗜˋ*)و", "(╯°A°)╯︵○○○", "Σ(っ °Д °;)っ", "( ,,´･ω･)ﾉ\"(´っω･｀｡)", "╮(╯▽╰)╭", "＞﹏＜", "(｡•ˇ‸ˇ•｡)"];
        }
        showMessage(textArray[Math.floor( textArray.length * Math.random() )], 5000);
    });
}
initLive2d ();
