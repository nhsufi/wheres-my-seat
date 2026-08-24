import { useEffect, useMemo, useRef, useState } from 'react'
import { guests, type Guest } from '../data/guests'
import { displayName, searchGuests } from '../lib/matcher'

interface SearchBoxProps {
  onShowAllTables: () => void
}

export const SearchBox = ({ onShowAllTables }: SearchBoxProps) => {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Guest | null>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = useMemo(() => searchGuests(query, guests), [query])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const choose = (guest: Guest) => {
    setSelected(guest)
    setQuery(displayName(guest))
    setOpen(false)
    setActiveIndex(-1)
    // Dismiss the on-screen keyboard on mobile once a guest is selected.
    inputRef.current?.blur()
  }

  const onChange = (value: string) => {
    setQuery(value)
    setSelected(null)
    setOpen(true)
    setActiveIndex(-1)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && suggestions.length > 0) {
        e.preventDefault()
        const index = activeIndex >= 0 ? activeIndex : 0
        choose(suggestions[index])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const showDropdown = open && suggestions.length > 0

  return (
    <div className="search-view">
      <p className="lead">Start typing your name to find your table</p>

      <div className="search-box" ref={containerRef}>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Your name..."
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (query && !(selected && query === displayName(selected))) {
              setOpen(true)
            }
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="guest-listbox"
          aria-activedescendant={
            showDropdown && activeIndex >= 0
              ? `guest-option-${activeIndex}`
              : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
        />

        {showDropdown && (
          <ul className="suggestions" id="guest-listbox" role="listbox">
            {suggestions.map((guest, i) => (
              <li
                key={`${guest.firstName}-${guest.lastName}-${guest.table}`}
                id={`guest-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`suggestion${i === activeIndex ? ' active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(guest)
                }}
              >
                {displayName(guest)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="result-card" role="status">
          <span className="result-name">{displayName(selected)}</span>
          <span className="result-label">You're seated at</span>
          <span className="result-table">Table {selected.table}</span>
        </div>
      )}

      {query && !selected && suggestions.length === 0 && (
        <p className="no-match">
          We couldn't find that name. Try a different spelling, or check the
          full list below.
        </p>
      )}

      <button type="button" className="btn-secondary" onClick={onShowAllTables}>
        Show all tables
      </button>
    </div>
  )
}
