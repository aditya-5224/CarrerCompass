# CarrerCompass

## Team Details

- Team Lead: Aditya Yadav
  - Contact: 7068731914, yadi.tya5224@gmail.com
  - Role: Backend Development

- Team Name: Merge Conflicts
- Project Name: Career Compass
- Track Name: Open Innovation - EdTech

- Team Members:
  - Gaurika Pandey
    - Contact: 9695398118, gaurikapandey6457@gmail.com
    - Role: Frontend and UI/UX

  - Divyanshi Gupta
    - Contact: 6386323335, guptadivyanshi107@gmail.com
    - Role: Research and Documentation

  - Krishna Rathore
    - Contact: 6307000283, krishnasinghrathour9628@gmail.com
    - Role: Backend and API



## Getting Started

First, run the development server:
# CareerCompass

CareerCompass is an AI-assisted career navigation platform for students and early-career professionals. It combines career exploration, personalized learning roadmaps, skill assessment, interview practice, resume tailoring, opportunity discovery, and profile activity tracking in one Next.js application.

The project was created by team **Merge Conflicts** for the **Open Innovation - EdTech** track.

## What The Application Does

- Presents separate student and professional journeys from the landing page.
- Provides Firebase authentication through Google and email/password sign-in.
- Creates a MongoDB user record after authentication.
- Generates career roadmaps with Google Gemini, including phases, steps, resources, tools, skills, and job outcomes.
- Runs a timed skill test with English/Hindi question content and result analysis.
- Explores academic streams, semester subjects, skills, colleges, companies, and career paths in Career Galaxy.
- Tailors an uploaded or pasted resume to a job description using Gemini.
- Extracts resume text from supported document input and builds links to relevant job platforms.
- Generates a simple PDF from resume text through a server-side PDF route.
- Provides an AI interview chat with role, company, and stage context.
- Provides a local interview demo mode with a fixed question bank when appropriate.
- Displays opportunity alerts for hackathons, JPOs, and community events.
- Tracks the latest 20 user activities in browser `localStorage`.
- Sends feedback through EmailJS.
- Includes an SOS UI and API contract; the current backend simulates delivery until Twilio is installed and enabled.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript, CSS Modules |
| Animation and icons | Framer Motion, Lucide React |
| Authentication | Firebase Auth |
| User persistence | MongoDB with Mongoose |
| AI | Google Generative AI SDK and Gemini models |
| Resume/document handling | Mammoth, HTML generation, PDFKit, html2canvas, html2pdf.js, jsPDF |
| Interview assistance | Gemini, browser webcam APIs, `@vladmandic/face-api`, browser speech APIs |
| Feedback | EmailJS |
| Code quality | ESLint 9, TypeScript strict mode |

## Getting Started

### Prerequisites

- Node.js compatible with the installed Next.js version.
- npm, or another compatible JavaScript package manager.
- A Firebase project with Google and/or Email/Password authentication enabled.
- A MongoDB database if profile persistence is required.
- A Gemini API key for AI roadmap, resume, and interview features.

### Installation

```bash
npm install
```

