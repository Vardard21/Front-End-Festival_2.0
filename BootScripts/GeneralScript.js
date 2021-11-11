
//1)Local URL
//const actualurl = "localhost:44338";

//2) Proefaccount URL
const actualurl = "festivalapplication20211001092547.azurewebsites.net";


//3) Private Account URL
//const actualurl = "festivalchatbackend.azurewebsites.net";



if(actualurl=="localhost:44338")
{
    baseurl="http://"+actualurl;
}
else
{
    baseurl="https://"+actualurl;
}

//!!IMPORTANT!!: Use only API 1,2 or 3!

function GoToHome() {
    
    window.location.href = 'Index.html';
}

function GoToLogin() {
    window.location.href = 'LoginPage.html';
}

function GoToHelp() {
    window.location.href = 'Help.html';
}

function GoToCreateStage() {
    window.location.href = 'CreateStage.html';
}

function GoToSwitch() {
    window.location.href = 'ChatSwitch.html';
}

function GoToStage() {
    window.location.href = 'ChatScreen.html';
}

function GoToManageUsers() {
    window.location.href = "ManageUser.html";
}
function GoToManageMusic() {
    window.location.href = "ManageMusic.html";
}


function Login() {
    //let dataReceived = "";
    mijnlogin = {}
    mijnlogin.Username = document.getElementById("Username").value;
    mijnlogin.Password = document.getElementById("Password").value;

    //var myJSON = "{\"Username\": \"" + document.getElementById("Username").value + "\",\"Password\":\"" + document.getElementById("Password").value + "\"}"

    fetch(baseurl + "/api/Login", {
            method: "post",
            headers: {
                "success": true,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mijnlogin)
        })
        .then(response => response.json())
        .then(json => {
            if (json.success) {
                localStorage.setItem('AuthenticationKey', json.data.authenticationKey);
                localStorage.setItem('UserID', json.data.userID);
                localStorage.setItem('UserName', json.data.userName);
                localStorage.setItem('UserRole', json.data.userRole);
                GoToSwitch();
            } else {
                ProcessErrors(json.errorMessage);
            }
        })
}

