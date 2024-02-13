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
const sideBar = document.querySelector('#sideBar');
const metaTheme = document.querySelectorAll('.themecolor');
const buttonTheme = document.querySelector('#iconTheme');

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
if (localStorage.getItem('accent_color') === 'pink') {
  document.querySelector('body').classList = 'accentPink';
  document.querySelector('#accent-colors .accentPinkSpan').classList.add('selected');
} else if (localStorage.getItem('accent_color') === 'green') {
  document.querySelector('body').classList = 'accentGreen';
  document.querySelector('#accent-colors .accentGreenSpan').classList.add('selected');
} else if (localStorage.getItem('accent_color') === 'yellow') {
  document.querySelector('body').classList = 'accentYellow';
  document.querySelector('#accent-colors .accentYellowSpan').classList.add('selected');
} else {
  document.querySelector('body').classList = 'accentBlue';
  document.querySelector('#accent-colors .accentBlueSpan').classList.add('selected');
}
if (localStorage.getItem('version') === 'hide') document.querySelector('#newVersion').style.display = 'none';
if (localStorage.getItem('sort_notes') === null) localStorage.setItem('sort_notes', '3');

function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

function getPassword(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&~"#\'(-_)=^$€*!?,.;:/|\\@%+{}[]<>`';
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i += 1) password += chars[array[i] % chars.length];
  document.querySelector('#psswdGen').textContent = password;
  document.querySelector('#newPsswd').value = password;
  document.querySelector('#newPsswdValid').value = password;
}

