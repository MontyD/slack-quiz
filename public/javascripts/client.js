$("#Question").submit(function(e) {
  $.ajax({
    type: "POST",
    url: './newQuestion',
    data: $(this).serialize(),
    success: function(data) {
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
  e.preventDefault();
});

$("#tryQuestion").submit(function(e) {
  $.ajax({
    type: "POST",
    url: './demoQuestion',
    data: $(this).serialize(),
    success: function(data) {
      typeResponse(data.text);
    }
  });
  e.preventDefault();
});

$('#demoanswer').keypress(function(e) {
  if (e.which == 13) {
    $(this).val('');
    $('form#tryQuestion').submit();
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
  });
});
