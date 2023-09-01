<?php
session_name('__Secure-notes');
$cookieParams = [
    'path'     => '/notes',
    'lifetime' => 604800,
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax'
];
session_set_cookie_params($cookieParams);
session_start();

if (isset($_SESSION["nom"]) === false) {
    $_SESSION['csrf_token_connect'] = bin2hex(random_bytes(32));
    $_SESSION['csrf_token_creer'] = bin2hex(random_bytes(32));
    $csrf_token_connect = $_SESSION['csrf_token_connect'];
    $csrf_token_creer = $_SESSION['csrf_token_creer'];
    $nom = null;
} else {
    $_SESSION['csrf_token_note'] = bin2hex(random_bytes(32));
    $_SESSION['csrf_token_mdp'] = bin2hex(random_bytes(32));
    $csrf_token_note = $_SESSION['csrf_token_note'];
    $csrf_token_mdp = $_SESSION['csrf_token_mdp'];
    $nom = $_SESSION["nom"];
}
?>
<!DOCTYPE html>
<html class="dark" lang="de">

<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Speichern Sie Notizen auf Ihrem Gerät oder melden Sie sich an, um Ihre Notizen zu synchronisieren und zu verschlüsseln.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#272727" id="themecolor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#272727">
    <!-- TWITTER ("""X""")
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta name="twitter:description" content="Speichern Sie Notizen auf Ihrem Gerät oder melden Sie sich an, um Ihre Notizen zu synchronisieren und zu verschlüsseln.">
    <meta name="twitter:image" content="https://leoseguin.fr/assets/img/notes.png">
    -->
    <link rel="alternate" hreflang="en" href="en/">
    <link rel="alternate" hreflang="fr" href="">
    <link rel="alternate" hreflang="de" href="de/">
    <link rel="alternate" hreflang="x-default" href="en/">
    <!-- Open Graph
    <meta property="og:type" content="website">
    <meta property="og:title" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta property="og:description" content="Speichern Sie Notizen auf Ihrem Gerät oder melden Sie sich an, um Ihre Notizen zu synchronisieren und zu verschlüsseln.">
    <meta property="og:site_name" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta property="og:url" content="https://leoseguin.fr/projets">
    <meta property="og:image" content="https://leoseguin.fr/assets/img/notes.png">
    <meta property="og:locale" content="de">
    -->
    <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="manifest" href="de/app.webmanifest">
</head>

