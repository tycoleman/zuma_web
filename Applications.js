//Global Variables
var applicationsContainer = document.getElementById('application-container')
var applicationsDropdownText = document.getElementById('applications-dropdown-text')
var applicationsPendingButton = document.getElementById('applications-pending-button')
var applicationsAcceptedButton = document.getElementById('applications-accepted-button')
var applicationsRejectedButton = document.getElementById('applications-rejected-button')

var currentlyShowingStatus = "pending"

applicationsPendingButton.addEventListener('click', () => {
    currentlyShowingStatus = "pending"
    applicationsDropdownText.innerHTML = "Pending"
    getApplications(currentlyShowingStatus)
})

applicationsAcceptedButton.addEventListener('click', () => {
    currentlyShowingStatus = "accepted"
    applicationsDropdownText.innerHTML = "Accepted"

    getApplications(currentlyShowingStatus)
})

applicationsRejectedButton.addEventListener('click', () => {
    currentlyShowingStatus = "rejected"
    applicationsDropdownText.innerHTML = "Rejected"

    getApplications(currentlyShowingStatus)
})

function getApplications(applicationStatus) {

    while (applicationsContainer.firstChild) {
        applicationsContainer.removeChild(applicationsContainer.firstChild);
    }

    let applicationsArray = [];

    database.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            if (applicationStatus == data.applicationStatus) {
                applicationsArray.push({
                    id: doc.id,
                    dateCreated: data.dateCreated,
                    firstName: data.firstName,
                    photo1: data.photo1
                });
            }
        });

        // Sorting the array based on dateCreated
        applicationsArray.sort((a, b) => {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        });

        // Building the blocks after sorting
        applicationsArray.forEach(app => {
            buildApplicationsBlock(app.id, app.dateCreated, app.firstName, app.photo1);
        });
    });
}

getApplications("pending");





function buildApplicationsBlock(ID, date, name, profilePhoto) {


    var userBlock = document.createElement('div')
    userBlock.setAttribute('class', 'item-grid-block')
    userBlock.setAttribute('id', ID)
    applicationsContainer.append(userBlock)

    var emailBlock = document.createElement('div')
	emailBlock.setAttribute('class', 'item-grid-header')
	emailBlock.innerHTML = epochToDate(date)
	userBlock.appendChild(emailBlock)


    var nameBlock = document.createElement('div')
	nameBlock.setAttribute('class', 'item-grid-header')
    if (name == "" || name == "undefined" ) {
        nameBlock.innerHTML = "No Name"
    } else {
        nameBlock.innerHTML = name
    }
	userBlock.appendChild(nameBlock)

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

    var acceptIcon = document.createElement('div')
	acceptIcon.setAttribute('class', 'accept-icon')
    acceptIcon.addEventListener('click', () => {
        updateApplicationStatus(ID, "recentlyAccepted")
    })
    acceptIcon.innerHTML = ""
    actionsContainer.appendChild(acceptIcon)

    var rejectIcon = document.createElement('div')
	rejectIcon.setAttribute('class', 'cancel-icon')
    rejectIcon.addEventListener('click', () => {
        updateApplicationStatus(ID, "rejected")
    })
    rejectIcon.innerHTML = ""
    actionsContainer.appendChild(rejectIcon)

    var profileIcon = document.createElement('div')
    profileIcon.setAttribute('class', 'profile-icon')
    profileIcon.innerHTML = ""
    profileIcon.addEventListener('click', () => {
        loadProfile(ID)
    })
    actionsContainer.appendChild(profileIcon)
}


//Helper Functions
function epochToDate(epoch) {
    console.log(epoch)
    let numEpoch = Number(epoch);
  
    let date = new Date(epoch * 1000); // Convert to milliseconds
  
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero indexed
    let year = date.getFullYear();
  
    // Ensure always 2 digits
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
  
    return `${day}-${month}-${year}`;
  }


function updateApplicationStatus(userId, status) {

    database.collection('users').doc(userId)
        .update({
            applicationStatus: status
        })
        .then(() => {
            console.log(`User ${userId} application status updated successfully.`);
            getApplications(currentlyShowingStatus)

        })
        .catch((error) => {
            console.error(`Error updating user ${userId} application status: `, error);
        });
}
