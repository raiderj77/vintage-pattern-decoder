// ─── CONFIGURATION ─────────────────────────────────────────────────
// Fill in your Stripe Payment Links and other settings below.
// 
// HOW TO GET STRIPE PAYMENT LINKS:
// 1. Go to https://dashboard.stripe.com/payment-links
// 2. Click "+ New" to create a payment link
// 3. Create a RECURRING product: "Vintage Pattern Decoder Pro - Monthly" at $3.99/month
// 4. Copy the link (looks like https://buy.stripe.com/xxxxx) and paste below
// 5. Repeat for yearly: "Vintage Pattern Decoder Pro - Yearly" at $29.99/year
// 6. Deploy again and you're live!

export const CONFIG = {
  // ─── STRIPE PAYMENT LINKS ───────────────────────────────────────
  // Replace these with your actual Stripe Payment Links
  STRIPE_MONTHLY_LINK: "", // e.g., "https://buy.stripe.com/abc123"
  STRIPE_YEARLY_LINK: "",  // e.g., "https://buy.stripe.com/xyz789"
  
  // ─── PRICING ────────────────────────────────────────────────────
  MONTHLY_PRICE: "$3.99",
  YEARLY_PRICE: "$29.99",
  YEARLY_SAVINGS: "37%",

  // ─── BRANDING ───────────────────────────────────────────────────
  SITE_NAME: "Vintage Pattern Decoder",
  SITE_URL: "https://fibertools.app",
  PARENT_SITE: "FiberTools.app",
  
  // ─── EMAIL / WAITLIST ───────────────────────────────────────────
  // Option A: Vercel serverless function (set up automatically)
  // Option B: Replace with your email service endpoint
  // e.g., Mailchimp, ConvertKit, ButtonDown, etc.
  WAITLIST_ENDPOINT: "/api/waitlist",
  
  // ─── ANALYTICS (optional) ──────────────────────────────────────
  // Google Analytics measurement ID
  GA_MEASUREMENT_ID: "", // e.g., "G-XXXXXXXXXX"
};
