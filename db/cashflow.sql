WITH TEMP AS (
SELECT
    "Transaction".id,
    creditAccount AS accountId,
    CreditAccount.name AS account,
    debitValue AS value,
    note
FROM "Transaction"
LEFT JOIN Account AS CreditAccount ON creditAccount = CreditAccount.id
WHERE date >= "2025-04-01" AND debitAccount <= 1103

UNION

SELECT
    "Transaction".id,
    debitAccount AS accountId,
    DebitAccount.name AS account,
    -creditValue AS value,
    note
FROM "Transaction"
LEFT JOIN Account AS DebitAccount ON debitAccount = DebitAccount.id
WHERE date >= "2025-04-01" AND creditAccount <= 1103
)

SELECT account, SUM(value) AS value
FROM TEMP GROUP BY accountId;