function changeLanguage(language) {
  if (language === 'fr') {
    document.documentElement.setAttribute('lang', 'fr-FR');
    document.querySelector('#language').value = 'fr';
    document.querySelector('#iconAdd').textContent = 'Ajouter une note';
    document.querySelector('#newVersionInfos').textContent = 'Bloc-notes à été mis à jour !';
    document.querySelector('#legal a').textContent = 'Mentions légales / confidentialité';
    document.querySelector('#sort-popup-box legend').textContent = 'Trier les notes';
    document.querySelector('#sortNotes1Span').textContent = 'Date de création';
    document.querySelector('#sortNotes2Span').textContent = 'Date de création (Z-A)';
    document.querySelector('#sortNotes3Span').textContent = 'Date de modification';
    document.querySelector('#sortNotes4Span').textContent = 'Date de modification (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrer les notes par catégorie';
    document.querySelectorAll('.noCatFilterSpan').forEach((e) => {
      e.textContent = '❌';
    });
    document.querySelectorAll('.catPersoFilterSpan').forEach((e) => {
      e.textContent = '👤Perso';
    });
    document.querySelectorAll('.catProFilterSpan').forEach((e) => {
      e.textContent = '💼Travail';
    });
    document.querySelectorAll('.catVoyageFilterSpan').forEach((e) => {
      e.textContent = '🏖️Voyage';
    });
    document.querySelectorAll('.catTaskFilterSpan').forEach((e) => {
      e.textContent = '📓Tâches';
    });
    document.querySelectorAll('.catRappelFilterSpan').forEach((e) => {
      e.textContent = '🕰️Rappel';
    });
    document.querySelectorAll('.catIdeesFilterSpan').forEach((e) => {
      e.textContent = '💡Idées';
    });
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titre');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenu (Texte brut, Markdown ou HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Enregistrer';
    document.querySelector('#export-all-notes').textContent = 'Exporter toutes les notes';
    document.querySelector('#linkMarkdown').textContent = 'Guide Markdown';
    document.querySelector('#linkHelp').textContent = 'Aide et discussions';
    document.querySelector('#log-out').textContent = 'Déconnexion';
    document.querySelector('#oldPsswd').setAttribute('placeholder', 'Ancien mot de passe');
    document.querySelector('#newPsswd').setAttribute('placeholder', 'Nouveau mot de passe');
    document.querySelector('#newPsswdValid').setAttribute('placeholder', 'Confirmer le mot de passe');
    document.querySelector('#changePsswd button[type="submit"]').textContent = 'Changer le mot de passe';
    document.querySelector('#genPsswd summary').textContent = 'Changer le mot de passe';
    document.querySelector('#deleteUser summary').textContent = 'Supprimer le compte';
    document.querySelector('#deletePsswd').setAttribute('placeholder', 'Mot de passe');
    document.querySelector('#deleteUser button').textContent = 'Supprimer le compte';
    document.querySelector('#privateNote span').textContent = 'Voulez-vous rendre votre note privée ? Le lien ne sera plus disponible.';
    document.querySelector('#privateNote button').textContent = 'Rendre privée';
    document.querySelector('#publicNote span').textContent = 'Voulez-vous rendre votre note publique ? Un lien sera disponible pour la partager.';
    document.querySelector('#publicNote button').textContent = 'Rendre publique';
  } else if (language === 'de') {
    document.documentElement.setAttribute('lang', 'de');
    document.querySelector('#language').value = 'de';
    document.querySelector('#iconAdd').textContent = 'Notiz hinzufügen';
    document.querySelector('#newVersionInfos').textContent = 'Bloc-notes wurde aktualisiert!';
    document.querySelector('#legal a').textContent = 'Impressum / Datenschutz';
    document.querySelector('#sort-popup-box legend').textContent = 'Notizen sortieren';
    document.querySelector('#sortNotes1Span').textContent = 'Erstellungsdatum';
    document.querySelector('#sortNotes2Span').textContent = 'Erstellungsdatum (Z-A)';
    document.querySelector('#sortNotes3Span').textContent = 'Änderungsdatum';
    document.querySelector('#sortNotes4Span').textContent = 'Änderungsdatum (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Notizen filtern nach Kategorie';
    document.querySelectorAll('.noCatFilterSpan').forEach((e) => {
      e.textContent = '❌';
    });
    document.querySelectorAll('.catPersoFilterSpan').forEach((e) => {
      e.textContent = '👤Persönlich';
    });
    document.querySelectorAll('.catProFilterSpan').forEach((e) => {
      e.textContent = '💼Arbeit';
    });
    document.querySelectorAll('.catVoyageFilterSpan').forEach((e) => {
      e.textContent = '🏖️Reise';
    });
    document.querySelectorAll('.catTaskFilterSpan').forEach((e) => {
      e.textContent = '📓Aufgaben';
    });
    document.querySelectorAll('.catRappelFilterSpan').forEach((e) => {
      e.textContent = '🕰️Erinnerung';
    });
    document.querySelectorAll('.catIdeesFilterSpan').forEach((e) => {
      e.textContent = '💡Ideen';
    });
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titel');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Inhalt (Rohtext, Markdown oder HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Speichern';
    document.querySelector('#export-all-notes').textContent = 'Alle Notizen exportieren';
    document.querySelector('#linkMarkdown').textContent = 'Markdown-Anleitung';
    document.querySelector('#linkHelp').textContent = 'Hilfe und Diskussionen';
    document.querySelector('#log-out').textContent = 'Abmelden';
    document.querySelector('#oldPsswd').setAttribute('placeholder', 'Altes Passwort');
    document.querySelector('#newPsswd').setAttribute('placeholder', 'Neues Passwort');
    document.querySelector('#newPsswdValid').setAttribute('placeholder', 'Passwort bestätigen');
    document.querySelector('#changePsswd button[type="submit"]').textContent = 'Passwort ändern';
    document.querySelector('#genPsswd summary').textContent = 'Passwort ändern';
    document.querySelector('#deleteUser summary').textContent = 'Konto löschen';
    document.querySelector('#deletePsswd').setAttribute('placeholder', 'Passwort');
    document.querySelector('#deleteUser button').textContent = 'Konto löschen';
    document.querySelector('#privateNote span').textContent = 'Möchten Sie Ihre Notiz privat machen? Der Link wird nicht mehr verfügbar sein.';
    document.querySelector('#privateNote button').textContent = 'Privat machen';
    document.querySelector('#publicNote span').textContent = 'Möchten Sie Ihre Notiz öffentlich machen? Ein Link wird verfügbar sein, um es zu teilen.';
    document.querySelector('#publicNote button').textContent = 'Öffentlich machen';
  } else if (language === 'es') {
    document.documentElement.setAttribute('lang', 'es');
    document.querySelector('#language').value = 'es';
    document.querySelector('#iconAdd').textContent = 'Agregar una nota';
    document.querySelector('#newVersionInfos').textContent = '¡Bloc-notes ha sido actualizado!';
    document.querySelector('#legal a').textContent = 'Aviso legal / privacidad';
    document.querySelector('#sort-popup-box legend').textContent = 'Ordenar notas';
    document.querySelector('#sortNotes1Span').textContent = 'Fecha de creación';
    document.querySelector('#sortNotes2Span').textContent = 'Fecha de creación (Z-A)';
    document.querySelector('#sortNotes3Span').textContent = 'Fecha de modificación';
    document.querySelector('#sortNotes4Span').textContent = 'Fecha de modificación (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrar notas por categoría';
    document.querySelectorAll('.noCatFilterSpan').forEach((e) => {
      e.textContent = '❌';
    });
    document.querySelectorAll('.catPersoFilterSpan').forEach((e) => {
      e.textContent = '👤Personal';
    });
    document.querySelectorAll('.catProFilterSpan').forEach((e) => {
      e.textContent = '💼Trabajo';
    });
    document.querySelectorAll('.catVoyageFilterSpan').forEach((e) => {
      e.textContent = '🏖️Viaje';
    });
    document.querySelectorAll('.catTaskFilterSpan').forEach((e) => {
      e.textContent = '📓Tareas';
    });
    document.querySelectorAll('.catRappelFilterSpan').forEach((e) => {
      e.textContent = '🕰️Recordatorio';
    });
    document.querySelectorAll('.catIdeesFilterSpan').forEach((e) => {
      e.textContent = '💡Ideas';
    });
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Título');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenido (Texto sin formato, Markdown o HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Guardar';
    document.querySelector('#export-all-notes').textContent = 'Exportar todas las notas';
    document.querySelector('#linkMarkdown').textContent = 'Guía de Markdown';
    document.querySelector('#linkHelp').textContent = 'Ayuda y discusiones';
    document.querySelector('#log-out').textContent = 'Cerrar sesión';
    document.querySelector('#oldPsswd').setAttribute('placeholder', 'Contraseña antigua');
    document.querySelector('#newPsswd').setAttribute('placeholder', 'Nueva contraseña');
    document.querySelector('#newPsswdValid').setAttribute('placeholder', 'Confirmar contraseña');
    document.querySelector('#changePsswd button[type="submit"]').textContent = 'Cambiar contraseña';
    document.querySelector('#genPsswd summary').textContent = 'Cambiar contraseña';
    document.querySelector('#deleteUser summary').textContent = 'Eliminar cuenta';
    document.querySelector('#deletePsswd').setAttribute('placeholder', 'Contraseña');
    document.querySelector('#deleteUser button').textContent = 'Eliminar cuenta';
    document.querySelector('#privateNote span').textContent = '¿Quieres hacer tu nota privada? El enlace ya no estará disponible.';
    document.querySelector('#privateNote button').textContent = 'Hacer privado';
    document.querySelector('#publicNote span').textContent = '¿Quieres hacer tu nota pública? Un enlace estará disponible para compartirlo.';
    document.querySelector('#publicNote button').textContent = 'Hacer público';
  } else {
    document.documentElement.setAttribute('lang', 'en');
    document.querySelector('#language').value = 'en';
    document.querySelector('#iconAdd').textContent = 'Add a note';
    document.querySelector('#newVersionInfos').textContent = 'Bloc-notes has been updated!';
    document.querySelector('#legal a').textContent = 'Legal notice / privacy';
    document.querySelector('#sort-popup-box legend').textContent = 'Sort notes';
    document.querySelector('#sortNotes1Span').textContent = 'Creation date';
    document.querySelector('#sortNotes2Span').textContent = 'Creation date (Z-A)';
    document.querySelector('#sortNotes3Span').textContent = 'Modification date';
    document.querySelector('#sortNotes4Span').textContent = 'Modification date (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filter notes by category';
    document.querySelectorAll('.noCatFilterSpan').forEach((e) => {
      e.textContent = '❌';
    });
    document.querySelectorAll('.catPersoFilterSpan').forEach((e) => {
      e.textContent = '👤Personal';
    });
    document.querySelectorAll('.catProFilterSpan').forEach((e) => {
      e.textContent = '💼Work';
    });
    document.querySelectorAll('.catVoyageFilterSpan').forEach((e) => {
      e.textContent = '🏖️Travel';
    });
    document.querySelectorAll('.catTaskFilterSpan').forEach((e) => {
      e.textContent = '📓Tasks';
    });
    document.querySelectorAll('.catRappelFilterSpan').forEach((e) => {
      e.textContent = '🕰️Reminder';
    });
    document.querySelectorAll('.catIdeesFilterSpan').forEach((e) => {
      e.textContent = '💡Ideas';
    });
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Title');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Content (Raw text, Markdown or HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Save';
    document.querySelector('#export-all-notes').textContent = 'Export all notes';
    document.querySelector('#linkMarkdown').textContent = 'Markdown guide';
    document.querySelector('#linkHelp').textContent = 'Help and discussions';
    document.querySelector('#log-out').textContent = 'Log out';
    document.querySelector('#oldPsswd').setAttribute('placeholder', 'Old password');
    document.querySelector('#newPsswd').setAttribute('placeholder', 'New password');
    document.querySelector('#newPsswdValid').setAttribute('placeholder', 'Confirm password');
    document.querySelector('#changePsswd button[type="submit"]').textContent = 'Change password';
    document.querySelector('#genPsswd summary').textContent = 'Change password';
    document.querySelector('#deleteUser summary').textContent = 'Delete account';
    document.querySelector('#deletePsswd').setAttribute('placeholder', 'Password');
    document.querySelector('#deleteUser button').textContent = 'Delete account';
    document.querySelector('#privateNote span').textContent = 'Do you want to make your note private? The link will no longer be available.';
    document.querySelector('#privateNote button').textContent = 'Make private';
    document.querySelector('#publicNote span').textContent = 'Do you want to make your note public? A link will be available to share it.';
    document.querySelector('#publicNote button').textContent = 'Make public';
  }
}

