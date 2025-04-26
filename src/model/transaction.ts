import type { AccountItem } from "./account"

export type Transaction = {
    id: string
    date: string
    debit: AccountItem
    credit: AccountItem
    note: string | null
}
