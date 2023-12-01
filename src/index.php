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

if (isset($_SESSION['nom']) === false) {
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
    $nom = $_SESSION['nom'];
}
?>
<!DOCTYPE html>
<html class="dark" lang="fr-FR">
<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Enregistrez des notes sur votre appareil ou connectez-vous pour synchroniser et chiffrer vos notes.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#171717" class="themecolor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" class="themecolor">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; child-src 'none'; connect-src 'self'; frame-ancestors 'none'; frame-src 'none'; font-src 'self' https://cdnjs.cloudflare.com/; form-action 'self'; img-src http:; manifest-src 'self'; media-src 'none'; object-src 'none'; script-src 'self'; script-src-attr 'none'; script-src-elem 'self'; style-src 'self' https://cdnjs.cloudflare.com/; worker-src 'self'">
    <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="manifest" href="app.webmanifest">
</head>
<body>
    <nav>
        <noscript>
            <p class="noscript">Vous devez activer JavaScript pour utiliser Bloc-notes.</p>
        </noscript>
        <?php if (isset($nom) === true) { ?>
            <div class="welcome">
                <h1>
                    <span class="gestionCompte linkp" tabindex="0" role="button" aria-label="Gestion du compte">
                        <i class="fa-solid fa-circle-user"></i>
                    </span>
                </h1>
            </div>
        <?php } else { ?>
            <div class="welcome">
                <h1>Bloc-notes</h1>
            </div>
            <div>
                <button type="button" class="seconnecter">Me connecter</button>
            </div>
        <?php } ?>
        <div class="search-input">
            <i class="fa-solid fa-bars" id="menuIcon" tabindex="0" aria-label="Menu" role="button"></i>
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Recherche" placeholder="Recherche">
            <kbd>CTRL</kbd><kbd>K</kbd>
            <?php if (isset($nom) === true) { ?>
                <span class="gestionCompte linkp" aria-label="Compte" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } else { ?>
                <span class="seconnecter linkp" aria-label="Se connecter" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <?php if (isset($nom) === true) { ?>
            <div class="lastSync">
                <i class="resync fa-solid fa-sync" aria-label="Synchroniser" tabindex="0" role="button"></i>
                <span></span>
            </div>
        <?php } ?>
        <div class="divTheme">
            <button type="button" id="btnTheme" aria-label="Thème">
                <i id="iconeTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <?php if (isset($nom) === true) { ?>
            <button id="iconButtonConnectFloat" class="iconConnectFloat" type="button" aria-label="Ajouter une note sur le cloud"><i class="fa-solid fa-plus"></i></button>
        <?php } else { ?>
            <button id="iconButtonFloat" class="iconFloat" type="button" aria-label="Ajouter une note sur l'appareil"><i class="fa-solid fa-plus"></i></button>
        <?php } ?>
        <div id="errorNotification"></div>
        <div class="sideBar">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>Notes</h2>
            <?php if (isset($nom) === true) { ?>
                <button id="iconButtonConnect" class="iconConnect" type="button">Ajouter une note dans le cloud</button>
            <?php } else { ?>
                <button id="iconButton" class="icon" type="button">Ajouter une note sur l'appareil</button>
            <?php } ?>
            <div class="listNotes"></div>
            <div class="copyright">
                <a href="/mentionslegales/" target="_blank" rel="noreferrer">Mentions légales / confidentialité</a>
                <div class="divLanguage">
                    <select id="language" aria-label="Langue">
                        <option value="fr" selected>🇫🇷</option>
                        <option value="en">🇬🇧</option>
                        <option value="de">🇩🇪</option>
                    </select>
                </div>
                <span class="license">GPL-3.0 &copy;<?= date('Y') ?></span>
            </div>
        </div>
        <div id="copyNotification">Copié !</div>
        <button type="button" id="btnSort" aria-label="Trier les notes">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <div class="sort-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <h2>Trier les notes par :</h2>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="1">
                            Date de création
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="2">
                            Date de création (Z-A)
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="3" checked>
                            Date de modification
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="4">
                            Date de modification (Z-A)
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="note-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <form id="addNote" method="post" enctype="application/x-www-form-urlencoded">
                        <input id="idNoteInput" type="hidden">
                        <?php if (isset($nom) === true) { ?>
                            <input id="checkLink" type="hidden">
                            <input type="hidden" id="csrf_token_note" value="<?= $csrf_token_note ?>">
                        <?php } ?>
                        <div class="row">
                            <input id="title" placeholder="Titre" type="text" maxlength="30" aria-label="titre" required>
                        </div>
                        <div class="row">
                            <textarea id="content" placeholder="Contenu (Texte brut, Markdown ou HTML)" aria-label="contenu" maxlength="5000"></textarea>
                            <span id="textareaLength">0/5000</span>
                        </div>
                        <div class="row">
                            <div class="couleurs">
                                <span class="Noir" role="button" tabindex="0" aria-label="Défaut"></span>
                                <span class="Rouge" role="button" tabindex="0" aria-label="Rouge"></span>
                                <span class="Orange" role="button" tabindex="0" aria-label="Orange"></span>
                                <span class="Jaune" role="button" tabindex="0" aria-label="Jaune"></span>
                                <span class="Vert" role="button" tabindex="0" aria-label="Vert"></span>
                                <span class="Cyan" role="button" tabindex="0" aria-label="Cyan"></span>
                                <span class="BleuCiel" role="button" tabindex="0" aria-label="Bleu ciel"></span>
                                <span class="Bleu" role="button" tabindex="0" aria-label="Bleu"></span>
                                <span class="Violet" role="button" tabindex="0" aria-label="Violet"></span>
                                <span class="Rose" role="button" tabindex="0" aria-label="Rose"></span>
                            </div>
                        </div>
                        <div class="row">
                            Note masquée
                            <label for="checkHidden" class="switch" aria-label="Note masquée">
                                <input type="checkbox" id="checkHidden" aria-hidden="true" tabindex="-1">
                                <span class="slider" tabindex="0"></span>
                            </label>
                        </div>
                        <button id="submitNote" type="submit">Enregistrer la note</button>
                    </form>
                </div>
            </div>
        </div>
        <?php if (isset($nom) === true) { ?>
            <div class="gestion-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <div class="row">
                            <span class="sedeconnecter linkp" tabindex="0" role="button">Me déconnecter</span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" target="_blank" rel="noreferrer">
                                    Guide Markdown
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </span>
                        </div>
                        <details>
                            <summary>Gestion du compte <?= $nom ?></summary>
                            <form id="changeMDP" method="post" enctype="application/x-www-form-urlencoded">
                                <input type="hidden" id="csrf_token_mdp" value="<?= $csrf_token_mdp ?>">
                                <div class="row">
                                    <input id="mdpModifNew" placeholder="Nouveau mot de passe" type="password" minlength="6" maxlength="50" aria-label="Nouveau mot de passe" required>
                                </div>
                                <div class="row">
                                    <input id="mdpModifNewValid" placeholder="Retaper le nouveau mot de passe" type="password" minlength="6" maxlength="50" aria-label="Retaper le nouveau mot de passe" required>
                                </div>
                                <button id="submitChangeMDP" type="submit">Modifier mon mot de passe</button>
                            </form>
                            <div class="row">
                                <span class="exportAll linkp" tabindex="0">Exporter toutes mes notes</span>
                            </div>
                            <div class="row">
                                <span class="supprimerCompte attention" tabindex="0">Supprimer mon compte</span>
                            </div>
                        </details>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/seguinleo/Bloc-notes/" target="_blank" rel="noreferrer">v23.11.3</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="private-note-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="rendrePublique" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                Voulez-vous rendre votre note publique ? Cela générera un lien unique pour partager votre note.
                            </div>
                            <input id="idNoteInputPublic" type="hidden">
                            <div class="row">
                                <button id="submitRendrePublique" type="submit">Rendre la note publique</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="public-note-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <p id="copyNoteLink" tabindex="0"></p>
                        <form id="rendrePrivee" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                Voulez-vous de nouveau rendre votre note privée ? Le lien unique ne sera plus disponible.
                            </div>
                            <input id="idNoteInputPrivate" type="hidden">
                            <input id="linkNoteInputPrivate" type="hidden">
                            <div class="row">
                                <button id="submitRendrePrivee" type="submit">Rendre la note privée</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        <?php } else { ?>
            <div class="connect-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <div class="row">
                            <span class="creercompte linkp" tabindex="0" role="button">Créer mon compte</span>
                        </div>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nomConnect" placeholder="Nom" type="text" maxlength="25" aria-label="Nom" required>
                            </div>
                            <div class="row">
                                <input id="mdpConnect" placeholder="Mot de passe" type="password" maxlength="50" aria-label="Mot de passe" required>
                            </div>
                            <button id="submitSeConnecter" type="submit">Me connecter</button>
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
                            <input type="hidden" id="csrf_token_creer" value="<?= $csrf_token_creer ?>">
                            <div class="row">
                                <input id="nomCreer" placeholder="Nom" type="text" minlength="4" maxlength="25" aria-label="Nom" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreer" placeholder="Mot de passe" type="password" minlength="6" maxlength="50" aria-label="Mot de passe" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreerValid" placeholder="Retaper mot de passe" type="password" minlength="6" maxlength="50" aria-label="Retaper mot de passe" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Votre mot de passe est stocké en toute sécurité et vos notes chiffrées.
                                <span class="attention">Il vous sera impossible de récupérer votre mot de passe si vous l'oubliez.</span>
                            </div>
                            <details id="genMdp">
                                <summary>Générer un mot de passe fort</summary>
                                <div class="row">
                                    <input id="mdpCreerGen" type="text" minlength="6" maxlength="50" aria-label="Mot de passe généré" disabled required>
                                    <button id="submitGenMdp" type="button" aria-label="Générer un mot de passe fort">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                            </details>
                            <button id="submitCreer" type="submit">Créer mon compte</button>
                        </form>
                    </div>
                </div>
            </div>
        <?php } ?>
        <div id="newVersion">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>v23.11.3🎉</h2>
            <p>
                Au menu ? Une interface plus travaillée, un générateur de mot de passe et de nombreuses corrections de bugs.
            </p>
            <p>
                <a href="https://github.com/seguinleo/Bloc-notes/blob/main/CHANGELOG.txt" target="_blank" rel="noreferrer">Liste des changements</a>
            </p>
        </div>
    </main>
    <script src="assets/js/showdown.min.js" defer></script>
    <?php if (isset($nom) === true) { ?>
        <script src="assets/js/scriptConnect.js" defer></script>
    <?php } else { ?>
        <script src="assets/js/script.js" defer></script>
    <?php } ?>
</body>
</html>
