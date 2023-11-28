<p align="center">
<img src="https://raw.githubusercontent.com/seguinleo/Bloc-notes/main/src/assets/icons/icon192.png" alt="Logo" width="72" height="72">
</p>
<h1 align="center">Bloc-notes</h1>

<p align="center">
<b>Bloc-notes</b> is a free, open source and encrypted notebook.
</p>

<p align="center">
<img alt="" src="https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=8ab4f8&up_message=online&url=https://leoseguin.fr/projets/notes/?color=8ab4f8&style=for-the-badge">
<img alt="" src="https://img.shields.io/github/license/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="" src="https://img.shields.io/github/issues/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="" src="https://img.shields.io/mozilla-observatory/grade/leoseguin.fr.svg?color=8ab4f8&style=for-the-badge">
</p>

## Table of contents
*   [Why?](#why)
*   [Features](#features)
*   [Design](#design)
*   [Security/Privacy](#security-and-privacy)
*   [Languages](#languages)
*   [Todo](#todo)
*   [Community](#community)
*   [For developers](#for-developers)

## Why?
When I was looking for a note-taking application, I faced several difficulties: Google Keep and OneNote don't respect privacy, Standard Notes and Obsidian can be light without having to pay (no Markdown or no Sync). So I decided to create my own notebook that respects users' privacy and easy to use.

## Features
All notes are encrypted with ``AES-256-GCM``.

The user can save and edit notes, change color, copy, export and use Markdown or HTML. The user can create tasks lists, tables, links, code blocks, etc. The user can also search for notes by title. Read my [Markdown guide](https://github.com/seguinleo/Bloc-notes/wiki/Markdown).

The user can also sign in to sync all notes between their devices or browsers in a secure database. The user can also make a note public and share it via a random URL. No email is required, only a username and a strong password.

This website is a PWA (Progressive Web App), the user can install it as an application. Service Worker has automatic updates.

## Design
The website is fully responsible for mobile devices. The icons come from [Fontawesome](https://github.com/FortAwesome/Font-Awesome). The website is also accessible for people with disabilities thanks to high-contrast colors, ARIA modules and focusable elements. A light/dark mode is also available.

## Security and Privacy
The user's connection for online sync is maintained by a secure cookie with a shelf life of 1 week. The website is hosted in France by OVHcloud on my personal server. The website is always up to date with the latest security patches.

Passwords are hashed with the latest algorithms before being sent to the database.

Each user has their own randomly generated 32-byte encryption key and salt. Once logged in, the user can change their password or delete their account according to the GDPR. Security measures are in place against XSS, CSRF and SQL injections.

Bloc-notes stores the username, hashed password, and encrypted notes in a secure database until the user deletes this data themselves. Only the user has access to the content of their encrypted notes. The website editor disclaims any responsibility for the content of user notes.

> [!WARNING]
> Never store passwords or too personal data in your notes regardless of the service.

## Languages
🇫🇷French, 🇬🇧English, 🇩🇪German

## Todo
- [x] Share notes with a random link
- [x] Export notes in text file
- [ ] Pin notes
- [ ] Categories
- [ ] Spanish translation
- [ ] ...

## Community
If you find [issues](https://github.com/seguinleo/Bloc-notes/issues), [vulnerabilities](https://github.com/seguinleo/Bloc-notes/security) or if you have any suggestions to improve this project, feel free to [discuss](https://github.com/seguinleo/Bloc-notes/discussions)!

## For developers
Documentation: [W3C](https://www.w3.org/), [MDN Web Docs](https://developer.mozilla.org/en-US/), [OWASP](https://cheatsheetseries.owasp.org/), [PHP Delusions](https://phpdelusions.net/)

Technologies: JavaScript, PHP and MySQL

Dependencies: ESLint, PHP_CodeSniffer, Sass and [Showdownjs](https://github.com/showdownjs/showdown) (modified)

``npm i`` and ``composer i`` to install all dependencies

``npx eslint file.js`` to verify JavaScript files

``vendor/bin/phpcs --standard=PSR2 file.php`` to verify PHP files

``npm run sass`` to compile Saas files

``docker-compose up --build`` to build the Docker container

[GPL-3.0](https://github.com/seguinleo/Bloc-notes/blob/main/LICENSE)

![Desktop preview](https://github.com/seguinleo/Bloc-notes/blob/main/src/assets/img/desktop.png)
![Mobile preview](https://github.com/seguinleo/Bloc-notes/blob/main/src/assets/img/mobile.png)
