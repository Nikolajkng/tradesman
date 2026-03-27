This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Twilio test setup

1. Copy `.env.example` to `.env.local`
2. Add your Twilio credentials
3. Run `npm run dev`
4. Open `/twilio-test`

The `/twilio-test` page supports a safe mock mode by default. Leave mock mode enabled to test the UI and API flow without sending a real SMS.

When you are ready to send a real SMS, add these environment variables and disable mock mode in the form:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15005550006
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Project: Customer Directory with Next.js & Supabase

This project is a full-stack application connecting a local **Next.js** frontend to a **PostgreSQL** database hosted in the cloud via **Supabase**.

## How the Connection Works (From Server to Cloud)

The communication between your application and the database follows a specific technical journey:

### 1. Environment Variables (`.env`)

Security begins with two keys stored in your `.env.local` file. These ensure the app knows where to send data and has the basic permission to do so:

- **`SUPABASE_URL`**: The unique API endpoint for your project in the cloud.
- **`SUPABASE_ANON_KEY`**: A public security token that allows your app to interact with the Supabase API without exposing administrative "master" keys.

### 2. Client Initialization

We use the `createClient` function (from the `@supabase/supabase-js` library) to establish a "bridge."

- **Client Components**: By using `"use client"`, the browser communicates directly with Supabase, allowing for instant UI updates (like seeing a name appear immediately after clicking "Save").
- **Server-Side Operations**: For more secure tasks, the app can communicate via Next.js Server Actions, where the server acts as a secure middleman between the user and the database.

## Database Security (RLS)

### Row Level Security (RLS)

Even though the server is connected, access in the cloud is strictly governed by **Row Level Security (RLS)**. This is a built-in PostgreSQL feature used by Supabase to ensure data integrity.

- **Policies**: We have configured specific policies in the Supabase dashboard that dictate which operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) are allowed.
- **Protection**: Without these rules, the database would reject any attempt to modify data, even if the connection keys in the `.env` file are correct. This prevents unauthorized access to your customer data.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Managed by Supabase)
- **Styling**: Tailwind CSS
- **Identification**: UUID (Universally Unique Identifier) for primary keys
