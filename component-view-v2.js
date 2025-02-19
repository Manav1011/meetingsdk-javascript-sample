const client = ZoomMtgEmbedded.createClient()

let meetingSDKElement = document.getElementById('meetingSDKElement')

window.socket =null

window.meetingNumber = null


const initOptions = {
  zoomAppRoot: meetingSDKElement, // Replace with your element ID
  language: 'en-US',
  patchJsMedia: true,
  leaveOnPageUnload: true,
  // customize: {
  //   toolbar: {
  //     buttons: [customButton],
  //   },
  // },
};

function getSummary(){
  message={
    action:"get_summary",
    meetingNumber:window.meetingNumber,
  }
  window.socket.send(JSON.stringify(message))
}

function addToExcercise(text){
  const converter = new showdown.Converter();
  excercise_panel = document.getElementById('exercise-panel');

  excercise_panel.style.display='flex'
  excercise_content = document.getElementById("exercise-content");
  excercise_content.innerHTML = converter.makeHtml(text);;
}
function appendMessage(text, isBot = false) {
  const converter = new showdown.Converter();
  const messagesContainer = document.getElementById('messages');

  // Create a new message div
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  // Add a different class for bot messages
  if (isBot) {
      messageDiv.classList.add('bot-message'); // You can style this differently in CSS
  }

  // Set the message text
  messageDiv.innerHTML = new Date().toLocaleTimeString() + '\n ' + converter.makeHtml(text);;

  // Append the message to the container
  messagesContainer.appendChild(messageDiv);

  // Auto-scroll to the latest message
}
function connectToSocket(host=false,join_url=null,silence_duration=null){
  window.socket = new WebSocket('ws://192.168.7.195:8001'); // Replace with your WebSocket server URL

    // Event listener for when the WebSocket connection is opened
    window.socket.addEventListener('open', (event) => {
      if(host==true){
        message={
          action:"connection",
          meeting_id:window.meetingNumber,
          user:'host',
          join_url:join_url,
          silence_duration:silence_duration
        }
        window.socket.send(JSON.stringify(message))
      }else{
        message={
          action:"connection",
          meeting_id:window.meetingNumber,
          user:'participant'
        }
        window.socket.send(JSON.stringify(message))
      }
    });

    // Event listener for receiving a message from the server
    window.socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      message = JSON.parse(event.data)
      if(message['action'] == 'notify'){
        appendMessage(message['message'])
        if('excercise' in message){
          excercise_markdown = message['excercise']
          addToExcercise(excercise_markdown)
        }
      }

      // document.getElementById('response').textContent = 'Server says: ' + event.data;
    });

    // Event listener for any WebSocket errors
    window.socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
    });

    // Event listener for when the WebSocket connection is closed
    window.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed');
    });
}

async function createMeeting(email) {
  try {
      const response = await axios.post('http://localhost:8000/create_meeting', {
          email: email
      }, {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      });
      return response.data
  } catch (error) {
      console.error('Error creating meeting:', error.response ? error.response.data : error.message);
  }
}

async function generateSignature(meeting_id,role) {
  try {
      const response = await axios.post("http://localhost:8000/generate_signature", {
          meetingNumber: meeting_id,
          role: role,
          expirationSeconds: 7200
      }, {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          }
      });

      return response.data
  } catch (error) {
      console.error("Error generating signature:", error.response ? error.response.data : error.message);
  }
}

function hostInputs() {
  let email = prompt("Enter email");
  let username = prompt("Enter zoom username");
  let silent_duration = prompt("Set the silence duration in seconds");
  return { email,username,silent_duration };
}

function participantsInputs() {
  let meetingURL = prompt("Enter meeting url");
  let username = prompt("Enter zoom username");
  return { meetingURL ,username};
}

function extractMeetingID(zoomURL) {
  const match = zoomURL.match(/\/j\/(\d+)/);
  return match ? match[1] : null;
}

function startMeeting(host=false) {
  if(host){
    let userInputs = hostInputs();
    // craete meeting
    createMeeting(userInputs.email).then(meeting_obj => {
      join_url = meeting_obj['join_url']
      zak = meeting_obj['zak']
      meeting_id = extractMeetingID(join_url)
      window.meetingNumber=meeting_id
      // generate signature here
      generateSignature(meeting_id,1).then((res) => {
        sdkKey = res['sdkKey']
        client.init(initOptions).then(() => {
          client.join({
            signature: res['signature'],
            sdkKey: sdkKey,
            meetingNumber: meeting_id,
            password: 123456,
            userName: userInputs.username,
            userEmail: userInputs.email,
            tk: '',
            zak: zak
          }).then(() => {
            console.log('joined successfully')
           document.getElementById('chat-box').style.display='flex'
           connectToSocket(host=true,join_url=join_url,userInputs.silent_duration)
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log(error)
        })
      })
    })
  }else{
    let userInputs = participantsInputs();
      meeting_id = extractMeetingID(userInputs.meetingURL)
      window.meetingNumber=meeting_id
      // generate signature here
      generateSignature(meeting_id,0).then((res) => {
        sdkKey = res['sdkKey']
        client.init(initOptions).then(() => {
          client.join({
            signature: res['signature'],
            sdkKey: sdkKey,
            meetingNumber: meeting_id,
            password: 123456,
            userName: userInputs.username,
            tk: ''
          }).then(() => {
            console.log('joined successfully')
           document.getElementById('chat-box').style.display='flex'
           connectToSocket()
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log(error)
        })
      })
  }
}
