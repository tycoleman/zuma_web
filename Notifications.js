

var recipientField = document.getElementById('recipient-field')
var selectedUsersContainer = document.getElementById('selected-users-container')
clearSelectedUsers()
selectedUsersContainer.style.display = 'none'

var allUsersButton = document.getElementById('all-users-button')
var specificUsersButton = document.getElementById('specific-users-button')
var specificUsersSearchContainer = document.getElementById('specific-users-search-container')
specificUsersSearchContainer.style.display = 'none'

allUsersButton.addEventListener('click', () => {
    specificUsersSearchContainer.style.display = 'none'
    allUsersButton.className = 'user-selection-toggle-selected'
    specificUsersButton.className = 'user-selection-toggle'
    
    isAllUsers = true

})

specificUsersButton.addEventListener('click', () => {
    specificUsersSearchContainer.style.display = 'block'
    allUsersButton.className = 'user-selection-toggle'
    specificUsersButton.className = 'user-selection-toggle-selected'
    
    isAllUsers = false

})


var monthPicker = document.getElementById('month-picker')
var dayField = document.getElementById('day-field')
var hourField = document.getElementById('hour-field')
var minuteField = document.getElementById('minute-field')
var amToggle = document.getElementById('am-toggle')
var pmToggle = document.getElementById('pm-toggle')
var titleField = document.getElementById('title-field')
var messageField = document.getElementById('message-field')
var sendNotificationButton = document.getElementById('send-notification-button')

var laterDateContainer = document.getElementById('later-date-container')
var nowButton = document.getElementById('now-button')
var laterButton = document.getElementById('later-button')
laterDateContainer.style.display = 'none'

laterButton.addEventListener('click', () => {
    laterDateContainer.style.display = 'block'
    laterButton.className = 'time-selected'
    nowButton.className = 'time-unselected'

})

nowButton.addEventListener('click', () => {
    laterDateContainer.style.display = 'none'
    laterButton.className = 'time-unselected'
    nowButton.className = 'time-selected'
})



var userToken = ""
var isAllUsers = true
var tokenText = document.getElementById('token-text')
tokenText.style.display = 'none'


var userSearchResults = document.getElementById('city-search-results')
userSearchResults.style.display = 'none'


function clearSelectedUsers() {
    while (selectedUsersContainer.firstChild) {
        selectedUsersContainer.removeChild(selectedUsersContainer.firstChild)
    }
}




//Algolia
const searchClient = algoliasearch('ZFGWAW13YG', '516de59dffd435bb07740744bfe76f65');

const headerSearch = instantsearch({
    indexName: 'users',
    searchClient,
    getSearchParams() {
        return {
          hitsPerPage: 10,
        }
    }
});

function createAutocompleteResults(results) {

    let hitsContainer = document.createElement('div')
    hitsContainer.className = 'city-search-results'

    if(results.hits.length != 0) {
        for (i = 0; i < (results.hits.length < 5 ? results.hits.length : 5); i++) {

            var hit = results.hits[i]
    
            if(hit.applicationStatus == "accepted") {
                let headerAutocompleteResult = document.createElement('div')
                headerAutocompleteResult.className = 'header-autocomplete-result'

                headerAutocompleteResult.setAttribute('onClick', `addUserForNotifications("${hit.firstName}", "${hit.pushToken}")`)
                hitsContainer.appendChild(headerAutocompleteResult)
                
                var searchResultImage = document.createElement('img')
                searchResultImage.setAttribute('class', 'search-result-image')
                if (hit.photo1 == "") {
                    searchResultImage.src = "https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/ZumaLogo.png?alt=media&token=1e0a55f6-ce8e-43e4-ad17-db0495c0fe99"
                } else {
                    searchResultImage.src = hit.photo1
                }
                headerAutocompleteResult.appendChild(searchResultImage)
            
                let headerResultInfoDiv = createDOMElement('div', 'header-result-info-div', 'none', headerAutocompleteResult)
                
                
                createDOMElement('div', 'header-result-title', hit.firstName, headerResultInfoDiv)
        
                if (i != 4) {
                    createDOMElement('div', 'header-autocomplete-divider', 'none', hitsContainer)
                }
            }

        }
    } else {
        citySearchResults.style.display = 'none'
    }

    return hitsContainer.outerHTML
}

