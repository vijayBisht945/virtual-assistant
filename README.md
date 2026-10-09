# Virtual Assistant

A full-stack, voice-controlled personal assistant. Users can create an account, choose or upload an assistant avatar, and speak commands to get spoken AI responses or open supported services.

## Features

- Account registration and sign-in with an HTTP-only JWT cookie.
- Assistant name and avatar customization, including image uploads.
- Voice input with the browser Speech Recognition API.
- AI-generated responses, read aloud with the browser Speech Synthesis API.
- Command actions for Google, YouTube, Maps, weather search, calculator, Instagram, and Facebook.
- Responsive assistant screen with listening, thinking, and speaking states.

## Tech stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios.
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt.
- Integrations: Gemini API and Cloudinary.
- Browser APIs: Speech Recognition and Speech Synthesis.

## Run locally

Requirements: Node.js, npm, MongoDB, and credentials for the integrations you plan to use.

1. Configure the backend environment variables listed below in `backend/.env`.
2. Start the API in one terminal:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. Start the frontend in another terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Open the Vite URL printed in the frontend terminal (normally `http://localhost:5173`).

The frontend uses `http://localhost:5050` by default for the API. Set `VITE_SERVER_URL` in the frontend environment to use another API URL. Set `FRONTEND_URL` in the backend environment to the frontend origin when it is not `http://localhost:5173`.

## Backend environment variables

Set these in `backend/.env`; do not commit real credentials:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port; defaults to `5050`. |
| `MONGO_DB` | MongoDB connection URI. |
| `JWT_SECRATE_KEY` | Secret used to sign and verify login cookies. The spelling matches the current backend code. |
| `GEMINI_API_URL` | Gemini API endpoint. |
| `GEMINI_API_KEY` | Gemini API credential. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `FRONTEND_URL` | Allowed frontend origin for credentialed CORS requests. |

The frontend can optionally use `VITE_SERVER_URL` for the backend API base URL. Only put public configuration in frontend variables; never put API secrets there.

## Checks

Run these from `frontend/`:

```powershell
npm run lint
npm run build
```

## Browser and deployment notes

- Speech recognition support varies by browser. Use a supported browser and allow microphone access.
- Microphone and speech features should be tested in a secure context (HTTPS in production; localhost is suitable for local development).
- Configure the production API URL, frontend origin, MongoDB, Gemini, and Cloudinary settings in the deployment environment. Keep all credentials out of source control.
- The backend currently configures its authentication cookie for local development; review cookie `secure` and `sameSite` settings before deploying frontend and API on different sites.