const verifyFingerprint = async () => {
  try {
    const challenge = generateRandomBytes(32);
    const userId = generateRandomBytes(16);
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
    } else document.querySelector('#checkFingerprint').checked = false;
  }
};

if (localStorage.getItem('fingerprint') === 'true') {
  verifyFingerprint();
  document.querySelector('#checkFingerprint').checked = true;
}

const showSuccess = (message) => {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelector('#successNotification');
  notification.textContent = message;
  notification.style.display = 'block';
  timeoutNotification = setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
};

const showError = (message) => {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelector('#errorNotification');
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
    privateNote.classList.add('show');
    document.querySelector('#idNotePublic').value = id;
    privateNote.querySelector('i').focus();
  } else {
    publicNote.classList.add('show');
    document.querySelector('#idNotePrivate').value = id;
    document.querySelector('#linkNotePrivate').value = link;
    document.querySelector('#copyNoteLink').textContent = link;
    publicNote.querySelector('i').focus();
  }
};

const searchSideBar = () => {
  sideBar.querySelectorAll('#listNotes p').forEach((e) => {
    e.addEventListener('click', () => {
      const titleList = e.querySelector('.titleList').textContent;
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

const openSidebar = () => sideBar.classList.add('show');
const closeSidebar = () => sideBar.classList.remove('show');
const handleGesture = () => {
  if (touchendX - touchstartX > 75 && !sideBar.classList.contains('show')) openSidebar();
  else if (touchendX - touchstartX < -75 && sideBar.classList.contains('show')) closeSidebar();
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

// eslint-disable-next-line no-undef
const converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('tasklists', true);
converter.setOption('strikethrough', true);
converter.setOption('parseImgDimensions', true);
converter.setOption('simpleLineBreaks', true);
converter.setOption('simplifiedAutoLink', true);

const showNotes = async () => {
  const sortOption = localStorage.getItem('sort_notes');
  if (Number.isNaN(sortOption)) return;
  document.querySelectorAll('#listNotes *').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());
  forms.forEach((form) => form.reset());

  const response = await fetch('/seguinleo-notes/assets/php/getNotes.php', {
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
  sideBar.querySelector('#listNotes').appendChild(numberOfNotesElement);

  const fragment = document.createDocumentFragment();

  notesJSON.forEach((row) => {
    const {
      id, title, content, color, date, hidden, category, link,
    } = row;

    if (!id || !title || !color || !date) return;

    const contentHtml = converter.makeHtml(content);
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
    contentElement.classList.add('detailsContent');

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
    titleSpan.classList.add('titleList');
    titleSpan.textContent = title;
    if (link !== null) {
      noteElement.setAttribute('data-note-link', link);
      titleSpan.appendChild(document.createElement('i'));
      titleSpan.querySelector('i').classList.add('fa-solid', 'fa-link');
    }
    dateSpan.classList.add('dateList');
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
    sideBar.querySelector('#listNotes').appendChild(paragraph);
  });

  document.querySelector('main').appendChild(fragment);
  searchSideBar();
  noteActions();
  document.querySelector('#last-sync span').textContent = new Date().toLocaleTimeString();
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
  document.body.classList.toggle('body-fullscreen');
};

const fetchDelete = async (id) => {
  try {
    const response = await fetch('/seguinleo-notes/assets/php/deleteNote.php', {
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
    const response = await fetch('/seguinleo-notes/assets/php/logout.php', {
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
  document.querySelector('#iconAdd').click();
  document.querySelector('#idNote').value = id;
  titleNote.value = title;
  contentNote.value = content;
  colors.forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selected');
    else e.classList.remove('selected');
  });
  document.querySelector(`input[name="category"][value="${category}"]`).checked = true;
  if (link === null) {
    document.querySelector('#checkHidden').disabled = false;
    if (hidden === '1') document.querySelector('#checkHidden').checked = true;
  } else document.querySelector('#checkHidden').disabled = true;
  document.querySelector('#textareaLength').textContent = `${contentNote.value.length}/5000`;
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

document.querySelectorAll('#iconAdd, #iconFloatAdd').forEach((e) => {
  e.addEventListener('click', () => {
    noteBox.classList.add('show');
    titleNote.focus();
    document.querySelector('#textareaLength').textContent = '0/5000';
    document.querySelector('#checkHidden').disabled = false;
  });
});

document.querySelector('#checkFingerprint').addEventListener('change', () => {
  if (document.querySelector('#checkFingerprint').checked) verifyFingerprint();
  else localStorage.removeItem('fingerprint');
});

document.querySelectorAll('.manage-account').forEach((e) => {
  e.addEventListener('click', () => {
    popupBoxManage.classList.add('show');
    popupBoxManage.querySelector('i').focus();
  });
});

document.querySelectorAll('#settings').forEach((e) => {
  e.addEventListener('click', () => {
    popupBoxSettings.classList.add('show');
    popupBoxSettings.querySelector('i').focus();
    sideBar.classList.remove('show');
  });
});

document.querySelectorAll('.linkp').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelectorAll('.fa-xmark').forEach((e) => {
  e.addEventListener('click', () => {
    isUpdate = false;
    forms.forEach((form) => form.reset());
    noteBox.classList.remove('show');
    popupBoxManage.classList.remove('show');
    publicNote.classList.remove('show');
    privateNote.classList.remove('show');
    sortBox.classList.remove('show');
    filterBox.classList.remove('show');
    popupBoxSettings.classList.remove('show');
  });
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#search-input').addEventListener('input', () => {
  const searchValue = document.querySelector('#search-input').value.trim().toLowerCase();
  document.querySelectorAll('.note').forEach((e) => {
    const title = e.querySelector('.note h2').textContent.toLowerCase();
    if (title.includes(searchValue)) e.style.display = 'flex';
    else e.style.display = 'none';
  });
});

document.querySelector('#btnTheme').addEventListener('click', () => {
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

document.querySelector('#newVersion .fa-xmark').addEventListener('click', () => {
  document.querySelector('#newVersion').style.display = 'none';
  localStorage.setItem('version', 'hide');
});

document.querySelector('#export-all-notes').addEventListener('click', () => {
  if (document.querySelector('.note') === null) return;
  const notes = [];
  document.querySelectorAll('.note').forEach((e) => {
    const title = e.querySelector('.title').textContent;
    const content = e.querySelector('.detailsContent').textContent;
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
  document.querySelector('#textareaLength').textContent = `${e}/5000`;
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
    if (span.classList.contains('accentPinkSpan')) {
      document.querySelector('body').classList = 'accentPink';
      localStorage.setItem('accent_color', 'pink');
    } else if (span.classList.contains('accentGreenSpan')) {
      document.querySelector('body').classList = 'accentGreen';
      localStorage.setItem('accent_color', 'green');
    } else if (span.classList.contains('accentYellowSpan')) {
      document.querySelector('body').classList = 'accentYellow';
      localStorage.setItem('accent_color', 'yellow');
    } else {
      document.querySelector('body').classList = 'accentBlue';
      localStorage.setItem('accent_color', 'blue');
    }
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
});

document.querySelector('#copyNoteLinkBtn').addEventListener('click', () => {
  const link = document.querySelector('#copyNoteLink').textContent;
  navigator.clipboard.writeText(`localhost/seguinleo-notes/share/${link}`);
});

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#log-out').addEventListener('click', () => fetchLogout());
document.querySelector('#btnSort').addEventListener('click', () => sortBox.classList.add('show'));
document.querySelector('#btnFilter').addEventListener('click', () => filterBox.classList.add('show'));
document.querySelector('#submitGenPsswd').addEventListener('click', () => getPassword(16));
forms.forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()));

document.querySelector('#copyPasswordBtn').addEventListener('click', () => {
  const psswd = document.querySelector('#psswdGen').textContent;
  navigator.clipboard.writeText(psswd);
});

document.querySelectorAll('input[name="sortNotes"]').forEach((e) => {
  if (e.value === localStorage.getItem('sort_notes')) e.checked = true;
});

document.querySelectorAll('input[name="sortNotes"]').forEach(async (e) => {
  e.addEventListener('change', async () => {
    if (e.value === '1' || e.value === '2' || e.value === '3' || e.value === '4') {
      localStorage.setItem('sort_notes', e.value);
      await showNotes();
    }
  });
});

document.querySelectorAll('input[name="filterNotes"]').forEach((e) => {
  e.addEventListener('change', () => {
    const categories = [];
    document.querySelectorAll('input[name="filterNotes"]:checked').forEach((t) => categories.push(t.value));
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

document.querySelectorAll('.switch').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#addNote').addEventListener('submit', async () => {
  try {
    const idNote = document.querySelector('#idNote').value;
    const titleBrut = titleNote.value.trim();
    // eslint-disable-next-line no-undef
    const contentBrut = DOMPurify.sanitize(contentNote.value.trim(), {
      SANITIZE_NAMED_PROPS: true,
    });
    const title = encodeURIComponent(titleBrut);
    const content = encodeURIComponent(contentBrut);
    const color = document.querySelector('#colors .selected').classList[0];
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hidden = document.querySelector('#checkHidden').checked ? '1' : '0';
    const category = document.querySelector('input[name="category"]:checked').value;

    if (!titleBrut || titleBrut.length > 30 || contentBrut.length > 5000) return;
    if (isUpdate && !idNote) return;
    if (idNote && Number.isNaN(idNote)) return;
    if (!/^[a-zA-Z]+$/.test(color)) return;
    if (!/^[0-9]+$/.test(category)) return;

    const data = isUpdate ? `noteId=${idNote}&title=${title}&content=${content}&color=${color}&date=${date}&hidden=${hidden}&category=${category}&csrf_token=${csrfToken}` : `title=${title}&content=${content}&color=${color}&date=${date}&hidden=${hidden}&category=${category}&csrf_token=${csrfToken}`;
    const url = isUpdate ? '/seguinleo-notes/assets/php/updateNote.php' : '/seguinleo-notes/assets/php/addNote.php';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (response.ok) {
      isUpdate = false;
      noteBox.classList.remove('show');
      await showNotes();
    } else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#changePsswd').addEventListener('submit', async () => {
  const a = document.querySelector('#oldPsswd').value;
  const e = document.querySelector('#newPsswd').value;
  const t = document.querySelector('#newPsswdValid').value;
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
    const response = await fetch('/seguinleo-notes/assets/php/updatePsswd.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `psswdOld=${psswdOld}&psswdNew=${psswdNew}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      popupBoxManage.classList.remove('show');
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

document.querySelector('#deleteAccount').addEventListener('submit', async () => {
  const psswd = document.querySelector('#deletePsswd').value;
  if (!psswd || psswd.length < 8) return;
  try {
    const response = await fetch('/seguinleo-notes/assets/php/deleteAccount.php', {
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

document.querySelector('#privateNote').addEventListener('submit', async () => {
  const id = document.querySelector('#idNotePrivate').value;
  const link = document.querySelector('#linkNotePrivate').value;
  if (!id || !link || Number.isNaN(id) || !/^[a-zA-Z0-9]+$/.test(link)) return;
  try {
    const response = await fetch('/seguinleo-notes/assets/php/privateNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${id}&noteLink=${link}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      publicNote.classList.remove('show');
      await showNotes();
    } else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#publicNote').addEventListener('submit', async () => {
  const id = document.querySelector('#idNotePublic').value;
  if (!id || Number.isNaN(id)) return;
  const link = window.crypto.getRandomValues(new Uint8Array(10)).reduce((p, i) => p + (i % 36).toString(36), '');
  try {
    const response = await fetch('/seguinleo-notes/assets/php/publicNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${id}&noteLink=${link}&csrf_token=${csrfToken}`,
    });
    if (response.ok) {
      privateNote.classList.remove('show');
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
