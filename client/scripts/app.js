// ----------------------------------------------
// -------------- GLOBAL VARIABLES --------------
// ----------------------------------------------

window.friendsList = [];
window.currentRoom = '';
window.roomsList = [];
window.lastTimeRetrieved = 0;

// --------------------------------------------
// -------------- APP DEFINITION --------------
// --------------------------------------------

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};

app.init = function() {

  // handle reqs to add new rooms
  $("#addRoom").on('click', function() {
    app.addRoom($('#newRoomName').val());

  });
  
  $("#send .submit").on('click', app.handleSubmit);


  // TODO: load initial batch of messages and initialize lastTimeRetrieved
};

app.send = function(message) {
  var postRes = $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  var result = $.ajax({
    //url: 'https://api.parse.com/1/classes/chatterbox?'+encodeURIComponent('where={"username":"shelley"}'),
    url: 'https://api.parse.com/1/classes/chatterbox?'+encodeURIComponent('where={"createdAt":{"$gt":}'),
    // url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {
      limit:100000
    },
    success: function (data) {
      console.log('chatterbox: fetched results');
      console.log(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve results');
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.addMessage = function(message) {
  var username = message.username;
  $('#chats').append("<p>" + '<a href="#" class="username">'+username+'</a>' + "</p>")
    .on('click', function() {
      app.addFriend(username);
    });

};

app.addRoom = function(roomName) {
  console.log('adding '+ roomName);
  // check if a room is already present; if not, create.
  if (roomsList.indexOf(roomName) === -1) {
    roomsList.push(roomName);
    $("#roomSelect").children().removeAttr("selected");
    $('#roomSelect').append("<option selected id='option"+roomName+"''>" + roomName + "</option>");
  } else {
    $("#roomSelect").children().removeAttr("selected");
    $('#option'+roomName).attr('selected','selected');
  }

  // TODO: refresh to show new room.
};



app.addFriend = function(friendName) {
  if (friendsList.indexOf(friendName) === -1) {
    friendsList.push(friendName);
  }
};



app.handleSubmit = function() {
  console.log('running handleSubmit');
  var messageText = $('#message').text();
  var message = {
    username: getQueryVariable('username'),
    text: messageText,
    room: currentRoom
  };

}


// --------------------------------------------
// -------------- HELPER METHODS --------------
// --------------------------------------------

var getQueryVariable = function(variable) {
  //https://css-tricks.com/snippets/javascript/get-url-variables/
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// from http://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }
