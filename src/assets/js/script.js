let isUpdate = false;
let timeoutCopy = null;
let timeoutNotification = null;
let touchstartX = 0;
let touchendX = 0;
const noteBox = document.querySelector('#note-popup-box');
const connectBox = document.querySelector('#connect-box');
const sortBox = document.querySelector('#sort-popup-box');
const filterBox = document.querySelector('#filter-popup-box');
const createBox = document.querySelector('#create-box');
const popupBoxSettings = document.querySelector('#settings-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const colors = document.querySelectorAll('#colors span');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('#sideBar');
const metaTheme = document.querySelectorAll('.themecolor');
const buttonTheme = document.querySelector('#iconTheme');
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
if (localStorage.getItem('version') === 'hide') document.querySelector('#newVersion').style.display = 'none';
if (localStorage.getItem('sort_notes') === null) localStorage.setItem('sort_notes', '3');

function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
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

const searchSideBar = () => {
  sideBar.querySelectorAll('#listNotes p').forEach((e) => {
    e.addEventListener('click', () => {
      const titleList = e.querySelector('.titleList').textContent;
      document.querySelectorAll('.note').forEach((note) => {
        const title = note.querySelector('.title').textContent;
        if (title === titleList) {
          note.scrollIntoView();
          note.focus();
        }
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

// eslint-disable-next-line no-undef
const converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('tasklists', true);
converter.setOption('strikethrough', true);
converter.setOption('parseImgDimensions', true);
converter.setOption('simpleLineBreaks', true);
converter.setOption('simplifiedAutoLink', true);

function arrayBufferToBase64(buffer) {
  const binary = [];
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i += 1) binary.push(String.fromCharCode(bytes[i]));
  return btoa(binary.join(''));
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
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
  document.querySelector('#psswdGen').value = password;
  document.querySelector('#psswdCreate').value = password;
  document.querySelector('#psswdCreateValid').value = password;
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
  document.querySelectorAll('#listNotes p').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());
  forms.forEach((form) => form.reset());

  if (notesJSON.length === 0) return;

  const dbName = 'notes_db';
  const objectStoreName = 'key';
  const db = await openIndexedDB(dbName, objectStoreName);
  const key = await getKeyFromDB(db, objectStoreName);

  if (localStorage.getItem('sort_notes') === '1') {
    notesJSON.sort((a, b) => b.id - a.id);
    document.querySelector('input[name="sortNotes"][value="1"]').checked = true;
  } else if (localStorage.getItem('sort_notes') === '2') {
    notesJSON.sort((a, b) => a.id - b.id);
    document.querySelector('input[name="sortNotes"][value="2"]').checked = true;
  } else if (localStorage.getItem('sort_notes') === '4') {
    notesJSON.sort((a, b) => new Date(a.date) - new Date(b.date));
    document.querySelector('input[name="sortNotes"][value="4"]').checked = true;
  } else {
    notesJSON.sort((a, b) => new Date(b.date) - new Date(a.date));
    document.querySelector('input[name="sortNotes"][value="3"]').checked = true;
  }

  notesJSON.forEach(async (row, id) => {
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
    const contentHtml = converter.makeHtml(deContentString);
    const noteElement = document.createElement('div');
    const detailsElement = document.createElement('div');
    const titleElement = document.createElement('h2');
    const contentElement = document.createElement('span');
    const bottomContentElement = document.createElement('div');
    const editIconElement = document.createElement('i');
    const trashIconElement = document.createElement('i');
    const paragraph = document.createElement('p');
    const titleSpan = document.createElement('span');
    const dateSpan = document.createElement('span');

    noteElement.id = `note${id}`;
    noteElement.classList.add('note', color);
    noteElement.tabIndex = 0;
    noteElement.setAttribute('data-note-id', id);
    noteElement.setAttribute('data-note-title', deTitleString);
    noteElement.setAttribute('data-note-content', deContentString);
    noteElement.setAttribute('data-note-color', color);
    noteElement.setAttribute('data-note-hidden', hidden);
    noteElement.setAttribute('data-note-category', category);
    detailsElement.classList.add('details');
    titleElement.classList.add('title');
    titleElement.textContent = deTitleString;

    if (hidden === false) contentElement.innerHTML = contentHtml;
    else contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

    detailsElement.appendChild(titleElement);
    detailsElement.appendChild(contentElement);
    bottomContentElement.classList.add('bottom-content');
    editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
    editIconElement.tabIndex = 0;
    editIconElement.setAttribute('role', 'button');
    editIconElement.setAttribute('aria-label', 'Edit');
    trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
    trashIconElement.tabIndex = 0;
    trashIconElement.setAttribute('role', 'button');
    trashIconElement.setAttribute('aria-label', 'Delete');
    bottomContentElement.appendChild(editIconElement);
    bottomContentElement.appendChild(trashIconElement);

    if (hidden === false && deContentString !== '') {
      const clipboardIconElement = document.createElement('i');
      clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
      clipboardIconElement.tabIndex = 0;
      clipboardIconElement.setAttribute('role', 'button');
      clipboardIconElement.setAttribute('aria-label', 'Copy');
      bottomContentElement.appendChild(clipboardIconElement);

      const downloadIconElement = document.createElement('i');
      downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
      downloadIconElement.tabIndex = 0;
      downloadIconElement.setAttribute('role', 'button');
      downloadIconElement.setAttribute('aria-label', 'Download');
      bottomContentElement.appendChild(downloadIconElement);

      const expandIconElement = document.createElement('i');
      expandIconElement.classList.add('fa-solid', 'fa-expand', 'note-action');
      expandIconElement.tabIndex = 0;
      expandIconElement.setAttribute('role', 'button');
      expandIconElement.setAttribute('aria-label', 'Expand');
      bottomContentElement.appendChild(expandIconElement);
    }

    noteElement.appendChild(detailsElement);
    noteElement.appendChild(bottomContentElement);
    paragraph.setAttribute('tabindex', '0');
    paragraph.setAttribute('role', 'button');
    titleSpan.classList.add('titleList');
    titleSpan.textContent = deTitleString;
    dateSpan.classList.add('dateList');
    dateSpan.textContent = date;

    if (category !== '0') {
      const categoryElement = document.createElement('span');
      categoryElement.classList.add('category');
      categoryElement.textContent = document.querySelector(`input[name="category"][value="${category}"]`).parentElement.textContent;
      paragraph.appendChild(categoryElement);
    }

    document.querySelector('main').appendChild(noteElement);
    paragraph.appendChild(titleSpan);
    paragraph.appendChild(dateSpan);
    sideBar.querySelector('#listNotes').appendChild(paragraph);
    searchSideBar();
  });
  document.querySelector('#last-sync span').textContent = new Date().toLocaleTimeString();
};

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
    if (localStorage.getItem('fingerprint') === 'true') window.location.href = '/error/403/';
    else document.querySelector('#checkFingerprint').checked = false;
  }
};

if (localStorage.getItem('fingerprint') === 'true') {
  verifyFingerprint();
  document.querySelector('#checkFingerprint').checked = true;
}

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
  document.body.classList.toggle('body-fullscreen');
};

const updateNote = (id, title, content, color, hidden, category) => {
  isUpdate = true;
  document.querySelectorAll('.note').forEach((note) => note.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  document.querySelector('#idNote').value = id;
  document.querySelector('#iconAdd').click();
  titleNote.value = title;
  contentNote.value = content;
  colors.forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selected');
    else e.classList.remove('selected');
  });
  document.querySelector(`input[name="category"][value="${category}"]`).checked = true;
  if (hidden === 'true') document.querySelector('#checkHidden').checked = true;
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
  // eslint-disable-next-line no-alert
  if (window.confirm(message)) {
    notesJSON.splice(e, 1);
    localStorage.setItem('local_notes', JSON.stringify(notesJSON));
    showNotes();
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
    const noteCategory = target.closest('.note').getAttribute('data-note-category');
    if (target.classList.contains('fa-pen')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteCategory);
    else if (target.classList.contains('fa-clipboard')) copy(noteContent);
    else if (target.classList.contains('fa-trash-can')) deleteNote(noteId);
    else if (target.classList.contains('fa-expand')) toggleFullscreen(noteId);
    else if (target.classList.contains('fa-download')) downloadNote(noteTitle, noteContent);
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

document.querySelectorAll('.log-in').forEach((e) => {
  e.addEventListener('click', () => {
    connectBox.classList.add('show');
    document.querySelector('#nameConnect').focus();
  });
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#create-account').addEventListener('click', () => {
  connectBox.classList.remove('show');
  createBox.classList.add('show');
  document.querySelector('#nameCreate').focus();
});

document.querySelectorAll('#settings').forEach((e) => {
  e.addEventListener('click', () => {
    popupBoxSettings.classList.add('show');
    popupBoxSettings.querySelector('i').focus();
    sideBar.classList.remove('show');
  });
});

document.querySelector('#checkFingerprint').addEventListener('change', () => {
  if (document.querySelector('#checkFingerprint').checked) verifyFingerprint();
  else localStorage.removeItem('fingerprint');
});

document.querySelectorAll('#iconAdd, #iconFloatAdd').forEach((e) => {
  e.addEventListener('click', () => {
    noteBox.classList.add('show');
    document.querySelector('#title').focus();
    document.querySelector('#textareaLength').textContent = '0/5000';
  });
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

document.querySelectorAll('header i').forEach((e) => {
  e.addEventListener('click', () => {
    isUpdate = false;
    forms.forEach((form) => form.reset());
    noteBox.classList.remove('show');
    connectBox.classList.remove('show');
    createBox.classList.remove('show');
    sortBox.classList.remove('show');
    filterBox.classList.remove('show');
    popupBoxSettings.classList.remove('show');
  });
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#export-all-notes').addEventListener('click', () => {
  if (document.querySelector('.note') === null) return;
  const notes = [];
  document.querySelectorAll('.note').forEach((e) => {
    const title = e.querySelector('.title').textContent;
    const content = e.querySelector('.details span').textContent;
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

document.querySelector('#newVersion header i').addEventListener('click', () => {
  document.querySelector('#newVersion').style.display = 'none';
  localStorage.setItem('version', 'hide');
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

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#btnFilter').addEventListener('click', () => filterBox.classList.add('show'));
document.querySelector('#btnSort').addEventListener('click', () => sortBox.classList.add('show'));
document.querySelector('#submitGenPsswd').addEventListener('click', () => getPassword(16));
forms.forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()));

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

document.querySelectorAll('input[name="sortNotes"]').forEach((e) => {
  e.addEventListener('change', () => {
    if (e.value === '1' || e.value === '2' || e.value === '3' || e.value === '4') {
      localStorage.setItem('sort_notes', e.value);
      showNotes();
    }
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

document.querySelector('#createForm').addEventListener('submit', async () => {
  const e = document.querySelector('#nameCreate').value.trim();
  const t = document.querySelector('#psswdCreate').value;
  const o = document.querySelector('#psswdCreateValid').value;
  if (!e || !t || !o || e.length < 4 || e.length > 25 || t.length < 6 || t.length > 50) return;
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
    const response = await fetch('/seguinleo-notes/assets/php/createUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nameCreate=${nameCreate}&psswdCreate=${psswdCreate}&csrf_token_create=${document.querySelector('#csrf_token_create').value}`,
    });
    if (response.ok) {
      createBox.classList.remove('show');
      forms.forEach((form) => form.reset());
      let message = '';
      if (window.location.href.endsWith('/en/')) message = 'Account created successfully! You can now log in.';
      else if (window.location.href.endsWith('/de/')) message = 'Konto erfolgreich erstellt! Sie können sich jetzt anmelden.';
      else if (window.location.href.endsWith('/es/')) message = '¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.';
      else message = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
      showSuccess(message);
    } else showError('Username already taken...');
  } catch (error) {
    showError('An error occurred...');
  }
});

document.querySelector('#connectForm').addEventListener('submit', async () => {
  const e = document.querySelector('#nameConnect').value.trim();
  const t = document.querySelector('#psswdConnect').value;
  if (!e || !t || e.length > 25 || t.length > 50 || !/^[a-zA-ZÀ-ÿ -]+$/.test(e)) return;
  const nameConnect = encodeURIComponent(e);
  const psswdConnect = encodeURIComponent(t);
  try {
    const response = await fetch('/seguinleo-notes/assets/php/connectUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nameConnect=${nameConnect}&psswdConnect=${psswdConnect}&csrf_token_connect=${document.querySelector('#csrf_token_connect').value}`,
    });
    if (response.ok) window.location.reload();
    else {
      document.querySelector('#psswdConnect').value = '';
      let time = 10;
      const btn = document.querySelector('#connectForm').querySelector('button[type="submit"]');
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
  }
});

document.querySelector('#addNote').addEventListener('submit', async () => {
  const title = titleNote.value.trim();
  // eslint-disable-next-line no-undef
  const content = DOMPurify.sanitize(contentNote.value.trim());
  const color = document.querySelector('#colors .selected').classList[0];
  const hidden = document.querySelector('#checkHidden').checked;
  const category = document.querySelector('input[name="category"]:checked').value;

  if (!title || title.length > 30 || content.length > 5000 || !color) return;

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
    new TextEncoder().encode(JSON.stringify(content)),
  );

  const note = {
    id: notesJSON.length,
    title: arrayBufferToBase64(enTitle),
    content: arrayBufferToBase64(enContent),
    color,
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    hidden,
    category,
  };

  if (isUpdate) {
    isUpdate = false;
    notesJSON[document.querySelector('#idNote').value] = note;
  } else notesJSON.push(note);

  localStorage.setItem('local_notes', JSON.stringify(notesJSON));
  noteBox.classList.remove('show');
  showNotes();
});

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  if (localStorage.getItem('fingerprint') !== 'true') await showNotes();
  document.querySelector('#last-sync').addEventListener('click', () => window.location.reload());
});
