# UQU Assistant - Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- n8n (optional, for AI integration)
- DeepSeek API key (optional, for AI chat)

### 1. Frontend Setup (React PWA)

```bash
# Create the React app with PWA template
npx create-react-app uqu-assistant --template cra-template-pwa

# Navigate to project
cd uqu-assistant

# Install dependencies
npm install lucide-react

# Replace src/App.js with the provided React code
# Replace src/App.css with Tailwind styles
```

#### Add Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Backend Setup (Express API)

```bash
# Create backend directory
mkdir uqu-backend
cd uqu-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors body-parser
npm install -D nodemon

# Create server.js and add the backend code
# Create uqu_demo_data.json and add the data
```

Update `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. Running the Application

#### Terminal 1 - Backend:
```bash
cd uqu-backend
npm run dev
# Server runs on http://localhost:3001
```

#### Terminal 2 - Frontend:
```bash
cd uqu-assistant
npm start
# App runs on http://localhost:3000
```

### 4. n8n Integration (Optional)

1. **Install n8n:**
```bash
npm install -g n8n
n8n start
```

2. **Import the workflow:**
- Open n8n at http://localhost:5678
- Go to Workflows → Import
- Paste the n8n workflow JSON

3. **Configure DeepSeek:**
- Get API key from [DeepSeek](https://platform.deepseek.com/)
- Update the API key in the HTTP Request node

4. **Update Frontend to use n8n:**
```javascript
// In the chat component, replace the API call with:
const response = await fetch('http://localhost:5678/webhook/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userMessage, context: selectedArea })
});
```

## 📱 PWA Features

### Enable PWA:
1. Update `public/manifest.json`:
```json
{
  "short_name": "UQU Assistant",
  "name": "UQ Union Assistant",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#51247A",
  "background_color": "#ffffff"
}
```

2. The service worker is already included with CRA PWA template

### Test PWA:
- Open Chrome DevTools → Application → Service Workers
- Check "Update on reload"
- Test offline functionality

## 🚀 Deployment

### Frontend (Vercel):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and get your URL
```

### Backend (Railway/Render):
1. Push code to GitHub
2. Connect to Railway/Render
3. Deploy with environment variables

### Environment Variables:
```bash
# Frontend (.env)
REACT_APP_API_URL=https://your-backend.com
REACT_APP_N8N_WEBHOOK=https://your-n8n.com/webhook/chat

# Backend (.env)
PORT=3001
DEEPSEEK_API_KEY=your_key_here
```

## 📱 Mobile Testing

### Local Network Testing:
```bash
# Find your IP
ipconfig (Windows) or ifconfig (Mac/Linux)

# Access from phone
http://YOUR_IP:3000
```

### Using ngrok:
```bash
npm install -g ngrok
ngrok http 3000
# Use the HTTPS URL on your phone
```

## 🎨 Customization

### Adjust Split Screen:
- Change initial position: `useState(50)` → `useState(60)` for 60/40 split
- Set limits in `handleMouseMove` function

### Theme Colors:
Update Tailwind config for UQ purple:
```javascript
theme: {
  extend: {
    colors: {
      'uq-purple': '#51247A',
    }
  }
}
```

### Add More Data:
1. Update `uqu_demo_data.json`
2. Restart backend
3. Data automatically available in both panels

## 🐛 Troubleshooting

### CORS Issues:
Ensure backend has proper CORS setup:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'YOUR_DEPLOYED_URL']
}));
```

### Chat Not Working:
1. Check n8n workflow is active
2. Verify webhook URL is correct
3. Check DeepSeek API key

### PWA Not Installing:
- Must be served over HTTPS (except localhost)
- Check manifest.json is valid
- Clear browser cache

## 📈 Next Steps

1. **Add Authentication**: Implement student login
2. **Real Data**: Connect to actual UQU APIs
3. **Analytics**: Track usage patterns
4. **Push Notifications**: Event reminders
5. **Offline Sync**: Cache important data

## 🎯 Demo Tips

For your hackathon demo:
1. **Pre-load data**: Have the app running before demo
2. **Show both interfaces**: Demonstrate flexibility
3. **Mobile demo**: Use your phone to show PWA
4. **AI examples**: Prepare good chat queries
5. **Offline mode**: Show it works without internet

Good luck with your hackathon! 🚀