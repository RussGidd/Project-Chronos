# Mermaid ER Diagram

```mermaid
erDiagram
    EMPLOYEES {
        int employee_number PK
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

    SHIFTS {
        int id PK
        int employee_number FK
        date shift_date
        string status
        number total_hours
        timestamp created_at
        timestamp updated_at
    }

    TIME_PUNCHES {
        int id PK
        int shift_id FK
        string punch_type
        timestamp punch_time
        int entered_by_employee_number FK
        string notes
        timestamp created_at
        timestamp updated_at
    }

    EMPLOYEES ||--o{ SHIFTS : has
    SHIFTS ||--o{ TIME_PUNCHES : contains
    EMPLOYEES o|--o{ TIME_PUNCHES : enters_or_corrects