import { EMAIL } from '../utils/site';

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What services does Rolan Lobo offer?',
    answer:
      'Full-stack web development, desktop application development with Rust and Tauri, Android apps with Flutter, security engineering (AES-256 encryption, zero-knowledge design, steganography), and AI-assisted planning tools.',
  },
  {
    question: 'What technologies does Rolan specialize in?',
    answer:
      'React, TypeScript, Python, FastAPI, Flask, Rust, Tauri, Node.js, SQLite, Flutter, and modern web standards. Security work covers AES-256, ECDH key exchange, and offline-first architecture.',
  },
  {
    question: 'Is Rolan available for freelance projects?',
    answer:
      `Yes — freelance, contract, and full-time remote engagements are all open. Reach out through the contact form or email ${EMAIL}; replies usually land within 24 hours.`
  },
  {
    question: 'Where is Rolan Lobo located?',
    answer:
      'Karnataka, India (IST, UTC +5:30). Work is remote and async-friendly, with clients across time zones.',
  },
  {
    question: "What sets Rolan's work apart?",
    answer:
      'Every project starts from a real constraint: files that must vanish, packets that must stay local, or a building site that must be assessed without paid APIs. Case studies on the work page explain the trade-offs, not just the stack.',
  },
];
