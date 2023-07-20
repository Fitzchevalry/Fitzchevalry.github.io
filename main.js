


function daymode() {
    var element = document.getElementById('contenair');
     element.classList.toggle('light');
     var bg = document.getElementsByClassName('homepage')[0];
     bg.classList.toggle('bg-dark')
    var titles = document.getElementsByClassName('title');
     for (var i = 0; i < titles.length ; i++) {
    titles[i].classList.toggle('light')
      }
    var strokes = document.getElementById('backstrokes');
    strokes.classList.toggle('backstrokesBM');
    }