# Mermaid ER Diagram

```mermaid
erDiagram
    EMPLOYEES {
        int id PK
        string employee_number
        string pin_hash
        string first_name
        string nickname
        string last_name
        date date_of_hire
        string role
        string status
        timestamp created_at
        timestamp updated_at
    }

    ADMINS {
        int id PK
        string username
        string password_hash
        string first_name
        string last_name
        string role
        timestamp created_at
        timestamp updated_at
    }

    PUNCH_RECORDS {
        int id PK
        int employee_id FK
        string punch_type
        timestamp punch_time
        int entered_by_admin_id FK
        string notes
        timestamp created_at
        timestamp updated_at
    }

    EMPLOYEES ||--o{ PUNCH_RECORDS : has
    ADMINS o|--o{ PUNCH_RECORDS : enters_or_corrects
