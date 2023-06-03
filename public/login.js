function checkOnServer(event){
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(email, password);
    // alert("Checking on server");
    const obj = {email, password}

    axios.post('http://localhost:4000/logindetails',obj)
    .then(response => {
        console.log(response)
        localStorage.setItem('token',response.data.token)
        window.location.href = "../public/expense.html"

    })
    .catch(err =>{ 
        console.log(err)
    });
}