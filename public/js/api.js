

$("#betform").submit(function (event) {
    $.post('/skyexchangebet', $("#betform").serialize(), function (data) {
       console.log(data) //data is the response from the backend
    });
    event.preventDefault();
  });