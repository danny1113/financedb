import { parse } from "csv-parse/sync"
import type { Transaction } from "../model/transaction";
import { nameToAccount, type AccountItem } from "../model/account";
import { ulid } from "ulid";

export function parseTransactions(
    csv: Buffer | string
): Transaction[] {
    const records = parse(csv, {
        delimiter: "\t",
        skip_empty_lines: true,
    })

    let transactions: Transaction[] = []

    for (const record of records) {
        switch (record.length) {
            case 6:
                const t = parseTransactionRow(record)
                transactions.push(t)
                break
            default:
                throw new Error("wrong column count")
        }
    }

    return transactions
}

function parseTransactionRow(record: string[]): Transaction {
    const id = ulid()
    const date = formatDate(record[0]!)
    if (!date) {
        throw new Error("bad date format")
    }

    const debit: AccountItem = {
        account: nameToAccount(record[1]!),
        subAccount: null,
        value: parseMoney(record[2]!),
    }

    const credit: AccountItem = {
        account: nameToAccount(record[3]!),
        subAccount: null,
        value: parseMoney(record[4]!),
    }

    const note = record[5] ?? null

    return {
        id,
        date,
        debit,
        credit,
        note,
    }
}

function formatDate(date: string): string | null {
    const year = new Date().getFullYear()
    const component = date.split("/")
    let [month, day] = component
    if (month && day) {
        if (month.length == 1) {
            month = "0" + month
        }
        if (day.length == 1) {
            day = "0" + day
        }
        return year.toString() + "-" + month + "-" + day
    } else {
        return null
    }
}

function parseMoney(money: string): number {
    if (money == "") {
        return 0
    }
    money = money
        .replace("¥", "")
        .replaceAll(",", "")
    return parseFloat(money)
}
