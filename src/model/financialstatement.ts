import type { Account } from "./account"

export const FinancialStatementType = {
    BalanceSheet: "BS",
    IncomeStatement: "IS",
} as const

export type FinancialStatementType = typeof FinancialStatementType[keyof typeof FinancialStatementType]

export type Entry = {
    account: Account
    value: number
}

export function financialStatementId(type: FinancialStatementType, endDate: string) {
    return type + "-" + endDate
}
