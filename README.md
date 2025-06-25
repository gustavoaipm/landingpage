# Gustavo AI Landing Page

A modern, responsive landing page for Gustavo AI built with Next.js. Features a beautiful gradient design with a waitlist signup form.

## Features

- 🎨 Modern gradient design with animated particles
- 📱 Fully responsive layout
- 📝 Waitlist signup form with email collection
- ⚡ Built with Next.js 14 and TypeScript
- 🎭 Smooth animations and hover effects

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages

- **Home Page** (`/`) - Main landing page with features and call-to-action
- **Waitlist** (`/waitlist`) - Email signup form with beautiful gradient design

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Deploy on Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Deployment**: Vercel (recommended)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── waitlist/
│   │   ├── page.tsx          # Waitlist page
│   │   └── waitlist.module.css
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
public/
├── logo.png                  # Logo assets
└── logonobackground.png
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
