$(document).ready(

  SMURFS = (function(){

    if (!Modernizr.svg) {
      $('img[src$=".svg"]').each(function() {
          //Replaces 'logo.svg' with 'logo.png'.
          $(this).attr('src', $(this).attr('src').replace('.svg', '.png'));
      });
    }

    PointerEventsPolyfill.initialize({});

    var screens = $('section.screen'),
        actionScreens = $('section.action-screen'),
        currentScreen = 0,
        rightAnswers = 0,
        possibleAnswers = 3,
        actions = $('.game-action'),
        solution = [[],[0,1,0],[0,0,1],[1,0,0]],
        buttons = [],
        actionsEnabled = true;

    function init() {
      for (var i = 0; i < actionScreens.length; i++) {
        buttons[i] = [];
        for (var b = 0; b < possibleAnswers; b++) {
          buttons[i][b] = 'scr'+(i+1)+'-a'+(b+1);
        }
      }
      //console.log(buttons);
      //TweenMax.delayedCall(1.5, hideLoading);
      $(screens[0]).addClass('visible');
      showHomeElements();
      $(actions).bind('click', clickAction);
    };

    function gotoNextScreen() {
      $(screens[currentScreen++]).toggleClass('visible');
      $(screens[currentScreen]).toggleClass('visible');
      //hideRightAnswer();
      if (currentScreen < actionScreens.length) {
        //
      } else if (currentScreen == actionScreens.length+1) {
        console.log('end of game');
        hideRightAnswer();
        hideHomeElements();
      }
      actionsEnabled = true;
    };

    function gotoStartScreen() {
      //hideWrongAnswer();
      $('#scr0-start-game').attr('onclick', '');
      $(screens[currentScreen]).toggleClass('visible');
      rightAnswers = 0;
      currentScreen = 0;
      actionsEnabled = true;
      $(screens[currentScreen]).toggleClass('visible');
      $('.character.co').css({'opacity':1});
      enableButtons();
    };

    function startAction(event) {
      event.preventDefault();
      if ($('#scr0-start-game').attr('onclick') == '') {
        gotoNextScreen();
      }
    }

    function clickAction(event) {
      //console.log(event.target.id);
      //if (event.target.id == 'scr0-start-game') return;
      event.preventDefault();
      if (!actionsEnabled) return;
      actionsEnabled = false;
      var id = event.target.id;
      if(id.substr(0, 3) != 'scr') {actionsEnabled = true; return;};
      var act = id.substr(5, 1);
      var current = Number(id.substr(id.length-1))-1;
      switch(act){
        case 's':
          gotoNextScreen();
          break;
        case 'a':
          disableButtons();
          if (solution[currentScreen][current] == 1) {
            console.log('right!');
            rightAnswers++;
            isRight(id);
          } else {
            console.log('wrong!');
            isWrong(id);
          }
          break;
        default:
          break;
      }
    };

    function isRight(id) {
      $('#'+id).parents('.screen').find('.game-action').addClass('not-right');
      $('#'+id).addClass('right');
      showRightAnswer(id);
    }

    function isWrong(id) {
      $('#'+id).parents('.screen').find('.game-action').removeClass('right').removeClass('not-right');
      $('#'+id).addClass('wrong');
      showWrongAnswer();
    }

    function enableButtons() {
      $.each(buttons, function(ind1, val1){
        $.each(val1, function(ind2, val2){
          $('#'+val2).removeClass('disabled').removeClass('wrong').attr("disabled", false);
        });
      });
    }


    function disableButtons() {
      $.each(buttons[currentScreen-1], function(ind, val){
        $('#'+val).addClass('disabled').attr("disabled", true);
      });
    }

    function showRightAnswer(id){
      TweenMax.killAll();
      TweenMax.to($('#'+id).parents('.screen').find('.character.co'), 0.6, {alpha: 0});
      TweenMax.delayedCall(2, gotoNextScreen);
    }

    function showWrongAnswer(){
      TweenMax.delayedCall(2, hideWrongAnswer);
    }

    function hideRightAnswer(){
      $('.overlay.success').toggleClass('hidden');
      TweenMax.delayedCall(2, function(){
        $('.overlay.success').toggleClass('hidden');
        //gotoNextScreen();
      });
    }

    function hideWrongAnswer(){
      $('.overlay.error').toggleClass('hidden');
      TweenMax.delayedCall(2, function(){
        $('.overlay.error').toggleClass('hidden');
        gotoStartScreen();
      });
    }

    function hideHomeElements() {
    }

    function showHomeElements() {
    }

    function hideLoading() {
      $('.loading').hide();
      $(screens[0]).removeClass('hidden');
    }

    SMURFS.StartGame = function() {
      $('#scr0-start-game').off('click');
      $('.start-game').on('click', startAction);
      gotoNextScreen();
    }

    SMURFS.GotoEnd = function() {
      TweenMax.killAll();
      hideHomeElements();
      $(screens[0]).removeClass('visible');
      $(screens[1]).removeClass('visible');
      $(screens[2]).removeClass('visible');
      $(screens[3]).removeClass('visible');
      $('.screen-end').addClass('visible');
    }

    init();

  })

);