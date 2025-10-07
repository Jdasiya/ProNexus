# Setting up Google OAuth for Pronexus

This guide will walk you through the steps to set up Google OAuth authentication for the Pronexus application.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. Choose "External" user type (for non-Google Workspace users)
5. Fill in the required information:
   - App name: Pronexus
   - User support email: your-email@example.com
   - Developer contact information: your-email@example.com
6. Click "Save and Continue"
7. You can skip adding scopes and test users for basic authentication, just click through to finish

## 2. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: Pronexus Web Client
5. Add authorized JavaScript origins:
   - http://localhost:3000 (for development)
   - https://your-production-domain.com (for production)
6. Add authorized redirect URIs:
   - http://localhost:3000 (for development)
   - https://your-production-domain.com (for production)
7. Click "Create"
8. Note down the Client ID that is generated

## 3. Configure the Application

### Frontend Configuration

1. Open `src/App.js`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with the Client ID you obtained from Google Cloud Console:

```javascript
const googleClientId = "YOUR_ACTUAL_CLIENT_ID_HERE";
```

### Backend Configuration

1. Open `src/main/resources/application.properties`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with the Client ID you obtained from Google Cloud Console:

```properties
google.client.id=YOUR_ACTUAL_CLIENT_ID_HERE
```

## 4. Testing

1. Start both frontend and backend applications
2. Navigate to the login page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's authentication page
5. After successful authentication, you should be redirected back to the application and logged in

## Troubleshooting

- **Invalid Client ID Error**: Ensure the client ID is correctly copied without any extra spaces or characters
- **Redirect URI Mismatch**: Make sure the domain where your app is running is listed in the authorized redirect URIs in Google Cloud Console
- **Cross-Origin Issues**: Check that CORS is properly configured in the backend to allow requests from the frontend
- **HTTP vs HTTPS**: Google OAuth requires HTTPS in production environments. For development, http://localhost is allowed

For more detailed information, refer to [Google's OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2). 