export const AccountType = {
    Asset: 1,
    Liability: 2,
    Equity: 3,
    Income: 4,
    Expense: 5,
} as const

export type AccountType = typeof AccountType[keyof typeof AccountType]

export const Account = {
    Cash: 1100,
    CashAtBank: 1103,
    CashInTransit: 1116,
    AccountReceivable: 1140,
    Stock: 1210,
    PrepaidExpenses: 1411,
    MachineAndEquipment: 1616,
    AccumulatedDepreciationMachineAndEquipment: 1618,

    AccountPayable: 2140,
    ExpensePayable: 2170,

    OwnersCapital: 3100,
    CapitalStock: 3110,
    RetainedEarnings: 3351,

    SalaryIncome: 4150,
    InterestIncome: 4510,
    OtherIncome: 4580,

    LivingExpense: 5100,
    RentExpense: 5200,
    DepreciationExpenseMachineAndEquipment: 5302,
    InsuranceExpense: 5410,
    PensionExpense: 5420,
    OtherExpense: 5500,
} as const

export function nameToAccount(name: string): Account | null {
    switch (name) {
        case "":
            return null
        case "現金":
        case "電子マネー":
            return Account.Cash
        case "銀行存款":
            return Account.CashAtBank
        case "在途存款":
            return Account.CashInTransit
        case "應收帳款":
            return Account.AccountReceivable
        case "商品存貨":
            return Account.Stock
        case "預付費用":
            return Account.PrepaidExpenses
        case "機器設備":
            return Account.MachineAndEquipment
        case "累積折舊-機器設備":
            return Account.AccumulatedDepreciationMachineAndEquipment

        case "應付帳款":
            return Account.AccountPayable
        case "應付費用":
            return Account.ExpensePayable

        case "業主資本":
            return Account.OwnersCapital
        case "股本":
            return Account.CapitalStock
        case "保留盈餘":
            return Account.RetainedEarnings

        case "薪資收入":
            return Account.SalaryIncome
        case "利息收入":
            return Account.InterestIncome
        case "其他收入":
            return Account.OtherIncome

        case "生活費":
            return Account.LivingExpense
        case "房租費用":
            return Account.RentExpense
        case "折舊費用-機器設備":
            return Account.DepreciationExpenseMachineAndEquipment
        case "保險費用":
            return Account.InsuranceExpense
        case "年金費用":
            return Account.PensionExpense
        case "其他支出":
            return Account.OtherExpense

        default:
            throw new Error("unknown account name: " + name)
    }
}

export function getAccountType(account: Account): AccountType {
    const firstDigit = Math.floor(account / 1000)
    if (firstDigit > 0 && firstDigit <= 5) {
        return firstDigit as AccountType
    } else {
        throw new Error("unknown account type")
    }
}

export type Account = typeof Account[keyof typeof Account]

export const SubAccount = {
    Cash: 110001,
    PASMO: 110002,
    Suica: 110003,
    MobileSuica: 110004,
    ANAPay: 110005,
    PayPay: 110006,

    JPPostBank: 110301,
    SinoPacBank: 110302,

    TravelExpense: 510001,
    FoodExpense: 510002,
    DailyExpense: 510003,
    HealthExpense: 510004,
    EntertainmentExpense: 510005,
    PrivateExpense: 510006,
    FeeExpense: 510007,
    OtherExpense: 510008,
} as const

export type SubAccount = typeof SubAccount[keyof typeof SubAccount]

export type AccountItem = {
    account: Account | null
    subAccount: SubAccount | null
    value: number
}

export type CurrentCash = {
    account: Account
    subAccount: SubAccount
    value: number 
}
