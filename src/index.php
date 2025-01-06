<?php require_once __DIR__ . '/assets/php/cookies.php'; ?>
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="A fast, private and secure notebook with Markdown support.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?= $csrf_token ?>">
    <meta name="theme-color" content="#000" class="theme-color">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#000" class="theme-color">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self'; font-src 'self' https://cdnjs.cloudflare.com/; form-action 'self'; img-src http:; manifest-src 'self'; media-src https:; script-src 'self'; script-src-attr 'none'; style-src 'self' https://cdnjs.cloudflare.com/; style-src-attr 'none'; worker-src 'self'">
    <link rel="apple-touch-icon" href="./assets/icons/apple-touch-icon.png">
    <link rel="icon" href="./favicon.ico">
    <link rel="stylesheet" href="./assets/css/style.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="manifest" href="./app.webmanifest">
</head>
<body class="accent1">
    <noscript>
        <div id="js-disabled">
            <p class="bold">JavaScript is disabled</p>
        </div>
    </noscript>
    <div id="offline" class="d-none">
        <p class="bold">You are offline</p>
    </div>
    <header>
        <div id="sidebar-indicator">
            <i class="fa-solid fa-bars"></i>
        </div>
        <div id="div-search" role="search">
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Search" autocomplete="off">
            <kbd>CTRL</kbd><kbd>K</kbd>
        </div>
    </header>
    <div id="sidebar">
        <nav>
            <div class="row">
                <img src="./assets/img/christmas.png" alt="christmas" class="christmas d-none" width="36" height="29" loading="lazy">
                <h1 class="main-title">Bloc-notes</h1>
            </div>
            <div class="row nav-buttons">
                <?php if (isset($name) === true) { ?>
                    <button id="manage-account" type="button" class="d-none" aria-label="Manage account">
                        <i class="fa-solid fa-circle-user"></i>
                    </button>
                <?php } else { ?>
                    <button id="log-in" type="button" class="d-none" aria-label="Log in">
                        <i class="fa-solid fa-circle-user"></i>
                    </button>
                <?php } ?>
                <button type="button" id="btn-sort" class="d-none" aria-label="Sort notes">
                    <i class="fa-solid fa-arrow-up-wide-short"></i>
                </button>
                <button type="button" id="btn-filter" class="d-none" aria-label="Filter notes">
                    <i class="fa-solid fa-filter"></i>
                </button>
                <button type="button" id="btn-download-all" class="d-none" aria-label="Download all notes">
                    <i class="fa-solid fa-download"></i>
                </button>
                <button type="button" id="btn-settings" class="d-none" aria-label="Settings">
                    <i class="fa-solid fa-gear"></i>
                </button>
                <button type="button" id="btn-theme" aria-label="Theme">
                    <i id="icon-theme" class="fa-solid fa-moon"></i>
                </button>
            </div>
            <div id="list-notes"></div>
        </nav>
    </div>
    <main>
        <button type="button" id="btn-add-note" class="d-none" aria-label="Add a note">
            <i class="fa-solid fa-plus"></i>
        </button>
        <button id="btn-unlock-float" class="d-none" type="button" aria-label="Unlock app">
            <i class="fa-solid fa-lock"></i>
        </button>
        <div id="success-notification" class="d-none"></div>
        <dialog id="sort-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <fieldset>
                        <legend></legend>
                        <div class="row">
                            <label class="custom-check">
                                <input type="radio" name="sort-notes" value="1" id="sort-notes1" checked>
                                <span id="sort-notes1-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="custom-check">
                                <input type="radio" name="sort-notes" value="2" id="sort-notes2">
                                <span id="sort-notes2-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="custom-check">
                                <input type="radio" name="sort-notes" value="3" id="sort-notes3">
                                <span id="sort-notes3-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="custom-check">
                                <input type="radio" name="sort-notes" value="4" id="sort-notes4">
                                <span id="sort-notes4-span" tabindex="0" role="button"></span>
                            </label>
                        </div>
                    </fieldset>
                </div>
            </div>
        </dialog>
        <dialog id="filter-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <fieldset>
                        <legend></legend>
                        <div id="filter-categories" class="row"></div>
                    </fieldset>
                </div>
            </div>
        </dialog>
        <dialog id="delete-note-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <form id="delete-note">
                        <div class="error-notification d-none"></div>
                        <div class="row">
                            <span></span>
                        </div>
                        <input id="id-note-delete" type="hidden">
                        <div class="row">
                            <button type="submit" class="btn-cancel"></button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
        <dialog id="download-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <fieldset>
                        <legend></legend>
                        <input id="id-note-download" type="hidden">
                        <div class="row">
                            <label class="custom-check">
                                <input type="radio" name="download-notes" value="txt" id="txt-download">
                                <span tabindex="0" role="button">.TXT</span>
                            </label>
                            <label class="custom-check">
                                <input type="radio" name="download-notes" value="md" id="md-download">
                                <span tabindex="0" role="button">.MD</span>
                            </label>
                        </div>
                    </fieldset>
                </div>
            </div>
        </dialog>
        <dialog id="folder-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-arrow-left"></i>
                    </div>
                    <div id="folders">
                        <label class="custom-check">
                            <input type="radio" name="add-folder" value="" id="none-folder-add-span" checked>
                            <span tabindex="0" role="button">
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        </label>
                        <span class="list"></span>
                    </div>
                    <form id="add-folder" autocomplete="off">
                        <div class="error-notification d-none"></div>
                        <div class="row">
                            <input type="text" id="name-folder" maxlength="18" aria-label="Name">
                        </div>
                        <button type="submit"></button>
                    </form>
                </div>
            </div>
        </dialog>
        <dialog id="category-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-arrow-left"></i>
                    </div>
                    <div id="categories">
                        <label class="custom-check">
                            <input type="radio" name="add-cat" value="" id="none-cat-add-span" checked>
                            <span tabindex="0" role="button">
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        </label>
                        <span class="list"></span>
                    </div>
                    <form id="add-category" autocomplete="off">
                        <div class="error-notification d-none"></div>
                        <div class="row">
                            <input type="text" id="name-category" maxlength="18" aria-label="Name">
                        </div>
                        <button type="submit"></button>
                    </form>
                </div>
            </div>
        </dialog>
        <dialog id="reminder-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-arrow-left"></i>
                    </div>
                    <div class="row">
                        <input type="datetime-local" id="date-reminder-input" aria-label="Date">
                    </div>
                </div>
            </div>
        </dialog>
        <dialog id="note-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="popup-header">
                        <div id="submit-note" class="done">
                            <button type="submit" form="add-note" aria-label="Save note">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        </div>
                        <div class="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <form id="add-note" autocomplete="off">
                        <input id="id-note" type="hidden">
                        <div class="error-notification d-none"></div>
                        <input type="text" id="title" maxlength="30" aria-label="Title" required>
                        <textarea
                            id="content"
                            maxlength="20000"
                            spellcheck="true"
                            aria-label="Content"
                        ></textarea>
                        <div class="row">
                            <span id="textarea-length"></span>
                            <span class="editor-control">
                                <i class="fa-solid fa-broom" id="control-clear" tabindex="0" role="button" aria-label="Clear content"></i>
                            </span>
                        </div>
                        <div class="row">
                            <button type="button" id="btn-add-folder" aria-label="Add a folder">
                                <i class="fa-solid fa-folder"></i>
                            </button>
                            <button type="button" id="btn-add-category" aria-label="Add a category">
                                <i class="fa-solid fa-tags"></i>
                            </button>
                            <button type="button" id="btn-add-reminder" aria-label="Add a reminder">
                                <i class="fa-solid fa-bell"></i>
                            </button>
                        </div>
                        <div class="row">
                            <div id="colors">
                                <span class="bg-default" tabindex="0" role="button" aria-label="Default"></span>
                                <span class="bg-red" tabindex="0" role="button" aria-label="Red"></span>
                                <span class="bg-orange" tabindex="0" role="button" aria-label="Orange"></span>
                                <span class="bg-yellow" tabindex="0" role="button" aria-label="Yellow"></span>
                                <span class="bg-green" tabindex="0" role="button" aria-label="Green"></span>
                                <span class="bg-cyan" tabindex="0" role="button" aria-label="Cyan"></span>
                                <span class="bg-light-blue" tabindex="0" role="button" aria-label="Light blue"></span>
                                <span class="bg-blue" tabindex="0" role="button" aria-label="Blue"></span>
                                <span class="bg-purple" tabindex="0" role="button" aria-label="Purple"></span>
                                <span class="bg-pink" tabindex="0" role="button" aria-label="Pink"></span>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <label class="div-slider">
                                <span id="hide-infos"></span>
                                <span class="switch">
                                    <input type="checkbox" id="check-hidden">
                                    <span class="slider"></span>
                                </span>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
        <dialog id="settings-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <div class="error-notification d-none"></div>
                    <div id="legal" class="row">
                        <a href="https://leoseguin.fr/mentionslegales/"></a>
                    </div>
                    <div class="row">
                        <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" id="link-markdown" rel="noopener noreferrer"></a>
                    </div>
                    <div class="row">
                        <a href="https://github.com/seguinleo/Bloc-notes/wiki/Shortcuts" rel="noopener noreferrer">Shortcuts</a>
                    </div>
                    <div class="row">
                        <a href="https://github.com/seguinleo/Bloc-notes/discussions" id="link-help" rel="noopener noreferrer"></a>
                    </div>
                    <div class="row">
                        <select id="language" aria-label="Language">
                            <option value="fr">FR</option>
                            <option value="en" selected>EN</option>
                            <option value="de">DE</option>
                            <option value="es">ES</option>
                        </select>
                    </div>
                    <div class="row">
                        <button type="button" id="btn-plugins" aria-label="Manage plugins" disabled>
                            <i class="fa-solid fa-puzzle-piece"></i>
                            Plugins
                        </button>
                    </div>
                    <div class="row">
                        <div id="accent-colors">
                            <span class="accent1-span" tabindex="0" role="button" aria-label="Blue"></span>
                            <span class="accent7-span" tabindex="0" role="button" aria-label="Green"></span>
                            <span class="accent2-span" tabindex="0" role="button" aria-label="Lime"></span>
                            <span class="accent3-span" tabindex="0" role="button" aria-label="Yellow"></span>
                            <span class="accent6-span" tabindex="0" role="button" aria-label="Orange"></span>
                            <span class="accent5-span" tabindex="0" role="button" aria-label="Red"></span>
                            <span class="accent4-span" tabindex="0" role="button" aria-label="Pink"></span>
                            <span class="accent8-span" tabindex="0" role="button" aria-label="Purple"></span>
                        </div>
                    </div>
                    <div class="row">
                        <label id="spellcheck-slider" class="div-slider">
                            <span></span>
                            <span class="switch">
                                <input type="checkbox" id="check-spellcheck" checked>
                                <span class="slider"></span>
                            </span>
                        </label>
                    </div>
                    <div class="row">
                        <label id="lock-app-slider" class="row div-slider d-none">
                            <span></span>
                            <span class="switch">
                                <input type="checkbox" id="check-lock-app" checked>
                                <span class="slider"></span>
                            </span>
                        </label>
                    </div>
                    <div class="row">
                        <p class="version">
                            GPL-3.0 &copy;
                            <a href="https://github.com/seguinleo/Bloc-notes/" rel="noopener noreferrer">v25.1.1</a>
                        </p>
                    </div>
                </div>
            </div>
        </dialog>
        <?php if (isset($name) === true) { ?>
            <dialog id="manage-popup-box">
                <div class="popup">
                    <div class="content">
                        <div class="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <div id="user-name" class="row bold">
                            <?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>
                        </div>
                        <div class="row">
                            <span id="last-login"></span>
                            <span id="last-login-date"></span>
                        </div>
                        <div class="row">
                            <span id="log-out" class="link" tabindex="0" role="button"></span>
                        </div>
                        <div class="row">
                            <span id="storage-usage"></span>
                            <progress id="storage" max="1000000" value="0"></progress>
                        </div>
                        <details id="gen-psswd">
                            <summary></summary>
                            <form id="change-psswd">
                                <div class="error-notification d-none"></div>
                                <div class="row">
                                    <input id="old-psswd" type="password" minlength="10" maxlength="64" aria-label="Old password" required>
                                </div>
                                <div class="row">
                                    <input id="new-psswd" type="password" minlength="10" maxlength="64" aria-label="New password" required>
                                </div>
                                <div class="row">
                                    <input id="new-psswd-valid" type="password" minlength="10" maxlength="64" aria-label="Confirm new password" required>
                                </div>
                                <div class="row d-flex">
                                    <p id="psswd-gen"></p>
                                    <button type="button" id="copy-password-btn" aria-label="Copy password">
                                        <i class="fa-solid fa-clipboard"></i>
                                    </button>
                                    <button type="button" id="submit-gen-psswd" aria-label="Generate password">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                                <button type="submit"></button>
                            </form>
                        </details>
                        <details id="delete-user">
                            <summary></summary>
                            <form id="delete-account">
                                <div class="error-notification d-none"></div>
                                <div class="row">
                                    <input id="delete-psswd" type="password" minlength="10" maxlength="64" aria-label="Password" required>
                                </div>
                                <button type="submit" class="btn-cancel"></button>
                            </form>
                        </details>
                    </div>
                </div>
            </dialog>
            <dialog id="private-note-popup-box">
                <div class="popup">
                    <div class="content">
                        <div class="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <form id="public-note">
                            <div class="error-notification d-none"></div>
                            <div class="row">
                                <span></span>
                            </div>
                            <input id="id-note-public" type="hidden">
                            <div class="row">
                                <button type="submit"></button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="public-note-popup-box">
                <div class="popup">
                    <div class="content">
                        <div class="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <div class="d-flex">
                            <p id="copy-note-link"></p>
                            <button type="button" id="copy-note-link-btn" aria-label="Copy link">
                                <i class="fa-solid fa-clipboard"></i>
                            </button>
                        </div>
                        <form id="private-note">
                            <div class="error-notification d-none"></div>
                            <div class="row">
                                <span></span>
                            </div>
                            <input id="id-note-private" type="hidden">
                            <input id="link-note-private" type="hidden">
                            <div class="row">
                                <button type="submit" class="btn-cancel"></button>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
        <?php } else { ?>
            <dialog id="connect-box">
                <div class="popup">
                    <div class="content">
                        <div class="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <form id="connect-form" autocomplete="off">
                            <div class="error-notification d-none"></div>
                            <div class="row">
                                <input
                                    id="name-connect"
                                    type="text"
                                    minlength="3"
                                    maxlength="30"
                                    spellcheck="false"
                                    autocapitalize="off"
                                    aria-label="Name"
                                    required
                                >
                            </div>
                            <div class="row">
                                <input id="psswd-connect" type="password" minlength="10" maxlength="64" aria-label="Password" required>
                            </div>
                            <div class="row">
                                <button type="submit"></button>
                            </div>
                            <div class="row align-center">
                                <span id="create-account" class="link" tabindex="0" role="button"></span>
                            </div>
                        </form>
                    </div>
                </div>
            </dialog>
            <dialog id="create-box">
                <div class="popup">
                    <div class="content">
                        <div class="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <form id="create-form" autocomplete="off">
                            <div class="error-notification d-none"></div>
                            <div class="row">
                                <input
                                    id="name-create"
                                    type="text"
                                    minlength="3"
                                    maxlength="30"
                                    spellcheck="false"
                                    autocapitalize="off"
                                    aria-label="Name"
                                    required
                                >
                            </div>
                            <div class="row">
                                <input id="psswd-create" type="password" minlength="10" maxlength="64" aria-label="Password" required>
                            </div>
                            <div class="row">
                                <input id="psswd-create-valid" type="password" minlength="10" maxlength="64" aria-label="Confirm password" required>
                            </div>
                            <div class="row d-flex">
                                <p id="psswd-gen"></p>
                                <button type="button" id="copy-password-btn" aria-label="Copy password">
                                    <i class="fa-solid fa-clipboard"></i>
                                </button>
                                <button type="button" id="submit-gen-psswd" aria-label="Generate password">
                                    <i class="fa-solid fa-arrow-rotate-right"></i>
                                </button>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                <span id="create-infos"></span>
                            </div>
                            <button type="submit"></button>
                        </form>
                    </div>
                </div>
            </dialog>
            <div data-note-id="welcome" class="note bg-default d-none">
                <div class="details">
                    <h2 class="title">👋Bienvenue !</h2>
                    <div class="details-content details-content-fr d-none">
                        <div>
                            Bloc-notes est un outil <span class="bold">rapide, privé et sécurisé</span><br>pour prendre des notes en <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" rel="noopener noreferrer">Markdown ou HTML</a>.
                        </div>
                        <div>
                            Créez une note avec <i class="fa-solid fa-plus"></i> en bas à droite et ajoutez
                            <ul>
                                <li>des listes de tâches,</li>
                                <li>des rappels,</li>
                                <li>des liens,</li>
                                <li>des images,</li>
                                <li>etc.</li>
                            </ul>
                            Vous pouvez également créer des dossiers et des catégories. 
                        </div>
                        <div>
                            Connectez-vous avec <i class="fa-solid fa-circle-user"></i> pour synchroniser vos notes sur tous vos appareils.
                        </div>
                        <div>
                            Toutes vos notes sont <kbd>chiffrées</kbd> dans votre navigateur <span class="bold">et</span> dans le cloud.
                        </div>
                        <div>
                            Une fois connecté.e, vous pouvez partager des notes grâce à un lien public.
                        </div>
                    </div>
                    <div class="details-content details-content-en">
                        <div>
                            Bloc-notes is a <span class="bold">fast, private and secure</span><br>tool for taking notes in <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown " rel="noopener noreferrer">Markdown or HTML</a>.
                        </div>
                        <div>
                            Create a note with <i class="fa-solid fa-plus"></i> at the bottom right and add
                            <ul>
                                <li>to-do lists,</li>
                                <li>reminders,</li>
                                <li>links,</li>
                                <li>images,</li>
                                <li>etc.</li>
                            </ul>   
                            You can also create folders and categories. 
                        </div>
                        <div>
                            Log in with <i class="fa-solid fa-circle-user"></i> to sync your notes across all your devices.
                        </div>
                        <div>
                            All your notes are <kbd>encrypted</kbd> in your browser <span class="bold">and</span> in the cloud.
                        </div>
                        <div>
                            Once logged in, you can share notes using a public link.
                        </div>
                    </div>
                </div>
            </div>
        <?php } ?>
    </main>
    <?php if (isset($name) === true) { ?>
        <script type="module" src="./assets/js/cloud/script.js"></script>
    <?php } else { ?>
        <script type="module" src="./assets/js/local/script.js"></script>
    <?php } ?>
</body>
</html>