// script to register new user
function Register() {
    // create request body
    myJson = {}
    myJson.Username = document.getElementById("Username").value;
    myJson.Password = document.getElementById("Password").value;
    fetch(baseurl + "/api/User", {
            method: "post",
            headers: {
                "success": true,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(myJson)
        })

        // response as Json
        .then(response => response.json())
        .then(json => {
            if (json.success) {
                var alertmsg = ""
                document.getElementById("alertwindow").classList="alert alert-success alert-dismissible fade show";
                document.getElementById("alertwindow").style="block";
                alertmsg += "<strong>Success!</strong>"                
                alertmsg+="  You have been registered successfully, please proceed to log in"
                alertmsg+="<button type='button' class='btn-close' onclick='CloseAlert()' data-bs-dismiss='alert'></button>"
                document.getElementById("alertwindow").innerHTML = alertmsg;
                       
            } else {
                // errormessage
                ProcessErrors(json.errorMessage)
                document.getElementById("ErrorMessage").innerHTML = json.responseMessage[0];
                alert("something went wrong, try agian!")
            }
        })
}


function UpdateActivity(StageID) {
    update = {}
    update.stageID = StageID;
    update.userID = localStorage.getItem('UserID');
    //console.log(update);
    fetch(baseurl + "/api/UserActivity", {
            method: "put",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey'),
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(update)
        })
        .then(response => response.json())
        .then(function (returndata) {
            //console.log(returndata);

            if (returndata.success) {
                if (StageID == 0) {
                    localStorage.setItem('current-StageID', StageID);
                    GoToSwitch();

                } else {
                    localStorage.setItem('current-StageID', StageID);
                    GoToStage();
                }
            }
            else{
                ProcessErrors(returndata.errorMessage)
            }
        })
        .catch(error => {
            console.error("Error", error);
        });
}

function UpdateActivityLogout(StageID) {
    update = {}
    update.stageID = StageID;
    update.userID = localStorage.getItem('UserID');
    //console.log(update);
    fetch(baseurl + "/api/UserActivity", {
            method: "put",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey'),
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(update)
        })
        .then(response => response.json())
        .then(function (returndata) {
            //console.log(returndata);

            if (returndata.success) {
                if (StageID == 0) {
                    localStorage.setItem('current-StageID', StageID);
                    Logout();

                } else {
                    localStorage.setItem('current-StageID', StageID);
                    GoToStage();
                }
            }
            else{
                ProcessErrors(returndata.errorMessage)
            }
        })
        .catch(error => {
            console.error("Error", error);
        });
}
function UpdateActivityClose() {
    update = {}
    update.stageID = 0;
    update.userID = localStorage.getItem('UserID');
    //console.log(update);
    fetch(baseurl + "/api/UserActivity", {
            method: "put",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey'),
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(update)
        })
        .then(response => response.json())
        .then(function (returndata) {
            //console.log(returndata);

            if (returndata.success) {
                if (StageID == 0) {
                    localStorage.setItem('current-StageID', StageID);


                } else {
                    localStorage.setItem('current-StageID', StageID);

                }
            }
            else{
                ProcessErrors(returndata.errorMessage)
            }
        })
        .catch(error => {
            console.error("Error", error);
        });
}


function Logout() {
    DeleteAuthenticationKey();
    localStorage.clear();
    GoToHome();

}



function DeleteAuthenticationKey() {
    fetch(baseurl + "/api/login/" + localStorage.getItem("UserID"), {
            method: "delete",
            headers: {
                "Authorization": localStorage.getItem('AuthenticationKey'),
                "accept": "text/plain",
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(json => {
            if (json.success == false) {
                //when errorcodes get this error.
                ProcessErrors(json.errorMessage);
            }
        })
        .catch(error => {
            console.log("Failed to send request");
        });
}

function ProcessErrors(errorCodes) {
    if (errorCodes != null) {
        //var AlertMessage = " this errorcode:" + errorCodes;
        //alert(AlertMessage)

        if (errorCodes.includes(1)) {
            showerror(1);
        }

        if (errorCodes.includes(2)) {
            showerror(2);
        }
        if (errorCodes.includes(3)) {
            showerror(3);

        }
        if (errorCodes.includes(4)) {
            showerror(4);
        }
        if (errorCodes.includes(5)) {
            showerror(5);
        }
    }
    function showerror(errorCodes){

        var alertmsg = ""
        document.getElementById("alertwindow").classList="alert alert-danger alert-dismissible fade show";
        document.getElementById("alertwindow").style="block";
        alertmsg += "<strong>Error!</strong>"
        switch(errorCodes){
            case 1:
                alertmsg+="  Server Error: please try again later"
                alertmsg+="<button type='button' class='btn-close' onclick='CloseAlert()' data-bs-dismiss='alert'></button>"
                break;
            case 2:
                alertmsg+="  Request Error: Request can not be processed"
                alertmsg+="<button type=\"button\" class=\"btn-close\" onclick='CloseAlert()'></button>"
                break;
            case 3:
                alertmsg+="  Invalid Operation: please see if what you are trying to do is possible"
                alertmsg+="<button type=\"button\" class=\"btn-close\" onclick='CloseAlert()'></button>"
                break;
            case 4:
                alertmsg+="  Data Error: Please check your data"
                alertmsg+="<button type=\"button\" class=\"btn-close\" onclick='CloseAlert()'></button>"
                break;
            case 5:
                alertmsg+="  Authentication Error: please log in again"
                alertmsg+="<button type=\"button\" class=\"btn-close\" onclick='CloseAlert();Logout()'></button>"
                break;
            default:
                alertmsg+="  Unexpected Error: please contact system admin"
                alertmsg+="<button type=\"button\" class=\"btn-close\" onclick='CloseAlert()'></button>"
                break;
        }
        document.getElementById("alertwindow").innerHTML = alertmsg;
    }

}
function CloseAlert(){
    document.getElementById("alertwindow").classList="";
    document.getElementById("alertwindow").innerHTML = "";
    document.getElementById("alertwindow").style="none";

}
