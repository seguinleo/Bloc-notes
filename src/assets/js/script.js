import './marked.min.js';
import './purify.min.js';

let isUpdate = false;
let timeoutNotification = null;
let touchstartX = 0;
let touchendX = 0;
const noteBox = document.querySelector('#note-popup-box');
const sortBox = document.querySelector('#sort-popup-box');
const filterBox = document.querySelector('#filter-popup-box');
const connectBox = document.querySelector('#connect-box');
const createBox = document.querySelector('#create-box');
const popupBoxSettings = document.querySelector('#settings-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const colors = document.querySelectorAll('#colors span');
const accentColors = document.querySelectorAll('#accent-colors span');
const forms = document.querySelectorAll('form');
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const sidebar = document.querySelector('#sidebar');
const metaTheme = document.querySelectorAll('.theme-color');
const buttonTheme = document.querySelector('#icon-theme');
const notesJSON = JSON.parse(localStorage.getItem('local_notes') || '[]');

if (localStorage.getItem('theme') === 'light') {
  document.querySelector('html').className = 'light';
  metaTheme.forEach((e) => {
    e.content = '#eeeeee';
  });
  buttonTheme.className = 'fa-solid fa-lightbulb';
} else if (localStorage.getItem('theme') === 'dusk') {
  document.querySelector('html').className = 'dusk';
  metaTheme.forEach((e) => {
    e.content = '#1c1936';
  });
  buttonTheme.className = 'fa-solid fa-star';
}
if (localStorage.getItem('accent_color') === '5') {
  document.querySelector('body').classList = 'accent5';
  document.querySelector('#accent-colors .accent5-span').classList.add('selected');
} else if (localStorage.getItem('accent_color') === '4') {
  document.querySelector('body').classList = 'accent4';
  document.querySelector('#accent-colors .accent4-span').classList.add('selected');
} else if (localStorage.getItem('accent_color') === '3') {
  document.querySelector('body').classList = 'accent3';
  document.querySelector('#accent-colors .accent3-span').classList.add('selected');
} else if (localStorage.getItem('accent_color') === '2') {
  document.querySelector('body').classList = 'accent2';
  document.querySelector('#accent-colors .accent2-span').classList.add('selected');
} else {
  document.querySelector('body').classList = 'accent1';
  document.querySelector('#accent-colors .accent1-span').classList.add('selected');
}
if (localStorage.getItem('sort_notes') === null) localStorage.setItem('sort_notes', '3');
if (localStorage.getItem('language') === null) localStorage.setItem('language', 'en');

function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

function changeLanguage(language) {
  if (language === 'fr') {
    document.documentElement.setAttribute('lang', 'fr-FR');
    document.querySelector('#language').value = 'fr';
    document.querySelector('#icon-add').textContent = 'Ajouter une note';
    document.querySelector('#legal a').textContent = 'Mentions légales / confidentialité';
    document.querySelector('#search-option').options[0].textContent = 'Titre';
    document.querySelector('#search-option').options[1].textContent = 'Contenu';
    document.querySelector('#search-option').options[2].textContent = 'Tout';
    document.querySelector('#sort-popup-box legend').textContent = 'Trier les notes';
    document.querySelector('#sort-notes1-span').textContent = 'Date de création';
    document.querySelector('#sort-notes2-span').textContent = 'Date de création (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Date de modification';
    document.querySelector('#sort-notes4-span').textContent = 'Date de modification (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrer les notes par catégorie';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'Aucune catégorie';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Perso';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Travail';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Voyage';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Tâches';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Rappel';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Idées';
    });
    document.querySelector('#hide-infos').textContent = 'Masquer le contenu';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titre');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenu (Texte brut, Markdown ou HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Enregistrer';
    document.querySelector('#export-all-notes').textContent = 'Exporter toutes les notes';
    document.querySelector('#link-markdown').textContent = 'Guide Markdown';
    document.querySelector('#link-help').textContent = 'Aide et discussions';
    document.querySelector('#create-account').textContent = 'Pas encore de compte ?';
    document.querySelector('#name-connect').setAttribute('placeholder', 'Nom');
    document.querySelector('#psswd-connect').setAttribute('placeholder', 'Mot de passe');
    document.querySelector('#connect-form').querySelector('button').textContent = 'Se connecter';
    document.querySelector('#name-create').setAttribute('placeholder', 'Nom');
    document.querySelector('#psswd-create').setAttribute('placeholder', 'Mot de passe');
    document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirmer le mot de passe');
    document.querySelector('#create-infos').textContent = 'Votre mot de passe est stocké en toute sécurité et vos notes chiffrées. Il vous sera impossible de récupérer votre mot de passe si vous l\'oubliez.';
    document.querySelector('#gen-psswd summary').textContent = 'Générer un mot de passe';
    document.querySelector('#create-form button[type="submit"]').textContent = 'Créer mon compte';
  } else if (language === 'de') {
    document.documentElement.setAttribute('lang', 'de');
    document.querySelector('#language').value = 'de';
    document.querySelector('#icon-add').textContent = 'Notiz hinzufügen';
    document.querySelector('#legal a').textContent = 'Impressum / Datenschutz';
    document.querySelector('#search-option').options[0].textContent = 'Titel';
    document.querySelector('#search-option').options[1].textContent = 'Inhalt';
    document.querySelector('#search-option').options[2].textContent = 'Alles';
    document.querySelector('#sort-popup-box legend').textContent = 'Notizen sortieren';
    document.querySelector('#sort-notes1-span').textContent = 'Erstellungsdatum';
    document.querySelector('#sort-notes2-span').textContent = 'Erstellungsdatum (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Änderungsdatum';
    document.querySelector('#sort-notes4-span').textContent = 'Änderungsdatum (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Notizen filtern nach Kategorie';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'Keine Kategorie';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Persönlich';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Arbeit';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Reise';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Aufgaben';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Erinnerung';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Ideen';
    });
    document.querySelector('#hide-infos').textContent = 'Inhalt ausblenden';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titel');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Inhalt (Rohtext, Markdown oder HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Speichern';
    document.querySelector('#export-all-notes').textContent = 'Alle Notizen exportieren';
    document.querySelector('#link-markdown').textContent = 'Markdown-Anleitung';
    document.querySelector('#link-help').textContent = 'Hilfe und Diskussionen';
    document.querySelector('#create-account').textContent = 'Noch kein Konto?';
    document.querySelector('#name-connect').setAttribute('placeholder', 'Name');
    document.querySelector('#psswd-connect').setAttribute('placeholder', 'Passwort');
    document.querySelector('#connect-form').querySelector('button').textContent = 'Anmeldung';
    document.querySelector('#name-create').setAttribute('placeholder', 'Name');
    document.querySelector('#psswd-create').setAttribute('placeholder', 'Passwort');
    document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Passwort bestätigen');
    document.querySelector('#create-infos').textContent = 'Ihr Passwort wird sicher gespeichert und Ihre Notizen verschlüsselt. Sie können Ihr Passwort nicht wiederherstellen, wenn Sie es vergessen.';
    document.querySelector('#gen-psswd summary').textContent = 'Passwort generieren';
    document.querySelector('#create-form button[type="submit"]').textContent = 'Mein Konto erstellen';
  } else if (language === 'es') {
    document.documentElement.setAttribute('lang', 'es');
    document.querySelector('#language').value = 'es';
    document.querySelector('#icon-add').textContent = 'Agregar una nota';
    document.querySelector('#legal a').textContent = 'Aviso legal / privacidad';
    document.querySelector('#search-option').options[0].textContent = 'Título';
    document.querySelector('#search-option').options[1].textContent = 'Contenido';
    document.querySelector('#search-option').options[2].textContent = 'Todo';
    document.querySelector('#sort-popup-box legend').textContent = 'Ordenar notas';
    document.querySelector('#sort-notes1-span').textContent = 'Fecha de creación';
    document.querySelector('#sort-notes2-span').textContent = 'Fecha de creación (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Fecha de modificación';
    document.querySelector('#sort-notes4-span').textContent = 'Fecha de modificación (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrar notas por categoría';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'Sin categoría';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Personal';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Trabajo';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Viaje';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Tareas';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Recordatorio';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Ideas';
    });
    document.querySelector('#hide-infos').textContent = 'Ocultar contenido';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Título');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenido (Texto sin formato, Markdown o HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Guardar';
    document.querySelector('#export-all-notes').textContent = 'Exportar todas las notas';
    document.querySelector('#link-markdown').textContent = 'Guía de Markdown';
    document.querySelector('#link-help').textContent = 'Ayuda y discusiones';
    document.querySelector('#create-account').textContent = '¿Aún no tienes una cuenta?';
    document.querySelector('#name-connect').setAttribute('placeholder', 'Nombre');
    document.querySelector('#psswd-connect').setAttribute('placeholder', 'Contraseña');
    document.querySelector('#connect-form').querySelector('button').textContent = 'Conectarse';
    document.querySelector('#name-create').setAttribute('placeholder', 'Nombre');
    document.querySelector('#psswd-create').setAttribute('placeholder', 'Contraseña');
    document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirmar contraseña');
    document.querySelector('#create-infos').textContent = 'Su contraseña se almacena de forma segura y sus notas cifradas. No podrá recuperar su contraseña si la olvida.';
    document.querySelector('#gen-psswd summary').textContent = 'Generar una contraseña';
    document.querySelector('#create-form button[type="submit"]').textContent = 'Crear mi cuenta';
  } else {
    document.documentElement.setAttribute('lang', 'en');
    document.querySelector('#language').value = 'en';
    document.querySelector('#icon-add').textContent = 'Add a note';
    document.querySelector('#legal a').textContent = 'Legal notice / privacy';
    document.querySelector('#search-option').options[0].textContent = 'Title';
    document.querySelector('#search-option').options[1].textContent = 'Content';
    document.querySelector('#search-option').options[2].textContent = 'All';
    document.querySelector('#sort-popup-box legend').textContent = 'Sort notes';
    document.querySelector('#sort-notes1-span').textContent = 'Creation date';
    document.querySelector('#sort-notes2-span').textContent = 'Creation date (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Modification date';
    document.querySelector('#sort-notes4-span').textContent = 'Modification date (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filter notes by category';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'No category';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Personal';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Work';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Travel';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Tasks';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Reminder';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Ideas';
    });
    document.querySelector('#hide-infos').textContent = 'Hide content';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Title');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Content (Raw text, Markdown or HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Save';
    document.querySelector('#export-all-notes').textContent = 'Export all notes';
    document.querySelector('#link-markdown').textContent = 'Markdown guide';
    document.querySelector('#link-help').textContent = 'Help and discussions';
    document.querySelector('#create-account').textContent = 'No account yet?';
    document.querySelector('#name-connect').setAttribute('placeholder', 'Name');
    document.querySelector('#psswd-connect').setAttribute('placeholder', 'Password');
    document.querySelector('#connect-form').querySelector('button').textContent = 'Log in';
    document.querySelector('#name-create').setAttribute('placeholder', 'Name');
    document.querySelector('#psswd-create').setAttribute('placeholder', 'Password');
    document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirm password');
    document.querySelector('#create-infos').textContent = 'Your password is stored securely and your notes encrypted. You will not be able to recover your password if you forget it.';
    document.querySelector('#gen-psswd summary').textContent = 'Generate a password';
    document.querySelector('#create-form button[type="submit"]').textContent = 'Create my account';
  }
}

