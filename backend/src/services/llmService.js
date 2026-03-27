import axios from 'axios'

const LLM_URL = process.env.LLM_BACKEND_URL || 'http://localhost:8000'

export const llmService = {
  /**
   * Call the Python FastAPI /orchestrate endpoint
   * Orchestrates the complaint through the LangGraph workflow
   */
  async orchestrateComplaint(complaintData) {
    try {
      const response = await axios.post(`${LLM_URL}/orchestrate`, {
        id: complaintData.id,
        title: complaintData.title,
        description: complaintData.description,
      }, {
        timeout: 30000, // 30 second timeout
      })
      
      console.log('✓ Orchestration successful')
      return response.data
    } catch (error) {
      console.error('✗ Orchestration failed:', error.message)
      throw error
    }
  },

  /**
   * Call the Python FastAPI /chat endpoint
   * Conversational AI for multi-turn complaint filing
   */
  async chat(messages, language = 'English') {
    try {
      const response = await axios.post(`${LLM_URL}/chat`, {
        messages,
        language,
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      // The response should be streaming or JSON with complaint data
      console.log('✓ Chat response received')
      return response.data
    } catch (error) {
      console.error('✗ Chat failed:', error.message)
      throw error
    }
  },

  /**
   * Health check for the LLM backend
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${LLM_URL}/`, {
        timeout: 5000,
      })
      return response.data
    } catch (error) {
      console.error('✗ LLM Backend unreachable:', error.message)
      return { status: 'offline' }
    }
  }
}
