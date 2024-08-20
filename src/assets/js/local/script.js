/* global DOMPurify, marked */

import * as defaultScript from '../default.js';
import '../marked.min.js';
import '../purify.min.js';

let isUpdate = false;
const notesJSON = JSON.parse(localStorage.getItem('local_notes') || '[]');

function changeLanguage(language) {
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
    document.querySelector('#spellcheck-slider span').textContent = 'Vérif. ortho.';
    document.querySelector('#compact-slider span').textContent = 'Mode compact';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Masquer bouton sidebar';
    document.querySelector('#lock-app-slider span').textContent = 'Vérouiller app';
    document.querySelector('#hide-infos').textContent = 'Masquer le contenu';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titre');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenu (Texte brut, Markdown ou HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Choisir un dossier';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Enregistrer';
    document.querySelector('#folder-popup-box button').textContent = 'Créer';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Nom du dossier');
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
    document.querySelector('#create-form button[type="submit"]').textContent = 'Créer mon compte';
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
    document.querySelector('#spellcheck-slider span').textContent = 'Rechtschreibprüfung';
    document.querySelector('#compact-slider span').textContent = 'Kompaktmodus';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Seitenleiste ausblenden';
    document.querySelector('#lock-app-slider span').textContent = 'App sperren';
    document.querySelector('#hide-infos').textContent = 'Inhalt ausblenden';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titel');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Inhalt (Rohtext, Markdown oder HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Ordner auswählen';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Speichern';
    document.querySelector('#folder-popup-box button').textContent = 'Erstellen';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Ordnername');
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
    document.querySelector('#create-form button[type="submit"]').textContent = 'Mein Konto erstellen';
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
    document.querySelector('#spellcheck-slider span').textContent = 'Corrector ortográfico';
    document.querySelector('#compact-slider span').textContent = 'Modo compacto';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Ocultar barra lateral';
    document.querySelector('#lock-app-slider span').textContent = 'Bloquear aplicación';
    document.querySelector('#hide-infos').textContent = 'Ocultar contenido';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Título');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenido (Texto sin formato, Markdown o HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Elegir una carpeta';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Guardar';
    document.querySelector('#folder-popup-box button').textContent = 'Crear';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Nombre de la carpeta');
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
    document.querySelector('#create-form button[type="submit"]').textContent = 'Crear mi cuenta';
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
    document.querySelector('#spellcheck-slider span').textContent = 'Spell check';
    document.querySelector('#compact-slider span').textContent = 'Compact mode';
    document.querySelector('#hide-sidebar-slider span').textContent = 'Hide sidebar button';
    document.querySelector('#lock-app-slider span').textContent = 'Lock app';
    document.querySelector('#hide-infos').textContent = 'Hide content';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Title');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Content (Raw text, Markdown or HTML)');
    document.querySelector('#note-popup-box #folders option[value=""]').textContent = 'Choose a folder';
    document.querySelector('#note-popup-box button[type="submit"]').textContent = 'Save';
    document.querySelector('#folder-popup-box button').textContent = 'Create';
    document.querySelector('#folder-popup-box input').setAttribute('placeholder', 'Folder name');
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
    document.querySelector('#create-form button[type="submit"]').textContent = 'Create my account';
  }
}

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
      const noteFolder = target.closest('.note').getAttribute('data-note-folder');
      if (target.classList.contains('edit-note')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteCategory, noteFolder);
      else if (target.classList.contains('pin-note')) pin(noteId);
      else if (target.classList.contains('copy-note')) defaultScript.copy(noteContent);
      else if (target.classList.contains('delete-note')) deleteNote(noteId);
      else if (target.classList.contains('expand-note')) defaultScript.toggleFullscreen(noteId);
      else if (target.classList.contains('download-note')) defaultScript.downloadNote(noteId);
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

