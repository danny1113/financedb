import type { Account } from "./account"

export const FinancialStatementType = {
    BalanceSheet: "BS",
    IncomeStatement: "IS",
    CashFlowStatement: "CF",
} as const

export type FinancialStatementType = typeof FinancialStatementType[keyof typeof FinancialStatementType]

export type FinancialStatement = {
    id: string
    type: FinancialStatementType
    startDate: string
    endDate: string
}

export type Entry = {
    account: Account
    value: number
}

export function financialStatementId(
    type: FinancialStatementType,
    endDate: string,
): string {
    return type + "-" + endDate
}
