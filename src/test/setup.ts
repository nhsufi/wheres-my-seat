import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees and clear jsdom between tests to keep them isolated.
afterEach(() => {
  cleanup()
})
