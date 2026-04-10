export const STORAGE_FOUNDATION_TABLES = [
  "domains",
  "inbound_sources",
  "domain_inbound_bindings",
  "mailboxes",
  "messages",
  "attachments",
  "inbound_events"
] as const;

export const storageFoundationSchema = `
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  public INTEGER NOT NULL,
  priority INTEGER NOT NULL,
  allow_custom_prefix INTEGER NOT NULL,
  auto_create_mailbox INTEGER NOT NULL,
  dns_mode TEXT NOT NULL,
  owner_type TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inbound_sources (
  id TEXT PRIMARY KEY,
  adapter_type TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  status TEXT NOT NULL,
  config_json TEXT NOT NULL,
  secret_ref TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS domain_inbound_bindings (
  id TEXT PRIMARY KEY,
  domain_id TEXT NOT NULL,
  inbound_source_id TEXT NOT NULL,
  is_primary INTEGER NOT NULL,
  status TEXT NOT NULL,
  match_mode TEXT NOT NULL,
  verified_at TEXT,
  last_event_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(domain_id) REFERENCES domains(id),
  FOREIGN KEY(inbound_source_id) REFERENCES inbound_sources(id)
);

CREATE TABLE IF NOT EXISTS mailboxes (
  id TEXT PRIMARY KEY,
  alias TEXT NOT NULL,
  domain_id TEXT NOT NULL,
  address TEXT NOT NULL UNIQUE,
  token_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  source_type TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY(domain_id) REFERENCES domains(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  mailbox_id TEXT NOT NULL,
  domain_id TEXT NOT NULL,
  inbound_source_id TEXT NOT NULL,
  source_provider TEXT NOT NULL,
  source_message_id TEXT NOT NULL,
  envelope_from TEXT NOT NULL,
  envelope_to TEXT NOT NULL,
  header_from TEXT NOT NULL,
  header_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  text_preview TEXT NOT NULL,
  text_body TEXT,
  html_body TEXT,
  raw_r2_key TEXT NOT NULL,
  raw_size INTEGER NOT NULL,
  message_hash TEXT NOT NULL,
  received_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(mailbox_id) REFERENCES mailboxes(id),
  FOREIGN KEY(domain_id) REFERENCES domains(id),
  FOREIGN KEY(inbound_source_id) REFERENCES inbound_sources(id)
);

CREATE TABLE IF NOT EXISTS attachments (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  disposition TEXT NOT NULL,
  content_id TEXT,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(message_id) REFERENCES messages(id)
);

CREATE TABLE IF NOT EXISTS inbound_events (
  id TEXT PRIMARY KEY,
  inbound_source_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  provider_message_id TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  received_at TEXT NOT NULL,
  processed_at TEXT,
  error_code TEXT,
  error_detail TEXT,
  FOREIGN KEY(inbound_source_id) REFERENCES inbound_sources(id)
);
`.trim();
