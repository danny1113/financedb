import { Database } from "bun:sqlite"
import { financialStatementId, FinancialStatementType, type Entry } from "../model/financialstatement"

export function insertNewFinancialStatement(
    store: Database,
    type: FinancialStatementType,
    startDate: string,
    endDate: string,
) {
    const id = financialStatementId(type, endDate)

    const sql = `
INSERT OR REPLACE INTO FinancialStatement
VALUES ($id, $type, $startDate, $endDate)
`
    const stmt = store.prepare(sql)
    const insertEntries = store.transaction(values => {
        stmt.run(values)
    })
    insertEntries({
        id,
        type,
        startDate,
        endDate,
    })
}

export function updateFinancialStatementEntry(
    store: Database, id: string, entries: Entry[]
) {
    const sql = `
INSERT OR REPLACE INTO FinancialStatementEntry
VALUES ($id, $account, $value)
`
    const insertEntry = store.prepare(sql)

    const insertEntries = store.transaction(entries => {
        for (const element of entries) {
            const { account, value } = element
            insertEntry.run({
                id,
                account,
                value,
            })
        }
    })
    insertEntries(entries)
}
