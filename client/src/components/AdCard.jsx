import { Play, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react'

function AdCard({ ad, onAnalyze }) {
  const hasVideo = !!ad.videoUrl
  const thumbnail = ad.thumbnail || ad.imageUrl

  return (
    <div className="bg-white rounded-card shadow-card card-hover overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={ad.advertiserName || 'Ad thumbnail'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {hasVideo ? (
              <Play className="w-12 h-12 text-slate-300" />
            ) : (
              <ImageIcon className="w-12 h-12 text-slate-300" />
            )}
          </div>
        )}

        {/* Video Badge */}
        {hasVideo && (
          <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Play className="w-3 h-3" />
            Video
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full ${
          ad.isActive
            ? 'bg-accent-emerald/20 text-accent-emerald'
            : 'bg-slate-200 text-slate-600'
        }`}>
          {ad.isActive ? 'Aktiv' : 'Inaktiv'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Advertiser */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 text-sm font-medium">
            {ad.advertiserName?.charAt(0) || '?'}
          </div>
          <span className="text-sm font-medium text-slate-900 truncate">
            {ad.advertiserName || 'Unbekannt'}
          </span>
        </div>

        {/* Ad Text */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4">
          {ad.adText || ad.description || 'Kein Text verfügbar'}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {hasVideo && (
            <button
              onClick={() => onAnalyze(ad)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium py-2.5 px-4 rounded-btn hover:bg-slate-800 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Analysieren
            </button>
          )}

          {ad.adArchiveUrl && (
            <a
              href={ad.adArchiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-btn border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors ${
                hasVideo ? '' : 'flex-1'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              {hasVideo ? '' : 'Öffnen'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdCard
