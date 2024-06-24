<p align="center">
<img src="https://raw.githubusercontent.com/seguinleo/Bloc-notes/main/src/assets/icons/icon192.png" alt="Logo" width="72" height="72">
</p>
<h1 align="center">Bloc-notes</h1>

<p align="center">
<b>Bloc-notes</b> is a fast, private and secure notebook.
</p>

<p align="center">
<img alt="Status" src="https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=8ab4f8&up_message=online&url=https://leoseguin.fr?color=8ab4f8&style=for-the-badge">
<img alt="License" src="https://img.shields.io/github/license/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="Issues" src="https://img.shields.io/github/issues/seguinleo/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="MozillaObservatory" src="https://img.shields.io/mozilla-observatory/grade/leoseguin.fr.svg?color=8ab4f8&style=for-the-badge">
</p>

## Table of contents
*   [Features](#features)
*   [Security](#security)
*   [Todo](#todo)
*   [Community](#community)
*   [Self-hosting](#self-hosting)

## Features
The user can use Markdown and HTML. The user can create tasks lists, tables, links, code blocks, etc. The user can also search for notes, sort them or filter them by category.

The user can also sign in to sync all notes between their devices in a secure database. The user can also make a note public and share it via a random URL. No email is required, only a username and a strong password.

This website is a PWA (Progressive Web App), the user can install it as an application. Service Worker has automatic updates.

The website is also accessible for people with disabilities thanks to high-contrast colors, ARIA modules and focusable elements. A light/dark mode is also available and the user can choose the accent color of the entire page.

## Security
The website follows the OWASP security recommendations.

The user's connection is maintained by a secure cookie. Passwords are hashed and all notes, local or cloud, are encrypted with ``AES-256-GCM``.

Each user has their own randomly generated 32-byte encryption key and salt. Once logged in, the user can change their password or delete their account.

The user can use biometrics (fingerprint, Windows Hello, etc) to unlock app. Biometrics are never sent to the server.

## Todo
*   2FA login
*   Markdown plugins
*   Refractor project with Node.js or Laravel?

## Community
If you find [issues](https://github.com/seguinleo/Bloc-notes/issues), [vulnerabilities](https://github.com/seguinleo/Bloc-notes/security) or if you have any suggestions to improve this project, feel free to [discuss](https://github.com/seguinleo/Bloc-notes/discussions)!

## Self-hosting
``docker-compose up --build -d`` to build the Docker container

> [!IMPORTANT]
> The website is available at localhost:8787, but if you want to deploy it on a server with a domain name or an IP address, you need to install a SSL certificate to use note encryption (Web Crypto API requires HTTPs). Edit all users, passwords and Docker configurations for production.

![Desktop preview](https://github.com/seguinleo/Bloc-notes/blob/main/src/assets/img/desktop.png)
