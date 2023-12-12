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
    <link rel="apple-touch-icon" href="/seguinleo-notes/assets/icons/apple-touch-icon.png">
    <link rel="shortcut icon" href="/seguinleo-notes/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/seguinleo-notes/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="manifest" href="/seguinleo-notes/es/app.webmanifest">
</head>
<body>
    <nav>
        <noscript>
            <p class="noscript">Debe habilitar JavaScript para utilizar el Bloc de notas.</p>
        </noscript>
        <?php if (isset($name) === true) { ?>
            <div class="welcome">
                <h1>
                    <span class="manage-account linkp" tabindex="0" role="button" aria-label="Administración de cuentas">
                        <i class="fa-solid fa-circle-user"></i>
                    </span>
                </h1>
            </div>
        <?php } else { ?>
            <div class="welcome">
                <h1>Bloc-notes</h1>
            </div>
            <div>
                <button type="button" class="log-in">Conectarse</button>
            </div>
        <?php } ?>
        <div class="search-input">
            <i class="fa-solid fa-bars" id="menuIcon" tabindex="0" aria-label="Menú" role="button"></i>
            <i class="fa-solid fa-magnifying-glass" role="none"></i>
            <input type="search" id="search-input" maxlength="30" aria-label="Buscar" placeholder="Buscar">
            <kbd>CTRL</kbd><kbd>K</kbd>
            <?php if (isset($name) === true) { ?>
                <span class="manage-account linkp" aria-label="Cuenta" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } else { ?>
                <span class="log-in linkp" aria-label="Conectarse" tabindex="0" role="button">
                    <i class="fa-solid fa-circle-user"></i>
                </span>
            <?php } ?>
        </div>
        <?php if (isset($name) === true) { ?>
            <div id="last-sync">
                <i class="fa-solid fa-sync" aria-label="Sincronizar" tabindex="0" role="button"></i>
                <span></span>
            </div>
        <?php } ?>
        <div class="divTheme">
            <button type="button" id="btnTheme" aria-label="Tema">
                <i id="iconTheme" class="fa-solid fa-moon"></i>
            </button>
        </div>
    </nav>
    <main>
        <?php if (isset($name) === true) { ?>
            <button id="iconButtonConnectFloat" class="iconConnectFloat" type="button" aria-label="Añade una nota en la nube"><i class="fa-solid fa-plus"></i></button>
        <?php } else { ?>
            <button id="iconButtonFloat" class="iconFloat" type="button" aria-label="Agregar una nota en el dispositivo"><i class="fa-solid fa-plus"></i></button>
        <?php } ?>
        <div id="successNotification"></div>
        <div id="errorNotification"></div>
        <div id="copyNotification">¡Copiado!</div>
        <div class="sideBar">
            <header>
                <i class="fa-solid fa-xmark" tabindex="0"></i>
            </header>
            <?php if (isset($name) === true) { ?>
                <button id="iconButtonConnect" class="iconConnect" type="button">Añade una nota en la nube</button>
            <?php } else { ?>
                <button id="iconButton" class="icon" type="button">Agregar una nota en el dispositivo</button>
            <?php } ?>
            <div class="listNotes"></div>
            <div class="copyright">
                <a href="https://leoseguin.fr/mentionslegales/" target="_blank" rel="noreferrer">Avisos legales / confidencialidad</a>
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
        <button type="button" id="btnSort" aria-label="Ordenar notas">
            <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <button type="button" id="btnFilter" aria-label="Filtrar notas">
            <i class="fa-solid fa-filter"></i>
        </button>
        <div class="filter-popup-box">
            <div class="popup">
                <div class="content">
                    <header>
                        <i class="fa-solid fa-xmark" tabindex="0"></i>
                    </header>
                    <div class="row">
                        <h2>Filtrar notas por categoría:</h2>
                    </div>
                    <div class="row">
                        <label for="noCatFilter">
                            <input type="checkbox" name="filterNotes" value="0" checked id="noCatFilter">
                            ❌Ninguna
                        </label>
                    </div>
                    <div class="row">
                        <label for="catPersoFilter">
                            <input type="checkbox" name="filterNotes" value="1" checked id="catPersoFilter">
                            👤Personal
                        </label>
                    </div>
                    <div class="row">
                        <label for="catProFilter">
                            <input type="checkbox" name="filterNotes" value="2" checked id="catProFilter">
                            💼Trabajo
                        </label>
                    </div>
                    <div class="row">
                        <label for="catVoyageFilter">
                            <input type="checkbox" name="filterNotes" value="3" checked id="catVoyageFilter">
                            🏖️Viaje
                        </label>
                    </div>
                    <div class="row">
                        <label for="catTaskFilter">
                            <input type="checkbox" name="filterNotes" value="4" checked id="catTaskFilter">
                            📓Tareas
                        </label>
                    </div>
                    <div class="row">
                        <label for="catRappelFilter">
                            <input type="checkbox" name="filterNotes" value="5" checked id="catRappelFilter">
                            🕰️Recordatorio
                        </label>
                    </div>
                    <div class="row">
                        <label for="catIdeesFilter">
                            <input type="checkbox" name="filterNotes" value="6" checked id="catIdeesFilter">
                            💡Ideas
                        </label>
                    </div>
                </div>
            </div>
        </div>
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
                        <label for="sortNotes1">
                            <input type="radio" name="sortNotes" value="1" id="sortNotes1">
                            Fecha de creación
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes2">
                            <input type="radio" name="sortNotes" value="2" id="sortNotes2">
                            Fecha de creación (Z-A)
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes3">
                            <input type="radio" name="sortNotes" value="3" checked id="sortNotes3">
                            Fecha de modificación
                        </label>
                    </div>
                    <div class="row">
                        <label for="sortNotes4">
                            <input type="radio" name="sortNotes" value="4" id="sortNotes4">
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
                        <input id="idNote" type="hidden">
                        <?php if (isset($name) === true) { ?>
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
                            <div class="colors">
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
                            <label class="category" for="noCat">
                                <input type="radio" name="category" id="noCat" value="0" checked>
                                <span tabindex="0" role="button">❌</span>
                            </label>
                            <label class="category" for="catPerso">
                                <input type="radio" name="category" id="catPerso" value="1">
                                <span tabindex="0" role="button">👤Personal</span>
                            </label>
                            <label class="category" for="catPro">
                                <input type="radio" name="category" id="catPro" value="2">
                                <span tabindex="0" role="button">💼Trabajo</span>
                            </label>
                            <label class="category" for="catVoyage">
                                <input type="radio" name="category" id="catVoyage" value="3">
                                <span tabindex="0" role="button">🏖️Viaje</span>
                            </label>
                            <label class="category" for="catTask">
                                <input type="radio" name="category" id="catTask" value="4">
                                <span tabindex="0" role="button">📓Tareas</span>
                            </label>
                            <label class="category" for="catRappel">
                                <input type="radio" name="category" id="catRappel" value="5">
                                <span tabindex="0" role="button">🕰️Recordatorio</span>
                            </label>
                            <label class="category" for="catIdees">
                                <input type="radio" name="category" id="catIdees" value="6">
                                <span tabindex="0" role="button">💡Ideas</span>
                            </label>
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
        <?php if (isset($name) === true) { ?>
            <div class="manage-popup-box">
                <div class="popup">
                    <div class="content">
                        <header>
                            <i class="fa-solid fa-xmark" tabindex="0"></i>
                        </header>
                        <div class="row">
                            <span id="log-out" class="linkp" tabindex="0" role="button">Desconectarse</span>
                        </div>
                        <div class="row">
                            <span id="export-all-notes" class="linkp" tabindex="0">Exportar todas mis notas</span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" target="_blank" rel="noreferrer">
                                    Guía Markdown
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </span>
                        </div>
                        <div class="row">
                            <span class="linkp">
                                <a href="https://github.com/seguinleo/Bloc-notes/discussions" target="_blank" rel="noreferrer">
                                    Ayuda y discusiones
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            </span>
                        </div>
                        <div class="row">
                            <i class="fa-solid fa-fingerprint"></i>
                            <label for="checkFingerprint" class="switch" aria-label="Bloqueo de huellas dactilares">
                                <input type="checkbox" id="checkFingerprint" aria-hidden="true" tabindex="-1">
                                <span class="slider" tabindex="0"></span>
                            </label>
                        </div>
                        <details>
                            <summary>Gestión de cuentas <?= $name ?></summary>
                            <form id="changePsswd" method="post" enctype="application/x-www-form-urlencoded">
                                <input type="hidden" id="csrf_token_psswd" name="csrf_token_psswd" value="<?= $csrf_token_psswd ?>">
                                <div class="row">
                                    <input id="newPsswd" placeholder="Nueva contraseña" type="password" minlength="6" maxlength="50" aria-label="Nueva contraseña" required>
                                </div>
                                <div class="row">
                                    <input id="newPsswdValid" placeholder="Vuelva a escribir la nueva contraseña" type="password" minlength="6" maxlength="50" aria-label="Vuelva a escribir la nueva contraseña" required>
                                </div>
                                <button id="submitChangePsswd" type="submit">Cambiar mi contraseña</button>
                            </form>
                            <div class="row">
                                <span id="delete-account" class="linkp warning" tabindex="0">Borrar mi cuenta</span>
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
                                ¿Quieres hacer pública tu calificación? Esto generará un enlace único para compartir su nota.
                            </div>
                            <input id="idNotePublic" type="hidden">
                            <div class="row">
                                <button id="submitPublicNote" type="submit">Hacer pública la nota</button>
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
                                ¿Quieres que tu nota vuelva a ser privada? El enlace único ya no estará disponible.
                            </div>
                            <input id="idNotePrivate" type="hidden">
                            <input id="linkNotePrivate" type="hidden">
                            <div class="row">
                                <button id="submitPrivateNote" type="submit">Hacer la nota privada</button>
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
                            <span id="create-account" class="linkp" tabindex="0" role="button">Crear mi cuenta</span>
                        </div>
                        <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
                            <input type="hidden" id="csrf_token_connect" value="<?= $csrf_token_connect ?>">
                            <div class="row">
                                <input id="nameConnect" placeholder="Apellido" type="text" maxlength="25" aria-label="Apellido" required>
                            </div>
                            <div class="row">
                                <input id="psswdConnect" placeholder="Contraseña" type="password" maxlength="50" aria-label="Contraseña" required>
                            </div>
                            <button id="submitLogIn" type="submit">Conectarse</button>
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
                            <input type="hidden" id="csrf_token_create" name="csrf_token_create" value="<?= $csrf_token_create ?>">
                            <div class="row">
                                <input id="nameCreate" placeholder="Apellido" type="text" minlength="4" maxlength="25" aria-label="Apellido" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreate" placeholder="Contraseña" type="password" minlength="6" maxlength="50" aria-label="Contraseña" required>
                            </div>
                            <div class="row">
                                <input id="psswdCreateValid" placeholder="Vuelva a escribir la contraseña" type="password" minlength="6" maxlength="50" aria-label="Vuelva a escribir la contraseña" required>
                            </div>
                            <div class="row">
                                <i class="fa-solid fa-circle-info" role="none"></i>
                                Su contraseña se almacena de forma segura y sus notas se cifran.
                                <span class="warning">No podrás recuperar tu contraseña si la olvidas.</span>
                            </div>
                            <details id="genPsswd">
                                <summary>Genera una contraseña segura</summary>
                                <div class="row">
                                    <input id="psswdGen" type="text" minlength="6" maxlength="50" aria-label="Contraseña generada" disabled>
                                    <button id="submitGenPsswd" type="button" aria-label="Genera una contraseña segura">
                                        <i class="fa-solid fa-arrow-rotate-right"></i>
                                    </button>
                                </div>
                            </details>
                            <button id="submitCreate" type="submit">Crear mi cuenta</button>
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
                ¡Bloc-notes ha sido actualizado!
            </p>
            <p>
                <a href="https://github.com/seguinleo/Bloc-notes/blob/main/CHANGELOG.txt" target="_blank" rel="noreferrer">Lista de cambios</a>
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
