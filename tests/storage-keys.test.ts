import { describe, expect, it } from "vitest";
import {
  attachmentObjectKey,
  inboundReplayKey,
  mailboxSummaryKey,
  rawMessageObjectKey
} from "../src/storage/keys";

describe("storage key builders", () => {
  it("builds a raw message object key", () => {
    expect(rawMessageObjectKey("msg_123")).toBe("messages/raw/msg_123.eml");
  });

  it("builds an attachment object key", () => {
    expect(attachmentObjectKey("msg_123", "att_456", "invoice.pdf")).toBe("messages/attachments/msg_123/att_456");
  });

  it("builds a mailbox summary cache key", () => {
    expect(mailboxSummaryKey("mbx_123")).toBe("mailboxes/summary/mbx_123");
  });

  it("builds an inbound replay key", () => {
    expect(inboundReplayKey("provider-a", "evt_123")).toBe("inbound/replay/provider-a/evt_123");
  });

  it("keeps distinct keys for distinct reserved-character inputs", () => {
    const fromSlash = mailboxSummaryKey("a/b");
    const fromQuery = mailboxSummaryKey("a?b");
    const fromUnderscore = mailboxSummaryKey("a_b");

    expect(fromSlash).toBe("mailboxes/summary/a%2Fb");
    expect(fromQuery).toBe("mailboxes/summary/a%3Fb");
    expect(fromUnderscore).toBe("mailboxes/summary/a_b");
    expect(fromSlash).not.toBe(fromQuery);
    expect(fromSlash).not.toBe(fromUnderscore);
    expect(fromQuery).not.toBe(fromUnderscore);
  });

  it("does not depend on filename for attachment object key", () => {
    const first = attachmentObjectKey("msg_123", "att_456", "invoice.pdf");
    const second = attachmentObjectKey("msg_123", "att_456", "other-name.txt");
    expect(first).toBe("messages/attachments/msg_123/att_456");
    expect(second).toBe(first);
  });

  it("encodes edge characters in key segments without loss", () => {
    expect(rawMessageObjectKey("id with spaces+plus%percent")).toBe(
      "messages/raw/id%20with%20spaces%2Bplus%25percent.eml"
    );
  });
});