const verifyFingerprint = async () => {
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
        },
        timeout: 60000,
        attestation: 'direct',
      },
    });
    if (localStorage.getItem('fingerprint') === 'true') await showNotes();
    else localStorage.setItem('fingerprint', 'true');
  } catch (error) {
    if (localStorage.getItem('fingerprint') === 'true') {
      window.location.href = '/error/403/';
    } else document.querySelector('#check-fingerprint').checked = false;
  }
};

if (localStorage.getItem('spellcheck') === 'false') {
  document.querySelector('#spellcheck').checked = false;
  contentNote.setAttribute('spellcheck', 'false');
}

if (localStorage.getItem('fingerprint') === 'true') {
  verifyFingerprint();
  document.querySelector('#check-fingerprint').checked = true;
}

if (localStorage.getItem('compact') === 'true') {
  document.querySelector('#check-compact').checked = true;
  document.querySelector('main').classList.add('compact');
}

const showSuccess = (message) => {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelector('#success-notification');
  notification.textContent = message;
  notification.style.display = 'block';
  timeoutNotification = setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
};

const showError = (message) => {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelector('#error-notification');
  notification.textContent = message;
  notification.style.display = 'block';
  timeoutNotification = setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
};

const searchSidebar = () => {
  sidebar.querySelectorAll('#list-notes p').forEach((e) => {
    e.addEventListener('click', () => {
      const titleList = e.querySelector('.title-list').textContent;
      document.querySelectorAll('.note').forEach((note) => {
        const title = note.querySelector('.title').textContent;
        if (title === titleList) note.scrollIntoView();
      });
    });
    e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') e.click();
    });
  });
};

