<p align="center">
<img src="https://raw.githubusercontent.com/PouletEnSlip/Bloc-notes/main/src/assets/icons/icon192.png" alt="Logo" width="72" height="72">
</p>
<h1 align="center">Bloc-notes</h1>

<p align="center">
<b>Bloc-notes</b> is a free, open source and encrypted notebook. Bloc-notes aims for security and privacy.
</p>

<p align="center">
<img alt="" src="https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=8ab4f8&up_message=online&url=https://leoseguin.fr/projets/notes/?color=8ab4f8&style=for-the-badge">
<img alt="" src="https://img.shields.io/github/license/PouletEnSlip/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="" src="https://img.shields.io/github/issues/PouletEnSlip/Bloc-notes?color=8ab4f8&style=for-the-badge">
<img alt="" src="https://img.shields.io/mozilla-observatory/grade/leoseguin.fr.svg?color=8ab4f8&style=for-the-badge">
</p>

## Table of contents
  - [Why?](#why)
  - [Features](#features)
  - [Design](#design)
  - [Security/Privacy](#security-and-privacy)
  - [Languages](#languages)
  - [Todo](#todo)
  - [Community](#community)
  - [For developers](#for-developers)

## Why?
When I was looking for a note-taking application, I faced several difficulties: Google Keep and OneNote don't respect privacy, Standard Notes and Obsidian are very light without having to pay...
So I decided to create my own notebook that respects users' privacy and GDPR.

## Features
The user can save and edit notes locally in JSON, change notes color, copy notes and use [Markdown](https://github.com/PouletEnSlip/Bloc-notes/wiki/Markdown) to create titles, lists, links, todos or import images from another website.
The user can also sign in to sync all notes between their devices or browsers and encrypt content with ``AES-256-GCM`` in a database. The user can also hide the content of their notes. The user's connection is maintained by a secure cookie with a shelf life of 1 week. This website is a PWA (Progressive Web App), the user can install it as an application. Service Worker has automatic updates.

## Design
The website is fully responsible for mobile devices and UI/UX inspired by [Material Design](https://m3.material.io/). The icons come from [Fontawesome](https://github.com/FortAwesome/Font-Awesome). The website is also accessible for people with disabilities.

## Security and Privacy
Passwords are hashed with bcrypt before being sent to the database. Each user has their own randomly generated 32-byte encryption key that uses SHA256 as the hash function and the randomly generated salt.
Once logged in, the user can change their password or delete their account. Security measures are in place against XSS, CSRF and SQL injections.
Bloc-notes stores the username, hashed password, and encrypted notes in a secure database until the user deletes this data themselves. Only the user has access to the content of their encrypted notes via their unique keys. The website editor disclaims any responsibility for the content of user notes.

> **Warning** Never store passwords or too personal data in your notes regardless of the service

## Languages
🇫🇷French, 🇬🇧English

## Todo
  - [x] Light/dark mode switch
  - [ ] Notes shared between users

## Community
If you find [issues](https://github.com/PouletEnSlip/Bloc-notes/issues), [vulnerabilities](https://github.com/PouletEnSlip/Bloc-notes/security) or if you have any suggestions to improve this project, feel free to [discuss](https://github.com/PouletEnSlip/Bloc-notes/discussions)!

## For developers
Technologies used: JavaScript, PHP, MySQL

``npm i`` and ``composer i`` to install all dependencies

``npx eslint file.js`` to verify JavaScript files

``vendor/bin/phpcs --standard=PSR2 file.php`` to verify PHP files

![Preview](https://github.com/PouletEnSlip/Bloc-notes/blob/main/image.png)
