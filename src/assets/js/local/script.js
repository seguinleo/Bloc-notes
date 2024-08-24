/* global DOMPurify, marked */

import * as defaultScript from '../default.js';
import '../marked.min.js';
import '../purify.min.js';

let isUpdate = false;
const notesJSON = JSON.parse(localStorage.getItem('local_notes') || '[]');

const noteActions = () => {
  document.querySelectorAll('.bottom-content i').forEach((e) => {
    e.addEventListener('click', (event) => {
      const { target } = event;
      const noteId = target.closest('.note').getAttribute('data-note-id');
      if (!noteId) return;
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
  if (defaultScript.isLocked) {
    document.querySelector('#btn-unlock-float').classList.remove('d-none');
    return;
  }
  const sort = localStorage.getItem('sort_notes');
  document.querySelector(`input[name="sort-notes"][value="${sort}"]`).checked = true;
  document.querySelectorAll('#list-notes *').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());
  const folders = document.querySelector('#folders');
  for (let i = folders.options.length - 1; i >= 0; i -= 1) {
    if (folders.options[i].value) folders.remove(i);
  }

  try {
    const dbName = 'notes_db';
    const objectStoreName = 'key';
    const db = await openIndexedDB(dbName, objectStoreName);
    const key = await getKeyFromDB(db, objectStoreName);

    if (notesJSON.length === 0) return;

    notesJSON.sort((a, b) => {
      if (a.pinned === 1 && b.pinned === 0) return -1;
      if (a.pinned === 0 && b.pinned === 1) return 1;

      switch (sort) {
        case '1':
          return b.date.localeCompare(a.date);
        case '2':
          return a.date.localeCompare(b.date);
        case '3':
          return a.title.localeCompare(b.title);
        case '4':
          return b.title.localeCompare(a.title);
        default:
          break;
      }
    });

    const numberOfNotesElement = document.createElement('h2');
    if (defaultScript.lang === 'de') numberOfNotesElement.textContent = `Notizen (${notesJSON.length})`;
    else if (defaultScript.lang === 'es') numberOfNotesElement.textContent = `Notas (${notesJSON.length})`;
    else numberOfNotesElement.textContent = `Notes (${notesJSON.length})`;
    document.querySelector('#list-notes').appendChild(numberOfNotesElement);

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

      const noteElement = document.createElement('div');
      noteElement.classList.add('note', color);
      noteElement.setAttribute('data-note-id', id);
      noteElement.setAttribute('data-note-title', deTitleString);
      noteElement.setAttribute('data-note-content', deContentString);
      noteElement.setAttribute('data-note-color', color);
      noteElement.setAttribute('data-note-category', category);

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

      if (!hidden && deContentString) {
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

      if (folder) {
        noteElement.setAttribute('data-note-folder', folder);
        allFolders.add(folder);
        paragraph.setAttribute('data-folder', folder);
      }
      
      if (pinned) {
        noteElement.classList.add('pinned');
        const pinnedElement = document.createElement('span');
        pinnedElement.classList.add('custom-check');
        const iconPin = document.createElement('i');
        iconPin.classList.add('fa-solid', 'fa-thumbtack');
        pinnedElement.appendChild(iconPin);
        paragraph.appendChild(pinnedElement);
      }

      if (category) {
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('custom-check');
        categoryElement.textContent = document.querySelector(`input[name="category"][value="${category}"]`).parentElement.textContent;
        paragraph.appendChild(categoryElement);
      }

      if (hidden) {
        noteElement.setAttribute('data-note-hidden', hidden);
        const hiddenElement = document.createElement('span');
        hiddenElement.classList.add('custom-check');
        const iconEye = document.createElement('i');
        iconEye.classList.add('fa-solid', 'fa-eye-slash');
        hiddenElement.appendChild(iconEye);
        paragraph.appendChild(hiddenElement);
      }

      fragment.appendChild(noteElement);
      paragraph.appendChild(titleSpan);
      paragraph.appendChild(dateSpan);
      if (!folder) document.querySelector('#list-notes').appendChild(paragraph);
      else {
        const folderDetails = document.querySelector(`details[data-folder="${folder}"]`);
        if (!folderDetails) {
          const newFolderDetails = document.createElement('details');
          newFolderDetails.setAttribute('open', 'open');
          newFolderDetails.setAttribute('data-folder', folder);
          const summary = document.createElement('summary');
          summary.textContent = folder;
          newFolderDetails.appendChild(summary);
          newFolderDetails.appendChild(paragraph);
          document.querySelector('#list-notes').appendChild(newFolderDetails);
        } else {
          folderDetails.appendChild(paragraph);
        }
      }
    });

    await Promise.all(promises);

    for (const folder of allFolders) {
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
  document.querySelector('#note-popup-box #folders').value = folder || '';
  document.querySelectorAll('#colors span').forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selected');
    else e.classList.remove('selected');
  });
  document.querySelector(`input[name="category"][value="${category || '0'}"]`).checked = true;
  if (hidden) document.querySelector('#check-hidden').checked = true;
  const noteLength = document.querySelector('#note-popup-box #content').value.length;
  document.querySelector('#textarea-length').textContent = `${noteLength}/${defaultScript.maxNoteContent}`;
  document.querySelector('#note-popup-box #content').focus();
};

const pin = async (noteId) => {
  if (!noteId) return;
  const note = document.querySelector(`.note[data-note-id="${noteId}"]`);
  const pinned = note.classList.contains('pinned');
  if (pinned) note.classList.add('pinned');
  else note.classList.remove('pinned');
  notesJSON[parseInt(noteId, 10)].pinned = pinned ? 0 : 1;
  localStorage.setItem('local_notes', JSON.stringify(notesJSON));
  await getNotes();
};

const deleteNote = async (noteId) => {
  if (!noteId) return;
  let message = '';
  if (defaultScript.lang === 'fr') message = 'Êtes-vous sûr de vouloir supprimer cette note ?';
  else if (defaultScript.lang === 'de') message = 'Möchten Sie diese Notiz wirklich löschen?';
  else if (defaultScript.lang === 'es') message = '¿Estás seguro que quieres eliminar esta nota?';
  else message = 'Do you really want to delete this note?';
  if (window.confirm(message)) {
    notesJSON.splice(noteId, 1);
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
    if (!['1', '2', '3', '4'].includes(e.value)) return;
    localStorage.setItem('sort_notes', e.value);
    await getNotes();
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
    if (defaultScript.lang === 'fr') message = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
    else if (defaultScript.lang === 'de') message = 'Konto erfolgreich erstellt! Sie können sich jetzt anmelden.';
    else if (defaultScript.lang === 'es') message = '¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.';
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
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['footer', 'form', 'header', 'main', 'nav', 'style'],
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
  defaultScript.changeLanguage(defaultScript.lang || 'en', false);
  defaultScript.loadTheme();
  await getNotes();
});
