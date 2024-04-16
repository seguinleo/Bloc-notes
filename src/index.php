<?php
session_name('__Secure-notes');
$cookieParams = [
    'lifetime' => 604800,
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax'
];
session_set_cookie_params($cookieParams);
session_start();
session_regenerate_id();
$name = $_SESSION['name'] ?? null;
$csrf_token = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $csrf_token;
?>
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Encrypted, private and secure notebook. Local or cloud. Supports Markdown, HTML5 and export in text file.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?= $csrf_token ?>">
    <meta name="theme-color" content="#171717" class="theme-color">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" class="theme-color">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self'; font-src 'self' https://cdnjs.cloudflare.com/; form-action 'self'; img-src http:; manifest-src 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self' https://cdnjs.cloudflare.com/; style-src-attr 'none'; worker-src 'self'">
    <link rel="apple-touch-icon" href="./assets/icons/apple-touch-icon.png">
    <link rel="icon" href="./favicon.ico">
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="manifest" href="./app.webmanifest">
</head>
<body class="accent1">
    <header>
        <noscript>
            <p id="noscript">You must enable JavaScript to use Bloc-notes.</p>
        </noscript>
        <div id="welcome">
            <h1>Bloc-notes</h1>
            <?php if (isset($name) === true) { ?>
                <span id="manage-account" class="link" tabindex="0" role="button" aria-label="Manage account">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
                <span id="dot-connected"></span>
            <?php } else { ?>
                <span id="log-in" class="link" tabindex="0" role="button" aria-label="Log in">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <div id="div-search" role="search">
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Search">
            <kbd>CTRL</kbd><kbd>K</kbd>
            <select id="search-option" aria-label="Search option">
                <option value="0">Title</option>
                <option value="1">Content</option>
                <option value="2">All</option>
            </select>
        </div>
        <div id="last-sync">
            <i class="fa-solid fa-sync"></i>
            <span></span>
        </div>
        <div>
            <button type="button" id="btn-theme" aria-label="Theme">
                <i id="icon-theme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </header>
    <div id="sidebar">
        <nav>
            <div class="row">
                <button id="icon-add" type="button">Add a note</button>
            </div>
            <div id="list-notes"></div>
        </nav>
        <footer>
            <div class="row">
                <span id="settings" class="link" tabindex="0" role="button" aria-label="Settings">
                    <i class="fa-solid fa-gear"></i>
                </span>
                <select id="language" aria-label="Language">
                    <option value="fr">FR</option>
                    <option value="en" selected>EN</option>
                    <option value="de">DE</option>
                    <option value="es">ES</option>
                </select>
            </div>
            <div id="legal" class="row">
                <a href="https://leoseguin.fr/mentionslegales/"></a>
            </div>
            <div id="license" class="row">
                GPL-3.0 &copy;<?= date('Y') ?>
            </div>
        </footer>
    </div>
    <main>
        <button id="icon-float-add" type="button" aria-label="Add a note">
            <i class="fa-solid fa-plus"></i>
        </button>
        <div id="success-notification"></div>
        <div id="sidebar-indicator"></div>
        <button type="button" id="btn-sort" aria-label="Sort notes">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <button type="button" id="btn-filter" aria-label="Filter notes">
            <i class="fa-solid fa-filter"></i>
        </button>
        <dialog id="sort-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <fieldset>
                        <legend></legend>
                        <div class="row">
                            <label for="sort-notes1">
                                <input type="radio" name="sort-notes" value="1" id="sort-notes1">
                                <span id="sort-notes1-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="sort-notes2">
                                <input type="radio" name="sort-notes" value="2" id="sort-notes2">
                                <span id="sort-notes2-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="sort-notes3">
                                <input type="radio" name="sort-notes" value="3" id="sort-notes3">
                                <span id="sort-notes3-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="sort-notes4">
                                <input type="radio" name="sort-notes" value="4" id="sort-notes4">
                                <span id="sort-notes4-span"></span>
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
                        <div class="row">
                            <label for="no-cat-filter">
                                <input type="checkbox" name="filter-notes" value="0" id="no-cat-filter" checked>
                                <span class="no-cat-filter-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="cat-perso-filter">
                                <input type="checkbox" name="filter-notes" value="1" id="cat-perso-filter" checked>
                                <span class="cat-perso-filter-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="cat-pro-filter">
                                <input type="checkbox" name="filter-notes" value="2" id="cat-pro-filter" checked>
                                <span class="cat-pro-filter-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="cat-voyage-filter">
                                <input type="checkbox" name="filter-notes" value="3" id="cat-voyage-filter" checked>
                                <span class="cat-voyage-filter-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="cat-task-filter">
                                <input type="checkbox" name="filter-notes" value="4" id="cat-task-filter" checked>
                                <span class="cat-task-filter-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="cat-rappel-filter">
                                <input type="checkbox" name="filter-notes" value="5" id="cat-rappel-filter" checked>
                                <span class="cat-rappel-filter-span"></span>
                            </label>
                        </div>
                        <div class="row">
                            <label for="cat-idees-filter">
                                <input type="checkbox" name="filter-notes" value="6" id="cat-idees-filter" checked>
                                <span class="cat-idees-filter-span"></span>
                            </label>
                        </div>
                    </fieldset>
                </div>
            </div>
        </dialog>
        <dialog id="note-popup-box">
            <div class="popup">
                <div class="content">
                    <div class="close">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <form id="add-note" method="post" enctype="application/x-www-form-urlencoded">
                        <input id="id-note" type="hidden">
                        <div class="row">
                            <div class="error-notification"></div>
                        </div>
                        <div class="row">
                            <input type="text" id="title" maxlength="30" aria-label="Title" autofocus required>
                        </div>
                        <div class="row">
                            <textarea
                                id="content"
                                maxlength="5000"
                                spellcheck="true"
                                aria-label="Content"
                            ></textarea>
                            <span id="textarea-length">0/5000</span>
                            <span class="editor-control">
                                <i class="fa-solid fa-broom" id="control-clear" tabindex="0" role="button" aria-label="Clear content"></i>
                            </span>
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
                        <div class="row">
                            <label class="category" for="no-cat">
                                <input type="radio" name="category" id="no-cat" value="0" checked>
                                <span class="no-cat-filter-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="cat-perso">
                                <input type="radio" name="category" id="cat-perso" value="1">
                                <span class="cat-perso-filter-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="cat-pro">
                                <input type="radio" name="category" id="cat-pro" value="2">
                                <span class="cat-pro-filter-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="cat-voyage">
                                <input type="radio" name="category" id="cat-voyage" value="3">
                                <span class="cat-voyage-filter-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="cat-task">
                                <input type="radio" name="category" id="cat-task" value="4">
                                <span class="cat-task-filter-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="cat-rappel">
                                <input type="radio" name="category" id="cat-rappel" value="5">
                                <span class="cat-rappel-filter-span" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="cat-idees">
                                <input type="radio" name="category" id="cat-idees" value="6">
                                <span class="cat-idees-filter-span" tabindex="0" role="button"></span>
                            </label>
                        </div>
                        <div class="row">
                            <span id="hide-infos"></span>
                            <span class="switch-icon">
                                <i class="fa-solid fa-eye-slash"></i>
                            </span>
                            <label for="check-hidden" class="switch" aria-label="Hide note content">
                                <input type="checkbox" id="check-hidden" aria-hidden="true" tabindex="-1">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <button type="submit"></button>
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
                    <div class="row">
                        <span id="export-all-notes" class="link" tabindex="0" role="button"></span>
                    </div>
                    <div class="row">
                        <span class="link">
                            <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" id="link-markdown" rel="noopener noreferrer"></a>
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                    </div>
                    <div class="row">
                        <span class="link">
                            <a href="https://github.com/seguinleo/Bloc-notes/discussions" id="link-help" rel="noopener noreferrer"></a>
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                    </div>
                    <div class="row">
                        <div id="accent-colors">
                            <span class="accent1-span" tabindex="0" role="button" aria-label="Blue"></span>
                            <span class="accent2-span" tabindex="0" role="button" aria-label="Green"></span>
                            <span class="accent3-span" tabindex="0" role="button" aria-label="Yellow"></span>
                            <span class="accent4-span" tabindex="0" role="button" aria-label="Pink"></span>
                            <span class="accent5-span" tabindex="0" role="button" aria-label="Red"></span>
                        </div>
                    </div>
                    <div class="row">
                        <span class="switch-icon">
                            Spellcheck
                            <i class="fa-solid fa-spell-check"></i>
                        </span>
                        <label for="spellcheck" class="switch" aria-label="Compact mode">
                            <input type="checkbox" id="spellcheck" aria-hidden="true" tabindex="-1" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div id="compact-mode" class="row">
                        <span class="switch-icon">
                            Compact mode
                            <i class="fa-solid fa-grip-vertical"></i>
                        </span>
                        <label for="check-compact" class="switch" aria-label="Compact mode">
                            <input type="checkbox" id="check-compact" aria-hidden="true" tabindex="-1">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="row">
                        <span class="switch-icon">
                            Lock app
                            <i class="fa-solid fa-fingerprint"></i>
                        </span>
                        <label for="check-fingerprint" class="switch" aria-label="Lock app (Fingerprint, Windows Hello, etc.)">
                            <input type="checkbox" id="check-fingerprint" aria-hidden="true" tabindex="-1">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="row">
                        <p class="version">
                            <a href="https://github.com/seguinleo/Bloc-notes/" rel="noopener noreferrer">v24.4.2</a>
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
                        <div class="row bold">
                            <?= $name ?>
                        </div>
                        <div class="row">
                            <span id="log-out" class="link" tabindex="0" role="button"></span>
                        </div>
                        <details id="gen-psswd">
                            <summary></summary>
                            <form id="change-psswd" method="post" enctype="application/x-www-form-urlencoded">
                                <div class="row">
                                    <div class="error-notification"></div>
                                </div>
                                <div class="row">
                                    <input id="old-psswd" type="password" minlength="8" maxlength="64" aria-label="Old password" required>
                                </div>
                                <div class="row">
                                    <input id="new-psswd" type="password" minlength="8" maxlength="64" aria-label="New password" required>
                                </div>
                                <div class="row">
                                    <input id="new-psswd-valid" type="password" minlength="8" maxlength="64" aria-label="Confirm new password" required>
                                </div>
                                <div class="row">
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
                            <form id="delete-account" method="post" enctype="application/x-www-form-urlencoded">
                                <div class="row">
                                    <div class="error-notification"></div>
                                </div>
                                <div class="row">
                                    <input id="delete-psswd" type="password" minlength="8" maxlength="64" aria-label="Password" required>
                                </div>
                                <button type="submit" class="btn-warning"></button>
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
                        <form id="public-note" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                <div class="error-notification"></div>
                            </div>
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
                        <p id="copy-note-link"></p>
                        <button type="button" id="copy-note-link-btn" aria-label="Copy link">
                            <i class="fa-solid fa-clipboard"></i>
                        </button>
                        <form id="private-note" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                <div class="error-notification"></div>
                            </div>
                            <div class="row">
                                <span></span>
                            </div>
                            <input id="id-note-private" type="hidden">
                            <input id="link-note-private" type="hidden">
                            <div class="row">
                                <button type="submit"></button>
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
                        <div class="row">
                            <span id="create-account" class="link" tabindex="0" role="button"></span>
                        </div>
                        <form id="connect-form" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                <div class="error-notification"></div>
                            </div>
                            <div class="row">
                                <input
                                    id="name-connect"
                                    type="text"
                                    minlength="4"
                                    maxlength="25"
                                    spellcheck="false"
                                    autocomplete="off"
                                    autocapitalize="off"
                                    aria-label="Name"
                                    required
                                >
                            </div>
                            <div class="row">
                                <input id="psswd-connect" type="password" minlength="8" maxlength="64" aria-label="Password" required>
                            </div>
                            <button type="submit"></button>
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
                        <form id="create-form" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                <div class="error-notification"></div>
                            </div>
                            <div class="row">
                                <input
                                    id="name-create"
                                    type="text"
                                    minlength="4"
                                    maxlength="25"
                                    spellcheck="false"
                                    autocomplete="off"
                                    autocapitalize="off"
                                    aria-label="Name"
                                    required
                                >
                            </div>
                            <div class="row">
                                <input id="psswd-create" type="password" minlength="8" maxlength="64" aria-label="Password" required>
                            </div>
                            <div class="row">
                                <input id="psswd-create-valid" type="password" minlength="8" maxlength="64" aria-label="Confirm password" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                <span id="create-infos"></span>
                            </div>
                            <details id="gen-psswd">
                                <summary></summary>
                                <div class="row">
                                    <p id="psswd-gen"></p>
                                    <button type="button" id="copy-password-btn" aria-label="Copy password">
                                        <i class="fa-solid fa-clipboard"></i>
                                    </button>
                                    <button type="button" id="submit-gen-psswd" aria-label="Generate password">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                            </details>
                            <button type="submit"></button>
                        </form>
                    </div>
                </div>
            </dialog>
        <?php } ?>
    </main>
    <?php if (isset($name) === true) { ?>
        <script type="module" src="./assets/js/cloud/script.js"></script>
    <?php } else { ?>
        <script type="module" src="./assets/js/local/script.js"></script>
    <?php } ?>
</body>
</html>
