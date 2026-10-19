
const originals = import.meta.glob<string>('../assets/images/*.avif', {
  eager: true,
  query: '?url',
  import: 'default',
});
const variants400 = import.meta.glob<string>('../assets/images/*-400w.avif', {
  eager: true,
  query: '?url',
  import: 'default',
});
const variants800 = import.meta.glob<string>('../assets/images/*-800w.avif', {
  eager: true,
  query: '?url',
  import: 'default',
});

/* Resolves an image by filename and pairs it with the generated 400w/800w
   variants. Keeps the responsive sources next to the data that owns them. */
function projectImage(file: string): { src: string; srcSet?: string } {
  const src = originals[`../assets/images/${file}`];
  if (!src) throw new Error(`Unknown project image: ${file}`);

  const stem = file.replace(/\.avif$/, '');
  const srcSet = [
    variants400[`../assets/images/${stem}-400w.avif`] && `${variants400[`../assets/images/${stem}-400w.avif`]} 400w`,
    variants800[`../assets/images/${stem}-800w.avif`] && `${variants800[`../assets/images/${stem}-800w.avif`]} 800w`,
  ].filter(Boolean).join(', ');

  return { src, srcSet: srcSet || undefined };
}

const buildWise = projectImage('buildwise-ai-logo-banner.avif');
const invisioVaultDesktop = projectImage('InvisioVault_Suit.avif');
const invisioVaultWeb = projectImage('InvisioVault.avif');
const barLogo = projectImage('BAR_logo.avif');
const barWeb = projectImage('BAR_web.avif');
const sortify = projectImage('Sortify.avif');
const ytDownloader = projectImage('YT.avif');
const linkNest = projectImage('LN.avif');
const contactManager = projectImage('Contact_Manager.avif');
const netPlus = projectImage('NetPlus.avif');
const ytDownloaderDesktop = projectImage('YT_Downloader.avif');

export interface Project {
  /* Stable key for React and links — not an ordering hint. */
  id: number;
  /* URL segment for the case-study page (/projects/<slug>). */
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  caseStudy: {
    problem: string;
    solution: string;
    impact: string;
    learnings: string;
  };
  technologies: string[];
  github: string;
  download?: string;
  liveDemo?: string;
  featured: boolean;
  image?: string;
  /* Generated 400w/800w sources paired with the full-size fallback. */
  imageSrcSet?: string;
  /* How the image fills its frame. Defaults to 'cover' (screenshots); use
     'contain' for wide logo lockups that must not be cropped. */
  imageFit?: 'cover' | 'contain';
}

