/*
  # E3 CoE content tables

  E3 CoE shares Vision 8:28's Supabase project. These tables copy the shape and
  security rules of news_articles, events_items and event_registrations under
  e3_* names, so each site keeps its own content.

  Additive only: no existing Vision table, row or policy is changed.
  Admin logins (Supabase Auth users) are shared between the two sites.
*/


-- ── e3_news_articles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS e3_news_articles (
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
  CONSTRAINT e3_news_articles_slug_unique UNIQUE (slug)
);

ALTER TABLE e3_news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "E3: Public can read published articles"
  ON e3_news_articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "E3: Authenticated can read all articles"
  ON e3_news_articles FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can insert articles"
  ON e3_news_articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can update articles"
  ON e3_news_articles FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can delete articles"
  ON e3_news_articles FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ── e3_events_items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS e3_events_items (
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
  CONSTRAINT e3_events_items_slug_unique UNIQUE (slug)
);

ALTER TABLE e3_events_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "E3: Public can read published events"
  ON e3_events_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "E3: Authenticated can read all events"
  ON e3_events_items FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can insert events"
  ON e3_events_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can update events"
  ON e3_events_items FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can delete events"
  ON e3_events_items FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);


CREATE TABLE IF NOT EXISTS e3_event_registrations (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid        NOT NULL REFERENCES e3_events_items(id) ON DELETE CASCADE,
  event_title  text        NOT NULL DEFAULT '',
  event_slug   text        NOT NULL DEFAULT '',
  name         text        NOT NULL DEFAULT '',
  email        text        NOT NULL DEFAULT '',
  phone        text        NOT NULL DEFAULT '',
  organization text        NOT NULL DEFAULT '',
  notes        text        NOT NULL DEFAULT '',
  status       text        NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS e3_event_registrations_event_id_idx ON e3_event_registrations(event_id);
CREATE INDEX IF NOT EXISTS e3_event_registrations_email_idx ON e3_event_registrations(email);

ALTER TABLE e3_event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "E3: Anyone can register for events"
  ON e3_event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "E3: Authenticated can view registrations"
  ON e3_event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can update registrations"
  ON e3_event_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "E3: Authenticated can delete registrations"
  ON e3_event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
