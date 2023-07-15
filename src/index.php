<?php
session_name('__Secure-notes');
$cookieParams = [
    'path'     => '/projets/notes/',
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
<html class="dark" lang="fr-FR">
<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Enregistrez des notes sur votre appareil ou connectez-vous pour synchroniser et chiffrer vos notes.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#272727" id="themecolor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#272727">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta name="twitter:description" content="Enregistrez des notes sur votre appareil ou connectez-vous pour synchroniser et chiffrer vos notes.">
    <meta name="twitter:image" content="https://leoseguin.fr/assets/img/notes.png">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta property="og:description" content="Enregistrez des notes sur votre appareil ou connectez-vous pour synchroniser et chiffrer vos notes.">
    <meta property="og:site_name" content="Bloc-notes &#8211; Léo SEGUIN">
    <meta property="og:url" content="https://leoseguin.fr/projets/notes/">
    <meta property="og:image" content="https://leoseguin.fr/assets/img/notes.png">
    <meta property="og:locale" content="fr-FR">
    <link rel="alternate" hreflang="en" href="https://leoseguin.fr/projets/notes/en/">
    <link rel="alternate" hreflang="fr" href="https://leoseguin.fr/projets/notes/">
    <link rel="alternate" hreflang="x-default" href="https://leoseguin.fr/projets/notes/en/">
    <link rel="canonical" href="https://leoseguin.fr/projets/notes/">
    <link rel="apple-touch-icon" href="/projets/notes/assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="/projets/notes/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/projets/notes/assets/css/style.css">
    <link rel="stylesheet" href="/assets/fontawesome/css/all.min.css">
    <link rel="manifest" href="/projets/notes/manifest.json">
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
            <div class="iconConnect">
                <button id="iconButtonConnectFloat" type="button" aria-label="Ajouter une note sur le cloud"><i class="fa-solid fa-plus"></i></button>
            </div>
        <?php } else { ?>
            <div>
                <h1>Bloc-notes</h1>
                <span class="version">
                    <a href="https://github.com/PouletEnSlip/Bloc-notes/" aria-label="Voir sur GitHub" target="_blank" rel="noreferrer">v23.7.4</a>
                </span>
            </div>
            <div>
                <button type="button" class="seconnecter" aria-label="Se connecter">Se connecter</button>
            </div>
            <div class="icon">
                <button id="iconButtonFloat" type="button" aria-label="Ajouter une note sur l'appareil"><i class="fa-solid fa-plus"></i></button>
            </div>
        <?php } ?>
        <div class="search-input">
            <i class="fa-solid fa-bars" id="menuIcon" tabindex="0" aria-label="Menu" role="button"></i>
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="text" id="search-input" name="search-input" maxlength="30" aria-label="Recherche" placeholder="Recherche">
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
        <?php if (isset($nom) === false) { ?>
        <div class="divLanguage">
            <select class="language" name="language" aria-label="Langue">
                <option value="fr" selected>🇫🇷</option>
                <option value="en">🇬🇧</option>
            </select>
        </div>
        <?php } ?>
    </nav>
    <main>
        <div class="darken"></div>
        <div id="errorNotification"></div>
        <div class="sideBar">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>Notes</h2>
            <?php if (isset($nom) === true) { ?>
                <div class="iconConnect">
                    <button id="iconButtonConnect" type="button" aria-label="Ajouter une note dans le cloud">Ajouter une note dans le cloud</button>
                </div>
            <?php } else { ?>
                <div class="icon">
                    <button id="iconButton" type="button" aria-label="Ajouter une note sur l'appareil">Ajouter une note sur l'appareil</button>
                </div>
            <?php } ?>
            <div class="listNotes"></div>
            <div class="copyright">
                &copy;<?= date('Y') ?>
            </div>
        </div>
        <div id="cookie">
            <p>Ce site utilise un cookie nécessaire à la connexion de l'utilisateur.</p>
            <button id="cookieButton" type="button" aria-label="Accepter">OK</button>
            <a href="/mentionslegales/" target="_blank" rel="noreferrer" aria-label="En savoir plus sur leoseguin.fr">En savoir plus</a>
        </div>
        <div id="copyNotification">Note copiée !</div>
        <?php if (isset($nom) === true) { ?>
            <div class="connect-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="addFormConnect" method="post" enctype="application/x-www-form-urlencoded">
                            <input id="idNoteInputConnect" type="hidden">
                            <input type="hidden" id="csrf_token_note" name="csrf_token_note" value="<?= $csrf_token_note ?>">
                            <div class="row">
                                <input id="titleConnect" name="titleConnect" placeholder="Titre" type="text" maxlength="30" aria-label="titre" required>
                            </div>
                            <div class="row">
                                <textarea id="descConnect" name="descConnect" placeholder="Contenu (Markdown)" aria-label="contenu" maxlength="5000"></textarea>
                            </div>
                            <div class="row">
                                <div class="couleurs">
                                    <span class="Noir" role="button" tabindex="0" aria-label="Noir"></span>
                                    <span class="Blanc" role="button" tabindex="0" aria-label="Blanc"></span>
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
                            Note masquée
                            <div class="row">
                                <label for="checkHidden" class="switch" aria-label="Note masquée">
                                    <input type="checkbox" name="checkHidden" id="checkHidden" aria-label="Note masquée" tabindex="-1">
                                    <span class="slider" tabindex="0"></span>
                                </label>
                            </div>
                            <button id="submitNoteConnect" type="submit" aria-label="Enregistrer la note">Enregistrer la note <i class="fa-solid fa-cloud"></i></button>
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
                            <span class="sedeconnecter linkp" tabindex="0" role="button">Se déconnecter</span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="/mentionslegales/" target="_blank" rel="noreferrer" aria-label="Mentions légales / Privacy policy">Mentions légales / confidentialité</a>
                            </span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/PouletEnSlip/Bloc-notes/wiki/Markdown" target="_blank" rel="noreferrer" aria-label="Guide Markdown">Guide Markdown</a>
                            </span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="mailto:contact@leoseguin.fr" aria-label="Aide" target="_blank" rel="noreferrer">
                                    <i class="fa-solid fa-circle-question"></i>
                                    Aide
                                </a>
                            </span>
                        </div>
                        <div class="row">
                            <select id="tri" name="tri" aria-label="tri">
                                <option value="Date de modification" selected>Trier les notes</option>
                                <option value="Date de création">Date de création</option>
                                <option value="Date de création (Z-A)">Date de création (Z-A)</option>
                                <option value="Date de modification">Date de modification</option>
                                <option value="Date de modification (Z-A)">Date de modification (Z-A)</option>
                            </select>
                        </div>
                        <div class="row">
                            <select class="language" name="language" aria-label="Langue">
                                <option value="fr" selected>🇫🇷 Français</option>
                                <option value="en">🇬🇧 English</option>
                            </select>
                        </div>
                        <details>
                            <summary>Gestion du compte <?= $nom ?></summary>
                            <form id="changeMDP" method="post" enctype="application/x-www-form-urlencoded">
                                <input type="hidden" id="csrf_token_mdp" name="csrf_token_mdp" value="<?= $csrf_token_mdp ?>">
                                <div class="row">
                                    <input id="mdpModifNew" name="mdpModifNew" placeholder="Nouveau mot de passe" type="password" minlength="6" maxlength="50" aria-label="mdp" required>
                                </div>
                                <div class="row">
                                    <input id="mdpModifNewValid" name="mdpModifNewValid" placeholder="Retaper le nouveau mot de passe" type="password" minlength="6" maxlength="50" aria-label="mdp" required>
                                </div>
                                <button id="submitChangeMDP" type="submit" aria-label="Modifier le mot de passe">Modifier le mot de passe</button>
                            </form>
                            <div class="row">
                                <span class="supprimerCompte" tabindex="0">Supprimer mon compte</span>
                            </div>
                        </details>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/PouletEnSlip/Bloc-notes/" aria-label="Voir sur GitHub" target="_blank" rel="noreferrer">v23.7.4</a>
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
                                <input id="title" name="title" placeholder="Titre" type="text" maxlength="30" aria-label="titre" required>
                            </div>
                            <div class="row">
                                <textarea id="content" name="content" placeholder="Contenu (Markdown)" aria-label="contenu" maxlength="5000"></textarea>
                            </div>
                            <div class="row">
                                <div class="couleurs">
                                    <span class="Noir" role="button" tabindex="0" aria-label="Noir"></span>
                                    <span class="Blanc" role="button" tabindex="0" aria-label="Blanc"></span>
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
                            Note masquée
                            <div class="row">
                                <label for="checkHidden" class="switch" aria-label="Note masquée">
                                    <input type="checkbox" name="checkHidden" id="checkHidden" aria-hidden="true" tabindex="-1">
                                    <span class="slider" tabindex="0"></span>
                                </label>
                            </div>
                            <button id="submitNote" type="submit" aria-label="Enregistrer la note">Enregistrer la note</button>
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
                        <span class="creercompte linkp" tabindex="0" role="button">Pas encore de compte ?</span>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" name="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nomConnect" name="nomConnect" placeholder="Nom" type="text" maxlength="25" aria-label="nom" required>
                            </div>
                            <div class="row">
                                <input id="mdpConnect" name="mdpConnect" placeholder="Mot de passe" type="password" maxlength="50" aria-label="mdp" required>
                            </div>
                            <button id="submitSeConnecter" type="submit" aria-label="Se connecter">Se connecter</button>
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
                                <input id="nomCreer" name="nomCreer" placeholder="Entrer votre nom" type="text" minlength="4" maxlength="25" aria-label="nom" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreer" name="mdpCreer" placeholder="Entrer votre mot de passe" type="password" minlength="6" maxlength="50" aria-label="mdp" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreerValid" name="mdpCreerValid" placeholder="Retaper votre mot de passe" type="password" minlength="6" maxlength="50" aria-label="mdp" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Votre mot de passe est stocké en toute sécurité et vos notes chiffrées.
                            </div>
                            <button id="submitCreer" type="submit" aria-label="Créer mon compte">Créer mon compte</button>
                        </form>
                    </div>
                </div>
            </div>
        <?php } ?>
    </main>
    <script src="/projets/notes/assets/js/showdown.min.js" defer></script>
    <?php if (isset($nom) === true) { ?>
        <script src="/projets/notes/assets/js/scriptConnect.js" defer></script>
    <?php } else { ?>
        <script src="/projets/notes/assets/js/script.js" defer></script>
    <?php } ?>
</body>
</html>
