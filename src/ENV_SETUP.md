# Environment Setup Guide

## Current Configuration

Your IdeaNest application is already configured and ready to use! The Gemini API key has been set up in the Supabase environment.

## Environment Variables

The application uses the following environment variable on the **backend** (Supabase Edge Functions):

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## ✅ What's Already Done

1. ✅ Backend server created at `/supabase/functions/server/`
2. ✅ Gemini API integration configured
3. ✅ GEMINI_API_KEY environment variable set up in Supabase
4. ✅ Secure API endpoint: `POST /make-server-1789c21d/evaluate`
5. ✅ Frontend connected to backend
6. ✅ All UI components created

## 🔐 How It Works

### Backend (Secure)
- The server runs on Supabase Edge Functions (Deno runtime)
- Environment variables are stored securely in Supabase
- The `GEMINI_API_KEY` is **never** exposed to the frontend
- All Gemini API calls are made from the server

### API Flow
```
Frontend (React)
    ↓
    POST request to: https://{projectId}.supabase.co/functions/v1/make-server-1789c21d/evaluate
    ↓
Backend Server (Supabase Edge Function)
    ↓
    Reads GEMINI_API_KEY from environment
    ↓
    Calls Google Gemini API
    ↓
    Returns evaluation data to frontend
```

## 🚀 Testing the Application

1. Open the application in your browser
2. Click "Get Started" or "Evaluate Idea"
3. Enter your idea details:
   - **Title**: e.g., "AI-powered fitness coach for remote workers"
   - **Description**: Minimum 150 characters describing your idea
4. Click "Evaluate Now"
5. Wait for AI analysis (takes 5-15 seconds)
6. View your comprehensive VC-style evaluation report!

## 📋 API Endpoint Details

### Evaluate Idea Endpoint

**URL**: `POST /make-server-1789c21d/evaluate`

**Request Body**:
```json
{
  "ideaTitle": "Your Idea Title",
  "ideaDescription": "Detailed description of your startup idea (minimum 150 characters)"
}
```

**Success Response**:
```json
{
  "success": true,
  "data": {
    "problemStatement": "...",
    "existingSolutions": "...",
    "proposedSolution": "...",
    "marketPotential": "...",
    "swotAnalysis": { ... },
    "businessModel": "...",
    "prosConsImprovements": { ... },
    "pitchSummary": "...",
    "scores": {
      "innovation": 8,
      "feasibility": 7,
      "scalability": 9
    },
    "refinedVersions": [...],
    "competitors": [...],
    "marketStrategy": { ... }
  }
}
```

**Error Response**:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 🔍 Troubleshooting

### If you get an API error:

1. **Check Gemini API Key**: Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Check API Quota**: Ensure you haven't exceeded Gemini API rate limits
3. **Check Network**: Ensure your internet connection is stable
4. **Check Logs**: Look in the browser console for detailed error messages

### Common Issues:

- **"GEMINI_API_KEY environment variable is not set"**: The API key needs to be configured in Supabase
- **"Failed to parse AI response"**: Gemini returned an invalid format, try again
- **"Idea description must be at least 150 characters"**: Your description is too short

## 📊 Rate Limits

Google Gemini API (Free Tier):
- 60 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

For production use, consider upgrading to a paid tier.

## 🎯 Next Steps

Your application is **fully functional**! You can:

1. Test the evaluation feature
2. Customize the UI colors/styling
3. Add more features (user authentication, save ideas, etc.)
4. Deploy to production
5. Share with users!

---

**Note**: All sensitive configuration is managed securely through Supabase. Never commit API keys to version control!
