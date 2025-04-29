-- check balance sheet is balanced
WITH BalanceSheet AS (
    SELECT
        Account.id,
        name,
        value
    FROM FinancialStatementEntry
    INNER JOIN Account
        ON Account.id = accountId
    WHERE financialStatementId LIKE 'BS-2025-04-__'
)

SELECT
    SUM(debit),
    SUM(credit)
FROM (
    SELECT
        id,
        value AS debit,
        0 AS credit
    FROM BalanceSheet
    WHERE id < 2000

    UNION

    SELECT
        id,
        0 AS debit,
        value AS credit
    FROM BalanceSheet
    WHERE id >= 2000
);
