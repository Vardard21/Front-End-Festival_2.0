let websocketurl;

if (actualurl == "localhost:44338") {
    websocketurl = "ws://" + actualurl + "/ws/";
} else {
    websocketurl = "wss://" + actualurl + "/ws/";
}
// Manually open a new websocket

var webSocket = new WebSocket(websocketurl + localStorage.getItem("UserID"));

// OnOpen change a field in the html page to indicate that the socket is open
webSocket.onopen = function () {
    //Send the authentication key in a JSON object as the first message
    var msg = {
        AuthenticationKey: localStorage.getItem('AuthenticationKey'),
    };
    webSocket.send(JSON.stringify(msg));
}

// Listen for incoming messages
webSocket.onmessage = function (event) {
    // Convert the incoming message
    try {
        var socketmessage = JSON.parse(event.data);
        // Check what type of message you are receiving
        switch (socketmessage.MessageType) {
            case "IncomingMessage":
                // In case of an incoming message, add the message to the screen
                DisplayNewMessage(socketmessage.Message, false);
                break;
            case "InteractionUpdate":
                // In case of an update of the interactions, process the interaction counts into the page
                DisplayUpdateInteraction(socketmessage.Message);
                break;
            case "DeletedMessage":
                DisplayDeletedMessage(socketmessage.Message);


                break;
            case "MessageResponse":
                if (socketmessage.Message.Success) {
                    // In case of a response for a posted message, add the message if successful
                    DisplayNewMessage(socketmessage.Message.Data, true);
                    document.getElementById("NewMessageBtn").disabled = false;
                    document.getElementById("MessageSending").hidden = true;
                } else {
                    // In case of a response for a posted message, show an alert if unsuccessful
                    alert("Failed to post message, error code(s): " + socketmessage.Message.ErrorMessage.toString())
                    document.getElementById("NewMessageBtn").disabled = false;
                    document.getElementById("MessageSending").hidden = true;
                }
                break;
            case "InteractionResponse":
                if (socketmessage.Message.Success) {
                    DisplayNewInteraction(socketmessage.Message.Data);

                } else {
                    alert("Failed to post interaction, error code(s): " + socketmessage.Message.ErrorMessage.toString())
                }
                break;

            default:

                break;

        }
    } catch {
        if (event.data == "Authorization passed, connection now open") {
            document.getElementById("socketstatus").innerHTML = "DEBUG: SOCKET OPEN";
        }
        console.log(event.data);
    }

}
// open a new stagesocket
var stageSocket = new WebSocket(websocketurl + "stage/" + localStorage.getItem("current-StageID"));


