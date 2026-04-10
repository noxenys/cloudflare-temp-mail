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
    expect(attachmentObjectKey("msg_123", "att_456", "invoice.pdf")).toBe(
      "messages/attachments/msg_123/att_456-invoice.pdf"
    );
  });

  it("builds a mailbox summary cache key", () => {
    expect(mailboxSummaryKey("mbx_123")).toBe("mailboxes/summary/mbx_123");
  });

  it("builds an inbound replay key", () => {
    expect(inboundReplayKey("provider-a", "evt_123")).toBe("inbound/replay/provider-a/evt_123");
  });
});
