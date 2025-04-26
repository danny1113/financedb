import { Database } from "bun:sqlite";
import { getTransactions, insertTransactions } from "./src/store/transaction";
import { Account, getAccountType } from "./src/model/account";
import { getSummary } from "./src/store/summary";
import { getIncomeStatement, insertNewIncomeStatement } from "./src/store/incomestatement";
import { checkCurrentCashValueIsCorrect, getBalanceSheet, insertNewBalanceSheet } from "./src/store/balancesheet";
import { parseTransactions } from "./src/csv/transaction";

const db = "db/finance.db"
const store = new Database(db, {
    // bind values without prefixes
    strict: true,
})
store.run("PRAGMA foreign_keys = ON")
store.run("DELETE FROM 'Transaction'")
store.run("DELETE FROM FinancialStatementEntry")
store.run("DELETE FROM FinancialStatement")

async function insertTransaction(filename: string, year: number, month: number) {
    const file = Bun.file("./transactions/" + filename)
    const transactions = parseTransactions(await file.text())

    const firstDay = new Date(year, month - 1, 1).toLocaleDateString('sv-SE')
    const lastDay = new Date(year, month, 0).toLocaleDateString('sv-SE')
    const prevDate = new Date(year, month - 1, 0).toLocaleDateString('sv-SE')
    // console.log(firstDay, lastDay, prevDate);

    insertTransactions(store, transactions)

    const summary = getSummary(store, firstDay, lastDay)
    // for (const e of summary) {
    //     console.log(e)
    // }
    insertNewIncomeStatement(store, firstDay, lastDay)
    insertNewBalanceSheet(store, summary, lastDay, prevDate)

    // get

    // const incomeStatement = getIncomeStatement(store, lastDay)

    const balanceSheet = getBalanceSheet(store, lastDay)
    console.log("--- Balance Sheet " + balanceSheet.date + "---");
    const assetTotal = balanceSheet.entries
        .filter(e => getAccountType(e.account) == 1)
        .reduce((left, right) => left + right.value, 0)

    console.log(balanceSheet.date, assetTotal);
}

async function insertOldHistory() {
    const years = [
        { year: 2025, months: [1, 2, 3, 4] },
    ]
    for (const { year, months } of years) {
        for (const month of months) {
            const monthString = (month < 10) ? "0" + month.toString() : month.toString()
            const filename = year.toString() + "-" + monthString + ".csv"
            await insertTransaction(filename, year, month)
        }
    }
}

function checkCurrentValue() {
    if (checkCurrentCashValueIsCorrect(store, "2025-04-30")) {
        console.log("balance sheet value match current cash value")
    }
}

await insertOldHistory()
checkCurrentValue()
