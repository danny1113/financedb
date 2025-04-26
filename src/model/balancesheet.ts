import type { Entry } from "./financialstatement"

export type BalanceSheet = {
    date: string
    entries: Entry[]
}
