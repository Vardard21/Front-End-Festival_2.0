// fucntion for loading the info of the stages
function GetUsers() {
    fetch(baseurl + "/api/User", {
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then((response) => response.json()) //What's the difference 
        .then(function (returndata) {
            //console.log(returndata);
            // if loading is correct, a card with data will be provided
            if (returndata.success) {
                $("#myUsers").empty();
                var temp = "";
                returndata.data.forEach(function (user) {

                    temp += "<tr>";
                    temp += "<td class = \"cursor-pointer\" style=\"font-weight: lighter\" onclick ='GetUserData(" + user.userID + ")'>" + user.userID + "</td>";
                    temp += "<td style = \" font-weight: bold\">" + user.userName + "</td>";
                    temp += "<td><select id='userrolefield"+user.userID+"'>"
                    if (user.userRole == "artist") {
                        temp += "<option value ='visitor'> Visitor </option><option selected value = 'artist' >Artist</option><option value='admin'>Admin</option>";
                    } else if (user.userRole == "admin"){
                        temp += "<option value ='visitor'> Visitor </option><option value = 'artist' >Artist</option><option selected value='admin'>Admin</option>";
                    }
                    else{
                        temp += "<option selected value = 'visitor' > Visitor </option><option value = 'artist' >Artist</option><option value='admin'>Admin</option>";
                    }
                    temp +="</select></td>"
                    temp += "<td style=\"font-weight: lighter\"> <button type=\"button\" class=\"btn btn-primary btn-block btn-lg\" data-toggle=\"modal\" data-target=\"#myModal\"onclick='GetUserData(" + user.userID + ")'>Open Messages</button></td>";
                    temp += "<td style=\"font-weight: lighter\"> <button class='btn' onclick='EditUser(" + user.userID +")'> Edit</button></td>";
                    temp += "<td style=\"font-weight: lighter\"> <button class='btn' onclick='DeleteUser(" + user.userID +")'> Delete</button></td></tr>";
                    //console.log(role);

                });
                document.getElementById("myUsers").innerHTML += temp;
                


            } else {
                ProcessErrors(json.errorMessage)
            }
        }) // if loading failed, error message is shown on screen
    // .catch(error => {
    //     console.error("Error", error);

    // });
}

function GetUserData(userID) {
    if (localStorage.getItem('UserRole') == "admin") {
        fetch(baseurl + "/api/User/" + userID, {
                headers: {
                    "Authorization": localStorage.getItem('AuthenticationKey')
                }
            })
            .then((response) => response.json()) //What's the difference 
            .then(function (returndata) {
                //console.log(returndata);
                // if loading is correct, a card with data will be provided
                if (returndata.success) {
                    $("#userActivity").empty();
                    var temp = "";
                    temp += "<tr>"
                    temp += "<th style=\"width: 05%;\"> User Name</th>"
                    temp += "<th style=\"width: 05%;\"> Stage ID</th>"
                    temp += "<th style=\"width: 10%;\"> Message History</th>"
                    temp += "<th style=\"width: 10%;\"> Message Text</th>"
                    temp += "<th style=\"width: 10%;\"> Delete Message</th>"
                    temp += "</tr>"
                    var userall = returndata.data
                    //console.log(userall.userRole)
                    userall.activities.forEach(function (useractivities) {
                        useractivities.messageHistory.forEach(function (messages) {
                            //console.log(messages)
                            //console.log(messages.messageText)

                            temp += "<tr>";
                            temp += "<td style = \" font-weight: bold\">" + userall.userName + "</td>";
                            temp += "<td style = \" font-weight: bold\">" + useractivities.stageID + "</td>";
                            temp += "<td style= \" font-weight: lighter\">" + new Date(messages.timestamp + "Z").toLocaleTimeString([], {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            }); + ":" + "</td>";
                            temp += "<td style= \" font-weight: lighter\">" + messages.messageText + "</td>";
                            temp += "<td style=\"font-weight: lighter\"> <button class='btn' onclick='DeleteMessage(" + messages.messageID + "," + userID + ")'> Delete</button></td></tr>";
                        })
                    })
                    // temp += "<tr>";
                    // temp += "<td style=\"font-weight: lighter\">" + userall.stageID + "</td></tr>";
                    document.getElementById("userActivity").innerHTML = temp;
                    //document.getElementById("username").innerhtml += user.userName;

                } else {
                    ProcessErrors(json.errorMessage)
                }
            })
    }
}

function DeleteMessage(MessageID, UserID) {
    fetch(baseurl + "/api/Messages/" + MessageID, {
            method: "delete",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(json => {
            //console.log(json);
            if (json.success) {
                GetUserData(UserID);


            } else {
                ProcessErrors(json.ErrorMessageS)

            }
        })
        .catch(error => {
            console.error("Error Deleting Message", error)
        });

}

function DeleteUser(UserID) {

    if(confirm('Are you sure you want to delete user with id: '+ UserID + '?')){
    fetch(baseurl + "/api/User/" + UserID, {
            method: "delete",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey')
            }
        })
        .then(response => response.json())
        .then(json => {
            if (json.success == false) {
                ProcessErrors(json.errorMessage)
            } else {
                
                GetUsers();
                //console.log(json);

            }
        })

        .catch(error => {
            console.log("Failed to send request");
        });
    }
    else{
        GetUsers();
    }
}

function EditUser(UserID) {
    //localStorage.setItem('UserRole', "admin") //deze lijn is tijdelijk om te laten werken
    if (localStorage.getItem('UserRole') == "admin") {
        var myEdit = {}
        myEdit.userID = UserID
        myEdit.userRole = document.getElementById("userrolefield"+UserID).value

        //var myEdit = "{\"UserID\": " + document.getElementById("userID").value+ ",\"UserRole\": \"+ document.getElementById("userRole").value + \" }";
       // console.log(myEdit);
        fetch(baseurl + "/api/User", {
                method: "put",
                headers: {
                    "Authorization": localStorage.getItem('AuthenticationKey'),
                    "success": true,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(myEdit)
            })
            .then(response => response.json())
            .then(json => {
                //console.log(json)
                if (json.success) {
                   // console.log(json);
                    GetUsers();
                } else {
                    ProcessErrors(json.errorMessage)
                }
            })
            .catch(error => {
                console.error("Error", error);
            });

    } else {
        console.log(error)
    }

}