const openSidebar = () => sidebar.classList.add('show');
const closeSidebar = () => sidebar.classList.remove('show');
const handleGesture = () => {
  if (touchendX - touchstartX > 75 && !sidebar.classList.contains('show')) openSidebar();
  else if (touchendX - touchstartX < -75 && sidebar.classList.contains('show')) closeSidebar();
};

const noteActions = () => {
  document.querySelectorAll('.bottom-content i').forEach((e) => {
    e.addEventListener('click', (event) => {
      const { target } = event;
      const noteId = target.closest('.note').getAttribute('data-note-id');
      const noteTitle = target.closest('.note').getAttribute('data-note-title');
      const noteContent = target.closest('.note').getAttribute('data-note-content');
      const noteColor = target.closest('.note').getAttribute('data-note-color');
      const noteHidden = target.closest('.note').getAttribute('data-note-hidden');
      const noteCategory = target.closest('.note').getAttribute('data-note-category');
      if (target.classList.contains('fa-pen')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteCategory);
      else if (target.classList.contains('fa-clipboard')) copy(noteContent);
      else if (target.classList.contains('fa-trash-can')) deleteNote(noteId);
      else if (target.classList.contains('fa-expand')) toggleFullscreen(noteId);
      else if (target.classList.contains('fa-download')) downloadNote(noteTitle, noteContent);
    });
    e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') e.click();
    });
  });
};

