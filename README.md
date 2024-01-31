<p align="center">
<img src="https://raw.githubusercontent.com/seguinleo/Bloc-notes/main/src/assets/icons/icon192.png" alt="Logo" width="72" height="72">
</p>
<h1 align="center">Bloc-notes</h1>

<p align="center">
<b>Bloc-notes</b> is a free, open source and encrypted notebook.
</p>

<p align="center">
<img alt="Status" src="https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=8ab4f8&up_message=online&url=https://leoseguin.fr?color=8ab4f8&style=for-the-badge">
<img alt="License" src="https://img.shields.io/github/license/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="Issues" src="https://img.shields.io/github/issues/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="MozillaObservatory" src="https://img.shields.io/mozilla-observatory/grade/leoseguin.fr.svg?color=8ab4f8&style=for-the-badge">
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
When I was looking for a note-taking application, I faced several difficulties: Google Keep and OneNote do not respect users' privacy, Standard Notes and Obsidian can be lightweight without having to pay (no Markdown or Sync). So I decided to create my own notebook, respectful of users' privacy and easy to use.

## Features
All notes are encrypted with ``AES-256-GCM``.

The user can save and edit notes, change color, copy, export and use Markdown/HTML5. The user can create tasks lists, tables, links, code blocks, etc. The user can also search for notes by title or add categories. Read my [Markdown guide](https://github.com/seguinleo/Bloc-notes/wiki/Markdown).

The user can also sign in to sync all notes between their devices or browsers in a secure database. The user can also make a note public and share it via a random URL. No email is required, only a username and a strong password.

This website is a PWA (Progressive Web App), the user can install it as an application. Service Worker has automatic updates.

## Design
The website is fully responsible for mobile devices. The icons come from [Fontawesome](https://github.com/FortAwesome/Font-Awesome). The website is also accessible for people with disabilities thanks to high-contrast colors, ARIA modules and focusable elements. A light/dark mode is also available and the user can choose the accent color of the entire page.

## Security and Privacy
The user's connection for online sync is maintained by a secure cookie. The website is hosted in France by OVHcloud. The server is always up to date with the latest security patches.

Passwords are hashed with the latest algorithms before being sent to the database.

Each user has their own randomly generated 32-byte encryption key and salt. Once logged in, the user can change their password or delete their account according to the GDPR. Security measures are in place against XSS, CSRF and SQL injections.

Bloc-notes stores the username, hashed password, and encrypted notes in a secure database until the user deletes this data themselves. Only the user has access to the content of their encrypted notes. The website editor disclaims any responsibility for the content of user notes.

The user can use its fingerprint to unlock the notes. The fingerprint is stored in the browser's local storage and is not sent to the server.

> [!WARNING]
> Never store passwords or too personal data in your notes regardless of the service, even if it is encrypted.

## Languages
🇫🇷French, 🇬🇧English, 🇩🇪German, 🇪🇸Spanish

## Todo
*   Pin notes
*   2FA

## Community
If you find [issues](https://github.com/seguinleo/Bloc-notes/issues), [vulnerabilities](https://github.com/seguinleo/Bloc-notes/security) or if you have any suggestions to improve this project, feel free to [discuss](https://github.com/seguinleo/Bloc-notes/discussions)!

## For developers
Documentation: [W3C](https://www.w3.org/), [MDN Web Docs](https://developer.mozilla.org/en-US/), [OWASP](https://cheatsheetseries.owasp.org/), [PHP Delusions](https://phpdelusions.net/)

Technologies: JavaScript, PHP8+ and MySQL

Dependencies: ESLint, PHP_CodeSniffer, Sass, [DOMPurify](https://github.com/cure53/DOMPurify) and [Showdownjs](https://github.com/showdownjs/showdown) (modified)

``npm i`` and ``composer i`` to install all dependencies

``npx eslint file.js`` to verify JavaScript files

``vendor/bin/phpcs --standard=PSR2 file.php`` to verify PHP files

``npm run sass`` to compile Saas files

``docker-compose up --build`` to build the Docker container

> [!NOTE]
> For self-hosting, base URL is ``localhost/seguinleo-notes/``, just put ``src`` folder in your localhost and rename it ``seguinleo-notes``. Database name is ``seguinleo-notes``. HTTPS is highly recommended.

![Desktop preview](https://github.com/seguinleo/Bloc-notes/blob/main/src/assets/img/desktop.png)
