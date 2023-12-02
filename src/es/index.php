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
<html class="dark" lang="es">
<head>
    <meta charset="utf-8">
    <title>Bloc-notes &#8211; Léo SEGUIN</title>
    <meta name="description" content="Guarde notas en su dispositivo o inicie sesión para sincronizar y cifrar sus notas.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#171717" class="themecolor">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#171717" class="themecolor">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'self'; font-src 'self' https://cdnjs.cloudflare.com/; form-action 'self'; img-src http:; manifest-src 'self'; script-src 'self'; script-src-attr 'none'; script-src-elem 'self'; style-src 'self' https://cdnjs.cloudflare.com/; style-src-attr 'none'; style-src-elem 'self' https://cdnjs.cloudflare.com/; worker-src 'self'">
    <link rel="apple-touch-icon" href="../assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="../favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="manifest" href="app.webmanifest">
</head>
<body>
    <nav>
        <noscript>
            <p class="noscript">Debe habilitar JavaScript para utilizar el Bloc de notas.</p>
        </noscript>
        <?php if (isset($nom) === true) { ?>
            <div class="welcome">
                <h1>
                    <span class="gestionCompte linkp" tabindex="0" role="button" aria-label="Administración de cuentas">
                        <i class="fa-solid fa-circle-user"></i>
                    </span>
                </h1>
            </div>
        <?php } else { ?>
            <div class="welcome">
                <h1>Bloc-notes</h1>
            </div>
            <div>
                <button type="button" class="seconnecter">Conectarse</button>
            </div>
        <?php } ?>
        <div class="search-input">
            <i class="fa-solid fa-bars" id="menuIcon" tabindex="0" aria-label="Menú" role="button"></i>
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Buscar" placeholder="Buscar">
            <kbd>CTRL</kbd><kbd>K</kbd>
            <?php if (isset($nom) === true) { ?>
                <span class="gestionCompte linkp" aria-label="Cuenta" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } else { ?>
                <span class="seconnecter linkp" aria-label="Conectarse" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <?php if (isset($nom) === true) { ?>
            <div class="lastSync">
                <i class="resync fa-solid fa-sync" aria-label="Sincronizar" tabindex="0" role="button"></i>
                <span></span>
            </div>
        <?php } ?>
        <div class="divTheme">
            <button type="button" id="btnTheme" aria-label="Tema">
                <i id="iconeTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <?php if (isset($nom) === true) { ?>
            <button id="iconButtonConnectFloat" class="iconConnectFloat" type="button" aria-label="Añade una nota en la nube"><i class="fa-solid fa-plus"></i></button>
        <?php } else { ?>
            <button id="iconButtonFloat" class="iconFloat" type="button" aria-label="Agregar una nota en el dispositivo"><i class="fa-solid fa-plus"></i></button>
        <?php } ?>
        <div id="errorNotification"></div>
        <div class="sideBar">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>Notizen</h2>
            <?php if (isset($nom) === true) { ?>
                <button id="iconButtonConnect" class="iconConnect" type="button">Añade una nota en la nube</button>
            <?php } else { ?>
                <button id="iconButton" class="icon" type="button">Agregar una nota en el dispositivo</button>
            <?php } ?>
            <div class="listNotes"></div>
            <div class="copyright">
                <a href="/mentionslegales/" target="_blank" rel="noreferrer">Avisos legales / confidencialidad</a>
                <div class="divLanguage">
                    <select id="language" aria-label="Idioma">
                        <option value="fr">🇫🇷</option>
                        <option value="en">🇬🇧</option>
                        <option value="de">🇩🇪</option>
                        <option value="es" selected>🇪🇸</option>
                    </select>
                </div>
                <span class="license">GPL-3.0 &copy;<?= date('Y') ?></span>
            </div>
        </div>
        <div id="copyNotification">¡Copiado!</div>
        <button type="button" id="btnSort" aria-label="ordenar notas">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <div class="sort-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <h2>Ordenar notas por:</h2>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="1">
                            Fecha de creación
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="2">
                            Fecha de creación (Z-A)
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="3" checked>
                            Fecha de modificación
                        </label>
                    </div>
                    <div class="row">
                        <label>
                            <input type="radio" name="sortNotes" value="4">
                            Fecha de modificación (Z-A)
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
                    <form id="addForm" method="post" enctype="application/x-www-form-urlencoded">
                        <input id="idNoteInput" type="hidden">
                        <?php if (isset($nom) === true) { ?>
                            <input id="checkLink" type="hidden">
                            <input type="hidden" id="csrf_token_note" value="<?= $csrf_token_note ?>">
                        <?php } ?>
                        <div class="row">
                            <input id="title" placeholder="Título" type="text" maxlength="30" aria-label="Título" required>
                        </div>
                        <div class="row">
                            <textarea
                                id="content"
                                placeholder="Contenido (texto sin formato o Markdown)"
                                aria-label="Contenido (texto sin formato o Markdown)"
                                maxlength="5000"
                            ></textarea>
                            <span id="textareaLength">0/5000</span>
                        </div>
                        <div class="row">
                            <div class="couleurs">
                                <span class="Noir" role="button" tabindex="0" aria-label="Por defecto"></span>
                                <span class="Rouge" role="button" tabindex="0" aria-label="Rojo"></span>
                                <span class="Orange" role="button" tabindex="0" aria-label="Naranja"></span>
                                <span class="Jaune" role="button" tabindex="0" aria-label="Amarillo"></span>
                                <span class="Vert" role="button" tabindex="0" aria-label="Verde"></span>
                                <span class="Cyan" role="button" tabindex="0" aria-label="Cian"></span>
                                <span class="BleuCiel" role="button" tabindex="0" aria-label="Cielo azul"></span>
                                <span class="Bleu" role="button" tabindex="0" aria-label="Azul"></span>
                                <span class="Violet" role="button" tabindex="0" aria-label="Púrpura"></span>
                                <span class="Rose" role="button" tabindex="0" aria-label="Rosa"></span>
                            </div>
                        </div>
                        <div class="row">
                            Nota oculta
                            <label for="checkHidden" class="switch" aria-label="Nota oculta">
                                <input type="checkbox" id="checkHidden" aria-hidden="true" tabindex="-1">
                                <span class="slider" tabindex="0"></span>
                            </label>
                        </div>
                        <button id="submitNote" type="submit">Guardar nota</button>
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
                            <span class="sedeconnecter linkp" tabindex="0" role="button">Desconectarse</span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" target="_blank" rel="noreferrer">
                                    Guía de rebajas
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </span>
                        </div>
                        <details>
                            <summary>Gestión de cuentas <?= $nom ?></summary>
                            <form id="changeMDP" method="post" enctype="application/x-www-form-urlencoded">
                                <input type="hidden" id="csrf_token_mdp" name="csrf_token_mdp" value="<?= $csrf_token_mdp ?>">
                                <div class="row">
                                    <input id="mdpModifNew" placeholder="Nueva contraseña" type="password" minlength="6" maxlength="50" aria-label="Nueva contraseña" required>
                                </div>
                                <div class="row">
                                    <input id="mdpModifNewValid" placeholder="Vuelva a escribir la nueva contraseña" type="password" minlength="6" maxlength="50" aria-label="Vuelva a escribir la nueva contraseña" required>
                                </div>
                                <button id="submitChangeMDP" type="submit">Cambiar mi contraseña</button>
                            </form>
                            <div class="row">
                                <span class="exportAll linkp" tabindex="0">Exportar todas mis notas</span>
                            </div>
                            <div class="row">
                                <span class="supprimerCompte attention" tabindex="0">Borrar mi cuenta</span>
                            </div>
                        </details>
                        <div class="row">
                            <p class="version">
                                <a href="https://github.com/seguinleo/Bloc-notes/" target="_blank" rel="noreferrer">v23.12.1</a>
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
                                ¿Quieres hacer pública tu calificación? Esto generará un enlace único para compartir su nota.
                            </div>
                            <input id="idNoteInputPublic" type="hidden">
                            <div class="row">
                                <button id="submitRendrePublique" type="submit">Hacer pública la nota</button>
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
                                ¿Quieres que tu nota vuelva a ser privada? El enlace único ya no estará disponible.
                            </div>
                            <input id="idNoteInputPrivate" type="hidden">
                            <input id="linkNoteInputPrivate" type="hidden">
                            <div class="row">
                                <button id="submitRendrePrivee" type="submit">Hacer la nota privada</button>
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
                            <span class="creercompte linkp" tabindex="0" role="button">Crear mi cuenta</span>
                        </div>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nomConnect" placeholder="Apellido" type="text" maxlength="25" aria-label="Apellido" required>
                            </div>
                            <div class="row">
                                <input id="mdpConnect" placeholder="Contraseña" type="password" maxlength="50" aria-label="Contraseña" required>
                            </div>
                            <button id="submitSeConnecter" type="submit">Conectarse</button>
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
                                <input id="nomCreer" placeholder="Apellido" type="text" minlength="4" maxlength="25" aria-label="Apellido" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreer" placeholder="Contraseña" type="password" minlength="6" maxlength="50" aria-label="Contraseña" required>
                            </div>
                            <div class="row">
                                <input id="mdpCreerValid" placeholder="Vuelva a escribir la contraseña" type="password" minlength="6" maxlength="50" aria-label="Vuelva a escribir la contraseña" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Su contraseña se almacena de forma segura y sus notas se cifran.
                                <span class="attention">No podrás recuperar tu contraseña si la olvidas.</span>
                            </div>
                            <details id="genMdp">
                                <summary>Genera una contraseña segura</summary>
                                <div class="row">
                                    <input id="mdpCreerGen" type="text" minlength="6" maxlength="50" aria-label="Contraseña generada" disabled>
                                    <button id="submitGenMdp" type="button" aria-label="Genera una contraseña segura">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                            </details>
                            <button id="submitCreer" type="submit">Crear mi cuenta</button>
                        </form>
                    </div>
                </div>
            </div>
        <?php } ?>
        <div id="newVersion">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <h2>v23.12.1🎉</h2>
            <p>
                ¡Bloc-notes ha sido actualizado!
            </p>
            <p>
                <a href="https://github.com/seguinleo/Bloc-notes/blob/main/CHANGELOG.txt" target="_blank" rel="noreferrer">Lista de cambios</a>
            </p>
        </div>
    </main>
    <script src="../assets/js/purify.min.js" defer></script>
    <script src="../assets/js/showdown.min.js" defer></script>
    <?php if (isset($nom) === true) { ?>
        <script src="scriptConnect.js" defer></script>
    <?php } else { ?>
        <script src="script.js" defer></script>
    <?php } ?>
</body>
</html>