function arrayBufferToBase64(buffer) {
  const binary = [];
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i += 1) binary.push(String.fromCharCode(bytes[i]));
  return window.btoa(binary.join(''));
}

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) byteArray[i] = binaryString.charCodeAt(i);
  return byteArray.buffer;
}

function getPassword(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&~"#\'(-_)=^$€*!?,.;:/|\\@%+{}[]<>`';
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i += 1) password += chars[array[i] % chars.length];
  document.querySelector('#psswd-gen').textContent = password;
  document.querySelector('#psswd-create').value = password;
  document.querySelector('#psswd-create-valid').value = password;
}

async function openIndexedDB(dbName, objectStoreName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(objectStoreName)) db.createObjectStore(objectStoreName);
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function getKeyFromDB(db, objectStoreName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.get('encryptionKey');
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

async function storeKeyInDB(db, objectStoreName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    objectStore.put(key, 'encryptionKey');
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

const showNotes = async () => {
  document.querySelectorAll('#list-notes *').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());
  forms.forEach((form) => form.reset());

  if (notesJSON.length === 0) return;

  try {
    const numberOfNotesElement = document.createElement('h2');
    if (localStorage.getItem('language') === 'de') numberOfNotesElement.textContent = `Notizen (${notesJSON.length})`;
    else if (localStorage.getItem('language') === 'es') numberOfNotesElement.textContent = `Notas (${notesJSON.length})`;
    else numberOfNotesElement.textContent = `Notes (${notesJSON.length})`;
    sidebar.querySelector('#list-notes').appendChild(numberOfNotesElement);

    const dbName = 'notes_db';
    const objectStoreName = 'key';
    const db = await openIndexedDB(dbName, objectStoreName);
    const key = await getKeyFromDB(db, objectStoreName);

    if (localStorage.getItem('sort_notes') === '1') {
      notesJSON.sort((a, b) => b.id - a.id);
      document.querySelector('input[name="sort-notes"][value="1"]').checked = true;
    } else if (localStorage.getItem('sort_notes') === '2') {
      notesJSON.sort((a, b) => a.id - b.id);
      document.querySelector('input[name="sort-notes"][value="2"]').checked = true;
    } else if (localStorage.getItem('sort_notes') === '4') {
      notesJSON.sort((a, b) => new Date(a.date) - new Date(b.date));
      document.querySelector('input[name="sort-notes"][value="4"]').checked = true;
    } else {
      notesJSON.sort((a, b) => new Date(b.date) - new Date(a.date));
      document.querySelector('input[name="sort-notes"][value="3"]').checked = true;
    }

    const fragment = document.createDocumentFragment();

    const promises = notesJSON.map(async (row, id) => {
      const {
        title, content, color, date, hidden, category,
      } = row;

      if (!title || !color || !date) return;

      const deTitle = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(12) },
        key,
        base64ToArrayBuffer(title),
      );

      const deContent = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(12) },
        key,
        base64ToArrayBuffer(content),
      );

      const deTitleString = JSON.parse(new TextDecoder().decode(deTitle));
      const deContentString = JSON.parse(new TextDecoder().decode(deContent));
      const contentHtml = marked.parse(deContentString);
      const noteElement = document.createElement('div');
      const detailsElement = document.createElement('div');
      const titleElement = document.createElement('h2');
      const contentElement = document.createElement('div');
      const bottomContentElement = document.createElement('div');
      const editIconElement = document.createElement('i');
      const paragraph = document.createElement('p');
      const titleSpan = document.createElement('span');
      const dateSpan = document.createElement('span');

      noteElement.id = `note${id}`;
      noteElement.classList.add('note', color);
      noteElement.setAttribute('data-note-id', id);
      noteElement.setAttribute('data-note-title', deTitleString);
      noteElement.setAttribute('data-note-content', deContentString);
      noteElement.setAttribute('data-note-color', color);
      noteElement.setAttribute('data-note-hidden', hidden);
      noteElement.setAttribute('data-note-category', category);
      detailsElement.classList.add('details');
      titleElement.classList.add('title');
      titleElement.textContent = deTitleString;
      contentElement.classList.add('details-content');

      if (hidden === '0') contentElement.innerHTML = contentHtml;
      else contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(contentElement);
      bottomContentElement.classList.add('bottom-content');
      editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
      editIconElement.tabIndex = 0;
      editIconElement.setAttribute('role', 'button');
      editIconElement.setAttribute('aria-label', 'Modifier la note');
      bottomContentElement.appendChild(editIconElement);

      const trashIconElement = document.createElement('i');
      trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
      trashIconElement.tabIndex = 0;
      trashIconElement.setAttribute('role', 'button');
      trashIconElement.setAttribute('aria-label', 'Supprimer la note');
      bottomContentElement.appendChild(trashIconElement);

      if (hidden === '0' && deContentString !== '') {
        const clipboardIconElement = document.createElement('i');
        clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
        clipboardIconElement.tabIndex = 0;
        clipboardIconElement.setAttribute('role', 'button');
        clipboardIconElement.setAttribute('aria-label', 'Copier la note');
        bottomContentElement.appendChild(clipboardIconElement);

        const downloadIconElement = document.createElement('i');
        downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
        downloadIconElement.tabIndex = 0;
        downloadIconElement.setAttribute('role', 'button');
        downloadIconElement.setAttribute('aria-label', 'Télécharger la note');
        bottomContentElement.appendChild(downloadIconElement);

        const expandIconElement = document.createElement('i');
        expandIconElement.classList.add('fa-solid', 'fa-expand', 'note-action');
        expandIconElement.tabIndex = 0;
        expandIconElement.setAttribute('role', 'button');
        expandIconElement.setAttribute('aria-label', 'Agrandir la note');
        bottomContentElement.appendChild(expandIconElement);
      }

      noteElement.appendChild(detailsElement);
      noteElement.appendChild(bottomContentElement);
      paragraph.setAttribute('tabindex', '0');
      paragraph.setAttribute('role', 'button');
      titleSpan.classList.add('title-list');
      titleSpan.textContent = deTitleString;
      dateSpan.classList.add('date-list');
      dateSpan.textContent = new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (category !== '0') {
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('category');
        categoryElement.textContent = document.querySelector(`input[name="category"][value="${category}"]`).parentElement.textContent;
        paragraph.appendChild(categoryElement);
      }

      fragment.appendChild(noteElement);
      paragraph.appendChild(titleSpan);
      paragraph.appendChild(dateSpan);
      sidebar.querySelector('#list-notes').appendChild(paragraph);
    });

    await Promise.all(promises);
    document.querySelector('main').appendChild(fragment);
    searchSidebar();
    noteActions();
    document.querySelector('#last-sync span').textContent = new Date().toLocaleTimeString();
  } catch (error) {
    showError('An error occurred while decrypting the notes.');
  }
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
  document.body.classList.toggle('body-fullscreen');
};

