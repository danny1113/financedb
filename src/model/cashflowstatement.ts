import type { Entry } from "./financialstatement"

export type CashFlowStatement = {
    startDate: string
    endDate: string
    entries: Entry[]
}