// OnOpen change a field in the html page to indicate that the socket is open
stageSocket.onopen = function () {
    //Send the authentication key in a JSON object as the first message
    var msg = {
        AuthenticationKey: localStorage.getItem('AuthenticationKey')

    }
    stageSocket.send(JSON.stringify(msg));
}
stageSocket.onmessage = function (event) {
    try {
        //console.log(event.data)
        var socketmessage = JSON.parse(event.data);
        console.log(socketmessage)
        switch (socketmessage.StageCase) {
            case "ArtistSelection":
                if (socketmessage.StageData.Success) {
                    var currentTrackName = document.createElement("p");
                    var currentTrackSource = document.createElement("p");
                    currentTrackName.innerHTML = socketmessage.StageData.Data.TrackName;
                    currentTrackSource.innerHTML = socketmessage.StageData.Data.TrackSource;
                    PlaySound(socketmessage.StageData.Data.TrackSource);

                    $("#song").empty();
                    $("#song").append("This song is currently playing: " + currentTrackName.innerHTML);
                } else {
                    alert("Failed to load track list, error code(s): " + socketmessage.StageData.ErrorMessage.toString())
                    //console.log(socketmessage)
                }

                break;
            case "IncomingTrack":
                if (socketmessage.StageData.Success) {
                    var currentTrackName = document.createElement("p");
                    var currentTrackSource = document.createElement("p");
                    currentTrackName.innerHTML = socketmessage.StageData.Data.TrackName;
                    currentTrackSource.innerHTML = socketmessage.StageData.Data.TrackSource;
                    PlaySound(socketmessage.StageData.Data.TrackSource);
                    $("#song").empty();
                    $("#song").append("This song is currently playing: " + currentTrackName.innerHTML);
                    console.log(socketmessage.StageData.Data);
                } else {
                    alert("Failed to load track list, error code(s): " + socketmessage.StageData.ErrorMessage.toString())
                    //console.log(socketmessage)
                }
                break;
            case "OnLoadTrack":
                if (socketmessage.StageData.Success) {
                    var currentTrackName = document.createElement("p");
                    var currentTrackSource = document.createElement("p");
                    currentTrackName.innerHTML = socketmessage.StageData.Data.TrackName;
                    currentTrackSource.innerHTML = socketmessage.StageData.Data.TrackSource;
                    currentSong = new Audio(socketmessage.StageData.Data.TrackSource);
                } else {
                    alert("Failed to load track list, error code(s): " + socketmessage.StageData.ErrorMessage.toString())
                    //console.log(socketmessage)
                }
                break;
            case "UpdatedUserList":
                if (socketmessage.StageData.Success) {
                    GetActiveUsers(socketmessage)

                } else {
                    alert("Failed to load User List, error code(s): " + socketmessage.StageData.ErrorMessage.toString())
                    //console.log(socketmessage)
                }
                break;
            case "SongPause":
                if (socketmessage.StageData.Success) {
                    StopSound()

                } else {
                    alert("Failed to load User List, error code(s): " + socketmessage.StageData.ErrorMessage.toString())
                    //console.log(socketmessage)
                }
                break;
            case "SongResume":
                if (socketmessage.StageData.Success) {
                    ResumeSound(socketmessage.StageData.Data.SongTime)

                } else {
                    alert("Failed to load User List, error code(s): " + socketmessage.StageData.ErrorMessage.toString())
                    //console.log(socketmessage)
                }
                break;
            case "ArtistGetList":
                if (socketmessage.StageData.Success) {
                    //console.log(socketmessage)
                    $("#tracklists").empty();
                    socketmessage.StageData.Data.forEach(function (musiclist) {
                        //console.log(musiclist)
                        var List = document.createElement("div");
                        List.id = musiclist.ID;
                        $("#tracklists").append(List)
                        List.className = "mt-2 col-md-12"

                        var nameList = document.createElement("button");
                        nameList.innerHTML = musiclist.Name;
                        nameList.className = "btn dropdown-toggle";


                        $("#" + musiclist.ID).append(nameList)
                        nameList.onclick = function () {

                            if (nameList.classList.contains('show')) {
                                nameList.classList.remove('show')
                                $("#" + musiclist.ID).empty();
                                $("#" + musiclist.ID).append(nameList)

                            } else {

                                musiclist.PlaylistTracks.forEach(function (track) {
                                    // console.log(track)

                                    var divTrack = document.createElement("p");
                                    divTrack.id = track.Id;

                                    var name = document.createElement("div");
                                    name.className = "mooi dropdown-item";
                                    name.classList.add("cursor-pointer")
                                    name.innerHTML = track.TrackName;

                                    var source = document.createElement("div");
                                    source.className = "font-weight-light";
                                    source.innerHTML = track.TrackSource;

                                    var length = document.createElement("div");
                                    length.className = "font-weight-light";
                                    length.innerHTML = track.Length;

                                    $("#" + musiclist.ID).append(name);

                                    name.onclick = function () {
                                        SelectSong(track.Id, musiclist.ID)
                                    }


                                });

                                nameList.classList.add('show')

                            }


                        }

                    });


                } else {

                    alert("Failed to load track list, error code(s): " + socketmessage.StageData.ErrorMessage.toString())
                    console.log(socketmessage)
                }
                break;
            default:

                break;

        }
    } catch {
        console.log(event.data);
    }
}

