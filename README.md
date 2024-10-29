<p align="center">
<img src="https://raw.githubusercontent.com/seguinleo/Bloc-notes/main/src/assets/icons/icon192.png" alt="Logo" width="72" height="72">
</p>
<h1 align="center">Bloc-notes</h1>

<p align="center">
A fast, private and secure web notebook.
</p>

<p align="center">
<img alt="License" src="https://img.shields.io/github/license/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
</p>

## Table of contents
*   [Features](#features)
*   [Security](#security)
*   [Todo](#todo)
*   [Community](#community)
*   [Self-hosting](#self-hosting)

## Features
Users can create task lists, tables, links, and code blocks using Markdown and HTML. They can add online images, audio, or videos via URL. Notes can be searched, sorted by category, or organized into folders.

Users can sync notes across devices in a secure database after signing in without needing an email address, only a username and strong password. Public notes can be shared via random URLs.

This website is a Progressive Web App (PWA) that can be installed as an application. Automatic updates are handled by the Service Worker. Design is responsive and optimized for all mobile devices or macOS/Windows.

The site is accessible to users with disabilities through high-contrast colors, ARIA modules, and focusable elements. Users can choose between light/dark modes and select the page's accent color.

## Security
The website follows [OWASP security recommendations](https://cheatsheetseries.owasp.org/).

User's connections are managed with secure cookies and tokens.

All notes are sanitized and validated through the DOMPurify library. All notes are encrypted with AES-256-GCM. Each user has a unique 32-byte randomly generated encryption key generated after signing up.

Users can lock the app using biometrics (fingerprints, face, etc.). These biometric data are never sent to the server.

## Todo
*   2FA login
*   Markdown plugins
*   Reminders with calendar

## Community
If you find [issues](https://github.com/seguinleo/Bloc-notes/issues), [vulnerabilities](https://github.com/seguinleo/Bloc-notes/security) or if you have any [suggestions](https://github.com/seguinleo/Bloc-notes/discussions) to improve this project, feel free to discuss!

## Self-hosting
``docker-compose up --build -d`` to build the Docker container

> [!IMPORTANT]
> The website is available at localhost:8787, but if you want to deploy it on a server with a domain name or an IP address, you need to install a SSL certificate to use note encryption (Web Crypto API requires HTTPs). Edit all users, passwords and Docker configurations for production.

![Desktop preview](https://github.com/seguinleo/Bloc-notes/blob/main/src/assets/img/desktop.png)
