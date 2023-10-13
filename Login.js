
var emailField = document.getElementById('email-field')
var passwordField = document.getElementById('password-field')
var loginButton = document.getElementById('login-button')

loginButton.addEventListener('click', () => {
    firebase.auth().signInWithEmailAndPassword(emailField.value, passwordField.value)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log('User logged in successfully', user);

            location.href = 'https://zuma-admin.webflow.io/'

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Error logging in:', errorCode, errorMessage);

            alert(errorMessage)
        });
})