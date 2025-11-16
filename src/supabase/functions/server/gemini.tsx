// IdeaNest Gemini API Integration
// Last updated: 2025-11-15T09:40:00Z - Using gemini-2.0-flash with v1beta API
// This file handles AI-powered startup idea evaluation

export async function evaluateIdea(ideaTitle: string, ideaDescription: string) {
  console.log('🤖 Calling Gemini API...');
  console.log('🔧 Using gemini-2.0-flash model with v1beta API');
  console.log('⏰ Server build time: 2025-11-15T09:40:00Z');
  
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY environment variable is not set');
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  console.log('✅ API Key found (length:', apiKey.length, ')');

  const prompt = `You are my ruthless mentor.don't sugercoat anything ,if my idea is weak call it thrash ,your job is to tet everything until i say it's bulletproof.You are a VC analyst. Evaluate this startup idea and provide a concise, actionable report.

Return ONLY valid JSON (no markdown) with this exact structure:

{
  "problemStatement": "2-3 sentences: What problem does this solve? Why does it matter?",
  "existingSolutions": "2-3 sentences: Current solutions and their gaps.",
  "proposedSolution": "2-3 sentences: How does this idea solve the problem better?",
  "marketPotential": "2-3 sentences: Market size (TAM/SAM/SOM), growth rate, and key trends.",
  "swotAnalysis": {
    "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3", "weakness 4"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4"],
    "threats": ["threat 1", "threat 2", "threat 3", "threat 4"]
  },
  "businessModel": "2-3 sentences: Revenue model, pricing, and path to profitability.",
  "prosConsImprovements": {
    "pros": ["pro 1", "pro 2", "pro 3", "pro 4"],
    "cons": ["con 1", "con 2", "con 3", "con 4"],
    "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4"]
  },
  "pitchSummary": "50-word elevator pitch",
  "scores": {
    "innovation": 8.5,
    "feasibility": 7.8,
    "scalability": 9.2
  },
  "refinedVersions": [
    {
      "title": "Version 1 Title",
      "description": "2-3 sentences describing this enhanced version",
      "whyItWorks": "1-2 sentences explaining advantages"
    },
    {
      "title": "Version 2 Title",
      "description": "2-3 sentences describing this enhanced version",
      "whyItWorks": "1-2 sentences explaining advantages"
    },
    {
      "title": "Version 3 Title",
      "description": "2-3 sentences describing this enhanced version",
      "whyItWorks": "1-2 sentences explaining advantages"
    }
  ],
  "competitors": [
    {
      "name": "Competitor 1",
      "description": "1-2 sentences about this competitor",
      "pricing": "Pricing model",
      "marketShare": "X%",
      "keyFeatures": ["feature 1", "feature 2", "feature 3"]
    },
    {
      "name": "Competitor 2",
      "description": "1-2 sentences about this competitor",
      "pricing": "Pricing model",
      "marketShare": "X%",
      "keyFeatures": ["feature 1", "feature 2", "feature 3"]
    },
    {
      "name": "Competitor 3",
      "description": "1-2 sentences about this competitor",
      "pricing": "Pricing model",
      "marketShare": "X%",
      "keyFeatures": ["feature 1", "feature 2", "feature 3"]
    }
  ],
  "marketStrategy": {
    "targetAudience": "2-3 sentences: Who are the customers and how to reach them?",
    "goToMarket": "2-3 sentences: Launch strategy and key milestones.",
    "revenueModel": "2-3 sentences: How to monetize and scale revenue."
  },
  "pitchDeck": {
    "problem": "2-3 sentences on the problem",
    "solution": "2-3 sentences on the solution",
    "marketSize": "2-3 sentences with TAM/SAM/SOM",
    "businessModel": "2-3 sentences on monetization",
    "traction": "2-3 sentences on validation/roadmap",
    "competition": "2-3 sentences on competitive advantage",
    "team": "2-3 sentences on why this team wins",
    "financials": "2-3 sentences on projections",
    "ask": "2-3 sentences on funding needs"
  }
}

Idea Title: ${ideaTitle}
Idea Description: ${ideaDescription}

Keep responses concise, data-driven, and actionable. Each section should be brief but insightful.`;

  console.log('📤 Sending request to Gemini API...');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 16384,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    console.log('📥 Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Received response from Gemini');
    console.log(' Full response data:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('❌ Invalid response structure from Gemini');
      console.error('Response data:', JSON.stringify(data, null, 2));
      
      // Check if there's a blockReason or other error info
      if (data.candidates?.[0]?.finishReason) {
        console.error('Finish reason:', data.candidates[0].finishReason);
      }
      if (data.promptFeedback) {
        console.error('Prompt feedback:', JSON.stringify(data.promptFeedback, null, 2));
      }
      
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('📝 Generated text length:', generatedText.length);
    console.log('📝 First 500 chars:', generatedText.substring(0, 500));
    console.log('📝 Last 200 chars:', generatedText.substring(generatedText.length - 200));
    
    // Extract JSON from the response (remove markdown code blocks if present)
    let jsonText = generatedText.trim();
    
    // Remove markdown code blocks - handle all variations
    if (jsonText.startsWith('```json')) {
      console.log('🔧 Removing ```json wrapper');
      jsonText = jsonText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '');
    } else if (jsonText.startsWith('```')) {
      console.log('🔧 Removing ``` wrapper');
      jsonText = jsonText.replace(/^```\s*/m, '').replace(/```\s*$/m, '');
    }
    
    // Remove any text before first { and after last }
    const jsonStart = jsonText.indexOf('{');
    const jsonEnd = jsonText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
      console.log('🔧 Extracted JSON from position', jsonStart, 'to', jsonEnd);
    } else {
      console.error('❌ No valid JSON object found in response');
      console.error('Full text:', generatedText);
      throw new Error('No valid JSON object found in AI response');
    }
    
    jsonText = jsonText.trim();
    console.log('📝 Cleaned JSON text length:', jsonText.length);
    console.log('📝 First 500 chars of cleaned:', jsonText.substring(0, 500));
    console.log('📝 Last 500 chars of cleaned:', jsonText.substring(Math.max(0, jsonText.length - 500)));
    
    // Function to sanitize JSON by fixing common issues
    function sanitizeJSON(jsonStr: string): string {
      let sanitized = jsonStr;
      
      console.log('🧹 Starting JSON sanitization');
      
      // Step 1: Replace invalid escape sequences that aren't valid JSON
      // \' is not valid in JSON, replace with just '
      sanitized = sanitized.replace(/\\'/g, "'");
      
      // Step 2: Fix double backslashes that might cause issues
      // But preserve ones that are intentionally escaped
      sanitized = sanitized.replace(/\\\\\\\\/g, '\\\\');
      
      // Step 3: Remove control characters (ASCII 0-31 except valid escapes)
      // Keep: \n, \r, \t, but remove actual control characters
      sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      // Step 4: Fix common escape issues - look for backslash followed by invalid char
      // Valid JSON escapes: \" \\ \/ \b \f \n \r \t \uXXXX
      // Replace any other backslash with double backslash
      sanitized = sanitized.replace(/\\(?!["\\\/bfnrtu])/g, '\\\\');
      
      console.log('🧹 Sanitization complete');
      return sanitized;
    }
    
    // Function to repair truncated JSON
    function repairJSON(jsonStr: string): string {
      let repaired = jsonStr.trim();
      
      // Count opening and closing brackets/braces
      const openBraces = (repaired.match(/{/g) || []).length;
      const closeBraces = (repaired.match(/}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;
      
      console.log('🔧 JSON repair - Open braces:', openBraces, 'Close braces:', closeBraces);
      console.log('🔧 JSON repair - Open brackets:', openBrackets, 'Close brackets:', closeBrackets);
      
      // Remove incomplete final value if the string doesn't end with }, ], or "
      if (!repaired.endsWith('}') && !repaired.endsWith(']') && !repaired.endsWith('"')) {
        console.log('🔧 Removing incomplete final value');
        // Find the last complete comma or opening bracket/brace
        const lastComma = repaired.lastIndexOf(',');
        const lastOpenBracket = repaired.lastIndexOf('[');
        const lastOpenBrace = repaired.lastIndexOf('{');
        const cutPoint = Math.max(lastComma, lastOpenBracket, lastOpenBrace);
        
        if (cutPoint > 0) {
          repaired = repaired.substring(0, cutPoint);
          // If we cut at a comma, remove it
          if (repaired.endsWith(',')) {
            repaired = repaired.substring(0, repaired.length - 1);
          }
        }
      }
      
      // Close any unclosed arrays
      const bracketDiff = openBrackets - closeBrackets;
      if (bracketDiff > 0) {
        console.log('🔧 Adding', bracketDiff, 'closing brackets');
        repaired += ']'.repeat(bracketDiff);
      }
      
      // Close any unclosed objects
      const braceDiff = openBraces - closeBraces;
      if (braceDiff > 0) {
        console.log('🔧 Adding', braceDiff, 'closing braces');
        repaired += '}'.repeat(braceDiff);
      }
      
      return repaired;
    }
    
    try {
      console.log('🔍 Parsing JSON...');
      let evaluation;
      
      try {
        evaluation = JSON.parse(jsonText);
      } catch (firstError) {
        console.warn('⚠️ First parse attempt failed, trying to sanitize JSON...');
        console.log('Parse error:', firstError.message);
        
        const sanitizedJSON = sanitizeJSON(jsonText);
        
        try {
          evaluation = JSON.parse(sanitizedJSON);
          console.log('✅ Successfully parsed sanitized JSON');
        } catch (secondError) {
          console.warn('⚠️ Second parse attempt failed, trying to repair JSON...');
          console.log('Parse error:', secondError.message);
          
          const repairedJSON = repairJSON(sanitizedJSON);
          console.log('🔧 Repaired JSON length:', repairedJSON.length);
          console.log('📝 Last 500 chars of repaired:', repairedJSON.substring(Math.max(0, repairedJSON.length - 500)));
          
          evaluation = JSON.parse(repairedJSON);
          console.log('✅ Successfully parsed repaired JSON');
        }
      }
      
      // Validate required fields
      const requiredFields = [
        'problemStatement', 
        'existingSolutions', 
        'proposedSolution', 
        'marketPotential',
        'swotAnalysis',
        'businessModel',
        'prosConsImprovements',
        'pitchSummary',
        'scores'
      ];
      
      const missingFields = [];
      for (const field of requiredFields) {
        if (!evaluation[field]) {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
        console.error('Available fields:', Object.keys(evaluation).join(', '));
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Validate scores are numbers between 0-100
      if (typeof evaluation.scores.innovation !== 'number' ||
          typeof evaluation.scores.feasibility !== 'number' ||
          typeof evaluation.scores.scalability !== 'number') {
        console.error('❌ Invalid scores format');
        console.error('Scores received:', evaluation.scores);
        throw new Error('Invalid scores format');
      }
      
      console.log('✅ Evaluation parsed and validated successfully');
      console.log('📊 Scores:', evaluation.scores);
      
      return evaluation;
      
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response as JSON');
      console.error('Parse error:', parseError.message);
      console.error('Parse error stack:', parseError.stack);
      console.error('JSON text length:', jsonText.length);
      console.error('JSON text (first 1000 chars):', jsonText.substring(0, 1000));
      console.error('JSON text (last 1000 chars):', jsonText.substring(Math.max(0, jsonText.length - 1000)));
      
      // Try to identify the specific issue
      if (parseError.message.includes('Unexpected token')) {
        const match = parseError.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const start = Math.max(0, position - 100);
          const end = Math.min(jsonText.length, position + 100);
          console.error(`Context around error position ${position}:`, jsonText.substring(start, end));
        }
      }
      
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
    
  } catch (fetchError) {
    console.error('❌ Fetch error:', fetchError);
    console.error('Fetch error name:', fetchError.name);
    console.error('Fetch error message:', fetchError.message);
    console.error('Fetch error stack:', fetchError.stack);
    throw fetchError;
  }
}