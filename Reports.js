//Global Variables
var reportsContainer = document.getElementById('reports-container')

var reportTypesDropdown = document.getElementById("report-types-dropdown")
var reportTypes = ["all-reports", "fake-profile", "rude-behaviour", "inappropriate-content", "scam-or-commercial", "identity-hate", "off-zuma-behaviour", "underage", "not-interested", "other"]

reportTypes.forEach(function(reportType) {

    document.getElementById(reportType).addEventListener('click', function() {
        getReports(reportType);
        $("#report-types-dropdown").fadeOut()
        var typeString = document.getElementById(reportType).innerHTML
        document.getElementById("report-type-button-text").innerHTML = typeString
    });
});

document.getElementById("report-type-button").addEventListener('click', function() {
    $("#report-types-dropdown").fadeIn()
});


function getReports(reportType) {

    while(reportsContainer.firstChild) {
        reportsContainer.removeChild(reportsContainer.firstChild)
    }
    
    if (reportType == "all-reports") {
        database.collection("reportedUsers").get().then( (querySnapshot) => {
            querySnapshot.forEach( (doc) => {

                var data = doc.data()
                console.log(data)
                buildReportsBlock(doc.id, data.dateReported, data.reportedUserID, data.reportType)

            })
        })
    } else {
        var typeString = document.getElementById(reportType).innerHTML
        
        database.collection("reportedUsers").where("reportType", "==", typeString).get().then( (querySnapshot) => {
            querySnapshot.forEach( (doc) => {

                var data = doc.data()
                console.log(data)
                buildReportsBlock(doc.id, data.dateReported, data.reportedUserID, data.reportType)

            })
        })
    }

}

getReports("all-reports")


function buildReportsBlock(ID, date, userID, reportType) {

    var userBlock = document.createElement('div')
    userBlock.setAttribute('class', 'item-grid-block')
    userBlock.setAttribute('id', ID)
    reportsContainer.append(userBlock)

    var dateBlock = document.createElement('div')
	dateBlock.setAttribute('class', 'item-grid-header')
	dateBlock.innerHTML = epochToDateString(date)
	userBlock.appendChild(dateBlock)


    var timeBlock = document.createElement('div')
	timeBlock.setAttribute('class', 'item-grid-header')
	timeBlock.innerHTML = epochToTimeString(date)
	userBlock.appendChild(timeBlock)
    
    //Report Container
    var reportBlock = document.createElement('div')
    reportBlock.setAttribute('class', 'item-grid-header')
    reportBlock.innerHTML = reportType
    userBlock.appendChild(reportBlock)

    //Name Container
    var nameBlock = document.createElement('div')
	nameBlock.setAttribute('class', 'item-grid-header')
    database.collection('users').doc(userID).get()
        .then(doc => {
            if (doc.exists) {
                nameBlock.innerHTML = doc.data().firstName
            } else {
                console.log('No such document!');
                nameBlock.innerHTML = "User Deleted"

            }
        })
    userBlock.appendChild(nameBlock)

}