const updateNote = (id, title, content, color, hidden, category) => {
  isUpdate = true;
  document.querySelectorAll('.note').forEach((e) => e.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  document.querySelector('#icon-add').click();
  document.querySelector('#id-note').value = id;
  titleNote.value = title;
  contentNote.value = content;
  colors.forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selected');
    else e.classList.remove('selected');
  });
  document.querySelector(`input[name="category"][value="${category}"]`).checked = true;
  if (hidden === '1') document.querySelector('#check-hidden').checked = true;
  document.querySelector('#textarea-length').textContent = `${contentNote.value.length}/5000`;
  contentNote.focus();
};

const downloadNote = (title, content) => {
  const a = document.createElement('a');
  a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
  a.setAttribute('download', `${title}.txt`);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const copy = (content) => {
  navigator.clipboard.writeText(content);
};

const deleteNote = async (e) => {
  document.querySelectorAll('.note').forEach((note) => note.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  let message = '';
  if (localStorage.getItem('language') === 'fr') message = 'Êtes-vous sûr de vouloir supprimer cette note ?';
  else if (localStorage.getItem('language') === 'de') message = 'Möchten Sie diese Notiz wirklich löschen?';
  else if (localStorage.getItem('language') === 'es') message = '¿Estás seguro que quieres eliminar esta nota?';
  else message = 'Do you really want to delete this note?';
  if (window.confirm(message)) {
    notesJSON.splice(e, 1);
    localStorage.setItem('local_notes', JSON.stringify(notesJSON));
    await showNotes();
  }
};

document.querySelectorAll('#icon-add, #icon-float-add').forEach((e) => {
  e.addEventListener('click', () => {
    noteBox.showModal();
    document.querySelector('#textarea-length').textContent = '0/5000';
    document.querySelector('#check-hidden').disabled = false;
  });
});

document.querySelector('#control-clear').addEventListener('click', () => {
  contentNote.value = '';
});
document.querySelector('#control-clear').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') e.click();
});

