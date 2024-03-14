import './marked.min.js';
import './purify.min.js';

let isUpdate = false;
let timeoutNotification = null;
let touchstartX = 0;
let touchendX = 0;
const noteBox = document.querySelector('#note-popup-box');
const sortBox = document.querySelector('#sort-popup-box');
const filterBox = document.querySelector('#filter-popup-box');
const popupBoxManage = document.querySelector('#manage-popup-box');
const popupBoxSettings = document.querySelector('#settings-popup-box');
const privateNote = document.querySelector('#private-note-popup-box');
const publicNote = document.querySelector('#public-note-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const colors = document.querySelectorAll('#colors span');
const accentColors = document.querySelectorAll('#accent-colors span');
const forms = document.querySelectorAll('form');
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const sidebar = document.querySelector('#sidebar');
const metaTheme = document.querySelectorAll('.theme-color');
const buttonTheme = document.querySelector('#icon-theme');

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
if (localStorage.getItem('version') === 'hide') document.querySelector('#new-version').style.display = 'none';
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
    document.querySelector('#new-version-infos').textContent = 'Bloc-notes à été mis à jour !';
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
  } else if (language === 'de') {
    document.documentElement.setAttribute('lang', 'de');
    document.querySelector('#language').value = 'de';
    document.querySelector('#icon-add').textContent = 'Notiz hinzufügen';
    document.querySelector('#new-version-infos').textContent = 'Bloc-notes wurde aktualisiert!';
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
    document.querySelector('#log-out').textContent = 'Abmelden';
    document.querySelector('#old-psswd').setAttribute('placeholder', 'Altes Passwort');
    document.querySelector('#new-psswd').setAttribute('placeholder', 'Neues Passwort');
    document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Passwort bestätigen');
    document.querySelector('#change-psswd button[type="submit"]').textContent = 'Passwort ändern';
    document.querySelector('#gen-psswd summary').textContent = 'Passwort ändern';
    document.querySelector('#delete-user summary').textContent = 'Konto löschen';
    document.querySelector('#delete-psswd').setAttribute('placeholder', 'Passwort');
    document.querySelector('#delete-user button').textContent = 'Konto löschen';
    document.querySelector('#private-note span').textContent = 'Möchten Sie Ihre Notiz privat machen? Der Link wird nicht mehr verfügbar sein.';
    document.querySelector('#private-note button').textContent = 'Privat machen';
    document.querySelector('#public-note span').textContent = 'Möchten Sie Ihre Notiz öffentlich machen? Ein Link wird verfügbar sein, um es zu teilen.';
    document.querySelector('#public-note button').textContent = 'Öffentlich machen';
  } else if (language === 'es') {
    document.documentElement.setAttribute('lang', 'es');
    document.querySelector('#language').value = 'es';
    document.querySelector('#icon-add').textContent = 'Agregar una nota';
    document.querySelector('#new-version-infos').textContent = '¡Bloc-notes ha sido actualizado!';
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
    document.querySelector('#log-out').textContent = 'Cerrar sesión';
    document.querySelector('#old-psswd').setAttribute('placeholder', 'Contraseña antigua');
    document.querySelector('#new-psswd').setAttribute('placeholder', 'Nueva contraseña');
    document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirmar contraseña');
    document.querySelector('#change-psswd button[type="submit"]').textContent = 'Cambiar contraseña';
    document.querySelector('#gen-psswd summary').textContent = 'Cambiar contraseña';
    document.querySelector('#delete-user summary').textContent = 'Eliminar cuenta';
    document.querySelector('#delete-psswd').setAttribute('placeholder', 'Contraseña');
    document.querySelector('#delete-user button').textContent = 'Eliminar cuenta';
    document.querySelector('#private-note span').textContent = '¿Quieres hacer tu nota privada? El enlace ya no estará disponible.';
    document.querySelector('#private-note button').textContent = 'Hacer privado';
    document.querySelector('#public-note span').textContent = '¿Quieres hacer tu nota pública? Un enlace estará disponible para compartirlo.';
    document.querySelector('#public-note button').textContent = 'Hacer público';
  } else {
    document.documentElement.setAttribute('lang', 'en');
    document.querySelector('#language').value = 'en';
    document.querySelector('#icon-add').textContent = 'Add a note';
    document.querySelector('#new-version-infos').textContent = 'Bloc-notes has been updated!';
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
  }
}

