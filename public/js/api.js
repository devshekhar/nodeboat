

$("#betform").submit(function (event) {
    alert('dev');
    console.log($("#betform").serialize());
    $.post('/skyexchangebet', $("#betform").serialize(), function (data) {
       console.log(data) //data is the response from the backend
    });
    event.preventDefault();
  });