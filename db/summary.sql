-- 試算表
WITH FilterTransaction AS (
    SELECT
        debitAccount, debitValue,
        creditAccount, creditValue
    FROM `Transaction`
    WHERE `date` BETWEEN (
        SELECT `start` FROM Edition
    ) AND (
        SELECT `end` FROM Edition
    )
)

SELECT
    id,
    name,
    debitSum AS debit,
    creditSum AS credit,
    IFNULL(debitSum, 0) - IFNULL(creditSum, 0) AS total
FROM Account
LEFT JOIN (
    SELECT debitAccount, SUM(debitValue) AS debitSum
    FROM FilterTransaction
    GROUP BY debitAccount
) ON Account.id = debitAccount
LEFT JOIN (
    SELECT creditAccount, SUM(creditValue) AS creditSum
    FROM FilterTransaction
    GROUP BY creditAccount
) ON Account.id = creditAccount
ORDER BY id;
