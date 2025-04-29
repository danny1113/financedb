INSERT INTO Account
VALUES
(1100, 'Cash'),
(1103, 'Cash at Bank'),
(1116, 'Cash in Transit'),
(1140, 'Account Receivable'),
(1210, 'Stock'),
(1411, 'Prepaid Expense'),
(1616, 'Machine and Equipment'),
(1618, 'Accumulated Depreciation - Machine and Equipment'),

(2140, 'Account Payable'),
(2170, 'Expense Payable'),

(3100, 'Owner''s Capital'),
(3110, 'Capital Stock'),
(3351, 'Retained Earnings'),

(4150, 'Salary Income'),
(4510, 'Interest Income'),
(4580, 'Other Income'),

(5100, 'Living Expense'),
(5200, 'Rent Expense'),
(5302, 'Depreciation Expense - Machine and Equipment'),
(5410, 'Insurance Expense'),
(5420, 'Pension Expense'),
(5500, 'Other Expense');

INSERT INTO SubAccount
VALUES
(110001, 1100, 'Cash'),
(110002, 1100, 'PASMO'),
(110003, 1100, 'Suica'),
(110004, 1100, 'Mobile Suica'),
(110005, 1100, 'ANA Pay'),
(110006, 1100, 'PayPay'),

(110301, 1103, 'ゆうちょ銀行'),
(110302, 1103, '永豐銀行'),

(510001, 5100, 'Travel Expense'),
(510002, 5100, 'Food Expense'),
(510003, 5100, 'Daily Expense'),
(510004, 5100, 'Health Expense'),
(510005, 5100, 'Entertainment Expense'),
(510006, 5100, 'Private Expense'),
(510007, 5100, 'Fee Expense'),
(510008, 5100, 'Other Expense');

INSERT INTO Edition
VALUES
('2025-04-01', '2025-04-30');
