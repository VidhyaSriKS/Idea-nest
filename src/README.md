# 🪶 IdeaNest - AI-Powered Startup Idea Evaluator

Turn your raw startup idea into an investor-ready report — instantly.

## 🎯 Overview

IdeaNest is a platform that helps students and early founders evaluate, refine, and understand their startup ideas like a VC would. It uses the Google Gemini API to analyze ideas and generate comprehensive VC-style evaluation reports.

## ✨ Features

- **AI-Powered Evaluation**: Uses Google Gemini to analyze startup ideas
- **VC-Style Reports**: Comprehensive analysis including:
  - Problem Statement & Proposed Solution
  - Market Potential & Business Model
  - SWOT Analysis
  - Pros, Cons, and Improvements
  - Innovation, Feasibility, and Scalability Scores
  - Radar Chart Visualization
  - 100-Word Pitch Summary
  - Competitor Overview
  - Market Strategy
  - Idea Refinements

- **Stunning UI**: Modern glassmorphism design with:
  - Neon gradient accents
  - Smooth animations (Framer Motion)
  - Scroll-reveal cards
  - Confetti celebration
  - Dark theme by default

- **PDF Export**: Download full evaluation reports
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Tech Stack

- **Frontend**: React, Tailwind CSS, Motion (Framer Motion)
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **AI Engine**: Google Gemini 1.5 Flash
- **Charts**: Recharts
- **PDF Export**: jsPDF
- **Notifications**: Sonner

## 🔧 Setup

### Environment Variables

The application requires the following environment variable:

- `GEMINI_API_KEY`: Your Google Gemini API key

**Note**: The GEMINI_API_KEY has already been configured in the Supabase environment. If you need to update it or use a different key, you can do so through the Supabase dashboard.

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. The key has already been added to your Supabase environment

## 🎨 Design System

### Color Palette
- **Background**: `#0f172a` (dark indigo/navy)
- **Primary Accent**: `#38bdf8` (sky blue)
- **Secondary Accent**: `#a855f7` (violet)
- **Text**: `#f8fafc` (off-white)
- **Cards**: `rgba(255,255,255,0.05)` with backdrop blur

### Typography
- **Headings**: Poppins (Bold/SemiBold)
- **Body**: Manrope (Regular/Medium)

## 📝 How It Works

1. **Enter Your Idea**: Describe your startup concept (minimum 150 characters)
2. **AI Evaluates**: Gemini API analyzes your idea like a VC
3. **Get Full Report**: Receive comprehensive evaluation with scores and insights

## 🔒 Security

- API keys are stored securely in Supabase environment variables
- Never exposed to the client
- All API calls are proxied through secure backend endpoints

## 🎉 Features

- Animated hero section
- Real-time form validation
- Loading animations during evaluation
- Scroll-reveal cards in report
- Interactive radar chart for scores
- PDF export functionality
- Toast notifications
- Confetti celebration on report completion

## 📄 License

Built for hackathons and educational purposes.

---

**Powered by Google Gemini** | **Built in 48 hours @ Hackathon** 🚀
