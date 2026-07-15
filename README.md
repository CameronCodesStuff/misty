# MISTY

A link-in-bio platform with animated 4K video backgrounds, a liquid-glass profile system, and Pro subscriptions.

**Live:** https://cameroncodesstuff.github.io/misty/

## Features

- Customisable profile pages — avatar, typing bio, badges, links, widgets, location
- 43 video backgrounds (4K/1080p) plus gradient, image, and animated themes
- Click-to-unlock lock screen with custom text (Pro)
- Profile audio with a built-in music player (Pro)
- Community templates — publish your theme, use anyone else's
- Discover page with live profile previews
- View, like, and per-link click tracking
- Misty Pro subscription via Stripe

## Stack

Vanilla JS · Firebase (Auth + Firestore) · Stripe · Cloudflare Workers · GitHub Pages

No build step. No frameworks. Edit a file, push, done.

## Structure

```
index.html          app shell
app.js              the whole app
style.css           the whole style
404.html            SPA routing for GitHub Pages
assets/backgrounds/ video backgrounds (all under 25MB)
assets/posters/     one poster jpg per video
make-posters.bat    regenerates posters (needs ffmpeg)
```

## Adding a background video

1. Drop the mp4 into `assets/backgrounds/` (keep it under 25MB)
2. Add an entry to `BG_VIDEOS` in `app.js`
3. Run `make-posters.bat`
4. Push

## Pro / Stripe

Payments run through a Stripe payment link. A Cloudflare Worker receives the
webhook, verifies the signature, and flips `pro` on the user's Firestore doc.
The `/thanks` page confirms activation live after checkout.