const getNotes = async () => {
  if (defaultScript.isLocked) return;
  const sort = localStorage.getItem('sort_notes');
  document.querySelector(`input[name="sort-notes"][value="${sort}"]`).checked = true;
  document.querySelectorAll('#list-notes *').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());

  if (notesJSON.length === 0) {
    const numberOfNotesElement = document.createElement('h2');
    if (localStorage.getItem('lang') === 'de') numberOfNotesElement.textContent = 'Notizen (0)';
    else if (localStorage.getItem('lang') === 'es') numberOfNotesElement.textContent = 'Notas (0)';
    else numberOfNotesElement.textContent = 'Notes (0)';
    document.querySelector('#sidebar #list-notes').appendChild(numberOfNotesElement);
    return;
  }

  try {
    const numberOfNotesElement = document.createElement('h2');
    if (localStorage.getItem('lang') === 'de') numberOfNotesElement.textContent = `Notizen (${notesJSON.length})`;
    else if (localStorage.getItem('lang') === 'es') numberOfNotesElement.textContent = `Notas (${notesJSON.length})`;
    else numberOfNotesElement.textContent = `Notes (${notesJSON.length})`;
    document.querySelector('#sidebar #list-notes').appendChild(numberOfNotesElement);
    const folders = document.querySelector('#folders');
    for (let i = folders.options.length - 1; i >= 0; i -= 1) {
      if (folders.options[i].value !== '') folders.remove(i);
    }

    const dbName = 'notes_db';
    const objectStoreName = 'key';
    const db = await openIndexedDB(dbName, objectStoreName);
    const key = await getKeyFromDB(db, objectStoreName);

    if (sort === '1') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return b.date.localeCompare(a.date);
      });
    } else if (sort === '2') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return a.date.localeCompare(b.date);
      });
    } else if (sort === '3') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return a.title.localeCompare(b.title);
      });
    } else if (sort === '4') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return b.title.localeCompare(a.title);
      });
    }

    const fragment = document.createDocumentFragment();
    const allFolders = new Set();

    const promises = notesJSON.map(async (row, id) => {
      const {
        title, content, color, date, hidden, pinned, category, folder,
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
      const bottomContentElement = document.createElement('div');
      bottomContentElement.classList.add('bottom-content');

      const paragraph = document.createElement('p');

      if (folder) {
        allFolders.add(folder);
        paragraph.setAttribute('data-folder', folder);
      }

      const noteElement = document.createElement('div');
      noteElement.classList.add('note', color);
      noteElement.setAttribute('data-note-id', id);
      noteElement.setAttribute('data-note-title', deTitleString);
      noteElement.setAttribute('data-note-content', deContentString);
      noteElement.setAttribute('data-note-color', color);
      noteElement.setAttribute('data-note-hidden', hidden);
      noteElement.setAttribute('data-note-category', category);
      noteElement.setAttribute('data-note-folder', folder || '');

      const titleElement = document.createElement('h2');
      titleElement.classList.add('title');
      titleElement.textContent = deTitleString;

      const contentElement = document.createElement('div');
      contentElement.classList.add('details-content');
      if (hidden === 0) contentElement.innerHTML = marked.parse(deContentString);
      else contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

      const detailsElement = document.createElement('div');
      detailsElement.classList.add('details');
      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(contentElement);

      const editIconElement = document.createElement('i');
      editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action', 'edit-note');
      editIconElement.tabIndex = 0;
      editIconElement.setAttribute('role', 'button');
      editIconElement.setAttribute('aria-label', 'Edit note');
      bottomContentElement.appendChild(editIconElement);

      const pinElement = document.createElement('i');
      pinElement.classList.add('fa-solid', 'note-action', 'pin-note');
      if (pinned) pinElement.classList.add('fa-thumbtack-slash');
      else pinElement.classList.add('fa-thumbtack');
      pinElement.tabIndex = 0;
      pinElement.setAttribute('role', 'button');
      pinElement.setAttribute('aria-label', 'Pin note');
      bottomContentElement.appendChild(pinElement);

      const trashIconElement = document.createElement('i');
      trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action', 'delete-note');
      trashIconElement.tabIndex = 0;
      trashIconElement.setAttribute('role', 'button');
      trashIconElement.setAttribute('aria-label', 'Delete note');
      bottomContentElement.appendChild(trashIconElement);

      if (hidden === 0 && deContentString !== '') {
        const clipboardIconElement = document.createElement('i');
        clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action', 'copy-note');
        clipboardIconElement.tabIndex = 0;
        clipboardIconElement.setAttribute('role', 'button');
        clipboardIconElement.setAttribute('aria-label', 'Copy note content');
        bottomContentElement.appendChild(clipboardIconElement);

        const downloadIconElement = document.createElement('i');
        downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action', 'download-note');
        downloadIconElement.tabIndex = 0;
        downloadIconElement.setAttribute('role', 'button');
        downloadIconElement.setAttribute('aria-label', 'Download note');
        bottomContentElement.appendChild(downloadIconElement);

        const expandIconElement = document.createElement('i');
        expandIconElement.classList.add('fa-solid', 'fa-expand', 'note-action', 'expand-note');
        expandIconElement.tabIndex = 0;
        expandIconElement.setAttribute('role', 'button');
        expandIconElement.setAttribute('aria-label', 'Fullscreen note');
        bottomContentElement.appendChild(expandIconElement);
      }

      noteElement.appendChild(detailsElement);
      noteElement.appendChild(bottomContentElement);
      paragraph.setAttribute('tabindex', '0');
      paragraph.setAttribute('role', 'button');

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('title-list');
      titleSpan.textContent = deTitleString;

      const dateSpan = document.createElement('span');
      dateSpan.classList.add('date-list');
      dateSpan.textContent = new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (pinned === 1) {
        noteElement.classList.add('pinned');
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('custom-check');
        const iconPin = document.createElement('i');
        iconPin.classList.add('fa-solid', 'fa-thumbtack');
        categoryElement.appendChild(iconPin);
        paragraph.appendChild(categoryElement);
      }

      if (category !== 0) {
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('custom-check');
        categoryElement.textContent = document.querySelector(`input[name="category"][value="${category}"]`).parentElement.textContent;
        paragraph.appendChild(categoryElement);
      }

      if (hidden !== 0) {
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('custom-check');
        const iconEye = document.createElement('i');
        iconEye.classList.add('fa-solid', 'fa-eye-slash');
        categoryElement.appendChild(iconEye);
        paragraph.appendChild(categoryElement);
      }

      fragment.appendChild(noteElement);
      paragraph.appendChild(titleSpan);
      paragraph.appendChild(dateSpan);
      document.querySelector('#sidebar #list-notes').appendChild(paragraph);
    });

    await Promise.all(promises);

    for (const folder of allFolders) {
      const folderDetails = document.createElement('details');
      folderDetails.setAttribute('open', 'open');
      const summary = document.createElement('summary');
      summary.textContent = folder;
      folderDetails.appendChild(summary);
      const notesForFolder = document.querySelectorAll('#sidebar #list-notes p');
      notesForFolder.forEach((note) => {
        if (note.getAttribute('data-folder') === folder) {
          folderDetails.appendChild(note);
        }
      });
      document.querySelector('#sidebar #list-notes').appendChild(folderDetails);
      const option = document.createElement('option');
      option.value = folder;
      option.textContent = folder;
      document.querySelector('#folders').appendChild(option);
    }

    document.querySelector('main').appendChild(fragment);
    defaultScript.searchSidebar();
    noteActions();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
};

