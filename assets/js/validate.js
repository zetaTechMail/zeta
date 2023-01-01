(function () {
  "use strict";

  let forms = document.querySelectorAll('.zeta-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');
      thisForm.querySelector('[type="submit"').setAttribute('disabled', 'true');

      let formData = new FormData( thisForm );
      const jsonData = {};
      formData.forEach((value, key) => jsonData[key] = value);

      submit_form(thisForm, action, jsonData);
    });
  });

  function submit_form(thisForm, action, formData) {
    console.log('In submit form:: ', thisForm, action, formData);
    fetch(action, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      console.log('First .then:: ', response, response.json())
      if(response.status === 200) {
        return "OK"
      }
      return "";
    })
    .then(data => {
      console.log('Second .then:: ', data)
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.querySelector('[type="submit"').removeAttribute('disabled',);
        thisForm.reset(); 
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    // thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').innerHTML = "Some error occured. Please retry or contact directly at sales@zetatechnologies.net.";
    thisForm.querySelector('.error-message').classList.add('d-block');
    thisForm.querySelector('[type="submit"').removeAttribute('disabled',);
  }

})();
