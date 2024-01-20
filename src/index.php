<?php
session_name('__Secure-notes');
$cookieParams = [
    'path'     => '/seguinleo-notes/',
    'lifetime' => 604800,
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax'
];
session_set_cookie_params($cookieParams);
session_start();
session_regenerate_id();
$name = $_SESSION['name'] ?? null;
$csrf_token_connect = bin2hex(random_bytes(16));
$csrf_token_create = bin2hex(random_bytes(16));
$csrf_token_psswd = bin2hex(random_bytes(16));
$_SESSION['csrf_token_connect'] = $csrf_token_connect;
$_SESSION['csrf_token_create'] = $csrf_token_create;
$_SESSION['csrf_token_psswd'] = $csrf_token_psswd;
?>
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Encrypted, private and secure notebook. Local or cloud. Supports Markdown, HTML5 and export in text file.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#171717" class="themecolor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" class="themecolor">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self'; font-src 'self' https://cdnjs.cloudflare.com/; form-action 'self'; img-src http:; manifest-src 'self'; script-src 'self'; script-src-attr 'none'; script-src-elem 'self'; style-src 'self' https://cdnjs.cloudflare.com/; style-src-attr 'none'; style-src-elem 'self' https://cdnjs.cloudflare.com/; worker-src 'self'">
    <link rel="apple-touch-icon" href="/seguinleo-notes/assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="/seguinleo-notes/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/seguinleo-notes/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="manifest" href="/seguinleo-notes/app.webmanifest">
