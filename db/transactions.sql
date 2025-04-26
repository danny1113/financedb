SELECT
    date,
    debitAccount.name AS 'debit account',
    debitValue AS debit,
    CreditAccount.name AS 'credit account',
    creditValue AS credit,
    note
FROM "Transaction"
LEFT JOIN Account AS DebitAccount ON debitAccount = DebitAccount.id
LEFT JOIN Account AS CreditAccount ON creditAccount = CreditAccount.id
WHERE date >= "2025-04-01";
