function saveToServer (event) {
  event.preventDefault()
  const username = event.target.usernameinput.value
  const email = event.target.emailinput.value
  const password = event.target.passwordinput.value

  // console.log(username, email, password);
  const obj = { username, email, password }
  axios
    .post('http://34.235.184.61:4000/signupdetails', obj)
    .then((response) => {
      console.log(response)
      redirectToLogin()
    })
    .catch((err) => {
      console.log(err)
    })
}
function redirectToLogin () {
  window.location.href = '/pages/index.html'
}
