import { Router } from 'express'
import { analyzeVideo } from '../services/geminiService.js'

const router = Router()

// POST /api/analyze - Analyze video
router.post('/', async (req, res) => {
  try {
    const { videoUrl } = req.body
    const geminiKey = process.env.GEMINI_API_KEY

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        error: 'videoUrl ist erforderlich',
      })
    }

    if (!geminiKey) {
      return res.status(400).json({
        success: false,
        error: 'GEMINI_API_KEY nicht konfiguriert. Bitte in den Secrets hinzufügen.',
      })
    }

    console.log(`Starting video analysis for: ${videoUrl.substring(0, 50)}...`)

    const analysis = await analyzeVideo(videoUrl, geminiKey)

    console.log('Video analysis complete')

    res.json({
      success: true,
      analysis,
    })

  } catch (error) {
    console.error('Analyze route error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Analyse fehlgeschlagen',
    })
  }
})

export default router
