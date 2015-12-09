var allowPost = true;

$("#Question").submit(function(e) {
  if (allowPost) {
    allowPost = false;
    $.ajax({
      type: "POST",
        url: './newQuestion',
        data: $(this).serialize(),
        success: function(data) {
          allowPost = true;
          $('#Question').animate({
            'top': -30,
            'opacity': 0
          }, 500, function() {
            this.style.display = 'none';
            $(this).css({
              'top': 0,
              'opacity': 1
            });
            $('#tryQuestion').fadeIn(500);
          });
          $('#demoid').val(data._id);
          typeResponse('Type "new question" to receive your question, or "--help" for help');
        }
    });
  } else {
    setTimeout(function() {
      $("#Question").submit;
    }, 1000);
  }
  e.preventDefault();
});

$("#tryQuestion").submit(function(e) {
  if (allowPost) {
    allowPost = false;
    $.ajax({
      type: "POST",
      url: './demoQuestion',
      data: $(this).serialize(),
      success: function(data) {
        allowPost = true;
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
    });
  } else {
    setTimeout(function() {
      $("#tryQuestion").submit;
    }, 1000);
  }
  e.preventDefault();
});

$('#demoanswer').keypress(function(e) {
  if (e.which == 13) {
    $('form#tryQuestion').submit();
    $(this).val('');
    return false;
  }
});


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

$('#initnewquestion').click(function() {
  $('h1').animate({
    'margin-top': 20
  }, 500);
  $('.start').animate({
    'top': -30,
    'opacity': 0
  }, 500, function() {
    $('.newquestion').fadeIn(500);
    this.style.display = 'none';
    $(this).css({
      'top': 0,
      'opacity': 1
    });
  });
});

$('#backhome').click(function() {
  $('h1').animate({
    'margin-top': '10%'
  }, 500);
  $('.newquestion').animate({
    'top': -30,
    'opacity': 0
  }, 500, function() {
    this.style.display = 'none';
    $(this).css({
      'top': 0,
      'opacity': 1
    });
    $('.start').fadeIn(500);
    $('h1').animate({
      'margin-top': '10%'
    }, 500);
  });
});
