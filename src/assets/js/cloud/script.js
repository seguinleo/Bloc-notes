/* global DOMPurify, marked */

import * as defaultScript from '../default.js';
import '../marked.min.js';
import '../purify.min.js';

marked.use({
  breaks: true
});

let isUpdate = false;
let dataByteSize = 0;
const maxDataByteSize = 1000000;

const shareNote = (noteId, link) => {
  if (!noteId) return;
  if (link) {
    document.querySelector('#public-note-popup-box').showModal();
    document.querySelector('#id-note-private').value = noteId;
    document.querySelector('#link-note-private').value = link;
    document.querySelector('#copy-note-link').textContent = link;
  } else {
    document.querySelector('#private-note-popup-box').showModal();
    document.querySelector('#id-note-public').value = noteId;
  }
};

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
      const noteFolder = target.closest('.note').getAttribute('data-note-folder') || '';
      const noteCategory = target.closest('.note').getAttribute('data-note-category') || '';
      const noteLink = target.closest('.note').getAttribute('data-note-link');
      if (target.classList.contains('edit-note')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteFolder, noteCategory, noteLink);
      else if (target.classList.contains('pin-note')) pin(noteId);
      else if (target.classList.contains('copy-note')) defaultScript.copy(noteContent);
      else if (target.classList.contains('delete-note')) deleteNote(noteId);
      else if (target.classList.contains('download-note')) defaultScript.downloadNote(noteId);
      else if (target.classList.contains('share-note')) shareNote(noteId, noteLink, noteTitle, noteContent);
    });
    e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') e.click();
    });
  });
};

