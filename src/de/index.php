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
<html class="dark" lang="de">

<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Speichern Sie Notizen auf Ihrem Gerät oder melden Sie sich an, um Ihre Notizen zu synchronisieren und zu verschlüsseln.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#171717" class="themecolor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" class="themecolor">
    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" class="themecolor">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self'; font-src 'self' https://cdnjs.cloudflare.com/; form-action 'self'; img-src http:; manifest-src 'self'; script-src 'self'; script-src-attr 'none'; script-src-elem 'self'; style-src 'self' https://cdnjs.cloudflare.com/; style-src-attr 'none'; style-src-elem 'self' https://cdnjs.cloudflare.com/; worker-src 'self'">
    <link rel="apple-touch-icon" href="/seguinleo-notes/assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="/seguinleo-notes/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/seguinleo-notes/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="manifest" href="/seguinleo-notes/de/app.webmanifest">
</head>

<body>
    <nav>
        <noscript>
            <p id="noscript">Bitte aktivieren Sie JavaScript, um diese Seite zu nutzen.</p>
        </noscript>
        <div id="welcome">
            <h1>Bloc-notes</h1>
            <?php if (isset($name) === true) { ?>
                <span class="manage-account linkp" tabindex="0" role="button" aria-label="Kontoverwaltung">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } else { ?>
                <span class="log-in linkp" tabindex="0" role="button" aria-label="Anmelden">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <div id="divSearch">
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Suche" placeholder="Suche">
            <kbd>CTRL</kbd><kbd>K</kbd>
        </div>
        <div id="last-sync">
            <i class="fa-solid fa-sync" aria-label="Synchronisieren" tabindex="0" role="button"></i>
            <span></span>
        </div>
        <div>
            <button type="button" id="btnTheme" aria-label="Thema">
                <i id="iconTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <button id="iconFloatAdd" type="button" aria-label="Füg ein Notiz hinzu"><i class="fa-solid fa-plus"></i></button>
        <div id="successNotification"></div>
        <div id="errorNotification"></div>
        <div id="copyNotification">Kopiert!</div>
        <div id="sideBar">
            <?php if (isset($name) === true) { ?>
                <button id="iconAdd" type="button">Eine Wolkennotiz hinzufügen</button>
            <?php } else { ?>
                <button id="iconAdd" type="button">Eine lokale Notiz hinzufügen</button>
            <?php } ?>
            <div id="listNotes"></div>
            <div id="newVersion">
                <header>
                    <i class="fa-solid fa-xmark" tabindex="0"></i>
                </header>
                <h2>v24.1.2🎉</h2>
                <p>
                    Bloc-notes wurde aktualisiert!
                </p>
                <p>
                    <a href="https://github.com/seguinleo/Bloc-notes/blob/main/CHANGELOG.txt" rel="noreferrer">Liste der Änderungen</a>
                </p>
            </div>
            <div id="copyright">
                <div class="row">
                    <span id="settings" class="linkp" tabindex="0" role="button" aria-label="Einstellungen">
                        <i class="fa-solid fa-gear"></i>
                    </span>
                    <select id="language" aria-label="Sprache">
                        <option value="fr">🇫🇷</option>
                        <option value="en">🇬🇧</option>
                        <option value="de" selected>🇩🇪</option>
                        <option value="es">🇪🇸</option>
                    </select>
                </div>
                <div id="legal" class="row">
                    <a href="https://leoseguin.fr/mentionslegales/">Rechtliche Hinweise / Datenschutz</a>
                </div>
                <div id="license" class="row">
                    GPL-3.0 &copy;<?= date('Y') ?>
                </div>
            </div>
        </div>
        <div id="sidebar-indicator"></div>
        <button type="button" id="btnSort" aria-label="Notizen sortieren">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <button type="button" id="btnFilter" aria-label="Notizen filtern">
            <i class="fa-solid fa-filter"></i>
        </button>
        <div id="sort-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <h2>Notizen sortieren :</h2>
                    </div>
                    <div class="row">
                        <label for="sortNotes1">
                            <input type="radio" name="sortNotes" value="1" id="sortNotes1">
                            Datum der Erstellung
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes2">
                            <input type="radio" name="sortNotes" value="2" id="sortNotes2">
                            Datum der Erstellung (Z-A)
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes3">
                            <input type="radio" name="sortNotes" value="3" checked id="sortNotes3">
                            Datum der Änderung
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes4">
                            <input type="radio" name="sortNotes" value="4" id="sortNotes4">
                            Datum der Änderung (Z-A)
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
                        <h2>Notizen nach Kategorie filtern:</h2>
                    </div>
                    <div class="row">
                        <label for="noCatFilter">
                            <input type="checkbox" name="filterNotes" value="0" checked id="noCatFilter">
                            ❌Keine
                        </label>
                    </div>
                    <div class="row">
                        <label for="catPersoFilter">
                            <input type="checkbox" name="filterNotes" value="1" checked id="catPersoFilter">
                            👤Persönlich
                        </label>
                    </div>
                    <div class="row">
                        <label for="catProFilter">
                            <input type="checkbox" name="filterNotes" value="2" checked id="catProFilter">
                            💼Arbeit
                        </label>
                    </div>
                    <div class="row">
                        <label for="catVoyageFilter">
                            <input type="checkbox" name="filterNotes" value="3" checked id="catVoyageFilter">
                            🏖️Reisen
                        </label>
                    </div>
                    <div class="row">
                        <label for="catTaskFilter">
                            <input type="checkbox" name="filterNotes" value="4" checked id="catTaskFilter">
                            📓Aufgaben
                        </label>
                    </div>
                    <div class="row">
                        <label for="catRappelFilter">
                            <input type="checkbox" name="filterNotes" value="5" checked id="catRappelFilter">
                            🕰️Erinnerung
                        </label>
                    </div>
                    <div class="row">
                        <label for="catIdeesFilter">
                            <input type="checkbox" name="filterNotes" value="6" checked id="catIdeesFilter">
                            💡Ideen
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
                            <input id="title" placeholder="Titel" type="text" maxlength="30" aria-label="Titel" required>
                        </div>
                        <div class="row">
                            <textarea id="content" placeholder="Inhalt (einfacher Text, Markdown oder HTML)" aria-label="Inhalt (einfacher Text, Markdown oder HTML)" maxlength="5000"></textarea>
                            <span id="textareaLength">0/5000</span>
                        </div>
                        <div class="row">
                            <div id="colors">
                                <span class="Noir" role="button" tabindex="0" aria-label="Standard"></span>
                                <span class="Rouge" role="button" tabindex="0" aria-label="Rot"></span>
                                <span class="Orange" role="button" tabindex="0" aria-label="Orange"></span>
                                <span class="Jaune" role="button" tabindex="0" aria-label="Gelb"></span>
                                <span class="Vert" role="button" tabindex="0" aria-label="Grün"></span>
                                <span class="Cyan" role="button" tabindex="0" aria-label="Cyan"></span>
                                <span class="BleuCiel" role="button" tabindex="0" aria-label="Himmelblau"></span>
                                <span class="Bleu" role="button" tabindex="0" aria-label="Blau"></span>
                                <span class="Violet" role="button" tabindex="0" aria-label="Lila"></span>
                                <span class="Rose" role="button" tabindex="0" aria-label="Rosa"></span>
                            </div>
                        </div>
                        <div class="row">
                            <label class="category" for="noCat">
                                <input type="radio" name="category" id="noCat" value="0" checked>
                                <span tabindex="0" role="button">❌</span>
                            </label>
                            <label class="category" for="catPerso">
                                <input type="radio" name="category" id="catPerso" value="1">
                                <span tabindex="0" role="button">👤Persönlich</span>
                            </label>
                            <label class="category" for="catPro">
                                <input type="radio" name="category" id="catPro" value="2">
                                <span tabindex="0" role="button">💼Arbeit</span>
                            </label>
                            <label class="category" for="catVoyage">
                                <input type="radio" name="category" id="catVoyage" value="3">
                                <span tabindex="0" role="button">🏖️Reisen</span>
                            </label>
                            <label class="category" for="catTask">
                                <input type="radio" name="category" id="catTask" value="4">
                                <span tabindex="0" role="button">📓Aufgaben</span>
                            </label>
                            <label class="category" for="catRappel">
                                <input type="radio" name="category" id="catRappel" value="5">
                                <span tabindex="0" role="button">🕰️Erinnerung</span>
                            </label>
                            <label class="category" for="catIdees">
                                <input type="radio" name="category" id="catIdees" value="6">
                                <span tabindex="0" role="button">💡Ideen</span>
                            </label>
                        </div>
                        <div class="row">
                            Versteckte Notiz
                            <label for="checkHidden" class="switch" aria-label="Versteckte Notiz">
                                <input type="checkbox" id="checkHidden" aria-hidden="true" tabindex="-1">
                                <span class="slider" tabindex="0" role="button"></span>
                            </label>
                        </div>
                        <button type="submit">Notiz speichern</button>
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
                        <span id="export-all-notes" class="linkp" tabindex="0">Alle Notizen exportieren</span>
                    </div>
                    <div class="row">
                        <span class="linkp">
                            <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" rel="noreferrer">
                                Markdown-Anleitung
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </span>
                    </div>
                    <div class="row">
                        <span class="linkp">
                            <a href="https://github.com/seguinleo/Bloc-notes/discussions" rel="noreferrer">
                                Hilfe und Diskussionen
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </span>
                    </div>
                    <div class="row">
                        <div id="accent-colors">
                            <span class="accentBlueSpan" role="button" tabindex="0" aria-label="Blau"></span>
                            <span class="accentGreenSpan" role="button" tabindex="0" aria-label="Grün"></span>
                            <span class="accentYellowSpan" role="button" tabindex="0" aria-label="Gelb"></span>
                            <span class="accentPinkSpan" role="button" tabindex="0" aria-label="Rosa"></span>
                        </div>
                    </div>
                    <div class="row">
                        <i class="fa-solid fa-fingerprint"></i>
                        <label for="checkFingerprint" class="switch" aria-label="Fingerabdrucksperre">
                            <input type="checkbox" id="checkFingerprint" aria-hidden="true" tabindex="-1">
                            <span class="slider" tabindex="0" role="button"></span>
                        </label>
                    </div>
                    <div class="row">
                        <p class="version">
                            <a href="https://github.com/seguinleo/Bloc-notes/" rel="noreferrer">v24.1.2</a>
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
                            <span id="log-out" class="linkp" tabindex="0" role="button">Abmelden</span>
                        </div>
                        <form id="changePsswd" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_psswd" name="csrf_token_psswd" value="<?= $csrf_token_psswd ?>">
                            <div class="row">
                                <input id="newPsswd" placeholder="Neues Passwort" type="password" minlength="6" maxlength="50" aria-label="Neues Passwort" required>
                            </div>
                            <div class="row">
                                <input id="newPsswdValid" placeholder="Geben Sie Ihr neues Passwort erneut ein" type="password" minlength="6" maxlength="50" aria-label="Geben Sie Ihr neues Passwort erneut ein" required>
                            </div>
                            <button type="submit">Passwort ändern</button>
                        </form>
                        <div class="row">
                            <span id="delete-account" class="linkp warning" tabindex="0">Mein Konto löschen</span>
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
                                Möchten Sie Ihre Notiz veröffentlichen? Dadurch wird ein eindeutiger Link zum Teilen Ihrer Notiz generiert.
                            </div>
                            <input id="idNotePublic" type="hidden">
                            <div class="row">
                                <button type="submit">Machen Sie die Notiz öffentlich</button>
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
                        <p id="copyNoteLink" tabindex="0"></p>
                        <form id="privateNote" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                Möchten Sie Ihre Notiz wieder privat machen? Der eindeutige Link ist nicht mehr verfügbar.
                            </div>
                            <input id="idNotePrivate" type="hidden">
                            <input id="linkNotePrivate" type="hidden">
                            <div class="row">
                                <button type="submit">Machen Sie die Notiz privat</button>
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
                            <span id="create-account" class="linkp" tabindex="0" role="button">Registrieren Sie sich</span>
                        </div>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nameConnect" placeholder="Nutzername" type="text" maxlength="25" aria-label="Nutzername" required>
                            </div>
                            <div class="row">
                                <input id="psswdConnect" placeholder="Passwort" type="password" maxlength="50" aria-label="Passwort" required>
                            </div>
                            <button type="submit">Anmelden</button>
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
                            <input type="hidden" id="csrf_token_create" name="csrf_token_create" value="<?= $csrf_token_create ?>">
                            <div class="row">
                                <input id="nameCreate" placeholder="Nutzername" type="text" minlength="4" maxlength="25" aria-label="Nutzername" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreate" placeholder="Passwort" type="password" minlength="6" maxlength="50" aria-label="Passwort" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreateValid" placeholder="Passwort erneut eingeben" type="password" minlength="6" maxlength="50" aria-label="Passwort erneut eingeben" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Ihr Passwort wird sicher gespeichert und Ihre Notizen werden verschlüsselt.
                                <span class="warning">Es ist unmöglich, Ihr Passwort wiederherzustellen, wenn Sie es vergessen.</span>
                            </div>
                            <details id="genPsswd">
                                <summary>Generieren Sie ein sicheres Passwort</summary>
                                <div class="row">
                                    <input id="psswdGen" type="text" minlength="6" maxlength="50" aria-label="Passwort generiert" disabled>
                                    <button id="submitGenPsswd" type="button" aria-label="Generieren Sie ein sicheres Passwort">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                            </details>
                            <button type="submit">Registrieren Sie sich</button>
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
