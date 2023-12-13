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

if (isset($_SESSION['name']) === false) {
    $_SESSION['csrf_token_connect'] = bin2hex(random_bytes(32));
    $_SESSION['csrf_token_create'] = bin2hex(random_bytes(32));
    $csrf_token_connect = $_SESSION['csrf_token_connect'];
    $csrf_token_create = $_SESSION['csrf_token_create'];
    $name = null;
} else {
    $_SESSION['csrf_token_note'] = bin2hex(random_bytes(32));
    $_SESSION['csrf_token_psswd'] = bin2hex(random_bytes(32));
    $csrf_token_note = $_SESSION['csrf_token_note'];
    $csrf_token_psswd = $_SESSION['csrf_token_psswd'];
    $name = $_SESSION['name'];
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self'; font-src 'self' https://cdnjs.cloudflare.com/; form-action 'self'; img-src http:; manifest-src 'self'; script-src 'self'; script-src-attr 'none'; script-src-elem 'self'; style-src 'self' https://cdnjs.cloudflare.com/; style-src-attr 'none'; style-src-elem 'self' https://cdnjs.cloudflare.com/; worker-src 'self'">
    <link rel="apple-touch-icon" href="/seguinleo-notes/assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="/seguinleo-notes/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/seguinleo-notes/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="manifest" href="/seguinleo-notes/app.webmanifest">
</head>
<body>
    <nav>
        <noscript>
            <p class="noscript">Vous devez activer JavaScript pour utiliser Bloc-notes.</p>
        </noscript>
        <?php if (isset($name) === true) { ?>
            <div class="welcome">
                <h1>
                    <span class="manage-account linkp" tabindex="0" role="button" aria-label="Gestion du compte">
                        <i class="fa-solid fa-circle-user"></i>
                    </span>
                </h1>
            </div>
        <?php } else { ?>
            <div class="welcome">
                <h1>Bloc-notes</h1>
            </div>
            <div>
                <button type="button" class="log-in">Me connecter</button>
            </div>
        <?php } ?>
        <div class="search-input">
            <i class="fa-solid fa-bars" id="menuIcon" tabindex="0" aria-label="Menu" role="button"></i>
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Recherche" placeholder="Recherche">
            <kbd>CTRL</kbd><kbd>K</kbd>
            <?php if (isset($name) === true) { ?>
                <span class="manage-account linkp" aria-label="Compte" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } else { ?>
                <span class="log-in linkp" aria-label="Me connecter" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <?php if (isset($name) === true) { ?>
            <div id="last-sync">
                <i class="fa-solid fa-sync" aria-label="Synchroniser" tabindex="0" role="button"></i>
                <span></span>
            </div>
        <?php } ?>
        <div class="divTheme">
            <button type="button" id="btnTheme" aria-label="Thème">
                <i id="iconTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <?php if (isset($name) === true) { ?>
            <button id="iconButtonConnectFloat" class="iconConnectFloat" type="button" aria-label="Ajouter une note sur le cloud"><i class="fa-solid fa-plus"></i></button>
        <?php } else { ?>
            <button id="iconButtonFloat" class="iconFloat" type="button" aria-label="Ajouter une note sur l'appareil"><i class="fa-solid fa-plus"></i></button>
        <?php } ?>
        <div id="successNotification"></div>
        <div id="errorNotification"></div>
        <div id="copyNotification">Copié !</div>
        <div class="sideBar">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <?php if (isset($name) === true) { ?>
                <button id="iconButtonConnect" class="iconConnect" type="button">Ajouter une note dans le cloud</button>
            <?php } else { ?>
                <button id="iconButton" class="icon" type="button">Ajouter une note sur l'appareil</button>
            <?php } ?>
            <div class="listNotes"></div>
            <div class="copyright">
                <a href="https://leoseguin.fr/mentionslegales/" target="_blank" rel="noreferrer">Mentions légales / confidentialité</a>
                <div class="divLanguage">
                    <select id="language" aria-label="Langue">
                        <option value="fr" selected>🇫🇷</option>
                        <option value="en">🇬🇧</option>
                        <option value="de">🇩🇪</option>
                        <option value="es">🇪🇸</option>
                    </select>
                </div>
                <span class="license">GPL-3.0 &copy;<?= date('Y') ?></span>
            </div>
        </div>
        <button type="button" id="btnSort" aria-label="Trier les notes">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <button type="button" id="btnFilter" aria-label="Filtrer les notes">
            <i class="fa-solid fa-filter"></i>
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
                        <label for="sortNotes1">
                            <input type="radio" name="sortNotes" value="1" id="sortNotes1">
                            Date de création
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes2">
                            <input type="radio" name="sortNotes" value="2" id="sortNotes2">
                            Date de création (Z-A)
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes3">
                            <input type="radio" name="sortNotes" value="3" checked id="sortNotes3">
                            Date de modification
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes4">
                            <input type="radio" name="sortNotes" value="4" id="sortNotes4">
                            Date de modification (Z-A)
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="filter-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <h2>Filtrer les notes par catégorie :</h2>
                    </div>
                    <div class="row">
                        <label for="noCatFilter">
                            <input type="checkbox" name="filterNotes" value="0" checked id="noCatFilter">
                            ❌Aucune
                        </label>
                    </div>
                    <div class="row">
                        <label for="catPersoFilter">
                            <input type="checkbox" name="filterNotes" value="1" checked id="catPersoFilter">
                            👤Perso
                        </label>
                    </div>
                    <div class="row">
                        <label for="catProFilter">
                            <input type="checkbox" name="filterNotes" value="2" checked id="catProFilter">
                            💼Travail
                        </label>
                    </div>
                    <div class="row">
                        <label for="catVoyageFilter">
                            <input type="checkbox" name="filterNotes" value="3" checked id="catVoyageFilter">
                            🏖️Voyage
                        </label>
                    </div>
                    <div class="row">
                        <label for="catTaskFilter">
                            <input type="checkbox" name="filterNotes" value="4" checked id="catTaskFilter">
                            📓Tâches
                        </label>
                    </div>
                    <div class="row">
                        <label for="catRappelFilter">
                            <input type="checkbox" name="filterNotes" value="5" checked id="catRappelFilter">
                            🕰️Rappel
                        </label>
                    </div>
                    <div class="row">
                        <label for="catIdeesFilter">
                            <input type="checkbox" name="filterNotes" value="6" checked id="catIdeesFilter">
                            💡Idées
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
                        <input id="idNote" type="hidden">
                        <?php if (isset($name) === true) { ?>
                            <input id="checkLink" type="hidden">
                            <input type="hidden" id="csrf_token_note" value="<?= $csrf_token_note ?>">
                        <?php } ?>
                        <div class="row">
                            <input id="title" placeholder="Titre" type="text" maxlength="30" aria-label="titre" required>
                        </div>
                        <div class="row">
                            <textarea
                                id="content"
                                placeholder="Contenu (Texte brut ou Markdown)"
                                aria-label="Contenu (Texte brut ou Markdown)"
                                maxlength="5000"
                            ></textarea>
                            <span id="textareaLength">0/5000</span>
                        </div>
                        <div class="row">
                            <div class="colors">
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
                            <label class="category" for="noCat">
                                <input type="radio" name="category" id="noCat" value="0" checked>
                                <span tabindex="0" role="button">❌</span>
                            </label>
                            <label class="category" for="catPerso">
                                <input type="radio" name="category" id="catPerso" value="1">
                                <span tabindex="0" role="button">👤Perso</span>
                            </label>
                            <label class="category" for="catPro">
                                <input type="radio" name="category" id="catPro" value="2">
                                <span tabindex="0" role="button">💼Travail</span>
                            </label>
                            <label class="category" for="catVoyage">
                                <input type="radio" name="category" id="catVoyage" value="3">
                                <span tabindex="0" role="button">🏖️Voyage</span>
                            </label>
                            <label class="category" for="catTask">
                                <input type="radio" name="category" id="catTask" value="4">
                                <span tabindex="0" role="button">📓Tâches</span>
                            </label>
                            <label class="category" for="catRappel">
                                <input type="radio" name="category" id="catRappel" value="5">
                                <span tabindex="0" role="button">🕰️Rappel</span>
                            </label>
                            <label class="category" for="catIdees">
                                <input type="radio" name="category" id="catIdees" value="6">
                                <span tabindex="0" role="button">💡Idées</span>
                            </label>
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
        <?php if (isset($name) === true) { ?>
            <div class="manage-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <div class="row">
                            <span id="log-out" class="linkp" tabindex="0" role="button">Me déconnecter</span>
                        </div>
                        <div class="row">
                            <span id="export-all-notes" class=" linkp" tabindex="0">Exporter toutes mes notes</span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" target="_blank" rel="noreferrer">
                                    Guide Markdown
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/discussions" target="_blank" rel="noreferrer">
                                    Aide et discussions
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </span>
                        </div>
                        <div class="row">
                            <i class="fa-solid fa-fingerprint"></i>
                            <label for="checkFingerprint" class="switch" aria-label="Verouillage par empreinte">
                                <input type="checkbox" id="checkFingerprint" aria-hidden="true" tabindex="-1">
                                <span class="slider" tabindex="0"></span>
                            </label>
                        </div>
                        <details>
                            <summary>Gestion du compte <?= $name ?></summary>
                            <form id="changePsswd" method="post" enctype="application/x-www-form-urlencoded">
                                <input type="hidden" id="csrf_token_psswd" value="<?= $csrf_token_psswd ?>">
                                <div class="row">
                                    <input id="newPsswd" placeholder="Nouveau mot de passe" type="password" minlength="6" maxlength="50" aria-label="Nouveau mot de passe" required>
                                </div>
                                <div class="row">
                                    <input id="newPsswdValid" placeholder="Retaper le nouveau mot de passe" type="password" minlength="6" maxlength="50" aria-label="Retaper le nouveau mot de passe" required>
                                </div>
                                <button id="submitChangePsswd" type="submit">Modifier mon mot de passe</button>
                            </form>
                            <div class="row">
                                <span id="delete-account" class="linkp warning" tabindex="0">Supprimer mon compte</span>
                            </div>
                        </details>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/seguinleo/Bloc-notes/" target="_blank" rel="noreferrer">v23.12.3</a>
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
                        <form id="publicNote" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                Voulez-vous rendre votre note publique ? Cela générera un lien unique pour partager votre note.
                            </div>
                            <input id="idNotePublic" type="hidden">
                            <div class="row">
                                <button id="submitPublicNote" type="submit">Rendre la note publique</button>
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
                        <form id="privateNote" method="post" enctype="application/x-www-form-urlencoded">
                            <div class="row">
                                Voulez-vous de nouveau rendre votre note privée ? Le lien unique ne sera plus disponible.
                            </div>
                            <input id="idNotePrivate" type="hidden">
                            <input id="linkNotePrivate" type="hidden">
                            <div class="row">
                                <button id="submitPrivateNote" type="submit">Rendre la note privée</button>
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
                            <span id="create-account" class="linkp" tabindex="0" role="button">Créer mon compte</span>
                        </div>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nameConnect" placeholder="Nom" type="text" maxlength="25" aria-label="Nom" required>
                            </div>
                            <div class="row">
                                <input id="psswdConnect" placeholder="Mot de passe" type="password" maxlength="50" aria-label="Mot de passe" required>
                            </div>
                            <button id="submitLogIn" type="submit">Me connecter</button>
                        </form>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/seguinleo/Bloc-notes/" target="_blank" rel="noreferrer">v23.12.3</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="create-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <form id="createForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_create" value="<?= $csrf_token_create ?>">
                            <div class="row">
                                <input id="nameCreate" placeholder="Nom" type="text" minlength="4" maxlength="25" aria-label="Nom" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreate" placeholder="Mot de passe" type="password" minlength="6" maxlength="50" aria-label="Mot de passe" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreateValid" placeholder="Retaper mot de passe" type="password" minlength="6" maxlength="50" aria-label="Retaper mot de passe" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Votre mot de passe est stocké en toute sécurité et vos notes chiffrées.
                                <span class="warning">Il vous sera impossible de récupérer votre mot de passe si vous l'oubliez.</span>
                            </div>
                            <details id="genPsswd">
                                <summary>Générer un mot de passe fort</summary>
                                <div class="row">
                                    <input id="psswdGen" type="text" minlength="6" maxlength="50" aria-label="Mot de passe généré" disabled>
                                    <button id="submitGenPsswd" type="button" aria-label="Générer un mot de passe fort">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                            </details>
                            <button id="submitCreate" type="submit">Créer mon compte</button>
                        </form>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/seguinleo/Bloc-notes/" target="_blank" rel="noreferrer">v23.12.3</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        <?php } ?>
        <div id="newVersion">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>v23.12.3🎉</h2>
            <p>
                Bloc-notes à été mis à jour !
            </p>
            <p>
                <a href="https://github.com/seguinleo/Bloc-notes/blob/main/CHANGELOG.txt" target="_blank" rel="noreferrer">Liste des changements</a>
            </p>
        </div>
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
