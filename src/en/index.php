<?php
session_name('__Secure-notes');
$cookieParams = [
    'path'     => './',
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
<html class="dark" lang="en">

<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Save notes to your device or sign in to sync and encrypt your notes.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#272727" id="themecolor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#272727">
    <!-- TWITTER ("""X""")
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta name="twitter:description" content="Save notes to your device or sign in to sync and encrypt your notes.">
    <meta name="twitter:image" content="https://leoseguin.fr/assets/img/notes.png">
    -->
    <link rel="alternate" hreflang="en" href="en/">
    <link rel="alternate" hreflang="fr" href="">
    <link rel="alternate" hreflang="de" href="de/">
    <link rel="alternate" hreflang="x-default" href="en/">
    <!-- Open Graph
    <meta property="og:type" content="website">
    <meta property="og:title" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta property="og:description" content="Save notes to your device or sign in to sync and encrypt your notes.">
    <meta property="og:site_name" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta property="og:url" content="https://leoseguin.fr/projets">
    <meta property="og:image" content="https://leoseguin.fr/assets/img/notes.png">
    <meta property="og:locale" content="en">
    -->
    <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="manifest" href="en/app.webmanifest">
</head>

<body>
    <nav>
        <?php if (isset($nom) === true) { ?>
            <div>
                <h1 class="welcome">
                    <span class="gestionCompte linkp" tabindex="0" role="button">
                        <i class="fa-solid fa-circle-user"></i>
                        <?= $nom ?>
                    </span>
                </h1>
            </div>
        <?php } else { ?>
            <div>
                <h1>Bloc-notes</h1>
                <span class="version">
                    <a href="https://github.com/seguinleo/Bloc-notes/" aria-label="See on GitHub (v23.9.1)" target="_blank" rel="noreferrer">v23.9.1</a>
                </span>
            </div>
            <div>
                <button type="button" class="seconnecter" aria-label="Sign in">Sign in</button>
            </div>
        <?php } ?>
        <div class="search-input">
            <i class="fa-solid fa-bars" id="menuIcon" tabindex="0" aria-label="Menu" role="button"></i>
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="text" id="search-input" name="search-input" maxlength="30" aria-label="Search" placeholder="Search">
            <kbd>CTRL</kbd><kbd>K</kbd>
            <?php if (isset($nom) === true) { ?>
                <span class="gestionCompte linkp" aria-label="Account" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } else { ?>
                <span class="seconnecter linkp" aria-label="Sign in" tabindex="0" role="button">
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
            <button type="button" id="btnTheme" aria-label="Dark/Light mode">
                <i id="iconeTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <?php if (isset($nom) === true) { ?>
            <div class="iconConnectFloat">
                <button id="iconButtonConnectFloat" type="button" aria-label="Add a cloud note"><i class="fa-solid fa-plus"></i></button>
            </div>
        <?php } else { ?>
            <div class="iconFloat">
                <button id="iconButtonFloat" type="button" aria-label="Add a local note"><i class="fa-solid fa-plus"></i></button>
            </div>
        <?php } ?>
        <div class="darken"></div>
        <div id="errorNotification"></div>
        <div class="sideBar">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>Notes</h2>
            <?php if (isset($nom) === true) { ?>
                <div class="iconConnect">
                    <button id="iconButtonConnect" type="button" aria-label="Add a cloud note">Add a cloud note</button>
                </div>
            <?php } else { ?>
                <div class="icon">
                    <button id="iconButton" type="button" aria-label="Add a local note">Add a local note</button>
                </div>
            <?php } ?>
            <div class="listNotes"></div>
            <div class="copyright">
                <a href="https://leoseguin.fr/mentionslegales/" target="_blank" rel="noreferrer" aria-label="Legal Notice / Privacy policy">Legal notice / Privacy policy</a>
                <div class="divLanguage">
                    <select class="language" name="language" aria-label="Langue">
                        <option value="fr">🇫🇷</option>
                        <option value="en" selected>🇬🇧</option>
                        <option value="de">🇩🇪</option>
                    </select>
                </div>
                <span class="license">GPL-3.0 &copy;<?= date('Y') ?></span>
            </div>
        </div>
        <div id="copyNotification">Note copied!</div>
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
                                <input id="titleConnect" name="titleConnect" placeholder="Title" type="text" maxlength="30" aria-label="title" required>
                            </div>
                            <div class="row">
                                <textarea id="descConnect" name="descConnect" placeholder="Content (Markdown)" aria-label="content" maxlength="5000"></textarea>
                            </div>
                            <div class="row">
                                <div class="couleurs">
                                    <span class="Noir" role="button" tabindex="0" aria-label="Black"></span>
                                    <span class="Blanc" role="button" tabindex="0" aria-label="White"></span>
                                    <span class="Rouge" role="button" tabindex="0" aria-label="Red"></span>
                                    <span class="Orange" role="button" tabindex="0" aria-label="Orange"></span>
                                    <span class="Jaune" role="button" tabindex="0" aria-label="Yellow"></span>
                                    <span class="Vert" role="button" tabindex="0" aria-label="Green"></span>
                                    <span class="Cyan" role="button" tabindex="0" aria-label="Cyan"></span>
                                    <span class="BleuCiel" role="button" tabindex="0" aria-label="Sky blue"></span>
                                    <span class="Bleu" role="button" tabindex="0" aria-label="Blue"></span>
                                    <span class="Violet" role="button" tabindex="0" aria-label="Purple"></span>
                                    <span class="Rose" role="button" tabindex="0" aria-label="Pink"></span>
                                </div>
                            </div>
                            Hidden note
                            <div class="row">
                                <label for="checkHidden" class="switch" aria-label="Hidden note">
                                    <input type="checkbox" name="checkHidden" id="checkHidden" aria-hidden="true" tabindex="-1">
                                    <span class="slider" tabindex="0"></span>
                                </label>
                            </div>
                            <button id="submitNoteConnect" type="submit" aria-label="Save note">Save note <i class="fa-solid fa-cloud"></i></button>
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
                            <span class="sedeconnecter linkp" tabindex="0" role="button">Sign out</span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" target="_blank" rel="noreferrer" aria-label="Markdown guide">Markdown guide</a>
                            </span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="#" aria-label="Help" target="_blank" rel="noreferrer">
                                    <i class="fa-solid fa-circle-question"></i>
                                    Help
                                </a>
                            </span>
                        </div>
                        <div class="row">
                            <select id="tri" name="tri" aria-label="sort">
                                <option disabled selected value>Sort notes</option>
                                <option value="Date de création">Creation date</option>
                                <option value="Date de création (Z-A)">Creation date (Z-A)</option>
                                <option value="Date de modification">Modification date</option>
                                <option value="Date de modification (Z-A)">Modification date (Z-A)</option>
                            </select>
                        </div>
                        <details>
                            <summary>Manage <?= $nom ?> account</summary>
                            <form id="changeMDP" method="post" enctype="application/x-www-form-urlencoded">
                                <input type="hidden" id="csrf_token_mdp" name="csrf_token_mdp" value="<?= $csrf_token_mdp ?>">
                                <div class="row">
                                    <input id="mdpModifNew" name="mdpModifNew" placeholder="New password" type="password" minlength="6" maxlength="50" aria-label="password" required>
                                </div>
                                <div class="row">
                                    <input id="mdpModifNewValid" name="mdpModifNewValid" placeholder="Retype your new password" type="password" minlength="6" maxlength="50" aria-label="password" required>
                                </div>
                                <button id="submitChangeMDP" type="submit" aria-label="Change password">Change password</button>
                            </form>
                            <div class="row">
                                <span class="supprimerCompte" tabindex="0">Delete my account</span>
                            </div>
                        </details>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/seguinleo/Bloc-notes/" aria-label="See on GitHub" target="_blank" rel="noreferrer">v23.9.1</a>
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
                                <input id="title" name="title" placeholder="Title" type="text" maxlength="30" aria-label="title" required>
                            </div>
                            <div class="row">
                                <textarea id="content" name="content" placeholder="Content (Markdown)" aria-label="content" maxlength="5000"></textarea>
                            </div>
                            <div class="row">
                                <div class="couleurs">
                                    <span class="Noir" role="button" tabindex="0" aria-label="Black"></span>
                                    <span class="Blanc" role="button" tabindex="0" aria-label="White"></span>
                                    <span class="Rouge" role="button" tabindex="0" aria-label="Red"></span>
                                    <span class="Orange" role="button" tabindex="0" aria-label="Orange"></span>
                                    <span class="Jaune" role="button" tabindex="0" aria-label="Yellow"></span>
                                    <span class="Vert" role="button" tabindex="0" aria-label="Green"></span>
                                    <span class="Cyan" role="button" tabindex="0" aria-label="Cyan"></span>
                                    <span class="BleuCiel" role="button" tabindex="0" aria-label="Sky blue"></span>
                                    <span class="Bleu" role="button" tabindex="0" aria-label="Blue"></span>
                                    <span class="Violet" role="button" tabindex="0" aria-label="Purple"></span>
                                    <span class="Rose" role="button" tabindex="0" aria-label="Pink"></span>
                                </div>
                            </div>
                            Hidden note
                            <div class="row">
                                <label for="checkHidden" class="switch" aria-label="Hidden note">
                                    <input type="checkbox" name="checkHidden" id="checkHidden" aria-hidden="true" tabindex="-1">
                                    <span class="slider" tabindex="0"></span>
                                </label>
                            </div>
                            <button id="submitNote" type="submit" aria-label="Save note">Save note</button>
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
                        <span class="creercompte linkp" tabindex="0" role="button">No account yet?</span>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" name="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nomConnect" name="nomConnect" placeholder="Username" type="text" maxlength="25" aria-label="username" required>
                            </div>
                            <div class="row">
                                <input id="mdpConnect" name="mdpConnect" placeholder="Password" type="password" maxlength="50" aria-label="password" required>
                            </div>
                            <button id="submitSeConnecter" type="submit" aria-label="Sign in">Sign in</button>
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
                                <input id="nomCreer" name="nomCreer" placeholder="Username" type="text" minlength="4" maxlength="25" aria-label="username" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreer" name="mdpCreer" placeholder="Password" type="password" minlength="6" maxlength="50" aria-label="password" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreerValid" name="mdpCreerValid" placeholder="Retype your password" type="password" minlength="6" maxlength="50" aria-label="password" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Your password is securely stored and your notes are encrypted.
                            </div>
                            <button id="submitCreer" type="submit" aria-label="Sign up">Sign up</button>
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
