SELECT
    Account.id as account,
    Account.name,
    SubAccount.id AS `subAccount`,
    SubAccount.name
FROM
    Account
LEFT JOIN SubAccount
    ON accountId = Account.id
ORDER BY Account.id, SubAccount.id;
