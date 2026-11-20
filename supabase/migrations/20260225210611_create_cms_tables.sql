/*
  # Create CMS Tables: news_articles and events_items

  ## Summary
  This migration creates two CMS-managed content tables for the Vision 8:28 admin panel.
  Both tables support slug-based routing, markdown content, publish/draft states, and
  full CRUD access for authenticated admin users. Anonymous users can only read published items.

  ## New Tables

  ### news_articles
  - id (uuid, primary key)
  - title (text) - article headline
  - slug (text, unique) - URL-safe identifier, used in /news/[slug] routing
  - excerpt (text) - short summary for card/list display
  - content (text) - full markdown body
  - category (text) - e.g. General, Announcement, Policy, Research
  - author (text) - author name
  - image_url (text) - optional featured image URL
  - published_at (timestamptz) - publication date shown publicly
  - is_published (boolean) - draft/live toggle
  - created_at / updated_at (timestamptz)

  ### events_items
  - id (uuid, primary key)
  - title (text) - event name
  - slug (text, unique) - URL-safe identifier, used in /events/[slug] routing
  - excerpt (text) - short description for card/list display
  - content (text) - full markdown body
  - event_date (timestamptz) - start date/time
  - end_date (timestamptz, nullable) - optional end date/time
  - venue (text) - venue name
  - location (text) - city/region
  - rsvp_url (text) - optional registration link
  - is_published (boolean) - draft/live toggle
  - created_at / updated_at (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Anonymous users: SELECT published items only (is_published = true)
  - Authenticated users: SELECT all items (including drafts)
  - Authenticated users: INSERT, UPDATE, DELETE (full admin CRUD)
*/

-- ── news_articles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_articles (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL DEFAULT '',
  slug         text        NOT NULL DEFAULT '',
  excerpt      text        NOT NULL DEFAULT '',
  content      text        NOT NULL DEFAULT '',
  category     text        NOT NULL DEFAULT 'General',
  author       text        NOT NULL DEFAULT '',
  image_url    text        NOT NULL DEFAULT '',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT news_articles_slug_unique UNIQUE (slug)
);

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles"
  ON news_articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated can read all articles"
  ON news_articles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can insert articles"
  ON news_articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update articles"
  ON news_articles FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete articles"
  ON news_articles FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── events_items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events_items (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL DEFAULT '',
  slug         text        NOT NULL DEFAULT '',
  excerpt      text        NOT NULL DEFAULT '',
  content      text        NOT NULL DEFAULT '',
  event_date   timestamptz NOT NULL DEFAULT now(),
  end_date     timestamptz,
  venue        text        NOT NULL DEFAULT '',
  location     text        NOT NULL DEFAULT '',
  rsvp_url     text        NOT NULL DEFAULT '',
  is_published boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_items_slug_unique UNIQUE (slug)
);

ALTER TABLE events_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published events"
  ON events_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated can read all events"
  ON events_items FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can insert events"
  ON events_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update events"
  ON events_items FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete events"
  ON events_items FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
