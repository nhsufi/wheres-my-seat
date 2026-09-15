import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Guest } from '../data/guests'
import { AllTables } from './AllTables'

// These tests use a fixed fixture guest list (instead of the real guest
// data in src/data/guests.json) so they stay stable regardless of changes
// to the actual guest list.
const { fixtureGuests } = vi.hoisted(() => {
  const fixtureGuests: Guest[] = [
    {
      firstName: 'Robert',
      lastName: 'Smith',
      aliases: ['Bob', 'Bobby'],
      table: 1,
    },
    { firstName: 'Alexandra', lastName: 'Jones', aliases: ['Alex'], table: 1 },
    { firstName: 'Zoe', lastName: 'Smith', aliases: [], table: 1 },
    { firstName: 'Maria', lastName: 'Garcia', aliases: [], table: 2 },
    {
      firstName: 'James',
      lastName: 'Williams',
      aliases: ['Jim', 'Jimmy'],
      table: 2,
    },
    { firstName: 'Priya', lastName: 'Patel', aliases: [], table: 3 },
    { firstName: 'Mohammed', lastName: 'Khan', aliases: ['Mo'], table: 3 },
    { firstName: 'Sophie', lastName: 'Nguyen', aliases: [], table: 4 },
    { firstName: 'Daniel', lastName: "O'Brien", aliases: ['Dan'], table: 4 },
  ]
  return { fixtureGuests }
})

vi.mock('../data/guests', () => ({ guests: fixtureGuests }))

const guests = fixtureGuests

describe('AllTables', () => {
  it('renders a section for every distinct table', () => {
    render(<AllTables onBack={vi.fn()} />)

    const distinctTables = new Set(guests.map((g) => g.table))
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings).toHaveLength(distinctTables.size)
  })

  it('renders table headings in ascending numeric order', () => {
    render(<AllTables onBack={vi.fn()} />)

    const headingNumbers = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => Number(h.textContent?.replace(/\D/g, '')))

    const sorted = [...headingNumbers].sort((a, b) => a - b)
    expect(headingNumbers).toEqual(sorted)
  })

  it('lists every guest exactly once', () => {
    render(<AllTables onBack={vi.fn()} />)

    for (const g of guests) {
      expect(
        screen.getByText(`${g.firstName} ${g.lastName}`),
      ).toBeInTheDocument()
    }
  })

  it('sorts guests within a table alphabetically by last name, then first name', () => {
    render(<AllTables onBack={vi.fn()} />)

    const heading = screen.getByText('Table 1')
    const section = heading.closest('section') as HTMLElement
    const names = within(section)
      .getAllByRole('listitem')
      .map((li) => li.textContent ?? '')

    // Guests at table 1: Alexandra Jones, Robert Smith, Zoe Smith ->
    // sorted by last name, then first name.
    expect(names).toEqual(['Alexandra Jones', 'Robert Smith', 'Zoe Smith'])
  })

  it('calls onBack when the back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<AllTables onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: /back to search/i }))

    expect(onBack).toHaveBeenCalledOnce()
  })
})
