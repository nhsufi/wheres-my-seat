import { useState } from 'react'
import { SearchBox } from './components/SearchBox'
import { AllTables } from './components/AllTables'
import { QrCodeView } from './components/QrCodeView'
import { QrCodeButton } from './components/QrCodeButton'
import { WeddingWebsiteButton } from './components/WeddingWebsiteButton'

type View = 'search' | 'tables' | 'qr'

export const App = () => {
  const [view, setView] = useState<View>('search')

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Where's My Seat?</h1>
        <p className="app-subtitle">Welcome to Samha & Naveed's Wedding</p>
      </header>

      <main className="app-main">
        {view === 'search' && (
          <SearchBox onShowAllTables={() => setView('tables')} />
        )}
        {view === 'tables' && <AllTables onBack={() => setView('search')} />}
        {view === 'qr' && <QrCodeView onBack={() => setView('search')} />}
      </main>

      {view === 'search' && (
        <div className="fab-stack">
          <WeddingWebsiteButton />
          <QrCodeButton onClick={() => setView('qr')} />
        </div>
      )}
    </div>
  )
}
