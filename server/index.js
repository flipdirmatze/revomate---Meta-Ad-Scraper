import express from 'express'
import cors from 'cors'
import scrapeRoutes from './routes/scrape.js'
import analyzeRoutes from './routes/analyze.js'

const app = express()
const PORT = process.env.PORT || 3001

// Check if secrets are configured
const hasApifyToken = !!process.env.APIFY_TOKEN
const hasGeminiKey = !!process.env.GEMINI_API_KEY

if (!hasApifyToken || !hasGeminiKey) {
  console.log('\n⚠️  API Keys nicht konfiguriert!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  if (!hasApifyToken) console.log('❌ APIFY_TOKEN fehlt')
  if (!hasGeminiKey) console.log('❌ GEMINI_API_KEY fehlt')
  console.log('\n📋 So richtest du die Secrets ein:')
  console.log('1. Klicke auf 🔒 "Secrets" in der linken Sidebar')
  console.log('2. Füge APIFY_TOKEN und GEMINI_API_KEY hinzu')
  console.log('3. Starte die App neu (Run Button)\n')
}

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Routes
app.use('/api/scrape', scrapeRoutes)
app.use('/api/analyze', analyzeRoutes)

// Health check - includes secrets status for frontend (checks dynamically)
app.get('/api/health', (req, res) => {
  const apifyConfigured = !!process.env.APIFY_TOKEN
  const geminiConfigured = !!process.env.GEMINI_API_KEY

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    configured: {
      apify: apifyConfigured,
      gemini: geminiConfigured,
    },
    ready: apifyConfigured && geminiConfigured,
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
