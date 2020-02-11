"use strict";
var container = document.getElementById('graph-container');
for (var i = 0; i < (90 * 12); i++) {
  var newspan = document.createElement('span');
  newspan.setAttribute("class", "circle");
  newspan.setAttribute("id", i.toString(10));
  container.appendChild(newspan);
  if ((i + 1) % 36 == 0) {
    var newspan = document.createElement('span');
    newspan.innerHTML = "<br>";
    container.appendChild(newspan);
  }
}

function validateForm() {
  var x = document.getElementById('your-age').value;
  if (x == "") {
    alert("Name must be filled out");
    return false;
  } else if (isNaN(x) || x < 1 || x > 90) {
    alert("Please input a number between 1 and 90");
    return false;
  } else return true;
}

// document.body.style.backgroundColor = prompt('background color?', 'green');
// document.body.style.backgroundColor = 'green';
function draw() {
  var years = document.getElementById('your-age').value;
  if (validateForm() == true) {
    for (i = 0; i < (90 * 12); i++) {
      document.getElementById(i.toString(10)).style.backgroundColor = 'white';
      if (i < years * 12) {
        document.getElementById(i.toString(10)).style.backgroundColor = 'red';
      }
    }
  }
}