export const projectsData: Project[] = [
  {
    id: 13,
    slug: 'buildwise-ai',
    title: 'BuildWise AI',
    category: 'Web Application',
    description: 'Drop a pin anywhere and get a full civil-engineering feasibility report in seconds — MCDA land suitability, IS 1893 seismic and flood stress, CPWD cost benchmarks, Vastu orientation, and a generated architectural blueprint, compiled into a print-grade PDF dossier.',
    longDescription: 'BuildWise AI turns a single map pin into a complete construction plan. Pick any plot via MapLibre click, address geosearch, or WGS84 coordinates, and the FastAPI backend runs a deterministic civil core against CPWD DSR benchmarks, IS 1893 seismic zoning, and NBC 2016 rules — then layers Groq/Gemini reasoning on top, with a zero-key offline fallback when no model is configured.\n\nA dissection-based spatial CSP solver generates floor plans from an architect placement knowledge base and non-negotiable topological invariants, rendered as an interactive SVG blueprint. Every analysis compiles into a ReportLab vector PDF dossier with an executive scorecard, a 174mm blueprint, and a room schedule.\n\nBuilt entirely on open infrastructure — OpenFreeMap, Esri World Imagery, OpenTopoMap, USGS, Open-Meteo, and Copernicus Sentinel-2 — so there are no paid API keys anywhere in the stack.',
    caseStudy: {
      problem: 'Site feasibility is slow, expensive, and fragmented. Before buying land, a builder has to commission separate surveys for land suitability, flood risk, seismic zoning, budget, and orientation — each with its own consultant, timeline, and invoice. Small developers and self-builders usually skip the analysis entirely and discover the problems after purchase.',
      solution: 'Built a geo-based planning platform that runs the whole feasibility stack from one map pin: MCDA land-suitability scoring, IS 1893 seismic and flood stress, CPWD cost estimation, Vastu orientation, and a CSP-solved generative floor plan. A deterministic civil core keeps the maths auditable, while Groq/Gemini adapters add reasoning with a zero-key offline fallback.',
      impact: 'Produces a print-grade PDF dossier — executive scorecard, vector blueprint, and room schedule — in seconds. Runs entirely on open data (OpenFreeMap, Esri, USGS, Open-Meteo, Sentinel-2), so there are zero paid APIs. Validated by a 236-test backend suite, a 145-test placement regression suite, and a 9-viewport Puppeteer UI audit.',
      learnings: 'Constraint solving is where architectural plausibility lives or dies — early layouts were geometrically valid but unlivable until topological invariants (door adjacency, wet-zone grouping, daylight access) became hard constraints rather than heuristics. Also learned to keep the deterministic civil core strictly separate from the LLM layer: numbers must never come from a model. Would add per-region building-code profiles next so the engine is not tied to Indian standards.',
    },
    technologies: ['React 19', 'TypeScript', 'FastAPI', 'Python', 'MapLibre GL', 'Groq', 'Gemini', 'ReportLab'],
    github: 'https://github.com/Mrtracker-new/BuildWise_AI',
    featured: true,
    image: buildWise.src,
    imageSrcSet: buildWise.srcSet,
    imageFit: 'contain',
  },
  {
    id: 1,
    slug: 'invisiovault-r',
    title: 'InvisioVault_R',
    category: 'Desktop Application',
    description: 'Hides any file — documents, videos, entire folders — inside ordinary PNG or JPG images using AES-256 encryption and LSB steganography. Zero detectable metadata change. Zero cloud dependency. Free, open-source Windows desktop app.',
    longDescription: 'InvisioVault_R hides any file — documents, videos, or entire folders — inside ordinary PNG, JPG, or BMP images using AES-256 encryption and LSB steganography. The carrier image shows no detectable metadata change. No cloud upload, no account, no trace.\n\nBuilt when I realised no free, trustworthy tool existed for this exact problem. Features batch processing for multiple files, password-protected extraction, and a clean GUI accessible to non-technical users.\n\nBuilt with Python and the Cryptography library. Open-source under MIT licence.',
    caseStudy: {
      problem: 'Users needed a reliable way to share or store sensitive files without exposing their existence. Conventional encryption makes files obviously suspicious to observers — a locked container announces that something is hidden.',
      solution: 'Built a desktop steganography tool combining AES-256 encryption with LSB image embedding, so secret files are hidden inside ordinary-looking images with no visible change. Batch processing and a clean GUI make it accessible to non-technical users.',
      impact: 'Available on GitHub Releases. Zero reported security vulnerabilities since launch. Maintains zero cloud dependency — all operations are fully offline.',
      learnings: 'Alpha versions used simple XOR — the jump to AES-256 revealed how much key-derivation matters. Would add PBKDF2 stretching from day one next time, and include automated integration tests for the steganography pipeline.',
    },
    technologies: ['Python', 'Pillow (PIL)', 'AES-256', 'Cryptography', 'Steganography'],
    github: 'https://github.com/Mrtracker-new/InvisioVault_R',
    download: 'https://github.com/Mrtracker-new/InvisioVault_R/releases/',
    featured: true,
    image: invisioVaultDesktop.src,
    imageSrcSet: invisioVaultDesktop.srcSet,
  },
  {
    id: 2,
    slug: 'bar-desktop',
    title: 'BAR — Desktop',
    category: 'Desktop Application',
    description: 'Offline desktop app for professionals handling time-sensitive confidential documents. AES-256-GCM encryption + PBKDF2 key derivation + timed self-destruct. No installation, no cloud, no trace.',
    longDescription: 'BAR (Burn After Reading) is a fully offline desktop application built for journalists, legal professionals, and anyone who needs to share a secret that expires.\n\nFiles are encrypted with AES-256-GCM and a PBKDF2-derived key. Each file can be set to self-destruct after a configurable time limit — after which the content is overwritten and deleted. No cloud component, no network calls, no installation required (ships as a standalone .exe).\n\nBuilt with Python and PyQt5. All cryptographic operations run locally.',
    caseStudy: {
      problem: 'Journalists and lawyers handle time-critical confidential documents that must be provably destroyed after reading. No user-friendly offline tool existed that combined strong encryption with guaranteed deletion.',
      solution: 'Architected a fully offline PyQt5 desktop app with AES-256-GCM encryption, PBKDF2 key derivation, and a timed self-destruct mechanism. All cryptographic operations run entirely on the local machine with zero network calls.',
      impact: 'Available as a standalone .exe requiring no installation. Achieves a fully zero-cloud architecture — data never leaves the local machine at any point in its lifecycle.',
      learnings: 'Secure deletion on SSDs is harder than HDDs due to wear-levelling. Future version would overwrite file contents multiple times before unlinking. Also learned the value of threat-modelling before writing a single line of crypto code.',
    },
    technologies: ['Python', 'PyQt5', 'AES-256-GCM', 'PBKDF2', 'Cryptography'],
    github: 'https://github.com/Mrtracker-new/BAR',
    download: 'https://github.com/Mrtracker-new/BAR/releases/download/v1.0/BAR.exe',
    featured: true,
    image: barLogo.src,
    imageSrcSet: barLogo.srcSet,
  },
  {
    id: 3,
    slug: 'sortify',
    title: 'Sortify',
    category: 'Desktop Application',
    description: 'Automatic file organizer and manager for Windows. Smart desktop software that sorts and organizes files by type, date, and format. Clean cluttered folders instantly with one-click file organization.',
    longDescription: 'Sortify is an intelligent automatic file organization software that transforms chaotic folders into perfectly organized file systems. This smart Windows desktop application automatically sorts files by type (documents, images, videos, music), date, size, and custom categories.\n\nPerfect for professionals, students, and anyone struggling with messy downloads folders or disorganized file systems. Features include: one-click automatic sorting, custom organization rules, batch file processing, duplicate file detection, safe file handling with undo support, and lightning-fast performance.\n\nWhether you have thousands of downloads, photos, or documents, Sortify cleans and organizes everything in seconds.',
    caseStudy: {
      problem: 'Most Windows users accumulate chaotic downloads folders with thousands of unsorted files across dozens of types. Manual organisation is tedious and error-prone.',
      solution: "Built a rule-based automatic organiser using Python's os and shutil modules. Files are categorised by extension, then moved into clearly named sub-folders. Includes duplicate detection and one-click undo.",
      impact: 'Released as a Windows Installer (.exe). Sorts 1,000+ files in under 3 seconds in benchmarks. Actively downloaded by students and freelancers managing large asset libraries.',
      learnings: 'Edge cases (files with no extension, locked files, symlinks) caused early-version crashes. Learned to wrap all I/O in try/except and to validate paths before any operation. Would add a dry-run preview mode in v2.',
    },
    technologies: ['Python', 'File Management', 'OS', 'shutil', 'Automation'],
    github: 'https://github.com/Mrtracker-new/Sortify',
    download: 'https://github.com/Mrtracker-new/Sortify/releases/download/v1.0/Sortify_Setup.exe',
    featured: true,
    image: sortify.src,
    imageSrcSet: sortify.srcSet,
  },
  {
    id: 4,
    slug: 'invisiovault-web',
    title: 'InvisioVault — Web',
    category: 'Web Application',
    description: 'Browser-based steganography and polyglot file tool. Hide files inside images via LSB embedding, or generate dual-format polyglot files — a PNG that is simultaneously a valid ZIP. No installation. Works on any device.',
    longDescription: 'InvisioVault Web is the browser-based counterpart to the desktop app. Built with a React frontend and Flask backend deployed on Vercel, it offers two distinct capabilities: LSB steganography to embed files inside PNG/JPG images server-side, and a polyglot file engine that concatenates binary headers to produce files valid in two formats simultaneously (e.g., a PNG that is also a ZIP archive).\n\nNo installation required. Accessible from any device with a browser.',
    caseStudy: {
      problem: 'The desktop InvisioVault required installation and was Windows-only. Users needed a browser-based version that works everywhere — and the ability to create polyglot files (e.g., a PNG that is simultaneously a valid ZIP).',
      solution: 'Built a full-stack web app with a React frontend and Flask backend deployed on Vercel. The polyglot engine concatenates binary file headers to create dual-format files, while the steganography engine handles the image embedding server-side.',
      impact: 'Live at invisio-vault.vercel.app — accessible from any browser, no installation needed. Serves users across multiple countries. Demonstrates both steganography and polyglot file generation in a single interface.',
      learnings: 'Handling binary Blob uploads through a REST API was trickier than expected — learned to use multipart/form-data correctly. Would add end-to-end encryption in the browser (Web Crypto API) so the server never sees plaintext files.',
    },
    technologies: ['React', 'Flask', 'Python', 'Steganography', 'AES-256', 'Polyglot Files'],
    github: 'https://github.com/Mrtracker-new/InvisioVault',
    liveDemo: 'https://invisio-vault.vercel.app/',
    featured: false,
    image: invisioVaultWeb.src,
    imageSrcSet: invisioVaultWeb.srcSet,
  },
  {
    id: 5,
    slug: 'yt-downloader',
    title: 'YT-Downloader',
    category: 'Web Application',
    description: 'Full-stack tool for streaming binary media data through an Express API. Wraps yt-dlp to handle format conversion and quality selection, with zero server-side storage and direct browser streaming.',
    longDescription: 'A full-stack web application exploring binary data streaming through a REST API. The Node.js/Express backend wraps yt-dlp to handle media extraction, format conversion (1080p, 720p, 480p video and MP3 audio), and streams output directly to the browser without storing anything server-side.\n\nBuilt with React and Material-UI on the frontend, with a health-check ping on page load to handle Render cold-start latency. An exercise in understanding how binary stream piping, download headers, and concurrent request management work in a Node.js context.',
    caseStudy: {
      problem: 'Wanted to understand how binary data streaming works in a full-stack context — specifically how a backend can pipe a media stream directly to a browser download without buffering the full file in memory.',
      solution: 'Wrapped yt-dlp in a Node.js/Express API that pipes the output stream directly to the HTTP response. Users select format and quality on the React frontend; the backend handles extraction and format conversion in a single pass.',
      impact: 'Handles 1080p, 720p, 480p video and MP3 audio extraction. Zero data stored server-side. Download times average under 10 seconds for standard-length videos. Hosted on Render.',
      learnings: 'Render free tier cold-start delays required a health-check ping on page load. Concurrent download requests can saturate a single-process Node server — would implement a Bull/Redis job queue for production-scale concurrency.',
    },
    technologies: ['React', 'Node.js', 'Express', 'yt-dlp', 'Material-UI'],
    github: 'https://github.com/Mrtracker-new/YT-Downloader',
    liveDemo: 'https://yt-rnr.onrender.com/',
    featured: false,
    image: ytDownloader.src,
    imageSrcSet: ytDownloader.srcSet,
  },
  {
    id: 6,
    slug: 'cursorcam',
    title: 'CursorCam',
    category: 'Web Application',
    description: 'Hands-free mouse control via webcam using MediaPipe facial landmark detection. Maps head pitch and yaw angles to screen coordinates in real-time at under 50ms latency. Built for users with motor disabilities or RSI.',
    longDescription: 'CursorCam replaces the physical mouse with head movement. Using MediaPipe facial landmark detection, it maps head pitch and yaw angles to screen coordinates in real-time through a Flask backend. A lightweight JavaScript frontend handles cursor positioning and gesture-based click events at sub-50ms latency.\n\nBuilt specifically for users with motor disabilities or RSI injuries who cannot comfortably use conventional input devices. Requires only a standard webcam — no specialised hardware, no driver installation.',
    caseStudy: {
      problem: 'Users with motor disabilities or RSI injuries struggle with conventional mouse/keyboard input. Affordable head-tracking hardware is often inaccessible or overly complex to configure.',
      solution: 'Leveraged MediaPipe facial landmark detection to map head pitch/yaw angles to screen coordinates in real-time via a Flask backend. A lightweight JavaScript frontend handles cursor positioning and gesture-based clicking at sub-50ms latency.',
      impact: 'Enables fully hands-free mouse control using any standard webcam — no hardware purchase required. Tested with users who reported measurably reduced physical strain during extended sessions.',
      learnings: 'Lighting conditions significantly affect landmark detection accuracy. Would add adaptive brightness preprocessing and per-session sensitivity calibration. Smooth cursor interpolation (lerp) proved essential for usability — raw coordinate mapping was too jittery to be practical.',
    },
    technologies: ['Python', 'Flask', 'JavaScript', 'MediaPipe', 'Computer Vision'],
    github: 'https://github.com/Mrtracker-new/CursorCam',
    featured: false,
  },
  {
    id: 7,
    slug: 'rnr-portfolio',
    title: 'RNR Portfolio',
    category: 'Web Application',
    description: 'This portfolio. Custom-built React + TypeScript SPA with Framer Motion, code-split lazy loading, and accessibility-first component architecture. Scores 95+ across Lighthouse Performance, Accessibility, and SEO.',
    longDescription: 'This site. Built from scratch with React, TypeScript, Vite, and Framer Motion. Design decisions were driven by performance constraints: lazy-loaded routes, webp image optimisation, prefers-reduced-motion support, and semantic HTML throughout.\n\nScores 95+ across Lighthouse Performance, Accessibility, and SEO metrics. Hosted on Netlify with CI/CD on every commit. Styled with styled-components — a choice I would revisit in favour of CSS Modules to reduce runtime overhead.',
    caseStudy: {
      problem: "Generic portfolio templates look identical and fail to communicate a developer's actual personality or technical depth. Recruiters spend under 10 seconds on a portfolio before deciding.",
      solution: 'Designed and built a custom React + TypeScript portfolio from scratch with Framer Motion page transitions, an accessibility-first component hierarchy, SEO-optimised metadata, and performance budgets enforced via Vite build analysis.',
      impact: 'Lighthouse scores: Performance 95+, Accessibility 95+, SEO 100. Hosted on Netlify with CI/CD on every commit. Fully responsive across mobile, tablet, and desktop.',
      learnings: 'Animation and accessibility are often in tension — prefers-reduced-motion support is non-negotiable. Also discovered that styled-components adds non-trivial runtime overhead; would evaluate CSS Modules next time.',
    },
    technologies: ['React', 'TypeScript', 'Styled-Components', 'Framer Motion', 'Vite', 'Netlify'],
    github: 'https://github.com/Mrtracker-new/RNR',
    featured: false,
  },
  {
    id: 8,
    slug: 'contact-manager',
    title: 'Contact-Manager',
    category: 'Android App',
    description: 'Free contact management app for Android. Organize contacts with notes, files, and links. Clean, responsive contact manager with search, edit, and backup features. APK available for download.',
    longDescription: 'Contact Manager is a modern, feature-rich contact management application for Android and web. This free app helps you organize personal and professional contacts with advanced features beyond basic phone contacts. Store detailed contact information, attach files and documents, add notes and reminders, save useful links, and efficiently search through your contacts. Built with TypeScript and Tailwind CSS for a clean, responsive, and fast user interface. Features include: add/edit/delete contacts, advanced search and filtering, attach multiple files per contact, rich text notes, categorization with tags, favorites system, dark mode support, local storage with export/import, and cross-platform support (Android APK + Web). Perfect for professionals, entrepreneurs, and anyone needing robust contact organization. Download the free Android APK or use the web version online.',
    caseStudy: {
      problem: "Native Android contact apps are locked to the phone's ecosystem and lack features like file attachments, rich notes, or offline web access. Users wanted a cross-platform alternative they actually own.",
      solution: 'Built a Progressive Web App with a React + TypeScript frontend and Tailwind CSS, published simultaneously as an Android APK via Capacitor. Local storage with JSON export/import ensures users control their data entirely.',
      impact: 'Available as a web app (contact-manager-rnr.vercel.app) and an installable Android APK. Features advanced search, tag filtering, file attachments, and dark mode. Used by early testers across Android and desktop browsers.',
      learnings: 'PWA caching strategies are nuanced — a bad service worker can serve stale data indefinitely. Learned to implement a network-first cache strategy for dynamic content. Would add end-to-end encrypted cloud sync as an opt-in feature in v2.',
    },
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Progressive Web App', 'Android'],
    github: 'https://github.com/Mrtracker-new/Contact-manager',
    liveDemo: 'https://contact-manager-rnr.vercel.app/',
    download: 'https://github.com/Mrtracker-new/Contact-manager/releases/download/v1.0/Contact-Manager.apk',
    featured: false,
    image: contactManager.src,
    imageSrcSet: contactManager.srcSet,
  },
  {
    id: 9,
    slug: 'linknest',
    title: 'LinkNest',
    category: 'Android App',
    description: 'Offline-first Android and iOS app for organising links, documents, and notes. Local SQLite database, full-text search, category and tag system. Zero internet permission. A genuinely private alternative to Pocket and Raindrop.io.',
    longDescription: 'LinkNest is an offline-first mobile app for organising links, documents, and notes — built as a private alternative to cloud-based tools like Pocket and Raindrop.io.\n\nAll data is stored in a local SQLite database. Full-text search, category and tag organisation, and document attachment support are built in. Zero internet permission is declared in the manifest — privacy is verifiable, not a marketing claim.\n\nReleased as LinkNest v2.0 APK. Supports Android and iOS via Flutter.',
    caseStudy: {
      problem: 'Cloud-based bookmarking tools (Pocket, Raindrop.io) require accounts, phone home constantly, and delete your data when you stop paying. Users wanted a genuinely private, offline-first alternative they fully control.',
      solution: 'Built a Flutter mobile app with a local SQLite database, full-text search, category/tag organisation, and document attachment support. All data lives exclusively on the device — no network permission required.',
      impact: 'Released as LinkNest v2.0 APK. Supports Android and iOS. Handles thousands of links and documents with instant full-text search. Zero internet permission declared — verifiable privacy by design.',
      learnings: 'Flutter cross-platform support is mostly true, but platform-specific file picker behaviour required separate Android and iOS implementations. Would prioritise a unified abstraction layer earlier to avoid late-stage rewrites.',
    },
    technologies: ['Flutter', 'Dart', 'SQLite', 'Android', 'iOS'],
    github: 'https://github.com/Mrtracker-new/LinkNest',
    download: 'https://github.com/Mrtracker-new/LinkNest/releases/download/v2.0/LinkNest-v2.0.apk',
    featured: false,
    image: linkNest.src,
    imageSrcSet: linkNest.srcSet,
  },
  {
    id: 10,
    slug: 'bar-web',
    title: 'BAR — Web',
    category: 'Web Application',
    description: "A privacy-first web platform for encrypted self-destructing file sharing and end-to-end encrypted ephemeral chat. Files self-destruct on a timer or after a set number of views. What you share stays yours — until it's gone.",
    longDescription: "Most platforms treat your data like a permanent record. BAR treats it like a secret.\n\nBurn After Reading is a full-stack web application I built to solve a real gap: people needed a way to share sensitive files and have real-time private conversations without leaving a permanent digital footprint.\n\nFiles are encrypted before they hit the server. Each file can be configured to self-destruct after a time limit or a set number of views. The Burn Chat feature provides end-to-end encrypted real-time messaging that automatically disappears — powered by ECDH key exchange and AES-GCM, so the server never holds readable content.\n\nThe architecture is built on zero-knowledge principles: even I can't read what users share. OTP verification, webhook support, brute-force protection, and secure session handling are all baked in from day one — not bolted on as an afterthought.",
    caseStudy: {
      problem: "Traditional file-sharing and messaging platforms keep your data long after you're done with it. Passwords, contracts, and sensitive conversations sit on servers with no expiry. Users have no real control over who accesses their content or for how long — creating serious privacy and compliance risks.",
      solution: "Built a zero-knowledge web platform where files are encrypted client-side before upload. Each share is given a configurable TTL (time-to-live) or view count limit, after which the content is permanently destroyed. Burn Chat adds real-time E2E encrypted messaging via WebSockets using ECDH key exchange, so the server acts as a relay — never as a reader.",
      impact: 'Demonstrates practical application of modern cryptography in a user-facing product. Implements AES-256 encryption, ECDH key exchange, OTP verification, secure session handling, webhook support, and automated content destruction — while keeping the UI approachable for non-technical users.',
      learnings: "Zero-knowledge architecture forces you to think differently about state. The server can't help you debug what it can't read. Learned to design thorough client-side logging and error boundaries early. ECDH key exchange for browser-based E2E encryption was the most technically demanding piece — the Web Crypto API is powerful but unforgiving. Would add per-file key rotation in the next iteration.",
    },
    technologies: ['React', 'Python', 'WebSockets', 'AES-256', 'ECDH', 'Zero-Knowledge', 'OTP', 'Webhooks'],
    github: 'https://github.com/Mrtracker-new/BAR-Web',
    liveDemo: 'https://bar-rnr.vercel.app/',
    featured: true,
    image: barWeb.src,
    imageSrcSet: barWeb.srcSet,
  },
  {
    id: 11,
    slug: 'netplus',
    title: 'NetPlus',
    category: 'Desktop Application',
    description: 'Local-first network observability platform built with Rust, React, and Tauri for packet decoding, flow reconstruction, protocol exploration, and security analysis with PCAP/PCAPNG processing at its core.',
    longDescription: 'NetPlus (NetPulse) is a beginner-friendly, production-grade Internet observability platform built in Rust and React/Tauri. Reconstructs and visualizes network events on your computer locally and privately.\n\nInstead of presenting raw packet bytes first, NetPlus delivers structured network flow narratives and calibrated confidence scoring, keeping deep technical inspection one click away.\n\nArchitected as a multi-crate Rust workspace (netpulse-engine, netpulse-decode, netpulse-flow, netpulse-storage) paired with a React/Tauri desktop interface.',
    caseStudy: {
      problem: 'Traditional packet analyzers present overwhelming raw hex streams without context, while commercial monitoring tools stream user telemetry to third-party cloud servers.',
      solution: 'Built a local-first network observability platform with Rust, React, and Tauri for packet decoding, flow reconstruction, protocol exploration, and security analysis, with PCAP/PCAPNG processing and offline-first analysis at its core.',
      impact: 'Established a multi-crate Rust workspace spanning packet capture, decoding, flow reconstruction, storage, intelligence, API contracts, and a React/Tauri desktop interface, with strong local-first privacy boundaries and deterministic test/replay infrastructure.',
      learnings: 'Designing process-isolated multi-crate Rust architectures with Tauri v2 IPC required enforcing strict API boundaries. Balancing real-time packet processing throughput against UI re-render frequency highlighted the importance of batched state updates and IPC backpressure.',
    },
    technologies: ['Rust', 'Tauri', 'React', 'TypeScript', 'SQLite', 'PCAP'],
    github: 'https://github.com/Mrtracker-new/NetPlus',
    featured: true,
    image: netPlus.src,
    imageSrcSet: netPlus.srcSet,
  },
  {
    id: 12,
    slug: 'yt-downloader-desktop',
    title: 'YT Downloader — Desktop',
    category: 'Desktop Application',
    description: 'Native desktop media downloader built with Rust, Tauri, and React. Supports up to 8K video, multiple audio formats, playlists, subtitles, SponsorBlock, and concurrent downloads.',
    longDescription: 'YT Downloader is a native desktop application for grabbing video and audio from YouTube, Vimeo, SoundCloud, and other supported platforms. Built with Rust and Tauri v2 on the backend and React on the frontend.\n\nFeatures include up to 8K resolution video, codec selection (H.264, VP9, AV1), lossy/lossless audio extraction (MP3, FLAC, WAV, Opus), playlist batch processing, thumbnail metadata embedding, custom SponsorBlock segment filtering, and cookie borrowing for gated content.\n\nShips as a standalone Windows installer (.exe) with automatic local setup of yt-dlp and FFmpeg binaries.',
    caseStudy: {
      problem: 'Web-based media downloaders are plagued with intrusive advertisements, rate limits, quality degradation, and privacy risks from tracking user media URLs.',
      solution: 'Built a native desktop application using Rust and Tauri v2 that manages yt-dlp and FFmpeg child processes to download up to 8K video and audio directly to local disk with per-job quality, codec, thumbnail embedding, and SponsorBlock options.',
      impact: 'Released a packaged Windows installer featuring automated prerequisite setup, multi-format conversion, concurrent download queueing, and SponsorBlock integration.',
      learnings: 'Managing asynchronous child process execution for yt-dlp and FFmpeg in Rust required implementing strict process lifecycle cleanup. Implementing async IPC progress events prevented UI locking during long FFmpeg file-stitching operations.',
    },
    technologies: ['Rust', 'Tauri', 'React', 'TypeScript', 'yt-dlp', 'FFmpeg'],
    github: 'https://github.com/Mrtracker-new/YT_Download',
    download: 'https://github.com/Mrtracker-new/YT_Download/releases/',
    featured: true,
    image: ytDownloaderDesktop.src,
    imageSrcSet: ytDownloaderDesktop.srcSet,
  },
];

export const PROJECT_CATEGORIES = ['All', 'Desktop Application', 'Web Application', 'Android App'] as const;

export const projectPath = (slug: string): string => `/projects/${slug}`;

export function getProjectBySlug(slug: string | undefined): Project | null {
  if (!slug) return null;
  return projectsData.find(project => project.slug === slug) ?? null;
}
export type ProjectCategory = typeof PROJECT_CATEGORIES[number];
