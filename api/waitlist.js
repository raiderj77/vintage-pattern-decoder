// Vercel Serverless Function — Waitlist Email Capture
// 
// This stores emails to Vercel KV (free tier: 256 keys, 30k requests/month)
// 
// SETUP:
// 1. In your Vercel dashboard, go to Storage → Create → KV
// 2. Name it "waitlist" and connect it to this project
// 3. Vercel auto-adds the KV_REST_API_URL and KV_REST_API_TOKEN env vars
// 4. Deploy and it works!
//
// ALTERNATIVE: If you'd rather use ConvertKit, Mailchimp, or ButtonDown,
// replace the handler below with a fetch to their API.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, source, timestamp } = req.body;

  // Basic validation
  if (!email || !email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ error: "Valid email required" });
  }

  // Sanitize
  const cleanEmail = email.toLowerCase().trim();

  try {
    // ─── OPTION 1: Vercel KV (default) ────────────────────────────
    // Uncomment this block after setting up Vercel KV Storage
    /*
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    
    if (kvUrl && kvToken) {
      // Store email with timestamp
      await fetch(`${kvUrl}/set/waitlist:${cleanEmail}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          source: source || "unknown",
          joined: timestamp || new Date().toISOString(),
        }),
      });

      // Also add to a list for easy retrieval
      await fetch(`${kvUrl}/sadd/waitlist:emails/${cleanEmail}`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${kvToken}` },
      });
    }
    */

    // ─── OPTION 2: Simple log (works immediately, no setup) ───────
    // Emails appear in Vercel Function Logs (Dashboard → Deployments → Functions)
    console.log(`[WAITLIST] ${cleanEmail} | ${source} | ${timestamp}`);

    // ─── OPTION 3: ConvertKit / Mailchimp / ButtonDown ────────────
    // Replace with your email service API call
    // Example for ButtonDown:
    /*
    await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: cleanEmail }),
    });
    */

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[WAITLIST ERROR]", error);
    return res.status(500).json({ error: "Server error" });
  }
}
