/* 
form validator for client-side
*/

(() => {  //this is JS script for form validation from BOOTSTRAP
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')
  
    // Loop over them and prevent submission
    Array.from(forms) //make an array from whatever querySelector returns (doc collection)
    .forEach(form => {  //call forEach on it or loop over (in other words)
      form.addEventListener('submit', event => { //add an eventListener to each form
        if (!form.checkValidity()) { //check validity of each of them when the form is submttd
          event.preventDefault() //if it is not valid, prevent default and...
          event.stopPropagation() //stop propagation, stop the process of creating new data inputted
        }
        form.classList.add('was-validated')
      }, false)
    })
  })()