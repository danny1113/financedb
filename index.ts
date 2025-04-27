import { Database } from "bun:sqlite";
import { getTransactions, insertTransactions } from "./src/store/transaction";
import { Account, getAccountType } from "./src/model/account";
import { getSummary } from "./src/store/summary";
import { getIncomeStatement, insertNewIncomeStatement } from "./src/store/incomestatement";
import { checkCurrentCashValueIsCorrect, getBalanceSheet, insertNewBalanceSheet } from "./src/store/balancesheet";
import { parseTransactions } from "./src/csv/transaction";
import { insertCashFlowStatement, makeCashFlowStatement } from "./src/store/cashflowstatement";

const db = "db/finance.db"
const store = new Database(db, {
    // bind values without prefixes
    strict: true,
})
store.run("PRAGMA foreign_keys = ON")

function deleteTables(store: Database) {
    const transaction = store.transaction(() => {
        store.run("DELETE FROM 'Transaction'")
        store.run("DELETE FROM FinancialStatementEntry")
        store.run("DELETE FROM FinancialStatement")
    })
    transaction()
}

async function insertTransactionHistory(
    store: Database,
    filename: string,
    year: number,
    month: number,
) {
    const file = Bun.file("./transactions/" + filename)
    const transactions = parseTransactions(await file.text())

    const firstDay = new Date(year, month - 1, 1).toLocaleDateString('sv-SE')
    const lastDay = new Date(year, month, 0).toLocaleDateString('sv-SE')
    const prevDate = new Date(year, month - 1, 0).toLocaleDateString('sv-SE')

    insertTransactions(store, transactions)

    const summary = getSummary(store, firstDay, lastDay)
    insertNewIncomeStatement(store, firstDay, lastDay)
    insertNewBalanceSheet(store, summary, lastDay, prevDate)

    const cashFlow = makeCashFlowStatement(store, firstDay, lastDay)
    insertCashFlowStatement(store, cashFlow)

    // get

    // const incomeStatement = getIncomeStatement(store, lastDay)

    const balanceSheet = getBalanceSheet(store, lastDay)
    console.log("--- Balance Sheet " + balanceSheet.date + "---")
    const assetTotal = balanceSheet.entries
        .filter(e => getAccountType(e.account) == 1)
        .reduce((left, right) => left + right.value, 0)

    console.log(balanceSheet.date, assetTotal)
}

async function insertOldHistory(store: Database) {
    const years = [
        { year: 2025, months: [1, 2, 3, 4] },
    ]
    for (const { year, months } of years) {
        for (const month of months) {
            const monthString = (month < 10) ? "0" + month.toString() : month.toString()
            const filename = year.toString() + "-" + monthString + ".csv"
            await insertTransactionHistory(store, filename, year, month)
        }
    }
}

function insertNewTransaction(store: Database) {
    const csv = `
4/27	生活費	交通費	¥500	現金	PASMO	¥500	電車
`
    const transactions = parseTransactions(csv)
    insertTransactions(store, transactions)

    const year = 2025, month = 4
    const firstDay = new Date(year, month - 1, 1).toLocaleDateString('sv-SE')
    const lastDay = new Date(year, month, 0).toLocaleDateString('sv-SE')
    const prevDate = new Date(year, month - 1, 0).toLocaleDateString('sv-SE')

    const summary = getSummary(store, firstDay, lastDay)
    insertNewIncomeStatement(store, firstDay, lastDay)
    insertNewBalanceSheet(store, summary, lastDay, prevDate)

    const cashFlow = makeCashFlowStatement(store, firstDay, lastDay)
    insertCashFlowStatement(store, cashFlow)
}

function checkCurrentValue(store: Database) {
    if (checkCurrentCashValueIsCorrect(store, "2025-04-30")) {
        console.log("balance sheet value match current cash value")
    }
}

function makeCashFlow(store: Database) {
    const cashFlow = makeCashFlowStatement(store, "2025-04-01", "2025-04-30")
    let total = 0
    for (const e of cashFlow.entries) {
        total += e.value
        console.log(e)
    }
    console.log(`total cash flow: ${total}`)
}

deleteTables(store)
await insertOldHistory(store)
checkCurrentValue(store)

store.run("PRAGMA wal_checkpoint(TRUNCATE)")
store.close()
