function safeSegment(value: string): string {
  // Persistent key protocol: segment encoding must be reversible and collision-free.
  return encodeURIComponent(value);
}

export function rawMessageObjectKey(messageId: string): string {
  return `messages/raw/${safeSegment(messageId)}.eml`;
}

export function attachmentObjectKey(messageId: string, attachmentId: string, _filename: string): string {
  return `messages/attachments/${safeSegment(messageId)}/${safeSegment(attachmentId)}`;
}

export function mailboxSummaryKey(mailboxId: string): string {
  return `mailboxes/summary/${safeSegment(mailboxId)}`;
}

export function inboundReplayKey(provider: string, eventId: string): string {
  return `inbound/replay/${safeSegment(provider)}/${safeSegment(eventId)}`;
}