Create `.env.local` in the project root using the configuration below, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Start the production server after building
```

## Environment Variables

The application reads environment variables from `.env.local`. Never commit this file or server-side API keys.

### Firebase client configuration

These variables are consumed by [src/lib/firebase.ts](src/lib/firebase.ts) and are exposed to the browser because they use the `NEXT_PUBLIC_` prefix:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Enable the required providers in Firebase Console under **Authentication > Sign-in method**.

### Server-side services

```bash
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=...
```

`MONGODB_URI` is required when `/api/auth/save-user` is called. `GEMINI_API_KEY` is required by roadmap generation, resume tailoring, and the AI interview endpoint.

### EmailJS feedback form

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

The EmailJS template should accept the fields `name`, `email`, `phone`, `message`, and `title`.

### SOS configuration

```bash
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
EMERGENCY_CONTACT_NUMBER=...
```

The route validates these values, but message delivery is currently commented out and simulated. Install and configure the Twilio SDK before treating SOS as a real emergency notification feature.

## Application Routes

### Browser pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page with hero, student/professional selection, language preference, animated background, and feedback form. |
| `/auth` | Google sign-in, email sign-in, account creation, password reset, and password-strength feedback. |
| `/profile` | Authenticated profile dashboard with user information, academic portal, opportunity alerts, and activity feed. |
| `/student/galaxy` | Static career and academic stream explorer with semester details, skills, colleges, companies, and roadmap links. |
| `/student/roadmap` | Career input and Gemini-generated learning roadmap with expandable phases and steps. |
| `/student/skill-test` | Multi-question skill assessment with English/Hindi content, timer and result views. |
| `/prof/resume-builder` | Resume upload/paste, job-description matching, role and skill detection, resume tailoring, and job-platform links. |
| `/prof/interview` | Interview setup, AI interview chat, fixed-question demo mode, webcam/face-expression support, voice input/output, and performance report. |
| `/prof/internships` | Resume analysis and ranked external job/internship platform links. |

The shared navbar is rendered by the root layout and is hidden on `/auth`. Profile pages redirect unauthenticated users to `/auth` in the client.

## API Routes

All API handlers are implemented under [src/app/api](src/app/api) as Next.js route handlers.

| Method and path | Request | Response and behavior |
| --- | --- | --- |
| `POST /api/auth/save-user` | `{ email, name, image, uid }` | Validates `email` and `uid`, then upserts a MongoDB `User` by Firebase UID. |
| `POST /api/roadmap/generate` | `{ career }` | Sends a strict JSON roadmap prompt to Gemini and returns the parsed roadmap object. |
| `POST /api/resume-builder/tailor` | `{ resumeText, jobDescription }` | Uses Gemini to return structured HTML resume fields tailored to the job description. Includes model fallback and retry behavior. |
| `POST /api/resume-builder/pdf` | `{ text }` | Creates an A4 PDF with PDFKit and returns it as `tailored-resume.pdf`. |
| `POST /api/interview` | `{ messages, role, company, stage }` | Sends interview history to Gemini and returns the next interviewer response. The prompt requests feedback and one question per turn. |
| `GET /api/opportunity-alerts` | None | Returns the current hardcoded hackathon, JPO, and community-event alert data with an `updatedAt` timestamp. |
| `POST /api/sos` | None | Validates Twilio-related environment variables and currently returns simulated success; it does not send a message yet. |

AI routes keep their API keys on the server. Input validation returns HTTP 400 for missing required fields, missing configuration generally returns HTTP 500, and provider failures are logged server-side and returned as JSON errors.

## Architecture

```text
Browser
  |
  +-- Next.js App Router pages (`src/app/**/page.tsx`)
  |     +-- Shared Navbar and AuthProvider
  |     +-- Feature-specific client components and CSS Modules
  |     +-- localStorage activity and language preferences
  |
  +-- Next.js route handlers (`src/app/api/**/route.ts`)
        +-- Firebase-authenticated user data -> MongoDB/Mongoose
        +-- AI requests -> Google Gemini
        +-- Resume text -> HTML/PDF generation
        +-- Static opportunity data -> JSON response
        +-- SOS contract -> simulated Twilio delivery
