// IdeaNest Hono Server
// Last updated: 2025-11-15T09:45:00Z - With history management
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { evaluateIdea } from "./gemini.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { saveEvaluation, getUserHistory, getEvaluation, deleteEvaluation } from "./history.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Health check endpoint
app.get("/make-server-1789c21d/health", (c) => {
  console.log('Health check called');
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Evaluate idea endpoint
app.post("/make-server-1789c21d/evaluate", async (c) => {
  console.log('=== EVALUATE ENDPOINT CALLED ===');
  console.log('⚡ Server version: 5.0 - Using gemini-1.5-flash with v1 API');
  
  try {
    const body = await c.req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { ideaTitle, ideaDescription, userId } = body;

    // Validation
    if (!ideaTitle || !ideaDescription) {
      console.error('Validation failed: Missing ideaTitle or ideaDescription');
      return c.json({ 
        success: false,
        error: "Missing ideaTitle or ideaDescription" 
      }, 400);
    }

    if (ideaDescription.length < 150) {
      console.error('Validation failed: Description too short', ideaDescription.length);
      return c.json({ 
        success: false,
        error: `Idea description must be at least 150 characters. Current: ${ideaDescription.length}` 
      }, 400);
    }

    console.log(`✅ Validation passed. Evaluating idea: "${ideaTitle}"`);
    console.log(`Description length: ${ideaDescription.length} characters`);
    
    // Call Gemini API
    const evaluation = await evaluateIdea(ideaTitle, ideaDescription);
    
    console.log('✅ Successfully evaluated idea:', ideaTitle);
    console.log('Evaluation scores:', evaluation.scores);
    
    // Save to history if userId provided
    let evaluationId = null;
    if (userId) {
      evaluationId = await saveEvaluation(userId, ideaTitle, ideaDescription, evaluation);
      console.log('✅ Saved to history with ID:', evaluationId);
    }
    
    return c.json({ 
      success: true, 
      data: evaluation,
      evaluationId 
    });
    
  } catch (error) {
    console.error('❌ ERROR in /evaluate endpoint:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Send detailed error back to frontend for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    return c.json({ 
      success: false,
      error: 'Failed to evaluate idea', 
      details: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get user history endpoint
app.get("/make-server-1789c21d/history/:userId", async (c) => {
  console.log('=== GET HISTORY ENDPOINT CALLED ===');
  
  try {
    const userId = c.req.param('userId');
    
    if (!userId) {
      return c.json({ 
        success: false,
        error: "Missing userId" 
      }, 400);
    }
    
    const history = await getUserHistory(userId);
    
    return c.json({ 
      success: true, 
      data: history 
    });
    
  } catch (error) {
    console.error('❌ ERROR in /history endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return c.json({ 
      success: false,
      error: 'Failed to retrieve history', 
      details: errorMessage
    }, 500);
  }
});

// Get specific evaluation endpoint
app.get("/make-server-1789c21d/evaluation/:id", async (c) => {
  console.log('=== GET EVALUATION ENDPOINT CALLED ===');
  
  try {
    const id = c.req.param('id');
    
    if (!id) {
      return c.json({ 
        success: false,
        error: "Missing evaluation ID" 
      }, 400);
    }
    
    const evaluation = await getEvaluation(id);
    
    if (!evaluation) {
      return c.json({ 
        success: false,
        error: 'Evaluation not found' 
      }, 404);
    }
    
    return c.json({ 
      success: true, 
      data: evaluation 
    });
    
  } catch (error) {
    console.error('❌ ERROR in /evaluation endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return c.json({ 
      success: false,
      error: 'Failed to retrieve evaluation', 
      details: errorMessage
    }, 500);
  }
});

// Delete evaluation endpoint
app.delete("/make-server-1789c21d/evaluation/:id", async (c) => {
  console.log('=== DELETE EVALUATION ENDPOINT CALLED ===');
  
  try {
    const id = c.req.param('id');
    
    if (!id) {
      return c.json({ 
        success: false,
        error: "Missing evaluation ID" 
      }, 400);
    }
    
    await deleteEvaluation(id);
    
    return c.json({ 
      success: true,
      message: 'Evaluation deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ ERROR in /delete evaluation endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return c.json({ 
      success: false,
      error: 'Failed to delete evaluation', 
      details: errorMessage
    }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-1789c21d/signup", async (c) => {
  console.log('=== SIGNUP ENDPOINT CALLED ===');
  
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      console.error('Validation failed: Missing email, password, or name');
      return c.json({ 
        success: false,
        error: "Missing email, password, or name" 
      }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ 
        success: false,
        error: error.message 
      }, 400);
    }

    console.log('✅ User created successfully:', email);
    
    return c.json({ 
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.name
        }
      }
    });
    
  } catch (error) {
    console.error('❌ ERROR in /signup endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return c.json({ 
      success: false,
      error: 'Failed to create user', 
      details: errorMessage
    }, 500);
  }
});

// Catch-all for 404
app.all('*', (c) => {
  console.log('404 - Route not found:', c.req.url);
  return c.json({ 
    error: 'Route not found',
    path: c.req.path,
    method: c.req.method
  }, 404);
});

console.log('🚀 IdeaNest server starting...');
Deno.serve(app.fetch);