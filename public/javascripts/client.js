
$("#Question").submit(function(e) {
    $.ajax({
           type: "POST",
           url: './newQuestion',
           data: $(this).serialize(),
           success: function(data){
               alert(data);
           }
         });
    e.preventDefault();
});