document.querySelector('#spellcheck').addEventListener('change', () => {
  if (!document.querySelector('#spellcheck').checked) {
    localStorage.setItem('spellcheck', 'false');
    contentNote.setAttribute('spellcheck', 'false');
  } else {
    localStorage.removeItem('spellcheck');
    contentNote.setAttribute('spellcheck', 'true');
  }
});

document.querySelector('#check-fingerprint').addEventListener('change', () => {
  if (document.querySelector('#check-fingerprint').checked) verifyFingerprint();
  else localStorage.removeItem('fingerprint');
});

document.querySelector('#check-compact').addEventListener('change', () => {
  if (document.querySelector('#check-compact').checked) {
    localStorage.setItem('compact', 'true');
    document.querySelector('main').classList.add('compact');
  } else {
    localStorage.removeItem('compact');
    document.querySelector('main').classList.remove('compact');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-clipboard')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-trash-can')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-pen')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-expand')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-download')) document.activeElement.click();
  } else if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

document.querySelector('#copy-password-btn').addEventListener('click', () => {
  const psswd = document.querySelector('#psswd-gen').textContent;
  navigator.clipboard.writeText(psswd);
});

document.querySelector('#log-in').addEventListener('click', () => {
  connectBox.showModal();
});

document.querySelector('#create-account').addEventListener('click', () => {
  connectBox.close();
  createBox.showModal();
});

document.querySelector('#settings').addEventListener('click', () => {
  popupBoxSettings.showModal();
  sidebar.classList.remove('show');
});

contentNote.addEventListener('input', () => {
  const e = contentNote.value.length;
  document.querySelector('#textarea-length').textContent = `${e}/5000`;
});

