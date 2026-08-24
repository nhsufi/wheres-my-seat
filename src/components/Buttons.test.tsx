import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QrCodeButton } from './QrCodeButton'
import { QrCodeView } from './QrCodeView'
import { WeddingWebsiteButton } from './WeddingWebsiteButton'

describe('QrCodeButton', () => {
  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<QrCodeButton onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: /qr code/i }))

    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('QrCodeView', () => {
  it('renders the QR image and calls onBack', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<QrCodeView onBack={onBack} />)

    expect(screen.getByRole('img', { name: /qr code/i })).toHaveAttribute(
      'src',
      '/qr-code.svg',
    )

    await user.click(screen.getByRole('button', { name: /back to search/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})

describe('WeddingWebsiteButton', () => {
  it('links to the wedding website in a new tab, safely', () => {
    render(<WeddingWebsiteButton />)

    const link = screen.getByRole('link', { name: /wedding website/i })
    expect(link).toHaveAttribute(
      'href',
      'https://withjoy.com/naveed-and-samha/',
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})
