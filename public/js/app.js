var name=queryparams('name');
var room=queryparams('room');
var socket = io(); //this io() function starts when server starts
console.log(name +' wants to join '+room);

      var $room=jQuery('.room-title');
      $room.text(room);

  socket.on('connect', function() {
    console.log('Successfully connected');
    socket.emit('Join Room',{
        name:name,
        room:room
    });
  });

  socket.on('message', function(message) {
    var momenttimestamp=moment.utc(message.timestamp);
    var $messages=jQuery('.messages');
    var $message=jQuery('<li class="list-group-item"></li>');
    console.log('New message:');
    console.log(message.text);
    $message.append('<p><strong>'+message.name+' '+momenttimestamp.local().format('ddd h:mm a')+' '+'</strong></p>');
    $message.append('<p>'+message.text+'</p>');
    $messages.append($message);
  });

  //Handle submitting of new message
  var $form = jQuery('#message-form');
  /*argument we will pass to jQuery is only selector.
  selector is a use to pick element from html.we will use id to fetch the form i.e #message-form*/
  //the reason to use $ is to show that the variable $form stores a jQuery instance of an element
  $form.on('submit', function(event) {
    event.preventDefault(); //it dosen't refresh the entire page
    var $message = $form.find('input[name=message]');

    socket.emit('message', {
      name:name,
      text: $message.val()
    });

    $message.val('');
  });
