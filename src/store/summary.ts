import { Database } from "bun:sqlite"
import { AccountType, getAccountType } from "../model/account"
import type { Summary } from "../model/summary"

export function getSummary(
    store: Database, startDate: string, endDate: string
): Summary[] {
    const sql = `
SELECT
    id AS accountId,
    name,
    debitSum AS debit,
    creditSum AS credit,
    IFNULL(debitSum, 0) - IFNULL(creditSum, 0) AS sum
FROM Account
LEFT JOIN (
    SELECT debitAccount, SUM(debitValue) AS debitSum
    FROM \`Transaction\`
    WHERE "date" BETWEEN $startDate AND $endDate
    GROUP BY debitAccount
) ON Account.id = debitAccount
LEFT JOIN (
    SELECT creditAccount, SUM(creditValue) AS creditSum
    FROM \`Transaction\`
    WHERE "date" BETWEEN $startDate AND $endDate
    GROUP BY creditAccount
) ON Account.id = creditAccount
ORDER BY id
`

    const query = store.query<Summary, {
        startDate: string
        endDate: string
    }>(sql)

    const results = query.all({ startDate, endDate })

    return results
        .map(e => {
            if (e.sum === 0)
                return e
            const type = getAccountType(e.accountId)
            switch (type) {
                case AccountType.Liability:
                case AccountType.Equity:
                case AccountType.Income:
                    e.sum *= -1
                    break
                default:
                    break
            }
            return e
        })
}
