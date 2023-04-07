# Bloc-notes
![Issues](https://img.shields.io/github/issues/PouletEnSlip/Bloc-notes)
![License](https://img.shields.io/github/license/PouletEnSlip/Bloc-notes)
[![CodeQL](https://github.com/PouletEnSlip/Bloc-notes/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/PouletEnSlip/Bloc-notes/actions/workflows/github-code-scanning/codeql)

[![Icon](https://raw.githubusercontent.com/PouletEnSlip/Bloc-notes/main/src/assets/icons/icon48.png)](https://leoseguin.fr/projets/notes/)

Bloc-notes is a free and open source and encrypted notebook website developed with PHP and JavaScript.

## Table of contents
- [Why?](#why)
- [Features](#features)
- [Design](#design)
- [PWA](#pwa)
- [Security/Privacy](#security-and-privacy)
- [Languages](#languages)
- [Community](#community)

## Why?
When I was looking for a note-taking application, I faced several difficulties: Google Keep and OneNote don't respect privacy, Standard Notes and Obsidian are very light without having to pay...
So I decided to create my own notebook that respects users' privacy and is end-to-end encrypted.

## Features
The user can save and edit notes locally in JSON, change notes color, copy notes and use Markdown to create titles, lists, links, images and checkboxes thanks to [Showdownjs](https://github.com/showdownjs/showdown). See the Markdown [guide](https://github.com/PouletEnSlip/Bloc-notes/wiki/Markdown).

The user can also sign in to sync all notes between their devices or browsers (supports Windows, macOS, Android, iOS, Chromium, Firefox and Safari) and encrypt content with ``AES-256-GCM`` in a SQL database. The user can also hide his notes. The user's connection is maintained by a secure cookie with a shelf life of 1 week.

## Design
Styles made with Sass. The website is fully responsible for mobile devices and UI/UX inspired by Material Design. The icons come from [Fontawesome](https://github.com/FortAwesome/Font-Awesome). The website is also accessible for people with disabilities.

## PWA
This website is a PWA (Progressive Web App), the user can install it as an application with a Chromium-based browser. Service Worker has automatic update.

## Security and Privacy
Passwords are hashed with bcrypt before being sent to the database. Once logged in, the user can change their password or delete their account. Security measures are in place against XSS, CSRF and SQL injections.
No personal data is collected, no one but the user can see the content of their notes, even the website creator (GDPR).

## Languages
🇫🇷French, 🇬🇧English

## Community
If you have any suggestions to improve this project or if you find issues, feel free to discuss!

![Preview](https://github.com/PouletEnSlip/Bloc-notes/blob/main/image.png)
