let touchstartX = 0;
let touchendX = 0;
let timeoutNotification = null;
let theme = localStorage.getItem('theme') || 'dark';
const sidebar = document.querySelector('#sidebar');
const metaTheme = document.querySelectorAll('.theme-color');
const buttonTheme = document.querySelector('#icon-theme');
const themes = {
  carrot: { className: 'carrot', color: '#331500', icon: 'fa-carrot' },
  dark: { className: 'dark', color: '#121212', icon: 'fa-moon' },
  dusk: { className: 'dusk', color: '#1c1936', icon: 'fa-star' },
  leaf: { className: 'leaf', color: '#001b1e', icon: 'fa-leaf' },
  light: { className: 'light', color: '#f3f3f3', icon: 'fa-lightbulb' },
};
export let isLocked = true;
export const maxNoteContent = 20000;
export const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
export const forms = document.querySelectorAll('form');
export const lang = localStorage.getItem('lang');

export function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

export function getPassword(length) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialChars = '&~"#\'(-_)=^$€*!?,.;:/|\\@%+{}[]<>`';
  const allChars = lowercase + uppercase + digits + specialChars;
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i += 1) {
    const randomIndex = parseInt(array[i] % allChars.length, 10);
    password += allChars[randomIndex];
  }
  document.querySelector('#psswd-gen').textContent = password;
}

export function showSuccess(message) {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelector('#success-notification');
  notification.textContent = message;
  notification.classList.remove('d-none');
  timeoutNotification = setTimeout(() => {
    notification.classList.add('d-none');
  }, 5000);
}

export function showError(message) {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelectorAll('.error-notification');
  notification.forEach((e) => {
    e.textContent = message;
    e.classList.remove('d-none');
    timeoutNotification = setTimeout(() => {
      e.classList.add('d-none');
    }, 5000);
  });
}

export function downloadNote(noteId) {
  if (!noteId) return;
  document.querySelector('#id-note-download').value = noteId;
  document.querySelectorAll('input[name="download-notes"]').forEach((e) => {
    e.checked = false;
  });
  document.querySelector('#download-popup-box').showModal();
}

export function copy(content) {
  navigator.clipboard.writeText(content);
}

export function toggleFullscreen (noteId) {
  if (!noteId) return;
  const note = document.querySelector(`.note[data-note-id="${noteId}"]`);
  note.classList.toggle('fullscreen');
  if (!note.querySelector('.bottom-content .expand-note')) return;
  note.querySelector('.bottom-content .expand-note').classList.toggle('fa-expand');
  note.querySelector('.bottom-content .expand-note').classList.toggle('fa-compress');
}

export function searchSidebar() {
  sidebar.querySelectorAll('#list-notes p').forEach((e) => {
    e.addEventListener('click', () => {
      const titleList = e.querySelector('.title-list').textContent;
      document.querySelectorAll('.note').forEach((note) => {
        const title = note.querySelector('.title').textContent;
        if (title === titleList) note.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      });
    });
    e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') e.click();
    });
  });
}

export const getLockApp = async () => {
  try {
    const data = new URLSearchParams({ csrf_token: csrfToken });
    const res = await fetch('./assets/php/getLockApp.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      showError(`An error occurred - ${res.status}`);
      return;
    }
    const serverLocked = await res.json();
    if (!serverLocked.lockApp) {
      isLocked = false;
      document.querySelectorAll('#sidebar button').forEach((e) => e.classList.remove('d-none'));
      document.querySelectorAll('.btn-add-note').forEach((e) => e.classList.remove('d-none'));
      document.querySelector('#lock-app-slider').classList.remove('d-none');
      document.querySelector('#check-lock-app').checked = false;
    }
  } catch (error) {
    showError(`An error occurred - ${error}`);
  }
}

