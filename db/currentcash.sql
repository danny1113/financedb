-- 試算表
SELECT
    Account.id,
    Account.name,
    SubAccount.name,
    debitSum AS debit,
    creditSum AS credit,
    IFNULL(debitSum, 0) - IFNULL(creditSum, 0) AS total
FROM Account
LEFT JOIN SubAccount ON Account.id = SubAccount.accountId
LEFT JOIN (
    SELECT id AS debitId, debitSubAccount, SUM(debitValue) AS debitSum
    FROM "Transaction"
    WHERE "date" BETWEEN (
        SELECT "start" FROM Edition
    ) AND (
        SELECT "end" FROM Edition
    )
    GROUP BY debitSubAccount
) ON SubAccount.id = debitSubAccount
LEFT JOIN (
    SELECT id AS creditId, creditSubAccount, SUM(creditValue) AS creditSum
    FROM "Transaction"
    WHERE "date" BETWEEN (
        SELECT "start" FROM Edition
    ) AND (
        SELECT "end" FROM Edition
    )
    GROUP BY creditSubAccount
) ON SubAccount.id = creditSubAccount
WHERE Account.id = 1100 OR Account.id = 1103
ORDER BY Account.id, SubAccount.id;

-- all transactions
SELECT
    Account.id,
    Account.name,
    SubAccount.name,
    debitSum AS debit,
    creditSum AS credit,
    IFNULL(debitSum, 0) - IFNULL(creditSum, 0) AS total
FROM Account
LEFT JOIN SubAccount ON Account.id = SubAccount.accountId
LEFT JOIN (
    SELECT id AS debitId, debitSubAccount, SUM(debitValue) AS debitSum
    FROM "Transaction"
    GROUP BY debitSubAccount
) ON SubAccount.id = debitSubAccount
LEFT JOIN (
    SELECT id AS creditId, creditSubAccount, SUM(creditValue) AS creditSum
    FROM "Transaction"
    GROUP BY creditSubAccount
) ON SubAccount.id = creditSubAccount
WHERE Account.id = 1100 OR Account.id = 1103
ORDER BY Account.id, SubAccount.id;
