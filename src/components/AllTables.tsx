import { useMemo } from 'react'
import { guests, type Guest } from '../data/guests'

interface AllTablesProps {
  onBack: () => void
}

interface TableGroup {
  table: number
  guests: Guest[]
}

export const AllTables = ({ onBack }: AllTablesProps) => {
  const groups = useMemo<TableGroup[]>(() => {
    const byTable = new Map<number, Guest[]>()
    for (const guest of guests) {
      const arr = byTable.get(guest.table) ?? []
      arr.push(guest)
      byTable.set(guest.table, arr)
    }
    return [...byTable.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([table, list]) => ({
        table,
        guests: [...list].sort(
          (a, b) =>
            a.lastName.localeCompare(b.lastName) ||
            a.firstName.localeCompare(b.firstName),
        ),
      }))
  }, [])

  return (
    <div className="tables-view">
      <button type="button" className="btn-secondary" onClick={onBack}>
        &larr; Back to search
      </button>

      <div className="tables-grid">
        {groups.map((group) => (
          <section key={group.table} className="table-card">
            <h2 className="table-heading">Table {group.table}</h2>
            <ul className="table-guests">
              {group.guests.map((guest, i) => (
                <li key={`${guest.firstName}-${guest.lastName}-${i}`}>
                  {guest.firstName} {guest.lastName}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