export const verifyFingerprint = async () => {
  try {
    const challenge = generateRandomBytes(16);
    const userId = generateRandomBytes(8);
    await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Bloc-notes',
        },
        user: {
          id: userId,
          name: 'Bloc-notes',
          displayName: 'Bloc-notes',
        },
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7,
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    });
    isLocked = false;
    document.querySelector('#btn-unlock-float').classList.add('d-none');
    document.querySelectorAll('#sidebar button').forEach((e) => e.classList.remove('d-none'));
    document.querySelectorAll('.btn-add-note').forEach((e) => e.classList.remove('d-none'));
    document.querySelector('#lock-app-slider').classList.remove('d-none');
  } catch (error) {
    showError(`An error occurred - ${error}`);
    document.querySelector('#check-lock-app').checked = !document.querySelector('#check-lock-app').checked;
  }
};

export function openSidebar() {
  if (isLocked) return;
  sidebar.classList.add('show');
}

export function closeSidebar() {
  sidebar.classList.remove('show');
}

export function handleGesture() {
  if (touchendX - touchstartX > 75 && !sidebar.classList.contains('show')) openSidebar();
  else if (touchendX - touchstartX < -75 && sidebar.classList.contains('show')) closeSidebar();
}

export function loadTheme() {
  const currentTheme = themes[theme];
  document.querySelector('html').className = currentTheme.className;
  metaTheme.forEach((e) => {
    e.content = currentTheme.color;
  });
  buttonTheme.className = `fa-solid ${currentTheme.icon}`;
}

if (localStorage.getItem('hide-sidebar') === 'true') {
  document.querySelector('#check-hide-sidebar').checked = true;
  document.querySelector('#sidebar-indicator').classList.add('d-none');
}

if (localStorage.getItem('spellcheck') === 'false') {
  document.querySelector('#spellcheck').checked = false;
  document.querySelector('#content').setAttribute('spellcheck', 'false');
}

const accentColor = localStorage.getItem('accent_color');
const accentColors = [
  'accent1',
  'accent2',
  'accent3',
  'accent4',
  'accent5',
  'accent6',
  'accent7',
  'accent8',
];

switch (accentColor) {
  case '1':
  case '2':
  case '3':
  case '4':
  case '5':
  case '6':
  case '7':
  case '8':
    document.body.classList = accentColors[accentColor - 1];
    document.querySelector(`#accent-colors .accent${accentColor}-span`).classList.add('selected');
    break;
  default:
    localStorage.setItem('accent_color', '1');
    document.body.classList = 'accent1';
    document.querySelector('#accent-colors .accent1-span').classList.add('selected');
}

const sortNotes = localStorage.getItem('sort_notes');
if (!['1', '2', '3', '4'].includes(sortNotes)) localStorage.setItem('sort_notes', '1');
if (!['fr', 'de', 'es', 'en'].includes(lang)) localStorage.setItem('lang', 'en');

document.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#language').addEventListener('change', async (e) => {
  const lang = e.target.value;
  switch (lang) {
    case 'fr':
      localStorage.setItem('lang', 'fr');
      break;
    case 'de':
      localStorage.setItem('lang', 'de');
      break;
    case 'es':
      localStorage.setItem('lang', 'es');
      break;
    default:
      localStorage.setItem('lang', 'en');
  }
  window.location.reload();
});

document.querySelector('#control-clear').addEventListener('click', () => {
  document.querySelector('#note-popup-box #content').value = '';
  document.querySelector('#textarea-length').textContent = `0/${maxNoteContent}`;
});

document.querySelector('#check-spellcheck').addEventListener('change', (e) => {
  if (e.target.checked) {
    localStorage.removeItem('spellcheck');
    document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'true');
  } else {
    localStorage.setItem('spellcheck', 'false');
    document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'false');
  }
});

document.querySelector('#note-popup-box #content').addEventListener('input', (e) => {
  const length = e.target.value.length;
  document.querySelector('#textarea-length').textContent = `${length}/${maxNoteContent}`;
});

document.querySelector('#btn-settings').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#settings-popup-box').showModal();
});

document.querySelector('#copy-password-btn').addEventListener('click', () => {
  const psswd = document.querySelector('#psswd-gen').textContent;
  navigator.clipboard.writeText(psswd);
});

document.querySelector('#sidebar-indicator').addEventListener('click', () => {
  openSidebar();
});

