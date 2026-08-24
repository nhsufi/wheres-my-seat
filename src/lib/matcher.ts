import type { Guest } from '../data/guests'

/**
 * Normalize a string for comparison: lowercase, trimmed, whitespace collapsed,
 * diacritics removed (so "José" matches "jose"), and apostrophes/hyphens/periods
 * dropped (so "obrien" matches "O'Brien").
 */
export const normalize = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/['\u2019.-]/g, '')
    .trim()
    .replace(/\s+/g, ' ')

/** Build the set of normalized strings a guest can be matched against. */
const searchKeys = (guest: Guest): string[] => {
  const first = normalize(guest.firstName)
  const last = normalize(guest.lastName)
  const keys = [`${first} ${last}`, `${last} ${first}`]
  for (const alias of guest.aliases) {
    const a = normalize(alias)
    if (a) keys.push(`${a} ${last}`, a)
  }
  return keys
}

/** Precomputed keys so we don't re-normalize every guest on each keystroke. */
const guestKeys = new WeakMap<Guest, string[]>()

const keysFor = (guest: Guest): string[] => {
  let keys = guestKeys.get(guest)
  if (!keys) {
    keys = searchKeys(guest)
    guestKeys.set(guest, keys)
  }
  return keys
}

export const displayName = (guest: Guest): string =>
  `${guest.firstName} ${guest.lastName}`

const MAX_SUGGESTIONS = 4

/**
 * Return guests whose name (or alias) contains the query, ranked so that
 * prefix matches come first, then other substring matches, then alphabetical.
 */
export const searchGuests = (query: string, list: Guest[]): Guest[] => {
  const q = normalize(query)
  if (!q) return []

  const scored: { guest: Guest; rank: number }[] = []
  for (const guest of list) {
    const keys = keysFor(guest)
    let rank = Infinity
    for (const key of keys) {
      if (key === q) rank = Math.min(rank, 0)
      else if (key.startsWith(q)) rank = Math.min(rank, 1)
      else if (key.includes(q)) rank = Math.min(rank, 2)
    }
    if (rank !== Infinity) scored.push({ guest, rank })
  }

  scored.sort(
    (a, b) =>
      a.rank - b.rank ||
      displayName(a.guest).localeCompare(displayName(b.guest)),
  )

  return scored.slice(0, MAX_SUGGESTIONS).map((s) => s.guest)
}
