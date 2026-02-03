import { useEffect } from 'react'
import { X, Loader2, Copy, Download, Zap, FileText, MessageSquare, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

function AnalysisModal({ ad, analysis, isAnalyzing, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} kopiert!`)
  }

  const downloadJSON = () => {
    const data = {
      ad: {
        advertiser: ad.advertiserName,
        videoUrl: ad.videoUrl,
      },
      analysis,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ad-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('JSON heruntergeladen!')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg-card shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h3 className="font-heading text-xl font-bold text-slate-900">
              Video-Analyse
            </h3>
            <p className="text-sm text-slate-600">
              {ad.advertiserName || 'Werbeanzeige'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-4" />
              <h4 className="font-heading text-lg font-bold text-slate-900 mb-2">
                Video wird analysiert...
              </h4>
              <p className="text-slate-600 text-center max-w-md">
                Gemini analysiert das Video. Das kann je nach Länge etwas dauern.
              </p>
            </div>
          ) : analysis?.error ? (
            <div className="bg-red-50 border border-red-200 rounded-card p-6 text-center">
              <p className="text-red-700">{analysis.error}</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Hook */}
              <AnalysisSection
                icon={<Zap className="w-5 h-5" />}
                title="Hook"
                description="Die ersten 5-10 Sekunden"
                content={analysis.hook}
                onCopy={() => copyToClipboard(analysis.hook, 'Hook')}
              />

              {/* Description */}
              <AnalysisSection
                icon={<FileText className="w-5 h-5" />}
                title="Beschreibung"
                description="Zusammenfassung der Werbeanzeige"
                content={analysis.description}
                onCopy={() => copyToClipboard(analysis.description, 'Beschreibung')}
              />

              {/* Transcript */}
              <AnalysisSection
                icon={<MessageSquare className="w-5 h-5" />}
                title="Transcript"
                description="Vollständige Transkription"
                content={formatTranscript(analysis.transcript)}
                onCopy={() => copyToClipboard(formatTranscript(analysis.transcript), 'Transcript')}
                isTranscript
              />
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {analysis && !analysis.error && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
            <button
              onClick={downloadJSON}
              className="btn-revomate-secondary flex items-center gap-2 py-3 px-4"
            >
              <Download className="w-4 h-4" />
              JSON exportieren
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AnalysisSection({ icon, title, description, content, onCopy, isTranscript }) {
  if (!content) return null

  return (
    <div className="bg-slate-50 rounded-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
            {icon}
          </div>
          <div>
            <h4 className="font-heading font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>
        <button
          onClick={onCopy}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
          title="Kopieren"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      <div className={`text-slate-700 ${isTranscript ? 'font-mono text-sm whitespace-pre-wrap' : ''}`}>
        {content}
      </div>
    </div>
  )
}

function formatTranscript(transcript) {
  if (!transcript) return ''
  if (typeof transcript === 'string') return transcript

  // If transcript is an array of objects with timestamp and text
  if (Array.isArray(transcript)) {
    return transcript
      .map(item => `[${item.timestamp}] ${item.text}`)
      .join('\n')
  }

  return JSON.stringify(transcript, null, 2)
}

export default AnalysisModal
