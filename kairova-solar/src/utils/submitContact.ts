// ---------------------------------------------------------------------------
// DEMO contact submission.
//
// This function does NOT send email and does NOT store personal information.
// It simulates a network round trip so the form can show its loading and
// success states.
//
// To connect a real integration (for example a GoHighLevel inbound webhook):
//   1. Create the webhook in GHL (Automation > Workflows > Inbound Webhook).
//   2. Replace the body of submitContact with a fetch to that URL, e.g.
//
//        const res = await fetch(GHL_WEBHOOK_URL, {
//          method: 'POST',
//          headers: { 'Content-Type': 'application/json' },
//          body: JSON.stringify(payload)
//        })
//        if (!res.ok) throw new Error('Submission failed')
//
//   3. Map the payload fields to your GHL contact fields in the workflow.
// ---------------------------------------------------------------------------

export interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  area: string
  propertyType: string
  monthlyBill: string
  service: string
  message: string
  consent: boolean
}

export async function submitContact(payload: ContactPayload): Promise<{ ok: true }> {
  // Simulated latency only. Payload is intentionally unused in the demo.
  void payload
  await new Promise((resolve) => setTimeout(resolve, 1400))
  return { ok: true }
}
