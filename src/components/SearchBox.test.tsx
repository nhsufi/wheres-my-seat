import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Guest } from '../data/guests'
import { SearchBox } from './SearchBox'

// These tests use a fixed fixture guest list (instead of the real guest
// data in src/data/guests.json) so they stay stable regardless of changes
// to the actual guest list. The fixture includes "Robert Smith" (aliases
// Bob/Bobby, table 1) and "Daniel O'Brien" (table 4), among others.
const { fixtureGuests } = vi.hoisted(() => {
  const fixtureGuests: Guest[] = [
    {
      firstName: 'Robert',
      lastName: 'Smith',
      aliases: ['Bob', 'Bobby'],
      table: 1,
    },
    { firstName: 'Alexandra', lastName: 'Jones', aliases: ['Alex'], table: 1 },
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

const renderSearchBox = () => {
  const onShowAllTables = vi.fn()
  const utils = render(<SearchBox onShowAllTables={onShowAllTables} />)
  const input = screen.getByRole('combobox')
  return { onShowAllTables, input, ...utils }
}

describe('SearchBox', () => {
  it('renders the search input and "Show all tables" button', () => {
    renderSearchBox()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /show all tables/i }),
    ).toBeInTheDocument()
  })

  it('shows suggestions as the user types', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    await user.type(input, 'robert')

    const listbox = await screen.findByRole('listbox')
    expect(within(listbox).getByText('Robert Smith')).toBeInTheDocument()
  })

  it('selecting a suggestion shows the assigned table', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    await user.type(input, 'robert')
    await user.click(await screen.findByText('Robert Smith'))

    const result = screen.getByRole('status')
    expect(within(result).getByText('Robert Smith')).toBeInTheDocument()
    expect(within(result).getByText('Table 1')).toBeInTheDocument()
    // Dropdown collapses after selection.
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('finds guests by alias', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    await user.type(input, 'bobby')

    expect(await screen.findByText('Robert Smith')).toBeInTheDocument()
  })

  it('matches names with apostrophes when typed without one', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    await user.type(input, 'obrien')

    expect(await screen.findByText("Daniel O'Brien")).toBeInTheDocument()
  })

  it('shows a no-match message when nothing is found', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    await user.type(input, 'zzzzzzz')

    expect(
      await screen.findByText(/couldn't find that name/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('supports keyboard navigation and Enter to select', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    await user.type(input, 'j') // matches multiple guests (Jones, James, ...)
    await screen.findByRole('listbox')

    await user.keyboard('{ArrowDown}{Enter}')

    // The active (first) option gets selected and a result card appears.
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('closes the dropdown on Escape', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    await user.type(input, 'robert')
    await screen.findByRole('listbox')

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('calls onShowAllTables when the button is clicked', async () => {
    const user = userEvent.setup()
    const { onShowAllTables } = renderSearchBox()

    await user.click(screen.getByRole('button', { name: /show all tables/i }))

    expect(onShowAllTables).toHaveBeenCalledOnce()
  })

  it('marks the combobox as expanded only while suggestions show', async () => {
    const user = userEvent.setup()
    const { input } = renderSearchBox()

    expect(input).toHaveAttribute('aria-expanded', 'false')

    await user.type(input, 'robert')
    await screen.findByRole('listbox')

    expect(input).toHaveAttribute('aria-expanded', 'true')
  })
})
