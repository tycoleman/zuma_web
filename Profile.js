
var profileScreen = document.getElementById('profile-screen')
var dashTabWrapper = document.getElementById('dash-tab-wrapper')

var closeProfileScreen = document.getElementById('close-profile-screen')
closeProfileScreen.addEventListener('click', () => {
    profileScreen.style.display = "none"
    dashTabWrapper.style.display = 'block'
})


var profileName = document.getElementById('profile-name')
var profileLocation = document.getElementById('profile-location')
var profileEmail = document.getElementById('profile-email')
var profilePhone = document.getElementById('profile-phone')
var profileDOB = document.getElementById('profile-dob')
var profileGender = document.getElementById('profile-gender')
var profileDatingPreference = document.getElementById('profile-dating-preference')
var profileDateJoined = document.getElementById('profile-date-joined')
var profileSubscription = document.getElementById('profile-subscription')
var profileInstagram = document.getElementById('profile-instagram')
var profileReferral = document.getElementById('profile-referral')

var profilePhotosContainer = document.getElementById('profile-photos-container')
var interestsContainer = document.getElementById('interests-container')


function loadProfile(userID) {
    // Fetch the user document from Firestore
    profileScreen.style.display = "block"
    dashTabWrapper.style.display = 'none'

    database.collection('users').doc(userID).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();

                // Assign the user data to the HTML elements
                profileName.innerHTML = data.firstName;
                getCityFromLatLng(data.lat, data.lng, (city) => {
                    if (city) {
                        profileLocation.innerHTML = city;
                    } else {
                        profileLocation.innerHTML = "Unknown Location";  // Or whatever default message you'd like
                    }
                });

                profileEmail.innerHTML = data.email;
                profilePhone.innerHTML = data.phoneNumber;
                profileDOB.innerHTML = data.birthday;
                profileGender.innerHTML = data.gender;
                profileDatingPreference.innerHTML = data.interestedIn;
                profileDateJoined.innerHTML = epochToDate(data.dateCreated);
                profileSubscription.innerHTML = data.subscriptionTerm;
                profileInstagram.innerHTML = data.instagramUsername;
                profileReferral.innerHTML = data.referralName;

                //Profile Photos
                while(profilePhotosContainer.firstChild) {
                    profilePhotosContainer.removeChild(profilePhotosContainer.firstChild)
                }

                for (i = 1; i <= 6; i ++) {
                
                    var profileImage = document.createElement('img')
                    profileImage.setAttribute('class', 'profile-image')
                    profileImage.src = data[`photo${i}`]
                    profilePhotosContainer.appendChild(profileImage)
                }

                //Profile Bio
                document.getElementById('profile-bio').innerHTML = data.bio

                //Profile Interests
                while(interestsContainer.firstChild) {
                    interestsContainer.removeChild(interestsContainer.firstChild)
                }
                for (i = 0; i < 3; i ++) {
                    
                    var interestContainer = document.createElement('div')
                    interestContainer.setAttribute('class', 'interest-container')
                    interestsContainer.appendChild(interestContainer)

                    var interestImage = document.createElement('img')
                    interestImage.setAttribute('class', 'interest-image')
                    interestImage.src = iconReferenceURLs[data.interests[i]]
                    interestContainer.appendChild(interestImage)

                    var interestText = document.createElement('div')
                    interestText.setAttribute('class', 'interest-text')
                    interestText.innerHTML = data.interests[i]
                    interestContainer.appendChild(interestText)
                }

            } else {
                console.log('No such document!');
            }
        })
        .catch(error => {
            console.error('Error getting document:', error);
        });
}



var iconReferenceURLs = {
    'Art' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FArt.png?alt=media&token=e1370df4-26c9-47f4-9a5e-ac2ba1a229b7',
    'Beaches' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FBeaches.png?alt=media&token=f30e228c-ae9b-4837-9e1b-d41de9ccf019',
    'Cats' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FCats.png?alt=media&token=db1f0f2c-a5ad-45af-8551-4238ad47e584',
    'Comedy' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FComedy.png?alt=media&token=7b5d7a76-8bd4-4b88-a042-f30863622eb4',
    'Concerts' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FConcerts.png?alt=media&token=14ee49da-9f6e-4144-92d4-86f0732e1ad8',
    'Dancing' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FDancing.png?alt=media&token=f491f230-acec-4043-907a-d022055bec63',
    'Dogs' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FDogs.png?alt=media&token=f01748c7-54e9-45b3-874b-ed7b16b6e468',
    'Foodie' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FFoodie.png?alt=media&token=8ebcc387-c862-43b3-98db-1daf5299a646',
    'Gaming' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FGaming.png?alt=media&token=ecee0fda-1b28-449e-9034-baf3b7496301',
    'Golf' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FGolf.png?alt=media&token=81eb5c4a-524d-480e-a0e2-698c7eae3602',
    'Gym' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FGym.png?alt=media&token=b521e56b-2390-497b-bbff-d649cccd6958',
    'Movies' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FMovies.png?alt=media&token=f1e33e80-726a-4b59-9931-6ac2c48f487e',
    'Music' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FMusic.png?alt=media&token=f715073e-44bf-4a40-94c3-7014220e01d3',
    'Outdoors' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FOutdoors.png?alt=media&token=205682f7-393f-4c08-a8e6-a99b88d43a96',
    'Reading' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FReading.png?alt=media&token=16adf445-f594-4a23-8a5e-463e7e4ceb04',
    'Shopping' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FShopping.png?alt=media&token=c453861a-6639-437c-8a41-5ffd4757094e',
    'Skiing' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FSkiing.png?alt=media&token=3e9ce35b-0eb5-4a1c-89e5-54aee45d7590',
    'Surfing' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FSurfing.png?alt=media&token=1e23ee7b-d3ad-4870-beff-683313d30273',
    'Travel' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FTravel.png?alt=media&token=2451ab15-e6e2-4f20-84f7-25df62165098',
    'Wine' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FWine.png?alt=media&token=cb809846-a2ad-4d26-92c9-394218340341',
    'Writing' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FWriting.png?alt=media&token=df91e372-d2f3-4cd7-b429-fccb2f28c6dc',
    'Yoga' : 'https://firebasestorage.googleapis.com/v0/b/zuma-39233.appspot.com/o/Icons%2FYoga.png?alt=media&token=04ae5e7d-050e-4432-be39-3583a425995a'
}

function getCityFromLatLng(lat, lng, callback) {
    const apiKey = 'AIzaSyCjoBce8ajMbuNP57Xhh5vyvwlbOHlXJh8'; // Replace with your API key
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            let cityName = null;
            let stateName = null;
            if (data.status === "OK") {
                for (let i = 0; i < data.results[0].address_components.length; i++) {
                    let component = data.results[0].address_components[i];
                    if (component.types.includes("locality")) {
                        cityName = component.long_name;
                    }
                    if (component.types.includes("administrative_area_level_1")) {
                        stateName = component.short_name;
                    }
                }
            } else {
                console.error('Error with Geocoding API:', data.status);
            }
            
            // Return the formatted "City, State" or a default if one of them is missing
            let locationString = cityName && stateName ? `${cityName}, ${stateName}` : "Unknown Location";
            callback(locationString);
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
            callback("Unknown Location");
        });
}



















