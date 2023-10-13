
//Global Variables

var usersContainer = document.getElementById('users-container')

function getUsers() {

    while(usersContainer.firstChild) {
        usersContainer.removeChild(usersContainer.firstChild)
    }

    database.collection("users").get().then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {

            var data = doc.data()
            
            if(data.applicationStatus == "accepted") {
                buildUsersBlock(doc.id, data.firstName, data.email, data.photo1)

            }
        })
    })
}


getUsers()



function buildUsersBlock(ID, name, email, profilePhoto) {


    var userBlock = document.createElement('div')
    userBlock.setAttribute('class', 'item-grid-block')
    userBlock.setAttribute('id', ID)
    usersContainer.append(userBlock)

    var nameBlock = document.createElement('div')
	nameBlock.setAttribute('class', 'item-grid-header')
    if (name == "" || name == "undefined" ) {
        nameBlock.innerHTML = "No Name"
    } else {
        nameBlock.innerHTML = name
    }
	userBlock.appendChild(nameBlock)

    var emailBlock = document.createElement('div')
	emailBlock.setAttribute('class', 'item-grid-header')
    if (email == "") {
        emailBlock.innerHTML = "No Email"
    } else {
        emailBlock.innerHTML = email
    }
	userBlock.appendChild(emailBlock)

    //Photo Container
    var photoContainer = document.createElement('div')
	photoContainer.setAttribute('class', 'item-grid-photo-container')
	userBlock.appendChild(photoContainer)

    var photoBlock = document.createElement('img')
	photoBlock.setAttribute('class', 'item-grid-photo')
    photoBlock.addEventListener('click', () => {
        loadProfile(ID)
    })
    
    if (profilePhoto == "") {
        photoBlock.src = "https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/ZumaLogo.png?alt=media&token=1e0a55f6-ce8e-43e4-ad17-db0495c0fe99"
    } else {
        photoBlock.src = profilePhoto
    }
    
	photoContainer.appendChild(photoBlock)


    //Actions Container
    var actionsContainer = document.createElement('div')
	actionsContainer.setAttribute('class', 'item-grid-photo-container')
    userBlock.appendChild(actionsContainer)

    var editIcon = document.createElement('div')
	editIcon.setAttribute('class', 'edit-icon')
    editIcon.innerHTML = ""
    editIcon.addEventListener('click', () => {
        loadProfile(ID)
    })
    actionsContainer.appendChild(editIcon)

    var cancelIcon = document.createElement('div')
	cancelIcon.setAttribute('class', 'cancel-icon')
    cancelIcon.innerHTML = ""
    cancelIcon.addEventListener('click', () => {
        console.log("deleted user: ", ID)
        updateApplicationStatus(ID, "deleted")
        getUsers()
    })
    actionsContainer.appendChild(cancelIcon)

}
