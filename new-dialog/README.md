# Dovetail New Dialog

A React/Next.js implementation of the Dovetail "New Dialog" popup component.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- AI-powered search input with sparkle icon
- Action list with various options (Classify support tickets, Auto analysis, etc.)
- Beta badges for experimental features
- Integration icons on hover (Zendesk, Zap, Intercom)
- Responsive design with Tailwind CSS

## Project Structure

```
new-dialog/
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Demo page
├── components/
│   ├── icons/
│   │   └── CustomIcons.tsx   # SVG icon components
│   └── new-dialog/
│       ├── ActionItem.tsx    # Individual action row
│       ├── ActionList.tsx    # List of actions
│       ├── NewDialog.tsx     # Main dialog component
│       ├── SearchInput.tsx   # Search input with icon
│       └── index.ts          # Barrel exports
└── lib/
    └── actions.ts       # Action items data
```

## Usage

```tsx
import { NewDialog, NewDialogModal } from '@/components/new-dialog'

// Standalone dialog
<NewDialog onActionClick={(id) => console.log(id)} />

// Modal with backdrop
<NewDialogModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onActionClick={(id) => console.log(id)}
/>
```
