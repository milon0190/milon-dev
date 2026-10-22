# MD MILON MIA — Premium Portfolio V8

A custom-coded, responsive portfolio with editable profile content, service cards, project cards, cover-image uploads, extra screenshot galleries, project case studies, live demo/source links, and a WhatsApp inquiry flow.

## Run locally

Open `index.html` in a modern browser. Open `admin.html` to manage content in the same browser. For best results, run through a local static server (for example, VS Code Live Server) so browser behavior matches hosting more closely.

## Admin capabilities

- Edit profile name, role, headline, bio, portrait, favicon, contact details, socials, stats and technology strip.
- Add, edit, reorder and delete services and projects.
- Upload a project cover screenshot and up to six additional screenshots per edit session, or paste screenshot URLs.
- Edit project category, description, project goal, feature list, stack, live demo URL, public GitHub URL, implementation notes, verified outcome and WhatsApp inquiry message.
- Export/import JSON backups.
- Project case studies are rendered on the public page from the editable project data.

## Critical security and publishing limitation

This is a **static, browser-local editing prototype**, not a secure production CMS. Its login check runs in JavaScript and can be bypassed by anyone who can inspect the public files. Content is stored in that browser's `localStorage`; edits do not automatically sync to visitors, other browsers, or devices. Uploaded images are stored as compressed data URLs and browser storage has limited capacity. Do not use this panel to protect sensitive data or publish confidential information.

For a genuinely production-ready admin panel, connect a server-side backend and database. A suitable option is Supabase with Supabase Auth, Row Level Security policies, a private admin role, and Supabase Storage for screenshots. Never put service-role keys in frontend code. Configure authorization on the server/database, validate all writes, and test policies before deployment. Exported JSON backups can be used during migration.

The inquiry form prepares a WhatsApp draft; it does not send or persist a lead on a server. For durable lead capture, connect a secure form endpoint or backend and add privacy/spam protections.

## Deploy

The public portfolio can be hosted on static hosting, but do not treat the included local admin login as a security boundary on a public deployment. Configure a real backend before exposing production content management. Verify all project URLs, contact details, external links, and image rights before launch.


## Firebase setup (GitHub Pages)

This version is wired to Firebase project `milon-portfolio` using the Web App config provided by the owner. It uses Firebase Authentication (Email/Password) and one Firestore document: `portfolio/content`.

1. In Firebase Console → Authentication → Sign-in method, enable Email/Password. Confirm your admin user exists.
2. In Firestore Database, create the database.
3. In Firestore → Rules, paste the rules shown below, replacing `PASTE_ADMIN_UID_HERE` with the UID of the single admin account, then Publish.
4. Keep the admin email/password in Firebase Authentication, not in source code. The admin login now uses email/password.
5. Deploy this folder to GitHub Pages. The public site reads the published `portfolio/content` document; only the configured UID may write it.

Firestore Rules (replace the UID before publishing):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/content {
      allow read: if true;
      allow create, update, delete: if request.auth != null && request.auth.uid == 'PASTE_ADMIN_UID_HERE';
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

The first admin save creates `portfolio/content`. The public page reads this document. Until a Cloudinary upload preset is configured, image buttons prompt for a public HTTPS image URL; this avoids saving large base64 images into Firestore. Create a Cloudinary unsigned upload preset with restrictive file types/size before enabling direct browser uploads. Do not expose a Cloudinary API secret or Firebase service-account key.

Security note: Firebase web config is designed to be present in client-side apps; Firestore Security Rules are the authorization boundary. Replace the placeholder UID with the actual admin UID. Do not publish permissive rules.
