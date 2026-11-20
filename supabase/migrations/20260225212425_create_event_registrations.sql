/*
  # Create event_registrations table

  ## Summary
  Stores attendee registrations for published events. Anonymous users can
  submit registrations (INSERT only). Only authenticated admin users can
  read, update, or delete registration records.

  ## New Table: event_registrations
  - id (uuid, primary key)
  - event_id (uuid, foreign key → events_items.id, cascade on delete)
  - event_title (text) - denormalized for quick display without joins
  - event_slug (text) - denormalized for linking back to the event
  - name (text) - registrant full name
  - email (text) - registrant email address
  - phone (text) - optional phone number
  - organization (text) - optional org/company name
  - notes (text) - optional message or accommodation requests
  - status (text) - 'pending' | 'confirmed' | 'cancelled'
  - created_at (timestamptz)

  ## Security (RLS)
  - Anonymous/public: INSERT only (anyone can register)
  - Authenticated: SELECT, UPDATE, DELETE (admin management)
*/

CREATE TABLE IF NOT EXISTS event_registrations (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     uuid        NOT NULL REFERENCES events_items(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS event_registrations_event_id_idx ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS event_registrations_email_idx ON event_registrations(email);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for events"
  ON event_registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can view registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
