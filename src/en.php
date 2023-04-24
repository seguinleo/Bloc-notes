<?php
session_set_cookie_params(array(
  'path' => '/projets/notes/',
  'lifetime' => 460800,
  'secure' => true,
  'httponly' => true,
  'samesite' => 'Lax'
));
session_name('__Secure-PHPSESSID');
session_start();
if (!isset($_SESSION["nom"])) {
  $_SESSION['csrf_token_connect'] = bin2hex(random_bytes(32));
  $_SESSION['csrf_token_creer'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Bloc-notes &#8211; Léo SEGUIN</title>
  <meta name="description" content="Save notes to your device or sign in to sync and encrypt your notes.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#171717">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="#171717">
  <link rel="apple-touch-icon" href="./assets/icons/apple-touch-icon.png">
  <link rel="shortcut icon" href="./assets/icons/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="./assets/css/style.css">
  <link rel="stylesheet" href="/assets/fontawesome/css/all.min.css">
  <link rel="manifest" href="./manifest.json">
</head>
<body>
  <nav>
    <?php if (isset($_SESSION["nom"])) { ?>
    <div>
      <h1 class="welcome">
        <span class="gestionCompte linkp" tabindex="0">
          <i class="fa-solid fa-circle-user"></i>
          <?php echo $_SESSION["nom"]; ?>
        </span>
        <span class="wave">👋🏼</span>
      </h1>
    </div>
    <div class="iconConnect">
      <button id="iconButtonConnect" type="button" aria-label="Add a cloud note">Add a cloud note <i class="fa-solid fa-cloud"></i></button>
      <button id="iconButtonConnectFloat" type="button" aria-label="Add a cloud note"><i class="fa-solid fa-plus"></i></button>
    </div>
    <?php } else { ?>
    <div>
      <h1>Bloc-notes</h1>
    </div>
    <div class="icon">
      <button id="iconButton" type="button" aria-label="Add a local note">Add a local note</button>
      <button id="iconButtonFloat" type="button" aria-label="Add a local note"><i class="fa-solid fa-plus"></i></button>
    </div>
    <?php } ?>
    <div class="search-input">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" id="search-input" maxlength="30" aria-label="Search for a note" placeholder="Search for a note">
      <kbd>CTRL</kbd><kbd>K</kbd>
    </div>
    <div class="copyright">
      <a href="https://github.com/PouletEnSlip/Bloc-notes/" aria-label="GitHub" target="_blank" rel="noreferrer">v23.4.4</a>
      &copy;
      <a href="/" target="_blank" rel="noreferrer">Léo SEGUIN</a>
    </div>
    <?php if (!isset($_SESSION["nom"])) { ?>
    <div class="lang">
      <a href="./" aria-label="lang">
        <img src="./assets/icons/gb.svg" alt="flag" width="20" height="15">
      </a>
    </div>
    <?php } ?>
  </nav>
  <main>
    <div class="darken"></div>
    <div id="copyNotification">Note copied!</div>
    <?php if (isset($_SESSION["nom"])) { ?>
    <div class="connect-popup-box">
      <div class="popup">
        <div class="content">
          <header>
            <i class="fa-solid fa-xmark" tabindex="0"></i>
          </header>
          <form id="addFormConnect" method="post" enctype="application/x-www-form-urlencoded">
            <input id="idNoteInput" type="hidden">
            <div class="row">
              <input id="titleConnect" placeholder="Title" type="text" maxlength="30" aria-label="title">
            </div>
            <div class="row">
              <textarea id="descConnect" placeholder="Content" aria-label="content" maxlength="2000"></textarea>
            </div>
            <div class="row">
              <div class="couleurs">
                <span class="Noir"></span>
                <span class="Blanc"></span>
                <span class="Rouge"></span>
                <span class="Orange"></span>
                <span class="Jaune"></span>
                <span class="Vert"></span>
                <span class="Cyan"></span>
                <span class="BleuCiel"></span>
                <span class="Bleu"></span>
                <span class="Violet"></span>
                <span class="Rose"></span>
              </div>
            </div>
            Hidden note
            <div class="row">
              <label class="switch">
                <input type="checkbox" id="checkHidden" aria-label="Hidden note">
                <span class="slider"></span>
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
            <span class="lang linkp">
              <a href="./" aria-label="lang">
                <img src="./assets/icons/gb.svg" alt="flag" width="20" height="15">
              </a>
            </span>
          </div>
          <div class="row">
            <p>
              <span class="sedeconnecter linkp" tabindex="0">Sign out</span>
            </p>
          </div>
          <div class="row">
            <p>
              <span class="linkp">
                <a href="/mentionslegales/" target="_blank" rel="noreferrer" aria-label="Legal Notice / Privacy">Legal Notice / Privacy</a>
              </span>
            </p>
          </div>
          <div class="row rowTri">
            <select id="tri" aria-label="tri">
              <option value="Titre" selected>Sort notes by:</option>
              <option value="Titre">Title</option>
              <option value="Date de création">Creation date</option>
              <option value="Date de modification">Modification date</option>
            </select>
          </div>
          <details>
            <summary>Change password</summary>
            <form id="changeMDP" method="post" enctype="application/x-www-form-urlencoded">
              <div class="row">
                <input id="mdpModifNew" placeholder="New password" type="password" maxlength="50" aria-label="password">
              </div>
              <div class="row">
                <input id="mdpModifNewValid" placeholder="Retype your new password" type="password" maxlength="50" aria-label="password">
              </div>
              <button id="submitChangeMDP" type="submit" aria-label="Change password">Change password</button>
            </form>
          </details>
          <div class="row">
            <p>
              <span class="supprimerCompte linkp" tabindex="0">Delete my account</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <?php } else { ?>
    <div class="info">
      <span class="seconnecter" tabindex="0">Sign in</span> to sync your notes and
      <div class="tooltip">encrypt🔒
        <span class="tooltiptext">AES-256-GCM encryption</span>
      </div>
    </div>
    <div class="popup-box">
      <div class="popup">
        <div class="content">
          <header>
            <i class="fa-solid fa-xmark" tabindex="0"></i>
          </header>
          <form id="addForm" method="post" enctype="application/x-www-form-urlencoded">
            <div class="row">
              <input id="title" placeholder="Title" type="text" maxlength="30" aria-label="title">
            </div>
            <div class="row">
              <textarea id="content" placeholder="Content" aria-label="content" maxlength="2000"></textarea>
            </div>
            <div class="row">
              <div class="couleurs">
                <span class="Noir"></span>
                <span class="Blanc"></span>
                <span class="Rouge"></span>
                <span class="Orange"></span>
                <span class="Jaune"></span>
                <span class="Vert"></span>
                <span class="Cyan"></span>
                <span class="BleuCiel"></span>
                <span class="Bleu"></span>
                <span class="Violet"></span>
                <span class="Rose"></span>
              </div>
            </div>
            Hidden note
            <div class="row">
              <label class="switch">
                <input type="checkbox" id="checkHidden" aria-label="Hidden note">
                <span class="slider"></span>
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
          <p>
            <span class="creercompte linkp" tabindex="0">No account yet?</span>
          </p>
          <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
            <input type="hidden" id="csrf_token_connect" value="<?php echo $_SESSION['csrf_token_connect']; ?>">
            <div class="row">
              <input id="nomConnect" placeholder="Username" type="text" maxlength="25" aria-label="username">
            </div>
            <div class="row">
              <input id="mdpConnect" placeholder="Password" type="password" maxlength="50" aria-label="password">
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
          <p>
            <span class="linkp">
              <a href="/mentionslegales/" target="_blank" rel="noreferrer" aria-label="Legal Notice / Privacy">Legal Notice / Privacy</a>
            </span>
          </p>
          <form id="creerForm" method="post" enctype="application/x-www-form-urlencoded">
            <input type="hidden" id="csrf_token_creer" value="<?php echo $_SESSION['csrf_token_creer']; ?>">
            <div class="row">
              <input id="nomCreer" placeholder="Username" type="text" minlength="4" maxlength="25" aria-label="username">
            </div>
            <div class="row">
              <input id="mdpCreer" placeholder="Password" type="password" minlength="6" maxlength="50" aria-label="password">
            </div>
            <div class="row">
              <input id="mdpCreerValid" placeholder="Retype your password" type="password" minlength="6" maxlength="50" aria-label="password">
            </div>
            <div class="row">
              <i class="fa-solid fa-circle-info"></i> Your password is stored securely.
            </div>
            <button id="submitCreer" type="submit" aria-label="Sign up">Sign up</button>
          </form>
        </div>
      </div>
    </div>
    <?php } ?>
  </main>
  <div class="svgPart" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <defs>
        <marker id="pointer" markerWidth="10" markerHeight="8" refX="7" refY="5" orient="-45">
          <polyline points="1 1, 8 5, 1 7"></polyline>
        </marker>
      </defs>
      <path d="M16,178 c87-46,162-185,227-136C307,90,195,158,111,108C71,85,92,30,126,7" marker-end="url(#pointer)" opacity=".4"></path>
    </svg>
  </div>
  <?php if (isset($_SESSION["nom"])) { ?>
  <script src="./assets/js/scriptConnect.min.js" defer></script>
  <?php } else { ?>
  <script src="./assets/js/script.min.js" defer></script>
  <?php } ?>
  <script src="./assets/js/showdown.min.js" defer></script>
</body>
</html>