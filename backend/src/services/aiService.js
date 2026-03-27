import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

/**
 * Mapping of Delhi locations to wards and zones
 * Format: locationKeyword → { ward, zone }
 */
const LOCATION_TO_WARD_MAP = {
  // Central Zone (21 wards)
  'karol bagh': { ward: 'Ward 1', zone: 'Central', locality: 'Karol Bagh' },
  'mg road': { ward: 'Ward 2', zone: 'Central', locality: 'MG Road' },
  'patel nagar': { ward: 'Ward 3', zone: 'Central', locality: 'Patel Nagar' },
  'lajpat nagar': { ward: 'Ward 4', zone: 'Central', locality: 'Lajpat Nagar' },
  'hauz khas': { ward: 'Ward 5', zone: 'Central', locality: 'Hauz Khas' },
  'ina colony': { ward: 'Ward 6', zone: 'Central', locality: 'INA Colony' },
  'saket': { ward: 'Ward 7', zone: 'Central', locality: 'Saket' },
  'naraina': { ward: 'Ward 8', zone: 'Central', locality: 'Naraina' },
  'new york tower': { ward: 'Ward 9', zone: 'Central', locality: 'New York Tower' },
  'sector 21': { ward: 'Ward 10', zone: 'Central', locality: 'Sector 21' },
  
  // North West Zone (39 wards)
  'rohini': { ward: 'Ward 11', zone: 'North West', locality: 'Rohini' },
  'janakpuri': { ward: 'Ward 12', zone: 'North West', locality: 'Janakpuri' },
  'dwarka': { ward: 'Ward 13', zone: 'North West', locality: 'Dwarka' },
  
  // North Zone (17 wards)
  'model town': { ward: 'Ward 14', zone: 'North', locality: 'Model Town' },
  'civil lines': { ward: 'Ward 15', zone: 'North', locality: 'Civil Lines' },
  'kashmiri gate': { ward: 'Ward 16', zone: 'North', locality: 'Kashmiri Gate' },
  
  // East Zone (20 wards)
  'east delhi': { ward: 'Ward 17', zone: 'East', locality: 'East Delhi' },
  'karkarduma': { ward: 'Ward 18', zone: 'East', locality: 'Karkarduma' },
  
  // North East Zone (22 wards)
  'tri nagar': { ward: 'Ward 19', zone: 'North East', locality: 'Tri Nagar' },
  'ashok vihar': { ward: 'Ward 20', zone: 'North East', locality: 'Ashok Vihar' },
  
  // South Zone (19 wards)
  'south delhi': { ward: 'Ward 21', zone: 'South', locality: 'South Delhi' },
  
  // South West Zone (31 wards)
  'uttam nagar': { ward: 'Ward 22', zone: 'South West', locality: 'Uttam Nagar' },
  
  // New Delhi Zone (12 wards)
  'connaught place': { ward: 'Ward 23', zone: 'New Delhi', locality: 'Connaught Place' },
  'shakti nagar': { ward: 'Ward 24', zone: 'New Delhi', locality: 'Shakti Nagar' },
}

/**
 * Extract location from text and map to ward
 */
function mapLocationToWard(text) {
  if (!text) return { ward: 'General', zone: 'Central', locality: 'Unknown' }
  
  const lowerText = text.toLowerCase()
  
  // Check each location keyword
  for (const [keyword, wardInfo] of Object.entries(LOCATION_TO_WARD_MAP)) {
    if (lowerText.includes(keyword)) {
      return wardInfo
    }
  }
  
  // Default fallback
  return { ward: 'General', zone: 'Central', locality: 'Unknown' }
}

/**
 * Call Gemini API with prompt and get response
 */
async function callGemini(prompt) {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }, {
      timeout: 30000
    })

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    return text || 'Unable to process request'
  } catch (error) {
    // Log detailed error information for debugging
    if (error.response?.status === 400) {
      console.error('Gemini API 400 error. Details:', error.response?.data)
      console.warn('⚠️ Tip: Ensure GEMINI_API_KEY is valid. Get one free at: https://ai.google.dev/')
    }
    throw new Error('AI service unavailable: ' + error.message)
  }
}

/**
 * Chat with AI for conversational complaint refinement
 */
