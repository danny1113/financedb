
-- balance sheet
SELECT
    Account.id,
    name,
    value
FROM FinancialStatementEntry
INNER JOIN Account
    ON Account.id = accountId
WHERE financialStatementId LIKE "BS-2025-04-__";

-- income statement
SELECT
    Account.id,
    name,
    value
FROM FinancialStatementEntry
INNER JOIN Account
    ON Account.id = accountId
WHERE financialStatementId LIKE 'IS-2025-04-__';

-- cash flow statement
SELECT
    Account.id,
    name,
    value
FROM FinancialStatementEntry
INNER JOIN Account
    ON Account.id = accountId
WHERE financialStatementId LIKE 'CF-2025-04-__';
