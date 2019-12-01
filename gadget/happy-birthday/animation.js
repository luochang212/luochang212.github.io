"use strict";

// 概率函数
const random = (x) => Math.floor(Math.random(x) * x);

// 绘制背景点点的函数
function draw_dots() {
    var elem = document.getElementById('dots');
    elem.parentNode.removeChild(elem);

    var ndots = document.createElement("div");
    ndots.id = "dots";
    ndots.className = "dots";
    document.getElementById('dots-root').appendChild(ndots);

    var container = document.getElementById("dots");
    let screen_height = window.innerHeight;
    let screen_width = window.innerWidth;

    var i = 0;
    var j = 0;
    while (i * 39 < screen_height) {
        var newspan = document.createElement('span');
        newspan.setAttribute("class", "dot");
        if ((i % 2 == 1 && j % 2 == 1) || (i % 2 == 0 && j % 2 == 0)) {
            newspan.style.backgroundColor = '#FFF40e';
        }
        container.appendChild(newspan);
        j++;
        if (j * 40 > screen_width) {
            var newspan = document.createElement('span');
            newspan.innerHTML = "<br>";
            container.appendChild(newspan);
            i++;
            j = 0;
        }
    }
}

// 绘制气球
function draw_balloons() {
    let screen_height = window.innerHeight;
    let screen_width = window.innerWidth;

    for (var i = 0; i <= 300; i++) {
        var nbln = document.createElement('div');
        nbln.className = "balloon";
        nbln.style.fontSize = (110 + random(80)).toString(10) + 'px';
        nbln.style.marginLeft = (random(screen_width) - 50).toString(10) + 'px';
        nbln.style.marginTop = (random(screen_height * 0.50)).toString(10) + 'px';
        nbln.innerHTML = "🎈";
        document.getElementById('balloons-root').appendChild(nbln);
    }

    document.getElementById('balloons-root').style.transform = "translateY(" + (screen_height) + "px" + ")";
}

// 释放气球
function release_balloons() {
    let screen_height = window.innerHeight;
    document.getElementById("balloons-root").style.transition = "4000ms";
    document.getElementById("balloons-root").style.transform = "translateY(" + (-screen_height * 0.50 - 200) + "px)";
}

// 文字浮现
function show_text(time_delay) {
    setTimeout(() => {
        document.getElementById('ttl').style.color = "#FFDF00";//"#FFDF00";
    }, time_delay);
}

// 机器人移动
function robot_move() {
    setTimeout(() => {
        document.getElementById('robot').style.transition = "1000ms";
        document.getElementById('robot').style.left = "-30px";
    }, 10);
}

// 机器人走路
function robot_walk(left_dist, dir, time_delay, time_interval) {
    left_dist += (18 + random(4));
    time_delay += time_interval;
    dir = -dir;
    setTimeout(() => {
        document.getElementById('robot').style.transition = time_interval.toString(10) + "ms";
        document.getElementById('robot').style.left = (left_dist).toString(10) + "px";
        document.getElementById('robot').style.transform = "rotate(" + (dir * (4 + random(4))) + "deg)";
    }, time_delay);
    return [left_dist, dir, time_delay];
}

// 机器人站直身体
function robot_stand(time_delay, time_interval) {
    time_delay += time_interval;
    setTimeout(() => {
        document.getElementById('robot').style.transition = time_interval.toString(10) + "ms";
        document.getElementById('robot').style.transform = "rotate(" + (0).toString(10) + "deg)";
    }, time_delay);
    return time_delay;
}

// 机器人连续走路
function robot_keep_walking() {
    let left_dist = -30;
    let time_delay = 1010;
    let dir = -1;
    let time_interval = 350;
    let array = [];

    for (var i = 0; i < 7; i++) {
        array = robot_walk(left_dist, dir, time_delay, time_interval);
        left_dist = array[0];
        dir = array[1];
        time_delay = array[2];
    }
    let end_time_interval = 500;
    time_delay = robot_stand(time_delay, end_time_interval);
    return time_delay;
}

//标题晃动
function title_shake(dir, time_delay, time_interval) {
    dir = -dir;
    time_delay += time_interval;
    setTimeout(() => {
        document.getElementById('ttl').style.transition = time_interval.toString(10) + "ms";
        document.getElementById('ttl').style.transform = "rotate(" + (dir * (6 + random(5))).toString(10) + "deg)";
    }, time_delay);
    return [dir, time_delay];
}

// 标题摆正
function title_stand(time_delay, time_interval) {
    time_delay += time_interval;
    setTimeout(() => {
        document.getElementById('ttl').style.transition = time_interval.toString(10) + "ms";
        document.getElementById('ttl').style.transform = "rotate(" + (0).toString(10) + "deg)";
    }, time_delay);
    return time_delay;
}

// 标题出现，连续晃动
function show_title() {
    let dir = -1;
    let time_delay = 1000;
    let time_interval = 200;
    let array = [];
    // document.getElementById('ttl').style.transition = time_interval.toString(10) + "ms";
    setTimeout(
        () => {
            document.getElementById('ttl').style.display = "block";
        }, 300
    )

    for (var i = 0; i < 4; i++) {
        array = title_shake(dir, time_delay, time_interval);
        dir = array[0];
        time_delay = array[1];
        console.log(time_delay);
    }

    time_delay = title_stand(time_delay, time_interval);
    return time_delay;
}

// 初始化彩灯
function draw_bulb() {
    let screen_width = window.innerWidth;
    let many_bulbs = '';
    let blub_cnt = 10;
    let init_dist = 30;

    // 画灯
    // using hack way
    for (var i = 0; i < blub_cnt; i++) {
        let bulb = '<div id="lampadario' + '-' + i.toString(10) + '"><input type="radio" class="switch" name="switch' + '-' + i.toString(10) + '" value="on"><input type="radio" name="switch' + '-' + i.toString(10) + '" value="off" checked="checked"><label for="switch' + '-' + i.toString(10) + '"></label><div id="filo"></div><div id="lampadina"><div id="sorpresa"></div></div></div>';
        many_bulbs += bulb;
    }
    document.getElementById('bulbs-root').innerHTML = many_bulbs;

    // 初始化灯的位置
    for (var i = 0; i < blub_cnt; i++) {
        document.getElementById('lampadario-' + i.toString(10)).style.left = init_dist + "px";
        init_dist += screen_width / 8 + random(120);
    }

    // 点灯
    var all_bulbs = document.getElementsByClassName('switch');
    for (var i = 0; i < all_bulbs.length; i++) {
        all_bulbs[i].click();
    }
}


// 初始化
function init() {
    draw_dots();  // 背景点点的初始化
    window.addEventListener('resize', () => { draw_dots() });  // 背景点点在每次窗口大小变化时重新计算
    draw_balloons();  // 绘制气球

    robot_move(); // 机器人移动
    var time_delay;
    time_delay = robot_keep_walking();  // 机器人连续走路

    setTimeout(
        () => {
            let this_time_delay = show_title();
            setTimeout(release_balloons, this_time_delay + 1000);  // 释放气球
            show_text(this_time_delay + 2000); // 文字浮现
        }, time_delay
    );

    draw_bulb();
}

init();