ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()

var authEndpoint = 'http://localhost:4000'
var sdkKey = 'GVkI9tvlSEasIJ_WSNL0UA'
var meetingNumber = '77535486502'
var passWord = '123456'
var role = 1
var userName = 'JavaScript'
var userEmail = 'manavshah1011.ms@gmail.com'
var zakToken = 'eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6ImtlZ0NYODhrUnZLVUkxb2V4RXh2dVEiLCJ6aWQiOiI3NzAzZmYxODg5YWU0MmFmYTJhZjYzOTY4ZGQwOTNjYyIsImlzcyI6IndlYiIsInNrIjoiMCIsInN0eSI6MSwid2NkIjoidXMwNCIsImNsdCI6MCwiZXhwIjoxNzM5Nzc2Nzg1LCJpYXQiOjE3Mzk3Njk1ODUsImFpZCI6IjU3dFFMUUpnVGNtOTRrcllXMHpuVXciLCJjaWQiOiIifQ.JSR87ClKkN81xsqMaHSxPEtgoyZFnUfiKBlCEcj_3rI'
var registrantToken = ''
var leaveUrl = 'https://zoom.us'

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
const customButton = {
  text: 'Your Button Text', // The label of your button
  onClick: () => {
    // Define the action to be performed when the button is clicked
    console.log('Custom button clicked');
  },
  className: 'your-custom-class', // Optional: Add a custom class for styling
}


const initOptions = {
  zoomAppRoot: meetingSDKElement, // Replace with your element ID
  language: 'en-US',
  patchJsMedia: true,
  leaveOnPageUnload: true,
  customize: {
    toolbar: {
      buttons: [customButton],
    },
  },
};

function startMeeting(signature) {

  document.getElementById('zmmtg-root').style.display = 'block'

  ZoomMtg.init({
    leaveUrl: leaveUrl,
    patchJsMedia: true,
    leaveOnPageUnload: true,
    success: (success) => {
      console.log(success)
      ZoomMtg.join({
        signature: signature,
        sdkKey: sdkKey,
        meetingNumber: meetingNumber,
        passWord: passWord,
        userName: userName,
        userEmail: userEmail,
        tk: registrantToken,
        zak: zakToken,
        success: (success) => {
          console.log(success)
        },
        error: (error) => {
          console.log(error)
        },
      })
    },
    error: (error) => {
      console.log(error)
    }
  })
}