<body>
    <nav>
        <?php if (isset($nom) === true) { ?>
            <div class="welcome">
                <h1>
                    <span class="gestionCompte linkp" tabindex="0" role="button">
                        <i class="fa-solid fa-circle-user"></i>
                        <?= $nom ?>
                    </span>
                </h1>
            </div>
        <?php } else { ?>
            <div class="welcome">
                <h1>Bloc-notes</h1>
                <span class="version">
                    <a href="https://github.com/seguinleo/Bloc-notes/" aria-label="Siehe auf GitHub (v23.9.1)" target="_blank" rel="noreferrer">v23.9.1</a>
                </span>
            </div>
            <div>
                <button type="button" class="seconnecter" aria-label="Anmelden">Anmelden</button>
            </div>
        <?php } ?>
        <div class="search-input">
            <i class="fa-solid fa-bars" id="menuIcon" tabindex="0" aria-label="Menu" role="button"></i>
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="text" id="search-input" name="search-input" maxlength="30" aria-label="Suche" placeholder="Suche">
            <kbd>CTRL</kbd><kbd>K</kbd>
            <?php if (isset($nom) === true) { ?>
                <span class="gestionCompte linkp" aria-label="Konto" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } else { ?>
                <span class="seconnecter linkp" aria-label="Anmelden" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <?php if (isset($nom) === true) { ?>
            <div class="lastSync">
                <i class="resync fa-solid fa-sync" aria-label="Sync" tabindex="0" role="button"></i>
                <span></span>
            </div>
        <?php } ?>
        <div class="divTheme">
            <button type="button" id="btnTheme" aria-label="Dunkel-/Hellmodus">
                <i id="iconeTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <?php if (isset($nom) === true) { ?>
            <div class="iconConnectFloat">
                <button id="iconButtonConnectFloat" type="button" aria-label="Eine Wolkennotiz hinzufügen"><i class="fa-solid fa-plus"></i></button>
            </div>
        <?php } else { ?>
            <div class="iconFloat">
                <button id="iconButtonFloat" type="button" aria-label="Eine lokale Notiz hinzufügen"><i class="fa-solid fa-plus"></i></button>
            </div>
        <?php } ?>
        <div class="darken"></div>
        <div id="errorNotification"></div>
        <div class="sideBar">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>Notizen</h2>
            <?php if (isset($nom) === true) { ?>
                <div class="iconConnect">
                    <button id="iconButtonConnect" type="button" aria-label="Eine Wolkennotiz hinzufügen">Eine Wolkennotiz hinzufügen</button>
                </div>
            <?php } else { ?>
                <div class="icon">
                    <button id="iconButton" type="button" aria-label="Eine lokale Notiz hinzufügen">Eine lokale Notiz hinzufügen</button>
                </div>
            <?php } ?>
            <div class="listNotes"></div>
            <div class="copyright">
                <a href="https://leoseguin.fr/mentionslegales/" target="_blank" rel="noreferrer" aria-label="Rechtliche Hinweise / Datenschutz">Rechtliche Hinweise / Datenschutz</a>
                <div class="divLanguage">
                    <select class="language" name="language" aria-label="Sprache">
                        <option value="fr">🇫🇷</option>
                        <option value="en">🇬🇧</option>
                        <option value="de" selected>🇩🇪</option>
                    </select>
                </div>
                <span class="license">GPL-3.0 &copy;<?= date('Y') ?></span>
            </div>
        </div>
        <div id="copyNotification">Notiz kopiert!</div>
        <?php if (isset($nom) === true) { ?>
            <div class="connect-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="addFormConnect" method="post" enctype="application/x-www-form-urlencoded">
                            <input id="idNoteInputConnect" name="idNoteInputConnect" type="hidden">
                            <input type="hidden" id="csrf_token_note" name="csrf_token_note" value="<?= $csrf_token_note ?>">
                            <div class="row">
                                <input id="titleConnect" name="titleConnect" placeholder="Titel" type="text" maxlength="30" aria-label="Titel" required>
                            </div>
                            <div class="row">
                                <textarea id="descConnect" name="descConnect" placeholder="Inhalt (Markdown)" aria-label="Inhalt" maxlength="5000"></textarea>
                            </div>
                            <div class="row">
                                <div class="couleurs">
                                    <span class="Noir" role="button" tabindex="0" aria-label="Schwarz"></span>
                                    <span class="Blanc" role="button" tabindex="0" aria-label="Weiß"></span>
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
                            Versteckte Notiz
                            <div class="row">
                                <label for="checkHidden" class="switch" aria-label="Versteckte Notiz">
                                    <input type="checkbox" name="checkHidden" id="checkHidden" aria-hidden="true" tabindex="-1">
                                    <span class="slider" tabindex="0"></span>
                                </label>
                            </div>
                            <button id="submitNoteConnect" type="submit" aria-label="Notiz speichern">Notiz speichern <i class="fa-solid fa-cloud"></i></button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="gestion-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <div class="row">
                            <span class="sedeconnecter linkp" tabindex="0" role="button">Abmelden</span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" target="_blank" rel="noreferrer" aria-label="Markdown-Anleitung">Markdown-Anleitung</a>
                            </span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="#" aria-label="Hilfe" target="_blank" rel="noreferrer">
                                    <i class="fa-solid fa-circle-question"></i>
                                    Hilfe
                                </a>
                            </span>
                        </div>
                        <div class="row">
                            <select id="tri" name="tri" aria-label="sortieren">
                                <option disabled selected value>Notizen sortieren</option>
                                <option value="Date de création">Datum der Erstellung</option>
                                <option value="Date de création (Z-A)">Datum der Erstellung (Z-A)</option>
                                <option value="Date de modification">Datum der Änderung</option>
                                <option value="Date de modification (Z-A)">Datum der Änderung (Z-A)</option>
                            </select>
                        </div>
                        <details>
                            <summary><?= $nom ?>-Konto verwalten</summary>
                            <form id="changeMDP" method="post" enctype="application/x-www-form-urlencoded">
                                <input type="hidden" id="csrf_token_mdp" name="csrf_token_mdp" value="<?= $csrf_token_mdp ?>">
                                <div class="row">
                                    <input id="mdpModifNew" name="mdpModifNew" placeholder="Neues Passwort" type="password" minlength="6" maxlength="50" aria-label="Passwort" required>
                                </div>
                                <div class="row">
                                    <input id="mdpModifNewValid" name="mdpModifNewValid" placeholder="Geben Sie Ihr neues Passwort erneut ein" type="password" minlength="6" maxlength="50" aria-label="Passwort" required>
                                </div>
                                <button id="submitChangeMDP" type="submit" aria-label="Passwort ändern">Passwort ändern</button>
                            </form>
                            <div class="row">
                                <span class="supprimerCompte" tabindex="0">Mein Konto löschen</span>
                            </div>
                        </details>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/seguinleo/Bloc-notes/" aria-label="Siehe auf GitHub" target="_blank" rel="noreferrer">v23.9.1</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        <?php } else { ?>
            <div class="popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="addForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input id="idNoteInput" name="idNoteInput" type="hidden">
                            <div class="row">
                                <input id="title" name="title" placeholder="Titel" type="text" maxlength="30" aria-label="Titel" required>
                            </div>
                            <div class="row">
                                <textarea id="content" name="content" placeholder="Inhalt (Markdown)" aria-label="Inhalt" maxlength="5000"></textarea>
                            </div>
                            <div class="row">
                                <div class="couleurs">
                                    <span class="Noir" role="button" tabindex="0" aria-label="Schwarz"></span>
                                    <span class="Blanc" role="button" tabindex="0" aria-label="Weiß"></span>
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
                            Versteckte Notiz
                            <div class="row">
                                <label for="checkHidden" class="switch" aria-label="Versteckte Notiz">
                                    <input type="checkbox" name="checkHidden" id="checkHidden" aria-hidden="true" tabindex="-1">
                                    <span class="slider" tabindex="0"></span>
                                </label>
                            </div>
                            <button id="submitNote" type="submit" aria-label="Notiz speichern">Notiz speichern</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="connect-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <span class="creercompte linkp" tabindex="0" role="button">Noch kein Konto?</span>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" name="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nomConnect" name="nomConnect" placeholder="Nutzername" type="text" maxlength="25" aria-label="Nutzername" required>
                            </div>
                            <div class="row">
                                <input id="mdpConnect" name="mdpConnect" placeholder="Passwort" type="password" maxlength="50" aria-label="Passwort" required>
                            </div>
                            <button id="submitSeConnecter" type="submit" aria-label="Anmelden">Anmelden</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="creer-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="creerForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_creer" name="csrf_token_creer" value="<?= $csrf_token_creer ?>">
                            <div class="row">
                                <input id="nomCreer" name="nomCreer" placeholder="Nutzername" type="text" minlength="4" maxlength="25" aria-label="Nutzername" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreer" name="mdpCreer" placeholder="Passwort" type="password" minlength="6" maxlength="50" aria-label="Passwort" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreerValid" name="mdpCreerValid" placeholder="Geben Sie Ihr Passwort erneut ein" type="password" minlength="6" maxlength="50" aria-label="Passwort" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Ihr Passwort wird sicher gespeichert und Ihre Notizen werden verschlüsselt.
                            </div>
                            <button id="submitCreer" type="submit" aria-label="Registrieren Sie sich">Registrieren Sie sich</button>
                        </form>
                    </div>
                </div>
            </div>
        <?php } ?>
    </main>
    <script src="assets/js/showdown.min.js" defer></script>
    <?php if (isset($nom) === true) { ?>
        <script src="assets/js/scriptConnect.js" defer></script>
    <?php } else { ?>
        <script src="assets/js/script.js" defer></script>
    <?php } ?>
</body>

</html>
