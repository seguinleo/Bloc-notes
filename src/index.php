<?php
session_set_cookie_params(array(
  'path' => './projets/notes/',
  'lifetime' => 460800,
  'secure' => true,
  'httponly' => true,
  'samesite' => 'Lax'
));
session_name('__Secure-PHPSESSID');
session_start();
$_SESSION['csrf_token_connect'] = bin2hex(random_bytes(32));
$_SESSION['csrf_token_creer'] = bin2hex(random_bytes(32));
?>
<!DOCTYPE html>
<html lang="fr-FR">
<head>
  <meta charset="utf-8">
  <title>Bloc-notes &#8211; Léo SEGUIN</title>
  <meta name="description" content="Enregistrez des notes sur votre appareil ou connectez-vous pour synchroniser et chiffrer vos notes.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#171717">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="#171717">
  <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
  <link rel="shortcut icon" href="assets/icons/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="../../assets/fontawesome/css/all.min.css">
  <link rel="manifest" href="manifest.json">
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
      <button id="iconButtonConnect" type="button" aria-label="Ajouter une note sur le cloud">Ajouter une note sur le cloud <i class="fa-solid fa-cloud"></i></button>
      <button id="iconButtonConnectFloat" type="button" aria-label="Ajouter une note sur le cloud">+</button>
    </div>
    <?php } else { ?>
    <div>
      <h1>Bloc-notes</h1>
      <span class="lang" tabindex="0">
        <img src="assets/icons/fr.svg" alt="flag" width="20" height="15">
      </span>
    </div>
    <div class="icon">
      <button id="iconButton" type="button" aria-label="Ajouter une note sur l'appareil">Ajouter une note sur l'appareil</button>
      <button id="iconButtonFloat" type="button" aria-label="Ajouter une note sur l'appareil">+</button>
    </div>
    <?php } ?>
    <div class="search-input">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" id="search-input" maxlength="30" aria-label="Rechercher une note" placeholder="Rechercher une note">
      <kbd>CTRL</kbd><kbd>K</kbd>
    </div>
    <div class="copyright">
      <a href="https://github.com/PouletEnSlip/Bloc-notes/" aria-label="GitHub" target="_blank" rel="noreferrer">v23.4.3</a>
      &copy;
      <a href="https://leoseguin.fr/" target="_blank" rel="noreferrer">Léo SEGUIN</a>
    </div>
  </nav>
  <main>
    <div class="darken"></div>
    <div id="copyNotification">Note copiée !</div>
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
              <input id="titleConnect" placeholder="Titre" type="text" maxlength="30" aria-label="titre">
            </div>
            <div class="row">
              <textarea id="descConnect" placeholder="Contenu" aria-label="contenu" maxlength="2000"></textarea>
            </div>
            <div class="row">
              <select id="couleurConnect" aria-label="couleur">
                <option value="Noir">Noir</option>
                <option value="Blanc">Blanc</option>
                <option value="Rouge">Rouge</option>
                <option value="Orange">Orange</option>
                <option value="Jaune">Jaune</option>
                <option value="Vert">Vert</option>
                <option value="Cyan">Cyan</option>
                <option value="Bleu">Bleu</option>
                <option value="Violet">Violet</option>
              </select>
            </div>
            Note masquée
            <div class="row">
              <label class="switch">
                <input type="checkbox" id="checkHidden" aria-label="Note masquée">
                <span class="slider round"></span>
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
          <span class="lang linkp" tabindex="0">
            <img src="assets/icons/fr.svg" alt="flag" width="20" height="15">
          </span>
          </div>
          <div class="row">
            <p>
              <span class="sedeconnecter linkp" tabindex="0">Se déconnecter</span>
            </p>
          </div>
          <div class="row">
            <p>
              <span class="linkp">
                <a href="https://leoseguin.fr/mentionslegales/" target="_blank" rel="noreferrer" aria-label="Mentions légales / confidentialité">Mentions légales / confidentialité</a>
              </span>
            </p>
          </div>
          <div class="row rowTri">
            <select id="tri" aria-label="tri">
              <option value="Titre" selected>Trier les notes par :</option>
              <option value="Titre">Titre</option>
              <option value="Date de création">Date de création</option>
              <option value="Date de modification">Date de modification</option>
            </select>
          </div>
          <form id="changeMDP" method="post" enctype="application/x-www-form-urlencoded">
            <div class="row">
              <input id="mdpModifNew" placeholder="Nouveau mot de passe" type="password" maxlength="50" aria-label="mdp">
            </div>
            <div class="row">
              <input id="mdpModifNewValid" placeholder="Retaper le nouveau mot de passe" type="password" maxlength="50" aria-label="mdp">
            </div>
            <button id="submitChangeMDP" type="submit" aria-label="Modifier le mot de passe">Modifier le mot de passe</button>
          </form>
          <div class="row">
            <p>
              <span class="supprimerCompte linkp" tabindex="0">Supprimer mon compte</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <?php } else { ?>
    <div class="info">
      <span class="seconnecter" tabindex="0">Connectez-vous</span> pour synchroniser vos notes entre tous vos appareils et les
      <div class="tooltip">chiffrer🔒
        <span class="tooltiptext">Chiffrement AES-256-GCM</span>
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
              <input id="title" placeholder="Titre" type="text" maxlength="30" aria-label="titre">
            </div>
            <div class="row">
              <textarea id="content" placeholder="Contenu" aria-label="contenu" maxlength="2000"></textarea>
            </div>
            <div class="row">
              <select id="couleur" aria-label="couleur">
                <option value="Noir">Noir</option>
                <option value="Blanc">Blanc</option>
                <option value="Rouge">Rouge</option>
                <option value="Orange">Orange</option>
                <option value="Jaune">Jaune</option>
                <option value="Vert">Vert</option>
                <option value="Cyan">Cyan</option>
                <option value="Bleu">Bleu</option>
                <option value="Violet">Violet</option>
              </select>
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
          <p>
            <span class="creercompte linkp" tabindex="0">Pas encore de compte ?</span>
          </p>
          <form id="connectForm" method="post" enctype="application/x-www-form-urlencoded">
            <input type="hidden" id="csrf_token_connect" value="<?php echo $_SESSION['csrf_token_connect']; ?>">
            <div class="row">
              <input id="nomConnect" placeholder="Nom" type="text" maxlength="25" aria-label="nom">
            </div>
            <div class="row">
              <input id="mdpConnect" placeholder="Mot de passe" type="password" maxlength="50" aria-label="mdp">
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
          <p>
            <span class="linkp">
              <a href="https://leoseguin.fr/mentionslegales/" target="_blank" rel="noreferrer" aria-label="Mentions légales / confidentialité">Mentions légales / confidentialité</a>
            </span>
          </p>
          <form id="creerForm" method="post" enctype="application/x-www-form-urlencoded">
            <input type="hidden" id="csrf_token_creer" value="<?php echo $_SESSION['csrf_token_creer']; ?>">
            <div class="row">
              <input id="nomCreer" placeholder="Entrer votre nom" type="text" minlength="4" maxlength="25" aria-label="nom">
            </div>
            <div class="row">
              <input id="mdpCreer" placeholder="Entrer votre mot de passe" type="password" minlength="6" maxlength="50" aria-label="mdp">
            </div>
            <div class="row">
              <input id="mdpCreerValid" placeholder="Retaper votre mot de passe" type="password" minlength="6" maxlength="50" aria-label="mdp">
            </div>
            <button id="submitCreer" type="submit" aria-label="Créer mon compte">Créer mon compte</button>
          </form>
        </div>
      </div>
    </div>
    <?php } ?>
  </main>
  <div class="svgPart">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
      <defs>
        <marker id="pointer" markerWidth="10" markerHeight="8" refX="7" refY="5" orient="-45">
          <polyline points="1 1, 8 5, 1 7"></polyline>
        </marker>
      </defs>
      <path d="M16,178 c87-46,162-185,227-136C307,90,195,158,111,108C71,85,92,30,126,7" marker-end="url(#pointer)"></path>
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