colors.forEach((span, index) => {
  span.addEventListener('click', (event) => {
    colors.forEach((e) => e.classList.remove('selected'));
    event.target.classList.add('selected');
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
  if (index === 0) span.classList.add('selected');
});

accentColors.forEach((span) => {
  span.addEventListener('click', (event) => {
    accentColors.forEach((e) => e.classList.remove('selected'));
    event.target.classList.add('selected');
    if (span.classList.contains('accent5-span')) {
      document.querySelector('body').classList = 'accent5';
      localStorage.setItem('accent_color', '5');
    } else if (span.classList.contains('accent4-span')) {
      document.querySelector('body').classList = 'accent4';
      localStorage.setItem('accent_color', '4');
    } else if (span.classList.contains('accent3-span')) {
      document.querySelector('body').classList = 'accent3';
      localStorage.setItem('accent_color', '3');
    } else if (span.classList.contains('accent2-span')) {
      document.querySelector('body').classList = 'accent2';
      localStorage.setItem('accent_color', '2');
    } else {
      document.querySelector('body').classList = 'accent1';
      localStorage.setItem('accent_color', '1');
    }
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
});

document.querySelectorAll('.link').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelectorAll('.fa-xmark').forEach((e) => {
  e.addEventListener('click', () => {
    isUpdate = false;
    forms.forEach((form) => form.reset());
    document.querySelectorAll('dialog').forEach((dialog) => dialog.close());
  });
});

document.querySelector('#export-all-notes').addEventListener('click', () => {
  if (document.querySelector('.note') === null) return;
  const notes = [];
  document.querySelectorAll('.note').forEach((e) => {
    const title = e.querySelector('.title').textContent;
    const content = e.querySelector('.details-content').textContent;
    const noteObject = {
      title,
      content,
    };
    notes.push(noteObject);
  });
  const a = document.createElement('a');
  a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(notes))}`);
  a.setAttribute('download', 'notes.json');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

document.querySelector('#search-input').addEventListener('input', () => {
  const searchValue = document.querySelector('#search-input').value.trim().toLowerCase();
  document.querySelectorAll('.note').forEach((e) => {
    if (document.querySelector('#search-option').value === '0') {
      const title = e.querySelector('.note h2').textContent.toLowerCase();
      if (title.includes(searchValue)) e.style.display = 'flex';
      else e.style.display = 'none';
    } else if (document.querySelector('#search-option').value === '1') {
      const content = e.querySelector('.details-content').textContent.toLowerCase();
      if (content.includes(searchValue)) e.style.display = 'flex';
      else e.style.display = 'none';
    } else {
      const title = e.querySelector('.note h2').textContent.toLowerCase();
      const content = e.querySelector('.details-content').textContent.toLowerCase();
      if (title.includes(searchValue) || content.includes(searchValue)) e.style.display = 'flex';
      else e.style.display = 'none';
    }
  });
});

document.querySelector('#btn-theme').addEventListener('click', () => {
  if (localStorage.getItem('theme') === null) {
    document.querySelector('html').className = 'light';
    metaTheme.forEach((e) => {
      e.content = '#eeeeee';
    });
    buttonTheme.className = 'fa-solid fa-lightbulb';
    localStorage.setItem('theme', 'light');
    return;
  }
  if (localStorage.getItem('theme') === 'dark') {
    document.querySelector('html').className = 'light';
    metaTheme.forEach((e) => {
      e.content = '#eeeeee';
    });
    buttonTheme.className = 'fa-solid fa-lightbulb';
    localStorage.setItem('theme', 'light');
  } else if (localStorage.getItem('theme') === 'dusk') {
    document.querySelector('html').className = 'dark';
    metaTheme.forEach((e) => {
      e.content = '#171717';
    });
    buttonTheme.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    document.querySelector('html').className = 'dusk';
    metaTheme.forEach((e) => {
      e.content = '#1c1936';
    });
    buttonTheme.className = 'fa-solid fa-star';
    localStorage.setItem('theme', 'dusk');
  }
});

document.querySelector('#language').addEventListener('change', async () => {
  const e = document.querySelector('#language').value;
  if (e === 'fr') {
    localStorage.setItem('language', 'fr');
    changeLanguage('fr');
    await showNotes();
  } else if (e === 'de') {
    localStorage.setItem('language', 'de');
    changeLanguage('de');
    await showNotes();
  } else if (e === 'es') {
    localStorage.setItem('language', 'es');
    changeLanguage('es');
    await showNotes();
  } else {
    localStorage.setItem('language', 'en');
    changeLanguage('en');
    await showNotes();
  }
});

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#btn-filter').addEventListener('click', () => filterBox.showModal());
document.querySelector('#btn-sort').addEventListener('click', () => sortBox.showModal());
document.querySelector('#submit-gen-psswd').addEventListener('click', () => getPassword(16));
forms.forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()));

document.querySelectorAll('input[name="sort-notes"]').forEach(async (e) => {
  e.addEventListener('change', async () => {
    if (e.value === '1' || e.value === '2' || e.value === '3' || e.value === '4') {
      localStorage.setItem('sort_notes', e.value);
      await showNotes();
    }
  });
});

document.querySelectorAll('input[name="filter-notes"]').forEach((e) => {
  e.addEventListener('change', () => {
    const categories = [];
    document.querySelectorAll('input[name="filter-notes"]:checked').forEach((t) => categories.push(t.value));
    document.querySelectorAll('.note').forEach((n) => {
      const note = n;
      const category = note.getAttribute('data-note-category');
      if (categories.includes(category)) note.style.display = 'flex';
      else note.style.display = 'none';
    });
  });
});

document.querySelectorAll('.category').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#create-form').addEventListener('submit', async () => {
  const e = document.querySelector('#name-create').value.trim();
  const t = document.querySelector('#psswd-create').value;
  const o = document.querySelector('#psswd-create-valid').value;
  if (!e || !t || !o || e.length < 4 || e.length > 25 || t.length < 8 || t.length > 50) return;
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    showError('Name can only contain letters...');
    return;
  }
  if (/^[0-9]+$/.test(t)) {
    showError('Password too weak (only numbers)...');
    return;
  }
  if (/^[a-zA-Z]+$/.test(t)) {
    showError('Password too weak (only letters)...');
    return;
  }
  if (t !== o) {
    showError('Passwords do not match...');
    return;
  }
  if (e === t) {
    showError('Username and password cannot be the same...');
    return;
  }
  const nameCreate = encodeURIComponent(e);
  const psswdCreate = encodeURIComponent(t);
  try {
    const response = await fetch('./assets/php/createUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nameCreate=${nameCreate}&psswdCreate=${psswdCreate}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      createBox.close();
      forms.forEach((form) => form.reset());
      let message = '';
      if (localStorage.getItem('language') === 'fr') message = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
      else if (localStorage.getItem('language') === 'de') message = 'Konto erfolgreich erstellt! Sie können sich jetzt anmelden.';
      else if (localStorage.getItem('language') === 'es') message = '¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.';
      else message = 'Account successfully created! You can now log in.';
      showSuccess(message);
    } else {
      showError('Username already taken...');
      forms.forEach((form) => form.reset());
    }
  } catch (error) {
    showError('An error occurred...');
    forms.forEach((form) => form.reset());
  }
});

document.querySelector('#connect-form').addEventListener('submit', async () => {
  const e = document.querySelector('#name-connect').value.trim();
  const t = document.querySelector('#psswd-connect').value;
  if (!e || !t || e.length > 25 || t.length > 50 || !/^[a-zA-ZÀ-ÿ -]+$/.test(e)) return;
  const nameConnect = encodeURIComponent(e);
  const psswdConnect = encodeURIComponent(t);
  try {
    const response = await fetch('./assets/php/connectUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nameConnect=${nameConnect}&psswdConnect=${psswdConnect}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      window.location.reload();
    } else {
      forms.forEach((form) => form.reset());
      let time = 10;
      const btn = document.querySelector('#connect-form button[type="submit"]');
      const btnText = btn.textContent;
      btn.disabled = true;
      showError('Wrong username or password...');
      const interval = setInterval(() => {
        time -= 1;
        btn.textContent = time;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        btn.disabled = false;
        btn.textContent = btnText;
      }, 10000);
    }
  } catch (error) {
    showError('An error occurred...');
    forms.forEach((form) => form.reset());
  }
});

document.querySelector('#add-note').addEventListener('submit', async () => {
  try {
    const idNote = notesJSON.length;
    const title = titleNote.value.trim();
    const content = contentNote.value.trim();
    const color = document.querySelector('#colors .selected').classList[0];
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hidden = document.querySelector('#check-hidden').checked ? '1' : '0';
    const category = document.querySelector('input[name="category"]:checked').value;

    if (!title || title.length > 30 || content.length > 5000 || !color || !/^[0-9]+$/.test(category)) return;

    const mdContent = DOMPurify.sanitize(content, {
      SANITIZE_NAMED_PROPS: true,
    });

    const dbName = 'notes_db';
    const objectStoreName = 'key';
    const db = await openIndexedDB(dbName, objectStoreName);
    let key = await getKeyFromDB(db, objectStoreName);

    if (!key) {
      key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt'],
      );
      await storeKeyInDB(db, objectStoreName, key);
    }

    const enTitle = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      key,
      new TextEncoder().encode(JSON.stringify(title)),
    );

    const enContent = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      key,
      new TextEncoder().encode(JSON.stringify(mdContent)),
    );

    const note = {
      id: idNote,
      title: arrayBufferToBase64(enTitle),
      content: arrayBufferToBase64(enContent),
      color,
      date,
      hidden,
      category,
    };

    if (isUpdate) {
      isUpdate = false;
      notesJSON[document.querySelector('#id-note').value] = note;
    } else notesJSON.push(note);

    localStorage.setItem('local_notes', JSON.stringify(notesJSON));
    noteBox.close();
    await showNotes();
  } catch (error) {
    showError('An error occurred...');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  document.querySelector('#last-sync').addEventListener('click', () => window.location.reload());
  changeLanguage(localStorage.getItem('language'));
  if (localStorage.getItem('fingerprint') !== 'true') await showNotes();
});
