import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'

const ANALYSIS_PROMPT = `Analysiere dieses Werbevideo und gib das Ergebnis als JSON zurück.

WICHTIG: Antworte NUR mit validem JSON, ohne Markdown-Formatierung oder Code-Blöcke.

Struktur:
{
  "hook": "Beschreibe den Hook (erste 5-10 Sekunden). Was ist der Aufmerksamkeits-Trigger? Welche Emotion oder welches Problem wird angesprochen?",
  "description": "Erstelle eine ausführliche Beschreibung der Werbeanzeige. Was wird beworben? Welche Hauptbotschaft wird vermittelt? Welcher Call-to-Action wird verwendet?",
  "transcript": [
    {"timestamp": "00:00", "text": "Gesprochener Text hier..."},
    {"timestamp": "00:05", "text": "Weiterer Text..."}
  ]
}

Falls kein Audio vorhanden ist, setze transcript auf: [{"timestamp": "00:00", "text": "Kein Audio/Text vorhanden"}]

Antworte auf Deutsch.`

export async function analyzeVideo(videoUrl, geminiKey) {
  const genAI = new GoogleGenerativeAI(geminiKey)

  try {
    // Download video to temp file
    console.log('Downloading video:', videoUrl)
    const videoPath = await downloadVideo(videoUrl)

    // Read video file
    const videoData = fs.readFileSync(videoPath)
    const base64Video = videoData.toString('base64')
    const mimeType = getMimeType(videoUrl)

    console.log('Video downloaded, size:', videoData.length, 'bytes')

    // Use Gemini 2.5 Pro for video analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-05-06' })

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Video,
        },
      },
      { text: ANALYSIS_PROMPT },
    ])

    // Clean up temp file
    fs.unlinkSync(videoPath)

    const responseText = result.response.text()
    console.log('Gemini response received')

    // Parse the JSON response
    const analysis = parseAnalysisResponse(responseText)
    return analysis

  } catch (error) {
    console.error('Gemini analysis error:', error)

    // Handle specific errors
    if (error.message?.includes('API key')) {
      throw new Error('Ungültiger Gemini API Key')
    }
    if (error.message?.includes('quota')) {
      throw new Error('API-Kontingent erschöpft')
    }
    if (error.message?.includes('video')) {
      throw new Error('Video konnte nicht verarbeitet werden')
    }

    throw new Error(error.message || 'Video-Analyse fehlgeschlagen')
  }
}

async function downloadVideo(url) {
  const tempDir = os.tmpdir()
  const fileName = `video-${Date.now()}.mp4`
  const filePath = path.join(tempDir, fileName)

  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
    timeout: 60000, // 60 second timeout
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  })

  const writer = fs.createWriteStream(filePath)

  return new Promise((resolve, reject) => {
    response.data.pipe(writer)
    writer.on('finish', () => resolve(filePath))
    writer.on('error', reject)
  })
}

function getMimeType(url) {
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0]

  const mimeTypes = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
  }

  return mimeTypes[ext] || 'video/mp4'
}

function parseAnalysisResponse(responseText) {
  // Remove any markdown code blocks if present
  let cleanText = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  try {
    return JSON.parse(cleanText)
  } catch {
    // If JSON parsing fails, try to extract the data manually
    console.log('JSON parse failed, attempting manual extraction')

    return {
      hook: extractSection(responseText, 'hook') || 'Hook konnte nicht extrahiert werden',
      description: extractSection(responseText, 'description') || extractSection(responseText, 'beschreibung') || 'Beschreibung konnte nicht extrahiert werden',
      transcript: extractSection(responseText, 'transcript') || [{ timestamp: '00:00', text: responseText }],
    }
  }
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`"${sectionName}"\\s*:\\s*"([^"]*)"`, 'i')
  const match = text.match(regex)
  return match ? match[1] : null
}

export default { analyzeVideo }