</head>
<body class="accentBlue">
    <nav>
        <noscript>
            <p id="noscript">You must enable JavaScript to use Bloc-notes.</p>
        </noscript>
        <div id="welcome">
            <h1>Bloc-notes</h1>
            <?php if (isset($name) === true) { ?>
                <span class="manage-account linkp" tabindex="0" role="button" aria-label="Manage account">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
                <span id="dot-connected"></span>
            <?php } else { ?>
                <span class="log-in linkp" tabindex="0" role="button" aria-label="Log in">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <div id="divSearch">
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Search">
            <kbd>CTRL</kbd><kbd>K</kbd>
        </div>
        <div id="last-sync">
            <i class="fa-solid fa-sync" tabindex="0" role="button" aria-label="Sync"></i>
            <span></span>
        </div>
        <div>
            <button type="button" id="btnTheme" aria-label="Theme">
                <i id="iconTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <button id="iconFloatAdd" type="button" aria-label="Add a note"><i class="fa-solid fa-plus"></i></button>
        <div id="successNotification"></div>
        <div id="errorNotification"></div>
        <div id="sideBar">
            <div class="row">
                <button id="iconAdd" type="button"></button>
            </div>
            <div id="listNotes"></div>
            <div id="newVersion">
                <header>
                    <i class="fa-solid fa-xmark" tabindex="0"></i>
                </header>
                <h2>v24.1.3🎉</h2>
                <p id="newVersionInfos"></p>
                <p>
                    <a href="https://github.com/seguinleo/Bloc-notes/blob/main/CHANGELOG.txt" rel="noreferrer">Changelog</a>
                </p>
            </div>
            <div id="copyright">
                <div class="row">
                    <span id="settings" class="linkp" tabindex="0" role="button" aria-label="Settings">
                        <i class="fa-solid fa-gear"></i>
                    </span>
                    <select id="language" aria-label="Language">
                        <option value="fr">🇫🇷</option>
                        <option value="en" selected>🇬🇧</option>
                        <option value="de">🇩🇪</option>
                        <option value="es">🇪🇸</option>
                    </select>
                </div>
                <div id="legal" class="row">
                    <a href="https://leoseguin.fr/mentionslegales/"></a>
                </div>
                <div id="license" class="row">
                    GPL-3.0 &copy;<?= date('Y') ?>
                </div>
            </div>
        </div>
        <div id="sidebar-indicator"></div>
        <button type="button" id="btnSort" aria-label="Sort notes">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <button type="button" id="btnFilter" aria-label="Filter notes">
            <i class="fa-solid fa-filter"></i>
        </button>
        <div id="sort-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <h2>Sort notes by:</h2>
                    </div>
                    <div class="row">
                        <label for="sortNotes1">
                            <input type="radio" name="sortNotes" value="1" id="sortNotes1">
                            <span id="sortNotes1Span"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes2">
                            <input type="radio" name="sortNotes" value="2" id="sortNotes2">
                            <span id="sortNotes2Span"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes3">
                            <input type="radio" name="sortNotes" value="3" id="sortNotes3" checked>
                            <span id="sortNotes3Span"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes4">
                            <input type="radio" name="sortNotes" value="4" id="sortNotes4">
                            <span id="sortNotes4Span"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div id="filter-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <h2>Filter notes by category:</h2>
                    </div>
                    <div class="row">
                        <label for="noCatFilter">
                            <input type="checkbox" name="filterNotes" value="0" id="noCatFilter" checked>
                            <span class="noCatFilterSpan"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="catPersoFilter">
                            <input type="checkbox" name="filterNotes" value="1" id="catPersoFilter" checked>
                            <span class="catPersoFilterSpan"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="catProFilter">
                            <input type="checkbox" name="filterNotes" value="2" id="catProFilter" checked>
                            <span class="catProFilterSpan"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="catVoyageFilter">
                            <input type="checkbox" name="filterNotes" value="3" id="catVoyageFilter" checked>
                            <span class="catVoyageFilterSpan"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="catTaskFilter">
                            <input type="checkbox" name="filterNotes" value="4" id="catTaskFilter" checked>
                            <span class="catTaskFilterSpan"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="catRappelFilter">
                            <input type="checkbox" name="filterNotes" value="5" id="catRappelFilter" checked>
                            <span class="catRappelFilterSpan"></span>
                        </label>
                    </div>
                    <div class="row">
                        <label for="catIdeesFilter">
                            <input type="checkbox" name="filterNotes" value="6" id="catIdeesFilter" checked>
                            <span class="catIdeesFilterSpan"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div id="note-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <form id="addNote" method="post" enctype="application/x-www-form-urlencoded">
                        <input id="idNote" type="hidden">
                        <?php if (isset($name) === true) { ?>
                            <input id="checkLink" type="hidden">
                        <?php } ?>
                        <div class="row">
                            <input type="text" id="title" maxlength="30" aria-label="Title" required>
                        </div>
                        <div class="row">
                            <textarea id="content" maxlength="5000" aria-label="Content"></textarea>
                            <span id="textareaLength">0/5000</span>
                        </div>
                        <div class="row">
                            <div id="colors">
                                <span class="Noir" role="button" tabindex="0" aria-label="Default"></span>
                                <span class="Rouge" role="button" tabindex="0" aria-label="Red"></span>
                                <span class="Orange" role="button" tabindex="0" aria-label="Orange"></span>
                                <span class="Jaune" role="button" tabindex="0" aria-label="Yellow"></span>
                                <span class="Vert" role="button" tabindex="0" aria-label="Green"></span>
                                <span class="Cyan" role="button" tabindex="0" aria-label="Cyan"></span>
                                <span class="BleuCiel" role="button" tabindex="0" aria-label="Light blue"></span>
                                <span class="Bleu" role="button" tabindex="0" aria-label="Blue"></span>
                                <span class="Violet" role="button" tabindex="0" aria-label="Purple"></span>
                                <span class="Rose" role="button" tabindex="0" aria-label="Pink"></span>
                            </div>
                        </div>
                        <div class="row">
                            <label class="category" for="noCat">
                                <input type="radio" name="category" id="noCat" value="0" checked>
                                <span class="noCatFilterSpan" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="catPerso">
                                <input type="radio" name="category" id="catPerso" value="1">
                                <span class="catPersoFilterSpan" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="catPro">
                                <input type="radio" name="category" id="catPro" value="2">
                                <span class="catProFilterSpan" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="catVoyage">
                                <input type="radio" name="category" id="catVoyage" value="3">
                                <span class="catVoyageFilterSpan" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="catTask">
                                <input type="radio" name="category" id="catTask" value="4">
                                <span class="catTaskFilterSpan" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="catRappel">
                                <input type="radio" name="category" id="catRappel" value="5">
                                <span class="catRappelFilterSpan" tabindex="0" role="button"></span>
                            </label>
                            <label class="category" for="catIdees">
                                <input type="radio" name="category" id="catIdees" value="6">
                                <span class="catIdeesFilterSpan" tabindex="0" role="button"></span>
                            </label>
                        </div>
                        <div class="row">
                            <i class="fa-solid fa-eye-slash"></i>
                            <label for="checkHidden" class="switch" aria-label="Hide">
                                <input type="checkbox" id="checkHidden" aria-hidden="true" tabindex="-1">
                                <span class="slider" tabindex="0" role="button"></span>
                            </label>
                        </div>
                        <button type="submit"></button>
                    </form>
                </div>
            </div>
        </div>
        <div id="settings-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <span id="export-all-notes" class=" linkp" tabindex="0"></span>
                    </div>
                    <div class="row">
                        <span class="linkp">
                            <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" id="linkMarkdown" rel="noreferrer"></a>
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                    </div>
                    <div class="row">
                        <span class="linkp">
                            <a href="https://github.com/seguinleo/Bloc-notes/discussions" id="linkHelp" rel="noreferrer"></a>
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                    </div>
                    <div class="row">
                        <div id="accent-colors">
                            <span class="accentBlueSpan" role="button" tabindex="0" aria-label="Blue"></span>
                            <span class="accentGreenSpan" role="button" tabindex="0" aria-label="Green"></span>
                            <span class="accentYellowSpan" role="button" tabindex="0" aria-label="Yellow"></span>
                            <span class="accentPinkSpan" role="button" tabindex="0" aria-label="Pink"></span>
                        </div>
                    </div>
                    <div class="row">
                        <i class="fa-solid fa-fingerprint"></i>
                        <label for="checkFingerprint" class="switch" aria-label="Lock app">
                            <input type="checkbox" id="checkFingerprint" aria-hidden="true" tabindex="-1">
                            <span class="slider" tabindex="0" role="button"></span>
                        </label>
                    </div>
                    <div class="row">
                        <p class="version">
                            <a href="https://github.com/seguinleo/Bloc-notes/" rel="noreferrer">v24.1.3</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <?php if (isset($name) === true) { ?>
            <div id="manage-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <div class="row bold">
                            <?= $name ?>
                        </div>
                        <div class="row">
                            <span id="log-out" class="linkp" tabindex="0" role="button"></span>
                        </div>
                        <form id="changePsswd" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_psswd" value="<?= $csrf_token_psswd ?>">
                            <div class="row">
                                <input id="newPsswd" type="password" minlength="6" maxlength="50" aria-label="New password" required>
                            </div>
                            <div class="row">
                                <input id="newPsswdValid" type="password" minlength="6" maxlength="50" aria-label="Confirm new password" required>
                            </div>
                            <button type="submit"></button>
                        </form>
                        <div class="row">
                            <span id="delete-account" class="linkp warning" tabindex="0"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="private-note-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="publicNote" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                <span></span>
                            </div>
                            <input id="idNotePublic" type="hidden">
                            <div class="row">
                                <button type="submit"></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div id="public-note-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <p id="copyNoteLink"></p>
                        <button type="button" id="copyNoteLinkBtn" aria-label="Copy link">
                            <i class="fa-solid fa-clipboard"></i>
                        </button>
                        <form id="privateNote" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                <span></span>
                            </div>
                            <input id="idNotePrivate" type="hidden">
                            <input id="linkNotePrivate" type="hidden">
                            <div class="row">
                                <button type="submit"></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        <?php } else { ?>
            <div id="connect-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <div class="row">
                            <span id="create-account" class="linkp" tabindex="0" role="button"></span>
                        </div>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nameConnect" type="text" maxlength="25" aria-label="Name" required>
                            </div>
                            <div class="row">
                                <input id="psswdConnect" type="password" maxlength="50" aria-label="Password" required>
                            </div>
                            <button type="submit"></button>
                        </form>
                    </div>
                </div>
            </div>
            <div id="create-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="createForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_create" value="<?= $csrf_token_create ?>">
                            <div class="row">
                                <input id="nameCreate" type="text" minlength="4" maxlength="25" aria-label="Name" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreate" type="password" minlength="6" maxlength="50" aria-label="Password" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreateValid" type="password" minlength="6" maxlength="50" aria-label="Confirm password" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                <span id="createInfos"></span>
                            </div>
                            <details id="genPsswd">
                                <summary></summary>
                                <div class="row">
                                    <p id="psswdGen"></p>
                                    <button type="button" id="copyPasswordBtn" aria-label="Copy password">
                                        <i class="fa-solid fa-clipboard"></i>
                                    </button>
                                    <button type="button" id="submitGenPsswd" aria-label="Generate password">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                            </details>
                            <button type="submit"></button>
                        </form>
                    </div>
                </div>
            </div>
        <?php } ?>
    </main>
    <script src="/seguinleo-notes/assets/js/purify.min.js" defer></script>
    <script src="/seguinleo-notes/assets/js/showdown.min.js" defer></script>
    <?php if (isset($name) === true) { ?>
        <script src="/seguinleo-notes/assets/js/scriptConnect.js" defer></script>
    <?php } else { ?>
        <script src="/seguinleo-notes/assets/js/script.js" defer></script>
    <?php } ?>
</body>
</html>
