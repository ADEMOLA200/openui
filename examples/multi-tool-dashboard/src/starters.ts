export interface Starter {
  label: string;
  prompt: string;
  icon: string;
}

export const STARTERS: Starter[] = [
  { label: "Business Overview", prompt: "Build me a dashboard showing how the business is doing — pull MRR and balance from Stripe, DAU and top events from PostHog, active repos from GitHub, and today's meetings from my calendar", icon: "💼" },
  { label: "Morning Briefing", prompt: "Build a morning briefing dashboard with everything I need to know today — Stripe revenue and recent charges, PostHog DAU trend for the last 7 days, GitHub engineering activity summary, and my calendar agenda for today", icon: "☀️" },
  { label: "Company TL;DR", prompt: "Build a TL;DR dashboard for my company today — Stripe balance and subscription count as KPI cards, PostHog pageview trend chart for the last 14 days, a table of my most active GitHub repos, and today's calendar events", icon: "📋" },
  { label: "MRR + DAU + Deploys", prompt: "Build a dashboard showing MRR from Stripe subscriptions, DAU from PostHog, and deploy status from GitHub — show each as a KPI card on top with trend charts below", icon: "📊" },
  { label: "Revenue + Product", prompt: "Build a side-by-side dashboard with Stripe revenue data (balance, recent charges, active subscriptions) on the left and PostHog product metrics (DAU trend, top events) on the right", icon: "💰" },
  { label: "Top Customers", prompt: "Build a dashboard showing my highest-paying customers — pull recent Stripe charges sorted by amount, active subscriptions, and pair it with PostHog top events to show what features are being used most", icon: "👥" },
  { label: "Board Snapshot", prompt: "Build a board-ready snapshot dashboard with four sections — Stripe revenue KPIs (balance, MRR from subscriptions), PostHog growth metrics (DAU trend, conversion funnel), GitHub engineering velocity (repos, recent activity, commit activity), and my calendar for meeting prep", icon: "🎯" },
  { label: "Investor Update", prompt: "Build me an investor update dashboard I can screenshot — Stripe MRR and balance as big KPI numbers, PostHog DAU and pageview trend charts, a table of active GitHub repos with languages and stars, and subscription count as a headline metric", icon: "📈" },
  { label: "Money vs Code", prompt: "Build a dashboard that answers: am I making money or just deploying code? — show Stripe balance and recent charges on one side, GitHub commit activity and engineering activity summary on the other, with PostHog DAU in between as the bridge", icon: "🐙" },
  { label: "The Truth", prompt: "Build a dashboard that shows me the truth about my startup — every data source: Stripe balance and subscriptions for revenue, PostHog DAU trend and top events for product health, GitHub repos and activity for engineering output, and my calendar for time management. No fluff, just the numbers.", icon: "🔍" },
];
