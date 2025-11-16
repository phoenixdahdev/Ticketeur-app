# Tickeur Database Schema Diagram

## Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ VERIFICATION_OTPS : has
    USERS ||--o{ TEAMS : owns
    USERS ||--o{ TEAM_MEMBERS : belongs_to
    USERS ||--o{ TEAM_INVITATIONS : receives
    USERS ||--o{ EVENTS : creates
    USERS ||--o{ TICKETS : purchases
    USERS ||--o{ PAYMENTS : makes
    USERS ||--o{ USER_VERIFICATIONS : requests

    TEAMS ||--o{ TEAM_MEMBERS : has
    TEAMS ||--o{ TEAM_INVITATIONS : sends
    TEAMS ||--o{ EVENTS : organizes

    EVENTS ||--o{ EVENT_MEMBERS : has
    EVENTS ||--o{ EVENT_SESSIONS : contains
    EVENTS ||--o{ SPEAKERS : features
    EVENT_SESSIONS ||--o{ SPEAKERS : presents
    EVENTS ||--o{ EVENT_APPROVALS : requires
    EVENTS ||--o{ TICKET_TYPES : has
    EVENTS ||--o{ TICKETS : sold_for

    TICKET_TYPES ||--o{ TICKETS : categorizes

    TICKETS ||--o{ PAYMENTS : paid_via

    USERS {
        uuid id PK
        varchar email UK
        varchar username UK
        varchar first_name
        varchar last_name
        varchar user_type "admin | normal"
        varchar password
        text avatar
        jsonb registration_documents
        varchar valid_id
        boolean is_active
        boolean is_verified "admin verified"
        boolean is_onboarded
        timestamp last_login_at
        timestamp email_verified_at
        timestamp created_at
        timestamp updated_at
    }

    VERIFICATION_OTPS {
        uuid id PK
        uuid user_id FK
        varchar otp
        varchar type "email | password_reset | etc"
        timestamp expires_at
        integer attempts
        timestamp created_at
        timestamp updated_at
    }

    USER_VERIFICATIONS {
        uuid id PK
        uuid user_id FK
        uuid admin_id FK "nullable - who approved"
        varchar status "pending | approved | rejected"
        text rejection_reason
        jsonb documents
        timestamp reviewed_at
        timestamp created_at
        timestamp updated_at
    }

    TEAMS {
        uuid id PK
        uuid owner_id FK
        varchar name
        text description
        text logo
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    TEAM_MEMBERS {
        uuid id PK
        uuid team_id FK
        uuid user_id FK
        varchar role "owner | admin | member"
        timestamp joined_at
        timestamp created_at
        timestamp updated_at
    }

    TEAM_INVITATIONS {
        uuid id PK
        uuid team_id FK
        uuid invited_by FK
        uuid invited_user_id FK "nullable - if existing user"
        varchar email
        varchar role "admin | member"
        varchar status "pending | accepted | declined | expired"
        varchar token UK
        timestamp expires_at
        timestamp responded_at
        timestamp created_at
        timestamp updated_at
    }

    EVENTS {
        uuid id PK
        uuid organizer_id FK "user who created"
        uuid team_id FK "nullable - team organizing"
        varchar title
        text description
        text banner_image
        varchar venue_name
        text venue_address
        decimal latitude
        decimal longitude
        varchar event_type "concert | conference | etc"
        varchar status "draft | pending_approval | approved | rejected | published | cancelled | completed"
        timestamp start_date
        timestamp end_date
        integer max_attendees
        boolean is_free
        boolean is_featured
        jsonb metadata "extra event data"
        timestamp created_at
        timestamp updated_at
    }

    EVENT_MEMBERS {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        varchar role "organizer | coordinator | staff | volunteer"
        timestamp added_at
        timestamp created_at
        timestamp updated_at
    }

    EVENT_SESSIONS {
        uuid id PK
        uuid event_id FK
        varchar title
        text description
        varchar location
        timestamp start_time
        timestamp end_time
        integer order
        timestamp created_at
        timestamp updated_at
    }

    SPEAKERS {
        uuid id PK
        uuid event_id FK
        uuid session_id FK "nullable - optional assignment"
        varchar name
        varchar title
        varchar company
        text bio
        text photo
        varchar email
        jsonb social_links
        varchar topic
        timestamp session_time
        integer order
        timestamp created_at
        timestamp updated_at
    }

    EVENT_APPROVALS {
        uuid id PK
        uuid event_id FK
        uuid admin_id FK
        varchar type "pending | approved | rejected"
        text admin_notes
        text rejection_reason
        timestamp reviewed_at
        timestamp created_at
        timestamp updated_at
    }

    TICKET_TYPES {
        uuid id PK
        uuid event_id FK
        varchar name "VIP | Regular | Early Bird"
        text description
        decimal price
        integer quantity_available
        integer quantity_sold
        integer max_per_order
        timestamp sales_start
        timestamp sales_end
        boolean is_active
        jsonb benefits "list of perks"
        timestamp created_at
        timestamp updated_at
    }

    TICKETS {
        uuid id PK
        uuid event_id FK
        uuid ticket_type_id FK
        uuid user_id FK "purchaser"
        uuid payment_id FK "nullable"
        varchar ticket_number UK
        varchar qr_code UK
        varchar status "reserved | paid | used | cancelled | refunded"
        varchar attendee_name
        varchar attendee_email
        timestamp checked_in_at
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        uuid id PK
        uuid user_id FK
        uuid ticket_id FK "nullable - for single ticket"
        varchar transaction_reference UK
        decimal amount
        decimal fee
        decimal net_amount
        varchar currency "NGN | USD | etc"
        varchar payment_method "card | bank_transfer | etc"
        varchar payment_provider "paystack | flutterwave | etc"
        varchar status "pending | processing | successful | failed | refunded"
        jsonb provider_response
        text failure_reason
        timestamp paid_at
        timestamp created_at
        timestamp updated_at
    }

    EVENT_CATEGORIES {
        uuid id PK
        varchar name UK
        text description
        varchar slug UK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        varchar type "event_approved | ticket_purchased | etc"
        varchar title
        text message
        jsonb data
        boolean is_read
        timestamp read_at
        timestamp created_at
    }
```

## Table Descriptions

### Core User Management
- **USERS**: Main user table with verification status and user types (admin/normal)
- **VERIFICATION_OTPS**: Email/phone verification codes

### Team Management
- **TEAMS**: Organizations/teams that can organize events
- **TEAM_MEMBERS**: Users belonging to teams with roles
- **TEAM_INVITATIONS**: Pending invitations to join teams

### Event Management
- **EVENTS**: Main events table with approval workflow
- **EVENT_MEMBERS**: Team members assigned to specific events
- **EVENT_SESSIONS**: Sessions/tracks within an event (optional)
- **SPEAKERS**: Speakers/presenters for events (optionally assigned to sessions)
- **EVENT_APPROVALS**: Admin approval history for events
- **EVENT_CATEGORIES**: Categories for organizing events
- **TICKET_TYPES**: Different ticket tiers for events

### Ticketing & Payments
- **TICKETS**: Individual tickets purchased by users
- **PAYMENTS**: Payment transactions for tickets

### Communication
- **NOTIFICATIONS**: In-app notifications for users

## Key Workflows

### 1. User Verification Flow
1. User registers -> `is_verified = false`
2. User submits documents -> `USER_VERIFICATIONS` record created with `status = pending`
3. Admin reviews -> Updates `USER_VERIFICATIONS.status` and `USERS.is_verified`

### 2. Event Creation & Approval
1. Verified user creates event -> `EVENTS.status = draft`
2. User submits for approval -> `status = pending_approval`
3. Admin reviews -> Creates `EVENT_APPROVALS` record
4. If approved -> `status = approved`, user can publish
5. User publishes -> `status = published`

### 3. Ticket Purchase Flow
1. User selects ticket type -> `TICKETS` created with `status = reserved`
2. Payment initiated -> `PAYMENTS` created with `status = pending`
3. Payment successful -> `PAYMENTS.status = successful`, `TICKETS.status = paid`
4. QR code generated for ticket

### 4. Team Invitation Flow
1. Team owner/admin sends invite -> `TEAM_INVITATIONS` created
2. User receives notification
3. User accepts -> `TEAM_MEMBERS` record created, invitation status updated

## Indexes to Consider

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- Events
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_team ON events(team_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);

-- Tickets
CREATE INDEX idx_tickets_event ON tickets(event_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Payments
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Team Members
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

## Status Enums

### User Verification Status
- `pending` - Awaiting admin review
- `approved` - Verified by admin
- `rejected` - Rejected with reason

### Event Status
- `draft` - Being created
- `pending_approval` - Submitted for admin approval
- `approved` - Approved, can be published
- `rejected` - Rejected by admin
- `published` - Live and visible
- `cancelled` - Event cancelled
- `completed` - Event has ended

### Ticket Status
- `reserved` - Held during checkout
- `paid` - Payment confirmed
- `used` - Checked in at event
- `cancelled` - Cancelled before event
- `refunded` - Money returned

### Payment Status
- `pending` - Initiated
- `processing` - Being processed
- `successful` - Completed
- `failed` - Failed
- `refunded` - Refunded

### Team Invitation Status
- `pending` - Awaiting response
- `accepted` - User joined team
- `declined` - User declined
- `expired` - Invitation expired
