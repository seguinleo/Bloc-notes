<p align="center">
<img src="https://raw.githubusercontent.com/seguinleo/Bloc-notes/main/src/assets/icons/icon192.png" alt="Logo" width="72" height="72">
</p>
<h1 align="center">Bloc-notes</h1>

<p align="center">
<b>Bloc-notes</b> is an encrypted, private and secure notebook.
</p>

<p align="center">
<img alt="Status" src="https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=8ab4f8&up_message=online&url=https://leoseguin.fr?color=8ab4f8&style=for-the-badge">
<img alt="License" src="https://img.shields.io/github/license/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="Issues" src="https://img.shields.io/github/issues/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="MozillaObservatory" src="https://img.shields.io/mozilla-observatory/grade/leoseguin.fr.svg?color=8ab4f8&style=for-the-badge">
</p>

## Table of contents
*   [Features](#features)
*   [Design](#design)
*   [Security and Privacy](#security-and-privacy)
*   [Languages](#languages)
*   [Todo](#todo)
*   [Community](#community)
*   [For developers](#for-developers)
*   [Self-hosting](#self-hosting)

## Features
All notes, local or cloud, are encrypted with ``AES-256-GCM``.

The user can save and edit notes, change color, copy, export and use [Markdown/HTML](https://github.com/seguinleo/Bloc-notes/wiki/Markdown). The user can create tasks lists, tables, links, code blocks, etc. The user can also search for notes or filter by categories.

The user can also sign in to sync all notes between their devices or browsers in a secure database. The user can also make a note public and share it via a random URL. No email is required, only a username and a strong password.

This website is a PWA (Progressive Web App), the user can install it as an application. Service Worker has automatic updates.

## Design
The website is fully responsible for mobile devices. The icons come from [Fontawesome](https://github.com/FortAwesome/Font-Awesome). The website is also accessible for people with disabilities thanks to high-contrast colors, ARIA modules and focusable elements. A light/dark mode is also available and the user can choose the accent color of the entire page.

## Security and Privacy
The user's connection for online sync is maintained by a secure cookie. The website is hosted in France by OVHcloud. The server is always up to date with the latest security patches and protected by 2FA. The online login is also protected by Cloudflare's captcha.

Passwords are hashed with the latest algorithms before being sent to the database.

Each user has their own randomly generated 32-byte encryption key and salt. Once logged in, the user can change their password or delete their account according to the GDPR. Security measures are in place against XSS, CSRF, SSRF, SQL injections, etc.

Bloc-notes stores the username, hashed password, and encrypted notes in a secure database until the user deletes this data themselves. Only the user has access to the content of their encrypted notes. The website editor disclaims any responsibility for the content of user notes.

The user can use biometrics to unlock notes. Biometric data is stored in the browser's local storage and is never sent to the server.

> [!WARNING]
> Never store passwords or too personal data in your notes regardless of the service, even if it is encrypted.

## Languages
FR, EN, DE, ES

## Todo
*   2FA login
*   Password recovery
*   Password protected notes

## Community
If you find [issues](https://github.com/seguinleo/Bloc-notes/issues), [vulnerabilities](https://github.com/seguinleo/Bloc-notes/security) or if you have any suggestions to improve this project, feel free to [discuss](https://github.com/seguinleo/Bloc-notes/discussions)!

## For developers
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/46922caf959d46f0afd3ce49e956d0d4)](https://app.codacy.com/gh/seguinleo/Bloc-notes/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

Documentation: [MDN Web Docs](https://developer.mozilla.org/en-US/), [OWASP](https://cheatsheetseries.owasp.org/), [PHP Delusions](https://phpdelusions.net/)

Technologies: JavaScript, PHP, MySQL, SASS, Docker, ESLint

Javascript libraries: [DOMPurify](https://github.com/cure53/DOMPurify) and [Marked](https://github.com/markedjs/marked) (modified checkboxes and crossorigin images)

``npm i`` to install all dependencies

## Self-hosting

``docker-compose up --build`` to build the Docker container, MySQL database is included with phpMyadmin. Docker configuration is set for local use, hardening is required for production.

![Desktop preview](https://github.com/seguinleo/Bloc-notes/blob/main/src/assets/img/desktop.png)
