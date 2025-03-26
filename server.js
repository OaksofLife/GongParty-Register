const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Validate environment variables
const credentials = process.env['credentials.json'] ? JSON.parse(process.env['credentials.json']) : null;
if (!credentials || !credentials.client_email || !credentials.private_key) {
  console.error('Google Sheets credentials are missing or invalid.');
  process.exit(1);
}

const { client_email, private_key } = credentials;
const auth = new google.auth.JWT(client_email, null, private_key, ['https://www.googleapis.com/auth/spreadsheets']);
const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.SPREADSHEET_ID || '1o6p-Wub_hCsqQYc-EJS_5m6bGUc4Ya0UP3cTH_RZm98';

// Input validation function
const validateFormData = (data) => {
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phoneNumber', 'address', 
    'city', 'province', 'postalCode', 'dateOfBirth', 'citizenship'
  ];
  for (const field of requiredFields) {
    if (!data[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
};

// Get the next available row in the spreadsheet
const getNextAvailableRow = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:A', // Get all values in the first column (A)
    });

    const rows = response.data.values;
    const nextRow = rows ? rows.length + 1 : 2; // If rows exist, use the next available row, else start at row 2
    return nextRow;
  } catch (error) {
    console.error('Error getting next available row:', error);
    throw new Error('Error getting next available row');
  }
};

// Form submission route
app.post('/submit-form', async (req, res) => {
  const formData = req.body;
  
  console.log('Received form data:', formData);  // Log the received form data

  // Validate form data
  const validationError = validateFormData(formData);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    // Get the next available row in the spreadsheet
    const nextRow = await getNextAvailableRow();

    // Append data to the next available row
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `Sheet1!A${nextRow}`,
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

    console.log('Successfully appended data:', response);
    res.status(200).send('Form submitted successfully');
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).json({ success: false, error: 'Error submitting the form' });
  }
});

// Serve static files (your website)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