const updateNote = (noteId, title, content, color, hidden, category, folder) => {
  isUpdate = true;
  document.querySelector('#note-popup-box').showModal();
  document.querySelector('#id-note').value = noteId;
  document.querySelector('#note-popup-box #title').value = title;
  document.querySelector('#note-popup-box #content').value = content;
  document.querySelector('#note-popup-box #folders').value = folder;
  document.querySelectorAll('#colors span').forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selected');
    else e.classList.remove('selected');
  });
  document.querySelector(`input[name="category"][value="${category}"]`).checked = true;
  if (parseInt(hidden, 10) === 1) document.querySelector('#check-hidden').checked = true;
  const noteLength = document.querySelector('#note-popup-box #content').value.length;
  document.querySelector('#textarea-length').textContent = `${noteLength}/${defaultScript.maxNoteContent}`;
  document.querySelector('#note-popup-box #content').focus();
};

const pin = async (noteId) => {
  const note = document.querySelector(`.note[data-note-id="${noteId}"]`);
  const pinned = note.classList.contains('pinned');
  if (pinned) note.classList.add('pinned');
  else note.classList.remove('pinned');
  notesJSON[parseInt(noteId, 10)].pinned = pinned ? 0 : 1;
  localStorage.setItem('local_notes', JSON.stringify(notesJSON));
  await getNotes();
};

const deleteNote = async (e) => {
  let message = '';
  if (localStorage.getItem('lang') === 'fr') message = 'Êtes-vous sûr de vouloir supprimer cette note ?';
  else if (localStorage.getItem('lang') === 'de') message = 'Möchten Sie diese Notiz wirklich löschen?';
  else if (localStorage.getItem('lang') === 'es') message = '¿Estás seguro que quieres eliminar esta nota?';
  else message = 'Do you really want to delete this note?';
  if (window.confirm(message)) {
    notesJSON.splice(e, 1);
    localStorage.setItem('local_notes', JSON.stringify(notesJSON));
    await getNotes();
  }
};

document.querySelector('#log-in').addEventListener('click', () => {
  document.querySelector('#connect-box').showModal();
});

document.querySelector('#create-account').addEventListener('click', () => {
  document.querySelector('#connect-box').close();
  document.querySelector('#create-box').showModal();
});

document.querySelectorAll('input[name="sort-notes"]').forEach(async (e) => {
  e.addEventListener('change', async () => {
    if (e.value === '1' || e.value === '2' || e.value === '3' || e.value === '4') {
      localStorage.setItem('sort_notes', e.value);
      await getNotes();
    }
  });
});

document.querySelectorAll('.btn-add-note').forEach((e) => {
  e.addEventListener('click', () => {
    isUpdate = false;
    document.querySelector('#note-popup-box').showModal();
    document.querySelectorAll('#colors span').forEach((e) => {
      e.classList.remove('selected');
    });
    document.querySelector('#colors span').classList.add('selected');
    document.querySelector('#textarea-length').textContent = `0/${defaultScript.maxNoteContent}`;
    document.querySelector('#check-hidden').disabled = false;
  });
});

