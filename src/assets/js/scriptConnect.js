/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
let isUpdate = false;
let timeoutCopy = null;
let timeoutNotification = null;
let touchstartX = 0;
let touchendX = 0;
const noteBox = document.querySelector('.note-popup-box');
const sortBox = document.querySelector('.sort-popup-box');
const popupBoxManage = document.querySelector('.manage-popup-box');
const privateNote = document.querySelector('.private-note-popup-box');
const publicNote = document.querySelector('.public-note-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const switchElement = document.querySelector('.switch');
const colors = document.querySelectorAll('.colors span');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('.sideBar');
const metaTheme = document.querySelectorAll('.themecolor');
const buttonTheme = document.querySelector('#iconTheme');

function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

const submitFingerprint = async () => {
  try {
    const challenge = generateRandomBytes(32);
    const userId = generateRandomBytes(16);
    const credential = await navigator.credentials.create({
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
    const credentialObject = {
      id: credential.id,
      rawId: credential.rawId,
      response: {
        attestationObject: credential.response.attestationObject,
        clientDataJSON: credential.response.clientDataJSON,
      },
      type: credential.type,
    };
    localStorage.setItem('fingerprint', 'true');
  } catch (error) {
    document.querySelector('#checkFingerprint').checked = false;
  }
};

const verifyFingerprint = async () => {
  try {
    const challenge = generateRandomBytes(32);
    const userId = generateRandomBytes(16);
    const credential = await navigator.credentials.create({
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
    const credentialObject = {
      id: credential.id,
      rawId: credential.rawId,
      response: {
        attestationObject: credential.response.attestationObject,
        clientDataJSON: credential.response.clientDataJSON,
      },
      type: credential.type,
    };
    await showNotes();
  } catch (error) {
    window.location.href = '/error/403/';
  }
};

document.querySelector('#checkFingerprint').addEventListener('change', () => {
  if (document.querySelector('#checkFingerprint').checked) submitFingerprint();
  else localStorage.removeItem('fingerprint');
});

if (localStorage.getItem('fingerprint') === 'true') {
  verifyFingerprint();
  document.querySelector('#checkFingerprint').checked = true;
}

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

if (localStorage.getItem('version') === 'hide') document.querySelector('#newVersion').style.display = 'none';
if (localStorage.getItem('sort_notes') === null) localStorage.setItem('sort_notes', '3');

document.querySelectorAll('input[name="sortNotes"]').forEach((element) => {
  const e = element;
  if (e.value === localStorage.getItem('sort_notes')) e.checked = true;
});

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

const searchSideBar = () => {
  sideBar.querySelectorAll('p').forEach((element) => {
    element.addEventListener('click', () => {
      const e = element.querySelector('.titleList').textContent;
      document.querySelectorAll('.note').forEach((note) => {
        const t = note.querySelector('.title').textContent;
        if (t === e) {
          note.scrollIntoView();
          note.focus();
        }
      });
    });
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') element.click();
    });
  });
};

const openSidebar = () => sideBar.classList.add('show');
const closeSidebar = () => sideBar.classList.remove('show');
const handleGesture = () => {
  if (touchendX - touchstartX > 75 && !sideBar.classList.contains('show')) openSidebar();
  else if (touchendX - touchstartX < -75 && sideBar.classList.contains('show')) closeSidebar();
};

const converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('tasklists', true);
converter.setOption('strikethrough', true);
converter.setOption('parseImgDimensions', true);
converter.setOption('simpleLineBreaks', true);

const showNotes = async () => {
  document.querySelector('.sideBar .listNotes').textContent = '';
  document.querySelectorAll('.note').forEach((note) => note.remove());
  forms.forEach((form) => form.reset());

  const response = await fetch('/seguinleo-notes/assets/php/getNotes.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `sort=${encodeURIComponent(localStorage.getItem('sort_notes'))}`,
  });

  const data = await response.json();

  if (data.length === 0) return;

  document.querySelector('.lastSync span').textContent = new Date().toLocaleTimeString();

  data.forEach((row) => {
    const {
      id, title, content, color, date, hidden, link,
    } = row;

    if (!id || !title) return;

    const contentHtml = converter.makeHtml(content);
    const contentHtmlPurify = DOMPurify.sanitize(contentHtml);
    const noteElement = document.createElement('div');
    noteElement.id = `note${id}`;
    noteElement.classList.add('note', color);
    noteElement.tabIndex = 0;
    noteElement.setAttribute('data-note-id', id);
    noteElement.setAttribute('data-note-title', title);
    noteElement.setAttribute('data-note-content', content);
    noteElement.setAttribute('data-note-color', color);
    noteElement.setAttribute('data-note-hidden', hidden);
    noteElement.setAttribute('data-note-link', link);

    const detailsElement = document.createElement('div');
    detailsElement.classList.add('details');

    const titleElement = document.createElement('h2');
    titleElement.classList.add('title');
    titleElement.textContent = title;

    const contentElement = document.createElement('span');

    if (hidden === 0) contentElement.innerHTML = contentHtmlPurify;
    else contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

    detailsElement.appendChild(titleElement);
    detailsElement.appendChild(contentElement);

    const bottomContentElement = document.createElement('div');
    bottomContentElement.classList.add('bottom-content');

    const editIconElement = document.createElement('i');
    editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
    editIconElement.tabIndex = 0;
    editIconElement.setAttribute('role', 'button');
    editIconElement.setAttribute('aria-label', 'Modifier la note');
    bottomContentElement.appendChild(editIconElement);

    if (link === '') {
      const trashIconElement = document.createElement('i');
      trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
      trashIconElement.tabIndex = 0;
      trashIconElement.setAttribute('role', 'button');
      trashIconElement.setAttribute('aria-label', 'Supprimer la note');
      bottomContentElement.appendChild(trashIconElement);
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
    document.querySelector('main').appendChild(noteElement);

    const paragraph = document.createElement('p');
    paragraph.setAttribute('tabindex', '0');
    paragraph.setAttribute('role', 'button');

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('titleList');
    titleSpan.textContent = title;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('dateList');
    dateSpan.textContent = date;
    paragraph.appendChild(titleSpan);

    if (link !== '') {
      const iconLink = document.createElement('i');
      iconLink.classList.add('fa-solid', 'fa-link');
      paragraph.appendChild(iconLink);
    }

    paragraph.appendChild(dateSpan);
    sideBar.querySelector('.listNotes').appendChild(paragraph);
  });
  searchSideBar();
};

const fetchDelete = async (e) => {
  try {
    const response = await fetch('/seguinleo-notes/assets/php/deleteNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(e)}`,
    });
    if (response.ok) await showNotes();
    else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
};

const deleteAccount = async () => {
  try {
    const response = await fetch('/seguinleo-notes/assets/php/deleteAccount.php', {
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

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
};

const updateNote = (id, title, content, color, hidden, link) => {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  isUpdate = true;
  document.querySelector('.iconConnect').click();
  document.querySelector('#idNote').value = id;
  document.querySelector('#checkLink').value = link;
  titleNote.value = title;
  contentNote.value = content;
  colors.forEach((colorSpan) => {
    if (colorSpan.classList.contains(color)) colorSpan.classList.add('selectionne');
    else colorSpan.classList.remove('selectionne');
  });
  if (link === '') {
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
  if (timeoutCopy) clearTimeout(timeoutCopy);
  const notification = document.querySelector('#copyNotification');
  navigator.clipboard.writeText(content);
  notification.classList.add('show');
  timeoutCopy = setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

const deleteNote = (e) => {
  let message = '';
  if (window.location.href.endsWith('/en/')) message = 'Do you really want to delete this note?';
  else if (window.location.href.endsWith('/de/')) message = 'Möchten Sie diese Notiz wirklich löschen?';
  else if (window.location.href.endsWith('/es/')) message = '¿Estás seguro que quieres eliminar esta nota?';
  else message = 'Êtes-vous sûr de vouloir supprimer cette note ?';
  if (window.confirm(message)) fetchDelete(e);
};

const noteAccess = (id, link) => {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  if (link === '') {
    privateNote.classList.add('show');
    document.querySelector('#idNotePublic').value = id;
    privateNote.querySelector('i').focus();
  } else {
    publicNote.classList.add('show');
    document.querySelector('#idNotePrivate').value = id;
    document.querySelector('#linkNotePrivate').value = link;
    const baseURL = window.location.href.replace('/en', '').replace('/de', '').replace('/es', '');
    document.querySelector('#copyNoteLink').textContent = `${baseURL}share/${link}/`;
    publicNote.querySelector('i').focus();
  }
};

document.querySelector('main').addEventListener('click', (event) => {
  const { target } = event;
  if (target.classList.contains('note-action')) {
    const noteId = target.closest('.note').getAttribute('data-note-id');
    const noteTitle = target.closest('.note').getAttribute('data-note-title');
    const noteContent = target.closest('.note').getAttribute('data-note-content');
    const noteColor = target.closest('.note').getAttribute('data-note-color');
    const noteHidden = target.closest('.note').getAttribute('data-note-hidden');
    const noteLink = target.closest('.note').getAttribute('data-note-link');

    if (target.classList.contains('fa-pen')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteLink);
    else if (target.classList.contains('fa-clipboard')) copy(noteContent);
    else if (target.classList.contains('fa-trash-can')) deleteNote(noteId);
    else if (target.classList.contains('fa-expand')) toggleFullscreen(noteId);
    else if (target.classList.contains('fa-download')) downloadNote(noteTitle, noteContent);
    else if (target.classList.contains('fa-link')) noteAccess(noteId, noteLink, noteTitle, noteContent);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-clipboard')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-trash-can')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-pen')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-expand')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-download')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-link')) document.activeElement.click();
  } else if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

switchElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const checkbox = switchElement.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    switchElement.classList.toggle('checked');
  }
});

document.querySelectorAll('.iconConnect, .iconConnectFloat').forEach((element) => {
  element.addEventListener('click', () => {
    noteBox.classList.add('show');
    titleNote.focus();
    document.querySelector('#textareaLength').textContent = '0/5000';
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelector('#log-out').addEventListener('click', () => fetchLogout());

document.querySelectorAll('.manage-account').forEach((element) => {
  element.addEventListener('click', () => {
    popupBoxManage.classList.add('show');
    popupBoxManage.querySelector('i').focus();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelector('#delete-account').addEventListener('click', () => {
  let message = '';
  if (window.location.href.endsWith('/en/')) message = 'Do you really want to delete your account as well as all your notes saved in the cloud? Your username will become available again for other users.';
  else if (window.location.href.endsWith('/de/')) message = 'Möchten Sie wirklich Ihr Konto sowie alle Ihre in der Cloud gespeicherten Notizen löschen? Ihr Benutzername wird für andere Benutzer wieder verfügbar.';
  else if (window.location.href.endsWith('/es/')) message = '¿Estás seguro de que quieres eliminar tu cuenta y todas tus notas almacenadas en la nube? Su nombre de usuario volverá a estar disponible para otros usuarios.';
  else message = 'Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ? Votre nom d\'utilisateur redeviendra disponible pour les autres utilisateurs.';
  if (window.confirm(message)) deleteAccount();
});

document.querySelector('#menuIcon').addEventListener('click', () => openSidebar());

forms.forEach((element) => {
  element.addEventListener('submit', (event) => {
    event.preventDefault();
  });
});

document.querySelectorAll('header i').forEach((element) => {
  element.addEventListener('click', () => {
    isUpdate = false;
    forms.forEach((form) => form.reset());
    noteBox.classList.remove('show');
    popupBoxManage.classList.remove('show');
    publicNote.classList.remove('show');
    privateNote.classList.remove('show');
    sortBox.classList.remove('show');
    closeSidebar();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelector('#search-input').addEventListener('input', () => {
  const e = document.querySelector('#search-input').value.trim().toLowerCase();
  document.querySelectorAll('.note').forEach((element) => {
    const note = element;
    const t = note.querySelector('.note h2').textContent.toLowerCase();
    if (t.includes(e)) note.style.display = 'flex';
    else note.style.display = 'none';
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

document.querySelector('#newVersion header i').addEventListener('click', () => {
  document.querySelector('#newVersion').style.display = 'none';
  localStorage.setItem('version', 'hide');
});

document.querySelector('#export-all-notes').addEventListener('click', () => {
  if (document.querySelector('.note') === null) return;
  const notes = [];
  document.querySelectorAll('.note').forEach((note) => {
    const title = note.querySelector('.title').textContent;
    const content = note.querySelector('.details span').textContent;
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

document.querySelector('#language').addEventListener('change', () => {
  const e = document.querySelector('#language').value;
  if (window.location.href.endsWith('/en/')) {
    if (e === 'fr') window.location.href = '../';
    else if (e === 'de') window.location.href = '../de/';
    else if (e === 'es') window.location.href = '../es/';
  } else if (window.location.href.endsWith('/de/')) {
    if (e === 'fr') window.location.href = '../';
    else if (e === 'en') window.location.href = '../en/';
    else if (e === 'es') window.location.href = '../es/';
  } else if (window.location.href.endsWith('/es/')) {
    if (e === 'fr') window.location.href = '../';
    else if (e === 'en') window.location.href = '../en/';
    else if (e === 'de') window.location.href = '../de/';
  } else if (e === 'en') window.location.href += 'en/';
  else if (e === 'de') window.location.href += 'de/';
  else if (e === 'es') window.location.href += 'es/';
});

contentNote.addEventListener('input', () => {
  const e = contentNote.value.length;
  document.querySelector('#textareaLength').textContent = `${e}/5000`;
});

colors.forEach((span, index) => {
  span.addEventListener('click', (event) => {
    colors.forEach((s) => {
      s.classList.remove('selectionne');
    });
    event.target.classList.add('selectionne');
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
  if (index === 0) span.classList.add('selectionne');
});

document.querySelector('#submitNote').addEventListener('click', async () => {
  try {
    const idNote = document.querySelector('#idNote').value;
    const titleBrut = titleNote.value.trim();
    const contentBrut = contentNote.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (!titleBrut || titleBrut.length > 30 || contentBrut.length > 5000) return;
    const title = encodeURIComponent(titleBrut);
    const content = encodeURIComponent(contentBrut);
    const colorSpan = document.querySelector('.colors span.selectionne');
    const color = encodeURIComponent(colorSpan.classList[0]);
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hidden = document.querySelector('#checkHidden').checked ? '1' : '0';
    const link = encodeURIComponent(document.querySelector('#checkLink').value);
    const data = isUpdate ? `noteId=${idNote}&title=${title}&content=${content}&color=${color}&date=${date}&hidden=${hidden}&link=${link}&csrf_token_note=${document.querySelector('#csrf_token_note').value}` : `title=${title}&content=${content}&color=${color}&date=${date}&hidden=${hidden}&csrf_token_note=${document.querySelector('#csrf_token_note').value}`;
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

document.querySelector('#submitChangePsswd').addEventListener('click', async () => {
  const e = document.querySelector('#newPsswd').value;
  const t = document.querySelector('#newPsswdValid').value;
  if (!e || !t || e.length < 6 || e.length > 50) return;
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
  const psswdNew = encodeURIComponent(e);
  try {
    const response = await fetch('/seguinleo-notes/assets/php/updatePsswd.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `psswdNew=${psswdNew}&csrf_token_psswd=${document.querySelector('#csrf_token_psswd').value}`,
    });
    if (response.ok) {
      popupBoxManage.classList.remove('show');
      showSuccess('Successfully changed password!');
    } else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#submitPrivateNote').addEventListener('click', async () => {
  const id = document.querySelector('#idNotePrivate').value;
  const link = document.querySelector('#linkNotePrivate').value;
  try {
    const response = await fetch('/seguinleo-notes/assets/php/privateNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(id)}&noteLink=${encodeURIComponent(link)}`,
    });
    if (response.ok) {
      publicNote.classList.remove('show');
      await showNotes();
    } else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#submitPublicNote').addEventListener('click', async () => {
  const id = document.querySelector('#idNotePublic').value;
  const link = Math.random().toString(36).substring(2, 15);
  try {
    const response = await fetch('/seguinleo-notes/assets/php/publicNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(id)}&noteLink=${link}`,
    });
    if (response.ok) {
      privateNote.classList.remove('show');
      await showNotes();
    } else showError('An error occurred...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#copyNoteLink').addEventListener('click', async () => {
  const link = document.querySelector('#copyNoteLink').textContent;
  const notification = document.querySelector('#copyNotification');
  navigator.clipboard.writeText(link);
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
});

document.querySelector('#copyNoteLink').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.querySelector('#copyNoteLink').click();
});

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#btnSort').addEventListener('click', () => sortBox.classList.add('show'));

document.querySelectorAll('input[name="sortNotes"]').forEach((element) => {
  element.addEventListener('change', () => {
    if (element.value === '1' || element.value === '2' || element.value === '3' || element.value === '4') {
      localStorage.setItem('sort_notes', element.value);
      showNotes();
    }
  });
});

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  if (localStorage.getItem('fingerprint') !== 'true') await showNotes();
  document.querySelectorAll('.resync').forEach((resync) => {
    resync.addEventListener('click', () => {
      window.location.reload();
    });
    resync.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') window.location.reload();
    });
  });
});
