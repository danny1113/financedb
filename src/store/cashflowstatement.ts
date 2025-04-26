import { Database } from "bun:sqlite"
import type { CashFlowStatement } from "../model/cashflowstatement"
import { financialStatementId, FinancialStatementType, type Entry } from "../model/financialstatement"
import { insertNewFinancialStatement, updateFinancialStatementEntry } from "./finiancialstatement"

export function makeCashFlowStatement(
    store: Database,
    startDate: string,
    endDate: string,
): CashFlowStatement {
    const sql = `
SELECT
    account,
    SUM(value) AS value
FROM (
    SELECT
        "Transaction".id,
        creditAccount AS account,
        debitValue AS value,
        note
    FROM "Transaction"
    WHERE date BETWEEN $startDate AND $endDate
        AND debitAccount <= 1103

    UNION

    SELECT
        "Transaction".id,
        debitAccount AS account,
        -creditValue AS value,
        note
    FROM "Transaction"
    WHERE date BETWEEN $startDate AND $endDate
        AND creditAccount <= 1103
)
GROUP BY account
`
    const stmt = store.query<Entry, {
        startDate: string,
        endDate: string,
    }>(sql)
    const entries = stmt.all({ startDate, endDate })

    return {
        startDate,
        endDate,
        entries,
    }
}

export function insertCashFlowStatement(
    store: Database,
    cashFlow: CashFlowStatement,
) {
    const id = financialStatementId(FinancialStatementType.CashFlowStatement, cashFlow.endDate)
    const transaction = store.transaction(() => {
        insertNewFinancialStatement(
            store,
            FinancialStatementType.CashFlowStatement,
            cashFlow.startDate,
            cashFlow.endDate,
        )

        updateFinancialStatementEntry(store, id, cashFlow.entries)
    })
    transaction()
}
