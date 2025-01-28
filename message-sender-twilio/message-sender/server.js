const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

// Use environment variables or fallback to hardcoded values for testing
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACdf423bd7ec4f81ff708ef348720af764';
const authToken = process.env.TWILIO_AUTH_TOKEN || '8b3c7bb03964433d3ff7a6b68ae2d241';

const client = twilio(accountSid, authToken);

const app = express();

// Enable CORS for requests from the frontend (http://localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
}));

app.use(bodyParser.json());

app.post('/send-message', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+18452033294', // Ensure this matches your Twilio number
      to: phoneNumber,
    });
    res.status(200).send({ success: true, response });
  } catch (error) {
    console.error('Error sending message:', error.message); // Log detailed error on the server
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
