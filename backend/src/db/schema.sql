-- Create emails table
create table if not exists emails (
  id uuid default gen_random_uuid() primary key,
  sender text not null,
  subject text not null,
  received_at timestamp with time zone not null,
  body text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

-- Add indexes for common queries on emails
create index if not exists idx_emails_sender on emails(sender);
create index if not exists idx_emails_received_at on emails(received_at);

-- Create links table
create table if not exists links (
  id uuid default gen_random_uuid() primary key,
  email_id uuid references emails(id) on delete cascade,
  url text not null,
  anchor_text text,
  text_snippet text,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default now()
);

-- Add indexes for common queries on links
create index if not exists idx_links_email_id on links(email_id);
create index if not exists idx_links_url on links(url); 