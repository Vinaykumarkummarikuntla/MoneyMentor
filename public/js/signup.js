function saveToServer (event) {
  event.preventDefault()
  const username = event.target.usernameinput.value
  const email = event.target.emailinput.value
  const password = event.target.passwordinput.value

  // console.log(username, email, password);
  const obj = { username, email, password }
  axios
    .post('http://localhost:4000/signupdetails', obj)
    .then((response) => {
      console.log(response)
      alert("Successfully  signup! Login now with your credentials") 
      redirectToLogin()
    })
    .catch((err) => {
      console.log(err)
      console.log("catch error", err.response.status);
    if (err.response.status === 401) {
      const invalidPasswordMessage = document.getElementById("invalidpassword");
      invalidPasswordMessage.textContent = "Invalid Password";
      invalidPasswordMessage.classList.add("invalidpassword");
    } else if (err.response.status === 404) {
      const invalidPasswordMessage = document.getElementById("invalidpassword");
      invalidPasswordMessage.textContent = "User is not found";
      invalidPasswordMessage.classList.add("invalidpassword");
    }

    })
}
function redirectToLogin () {
  window.location.href = '/pages/index.html'
}
