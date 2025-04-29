SELECT
    date,
    DebitAccount.name AS debitAccount,
    debitValue AS debit,
    CreditAccount.name AS creditAccount,
    creditValue AS credit,
    note
FROM `Transaction`
LEFT JOIN Account AS DebitAccount ON debitAccount = DebitAccount.id
LEFT JOIN Account AS CreditAccount ON creditAccount = CreditAccount.id
WHERE `date` BETWEEN (
    SELECT `start` FROM Edition
) AND (
    SELECT `end` FROM Edition
);
