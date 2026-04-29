# Benson Craven Portfolio

Personal portfolio for [benson.codes](https://benson.codes), built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

The site presents Benson Craven's front-end and full-stack work through a motion-led homepage, project showcase, about page, custom local fonts, and production SEO metadata.

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Local Satoshi font files
- Dynamic sitemap, robots, Open Graph, and JSON-LD metadata

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
app/
  components/        Shared page sections, navigation, motion, SEO helpers
  data/projects.ts   Portfolio project data
  info/              About page route
  layout.tsx         Global layout and metadata
  page.tsx           Homepage route
public/
  fonts/             Local Satoshi font files
  images/            Portfolio and page imagery
```

## Content Updates

- Update featured work in `app/data/projects.ts`.
- Update global metadata in `app/layout.tsx`.
- Update the about page copy and services in `app/info/InfoClient.tsx`.
- Add or replace static assets in `public/images`.

## Deployment

The app is ready for deployment on Vercel or any platform that supports Next.js.

For production:

```bash
npm run build
npm run start
```
