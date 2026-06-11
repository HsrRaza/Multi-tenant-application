CREATE TABLE IF NOT EXISTS organizations(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
)


CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE  NOT NULL ,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL
         CHECK (role IN ('superadmin', 'admin', 'user')),

    created_at TIMESTAMP DEFAULT NOW(),
)


CREATE TABLE IF NOT EXISTS projects(
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100)  NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
)


CREATE TABLE IF NOT EXISTS project_memebers (
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);
