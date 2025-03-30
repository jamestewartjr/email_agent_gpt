Below is a **`todo.md`** document you can use as a master checklist. Each section corresponds to one phase of the project and is broken into small, testable steps. Mark them off as you go!

---

# TODO Checklist

## 1. Environment & Project Setup

- [ ] **Repository Structure**
  - [ ] Decide if using a monorepo (e.g., Nx, Turborepo) or separate repos for backend and frontend.
  - [ ] Initialize Git repositories with `.gitignore` ignoring `node_modules`, build outputs, etc.

- [ ] **Backend Project Initialization**
  - [ ] Create a new Node.js project (`npm init -y`).
  - [ ] Install Express (`npm install express`).
  - [ ] Install testing framework (e.g., Jest, `npm install --save-dev jest`).
  - [ ] Configure `"test": "jest"` in `package.json`.
  - [ ] Create a simple `app.js` with a health-check endpoint.
  - [ ] Write `app.test.js` to confirm the health-check endpoint returns 200 OK with `{ status: 'healthy' }`.

- [ ] **Frontend Project Initialization**
  - [ ] Create a Next.js app via `npx create-next-app`.
  - [ ] Verify you can run `npm run dev` and see a starter page.
  - [ ] On the homepage (`pages/index.js`), display "Hello Email Intelligence Bot" or similar placeholder.
  - [ ] (Optional) Add linting/formatting (ESLint, Prettier) to enforce code style.

- [ ] **Basic Testing Configuration**
  - [ ] Ensure tests run successfully in the backend (`npm test`).
  - [ ] (Optional) Set up React Testing Library or Cypress for the Next.js project (can be done later).

---

## 2. Supabase Setup & Database Schema

- [ ] **Supabase Project Creation**
  - [ ] Sign in to [Supabase](https://app.supabase.com/) and create a new project.
  - [ ] Obtain `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.

- [ ] **Local Env Configuration**
  - [ ] In the backend, create a `.env` file with variables:
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_KEY`
    - (other secrets as needed)
  - [ ] **Do not** commit `.env` to source control.

- [ ] **Database Tables**
  - [ ] Create `emails` table with fields:
    - `id` (UUID, PK)
    - `sender` (text)
    - `subject` (text)
    - `received_at` (timestamp)
    - `body` (text)
    - `attachments` (jsonb)
    - `created_at` (timestamp, default now)
  - [ ] Create `links` table with fields:
    - `id` (UUID, PK)
    - `email_id` (UUID, FK → `emails.id`)
    - `url` (text)
    - `anchor_text` (text)
    - `text_snippet` (text)
    - `tags` (text[])
    - `created_at` (timestamp, default now)

- [ ] **Connectivity Test**
  - [ ] Install `@supabase/supabase-js` in the backend (`npm install @supabase/supabase-js`).
  - [ ] Create a small test file to insert a dummy row into `emails` and confirm successful insertion.
  - [ ] Confirm test passes.

---

## 3. Gmail OAuth2 Flow

- [ ] **OAuth Setup**
  - [ ] In Google Cloud Console, create an OAuth 2.0 Client ID (Web application).
  - [ ] Obtain `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
  - [ ] Add OAuth consent screen details (for personal usage, dev environment is okay).

- [ ] **Backend Code**
  - [ ] Install `googleapis` (`npm install googleapis`).
  - [ ] In Express, create `/auth/google` that redirects to Google’s OAuth.
  - [ ] In Express, create `/auth/google/callback` that exchanges `code` for tokens.
  - [ ] Log/store the refresh token. (In dev, you might just console.log it and then manually put in `.env`).

- [ ] **Token Validation Test**
  - [ ] (Optional) Write a test double or partial integration test to confirm the flow.

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
