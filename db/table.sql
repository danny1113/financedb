CREATE TABLE Account (
    'id'    INT PRIMARY KEY,
    'name'  TEXT NOT NULL
) STRICT;

CREATE TABLE SubAccount (
    'id'        INT PRIMARY KEY,
    'accountId' INT REFERENCES Account(id) ON UPDATE CASCADE,
    'name'      TEXT NOT NULL
) STRICT;

CREATE TABLE `Transaction` (
    'id'                TEXT PRIMARY KEY,
    'date'              TEXT NOT NULL,
    'debitAccount'      INT REFERENCES Account(id) ON UPDATE CASCADE,
    'debitSubAccount'   INT REFERENCES SubAccount(id) ON UPDATE CASCADE,
    'debitValue'        REAL NOT NULL,
    'creditAccount'     INT REFERENCES Account(id) ON UPDATE CASCADE,
    'creditSubAccount'  INT REFERENCES SubAccount(id) ON UPDATE CASCADE,
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
    'accountId'             INT REFERENCES Account(id) ON UPDATE CASCADE,
    'value'                 REAL NOT NULL,
    PRIMARY KEY (financialStatementId, accountId)
) STRICT;

CREATE TABLE CurrentCash (
    subAccountId INT PRIMARY KEY REFERENCES SubAccount(id) ON UPDATE CASCADE,
    value        REAL NOT NULL
) STRICT;

CREATE TABLE Edition (
    'start'     TEXT NOT NULL,
    'end'       TEXT NOT NULL
) STRICT;
