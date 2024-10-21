document.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    if (submit.disabled == false)
      submit.click();
    if (start.disabled == false)
      start.click();
  }
})

function preventFocus(event) {
  if (event.relatedTarget) {
    event.relatedTarget.focus();
  } else {
    this.blur();
  }
}

function inputs_setup() {
  const inputs = document.getElementById("inputs");

  inputs.addEventListener("input", function (e) {
    const target = e.target;
    const val = target.value;

    e.preventDefault();

    if (val != "") {
      target.value = val[0]
      const next = target.nextElementSibling;
      if (next) {
        next.focus();
      }
    }
  });

  inputs.addEventListener("keydown", function (e) {
    const next = e.target.nextElementSibling;
    const prev = e.target.previousElementSibling;
    if (e.key == "Backspace" || e.key == "Delete") {
      if (e.target.value != "") {
        e.target.value = "";
        return;
      }
      if (prev) {
        prev.value = "";
        prev.focus();
        return;
      }
      return;
    }

    if (e.key == "ArrowLeft") {
      if (prev) {
        prev.focus();
      }
      return;
    }

    if (e.key == "ArrowRight") {
      if (next) {
        next.focus();
      }
      return;
    }

    if (['f', 'k', 'l', 'm', 'r', 'x', 'q'].includes(e.key)) {
      e.target.value = e.key.toUpperCase();
      if (next) {
        next.focus();
      }
    }
  });
}

var stop = 0
var timerst
var timertime = 5000 - 350;
function bar(timestamp) {

  timer.style.width = (Math.ceil((timestamp - timerst) / (timertime / 100))).toString() + "px";

  if (timestamp - timerst < timertime) {
    requestAnimationFrame(bar)
  } else {
    timer.style.visibility = "hidden";
    timerbg.style.visibility = "hidden";
  }
}

function timer_setup() {
  const timerbg = document.getElementById("timerbg");
  const timer = document.getElementById("timer");
}

function timer_start() {
  timer.style.visibility = "visible";
  timerbg.style.visibility = "visible";
  timerst = performance.now()
  timer.style.width = "0px"

  requestAnimationFrame(bar)
}

answers = [];
correct = [];
q = 0
cl = 0
ct = 0
trial = 0

function step(timestamp) {
  const avaliable_letters = [ 'F', 'K', 'L', 'M', 'R', 'X', 'Q' ]

  for (j = stop; j < 7; j++) {
    i = Math.floor(Math.random() * 7);

    inputs.children[j].value = avaliable_letters[i];
  }

  if (stop != 7)
    requestAnimationFrame(step)
}

function animation(mode) {
  stop = 0
  if (mode == 1 || mode == 2 || mode == 3)
    for (j = 0; j < 7; j++)
      inputs.children[j].disabled = true

  if (mode != 0)
    requestAnimationFrame(step);

  dct = 1;
  interval = setInterval(() => {
    if (stop == 7) {
      clearInterval(interval)
      if (mode == 0) {
          for (j = 0; j < 7; j++)
          inputs.children[j].disabled = false;

          letters.style.visibility = "visible";
          inputs.children[0].focus();

          letters.style.visibility = "visible";
          submit.style.visibility = "visible";
          timerbg.style.visibility = "hidden";

          submit.disabled = false;
      } else if (mode == 1) {
        for (j = 0; j < 7; j++) {
          correct[j] = inputs.children[j].value;
        }

        letters.style.visibility = "hidden";
        submit.style.visibility = "hidden";
        submit.disabled = true;

        setTimeout(() => {
          animation(3)
        }, 5000);
      } else if (mode == 2) {
        ct += dct;
        inputs.children[stop - 1].style.background = "#ebdbb2";
        if (trial == 10) {
          letters.style.visibility = "hidden"
          submit.style.visibility = "hidden"
          letters.style.visibility = "hidden";
          result.style.visibility = "hidden";
          for (j = 0; j < 7; j++)
          inputs.children[j].style.visibility = "hidden";
          //result.innerHTML =  "letter recall rate: " + cl + "/" + q + " = " + Math.round(cl / q * 100) + "%" + "<br>";
          //result.innerHTML += "trial recall rate: " + ct + "/" + (q / 7) + " = " + Math.round(ct / (q / 7) * 100) + "%\n";
          result.innerHTML =  "letters recalled: " + cl + "<br>";
          result.innerHTML += "trials recalled: " + ct;
          result.style.visibility = "visible";
          progress.style.visibility = "hidden";
        } else {
          timertime = 5000 - 350;
          timer_start();
        }
      } else if (mode == 3) {
        timertime = 5000;
        setTimeout(() => {
          animation(0)
        }, 5000 - 350);
        timer_start();
      }
    } else {
      if (mode == 0 || mode == 3) {
        inputs.children[stop].value = ''
      }
      if (mode == 2) {
        q += 1;
        if (answers[stop] == correct[stop]) {
          cl += 1;
          inputs.children[stop].style.background = "#98971a";
        } else {
          dct = 0;
          inputs.children[stop].style.background = "#cc241d";
        }
        inputs.children[stop].value = ''
        if (stop > 0)
          inputs.children[stop - 1].style.background = "#ebdbb2";
      }
      stop += 1
    }
  }, 50);
}

window.onload = () => {
  const start = document.getElementById("start");
  const letters = document.getElementById("letters");
  const interface = document.getElementById("interface");
  const submit = document.getElementById("submit");
  const result = document.getElementById("result");
  const timer = document.getElementById("timer");
  const timerbg = document.getElementById("timerbg");
  const progress = document.getElementById("progress");

  submit.disabled = true;
  submit.style.visibility = "hidden"
  letters.style.visibility = "hidden";
  result.style.visibility = "hidden";

  progress.style.visibility = "hidden";

  inputs_setup()
  timer_setup()

  start.addEventListener('focus', preventFocus);
  submit.setAttribute('tabindex', '-1');
  submit.addEventListener('focus', preventFocus);

  submit.onclick = (e) => {
    trial += 1;
    for (j = 0; j < 7; j++) {
      answers[j] = inputs.children[j].value;
    }

    submit.style.visibility = "hidden"
    letters.style.visibility = "hidden"
    submit.disabled = true

    animation(2);

    if (trial < 10) {
      setTimeout(() => {
        progress.innerHTML = trial + 1 + "/10"
        animation(1)
      }, 5000);
    }
  };

  start.onclick = (e) => {
    start.style.visibility = "hidden"
    start.disabled = true
    interface.style.visibility = "visible"
    progress.style.visibility = "visible";

    animation(1)
  };
}
