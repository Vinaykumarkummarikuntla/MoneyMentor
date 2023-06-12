function checkOnServer (event) {
  event.preventDefault()
  const email = event.target.email.value
  const password = event.target.password.value
  console.log(email, password)
  // alert("Checking on server");
  const obj = { email, password }

  axios.post('http://localhost:4000/logindetails', obj)
    .then(response => {
      console.log(response)
      localStorage.setItem('token', response.data.token)
      window.location.href = '../public/expense.html'
    })
    .catch(err => {
      console.log(err)
    })
}


//  forgot password

document.addEventListener('DOMContentLoaded', function() {
  var forgotPasswordLink = document.getElementById('forgotPasswordLink');

  forgotPasswordLink.addEventListener('click', function(event) {
    event.preventDefault();
    showForgotPasswordForm();
  });

  function showForgotPasswordForm() {
    var form = document.createElement('form');

    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'Enter your email';
    form.appendChild(emailInput);

    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Reset Password';
    form.appendChild(submitButton);

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var email = emailInput.value;
      handleForgotPasswordFormSubmission(email);
    });

    document.body.appendChild(form);
  }

  function handleForgotPasswordFormSubmission(email) {
    // Make an AJAX request to the backend API using Axios
    axios.post('http://localhost:4000/password/forgotpassword', { email: email })
      .then((response) => {
        console.log(response.data);
        // Handle the response from the server
      })
      .catch((error) => {
        console.error(error);
        // Handle any errors that occur during the request
      });
  }
});
