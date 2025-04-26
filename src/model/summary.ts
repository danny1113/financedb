import type { Account } from "./account"

export type Summary = {
    accountId: Account
    name: string
    debitSum: number
    creditSum: number
    sum: number
}
