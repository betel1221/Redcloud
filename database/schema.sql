-- PostgreSQL Schema Definition for Redcloud ERP System (database: erp_demo)

-- 1. Create chat_sessions table for AI Chat persistence
CREATE TABLE IF NOT EXISTS chat_sessions (
    id VARCHAR(100) PRIMARY KEY,
    domain VARCHAR(50) NOT NULL, -- 'database' (FOODAPPANDDB) or 'infrastructure' (erp_demo)
    title VARCHAR(255) NOT NULL DEFAULT 'New Chat',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create chat_messages table for message history
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL, -- 'user' or 'ai'
    text TEXT NOT NULL,
    timestamp VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_domain ON chat_sessions(domain);

-- Migration fix for existing databases lacking 'text' or 'timestamp' columns or having 'message' NOT NULL column
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS timestamp VARCHAR(50) DEFAULT '';
ALTER TABLE chat_messages ALTER COLUMN id TYPE BIGINT;
ALTER TABLE chat_messages ALTER COLUMN message DROP NOT NULL;

-- 3. Create server_metrics table for PostgreSQL telemetry (erp_demo)
CREATE TABLE IF NOT EXISTS server_metrics (
    id SERIAL PRIMARY KEY,
    server_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Running',
    cpu_usage INT NOT NULL,
    memory_usage INT NOT NULL,
    disk_usage INT NOT NULL,
    network_speed VARCHAR(50) DEFAULT '142 Mbps',
    temperature_c FLOAT DEFAULT 41.5,
    running_services INT DEFAULT 96,
    uptime VARCHAR(100) DEFAULT '4 days, 12 hours',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create security_logs table for cyber security telemetry
CREATE TABLE IF NOT EXISTS security_logs (
    id SERIAL PRIMARY KEY,
    failed_logins INT DEFAULT 4,
    successful_logins INT DEFAULT 1280,
    blocked_ips INT DEFAULT 18,
    firewall_events INT DEFAULT 52,
    suspicious_users INT DEFAULT 0,
    security_alerts INT DEFAULT 0,
    threat_level VARCHAR(50) DEFAULT 'NORMAL',
    authentication_activity INT DEFAULT 1284,
    risk_score INT DEFAULT 12,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create erp_users table for Superadmin & Admin authentication
CREATE TABLE IF NOT EXISTS erp_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'admin' or 'superadmin'
    password_hash TEXT NOT NULL,
    needs_password_change BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_user VARCHAR(255),
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- Seed default users
INSERT INTO erp_users (email, role, password_hash, needs_password_change)
VALUES ('superadmin@company.com', 'superadmin', 'admin', FALSE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO erp_users (email, role, password_hash, needs_password_change)
VALUES ('admin@company.com', 'admin', 'admin123', FALSE)
ON CONFLICT (email) DO NOTHING;

-- Seed default server metrics into erp_demo
INSERT INTO server_metrics (server_name, status, cpu_usage, memory_usage, disk_usage, network_speed, temperature_c, running_services, uptime)
VALUES 
('ERP-Postgres-Primary (erp_demo)', 'Running', 24, 48, 38, '142 Mbps', 41.5, 96, '4 days, 12 hours'),
('MSSQL-Warehouse (FOODAPPANDDB)', 'Running', 18, 58, 42, '320 Mbps', 39.8, 42, '18 days, 6 hours')
ON CONFLICT DO NOTHING;
