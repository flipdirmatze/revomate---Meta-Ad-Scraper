import { Router } from 'express'
import { runScraper } from '../services/apifyService.js'

const router = Router()

// POST /api/scrape - Start scraping
router.post('/', async (req, res) => {
  try {
    const { searchUrl, maxResults = 50 } = req.body
    const apifyToken = process.env.APIFY_TOKEN

    if (!searchUrl) {
      return res.status(400).json({
        success: false,
        error: 'searchUrl ist erforderlich',
      })
    }

    if (!apifyToken) {
      return res.status(400).json({
        success: false,
        error: 'APIFY_TOKEN nicht konfiguriert. Bitte in den Secrets hinzufügen.',
      })
    }

    console.log(`Starting scrape for: ${searchUrl}`)

    const ads = await runScraper(searchUrl, maxResults, apifyToken)

    console.log(`Scraping complete: ${ads.length} ads found`)

    res.json({
      success: true,
      ads,
      count: ads.length,
    })

  } catch (error) {
    console.error('Scrape route error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Scraping fehlgeschlagen',
    })
  }
})

export default router
