# Grace

A private, anonymous mental health and spiritual support app for Nigerian users.

Grace gives people a safe place to write what they're carrying. In return it offers
a matching scripture, a personalised prayer, and a clear path to real human help 
all without an account, a name, or anything that identifies who you are.

---

## What it does

- **Vent privately** — write freely, nothing is shared with anyone
- **Receive a response** — an AI matches your emotion to a scripture and generates a prayer
- **Daily scripture** — a verse for the day, available without venting
- **Crisis support** — SURPIN, MANI, and 112 are one tap away on every screen
- **Risk detection** — on-device, no network, flags crisis language immediately

---

## What it does not do

- No accounts, no sign-up, no email
- No social feed, no peer visibility
- No data sent to any server except the AI call that generates the response
- No analytics, no crash reporting that carries user text

---

## Stack

- React Native + Expo (SDK 57)
- expo-router for navigation
- expo-sqlite + expo-secure-store for local encrypted storage (AES-256-GCM)
- Groq API (llama model) for theme detection and prayer generation
- World English Bible (WEB) translation for all scripture

---

## Project structure

grace-app/
├── src/
│ ├── app/ # expo-router screens
│ │ ├── _layout.tsx # root layout, onboarding guard, launch cleanup
│ │ ├── index.tsx # Vent screen (home)
│ │ ├── response.tsx # Response screen
│ │ ├── help.tsx # Crisis helplines
│ │ ├── today.tsx # Daily scripture
│ │ ├── onboarding.tsx # First-launch onboarding
│ │ └── settings.tsx # Settings
│ ├── components/
│ │ ├── HelpButton.tsx # Persistent crisis button
│ │ └── HelplineList.tsx # Reusable helpline rows
│ ├── constants/
│ │ ├── theme.ts # Colour palette
│ │ ├── helplines.ts # Crisis contact data
│ │ └── scriptures.ts # WEB verse library with themes
│ ├── context/
│ │ └── OnboardingContext.tsx
│ ├── services/
│ │ ├── ai.ts # Groq API — theme detection and prayer generation
│ │ └── storage.ts # Local encrypted entry storage
│ └── utils/
│ ├── riskCheck.ts # On-device crisis language detection
│ └── encrypt.ts # AES-256-GCM encryption
├── .env.local # API keys — never committed
├── .gitignore
├── app.json
├── package.json
└── tsconfig.json
