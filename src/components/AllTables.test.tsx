import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AllTables } from './AllTables'
import { guests } from '../data/guests'

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

  it('sorts guests within a table alphabetically by last name', () => {
    render(<AllTables onBack={vi.fn()} />)

    const heading = screen.getByText('Table 1')
    const section = heading.closest('section') as HTMLElement
    const names = within(section)
      .getAllByRole('listitem')
      .map((li) => li.textContent ?? '')

    // Guests at table 1 in the fixture: Robert Smith, Alexandra Jones ->
    // sorted by last name: Jones, Smith.
    expect(names).toEqual(['Alexandra Jones', 'Robert Smith'])
  })

  it('calls onBack when the back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<AllTables onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: /back to search/i }))

    expect(onBack).toHaveBeenCalledOnce()
  })
})
