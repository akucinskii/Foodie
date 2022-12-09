# Simple app made to make ordering food as group easier :tf:

## Tech stack:

- [create-t3-app](https://init.tips) stack, also known as the T3-Stack (react, trpc, tailwind, prisma, nextauth).
- [vitest](https://vitest.dev) for testing

## Getting started

You need to have a postgres database running to run this on your pc.
Provide its url in a `.env.local` file in the root of the project.

```bash
DATABASE_URL=Your://Postgres://Url
```

Then run the following commands:

```bash
npm i
npx prisma migrate dev
```

Also provide a secret for nextauth in the same file.

```bash
NEXTAUTH_SECRET=YourSecret
```

Auth0 is used for authentication, so you need to provide your auth0 credentials in the `.env.local` file as well.

```bash
AUTH0_CLIENT_ID=YourClientId
AUTH0_CLIENT_SECRET=YourClientSecret
AUTH0_ISSUER=YourDomain
```

### Do you want to run dev server?

```bash
npm i
npm run dev
```

### Do you want to run production server?

Add environment variables

```bash
npm i
npm run build
npm run start
```

if deploying to an service, add more env variables

```bash
NEXTAUTH_SECRET=yourSecret
VERCEL_URL=yourAppUrl
NEXTAUTH_URL=https://yourAppUrl
```

### Do you want to run tests?

```bash
npm i
npm test
```