function getPassword(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&~"#\'(-_)=^$€*!?,.;:/|\\@%+{}[]<>`';
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i += 1) password += chars[array[i] % chars.length];
  document.querySelector('#psswd-gen').textContent = password;
  document.querySelector('#new-psswd').value = password;
  document.querySelector('#new-psswd-valid').value = password;
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
          userVerification: 'required',
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

const noteAccess = (id, link) => {
  document.querySelectorAll('.note').forEach((e) => e.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  if (link === null) {
    privateNote.showModal();
    document.querySelector('#id-note-public').value = id;
  } else {
    publicNote.showModal();
    document.querySelector('#id-note-private').value = id;
    document.querySelector('#link-note-private').value = link;
    document.querySelector('#copy-note-link').textContent = link;
  }
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
      const noteLink = target.closest('.note').getAttribute('data-note-link') || null;
      if (target.classList.contains('fa-pen')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteCategory, noteLink);
      else if (target.classList.contains('fa-clipboard')) copy(noteContent);
      else if (target.classList.contains('fa-trash-can')) deleteNote(noteId);
      else if (target.classList.contains('fa-expand')) toggleFullscreen(noteId);
      else if (target.classList.contains('fa-download')) downloadNote(noteTitle, noteContent);
      else if (target.classList.contains('fa-link')) noteAccess(noteId, noteLink, noteTitle, noteContent);
    });
    e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') e.click();
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      document.querySelector('#search-input').focus();
    }
  });
};

