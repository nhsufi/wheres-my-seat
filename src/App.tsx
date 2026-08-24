import { useState } from 'react'
import { SearchBox } from './components/SearchBox'
import { AllTables } from './components/AllTables'

type View = 'search' | 'tables'

export const App = () => {
  const [view, setView] = useState<View>('search')

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Find Your Seat</h1>
        <p className="app-subtitle">Welcome to our wedding celebration</p>
      </header>

      <main className="app-main">
        {view === 'search' ? (
          <SearchBox onShowAllTables={() => setView('tables')} />
        ) : (
          <AllTables onBack={() => setView('search')} />
        )}
      </main>
    </div>
  )
}