function DisplayNewMessage(Message, OwnMessage) {

    var div = document.createElement("div");
    div.id = Message.MessageID;

    var divText = document.createElement("div");
    var divName = document.createElement("div");
    var pTime = document.createElement("p");

    var icon = document.createElement("div");
    var remove = document.createElement("div");
    var like = document.createElement("div");
    var dislike = document.createElement("div");
    var likecount = document.createElement("div");
    var dislikecount = document.createElement("div");
    like.id = Message.MessageID + "_" + 1;
    dislike.id = Message.MessageID + "_" + 2;
    likecount.id = Message.MessageID + "-" + 1;
    dislikecount.id = Message.MessageID + "-" + 2;
    likecount.classList.add("interactions");
    dislikecount.classList.add("interactions");



    divText.className = "font-weight-light";
    divName.className = "font-weight-bold";

    divName.innerHTML = Message.UserName;
    divText.innerHTML = Message.MessageText;
    pTime.innerHTML = new Date(Message.Timestamp).toLocaleTimeString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    if (OwnMessage) {

        div.className = "text-right";
        pTime.className = "time-right";
        $(".chatbox").append(div);
        $("#" + Message.MessageID).append(divText);
        $("#" + Message.MessageID).append(pTime);

        $("#" + Message.MessageID).append(like);
        $("#" + Message.MessageID).append(dislike);

        $("#" + Message.MessageID + "_" + 1).append(likecount);
        $("#" + Message.MessageID + "_" + 2).append(dislikecount);


        if (Message.UserRole == "admin") {
            icon.className = "bi bi-person-circle";
            $("#" + Message.MessageID).prepend(icon);
        } else if (Message.UserRole == "artist") {
            icon.className = "bi bi-disc"
            $("#" + Message.MessageID).prepend(icon);
        }




    } else {

        div.className = "text-left";
        like.innerHTML = `<button  style="margin:5px" class = "btn" id = "like" onclick="InteractWithMessage(${Message.MessageID}, 1)"> Like <i class="bi bi-hand-thumbs-up"></i></button>`
        dislike.innerHTML = `<button style="margin:5px" class = "btn" id = "dislike" onclick="InteractWithMessage(${Message.MessageID}, 2)"> Dislike <i class="bi bi-hand-thumbs-down"></i></button>`
        pTime.className = "time-left";
        $(".chatbox").append(div);
        $("#" + Message.MessageID).append(divName);
        $("#" + Message.MessageID).append(divText);
        $("#" + Message.MessageID).append(like);
        $("#" + Message.MessageID).append(dislike);

        $("#" + Message.MessageID + "_" + 1).append(likecount);
        $("#" + Message.MessageID + "_" + 2).append(dislikecount);

        $("#" + Message.MessageID).append(pTime);

        if (Message.UserRole == "admin") {

            icon.className = "bi bi-person-circle";
            $("#" + Message.MessageID).prepend(icon);



        } else if (Message.UserRole == "artist") {
            icon.className = "bi bi-disc"
            $("#" + Message.MessageID).prepend(icon);
        }

    }
    if (localStorage.getItem("UserRole") == "admin") {
        remove.innerHTML = `<button  style="margin:5px" class = "btn" id = "delete" onclick="DeleteMessage(${Message.MessageID})"> Delete <i class=""></i></button>`
        $("#" + Message.MessageID).append(remove);
    }

}

function DisplayNewInteraction(Interaction) {
    //Create the required elements
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    var p3 = document.createElement("p");
    var p4 = document.createElement("p");

    p1.innerHTML = Interaction.UserName;
    p2.innerHTML = Interaction.InteractionType;
    p3.innerHTML = Interaction.Message.MessageText;
    p4.innerHTML = new Date(Interaction.Message.Timestamp).toLocaleTimeString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

}


function DisplayUpdateInteraction(Interaction) {
    var divs = document.getElementsByClassName("interactions");
    //console.log(divs);
    for (var i = 0; i < divs.length; i++) {
        divs[i].innerHTML = "";
    }

    Interaction.forEach(function (Message) {
        Message.Interactions.forEach(function (ints) {
            if (ints.InteractionType == 1) {
                let likes = ints.Count + " Like(s)";
                $("#" + Message.MessageID + "-" + 1).empty().append(likes)
            } else {
                let dislikes = ints.Count + " Dislike(s)";
                $("#" + Message.MessageID + "-" + 2).empty().append(dislikes)
            }
        })
    });
}

