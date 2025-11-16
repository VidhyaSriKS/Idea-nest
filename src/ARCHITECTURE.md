# 🏗️ IdeaNest Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌─────────┐  ┌──────────┐  ┌──────────────┐               │
│  │  Hero   │  │   Form   │  │    Report    │               │
│  └─────────┘  └──────────┘  └──────────────┘               │
│       │             │                │                       │
│       └─────────────┴────────────────┘                       │
│                     │                                         │
│              App.tsx (State Management)                      │
└─────────────────────│───────────────────────────────────────┘
                      │
                      │ HTTPS POST /evaluate
                      │
┌─────────────────────▼───────────────────────────────────────┐
│           Backend (Supabase Edge Functions)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  index.tsx (Hono Web Server)                           │ │
│  │    - CORS enabled                                      │ │
│  │    - Error handling                                    │ │
│  │    - Request validation                                │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                          │
│  ┌────────────────▼───────────────────────────────────────┐ │
│  │  gemini.tsx (AI Integration)                           │ │
│  │    - Reads GEMINI_API_KEY from env                     │ │
│  │    - Constructs VC analyst prompt                      │ │
│  │    - Calls Gemini API                                  │ │
│  │    - Parses JSON response                              │ │
│  └────────────────┬───────────────────────────────────────┘ │
└───────────────────│──────────────────────────────────────────┘
                    │
                    │ HTTPS POST
                    │
┌───────────────────▼──────────────────────────────────────────┐
│            Google Gemini API                                  │
│  - Model: gemini-1.5-flash                                   │
│  - Temperature: 0.7                                          │
│  - Max Tokens: 8192                                          │
└──────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
/
├── App.tsx                          # Main application component
├── components/
│   ├── Hero.tsx                     # Landing page hero section
│   ├── HowItWorks.tsx              # 3-step workflow section
│   ├── IdeaForm.tsx                # Idea submission form
│   ├── EvaluationReport.tsx        # VC-style report display
│   ├── RadarChart.tsx              # Score visualization
│   ├── Footer.tsx                  # Footer with branding
│   ├── ErrorBoundary.tsx           # Error handling
│   └── ui/
│       ├── button.tsx              # Button component
│       ├── input.tsx               # Input component
│       ├── textarea.tsx            # Textarea component
│       ├── label.tsx               # Label component
│       ├── card.tsx                # Card component
│       └── sonner.tsx              # Toast notifications
├── styles/
│   └── globals.css                 # Global styles & theme
├── utils/
│   └── supabase/
│       └── info.tsx                # Supabase config
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx           # Main server file
│           ├── gemini.tsx          # Gemini API integration
│           └── kv_store.tsx        # Key-value storage (protected)
├── README.md                        # Project documentation
├── QUICKSTART.md                   # Quick start guide
├── ENV_SETUP.md                    # Environment setup
└── ARCHITECTURE.md                 # This file
```

## Component Architecture

### Frontend Components

#### 1. **App.tsx** (Main Controller)
- **State Management**:
  - `currentView`: 'home' | 'form' | 'report'
  - `isLoading`: boolean
  - `evaluationData`: EvaluationData | null
  - `ideaTitle`: string

- **Functions**:
  - `handleGetStarted()`: Navigate to form
  - `handleSubmitIdea()`: Submit to backend API
  - `handleBackToHome()`: Reset and return home

#### 2. **Hero.tsx**
- Animated landing section
- CTA buttons with glow effects
- Gradient background animations
- Props: `onGetStarted: () => void`

#### 3. **HowItWorks.tsx**
- 3-step workflow cards
- Scroll-triggered animations
- Icon-based visual design

#### 4. **IdeaForm.tsx**
- Form validation (min 150 chars)
- Character/word counter
- Loading state animations
- Props:
  - `onSubmit: (title: string, description: string) => void`
  - `isLoading: boolean`

#### 5. **EvaluationReport.tsx**
- Comprehensive report display
- Scroll-reveal sections
- Confetti celebration
- PDF export functionality
- Props:
  - `data: EvaluationData`
  - `ideaTitle: string`
  - `onBack: () => void`

#### 6. **RadarChart.tsx**
- Interactive score visualization
- Uses Recharts library
- Gradient fills
- Props: `scores: { innovation, feasibility, scalability }`

### Backend Architecture

#### 1. **index.tsx** (Hono Server)
```typescript
Routes:
- GET  /make-server-1789c21d/health
- POST /make-server-1789c21d/evaluate

