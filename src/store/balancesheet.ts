import { Database } from "bun:sqlite"
import type { BalanceSheet } from "../model/balancesheet"
import { financialStatementId, FinancialStatementType, type Entry } from "../model/financialstatement"
import { Account, AccountType, getAccountType, type CurrentCash } from "../model/account"
import type { Summary } from "../model/summary"
import { insertNewFinancialStatement, updateFinancialStatementEntry } from "./finiancialstatement"

export function insertNewBalanceSheet(
    store: Database, summary: Summary[], date: string, prevDate: string
) {
    const prevBalanceSheet = getBalanceSheet(store, prevDate)
    const balanceSheet = summaryToBalanceSheet(summary, date)

    for (const curr of balanceSheet.entries) {
        for (const prev of prevBalanceSheet.entries) {
            if (curr.account === prev.account) {
                curr.value += prev.value
                break
            }
        }
    }

    // for (const prev of prevBalanceSheet.entries) {
    //     const entry = balanceSheet.entries
    //         .find(e => e.account === prev.account)
    //     if (entry) {
    //         entry.value += prev.value
    //     } else {
    //         console.log(prev);
    //         balanceSheet.entries.push(prev)
    //     }
    // }

    // const merge = <T>(a: T[], b: T[], predicate = (a: T, b: T) => a === b) => {
    //     const c = [...a]; // copy to avoid side effects
    //     // add all items from B to copy C if they're not already present
    //     b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
    //     return c
    // }
    // balanceSheet.entries = merge(
    //     balanceSheet.entries,
    //     prevBalanceSheet.entries,
    //     (a, b) => a.account == b.account)

    balanceSheet.entries = balanceSheet.entries
        .filter(e => e.value != 0)
        .sort((a, b) => a.account - b.account)

    const id = financialStatementId(FinancialStatementType.BalanceSheet, date)

    const transaction = store.transaction(() => {
        insertNewFinancialStatement(store, FinancialStatementType.BalanceSheet, date, date)
        updateFinancialStatementEntry(store, id, balanceSheet.entries)
    })
    transaction()
}

export function getBalanceSheet(
    store: Database, date: string
): BalanceSheet {
    const id = financialStatementId(FinancialStatementType.BalanceSheet, date)
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
            case AccountType.Asset:
            case AccountType.Liability:
            case AccountType.Equity:
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

export function summaryToBalanceSheet(
    summary: Summary[],
    date: string,
): BalanceSheet {
    const incomeStatement = summary
        .filter(e => {
            const type = getAccountType(e.accountId)
            return type === AccountType.Income || type === AccountType.Expense
        })

    let retainedEarnings = 0
    for (const entry of incomeStatement) {
        const type = getAccountType(entry.accountId)
        switch (type) {
            case AccountType.Income:
                retainedEarnings += entry.sum
                break
            case AccountType.Expense:
                retainedEarnings -= entry.sum
                break
            default:
                throw new Error("unknown account type")
        }
    }

    summary = summary
        .filter(e => {
            const type = getAccountType(e.accountId)
            return type !== AccountType.Income && type !== AccountType.Expense
        })

    let entries: Entry[] = summary
        .map(e => {
            return {
                account: e.accountId,
                value: e.sum
            }
        })

    for (const entry of entries) {
        if (entry.account === Account.RetainedEarnings) {
            entry.value = retainedEarnings
        }
    }

    let left = 0
    let right = 0

    for (const entry of entries) {
        const type = getAccountType(entry.account)
        switch (type) {
            case AccountType.Asset:
                left += entry.value
                break
            case AccountType.Liability:
            case AccountType.Equity:
                right += entry.value
                break
        }
    }

    if (left != right) {
        throw new Error("balance sheet is not balanced")
    }

    return {
        date,
        entries,
    }
}

export function checkDatabaseIntegrity(store: Database) {

}

export function checkBalanceSheetIsBalanced(store: Database): boolean {
    return false
}

export function checkCurrentCashValueIsCorrect(
    store: Database,
    date: string,
): boolean {
    const balanceSheet = getBalanceSheet(store, date)
    const cashTotal = balanceSheet.entries
        .filter(e => e.account == Account.Cash)
        .reduce((left, right) => left + right.value, 0)

    const currentCash = getCurrentCashValues(store)
        .filter(e => e.account == Account.Cash)
        .reduce((left, right) => left + right.value, 0)

    if (cashTotal !== currentCash) {
        return false
    }

    return true
}

export function getCurrentCashValues(store: Database): CurrentCash[] {
    const sql = `
SELECT
    accountId AS account,
    subAccountId AS subAccount,
    value
FROM CurrentCash
INNER JOIN SubAccount
    ON SubAccount.id = subAccountId
`
    const stmt = store.query<CurrentCash, []>(sql)
    const results = stmt.all()

    return results
}
