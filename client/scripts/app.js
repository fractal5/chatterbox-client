// ----------------------------------------------
// -------------- GLOBAL VARIABLES --------------
// ----------------------------------------------

window.friendsList = [];
window.currentRoom = '';
window.roomsList = [0];
window.date = new Date(Date.now());
window.lastTimeRetrieved = window.date.toISOString();


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

  $('#roomSelect').on('change', app.filterMessages);

  // TODO: load initial batch of messages and initialize lastTimeRetrieved
  setInterval(app.fetch, 2000);
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
    url: 'https://api.parse.com/1/classes/chatterbox?'+encodeURIComponent('where={"createdAt":{"$gt":"'
          + lastTimeRetrieved + '"}}'),
    // url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {
      limit:100000
    },
    success: function (data) {
      var lastResultNum = data.results.length -1;
      if (lastResultNum >= 0) {
        lastTimeRetrieved = data.results[lastResultNum].createdAt;
      }

      _.each(data.results, function(result) {
        app.addMessage(result);
      });

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
  var username = escapeHtml(message.username);
  var text = escapeHtml(message.text);
  var room = escapeHtml(message.roomname);
  $('#chats').prepend("<p class='"+room+"''>" + '<a href="#" class="username">'+username+'</a>' + text + "</p>")
    .on('click', function() {
      app.addFriend(username);
    });

  if (roomsList.indexOf(room) === -1) {
    roomsList.push(room);
    $('#roomSelect').append("<option id='option"+room+"''>" + room + "</option>");
  } 

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

  currentRoom = roomName;

  // TODO: refresh to show new room.
};



app.addFriend = function(friendName) {
  if (friendsList.indexOf(friendName) === -1) {
    friendsList.push(friendName);
  }
};



app.handleSubmit = function() {
  var messageText = $('#message').val();
  var message = {
    username: getQueryVariable('username'),
    text: messageText,
    roomname: currentRoom
  };
  app.send(message);
};

app.filterMessages = function() {
  var currentIndex = $('#roomSelect')[0].selectedIndex;
  var roomName = roomsList[currentIndex];
  if (currentIndex === 0) {
    $('#chats p').show();
  } else {
    $('#chats :not(.'+roomName+')').hide();
    $('#chats .'+roomName).show();
  }
};


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
