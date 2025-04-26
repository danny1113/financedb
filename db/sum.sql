-- check summary is balanced
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
        SELECT id AS debitId, debitAccount, SUM(debitValue) AS debitSum
        FROM "Transaction"
        WHERE "date" BETWEEN (
            SELECT "start" FROM Edition
        ) AND (
            SELECT "end" FROM Edition
        )
        GROUP BY debitAccount
    ) ON Account.id = debitAccount
    LEFT JOIN (
        SELECT id AS creditId, creditAccount, SUM(creditValue) AS creditSum
        FROM "Transaction"
        WHERE "date" BETWEEN (
            SELECT "start" FROM Edition
        ) AND (
            SELECT "end" FROM Edition
        )
        GROUP BY creditAccount
    ) ON Account.id = creditAccount
    ORDER BY id
);
