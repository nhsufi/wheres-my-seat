import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

describe('App', () => {
  it('renders the title and starts on the search view', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /where's my seat/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('navigates to the all-tables view and back', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /show all tables/i }))
    expect(screen.getByText('Table 1')).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /back to search/i }))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('navigates to the QR code view and back', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /show qr code/i }))
    expect(screen.getByRole('img', { name: /qr code/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /back to search/i }))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('hides the floating action buttons when not on the search view', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(
      screen.getByRole('button', { name: /show qr code/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show all tables/i }))

    expect(
      screen.queryByRole('button', { name: /show qr code/i }),
    ).not.toBeInTheDocument()
  })
})
