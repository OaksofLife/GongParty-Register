const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Authenticate with Google Sheets API using credentials from environment variable
const credentials = JSON.parse(process.env.credentials_json); // Parse the environment variable content
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Add the necessary scopes
});

const sheets = google.sheets({ version: 'v4', auth });

// Your Google Sheet ID (from the URL of the sheet)
const spreadsheetId = 'YOUR_GOOGLE_SHEET_ID';

// Handle POST request for form submission
app.post('/submit-form', async (req, res) => {
  const formData = req.body;

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A1',  // Sheet name and range to start appending data
      valueInputOption: 'RAW',
      resource: {
        values: [
          [
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.phoneNumber,
            formData.address,
            formData.city,
            formData.province,
            formData.postalCode,
            formData.dateOfBirth,
            formData.citizenship,
          ],
        ],
      },
    });
    res.status(200).send('Success');
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error submitting the form');
  }
});

// Serve static files (your website)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
