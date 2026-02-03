import axios from 'axios'

const APIFY_API_BASE = 'https://api.apify.com/v2'
const ACTOR_ID = 'curious_coder~facebook-ads-library-scraper'

export async function runScraper(searchUrl, maxResults, apifyToken) {
  try {
    // Start the actor run
    const runResponse = await axios.post(
      `${APIFY_API_BASE}/acts/${ACTOR_ID}/runs`,
      {
        search_url: searchUrl,
        max_results: maxResults,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          token: apifyToken,
        },
      }
    )

    const runId = runResponse.data.data.id
    console.log(`Apify run started: ${runId}`)

    // Wait for the run to complete
    const result = await waitForRun(runId, apifyToken)
    return result

  } catch (error) {
    console.error('Apify scraper error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.error?.message || 'Scraping fehlgeschlagen')
  }
}

async function waitForRun(runId, apifyToken, maxWaitTime = 300000) {
  const startTime = Date.now()
  const pollInterval = 5000 // 5 seconds

  while (Date.now() - startTime < maxWaitTime) {
    const statusResponse = await axios.get(
      `${APIFY_API_BASE}/actor-runs/${runId}`,
      {
        params: { token: apifyToken },
      }
    )

    const run = statusResponse.data.data
    console.log(`Run status: ${run.status}`)

    if (run.status === 'SUCCEEDED') {
      // Fetch the dataset items
      const datasetId = run.defaultDatasetId
      const itemsResponse = await axios.get(
        `${APIFY_API_BASE}/datasets/${datasetId}/items`,
        {
          params: {
            token: apifyToken,
            format: 'json',
          },
        }
      )

      return normalizeAds(itemsResponse.data)
    }

    if (run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
      throw new Error(`Scraping ${run.status.toLowerCase()}`)
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }

  throw new Error('Scraping Timeout - bitte erneut versuchen')
}

function normalizeAds(rawAds) {
  return rawAds.map((ad, index) => ({
    id: ad.id || ad.adArchiveID || `ad-${index}`,
    advertiserName: ad.pageName || ad.advertiserName || ad.page_name || 'Unbekannt',
    adText: ad.bodyText || ad.ad_creative_bodies?.[0] || ad.body || '',
    description: ad.linkDescription || ad.description || '',
    imageUrl: extractImageUrl(ad),
    videoUrl: extractVideoUrl(ad),
    thumbnail: ad.snapshot?.resized_image_url || ad.thumbnailUrl || extractImageUrl(ad),
    isActive: ad.isActive !== false && ad.is_active !== false,
    adArchiveUrl: ad.adArchiveLink || ad.ad_archive_link || ad.url || null,
    startDate: ad.startDate || ad.start_date || null,
    endDate: ad.endDate || ad.end_date || null,
  }))
}

function extractImageUrl(ad) {
  // Try different possible image fields
  if (ad.snapshot?.resized_image_url) return ad.snapshot.resized_image_url
  if (ad.imageUrl) return ad.imageUrl
  if (ad.image_url) return ad.image_url
  if (ad.ad_creative_images?.[0]) return ad.ad_creative_images[0]
  if (ad.images?.[0]) return ad.images[0]
  return null
}

function extractVideoUrl(ad) {
  // Try different possible video fields
  if (ad.videoUrl) return ad.videoUrl
  if (ad.video_url) return ad.video_url
  if (ad.ad_creative_videos?.[0]) return ad.ad_creative_videos[0]
  if (ad.videos?.[0]?.video_url) return ad.videos[0].video_url
  if (ad.snapshot?.video_url) return ad.snapshot.video_url
  if (ad.snapshot?.videos?.[0]?.video_url) return ad.snapshot.videos[0].video_url

  // Check if it's a video type ad
  if (ad.ad_type === 'video' || ad.type === 'video') {
    // Sometimes video URL is in the body or needs to be extracted
    return ad.video || ad.videoSrc || null
  }

  return null
}

export default { runScraper }