document.querySelector('#btn-unlock-float').addEventListener('click', async () => {
  await defaultScript.verifyFingerprint();
  await getNotes();
});

document.querySelector('#create-form').addEventListener('submit', async () => {
  if (defaultScript.isLocked) return;
  const e = document.querySelector('#name-create').value.trim();
  const t = document.querySelector('#psswd-create').value;
  const o = document.querySelector('#psswd-create-valid').value;
  if (!e || !t || !o || e.length < 3 || e.length > 30 || t.length < 10 || t.length > 64) return;
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    defaultScript.showError('Name can only contain letters, spaces and accents...');
    return;
  }
  if (/^[0-9]+$/.test(t)) {
    defaultScript.showError('Password too weak (only numbers)...');
    return;
  }
  if (/^[a-z]+$/.test(t)) {
    defaultScript.showError('Password too weak (only lowercase letters)...');
    return;
  }
  if (/^[A-Z]+$/.test(t)) {
    defaultScript.showError('Password too weak (only uppercase letters)...');
    return;
  }
  if (/^[a-zA-Z]+$/.test(t)) {
    defaultScript.showError('Password too weak (only letters)...');
    return;
  }
  if (/^[a-zA-Z0-9]+$/.test(t)) {
    defaultScript.showError('Password should contain one special character...');
    return;
  }
  if (t !== o) {
    defaultScript.showError('Passwords do not match...');
    return;
  }
  if (e === t) {
    defaultScript.showError('Username and password cannot be the same...');
    return;
  }
  const nameCreate = e;
  const psswdCreate = t;
  try {
    const data = new URLSearchParams({ nameCreate, psswdCreate, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/createUser.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError('Username already taken...');
      defaultScript.forms.forEach((form) => form.reset());
      return;
    }
    document.querySelector('#create-box').close();
    defaultScript.forms.forEach((form) => form.reset());
    let message = '';
    if (localStorage.getItem('lang') === 'fr') message = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
    else if (localStorage.getItem('lang') === 'de') message = 'Konto erfolgreich erstellt! Sie können sich jetzt anmelden.';
    else if (localStorage.getItem('lang') === 'es') message = '¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.';
    else message = 'Account successfully created! You can now log in.';
    defaultScript.showSuccess(message);
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
    defaultScript.forms.forEach((form) => form.reset());
  }
});

document.querySelector('#connect-form').addEventListener('submit', async () => {
  if (defaultScript.isLocked) return;
  const e = document.querySelector('#name-connect').value.trim();
  const t = document.querySelector('#psswd-connect').value;
  if (!e || !t || e.length > 30 || t.length > 64) return;
  const nameConnect = e;
  const psswdConnect = t;
  try {
    const data = new URLSearchParams({ nameConnect, psswdConnect, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/connectUser.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.forms.forEach((form) => form.reset());
      let time = 10;
      const btn = document.querySelector('#connect-form button[type="submit"]');
      const btnText = btn.textContent;
      btn.disabled = true;
      defaultScript.showError('Wrong username or password...');
      const interval = setInterval(() => {
        time -= 1;
        btn.textContent = time;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        btn.disabled = false;
        btn.textContent = btnText;
      }, 10000);
      return;
    }
    window.location.reload();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
    defaultScript.forms.forEach((form) => form.reset());
  }
});

document.querySelector('#add-note').addEventListener('submit', async () => {
  try {
    if (defaultScript.isLocked) return;
    const noteId = notesJSON.length;
    const title = document.querySelector('#note-popup-box #title').value.trim();
    const content = document.querySelector('#note-popup-box #content').value.trim();
    const color = document.querySelector('#colors .selected').classList[0];
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hidden = document.querySelector('#check-hidden').checked ? 1 : 0;
    const category = parseInt(document.querySelector('input[name="category"]:checked').value, 10);
    const folder = document.querySelector('#note-popup-box #folders').value;

    if (!title || title.length > 30 || folder.length > 18 || content.length > defaultScript.maxNoteContent || !color || !/^[0-9]+$/.test(category)) return;

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
      id: noteId,
      title: arrayBufferToBase64(enTitle),
      content: arrayBufferToBase64(enContent),
      color,
      date,
      hidden,
      category,
      folder,
      pinned: 0,
    };

    if (isUpdate) notesJSON[document.querySelector('#id-note').value] = note;
    else notesJSON.push(note);

    localStorage.setItem('local_notes', JSON.stringify(notesJSON));
    document.querySelector('#note-popup-box').close();
    await getNotes();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await defaultScript.getLockApp();
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  changeLanguage(localStorage.getItem('lang') || 'en');
  await getNotes();
});
