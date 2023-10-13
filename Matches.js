//Global Variables
var matchesContainer = document.getElementById('matches-container')
var todaysDate = document.getElementById('todays-date')
let currentSeconds = Math.floor(Date.now() / 1000);

todaysDate.innerHTML = epochToDateString(currentSeconds)

function getMatches() {

    while(matchesContainer.firstChild) {
        matchesContainer.removeChild(matchesContainer.firstChild)
    }

    database.collection("matches").get().then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {

            var data = doc.data()
            
            console.log(data.isActive)
            if (data.isActive) {
                console.log(doc.id)

                buildMatch(doc.id, data.date, data.members[0], data.members[1])

            }
        })
    })
}

getMatches()


function buildMatch(ID, date, user1ID, user2ID) {

    var userBlock = document.createElement('div')
    userBlock.setAttribute('class', 'item-grid-block')
    userBlock.setAttribute('id', ID)
    matchesContainer.append(userBlock)

    var dateBlock = document.createElement('div')
	dateBlock.setAttribute('class', 'item-grid-header')
	dateBlock.innerHTML = epochToDateString(date)
	userBlock.appendChild(dateBlock)

    //Photo Container
    // var photoContainer = document.createElement('div')
	// photoContainer.setAttribute('class', 'item-grid-photo-container')
	// userBlock.appendChild(photoContainer)

    // var photoBlock = document.createElement('img')
	// photoBlock.setAttribute('class', 'item-grid-photo')

    // database.collection('users').doc(userID).get()
    //     .then(doc => {
    //         if (doc.exists) {
    //             photoBlock.src = doc.data().profilePhoto
    //             photoContainer.appendChild(photoBlock)

    //         } else {
    //             console.log('No such document!');
    //         }
    //     })

    //Name Container
    var matchInfoContainer = document.createElement('div')
    matchInfoContainer.setAttribute('class', 'match-info-container')
    var matchNameText = document.createElement('div')
    matchNameText.setAttribute('class', 'match-name-text')
    
    database.collection('users').doc(user1ID).get()
        .then(doc => {
            if (doc.exists) {
                
                var matchImage = document.createElement('img')
                matchImage.setAttribute('class', 'search-result-image')
                if (doc.data().photo1 == "") {
                    matchImage.src = "https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/ZumaLogo.png?alt=media&token=1e0a55f6-ce8e-43e4-ad17-db0495c0fe99"
                } else {
                    matchImage.src = doc.data().photo1
                }
                matchInfoContainer.appendChild(matchImage)
                
                matchNameText.innerHTML = doc.data().firstName + " " + doc.data().lastName
                
                matchInfoContainer.appendChild(matchNameText)
            } else {
                console.log('No such document!');
                matchNameText.innerHTML = "No Name"

            }
        })
    userBlock.appendChild(matchInfoContainer)

    var matchInfoContainer2 = document.createElement('div')
    matchInfoContainer2.setAttribute('class', 'match-info-container')
    var matchNameText2 = document.createElement('div')
    matchNameText2.setAttribute('class', 'match-name-text')
    
    database.collection('users').doc(user2ID).get()
        .then(doc => {
            if (doc.exists) {
                var matchImage = document.createElement('img')
                matchImage.setAttribute('class', 'search-result-image')
                if (doc.data().photo1 == "") {
                    matchImage.src = "https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/ZumaLogo.png?alt=media&token=1e0a55f6-ce8e-43e4-ad17-db0495c0fe99"
                } else {
                    matchImage.src = doc.data().photo1
                }
                matchInfoContainer2.appendChild(matchImage)
                
                matchNameText2.innerHTML = doc.data().firstName + " " + doc.data().lastName
                
                matchInfoContainer2.appendChild(matchNameText2)

            } else {
                console.log('No such document!');
                matchNameText2.innerHTML = "No Name"

            }
        })
    userBlock.appendChild(matchInfoContainer2)



    //Actions Container
    var actionsContainer = document.createElement('div')
	actionsContainer.setAttribute('class', 'item-grid-photo-container')
    userBlock.appendChild(actionsContainer)

    var editIcon = document.createElement('div')
	editIcon.setAttribute('class', 'edit-icon')
    editIcon.addEventListener('click', () => {
        editMatch(ID)
    })
    editIcon.innerHTML = ""
    actionsContainer.appendChild(editIcon)

}



//Helper Functions
function editMatch(matchID) {

}
