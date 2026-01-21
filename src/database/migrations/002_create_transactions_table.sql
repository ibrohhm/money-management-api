CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transacted_at TIMESTAMP NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    account_id INT NOT NULL,
    transaction_type TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_transacted ON transactions(user_id, transacted_at);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category_id, transacted_at);
CREATE INDEX idx_transactions_user_account ON transactions(user_id, account_id, transacted_at);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, transaction_type, transacted_at);