const getNotes = async () => {
  if (defaultScript.isLocked) {
    document.querySelector('#btn-unlock-float').classList.remove('d-none');
    return;
  }
  const sort = localStorage.getItem('sort_notes') || '1';
  document.querySelector(`#sort-popup-box input[name="sort-notes"][value="${encodeURIComponent(sort)}"]`).checked = true;
  document.querySelector('#list-notes').textContent = '';
  document.querySelector('#filter-categories').textContent = '';
  document.querySelector('#folders .list').textContent = '';
  document.querySelector('#categories .list').textContent = '';
  document.querySelectorAll('.note').forEach((e) => e.remove());

  try {
    const data = new URLSearchParams({ csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/getNotes.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    if (!res.ok) throw new Error(`An error occurred - ${res.status}`);

    dataByteSize = 0;
    document.querySelector('#storage-usage').textContent = `0 kB / ${maxDataByteSize / 1000000} MB`;
    const response = await res.json();
    const notesJSON = response.notes;

    document.querySelector('#last-login-date').textContent = `${response.lastLogin}GMT`;

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
    const allCategories = new Set();

    notesJSON.forEach((row) => {
      const {
        id, title, content, color, date, hidden, folder, category, pinned, link
      } = row;

      if (!id || !title || !color || !date) return;

      dataByteSize += new Blob([title, content]).size;

      const bottomContentElement = document.createElement('div');
      bottomContentElement.classList.add('bottom-content');

      const paragraph = document.createElement('p');

      const noteElement = document.createElement('div');
      noteElement.classList.add('note', color);
      noteElement.setAttribute('data-note-id', id);
      noteElement.setAttribute('data-note-title', title);
      noteElement.setAttribute('data-note-content', content);
      noteElement.setAttribute('data-note-color', color);

      const titleElement = document.createElement('h2');
      titleElement.classList.add('title');
      titleElement.textContent = title;

      const contentElement = document.createElement('div');
      contentElement.classList.add('details-content');
      if (hidden) contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      else contentElement.innerHTML = marked.parse(content);

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

      if (!link) {
        const trashIconElement = document.createElement('i');
        trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action', 'delete-note');
        trashIconElement.tabIndex = 0;
        trashIconElement.setAttribute('role', 'button');
        trashIconElement.setAttribute('aria-label', 'Delete note');
        bottomContentElement.appendChild(trashIconElement);
      } else {
        noteElement.setAttribute('data-note-link', link);
        const linkElement = document.createElement('span');
        linkElement.classList.add('custom-check');
        const iconLink = document.createElement('i');
        iconLink.classList.add('fa-solid', 'fa-link');
        linkElement.appendChild(iconLink);
        paragraph.appendChild(linkElement);
      }

      if (!hidden && content) {
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

        const linkIconElement = document.createElement('i');
        linkIconElement.classList.add('fa-solid', 'fa-link', 'note-action', 'share-note');
        linkIconElement.tabIndex = 0;
        linkIconElement.setAttribute('role', 'button');
        linkIconElement.setAttribute('aria-label', 'Share note');
        bottomContentElement.appendChild(linkIconElement);
      }

      noteElement.appendChild(detailsElement);
      noteElement.appendChild(bottomContentElement);

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('title-list');
      titleSpan.textContent = title;

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

      if (pinned) {
        noteElement.classList.add('pinned');
        const pinnedElement = document.createElement('span');
        pinnedElement.classList.add('custom-check');
        const iconPin = document.createElement('i');
        iconPin.classList.add('fa-solid', 'fa-thumbtack');
        pinnedElement.appendChild(iconPin);
        paragraph.appendChild(pinnedElement);
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

      if (folder) {
        allFolders.add(folder);
        noteElement.setAttribute('data-note-folder', folder);
        paragraph.setAttribute('data-folder', folder);
      }

      if (category) {
        allCategories.add(category);
        noteElement.setAttribute('data-note-category', category);
        paragraph.setAttribute('data-category', category);
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('custom-check');
        categoryElement.textContent = category;
        paragraph.appendChild(categoryElement);
      }

      fragment.appendChild(noteElement);
      paragraph.appendChild(titleSpan);
      paragraph.appendChild(dateSpan);
      if (!folder) document.querySelector('#list-notes').appendChild(paragraph);
      else {
        const folderDetails = document.querySelector(`details[data-folder="${encodeURIComponent(folder)}"]`);
        if (!folderDetails) {
          const newFolderDetails = document.createElement('details');
          newFolderDetails.setAttribute('open', 'open');
          newFolderDetails.setAttribute('data-folder', encodeURIComponent(folder));
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

    for (const folder of allFolders) {
      const folders = document.querySelector('#folders .list');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'add-folder';
      input.value = folder;
      input.id = `${folder}-folder-add-span`;
      const label = document.createElement('label');
      label.classList.add('custom-check');
      const span = document.createElement('span');
      span.textContent = folder;
      span.tabIndex = 0;
      span.role = 'button';
      label.appendChild(input);
      label.appendChild(span);
      folders.appendChild(label);
    }

    for (const category of allCategories) {
      const categories = document.querySelector('#categories .list');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'add-cat';
      input.value = category;
      input.id = `${category}-cat-add-span`;
      const label = document.createElement('label');
      label.classList.add('custom-check');
      const span = document.createElement('span');
      span.textContent = category;
      span.tabIndex = 0;
      span.role = 'button';
      label.appendChild(input);
      label.appendChild(span);
      categories.appendChild(label);

      const sortCategories = document.querySelector('#filter-categories');
      const sortInput = document.createElement('input');
      sortInput.type = 'checkbox';
      sortInput.name = 'filter-notes';
      sortInput.value = category;
      sortInput.id = `${category}-filter-span`;
      const sortLabel = document.createElement('label');
      sortLabel.classList.add('custom-check');
      const sortSpan = document.createElement('span');
      sortSpan.textContent = category;
      sortSpan.tabIndex = 0;
      sortSpan.role = 'button';
      sortLabel.appendChild(sortInput);
      sortLabel.appendChild(sortSpan);
      sortCategories.appendChild(sortLabel);
    }

    document.querySelector('main').appendChild(fragment);
    noteActions();
    document.querySelector('#storage').value = dataByteSize;
    document.querySelector('#storage-usage').textContent = `${(dataByteSize * 0.001).toFixed(2)} kB / ${maxDataByteSize / 1000000} MB`;
    document.querySelectorAll('.note').forEach((e) => {
      e.addEventListener('click', (event) => {
        if (event.target.parentElement.classList.contains('bottom-content') || event.target.classList.contains('bottom-content')) return;
        if (event.target.tabIndex > -1) return;
        if (document.getSelection().toString()) return;
        defaultScript.toggleFullscreen(event.currentTarget.getAttribute('data-note-id'));
      });
    });
    document.querySelectorAll('#filter-popup-box input[name="filter-notes"]').forEach((e) => {
      e.addEventListener('change', () => {
        const selectedCategories = [];
        const checkedCategories = document.querySelectorAll('#filter-popup-box input[name="filter-notes"]:checked');
        if (checkedCategories.length === 0) {
          document.querySelectorAll('.note').forEach((note) => note.classList.remove('d-none'));
          return;
        }
        checkedCategories.forEach((category) => selectedCategories.push(category.value));
        document.querySelectorAll('.note').forEach((note) => {
          if (selectedCategories.includes(note.getAttribute('data-note-category'))) note.classList.remove('d-none');
          else note.classList.add('d-none');
        });
      });
    });
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
};

const fetchDelete = async (noteId) => {
  if (!noteId) return;
  try {
    const data = new URLSearchParams({ noteId, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/deleteNote.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      return;
    }
    await getNotes();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
};

const fetchLogout = async () => {
  try {
    const res = await fetch('./assets/php/logout.php', {
      method: 'POST',
      mode: 'same-origin',
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      return;
    }
    window.location.reload();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
};

const updateNote = (noteId, title, content, color, hidden, folder, category, link) => {
  isUpdate = true;
  document.querySelector('#note-popup-box').showModal();
  document.querySelector('#id-note').value = noteId;
  document.querySelector('#note-popup-box #title').value = title;
  document.querySelector('#note-popup-box #content').value = content;
  document.querySelector(`#folders input[name="add-folder"][value="${folder}"]`).checked = true;
  document.querySelector(`#categories input[name="add-cat"][value="${category}"]`).checked = true;
  document.querySelectorAll('#colors span').forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selected');
    else e.classList.remove('selected');
  });
  if (!link) {
    document.querySelector('#check-hidden').disabled = false;
    if (hidden) document.querySelector('#check-hidden').checked = true;
  } else document.querySelector('#check-hidden').disabled = true;
  const noteLength = document.querySelector('#note-popup-box #content').value.length;
  document.querySelector('#textarea-length').textContent = `${noteLength}/${defaultScript.maxNoteContent}`;
  document.querySelector('#note-popup-box #content').focus();
};

const pin = async (noteId) => {
  if (!noteId) return;
  try {
    const data = new URLSearchParams({ noteId, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/pinNote.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      return;
    }
    await getNotes();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
};

const deleteNote = (noteId) => {
  if (!noteId) return;
  let message = '';
  if (defaultScript.lang === 'fr') message = 'Êtes-vous sûr de vouloir supprimer cette note ?';
  else if (defaultScript.lang === 'de') message = 'Möchten Sie diese Notiz wirklich löschen?';
  else if (defaultScript.lang === 'es') message = '¿Estás seguro que quieres eliminar esta nota?';
  else message = 'Do you really want to delete this note?';
  if (window.confirm(message)) fetchDelete(noteId);
};

document.querySelector('#manage-account').addEventListener('click', () => {
  document.querySelector('#manage-popup-box').showModal();
});

document.querySelector('#copy-note-link-btn').addEventListener('click', () => {
  const link = document.querySelector('#copy-note-link').textContent;
  const url = new URL(`./share?link=${encodeURIComponent(link)}`, window.location.href);
  navigator.clipboard.writeText(url.href);
});

document.querySelector('#log-out').addEventListener('click', () => fetchLogout());

document.querySelectorAll('#sort-popup-box input[name="sort-notes"]').forEach(async (e) => {
  e.addEventListener('change', async () => {
    if (!['1', '2', '3', '4'].includes(e.value)) return;
    localStorage.setItem('sort_notes', e.value);
    await getNotes();
  });
});

document.querySelector('#btn-add-note').addEventListener('click', () => {
  isUpdate = false;
  document.querySelector('#note-popup-box').showModal();
  document.querySelectorAll('#colors span').forEach((e) => {
    e.classList.remove('selected');
  });
  document.querySelector('#colors span').classList.add('selected');
  document.querySelector('#textarea-length').textContent = `0/${defaultScript.maxNoteContent}`;
  document.querySelector('#check-hidden').disabled = false;
  document.querySelector('#folders input[name="add-folder"][value=""').checked = true;
  document.querySelector('#categories input[name="add-cat"][value=""').checked = true;
});

document.querySelector('#btn-unlock-float').addEventListener('click', async () => {
  await defaultScript.verifyFingerprint();
  await getNotes();
});

document.querySelector('#add-note').addEventListener('submit', async () => {
  try {
    if (dataByteSize > maxDataByteSize) {
      defaultScript.showError('You have reached the maximum storage capacity...');
      return;
    }
    if (defaultScript.isLocked) return;
    const noteId = document.querySelector('#id-note').value;
    const title = document.querySelector('#note-popup-box #title').value.trim();
    const content = document.querySelector('#note-popup-box #content').value.trim();
    const color = document.querySelector('#colors .selected').classList[0];
    const hidden = document.querySelector('#check-hidden').checked ? 1 : 0;
    const folder = document.querySelector('#folders input[name="add-folder"]:checked').value;
    const category = document.querySelector('#categories input[name="add-cat"]:checked').value;

    if (!title || title.length > 30  || content.length > defaultScript.maxNoteContent || !color) return;
    if (isUpdate && !noteId) return;
    if (noteId && !/^[a-zA-Z0-9]+$/.test(noteId)) return;

    const cleanContent = DOMPurify.sanitize(content, {
      SANITIZE_NAMED_PROPS: true,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['dialog', 'footer', 'form', 'header', 'main', 'nav', 'style'],
    });

    const data = new URLSearchParams({
      title,
      content: cleanContent,
      color,
      hidden,
      folder,
      category,
      csrf_token: defaultScript.csrfToken,
    });
    
    if (isUpdate) data.set('noteId', noteId);

    const url = isUpdate ? './assets/php/updateNote.php' : './assets/php/addNote.php';
    const res = await fetch(url, {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      return;
    }
    document.querySelector('#note-popup-box').close();
    await getNotes();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
});

document.querySelector('#change-psswd').addEventListener('submit', async () => {
  if (defaultScript.isLocked) return;
  const a = document.querySelector('#old-psswd').value;
  const e = document.querySelector('#new-psswd').value;
  const t = document.querySelector('#new-psswd-valid').value;
  if (!a || !e || !t || e.length < 10 || e.length > 64) return;
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
  if (e !== t) {
    defaultScript.showError('Passwords do not match...');
    return;
  }
  const psswdOld = a;
  const psswdNew = e;
  try {
    const data = new URLSearchParams({ psswdOld, psswdNew, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/updatePsswd.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      defaultScript.forms.forEach((form) => form.reset());
      return;
    }
    defaultScript.showSuccess('Successfully changed password!');
    defaultScript.forms.forEach((form) => form.reset());
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
    defaultScript.forms.forEach((form) => form.reset());
  }
});

document.querySelector('#delete-account').addEventListener('submit', async () => {
  if (defaultScript.isLocked) return;
  const psswd = document.querySelector('#delete-psswd').value;
  if (!psswd || psswd.length < 10 || psswd.length > 64) return;
  try {
    const data = new URLSearchParams({ psswd, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/deleteAccount.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      defaultScript.forms.forEach((form) => form.reset());
      return;
    }
    window.location.reload();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
    defaultScript.forms.forEach((form) => form.reset());
  }
});

document.querySelector('#private-note').addEventListener('submit', async () => {
  const noteId = document.querySelector('#id-note-private').value;
  const link = document.querySelector('#link-note-private').value;
  if (!noteId || !link || !/^[a-zA-Z0-9]+$/.test(link)) return;
  try {
    const data = new URLSearchParams({ noteId, noteLink: link, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/privateNote.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      return;
    }
    document.querySelector('#public-note-popup-box').close();
    await getNotes();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
});

document.querySelector('#public-note').addEventListener('submit', async () => {
  const noteId = document.querySelector('#id-note-public').value;
  if (!noteId) return;
  try {
    const data = new URLSearchParams({ noteId, csrf_token: defaultScript.csrfToken });
    const res = await fetch('./assets/php/publicNote.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError(`An error occurred - ${res.status}`);
      return;
    }
    document.querySelector('#private-note-popup-box').close();
    await getNotes();
  } catch (error) {
    defaultScript.showError(`An error occurred - ${error}`);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await defaultScript.getLockApp();
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  defaultScript.changeLanguage(defaultScript.lang || 'en', true);
  defaultScript.loadTheme();
  await getNotes();
});
