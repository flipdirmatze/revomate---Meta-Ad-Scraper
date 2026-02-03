import { Key, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'

function SetupHint({ configStatus }) {
  const { apify, gemini } = configStatus || {}

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <Key className="w-8 h-8 text-slate-900" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-slate-900 mb-2">
          API Keys einrichten
        </h2>
        <p className="text-slate-600">
          Richte deine API Keys in den Replit Secrets ein, um loszulegen.
        </p>
      </div>

      <div className="bg-white rounded-lg-card shadow-card p-8 space-y-6">
        {/* Status */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-slate-900">Status</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            {apify ? (
              <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-slate-700">APIFY_TOKEN</span>
            <span className={`ml-auto text-sm ${apify ? 'text-accent-emerald' : 'text-red-500'}`}>
              {apify ? 'Konfiguriert' : 'Fehlt'}
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            {gemini ? (
              <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-slate-700">GEMINI_API_KEY</span>
            <span className={`ml-auto text-sm ${gemini ? 'text-accent-emerald' : 'text-red-500'}`}>
              {gemini ? 'Konfiguriert' : 'Fehlt'}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-heading font-bold text-slate-900">So richtest du die Secrets ein:</h3>

          <ol className="space-y-4 text-slate-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <span>Klicke links in der Sidebar auf das <strong>Schloss-Symbol (Secrets)</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <div>
                <span>Erstelle einen <strong>APIFY_TOKEN</strong></span>
                <a
                  href="https://console.apify.com/account/integrations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent-blue hover:underline mt-1 text-sm"
                >
                  Token hier holen <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <div>
                <span>Erstelle einen <strong>GEMINI_API_KEY</strong></span>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent-blue hover:underline mt-1 text-sm"
                >
                  API Key hier holen <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <span>Klicke oben auf den <strong>Run-Button</strong>, um die App neu zu starten</span>
            </li>
          </ol>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full btn-revomate"
        >
          Seite neu laden
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Deine API Keys werden sicher in deinen Replit Secrets gespeichert und niemals geteilt.
      </p>
    </div>
  )
}

export default SetupHint
