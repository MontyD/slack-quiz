$(document).ready(function() {
  'use strict';
  $(window).keydown(function(event) {
    if (event.keyCode == 13 || event.keyCode == 16) {
      event.preventDefault();
      return false;
    }
  });
  var allowPost = true,
    makePost,
    $container = $('#landing'),
    $start = $('#start'),
    $newQuestion = $('#newquestion'),
    $subtitle = $('#stateTitle'),
    $tryQuestion = $('#tryQuestion'),
    $stats = $('#stats'),
    $demoAnswer = $('#demoanswer'),
    statsGraph,
    statsCalled = false,
    graph = document.getElementById("chart").getContext("2d");

  function changeState($before, $after, subtitle) {
    $subtitle.fadeOut(500);
    if ($after !== $start) {
      $('h1').animate({
        'margin-top': 30
      }, 500);
    } else {
      $('h1').animate({
        'margin-top': '10%'
      }, 500);
    }
    if ($before === $newQuestion) {
      $('.newQuestionField').each(function() {
        $(this).val('');
      });
    }
    $before.animate({
      'top': -30,
      'opacity': 0
    }, 500, function() {
      $subtitle.html(subtitle);
      $subtitle.fadeIn(500);
      $after.fadeIn(500);
      $before.css({
        'top': 0,
        'opacity': 1,
        'display': 'none'
      });
    });
    if ($after === $tryQuestion) {
      console.log('focus called');
      $('#demoanswer').focus();
    }
    if ($after === $stats) {
      $container.css({
        'max-width': '700px'
      });
      makeGraph();
    } else {
      $container.css({
        'max-width': '500px'
      });
    }
    return false;
  }

  function makeGraph() {
    $.ajax({
      type: "POST",
      url: './getStats',
      data: {
        "gimmeStats": true
      },
      success: function(data) {
        if (data.error) {
          alertify.error('Something went wrong, have a look at the console if you are feeling brave');
          console.log(data.errorDescription);
          changeState($stats, $start, 'It done broke');
        } else {
          var usernames = [];
          var scores = [];
          for (var key in data) {
            usernames.push(data[key].username);
            scores.push(data[key].correct);
          }
          if (usernames.length < 1) {
            alertify.success('No stats to give!');
          } else {
            drawGraph({
              labels: usernames,
              datasets: [{
                fillColor: "#48A497",
                data: scores
              }]
            }, statsCalled);
            statsCalled = true;
          }
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        allowPost = true;
        alertify.error(xhr.status + ' error, Monty will bust out the template apology letter.');
        console.log(thrownError);
        changeState($stats, $start, 'It done broke');
      }
    });
    return false;
  }

  function drawGraph(data, update) {
    setTimeout(function() {
      statsGraph = new Chart(graph).Bar(data);
    }, 500);
  }

  function validateNewQuestion() {
    var valid = true;
    $('.newQuestionField').each(function() {
      if ($(this).val() === '') {
        $(this).addClass('error')
        valid = false;
      }
    });
    return valid;
  }

  function typeResponse(text) {
    var element = $('#demoresponse');
    element.html('');
    $.each(text.split(''), function(i, letter) {
      setTimeout(function() {
        element.html(element.html() + letter);
      }, 30 * i);
    });
    return false;
  }

  $("#Question").submit(function(e) {
    e.preventDefault();
    if (allowPost) {
      if (validateNewQuestion()) {
        clearTimeout(makePost);
        allowPost = false;
        $.ajax({
          type: "POST",
          url: './newQuestion',
          data: $(this).serialize(),
          success: function(data) {
            allowPost = true;
            if (data.error) {
              if (typeof data.errorDescription === 'object') {
                alertify.error('Something went wrong, have a look at the console if you are feeling brave');
                console.log(data.errorDescription);
              } else {
                alertify.error(data.errorDescription);
              }
              changeState($newQuestion, $start, 'It done broke');
            } else {
              changeState($newQuestion, $tryQuestion, 'Try your question');
              alertify.success('New question added');
              $('#demoid').val(data._id);
              typeResponse('Type "new question" to receive your question, or "--help" for help');
            }
          },
          error: function(xhr, ajaxOptions, thrownError) {
            allowPost = true;
            alertify.error(xhr.status + ' error, Monty will bust out the template apology letter.');
            console.log(thrownError);
            changeState($newQuestion, $start, 'It done broke');
          }
        });
      }
    } else {
      makePost = setTimeout(function() {
        $("#Question").submit;
      }, 1000);
    }
    return false;
  });

  $("#tryQuestion").submit(function(e) {
    if (allowPost) {
      clearTimeout(makePost);
      allowPost = false;
      $.ajax({
        type: "POST",
        url: './demoQuestion',
        data: $(this).serialize(),
        success: function(data) {
          allowPost = true;
          $demoAnswer.val('');
          if (data.error) {
            if (typeof data.errorDescription === 'object') {
              alertify.error('Something went wrong, have a look at the console if you are feeling brave');
              console.log(data.errorDescription);
            } else {
              alertify.error(data.errorDescription);
            }
            changeState($tryQuestion, $start, 'It done broke');
          } else {
            if (data.correct) {
              changeState($tryQuestion, $start, 'You are the quiz queen');
              alertify.success('Correct - but then you did write the question!');
            }
            if ((data.text.length) < 100) {
              typeResponse(data.text);
            } else {
              $('#demoresponse').animate({
                'opacity': 0
              }, 400, function() {
                $(this).html(data.text);
                $(this).animate({
                  'opacity': 1
                });
              });
            }
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          allowPost = true;
          $demoAnswer.val('');
          alertify.error(xhr.status + ' error, Monty will bust out the template apology letter.');
          console.log(thrownError);
          changeState($tryQuestion, $start, 'It done broke');
        }
      });
    } else {
      makePost = setTimeout(function() {
        $("#tryQuestion").submit;
      }, 1000);
    }
    e.preventDefault();
    return false;
  });

  $('#Question :input').keyup(function(e) {
    if ($(this).val() !== '') {
      $(this).removeClass('error');
    }
    if (e.keyCode === 13) {
      $("#Question").submit();
    }
    return false;
  });

  $demoAnswer.keyup(function(e) {
    if (e.keyCode === 13) {
      $("#tryQuestion").submit();
    }
    return false;
  });

  $('#initnewquestion').click(function() {
    changeState($start, $newQuestion, 'New Question');
    return false;
  });

  $('#initviewstats').click(function() {
    changeState($start, $stats, 'Dem stats doe');
    return false;
  });

  $('.backhome').click(function() {
    changeState($($(this).parent()), $start, 'A slack quiz for idiots');
    return false;
  });
  $('.gohome').click(function() {
    $('.backhome').click();
    return false;
  });
});