document.querySelector('#check-hide-sidebar').addEventListener('change', (e) => {
  if (e.target.checked) {
    localStorage.setItem('hide-sidebar', 'true');
    document.querySelector('#sidebar-indicator').classList.add('d-none');
  } else {
    localStorage.removeItem('hide-sidebar');
    document.querySelector('#sidebar-indicator').classList.remove('d-none');
  }
});

document.querySelector('#btn-sort').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#sort-popup-box').showModal();
});

document.querySelector('#btn-add-folder').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#folder-popup-box').showModal();
});

document.querySelector('#btn-add-category').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#category-popup-box').showModal();
});

document.querySelector('#btn-filter').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#filter-popup-box').showModal();
});

document.querySelector('#folder-popup-box button').addEventListener('click', () => {
  const folderName = document.querySelector('#name-folder').value.trim();
  const select = document.querySelector('#folders');
  if (!folderName || folderName.length > 18) return;
  if (Array.from(select.options).some((option) => option.value === folderName)) return;
  const option = document.createElement('option');
  option.value = folderName;
  option.textContent = folderName;
  select.appendChild(option);
  select.value = folderName;
  document.querySelector('#folder-popup-box').close();
});

document.querySelector('#category-popup-box button').addEventListener('click', () => {
  const categoryName = document.querySelector('#name-category').value.trim();
  const select = document.querySelector('#categories');
  if (!categoryName || categoryName.length > 18) return;
  if (Array.from(select.options).some((option) => option.value === categoryName)) return;
  const option = document.createElement('option');
  option.value = categoryName;
  option.textContent = categoryName;
  select.appendChild(option);
  select.value = categoryName;
  document.querySelector('#category-popup-box').close();
});