Middleware:
- CORS (allow all origins)
- Logger (console.log)
- Error handling
```

#### 2. **gemini.tsx** (AI Integration)
```typescript
Function: evaluateIdea(title, description)

Process:
1. Validate GEMINI_API_KEY exists
2. Construct VC analyst prompt
3. Call Gemini API
4. Parse JSON response
5. Handle errors
6. Return structured data
```

## Data Flow

### Successful Evaluation Flow

```
1. User enters idea in form
   ↓
2. Form validates input (>150 chars)
   ↓
3. Frontend sends POST to /evaluate endpoint
   {
     ideaTitle: "...",
     ideaDescription: "..."
   }
   ↓
4. Backend validates request
   ↓
5. Backend calls Gemini API with VC prompt
   ↓
6. Gemini generates structured evaluation
   ↓
7. Backend parses JSON response
   ↓
8. Backend returns to frontend
   {
     success: true,
     data: { ... }
   }
   ↓
9. Frontend displays report
   ↓
10. Confetti celebration! 🎉
```

### Error Handling Flow

```
Error occurs at any step
   ↓
Backend catches error
   ↓
Returns error response
   {
     error: "Error message",
     details: "..."
   }
   ↓
Frontend displays toast notification
   ↓
User can retry
```

## API Integration

### Gemini API Request

```typescript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}

Headers:
  Content-Type: application/json

Body:
  {
    contents: [{
      parts: [{
        text: "VC analyst prompt..."
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192
    }
  }
```

### Gemini API Response

```typescript
{
  candidates: [{
    content: {
      parts: [{
        text: "{...JSON evaluation data...}"
      }]
    }
  }]
}
```

## Security Architecture

### Environment Variables
- Stored in Supabase Edge Functions environment
- Never exposed to frontend
- Accessed via `Deno.env.get()`

### API Security
- CORS enabled for frontend access
- Authorization header validated
- Input sanitization
- Error messages don't leak sensitive data

### Best Practices
✅ API keys on server only
✅ HTTPS for all requests
✅ Input validation
✅ Error logging
✅ Rate limiting (Gemini API side)

## Performance Optimization

### Frontend
- Code splitting by route/view
- Lazy loading of PDF library
- Optimized animations (GPU accelerated)
- Memoized components where needed

### Backend
- Efficient JSON parsing
- Proper error handling (no crashes)
- Logging for debugging
- Stateless design (scales horizontally)

### API
- Single API call per evaluation
- Reasonable token limits (8192)
- Caching possible for future enhancement

## Styling Architecture

### Tailwind CSS
- Custom theme colors in `globals.css`
- Utility-first approach
- Responsive design
- Dark theme default

### Custom Classes
```css
.glass-card       /* Glassmorphism effect */
.glow-button      /* Neon glow effect */
.gradient-text    /* Gradient text effect */
.gradient-border  /* Animated gradient border */
```

### Color System
```css
--background: #0f172a      /* Dark navy */
--primary: #38bdf8         /* Sky blue */
--secondary: #a855f7       /* Violet */
--foreground: #f8fafc      /* Off-white */
```

### Typography
```css
Headings: Poppins (Google Fonts)
Body: Manrope (Google Fonts)
```

## Animation Architecture

### Libraries
- **Motion (Framer Motion)**: All animations
- **canvas-confetti**: Celebration effect
- **Recharts**: Chart animations

### Animation Types
1. **Page Transitions**: Fade in/out
2. **Scroll Reveal**: Intersection Observer
3. **Hover Effects**: CSS transitions
4. **Loading States**: Keyframe animations
5. **Success Celebration**: Confetti

## State Management

### Current Approach
- React useState hooks
- Component-level state
- Props drilling for simple app

### Future Enhancements
- Context API for global state
- Zustand/Redux for complex state
- React Query for API caching

## Scalability Considerations

### Current Design
- ✅ Stateless backend (scales horizontally)
- ✅ Serverless architecture (auto-scaling)
- ✅ Efficient API usage
- ✅ Modular component structure

### Future Enhancements
- Add user authentication
- Save evaluations to database
- Add rate limiting per user
- Implement caching layer
- Add analytics tracking

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Animation | Motion | Smooth animations |
| Charts | Recharts | Data visualization |
| PDF Export | jsPDF | Report downloads |
| Backend | Supabase Edge Functions | Serverless API |
| Runtime | Deno | Server runtime |
| Web Framework | Hono | Lightweight web server |
| AI | Google Gemini | Idea evaluation |
| Notifications | Sonner | Toast messages |

---

**Built with modern best practices for scalability, security, and user experience** 🚀
