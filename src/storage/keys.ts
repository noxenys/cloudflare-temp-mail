function safeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function rawMessageObjectKey(messageId: string): string {
  return `messages/raw/${safeSegment(messageId)}.eml`;
}

export function attachmentObjectKey(messageId: string, attachmentId: string, filename: string): string {
  return `messages/attachments/${safeSegment(messageId)}/${safeSegment(attachmentId)}-${safeSegment(filename)}`;
}

export function mailboxSummaryKey(mailboxId: string): string {
  return `mailboxes/summary/${safeSegment(mailboxId)}`;
}

export function inboundReplayKey(provider: string, eventId: string): string {
  return `inbound/replay/${safeSegment(provider)}/${safeSegment(eventId)}`;
}