function DisplayDeletedMessage(MessageID) {
    $("#" + MessageID).remove()
}


// Send new messages
function SendMessage() {
    // Create an object with the required parameters
    var msg = {
        messageType: "PostMessage",
        messageText: document.getElementById("SendField").value,
        userID: localStorage.getItem("UserID"),
    };
    // Send the object as a string through the websocket
    //console.log(JSON.stringify(msg))
    webSocket.send(JSON.stringify(msg));
    // Handle the message to post it on the screen
    document.getElementById("NewMessageBtn").disabled = true;
    document.getElementById("MessageSending").hidden = false;
}

// Send new messages
function InteractWithMessage(MessageID, InteractionType) {
    // Create an object with the required parameters
    var msg = {
        messageType: "PostInteraction",
        messageID: MessageID,
        userID: localStorage.getItem("UserID"),
        InteractionType: InteractionType
    };
    // Send the object as a string through the websocket
    webSocket.send(JSON.stringify(msg));


}

function DeleteMessage(MessageID) {
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
                $("#" + MessageID).remove()


            } else {
                ProcessErrors(json.ErrorMessageS)

            }
        })
        .catch(error => {});

}

// Close the websocket
function Close() {
    webSocket.send("Closing connection");
    webSocket.close();
    document.getElementById("socketstatus").innerHTML = "DEBUG: SOCKET CLOSED";
}

function LoadPage() {
    document.getElementById("stageName").innerHTML = "Stage " + localStorage.getItem('current-StageID');
    //if the pages is loaded all sended messages are fetched via NewGetMessage 
    if (localStorage.getItem("UserRole") == "artist") {
        //if user is an artist DJ booth appears on the page
        $("#DjBooth").show();
    } else {
        $("#chat").removeClass("col-sm-7").addClass("col-sm-10")
        $("#DjBooth").hide();
    }
   
}



function SelectSong(TrackID, MusicListID) {
    // Create an object with the required parameters

    var msg = {
        ReceivedCase: "SongSelection",
        TrackID: TrackID,
        PlaylistID: MusicListID,
        SongTime: 0
    };
    // Send the object as a string through the websocket
    stageSocket.send(JSON.stringify(msg));
}

let currentSong;
let timeaudio = 0;

function PlaySound(url) {
    if (currentSong == null) {
        currentSong = new Audio(url);
        currentSong.currentTime = timeaudio;
        currentSong.play();

    } else {
        currentSong.pause();
        currentSong = new Audio(url);
        currentSong.currentTime = timeaudio;
        currentSong.play();
    }
}

function PauseSoundCall() {
    var msg = {
        ReceivedCase: "SongPause",
    };
    // Send the object as a string through the websocket
    console.log(msg);
    stageSocket.send(JSON.stringify(msg));
}
function StopSound() {
    currentSong.pause();

}

function ResumeSoundCall() {
    timeaudio = currentSong.currentTime;
    var msg = {
        ReceivedCase: "SongResume",
        SongTime: timeaudio
    };
    console.log(msg);
    // Send the object as a string through the websocket
    stageSocket.send(JSON.stringify(msg));
}

function ResumeSound(songTime) {

    currentSong.currentTime = songTime;
    currentSong.play();
}

function GetActiveUsers(returndata) {


    if (returndata.StageData.Success) {
        var temp = "<tr style>Active Users</tr><br>";
        var activeusers = returndata.StageData.Data;
        activeusers.forEach(function (activeuser) {
            temp += "<tr>";
            temp += "<td style ='font-weight: bold'><span class='logged-in'>●</span>" + activeuser.UserName + "<br></td>";
            temp += "</tr>";
        })
        document.getElementById("userlist").innerHTML = temp;
    }
}

$(document).keypress(function (event) {

    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $("#NewMessageBtn").click();
    }
});

function Enter() {
    document.getElementById("splashscreen").style = "display:none";
    document.getElementById("chatscreenbody").style = "display:run-in";
    LoadPage();
    if (currentSong!=null){
        currentSong.play();
    }
    

}