```

### Root layout and shared state

[src/app/layout.tsx](src/app/layout.tsx) loads global styles and Geist fonts, applies the shared top offset, wraps the application in `AuthProvider`, and renders `Navbar`.

[src/context/AuthContext.tsx](src/context/AuthContext.tsx) subscribes to Firebase `onAuthStateChanged`, exposes `user`, `loading`, and `logout`, and lets client pages react to authentication changes without duplicating the subscription.

[src/components/Navbar.tsx](src/components/Navbar.tsx) provides navigation, profile access, activity access, sign-in state, and logout behavior. It uses the current pathname to hide itself on the auth page.

### Authentication and persistence flow

1. A user signs in with Google or email/password on `/auth`.
2. Firebase establishes the client auth session.
3. The auth page asynchronously calls `POST /api/auth/save-user` with the Firebase user identity.
4. The API connects through the cached Mongoose connection in [src/lib/mongodb.ts](src/lib/mongodb.ts).
5. [src/models/User.ts](src/models/User.ts) upserts the user using the Firebase UID and stores email, name, image, provider metadata, and creation time.
6. The root `AuthProvider` observes the Firebase session and updates the navbar and protected client pages.

There is no server middleware authorization yet. [src/middleware.ts](src/middleware.ts) passes requests through with an empty matcher, so page protection is currently handled in client components and API routes do not verify Firebase ID tokens.

### Local activity tracking

[src/lib/activity.ts](src/lib/activity.ts) stores activity events in `localStorage` under `cc_activity_log`. It assigns a UUID and timestamp, keeps the newest 20 events, and provides relative-time formatting. This data is browser/device-specific and is not persisted in MongoDB.

## Feature Workflows

### Career roadmap

The roadmap page accepts a career or receives one from Career Galaxy through the `career` query parameter. It posts the career to Gemini through `/api/roadmap/generate`. The server requests a six-part JSON shape: overview, duration, difficulty, outcomes, tools, phases, and actionable steps. The client renders expandable steps, resources, skills, and completion state.

### Resume builder and job matching

The resume builder accepts resume text or document input, extracts content where supported, detects a likely role and known skills with local keyword maps, and sends the resume plus a job description to `/api/resume-builder/tailor`. Gemini returns structured HTML fragments for the resume template. The UI can preview the tailored/original content, download a PDF through `/api/resume-builder/pdf`, and open generated searches on LinkedIn, Naukri, Indeed, Glassdoor, Internshala, Wellfound, and Unstop.

The internships page uses local role, skill, and experience heuristics to rank external job platforms. It does not query those platforms directly.

### Interview practice

The interview page supports two modes:

- **AI mode:** sends chat history and interview metadata to `/api/interview`, which uses Gemini with a role/company/stage system instruction.
- **Demo mode:** uses the hardcoded company question bank in the page and does not require the AI endpoint.

Optional browser capabilities include webcam access, face-expression detection through CDN-loaded face-api models, speech recognition, and speech synthesis. These capabilities depend on browser permissions and browser support.

### Skill test and Career Galaxy

The skill test is primarily client-side. It contains question and translation data in the page, handles test state and timing in React, and presents an analysis/result view without a server scoring endpoint.

Career Galaxy is also data-driven on the client. Stream, semester, company, college, skill, and opportunity content is defined in [src/app/student/galaxy/galaxyData.ts](src/app/student/galaxy/galaxyData.ts). Selecting a company can link directly to a generated roadmap route.

## Project Structure

```text
src/
  app/
    page.tsx                         Landing page
    layout.tsx                       Global layout/providers/navbar
    auth/                             Firebase authentication UI
    profile/                          Profile, alerts, and activity dashboard
    student/
      galaxy/                         Academic and career explorer
      roadmap/                        AI roadmap UI
      skill-test/                     Client-side skill assessment
    prof/
      interview/                      Interview practice UI
      internships/                    Resume-based opportunity links
      resume-builder/                 Resume tailoring and PDF actions
    api/                              Server route handlers
  components/                         Shared feature components
  context/                            React context providers
  data/                               Static academic portal data
  lib/                                Firebase, MongoDB, and activity helpers
  models/                             Mongoose schemas
public/                               Static assets and model/browser resources
```

The `@/*` TypeScript alias maps to `src/*`, so imports such as `@/lib/firebase` resolve from the `src` directory.

## Current Limitations And Production Notes

- API routes currently do not verify Firebase ID tokens server-side.
- `/api/opportunity-alerts` returns mock data and includes placeholder external links for some entries.
- `/api/sos` simulates Twilio delivery; it is not an active emergency notification service.
- Profile activity and skill-test state are local to the browser and are not synchronized across devices.
- AI output depends on Gemini availability, model access, quota, and the quality of supplied text.
- Resume HTML is generated from model output, so production use should add stronger sanitization and validation before rendering user-visible HTML.
- Webcam and microphone features require explicit browser permissions and may not work in every browser or deployment context.
- The current middleware is intentionally pass-through; route protection should be moved to verified server-side authorization before production deployment.

## Team

- **Aditya Yadav** - Team lead, backend development - `yadi.tya5224@gmail.com`
- **Gaurika Pandey** - Frontend and UI/UX - `gaurikapandey6457@gmail.com`
- **Divyanshi Gupta** - Research and documentation - `guptadivyanshi107@gmail.com`
- **Krishna Rathore** - Backend and API - `krishnasinghrathour9628@gmail.com`

## Useful References

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [Firebase Authentication documentation](https://firebase.google.com/docs/auth)
- [Mongoose documentation](https://mongoosejs.com/docs/)
- [Google Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Vercel deployment documentation for Next.js](https://nextjs.org/docs/app/building-your-application/deploying)

