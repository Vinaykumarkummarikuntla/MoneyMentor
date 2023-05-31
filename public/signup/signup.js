function saveToServer(event){
    event.preventDefault();
    const username = event.target.usernameinput.value; 
    const email = event.target.emailinput.value;
    const password = event.target.passwordinput.value;

    alert("Save to server");
    console.log(username,email,password);
}


 