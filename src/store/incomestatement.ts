import { Database } from "bun:sqlite"
import { getSummary } from "./summary"
import { financialStatementId, FinancialStatementType, type Entry } from "../model/financialstatement"
import { insertNewFinancialStatement, updateFinancialStatementEntry } from "./finiancialstatement"
import type { IncomeStatement } from "../model/incomestatement"
import { AccountType, getAccountType } from "../model/account"

export function insertNewIncomeStatement(
    store: Database, startDate: string, endDate: string
) {
    const id = financialStatementId(FinancialStatementType.IncomeStatement, endDate)
    const entries = getSummary(store, startDate, endDate)
        .filter(e => {
            if (e.sum === 0) return false
            const type = getAccountType(e.accountId)
            return type === AccountType.Income || type === AccountType.Expense
        })
        .map(e => { return { account: e.accountId, value: e.sum } })

    const insertEntries = store.transaction(() => {
        insertNewFinancialStatement(store, FinancialStatementType.IncomeStatement, startDate, endDate)
        updateFinancialStatementEntry(store, id, entries)
    })
    insertEntries()
}

export function getIncomeStatement(
    store: Database, date: string
): IncomeStatement {
    const id = financialStatementId(FinancialStatementType.IncomeStatement, date)
    const sql = `
SELECT accountId AS account, value
FROM FinancialStatementEntry
WHERE financialStatementId = $id
`
    const stmt = store.query<Entry, { id: string }>(sql)
    let entries: Entry[] = []

    for (const item of stmt.iterate({ id })) {
        const type = getAccountType(item.account)
        switch (type) {
            case AccountType.Income:
            case AccountType.Expense:
                entries.push(item)
                break
            default:
                throw new Error("unknown account type")
        }
    }

    return {
        date,
        entries,
    }
}
