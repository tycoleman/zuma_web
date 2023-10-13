
var logoutButton = document.getElementById('logout-button')

logoutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('User Logged Out!');
      }).catch((error) => {
        // An error happened.
        console.log('Error:', error);
      });
})


window.onload = function() {
    checkUserStatus()
};



function checkUserStatus() {
    //Check if user is anonymous
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            var userID = user.uid;


            //TODO
            // database.collection('users').doc(userID).get().then( (doc) => {
            //     var data = doc.data()

            //     if (!data.isAdmin) {
            //         location.href = 'https://zuma-admin.webflow.io/login'
            //     }
                 
            // })

        } else {
            location.href = 'https://zuma-admin.webflow.io/login'

        }
    });
}

