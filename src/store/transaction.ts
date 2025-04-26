import { Database } from "bun:sqlite"
import type { Transaction } from "../model/transaction"
import type { Account, SubAccount } from "../model/account"

export function getTransactions(
    store: Database, startDate: string, endDate: string
): Transaction[] {
    const sql = `
SELECT
    "Transaction".id,
    date,
    debitAccount,
    debitSubAccount,
    debitValue,
    creditAccount,
    creditSubAccount,
    creditValue,
    note
FROM "Transaction"
WHERE "date" BETWEEN $startDate AND $endDate`
    const query = store.query<{
        id: string
        date: string
        debitAccount: Account
        debitSubAccount: SubAccount | null
        debitValue: number
        creditAccount: Account
        creditSubAccount: SubAccount
        creditValue: number
        note: string | null
    }, {
        startDate: string
        endDate: string
    }>(sql)

    let transactions: Transaction[] = []

    for (const transaction of query.iterate({ startDate, endDate })) {
        const {
            id, date, note,
            debitAccount, debitSubAccount, debitValue,
            creditAccount, creditSubAccount, creditValue,
        } = transaction
        transactions.push({
            id,
            date,
            debit: {
                account: debitAccount,
                subAccount: debitSubAccount,
                value: debitValue
            },
            credit: {
                account: creditAccount,
                subAccount: creditSubAccount,
                value: creditValue,
            },
            note: note,
        })
    }

    return transactions
}

export function insertTransactions(store: Database, transactions: Transaction[]) {
    const sql = `
INSERT INTO "Transaction"
VALUES
($id, $date, $debitAccount, $debitSubAccount, $debitValue, $creditAccount, $creditSubAccount, $creditValue, $note)    
`

    const stmt = store.prepare(sql)

    const insertTransactions = store.transaction((transactions) => {
        for (const transaction of transactions) {
            const { id, date, debit, credit, note } = transaction
            stmt.run({
                id,
                date,
                debitAccount: debit.account,
                debitSubAccount: debit.subAccount,
                debitValue: debit.value,
                creditAccount: credit.account,
                creditSubAccount: credit.subAccount,
                creditValue: credit.value,
                note,
            })
        }
    })
    insertTransactions(transactions)
}
