/* eslint-disable no-alert */
let isUpdate = false;
let timeoutCopy = null;
let timeoutNotification = null;
let touchstartX = 0;
let touchendX = 0;
const noteBox = document.querySelector('.note-popup-box');
const connectBox = document.querySelector('.connect-box');
const sortBox = document.querySelector('.sort-popup-box');
const createBox = document.querySelector('.create-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const colors = document.querySelectorAll('.colors span');
const switchElement = document.querySelector('.switch');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('.sideBar');
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

// eslint-disable-next-line no-undef
const converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('tasklists', true);
converter.setOption('strikethrough', true);
converter.setOption('parseImgDimensions', true);
converter.setOption('simpleLineBreaks', true);

function arrayBufferToBase64(buffer) {
  const binary = [];
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary.push(String.fromCharCode(bytes[i]));
  }
  return btoa(binary.join(''));
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray.buffer;
}

function getPassword(length) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?!@#$%^&(){}[]<>+-*/|=.,;_'~";
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i += 1) {
    password += chars[array[i] % chars.length];
  }
  document.querySelector('#psswdGen').value = password;
  document.querySelector('#psswdCreate').value = password;
  document.querySelector('#psswdCreateValid').value = password;
}

async function openIndexedDB(dbName, objectStoreName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(objectStoreName)) {
        db.createObjectStore(objectStoreName);
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function getKeyFromDB(db, objectStoreName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);
    const request = objectStore.get('encryptionKey');
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function storeKeyInDB(db, objectStoreName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(objectStoreName, 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    objectStore.put(key, 'encryptionKey');
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

const showNotes = async () => {
  document.querySelector('.sideBar .listNotes').textContent = '';
  document.querySelectorAll('.note').forEach((note) => note.remove());
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

  notesJSON
    .forEach(async (row, id) => {
      const {
        title, content, color, date, hidden,
      } = row;

      if (!title) return;

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

      const deTitleString = JSON.parse(new TextDecoder().decode(new Uint8Array(deTitle)));
      const deContentString = JSON.parse(new TextDecoder().decode(new Uint8Array(deContent)));
      const contentHtml = converter.makeHtml(deContentString);
      // eslint-disable-next-line no-undef
      const contentHtmlPurify = DOMPurify.sanitize(contentHtml);
      const noteElement = document.createElement('div');
      noteElement.id = `note${id}`;
      noteElement.classList.add('note', color);
      noteElement.tabIndex = 0;
      noteElement.setAttribute('data-note-id', id);
      noteElement.setAttribute('data-note-title', deTitleString);
      noteElement.setAttribute('data-note-content', deContentString);
      noteElement.setAttribute('data-note-color', color);
      noteElement.setAttribute('data-note-hidden', hidden);

      const detailsElement = document.createElement('div');
      detailsElement.classList.add('details');

      const titleElement = document.createElement('h2');
      titleElement.classList.add('title');
      titleElement.textContent = deTitleString;

      const contentElement = document.createElement('span');

      if (hidden === false) contentElement.innerHTML = contentHtmlPurify;
      else contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(contentElement);

      const bottomContentElement = document.createElement('div');
      bottomContentElement.classList.add('bottom-content');

      const editIconElement = document.createElement('i');
      editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
      editIconElement.tabIndex = 0;
      editIconElement.setAttribute('role', 'button');
      editIconElement.setAttribute('aria-label', 'Edit');

      const trashIconElement = document.createElement('i');
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
      document.querySelector('main').appendChild(noteElement);

      const paragraph = document.createElement('p');
      paragraph.setAttribute('tabindex', '0');
      paragraph.setAttribute('role', 'button');

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('titleList');
      titleSpan.textContent = deTitleString;

      const dateSpan = document.createElement('span');
      dateSpan.classList.add('dateList');
      dateSpan.textContent = date;
      paragraph.appendChild(titleSpan);
      paragraph.appendChild(dateSpan);
      sideBar.querySelector('.listNotes').appendChild(paragraph);
      searchSideBar();
    });
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
};

const updateNote = (id, title, content, color, hidden) => {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  document.querySelector('#idNote').value = id;
  isUpdate = true;
  document.querySelector('.icon').click();
  titleNote.value = title;
  contentNote.value = content;
  colors.forEach((colorSpan) => {
    if (colorSpan.classList.contains(color)) colorSpan.classList.add('selectionne');
    else colorSpan.classList.remove('selectionne');
  });
  if (hidden === 'true') { document.querySelector('#checkHidden').checked = true; }
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

    if (target.classList.contains('fa-pen')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden);
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

document.querySelectorAll('.log-in').forEach((element) => {
  element.addEventListener('click', () => {
    connectBox.classList.add('show');
    document.querySelector('#nameConnect').focus();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

switchElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const checkbox = switchElement.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    switchElement.classList.toggle('checked');
  }
});

document.querySelector('#create-account').addEventListener('click', () => {
  connectBox.classList.remove('show');
  createBox.classList.add('show');
  document.querySelector('#nameCreate').focus();
});

document.querySelector('#submitCreate').addEventListener('click', async () => {
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

document.querySelector('#submitLogIn').addEventListener('click', async () => {
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
      const btn = document.querySelector('#submitLogIn');
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

document.querySelectorAll('.icon, .iconFloat').forEach((element) => {
  element.addEventListener('click', () => {
    noteBox.classList.add('show');
    document.querySelector('#title').focus();
    document.querySelector('#textareaLength').textContent = '0/5000';
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
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
  const colorSpan = document.querySelector('.colors span.selectionne');
  const color = colorSpan.classList[0];
  const title = titleNote.value.trim();
  const content = contentNote.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const hidden = document.querySelector('#checkHidden').checked;
  if (!title || title.length > 30 || content.length > 5000) return;
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
  };

  if (isUpdate) {
    isUpdate = false;
    notesJSON[document.querySelector('#idNote').value] = note;
  } else notesJSON.push(note);

  localStorage.setItem('local_notes', JSON.stringify(notesJSON));
  noteBox.classList.remove('show');
  showNotes();
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
    connectBox.classList.remove('show');
    createBox.classList.remove('show');
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

document.querySelector('#btnSort').addEventListener('click', () => sortBox.classList.add('show'));

document.querySelector('#submitGenPsswd').addEventListener('click', () => getPassword(16));

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
  await showNotes();
});
