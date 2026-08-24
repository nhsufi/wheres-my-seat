import guestsData from './guests.json'

export interface Guest {
  firstName: string
  lastName: string
  aliases: string[]
  table: number
}

export const guests: Guest[] = guestsData as Guest[]