const showNotes = async () => {
  const sortOption = localStorage.getItem('sort_notes');
  if (Number.isNaN(sortOption)) return;
  document.querySelectorAll('#list-notes *').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());
  forms.forEach((form) => form.reset());

  try {
    const response = await fetch('./assets/php/getNotes.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `sort=${sortOption}&csrf_token=${csrfToken}`,
    });

    const notesJSON = await response.json();

    if (notesJSON.length === 0) return;

    const numberOfNotesElement = document.createElement('h2');
    if (localStorage.getItem('language') === 'de') numberOfNotesElement.textContent = `Notizen (${notesJSON.length})`;
    else if (localStorage.getItem('language') === 'es') numberOfNotesElement.textContent = `Notas (${notesJSON.length})`;
    else numberOfNotesElement.textContent = `Notes (${notesJSON.length})`;
    sidebar.querySelector('#list-notes').appendChild(numberOfNotesElement);

    const fragment = document.createDocumentFragment();

    notesJSON.forEach((row) => {
      const {
        id, title, content, color, date, hidden, category, link,
      } = row;

      if (!id || !title || !color || !date) return;

      const contentHtml = marked.parse(content);
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
      noteElement.setAttribute('data-note-title', title);
      noteElement.setAttribute('data-note-content', content);
      noteElement.setAttribute('data-note-color', color);
      noteElement.setAttribute('data-note-hidden', hidden);
      noteElement.setAttribute('data-note-category', category);
      detailsElement.classList.add('details');
      titleElement.classList.add('title');
      titleElement.textContent = title;
      contentElement.classList.add('details-content');

      if (hidden === 0) contentElement.innerHTML = contentHtml;
      else contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(contentElement);
      bottomContentElement.classList.add('bottom-content');
      editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
      editIconElement.tabIndex = 0;
      editIconElement.setAttribute('role', 'button');
      editIconElement.setAttribute('aria-label', 'Modifier la note');
      bottomContentElement.appendChild(editIconElement);

      if (link === null) {
        const trashIconElement = document.createElement('i');
        trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
        trashIconElement.tabIndex = 0;
        trashIconElement.setAttribute('role', 'button');
        trashIconElement.setAttribute('aria-label', 'Supprimer la note');
        bottomContentElement.appendChild(trashIconElement);

        const iconLink = document.createElement('i');
        iconLink.classList.add('fa-solid', 'fa-link');
        titleSpan.appendChild(iconLink);
      }

      if (hidden === 0 && content !== '') {
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

        const linkIconElement = document.createElement('i');
        linkIconElement.classList.add('fa-solid', 'fa-link', 'note-action');
        linkIconElement.tabIndex = 0;
        linkIconElement.setAttribute('role', 'button');
        linkIconElement.setAttribute('aria-label', 'Statut de la note');
        bottomContentElement.appendChild(linkIconElement);
      }

      noteElement.appendChild(detailsElement);
      noteElement.appendChild(bottomContentElement);
      paragraph.setAttribute('tabindex', '0');
      paragraph.setAttribute('role', 'button');
      titleSpan.classList.add('title-list');
      titleSpan.textContent = title;
      if (link !== null) {
        noteElement.setAttribute('data-note-link', link);
        titleSpan.appendChild(document.createElement('i'));
        titleSpan.querySelector('i').classList.add('fa-solid', 'fa-link');
      }
      dateSpan.classList.add('date-list');
      dateSpan.textContent = new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (category !== 0) {
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

    document.querySelector('main').appendChild(fragment);
    searchSidebar();
    noteActions();
    document.querySelector('#last-sync span').textContent = new Date().toLocaleTimeString();
  } catch (error) {
    showError('An error occurred...');
  }
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
  document.body.classList.toggle('body-fullscreen');
};

const fetchDelete = async (id) => {
  try {
    const response = await fetch('./assets/php/deleteNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${id}&csrf_token=${csrfToken}`,
    });
    if (response.ok) await showNotes();
    else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
};

const fetchLogout = async () => {
  try {
    const response = await fetch('./assets/php/logout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.ok) window.location.reload();
    else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
};

const updateNote = (id, title, content, color, hidden, category, link) => {
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
  if (link === null) {
    document.querySelector('#check-hidden').disabled = false;
    if (hidden === '1') document.querySelector('#check-hidden').checked = true;
  } else document.querySelector('#check-hidden').disabled = true;
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

const deleteNote = (e) => {
  if (Number.isNaN(e)) return;
  document.querySelectorAll('.note').forEach((note) => note.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  let message = '';
  if (localStorage.getItem('language') === 'fr') message = 'Êtes-vous sûr de vouloir supprimer cette note ?';
  else if (localStorage.getItem('language') === 'de') message = 'Möchten Sie diese Notiz wirklich löschen?';
  else if (localStorage.getItem('language') === 'es') message = '¿Estás seguro que quieres eliminar esta nota?';
  else message = 'Do you really want to delete this note?';
  if (window.confirm(message)) fetchDelete(e);
};

document.querySelectorAll('#icon-add, #icon-float-add').forEach((e) => {
  e.addEventListener('click', () => {
    noteBox.showModal();
    document.querySelector('#textarea-length').textContent = '0/5000';
    document.querySelector('#check-hidden').disabled = false;
  });
});

document.querySelector('#control-back').addEventListener('click', () => document.execCommand('undo'));
document.querySelector('#control-back').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') e.click();
});

document.querySelector('#control-forward').addEventListener('click', () => document.execCommand('redo'));
document.querySelector('#control-forward').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') e.click();
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

document.querySelector('#manage-account').addEventListener('click', () => {
  popupBoxManage.showModal();
});

document.querySelector('#settings').addEventListener('click', () => {
  popupBoxSettings.showModal();
  sidebar.classList.remove('show');
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

document.querySelector('#new-version .fa-xmark').addEventListener('click', () => {
  document.querySelector('#new-version').style.display = 'none';
  localStorage.setItem('version', 'hide');
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

document.querySelector('#copy-note-link-btn').addEventListener('click', () => {
  const link = document.querySelector('#copy-note-link').textContent;
  navigator.clipboard.writeText(link);
});

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#log-out').addEventListener('click', () => fetchLogout());
document.querySelector('#btn-sort').addEventListener('click', () => sortBox.showModal());
document.querySelector('#btn-filter').addEventListener('click', () => filterBox.showModal());
document.querySelector('#submit-gen-psswd').addEventListener('click', () => getPassword(16));
forms.forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()));

document.querySelector('#copy-password-btn').addEventListener('click', () => {
  const psswd = document.querySelector('#psswd-gen').textContent;
  navigator.clipboard.writeText(psswd);
});

document.querySelectorAll('input[name="sort-notes"]').forEach((e) => {
  if (e.value === localStorage.getItem('sort_notes')) e.checked = true;
});

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

document.querySelector('#add-note').addEventListener('submit', async () => {
  try {
    const idNote = document.querySelector('#id-note').value;
    const title = titleNote.value.trim();
    const content = contentNote.value.trim();
    const color = document.querySelector('#colors .selected').classList[0];
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hidden = document.querySelector('#check-hidden').checked ? '1' : '0';
    const category = document.querySelector('input[name="category"]:checked').value;

    if (!title || title.length > 30 || content.length > 5000 || !color) return;
    if (isUpdate && !idNote) return;
    if (idNote && Number.isNaN(idNote)) return;
    if (!/^[0-9]+$/.test(category)) return;

    const cleanContent = DOMPurify.sanitize(content, {
      SANITIZE_NAMED_PROPS: true,
    });

    const data = isUpdate ? `noteId=${idNote}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(cleanContent)}&color=${color}&date=${date}&hidden=${hidden}&category=${category}&csrf_token=${csrfToken}` : `title=${encodeURIComponent(title)}&content=${encodeURIComponent(cleanContent)}&color=${color}&date=${date}&hidden=${hidden}&category=${category}&csrf_token=${csrfToken}`;
    const url = isUpdate ? './assets/php/updateNote.php' : './assets/php/addNote.php';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (response.ok) {
      isUpdate = false;
      noteBox.close();
      await showNotes();
    } else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#change-psswd').addEventListener('submit', async () => {
  const a = document.querySelector('#old-psswd').value;
  const e = document.querySelector('#new-psswd').value;
  const t = document.querySelector('#new-psswd-valid').value;
  if (!a || !e || !t || e.length < 8 || e.length > 50) return;
  if (/^[0-9]+$/.test(e)) {
    showError('Password too weak (only numbers)...');
    return;
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    showError('Password too weak (only letters)...');
    return;
  }
  if (e !== t) {
    showError('Passwords do not match...');
    return;
  }
  const psswdOld = encodeURIComponent(a);
  const psswdNew = encodeURIComponent(e);
  try {
    const response = await fetch('./assets/php/updatePsswd.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `psswdOld=${psswdOld}&psswdNew=${psswdNew}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      popupBoxManage.close();
      showSuccess('Successfully changed password!');
      forms.forEach((form) => form.reset());
    } else {
      showError('An error occurred...');
      forms.forEach((form) => form.reset());
    }
  } catch (error) {
    showError('An error occurred...');
    forms.forEach((form) => form.reset());
  }
});

document.querySelector('#delete-account').addEventListener('submit', async () => {
  const psswd = document.querySelector('#delete-psswd').value;
  if (!psswd || psswd.length < 8) return;
  try {
    const response = await fetch('./assets/php/deleteAccount.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `psswd=${encodeURIComponent(psswd)}&csrf_token=${csrfToken}`,
    });
    if (response.ok) window.location.reload();
    else {
      showError('An error occurred...');
      forms.forEach((form) => form.reset());
    }
  } catch (error) {
    showError('An error occurred...');
    forms.forEach((form) => form.reset());
  }
});

document.querySelector('#private-note').addEventListener('submit', async () => {
  const id = document.querySelector('#id-note-private').value;
  const link = document.querySelector('#link-note-private').value;
  if (!id || !link || Number.isNaN(id) || !/^[a-zA-Z0-9]+$/.test(link)) return;
  try {
    const response = await fetch('./assets/php/privateNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${id}&noteLink=${link}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      publicNote.close();
      await showNotes();
    } else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#public-note').addEventListener('submit', async () => {
  const id = document.querySelector('#id-note-public').value;
  if (!id || Number.isNaN(id)) return;
  const link = window.crypto.getRandomValues(new Uint8Array(10)).reduce((p, i) => p + (i % 36).toString(36), '');
  try {
    const response = await fetch('./assets/php/publicNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${id}&noteLink=${link}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      privateNote.close();
      await showNotes();
    } else showError('An error occurred...');
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
