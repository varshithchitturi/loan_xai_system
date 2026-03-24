CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    income DOUBLE PRECISION NOT NULL,
    loan_amount DOUBLE PRECISION NOT NULL,
    credit_score DOUBLE PRECISION NOT NULL,
    employment_years INT NOT NULL,
    gender VARCHAR(32) NOT NULL,
    education VARCHAR(64) NOT NULL,
    marital_status VARCHAR(32) NOT NULL,
    prediction VARCHAR(32) NOT NULL,
    probability DOUBLE PRECISION NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS decisions (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL REFERENCES applicants(id),
    model_version VARCHAR(64) NOT NULL,
    decision VARCHAR(32) NOT NULL,
    explanation TEXT NOT NULL,
    fairness_score DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    actor VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    prediction_id INT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS model_registry (
    id SERIAL PRIMARY KEY,
    version VARCHAR(64) UNIQUE NOT NULL,
    accuracy DOUBLE PRECISION NOT NULL,
    date_deployed TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    notes TEXT
);

