import { FileVideo, Image, Loader2 } from 'lucide-react'
import AdCard from './AdCard'

function AdResults({ ads, isLoading, onAnalyze }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg-card shadow-card p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-4" />
          <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
            Ads werden geladen...
          </h3>
          <p className="text-slate-600 max-w-md">
            Das Scraping kann je nach Anzahl der Ads etwas dauern. Bitte warten.
          </p>
        </div>
      </div>
    )
  }

  if (ads.length === 0) {
    return (
      <div className="bg-white rounded-lg-card shadow-card p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FileVideo className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
            Keine Ads gefunden
          </h3>
          <p className="text-slate-600 max-w-md">
            Gib eine Meta Ad Library URL ein und starte die Suche, um Werbeanzeigen zu finden.
          </p>
        </div>
      </div>
    )
  }

  const videoAds = ads.filter(ad => ad.videoUrl)
  const imageAds = ads.filter(ad => !ad.videoUrl)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="status-badge">
          <span className="font-semibold">{ads.length}</span>
          <span>Ads gefunden</span>
        </div>
        {videoAds.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FileVideo className="w-4 h-4" />
            <span>{videoAds.length} Video-Ads</span>
          </div>
        )}
        {imageAds.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Image className="w-4 h-4" />
            <span>{imageAds.length} Image-Ads</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad, index) => (
          <AdCard
            key={ad.id || index}
            ad={ad}
            onAnalyze={onAnalyze}
          />
        ))}
      </div>
    </div>
  )
}

export default AdResults
