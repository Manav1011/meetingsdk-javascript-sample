const axios = require('axios');
const qs = require('qs');

const CLIENT_ID = 'mPcTd93nRseLmbMesNP1Cw';
const CLIENT_SECRET = 'zTFToTOs7CseRL3p7Zh4uR5dhBVJ5SUF';
const ACCOUNT_ID = '57tQLQJgTcm94krYW0znUw';
const API_BASE_URL = 'https://api.zoom.us/v2';

async function getAccessToken() {
    const tokenUrl = 'https://zoom.us/oauth/token';
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(tokenUrl, qs.stringify({
        grant_type: 'account_credentials',
        account_id: ACCOUNT_ID
    }), {
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
}

async function createMeeting(accessToken,email) {
    const response = await axios.post(`${API_BASE_URL}/users/${email}/meetings`, {
        topic: "My Meeting",
        type: 2,
        start_time: new Date().toISOString(),
        duration: 60,
        timezone: "UTC",
        password: "123456",
        agenda: "Discuss project updates"
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

async function getMeetingSignature(meetingNumber) {
    const response = await axios.post('http://localhost:4000', {
        meetingNumber: meetingNumber,
        role: 1
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data.signature;
}

async function getUserZakToken(accessToken) {
    const response = await axios.get(`${API_BASE_URL}/users/me/token`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        params: { type: 'zak' }
    });
    return response.data.token;
}

(async () => {
    try {
        const accessToken = await getAccessToken();
        console.log('Access Token:', accessToken);

        const meetingData = await createMeeting(accessToken);
        console.log('Meeting Created:', meetingData);

        const signature = await getMeetingSignature(meetingData.id);
        console.log('Meeting Signature:', signature);

        const zakToken = await getUserZakToken(accessToken);
        console.log('User ZAK Token:', zakToken);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
})();