document.querySelectorAll('#colors span').forEach((span, index) => {
  span.addEventListener('click', (event) => {
    document.querySelectorAll('#colors span').forEach((e) => e.classList.remove('selected'));
    event.target.classList.add('selected');
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
  if (index === 0) span.classList.add('selected');
});

document.querySelectorAll('#accent-colors span').forEach((span) => {
  span.addEventListener('click', (event) => {
    document.querySelectorAll('#accent-colors span').forEach((e) => e.classList.remove('selected'));
    event.target.classList.add('selected');
    const selectedAccent = span.classList[0].replace('-span', '');
    document.body.classList = selectedAccent;
    localStorage.setItem('accent_color', accentColors.indexOf(selectedAccent) + 1 || '1');
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
});

document.querySelectorAll('.fa-xmark').forEach((e) => {
  e.addEventListener('click', () => {
    e.closest('dialog').close();
  });
});

document.querySelectorAll('dialog').forEach((dialog) => {
  if (dialog.id === 'folder-popup-box') return;
  if (dialog.id === 'category-popup-box') return;
  dialog.addEventListener('close', () => {
    forms.forEach((form) => form.reset());
    document.querySelectorAll('input[type="hidden"]').forEach((input) => input.value = '');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

document.querySelector('#submit-gen-psswd').addEventListener('click', () => getPassword(20));
forms.forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()));

document.querySelector('#search-input').addEventListener('input', (e) => {
  const searchValue = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.note').forEach((note) => {
    const title = note.querySelector('.title').textContent.toLowerCase();
    const content = note.querySelector('.details-content').textContent.toLowerCase();
    if (title.includes(searchValue) || content.includes(searchValue)) note.classList.remove('d-none');
    else note.classList.add('d-none');
  });
});

document.querySelector('#btn-download-all').addEventListener('click', () => {
  document.querySelectorAll('input[name="download-notes"]').forEach((e) => {
    e.checked = false;
  });
  document.querySelector('#download-popup-box').showModal();
});

document.querySelectorAll('input[name="download-notes"]').forEach((e) => {
  e.addEventListener('change', (event) => {
    const allNotes = document.querySelectorAll('.note');
    if (allNotes.length === 0) return;
    const a = document.createElement('a');
    let blob, url, filename;
    if (event.target.value === '3') {
      let allNotesHTML = [];
      if (document.querySelector('#id-note-download').value === '') {
        allNotesHTML = Array.from(allNotes).map((note) => {
          const title = note.querySelector('.title').textContent;
          const content = note.querySelector('.details-content').innerHTML;
          return `<h2>${title}</h2>${content}`;
        });
        filename = 'all-notes.html';
      } else {
        const note = document.querySelector(`.note[data-note-id="${document.querySelector('#id-note-download').value}"]`);
        const title = note.querySelector('.title').textContent;
        const content = note.querySelector('.details-content').innerHTML;
        allNotesHTML = [`<h2>${title}</h2>${content}`];
        filename = `${title}.html`;
      }
      blob = new Blob([allNotesHTML.join('')], { type: 'text/html;charset=utf-8' });
    } else {
      let allNotesContent = [];
      if (document.querySelector('#id-note-download').value === '') {
        allNotesContent = Array.from(allNotes).map((note) => {
          const title = note.getAttribute('data-note-title');
          const content = note.getAttribute('data-note-content');
          return `# ${title}\n${content}`;
        });
        filename = event.target.value === '1' ? 'all-notes.txt' : 'all-notes.md';
      } else {
        const note = document.querySelector(`.note[data-note-id="${document.querySelector('#id-note-download').value}"]`);
        const title = note.getAttribute('data-note-title');
        const content = note.getAttribute('data-note-content');
        allNotesContent = [`# ${title}\n${content}`];
        filename = event.target.value === '1' ? `${title}.txt` : `${title}.md`;
      }
      blob = new Blob([allNotesContent.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    }
    url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.querySelector('#download-popup-box').close();
  });
});

document.querySelectorAll('.link').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelectorAll('.custom-check').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#check-lock-app').addEventListener('change', async (e) => {
  if (isLocked) return;
  if (e.target.checked) await verifyFingerprint();
  try {
    const data = new URLSearchParams({ csrf_token: csrfToken, lock_app: e.target.checked });
    const res = await fetch('./assets/php/lockApp.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) showError(`An error occurred - ${res.status}`);
  } catch (error) {
    showError(`An error occurred - ${error}`);
  }
});

document.querySelector('#btn-theme').addEventListener('click', () => {
  const currentThemeIndex = Object.keys(themes).indexOf(theme);
  const nextTheme = Object.keys(themes)[(currentThemeIndex + 1) % Object.keys(themes).length];
  const nextThemeData = themes[nextTheme];
  document.querySelector('html').className = nextThemeData.className;
  theme = nextTheme;
  metaTheme.forEach((e) => {
    e.content = nextThemeData.color;
  });
  buttonTheme.className = `fa-solid ${nextThemeData.icon}`;
  localStorage.setItem('theme', nextTheme);
});

const today = new Date();
if (today.getMonth() === 11) document.querySelector('.christmas').classList.remove('d-none');

export function changeLanguage(language, cloud) {
  if (language === 'fr') {
    document.documentElement.setAttribute('lang', 'fr-FR');
    document.querySelector('#language').value = 'fr';
    document.querySelector('#legal a').textContent = 'Mentions légales / confidentialité';
    document.querySelector('#sort-popup-box legend').textContent = 'Trier les notes';
    document.querySelector('#sort-notes1-span').textContent = 'Date de modification';
    document.querySelector('#sort-notes2-span').textContent = 'Date de modification (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Titre';
    document.querySelector('#sort-notes4-span').textContent = 'Titre (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrer les notes par catégorie';
    document.querySelector('#download-popup-box legend').textContent = 'Type d\'export';
    document.querySelector('#spellcheck-slider span').textContent = 'Vérif. ortho.';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Masquer bouton sidebar';
    document.querySelector('#lock-app-slider span').textContent = 'Vérouiller app';
    document.querySelector('#hide-infos').textContent = 'Masquer le contenu';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titre');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenu (Texte brut, Markdown ou HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Choisir un dossier';
    document.querySelector('#note-popup-box #categories option[value=""]').textContent = 'Choisir une catégorie';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Enregistrer';
    document.querySelector('#folder-popup-box button').textContent = 'Créer';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Nom du dossier');
    document.querySelector('#category-popup-box button').textContent = 'Créer';
    document.querySelector('#category-popup-box input').setAttribute('placeholder', 'Nom de la catégorie');
    document.querySelector('#link-markdown').textContent = 'Guide Markdown';
    document.querySelector('#link-help').textContent = 'Aide et discussions';
    
    if (cloud) {
      document.querySelector('#log-out').textContent = 'Déconnexion';
      document.querySelector('#old-psswd').setAttribute('placeholder', 'Ancien mot de passe');
      document.querySelector('#new-psswd').setAttribute('placeholder', 'Nouveau mot de passe');
      document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirmer le mot de passe');
      document.querySelector('#change-psswd button[type="submit"]').textContent = 'Changer le mot de passe';
      document.querySelector('#gen-psswd summary').textContent = 'Changer le mot de passe';
      document.querySelector('#delete-user summary').textContent = 'Supprimer le compte';
      document.querySelector('#delete-psswd').setAttribute('placeholder', 'Mot de passe');
      document.querySelector('#delete-user button').textContent = 'Supprimer le compte';
      document.querySelector('#private-note span').textContent = 'Voulez-vous rendre votre note privée ? Le lien ne sera plus disponible.';
      document.querySelector('#private-note button').textContent = 'Rendre privée';
      document.querySelector('#public-note span').textContent = 'Voulez-vous rendre votre note publique ? Un lien sera disponible pour la partager.';
      document.querySelector('#public-note button').textContent = 'Rendre publique';
    } else {
      document.querySelector('#create-account').textContent = 'Pas encore de compte ?';
      document.querySelector('#name-connect').setAttribute('placeholder', 'Nom');
      document.querySelector('#psswd-connect').setAttribute('placeholder', 'Mot de passe');
      document.querySelector('#connect-form').querySelector('button').textContent = 'Se connecter';
      document.querySelector('#name-create').setAttribute('placeholder', 'Nom');
      document.querySelector('#psswd-create').setAttribute('placeholder', 'Mot de passe');
      document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirmer le mot de passe');
      document.querySelector('#create-infos').textContent = 'Votre mot de passe est stocké en toute sécurité et vos notes chiffrées. Il vous sera impossible de récupérer votre mot de passe si vous l\'oubliez.';
      document.querySelector('#create-form button[type="submit"]').textContent = 'Créer mon compte';
    }
  } else if (language === 'de') {
    document.documentElement.setAttribute('lang', 'de');
    document.querySelector('#language').value = 'de';
    document.querySelector('#legal a').textContent = 'Impressum / Datenschutz';
    document.querySelector('#sort-popup-box legend').textContent = 'Notizen sortieren';
    document.querySelector('#sort-notes1-span').textContent = 'Änderungsdatum';
    document.querySelector('#sort-notes2-span').textContent = 'Änderungsdatum (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Titel';
    document.querySelector('#sort-notes4-span').textContent = 'Titel (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Notizen filtern nach Kategorie';
    document.querySelector('#download-popup-box legend').textContent = 'Exporttyp';
    document.querySelector('#spellcheck-slider span').textContent = 'Rechtschreibprüfung';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Seitenleiste ausblenden';
    document.querySelector('#lock-app-slider span').textContent = 'App sperren';
    document.querySelector('#hide-infos').textContent = 'Inhalt ausblenden';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titel');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Inhalt (Rohtext, Markdown oder HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Ordner auswählen';
    document.querySelector('#note-popup-box #categories option[value=""]').textContent = 'Kategorie auswählen';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Speichern';
    document.querySelector('#folder-popup-box button').textContent = 'Erstellen';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Ordnername');
    document.querySelector('#category-popup-box button').textContent = 'Erstellen';
    document.querySelector('#category-popup-box input').setAttribute('placeholder', 'Kategoriename');
    document.querySelector('#link-markdown').textContent = 'Markdown-Anleitung';
    document.querySelector('#link-help').textContent = 'Hilfe und Diskussionen';
    
    if (cloud) {
      document.querySelector('#log-out').textContent = 'Abmelden';
      document.querySelector('#old-psswd').setAttribute('placeholder', 'Altes Passwort');
      document.querySelector('#new-psswd').setAttribute('placeholder', 'Neues Passwort');
      document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Passwort bestätigen');
      document.querySelector('#change-psswd button[type="submit"]').textContent = 'Passwort ändern';
      document.querySelector('#gen-psswd summary').textContent = 'Passwort ändern';
      document.querySelector('#delete-user summary').textContent = 'Konto löschen';
      document.querySelector('#delete-psswd').setAttribute('placeholder', 'Passwort');
      document.querySelector('#delete-user button').textContent = 'Konto löschen';
      document.querySelector('#private-note span').textContent = 'Möchten Sie Ihre Notiz privat machen? Der Link ist nicht mehr verfügbar.';
      document.querySelector('#private-note button').textContent = 'Privat machen';
      document.querySelector('#public-note span').textContent = 'Möchten Sie Ihre Notiz öffentlich machen? Ein Link wird verfügbar sein, um sie zu teilen.';
      document.querySelector('#public-note button').textContent = 'Öffentlich machen';
    } else {
      document.querySelector('#create-account').textContent = 'Noch kein Konto?';
      document.querySelector('#name-connect').setAttribute('placeholder', 'Name');
      document.querySelector('#psswd-connect').setAttribute('placeholder', 'Passwort');
      document.querySelector('#connect-form').querySelector('button').textContent = 'Anmelden';
      document.querySelector('#name-create').setAttribute('placeholder', 'Name');
      document.querySelector('#psswd-create').setAttribute('placeholder', 'Passwort');
      document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Passwort bestätigen');
      document.querySelector('#create-infos').textContent = 'Ihr Passwort wird sicher gespeichert und Ihre Notizen verschlüsselt. Sie können Ihr Passwort nicht wiederherstellen, wenn Sie es vergessen.';
      document.querySelector('#create-form button[type="submit"]').textContent = 'Mein Konto erstellen';
    }
  } else if (language === 'es') {
    document.documentElement.setAttribute('lang', 'es');
    document.querySelector('#language').value = 'es';
    document.querySelector('#legal a').textContent = 'Aviso legal / privacidad';
    document.querySelector('#sort-popup-box legend').textContent = 'Ordenar notas';
    document.querySelector('#sort-notes1-span').textContent = 'Fecha de modificación';
    document.querySelector('#sort-notes2-span').textContent = 'Fecha de modificación (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Título';
    document.querySelector('#sort-notes4-span').textContent = 'Título (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrar notas por categoría';
    document.querySelector('#download-popup-box legend').textContent = 'Tipo de exportación';
    document.querySelector('#spellcheck-slider span').textContent = 'Corrector ortográfico';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Ocultar barra lateral';
    document.querySelector('#lock-app-slider span').textContent = 'Bloquear aplicación';
    document.querySelector('#hide-infos').textContent = 'Ocultar contenido';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Título');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenido (Texto sin formato, Markdown o HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Elegir una carpeta';
    document.querySelector('#note-popup-box #categories option[value=""]').textContent = 'Elegir una categoría';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Guardar';
    document.querySelector('#folder-popup-box button').textContent = 'Crear';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Nombre de la carpeta');
    document.querySelector('#category-popup-box button').textContent = 'Crear';
    document.querySelector('#category-popup-box input').setAttribute('placeholder', 'Nombre de la categoría');
    document.querySelector('#link-markdown').textContent = 'Guía de Markdown';
    document.querySelector('#link-help').textContent = 'Ayuda y discusiones';
    
    if (cloud) {
      document.querySelector('#log-out').textContent = 'Cerrar sesión';
      document.querySelector('#old-psswd').setAttribute('placeholder', 'Contraseña antigua');
      document.querySelector('#new-psswd').setAttribute('placeholder', 'Nueva contraseña');
      document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirmar contraseña');
      document.querySelector('#change-psswd button[type="submit"]').textContent = 'Cambiar contraseña';
      document.querySelector('#gen-psswd summary').textContent = 'Cambiar contraseña';
      document.querySelector('#delete-user summary').textContent = 'Eliminar cuenta';
      document.querySelector('#delete-psswd').setAttribute('placeholder', 'Contraseña');
      document.querySelector('#delete-user button').textContent = 'Eliminar cuenta';
      document.querySelector('#private-note span').textContent = '¿Desea hacer privada su nota? El enlace ya no estará disponible.';
      document.querySelector('#private-note button').textContent = 'Hacer privada';
      document.querySelector('#public-note span').textContent = '¿Desea hacer pública su nota? Un enlace estará disponible para compartirla.';
      document.querySelector('#public-note button').textContent = 'Hacer pública';
    } else {
      document.querySelector('#create-account').textContent = '¿Aún no tienes una cuenta?';
      document.querySelector('#name-connect').setAttribute('placeholder', 'Nombre');
      document.querySelector('#psswd-connect').setAttribute('placeholder', 'Contraseña');
      document.querySelector('#connect-form').querySelector('button').textContent = 'Iniciar sesión';
      document.querySelector('#name-create').setAttribute('placeholder', 'Nombre');
      document.querySelector('#psswd-create').setAttribute('placeholder', 'Contraseña');
      document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirmar contraseña');
      document.querySelector('#create-infos').textContent = 'Su contraseña se almacena de forma segura y sus notas están cifradas. No podrá recuperar su contraseña si la olvida.';
      document.querySelector('#create-form button[type="submit"]').textContent = 'Crear mi cuenta';
    }
  } else {
    document.documentElement.setAttribute('lang', 'en');
    document.querySelector('#language').value = 'en';
    document.querySelector('#legal a').textContent = 'Legal notice / privacy';
    document.querySelector('#sort-popup-box legend').textContent = 'Sort notes';
    document.querySelector('#sort-notes1-span').textContent = 'Modification date';
    document.querySelector('#sort-notes2-span').textContent = 'Modification date (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Title';
    document.querySelector('#sort-notes4-span').textContent = 'Title (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filter notes by category';
    document.querySelector('#download-popup-box legend').textContent = 'Export type';
    document.querySelector('#spellcheck-slider span').textContent = 'Spell check';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Hide sidebar button';
    document.querySelector('#lock-app-slider span').textContent = 'Lock app';
    document.querySelector('#hide-infos').textContent = 'Hide content';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Title');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Content (Raw text, Markdown or HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Choose a folder';
    document.querySelector('#note-popup-box #categories option[value=""]').textContent = 'Choose a category';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Save';
    document.querySelector('#folder-popup-box button').textContent = 'Create';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Folder name');
    document.querySelector('#category-popup-box button').textContent = 'Create';
    document.querySelector('#category-popup-box input').setAttribute('placeholder', 'Category name');
    document.querySelector('#link-markdown').textContent = 'Markdown guide';
    document.querySelector('#link-help').textContent = 'Help and discussions';
    
    if (cloud) {
      document.querySelector('#log-out').textContent = 'Log out';
      document.querySelector('#old-psswd').setAttribute('placeholder', 'Old password');
      document.querySelector('#new-psswd').setAttribute('placeholder', 'New password');
      document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirm password');
      document.querySelector('#change-psswd button[type="submit"]').textContent = 'Change password';
      document.querySelector('#gen-psswd summary').textContent = 'Change password';
      document.querySelector('#delete-user summary').textContent = 'Delete account';
      document.querySelector('#delete-psswd').setAttribute('placeholder', 'Password');
      document.querySelector('#delete-user button').textContent = 'Delete account';
      document.querySelector('#private-note span').textContent = 'Do you want to make your note private? The link will no longer be available.';
      document.querySelector('#private-note button').textContent = 'Make private';
      document.querySelector('#public-note span').textContent = 'Do you want to make your note public? A link will be available to share it.';
      document.querySelector('#public-note button').textContent = 'Make public';
    } else {
      document.querySelector('#create-account').textContent = 'Don\'t have an account yet?';
      document.querySelector('#name-connect').setAttribute('placeholder', 'Name');
      document.querySelector('#psswd-connect').setAttribute('placeholder', 'Password');
      document.querySelector('#connect-form').querySelector('button').textContent = 'Log in';
      document.querySelector('#name-create').setAttribute('placeholder', 'Name');
      document.querySelector('#psswd-create').setAttribute('placeholder', 'Password');
      document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirm password');
      document.querySelector('#create-infos').textContent = 'Your password is stored securely and your notes are encrypted. You will not be able to recover your password if you forget it.';
      document.querySelector('#create-form button[type="submit"]').textContent = 'Create my account';
    }
  }
}
