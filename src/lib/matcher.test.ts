import { describe, expect, it } from 'vitest'
import type { Guest } from '../data/guests'
import { displayName, normalize, searchGuests } from './matcher'

const guest = (
  firstName: string,
  lastName: string,
  aliases: string[] = [],
  table = 1,
): Guest => ({ firstName, lastName, aliases, table })

describe('normalize', () => {
  it('lowercases and trims', () => {
    expect(normalize('  Robert  ')).toBe('robert')
  })

  it('collapses internal whitespace', () => {
    expect(normalize('Robert   James    Smith')).toBe('robert james smith')
  })

  it('strips diacritics so "José" matches "jose"', () => {
    expect(normalize('José')).toBe('jose')
    expect(normalize('Zoë')).toBe('zoe')
    expect(normalize('François')).toBe('francois')
  })

  it('drops apostrophes, hyphens, and periods', () => {
    expect(normalize("O'Brien")).toBe('obrien')
    expect(normalize('O\u2019Brien')).toBe('obrien')
    expect(normalize('Jean-Luc')).toBe('jeanluc')
    expect(normalize('J.R.')).toBe('jr')
  })

  it('returns an empty string for whitespace-only input', () => {
    expect(normalize('   ')).toBe('')
    expect(normalize('')).toBe('')
  })
})

describe('displayName', () => {
  it('joins first and last name with a space', () => {
    expect(displayName(guest('Robert', 'Smith'))).toBe('Robert Smith')
  })
})

describe('searchGuests', () => {
  const guests: Guest[] = [
    guest('Robert', 'Smith', ['Bob', 'Bobby'], 1),
    guest('Alexandra', 'Jones', ['Alex'], 1),
    guest('Maria', 'Garcia', [], 2),
    guest('James', 'Williams', ['Jim', 'Jimmy'], 2),
    guest('Daniel', "O'Brien", ['Dan'], 4),
  ]

  it('returns an empty array for a blank query', () => {
    expect(searchGuests('', guests)).toEqual([])
    expect(searchGuests('   ', guests)).toEqual([])
  })

  it('returns an empty array when nothing matches', () => {
    expect(searchGuests('zzzzz', guests)).toEqual([])
  })

  it('matches by first name (case-insensitive)', () => {
    const results = searchGuests('robert', guests)
    expect(results.map(displayName)).toContain('Robert Smith')
  })

  it('matches by last name', () => {
    const results = searchGuests('garcia', guests)
    expect(results.map(displayName)).toEqual(['Maria Garcia'])
  })

  it('matches "last first" order', () => {
    const results = searchGuests('smith robert', guests)
    expect(results.map(displayName)).toEqual(['Robert Smith'])
  })

  it('matches by alias combined with last name', () => {
    const results = searchGuests('bob smith', guests)
    expect(results.map(displayName)).toEqual(['Robert Smith'])
  })

  it('matches by a bare alias', () => {
    const results = searchGuests('jimmy', guests)
    expect(results.map(displayName)).toEqual(['James Williams'])
  })

  it("matches names with apostrophes ignored (O'Brien -> obrien)", () => {
    const results = searchGuests('obrien', guests)
    expect(results.map(displayName)).toEqual(["Daniel O'Brien"])
  })

  it('supports prefix matching', () => {
    const results = searchGuests('rob', guests)
    expect(results.map(displayName)).toContain('Robert Smith')
  })

  it('supports substring (non-prefix) matching', () => {
    const results = searchGuests('mith', guests)
    expect(results.map(displayName)).toEqual(['Robert Smith'])
  })

  it('ranks exact matches ahead of prefix and substring matches', () => {
    const list: Guest[] = [
      // "jonas prefix" -> query "jo" is a prefix (rank 1)
      guest('Jonas', 'Prefix', [], 1),
      // bare alias "jo" -> exact match for query "jo" (rank 0)
      guest('Robert', 'Exactalias', ['Jo'], 2),
      // "major jo" contains "jo" but doesn't start with it (rank 2)
      guest('Major', 'Jo', [], 3),
    ]
    const results = searchGuests('jo', list)
    expect(displayName(results[0])).toBe('Robert Exactalias')
  })

  it('breaks rank ties alphabetically by display name', () => {
    const list: Guest[] = [
      guest('Charlie', 'Zephyr', [], 1),
      guest('Charlie', 'Alpha', [], 2),
    ]
    const results = searchGuests('charlie', list)
    expect(results.map(displayName)).toEqual([
      'Charlie Alpha',
      'Charlie Zephyr',
    ])
  })

  it('limits results to a maximum of 4 suggestions', () => {
    const list: Guest[] = Array.from({ length: 10 }, (_, i) =>
      guest(`Sam${i}`, 'Common', [], i),
    )
    const results = searchGuests('common', list)
    expect(results).toHaveLength(4)
  })

  it('ignores empty aliases without throwing', () => {
    const list = [guest('Solo', 'Person', ['', '  '], 1)]
    expect(() => searchGuests('solo', list)).not.toThrow()
    expect(searchGuests('solo', list).map(displayName)).toEqual(['Solo Person'])
  })
})
