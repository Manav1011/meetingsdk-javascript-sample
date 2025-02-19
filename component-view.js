const client = ZoomMtgEmbedded.createClient()

let meetingSDKElement = document.getElementById('meetingSDKElement')

var authEndpoint = 'http://localhost:4000'
var sdkKey = 'GVkI9tvlSEasIJ_WSNL0UA'
var meetingNumber = '72060456639'
var passWord = '123456'
var role = 0
var userName = 'Manav Shah'
var userEmail = 'manavshah1011.ms@gmail.com'
var zakToken = 'eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6ImtlZ0NYODhrUnZLVUkxb2V4RXh2dVEiLCJ6aWQiOiIwMGIxMDRhODUzNTc0ZmQ0OWJjNjc5ZjZjMDJkN2I1MCIsImlzcyI6IndlYiIsInNrIjoiMCIsInN0eSI6MSwid2NkIjoidXMwNCIsImNsdCI6MCwiZXhwIjoxNzM5ODkzOTA5LCJpYXQiOjE3Mzk4ODY3MDksImFpZCI6IjU3dFFMUUpnVGNtOTRrcllXMHpuVXciLCJjaWQiOiIifQ.8YYYunHcJxFPYdGobtU5R15EFmQy7QL9DGE0McWJZdI'
var registrantToken = ''
var leaveUrl = 'https://zoom.us'
window.socket =null

// constants

// const CLIENT_ID = 'mPcTd93nRseLmbMesNP1Cw';
// const CLIENT_SECRET = 'zTFToTOs7CseRL3p7Zh4uR5dhBVJ5SUF';
// const ACCOUNT_ID = '57tQLQJgTcm94krYW0znUw';
// const API_BASE_URL = 'https://api.zoom.us/v2';

// async function getAccessToken() {
//   const tokenUrl = 'https://zoom.us/oauth/token';

//   // Encode client ID and secret in Base64
//   const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

//   // Use URLSearchParams instead of `qs`
//   const data = new URLSearchParams({
//       grant_type: 'account_credentials',
//       account_id: ACCOUNT_ID
//   });

//   try {
//       const response = await axios.post(tokenUrl, data, {
//           headers: {
//               'Authorization': `Basic ${authHeader}`,
//               'Content-Type': 'application/x-www-form-urlencoded'
//           }
//       });

//       console.log(response.data);
//       return response.data.access_token;
//   } catch (error) {
//       console.error('Error fetching access token:', error);
//   }
// }
// async function createMeeting(accessToken) {
//     const response = await axios.post(`${API_BASE_URL}/users/me/meetings`, {
//         topic: "My Meeting",
//         type: 2,
//         start_time: new Date().toISOString(),
//         duration: 60,
//         timezone: "UTC",
//         password: "123456",
//         agenda: "Discuss project updates"
//     }, {
//         headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     return response.data;
// }

// async function getUserZakToken(accessToken) {
//     const response = await axios.get(`${API_BASE_URL}/users/me/token`, {
//         headers: {
//             'Authorization': `Bearer ${accessToken}`
//         },
//         params: { type: 'zak' }
//     });
//     return response.data.token;
// }

// const host_prompts = [
//   { key: 'email', message: 'Please enter your Email:' },
//   { key: 'username', message: 'Please enter your Username:' },
//   { key: 'topic', message: 'Please enter topic of the meeting:' },
//   { key: 'meetingPassword', message: 'Please enter the Meeting Password:' }
// ];

// const participant_prompts = [
//   { key: 'meetingId', message: 'Please enter the Meeting Id to join:' },
//   { key: 'meetingPassword', message: 'Please enter the Meeting Password:' },
//   { key: 'email', message: 'Please enter your Email:' },
//   { key: 'username', message: 'Please enter your Username:' },
//   { key: 'topic', message: 'Please enter topic of the meeting:' },
// ];

function getSignature() {
  fetch(authEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      meetingNumber: meetingNumber,
      role: role
    })
  }).then((response) => {
    return response.json()
  }).then((data) => {
    console.log(data)
    startMeeting(data.signature)
  }).catch((error) => {
  	console.log(error)
  })
}

// async function getSignature(host=false) {
//   const access_token = await getAccessToken()

//   if(host == true){
//     var hostInputs = {}
//     for (let i = 0; i < host_prompts.length; i++) {
//       let input = null;
//       // Continue prompting until valid input is received
//       while (!input) {
//         input = prompt(host_prompts[i].message);
//         if (input) {
//           hostInputs[host_prompts[i].key] = input;
//         } else {
//           alert('This field is required. Please provide a valid input.');
//         }
//       }
//     }

//     const zak = await getUserZakToken(access_token);
//     const meetingObj = await createMeeting(access_token)
//     fetch(authEndpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         meetingNumber: meetingObj['id'],
//         role: 1
//       })
//     }).then((response) => {
//       return response.json()
//     }).then((data) => {
//       console.log(data)
//       startMeeting(data.signature,zak)
//     }).catch((error) => {
//       console.log(error)
//     })

//   }else{
//     var hostInputs = {}
//     for (let i = 0; i < participant_prompts.length; i++) {
//       let input = null;
//       // Continue prompting until valid input is received
//       while (!input) {
//         input = prompt(participant_prompts[i].message);
//         if (input) {
//           hostInputs[participant_prompts[i].key] = input;
//         } else {
//           alert('This field is required. Please provide a valid input.');
//         }
//       }
//     }
//   }
// }

// const customButton = {
//   text: 'Your Button Text', // The label of your button
//   onClick: () => {
//     // Define the action to be performed when the button is clicked
//     console.log('Custom button clicked');
//   },
//   className: 'your-custom-class', // Optional: Add a custom class for styling
// };

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
    meetingNumber:meetingNumber,
  }
  window.socket.send(JSON.stringify(message))
}
function appendMessage(text, isBot = false) {
  const messagesContainer = document.getElementById('messages');

  // Create a new message div
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  // Add a different class for bot messages
  if (isBot) {
      messageDiv.classList.add('bot-message'); // You can style this differently in CSS
  }

  // Set the message text
  messageDiv.textContent = new Date().toLocaleTimeString() + ': ' +text;

  // Append the message to the container
  messagesContainer.appendChild(messageDiv);

  // Auto-scroll to the latest message
}
function connectToSocket(){
  window.socket = new WebSocket('ws://192.168.7.195:8001'); // Replace with your WebSocket server URL

    // Event listener for when the WebSocket connection is opened
    window.socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket server!');
    });

    // Event listener for receiving a message from the server
    window.socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      message = JSON.parse(event.data)
      if(message['action'] == 'notify'){
        appendMessage(message['message'])
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

function startMeeting(signature) {

  client.init(initOptions).then(() => {
    client.join({
      signature: signature,
      sdkKey: sdkKey,
      meetingNumber: meetingNumber,
      password: passWord,
      userName: userName,
      userEmail: userEmail,
      tk: registrantToken,
      zak: zakToken
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
}