function addUserForNotifications(firstName, token) {

    console.log(firstName)
    console.log(token)

    userToken = token
    
    userSearchResults.style.display = 'none'
    tokenText.style.display = 'block'
    tokenText.innerHTML = "APNS Token: " + token
    
    selectedUsersContainer.style.display = 'flex'
    
    var selectedUser = document.createElement('div')
    selectedUser.className = 'selected-user'
    selectedUser.innerHTML = firstName
    selectedUsersContainer.appendChild(selectedUser)
}

// Create the render function
const headerRenderAutocomplete = (renderOptions, isFirstRender) => {
  const { indices, currentRefinement, refine, widgetParams } = renderOptions;

  if (isFirstRender) {
    const input = document.querySelector('#recipient-field');

    input.addEventListener('input', event => {
        refine(event.currentTarget.value);

        if(userSearchResults.style.display == 'none') {
            $('#city-search-results').fadeIn(200).css('display', 'block')
        }

        if(event.currentTarget.value == '') {
            $('#city-search-results').fadeOut(200)
        }
    });
  }

  document.querySelector('#recipient-field').value = currentRefinement;
  widgetParams.container.innerHTML = indices
    .map(createAutocompleteResults)
    .join('');
};

// Create the custom widget
const headerCustomAutocomplete = instantsearch.connectors.connectAutocomplete(
    headerRenderAutocomplete
);

// Instantiate the custom widget
headerSearch.addWidgets([
    
    headerCustomAutocomplete({
    container: document.querySelector('#city-search-results'),
  })
  
]);

headerSearch.start()


//Hide results if clicked outside
window.addEventListener('click', function(e){
    if (document.getElementById('city-search-results').contains(e.target)){
      // Clicked in box
    } else{
      // Clicked outside the box
      $('#city-search-results').fadeOut()
    }
});



function notifyUsersWithPushOn() {
    // Query all users where isPushOn is true
    database.collection("users").where("isPushOn", "==", true).get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const userData = doc.data();
            console.log(userData.pushToken)
            if (userData.pushToken != "") { // Assuming each user has a userToken field for push notifications
                sendPushNotification(userData.pushToken);
            }
        });
    })
    .catch(error => {
        console.error("Error querying users:", error);
    });
}



// Function to send the push notification
function sendPushNotification(pushToken) {
    
    // Get the input values
    var month = monthPicker.value;
    var day = dayField.value;
    var hour = hourField.value;
    var minute = minuteField.value;
    var isAm = amToggle.checked;
    var isPm = pmToggle.checked;
    var title = titleField.value;
    var message = messageField.value;

    // Convert 12-hour format to 24-hour format if necessary
    if (isPm && hour !== "12") {
        hour = parseInt(hour) + 12;
    } else if (isAm && hour === "12") {
        hour = "00";
    }

    // Construct the data object
    var data = {
        token: pushToken,
        alert: {
            title: title,
            body: message
        },
        badge: 1,
    };

    fetch('https://zuma-b909e6770227.herokuapp.com/sendNotification/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Notification Response:', data);
    })
    .catch((error) => {
        console.error('Error sending notification:', error);
    });
}





// Attach the function to your button
sendNotificationButton.addEventListener('click', () => {
    if (isAllUsers) {
        notifyUsersWithPushOn();
    } else {
        sendPushNotification(userToken);
    }
});



//Helper Functions

function createDOMElement(type, classStr, text, parentElement) {
    let DOMElement = document.createElement(`${type}`)
    DOMElement.className = classStr
  
    if(text != 'none') {
      DOMElement.innerHTML = text
    }
  
    if(parentElement != 'none') {
      parentElement.appendChild(DOMElement)
    }
  
    return(DOMElement)
}
