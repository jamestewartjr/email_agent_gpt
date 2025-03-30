# Supabase Integration Design Document

## Overview
Set up Supabase as our database layer with proper schema design and testing infrastructure.

## Components

### Database Schema

#### emails table
```sql
create table emails (
  id uuid default gen_random_uuid() primary key,
  sender text not null,
  subject text not null,
  received_at timestamp with time zone not null,
  body text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

-- Add indexes for common queries
create index idx_emails_sender on emails(sender);
create index idx_emails_received_at on emails(received_at);
```

#### links table
```sql
create table links (
  id uuid default gen_random_uuid() primary key,
  email_id uuid references emails(id) on delete cascade,
  url text not null,
  anchor_text text,
  text_snippet text,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default now()
);

-- Add indexes for common queries
create index idx_links_email_id on links(email_id);
create index idx_links_url on links(url);
```

### Backend Integration

#### Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js     # Supabase client configuration
│   └── tests/
│       └── supabase.test.js # Integration tests
└── .env                    # Environment variables
```

### Environment Variables
Required variables:
- `SUPABASE_URL`: Project URL
- `SUPABASE_SERVICE_KEY`: Service role key for backend operations

### Testing Strategy
1. Use Jest for integration tests
2. Create isolated test data
3. Clean up test data after each test
4. Use environment variables for test configuration

## Implementation Plan
1. Install dependencies
2. Set up environment configuration
3. Create database tables
4. Implement Supabase client
5. Write integration tests

## Future Considerations
- Add database migrations for schema changes
- Add data validation layer
- Consider adding indexes for full-text search
- Add error handling and retry logic for database operations 