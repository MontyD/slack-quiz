
$("#Question").submit(function(e) {
    $.ajax({
           type: "POST",
           url: './newQuestion',
           data: $(this).serialize(), // serializes the form's elements.
           success: function(data)
           {
               alert(data); // show response from the php script.
           }
         });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});
