Below is a **`todo.md`** document you can use as a master checklist. Each section corresponds to one phase of the project and is broken into small, testable steps. Mark them off as you go!

---

# TODO Checklist

## 1. Environment & Project Setup

- [x] **Repository Structure**
  - [x] Decide if using a monorepo (e.g., Nx, Turborepo) or separate repos for backend and frontend.
  - [x] Initialize Git repositories with `.gitignore` ignoring `node_modules`, build outputs, etc.

- [x] **Backend Project Initialization**
  - [x] Create a new Node.js project (`npm init -y`).
  - [x] Install Express (`npm install express`).
  - [x] Install testing framework (e.g., Jest, `npm install --save-dev jest`).
  - [x] Configure `"test": "jest"` in `package.json`.
  - [x] Create a simple `app.js` with a health-check endpoint.
  - [x] Write `app.test.js` to confirm the health-check endpoint returns 200 OK with `{ status: 'healthy' }`.

- [x] **Frontend Project Initialization**
  - [x] Create a Next.js app via `npx create-next-app`.
  - [x] Verify you can run `npm run dev` and see a starter page.
  - [x] On the homepage (`pages/index.js`), display "Hello Email Intelligence Bot" or similar placeholder.
  - [x] (Optional) Add linting/formatting (ESLint, Prettier) to enforce code style.

- [x] **Basic Testing Configuration**
  - [x] Ensure tests run successfully in the backend (`npm test`).
  - [ ] (Optional) Set up React Testing Library or Cypress for the Next.js project (can be done later).

---

## 2. Supabase Setup & Database Schema

