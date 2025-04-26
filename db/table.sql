CREATE TABLE Account (
    'id'    INT PRIMARY KEY,
    'name'  TEXT NOT NULL
) STRICT;

CREATE TABLE SubAccount (
    'id'        INT PRIMARY KEY,
    'accountId' INT REFERENCES Account(id),
    'name'      TEXT NOT NULL
) STRICT;

CREATE TABLE "Transaction" (
    'id'                TEXT PRIMARY KEY,
    'date'              TEXT NOT NULL,
    'debitAccount'      INT REFERENCES Account(id),
    'debitSubAccount'   INT REFERENCES SubAccount(id),
    'debitValue'        REAL NOT NULL,
    'creditAccount'     INT REFERENCES Account(id),
    'creditSubAccount'  INT REFERENCES SubAccount(id),
    'creditValue'       REAL NOT NULL,
    'note'              TEXT DEFAULT NULL
) STRICT;

CREATE TABLE FinancialStatement (
    'id'        TEXT PRIMARY KEY,
    'type'      TEXT NOT NULL,
    'startDate' TEXT NOT NULL,
    'endDate'   TEXT NOT NULL
) STRICT;

CREATE TABLE FinancialStatementEntry (
    'financialStatementId'  TEXT REFERENCES FinancialStatement(id), 
    'accountId'             INT REFERENCES Account(id),
    'value'                 REAL NOT NULL,
    PRIMARY KEY (financialStatementId, accountId)
) STRICT;

CREATE TABLE CurrentCash (
    subAccountId INT PRIMARY KEY REFERENCES SubAccount(id),
    value        REAL NOT NULL
) STRICT;

CREATE TABLE Edition (
    'start'     TEXT NOT NULL,
    'end'       TEXT NOT NULL
) STRICT;
