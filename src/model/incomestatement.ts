import type { Entry } from "./financialstatement"

export type IncomeStatement = {
    date: string
    entries: Entry[]
}
