-- group transaction
WITH Expenses AS (
    SELECT
        debitAccount,
        DebitAccount.name AS debitAccountName,
        DebitSubAccount.name AS debitSubAccountName,
        SUM(debitValue) AS debitValue
    FROM `Transaction`
    LEFT JOIN Account AS DebitAccount ON debitAccount = DebitAccount.id
    LEFT JOIN SubAccount AS DebitSubAccount ON debitSubAccount = DebitSubAccount.id
    WHERE date >= (
        SELECT start FROM Edition
    ) AND debitAccount >= 5000
    GROUP BY debitAccount, debitSubAccount
    ORDER BY debitAccount
)

SELECT
    debitAccountName AS debitAccount,
    debitSubAccountName AS creditAccount,
    debitValue
FROM Expenses

UNION

SELECT
    'SUM',
    NULL,
    SUM(debitValue)
FROM Expenses;