export async function chatWithAI(messages, language = 'ENGLISH') {
  const conversationHistory = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const prompt = `You are a helpful civic complaint assistant. You help citizens describe their issues clearly.

Language: ${language}

Previous conversation:
${conversationHistory}

Please provide a brief, helpful response (1-2 sentences) to help refine the complaint. Be friendly and encouraging.`

  try {
    const response = await callGemini(prompt)
    return response
  } catch (error) {
    console.warn('⚠️ Gemini API unavailable, using fallback response')
    // Fallback response based on last message
    const lastMessage = messages[messages.length - 1]?.content || ''
    const fallbacks = {
      'garbage': 'That sounds like a cleanliness issue. Could you describe the specific location and how long this has been happening?',
      'pothole': 'Road damage is a serious issue. Can you provide the exact location and describe the size of the pothole?',
      'water': 'Water-related issues are important. Is this about supply, drainage, or flooding? Please describe the location.',
      'electricity': 'Electrical issues need urgent attention. Is this power outage or illegal connections? Where exactly is this happening?',
      'default': 'Thank you for reporting this issue. Can you provide more details about the location and how it is affecting your area?'
    }
    
    const key = Object.keys(fallbacks).find(k => lastMessage.toLowerCase().includes(k)) || 'default'
    return fallbacks[key]
  }
  return {
    role: 'assistant',
    content: response
  }
}

/**
 * Orchestrate complaint - extract details and classify
 */
export async function orchestrateComplaint(title, description, language = 'ENGLISH') {
  const prompt = `You are an expert civic complaint classifier. Analyze this complaint and extract structured data.

Language: ${language}

Title: ${title}
Description: ${description}

Extract and return ONLY a JSON object (no markdown, no code blocks, just raw JSON) with:
{
  "extractedTitle": "Clear, concise title",
  "category": "One of: WATER, ELECTRICITY, ROADS, GARBAGE, POTHOLES, STREET_LIGHT, CORRUPTION, INFRASTRUCTURE, OTHER",
  "priority": "LOW, MEDIUM, HIGH, or CRITICAL",
  "urgency": "Number from 1-10",
  "department": "Best department: MCD, DJB, DERC, PWD_ENG, PARKS, TOWN_PLAN",
  "location": "Exact location/locality name mentioned in complaint (e.g., Karol Bagh, MG Road, Lajpat Nagar)",
  "sentiment": "COMPLAINT, APPRECIATION, NEUTRAL, or SUGGESTION",
  "sentimentScore": "0.0-1.0 confidence",
  "summary": "2-3 sentence summary of the issue"
}

Return ONLY the JSON, no extra text.`

  try {
    const response = await callGemini(prompt)
    
    // Extract JSON from response (handle markdown code blocks if present)
    let jsonStr = response
    if (response.includes('```json')) {
      jsonStr = response.split('```json')[1].split('```')[0]
    } else if (response.includes('```')) {
      jsonStr = response.split('```')[1].split('```')[0]
    }
    
    const data = JSON.parse(jsonStr.trim())
    
    // Map location to ward
    const locationStr = `${title} ${description} ${data.location || ''}`
    const wardInfo = mapLocationToWard(locationStr)
    
    return {
      extractedTitle: data.extractedTitle || title,
      category: data.category || 'OTHER',
      priority: data.priority || 'MEDIUM',
      urgency: parseInt(data.urgency) || 5,
      department: data.department || 'MCD',
      location: data.location || 'Unknown',
      ward: wardInfo.ward,
      zone: wardInfo.zone,
      locality: wardInfo.locality,
      sentiment: data.sentiment || 'COMPLAINT',
      sentimentScore: parseFloat(data.sentimentScore) || 0.5,
      summary: data.summary || description
    }
  } catch (error) {
    console.error('Orchestration error:', error.message)
    
    // Return sensible defaults if parsing fails
    const wardInfo = mapLocationToWard(`${title} ${description}`)
    return {
      extractedTitle: title,
      category: 'OTHER',
      priority: 'MEDIUM',
      urgency: 5,
      department: 'MCD',
      location: 'Unknown',
      ward: wardInfo.ward,
      zone: wardInfo.zone,
      locality: wardInfo.locality,
      sentiment: 'COMPLAINT',
      sentimentScore: 0.5,
      summary: description
    }
  }
}

/**
 * Generate smart suggestions for complaint improvement
 */
export async function suggestImprovements(title, description) {
  const prompt = `As a civic complaint advisor, suggest 2-3 brief improvements to make this complaint clearer and more actionable:

Title: ${title}
Description: ${description}

Return as simple bullet points without markdown formatting.`

  const response = await callGemini(prompt)
  return response
}

export default {
  chatWithAI,
  orchestrateComplaint,
  suggestImprovements,
  callGemini
}
