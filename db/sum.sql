-- check summary is balanced
WITH FilterTransaction AS (
    SELECT
        id,
        debitAccount, debitValue,
        creditAccount, creditValue
    FROM `Transaction`
    WHERE `date` BETWEEN (
        SELECT `start` FROM Edition
    ) AND (
        SELECT `end` FROM Edition
    )
)

SELECT SUM(debit), SUM(credit)
FROM (
    SELECT
        id,
        name,
        debitSum AS debit, 
        creditSum AS credit,
        IFNULL(debitSum, 0) - IFNULL(creditSum, 0) AS total
    FROM Account
    LEFT JOIN (
        SELECT
            id AS debitId,
            debitAccount,
            SUM(debitValue) AS debitSum
        FROM FilterTransaction
        GROUP BY debitAccount
    ) ON Account.id = debitAccount
    LEFT JOIN (
        SELECT
            id AS creditId,
            creditAccount,
            SUM(creditValue) AS creditSum
        FROM FilterTransaction
        GROUP BY creditAccount
    ) ON Account.id = creditAccount
    ORDER BY id
);