- [x] **Supabase Project Creation**
  - [x] Create SQL schema for tables
  - [x] Add appropriate indexes for common queries
  - [x] Obtain `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

- [x] **Local Env Configuration**
  - [x] Create `.env` file with required variables
  - [x] Set up environment variables loading in Node.js
  - [x] Configure Supabase client with service role key
  - [x] Add `.env` to `.gitignore`

- [x] **Database Tables**
  - [x] Create `emails` table with fields:
    - [x] `id` (UUID, PK)
    - [x] `sender` (text)
    - [x] `subject` (text)
    - [x] `received_at` (timestamp)
    - [x] `body` (text)
    - [x] `attachments` (jsonb)
    - [x] `created_at` (timestamp, default now)
  - [x] Create `links` table with fields:
    - [x] `id` (UUID, PK)
    - [x] `email_id` (UUID, FK → `emails.id`)
    - [x] `url` (text)
    - [x] `anchor_text` (text)
    - [x] `text_snippet` (text)
    - [x] `tags` (text[])
    - [x] `created_at` (timestamp, default now)

- [x] **Connectivity Test**
  - [x] Install `@supabase/supabase-js` in the backend
  - [x] Create test file to insert dummy row into `emails`
  - [x] Confirm test passes with proper connection

---

## 3. Gmail OAuth2 Flow (Next Steps)

- [ ] **OAuth Setup**
  - [ ] Create Google Cloud Project
  - [ ] Configure OAuth consent screen
  - [ ] Create OAuth 2.0 Client ID
  - [ ] Add authorized redirect URIs
  - [ ] Store credentials in `.env`:
    ```
    GOOGLE_CLIENT_ID=your-client-id
    GOOGLE_CLIENT_SECRET=your-client-secret
    GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
    ```

- [ ] **Backend Auth Routes**
  - [ ] Install required packages:
    ```bash
    npm install googleapis google-auth-library
    ```
  - [ ] Create `/auth/google` endpoint for OAuth initiation
  - [ ] Create `/auth/google/callback` endpoint for token exchange
  - [ ] Add token storage/refresh logic
  - [ ] Add error handling for auth failures

---

## 4. `/sync-emails` Endpoint (Skeleton)

- [ ] **Endpoint Scaffolding**
  - [ ] Create an Express route `POST /sync-emails` (or `GET`, but POST is often better for sync actions).
  - [ ] Return `{ status: 'sync endpoint reached' }` initially.

- [ ] **Test**
  - [ ] Write a test (using `supertest` or similar) that calls `/sync-emails` and checks the JSON response.
  - [ ] Confirm the test passes.

---

## 5. Fetch & Parse Email Metadata

- [ ] **Gmail API Integration**
  - [ ] Extend the `/sync-emails` route to use the refresh token and connect to Gmail.
  - [ ] Fetch new messages since a given date/time (`lastSyncedAt`).
  - [ ] Extract essential metadata: sender, subject, date/time (received date).

- [ ] **Test with Mock Data**
  - [ ] In the test suite, mock the Gmail API response with 1-2 sample emails.
  - [ ] Confirm the code extracts correct sender, subject, date/time from the mock.
  - [ ] Return or log the extracted info for debugging.

---

## 6. Email Body Parsing & Link Extraction

- [ ] **Body Parsing Module**
  - [ ] Install `cheerio` (`npm install cheerio`).
  - [ ] Create a helper module, e.g., `parseEmailBody.js` with:
    - `extractLinks(htmlBody)` that returns an array of `{ url, anchor_text, text_snippet }`.

- [ ] **Filter & Ignore Forwarded Text**
  - [ ] Use patterns like `"On ... wrote:"` to skip quoting.
  - [ ] Decide if you need more robust logic for forwarded quotes or rely on known Gmail markers.

- [ ] **Filter Out Irrelevant Links**
  - [ ] Skip unsubscribe links, social media icons, etc. (Look for known keywords or domains.)
  - [ ] Possibly remove tracking parameters (`utm_source`, etc.), if you want to store a clean URL.

- [ ] **Unit Tests**
  - [ ] In `parseEmailBody.test.js`, pass a sample HTML with multiple links:
    - 2-3 valid links
    - 1 unsubscribe link
    - 1 social link
  - [ ] Assert that only the valid links remain in the result.

---

## 7. Write Data to Supabase & `lastSyncedAt` Handling

- [ ] **Inserting Emails & Links**
  - [ ] In `/sync-emails`, insert a new record into `emails` for each fetched Gmail message.
  - [ ] For each extracted link, insert a record into `links` referencing the `email.id`.
  - [ ] Store attachments as a minimal JSON object: `[ { filename, mimeType }, ... ]`.

- [ ] **`lastSyncedAt` Strategy**
  - [ ] Create (if needed) an `app_settings` table with a row storing `lastSyncedAt`.
  - [ ] Update `lastSyncedAt` after processing the most recent email timestamp.
  - [ ] In subsequent syncs, only fetch messages newer than `lastSyncedAt`.

- [ ] **Testing**
  - [ ] Mock multiple new emails, confirm the correct number of rows are inserted.
  - [ ] Confirm links are tied to the proper email.
  - [ ] Verify `lastSyncedAt` updates correctly.

---

## 8. Next.js Frontend: Search Page

- [ ] **Page Creation**
  - [ ] Create `/pages/search.js`.
  - [ ] Add a text input for full-text queries (e.g., subject/body).
  - [ ] Optionally add filters (sender, date range, attachments).

- [ ] **Querying Supabase**
  - [ ] Install `@supabase/supabase-js` in the Next.js frontend.
  - [ ] Create a Supabase client in `utils/supabaseClient.js`.
  - [ ] On form submit, run:
    ```js
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .ilike('subject', `%${query}%`);
    ```
  - [ ] Display matched emails: subject, sender, date, and associated links.

- [ ] **Testing**
  - [ ] Use React Testing Library or Cypress to test the search page rendering.
  - [ ] Mock or stub Supabase calls to ensure the UI handles results correctly.

---

## 9. Scheduling & Deployment

- [ ] **Daily Sync Trigger**
  - [ ] Create a Supabase Edge Function or external cron job.
  - [ ] Configure it to call your deployed backend `/sync-emails` daily (e.g., 3 AM).
  - [ ] Test that the function is invoked and logs show new messages are processed.

- [ ] **Backend Deployment**
  - [ ] Prepare a `Dockerfile` or a config for Railway/Render.
  - [ ] Set environment variables in your hosting platform:
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_KEY`
    - `GOOGLE_CLIENT_ID`
    - `GOOGLE_CLIENT_SECRET`
    - (and any others).

- [ ] **Frontend Deployment**
  - [ ] Deploy Next.js to Vercel (or your preferred platform).
  - [ ] Provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the frontend to query Supabase.

- [ ] **Verify End-to-End**
  - [ ] Send a few test emails with real or dummy content to your Gmail account.
  - [ ] Wait for (or manually trigger) the sync job.
  - [ ] Confirm new emails and links appear in Supabase.
  - [ ] Search from the Next.js UI and verify correct results.

---

## 10. Future Enhancements (Optional for V1)

- [ ] **LLM Integration**
  - [ ] Summarize or tag emails automatically.
  - [ ] Store embeddings for semantic search.
  - [ ] Add a chat interface for retrieval-augmented generation.

- [ ] **PDF / Attachment Parsing**
  - [ ] Extract PDF contents or use a converter to text.
  - [ ] Summarize or store relevant info.

- [ ] **Multi-Account Support**
  - [ ] Handle multiple Gmail refresh tokens for different users.
  - [ ] Partition data by user ID.
