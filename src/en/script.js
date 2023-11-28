/* eslint-disable no-alert */
let isUpdate = false;
let timeoutCopy = null;
let timeoutError = null;
let touchstartX = 0;
let touchendX = 0;
const notesContainer = document.querySelector('main');
const noteBox = document.querySelector('.note-popup-box');
const connectBox = document.querySelector('.connect-box');
const sortBox = document.querySelector('.sort-popup-box');
const creerBox = document.querySelector('.creer-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const couleurs = document.querySelectorAll('.couleurs span');
const switchElement = document.querySelector('.switch');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('.sideBar');
const notesJSON = JSON.parse(localStorage.getItem('local_notes') || '[]');
const metaTheme = document.querySelectorAll('.themecolor');
const button = document.querySelector('#iconeTheme');

if (localStorage.getItem('theme') === 'light') {
  document.querySelector('html').className = 'light';
  metaTheme.forEach((e) => {
    e.content = '#eeeeee';
  });
  button.className = 'fa-solid fa-lightbulb';
} else if (localStorage.getItem('theme') === 'dusk') {
  document.querySelector('html').className = 'dusk';
  metaTheme.forEach((e) => {
    e.content = '#1c1936';
  });
  button.className = 'fa-solid fa-star';
}

if (localStorage.getItem('version') === 'hide') {
  document.querySelector('#newVersion').style.display = 'none';
}

if (localStorage.getItem('sort_notes') === null) {
  localStorage.setItem('sort_notes', '3');
}

const replaceAllStart = (e) => e.replaceAll('<br /><br />', '\n\n').replaceAll('<br />', '\n');
const replaceAllEnd = (e) => e.replaceAll('\n\n', '<br /><br />').replaceAll('\n', '<br />');

const showError = (message) => {
  if (timeoutError) clearTimeout(timeoutError);
  const notification = document.querySelector('#errorNotification');
  notification.textContent = message;
  notification.style.display = 'block';
  timeoutError = setTimeout(() => {
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

const openSidebar = () => {
  sideBar.classList.add('show');
};

const closeSidebar = () => {
  sideBar.classList.remove('show');
};

const handleGesture = () => {
  if (touchendX - touchstartX > 75 && !sideBar.classList.contains('show')) {
    openSidebar();
  }
  if (touchendX - touchstartX < -75 && sideBar.classList.contains('show')) {
    closeSidebar();
  }
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
  document.querySelector('#mdpCreerGen').value = password;
  document.querySelector('#mdpCreer').value = password;
  document.querySelector('#mdpCreerValid').value = password;
}

document.querySelector('#submitGenMdp').addEventListener('click', () => {
  getPassword(16);
});

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

  if (notesJSON.length === 0) {
    document.querySelector('.sideBar h2').textContent = 'Notes (0)';
    return;
  }

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
        title, content, couleur, date, hidden,
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

      const descEnd = replaceAllEnd(deContentString);
      const descHtml = converter.makeHtml(deContentString);
      const noteElement = document.createElement('div');
      noteElement.id = `note${id}`;
      noteElement.classList.add('note', couleur);
      noteElement.tabIndex = 0;
      const detailsElement = document.createElement('div');
      detailsElement.classList.add('details');
      const titleElement = document.createElement('h2');
      titleElement.classList.add('title');
      titleElement.textContent = deTitleString;
      const descElement = document.createElement('span');

      if (hidden === false) {
        descElement.innerHTML = descHtml;
      } else {
        descElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      }

      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(descElement);
      const bottomContentElement = document.createElement('div');
      bottomContentElement.classList.add('bottom-content');
      const editIconElement = document.createElement('i');
      editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
      editIconElement.tabIndex = 0;
      editIconElement.setAttribute('data-note-id', id);
      editIconElement.setAttribute('data-note-title', deTitleString);
      editIconElement.setAttribute('data-note-desc', descEnd);
      editIconElement.setAttribute('data-note-color', couleur);
      editIconElement.setAttribute('data-note-hidden', hidden);
      editIconElement.setAttribute('role', 'button');
      editIconElement.setAttribute('aria-label', 'Edit note');
      const trashIconElement = document.createElement('i');
      trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
      trashIconElement.tabIndex = 0;
      trashIconElement.setAttribute('data-note-id', id);
      trashIconElement.setAttribute('role', 'button');
      trashIconElement.setAttribute('aria-label', 'Delete note');
      bottomContentElement.appendChild(editIconElement);
      bottomContentElement.appendChild(trashIconElement);

      if (hidden === false && descEnd !== '') {
        const clipboardIconElement = document.createElement('i');
        clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
        clipboardIconElement.tabIndex = 0;
        clipboardIconElement.setAttribute('data-note-desc', descEnd);
        clipboardIconElement.setAttribute('role', 'button');
        clipboardIconElement.setAttribute('aria-label', 'Copy note');
        bottomContentElement.appendChild(clipboardIconElement);

        const downloadIconElement = document.createElement('i');
        downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
        downloadIconElement.tabIndex = 0;
        downloadIconElement.setAttribute('data-note-id', id);
        downloadIconElement.setAttribute('data-note-title', deTitleString);
        downloadIconElement.setAttribute('data-note-desc', descEnd);
        downloadIconElement.setAttribute('role', 'button');
        downloadIconElement.setAttribute('aria-label', 'Download note');
        bottomContentElement.appendChild(downloadIconElement);

        const expandIconElement = document.createElement('i');
        expandIconElement.classList.add('fa-solid', 'fa-expand', 'note-action');
        expandIconElement.tabIndex = 0;
        expandIconElement.setAttribute('data-note-id', id);
        expandIconElement.setAttribute('role', 'button');
        expandIconElement.setAttribute('aria-label', 'Expand note');
        bottomContentElement.appendChild(expandIconElement);
      }

      noteElement.appendChild(detailsElement);
      noteElement.appendChild(bottomContentElement);
      notesContainer.appendChild(noteElement);
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
  document.querySelector('h2').textContent = `Notes (${notesJSON.length})`;
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
};

const updateNote = (id, title, desc, couleur, hidden) => {
  const s = replaceAllStart(desc);
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  document.querySelector('#idNoteInput').value = id;
  isUpdate = true;
  document.querySelector('.icon').click();
  titleNote.value = title;
  contentNote.value = s;
  couleurs.forEach((couleurSpan) => {
    if (couleurSpan.classList.contains(couleur)) {
      couleurSpan.classList.add('selectionne');
    } else {
      couleurSpan.classList.remove('selectionne');
    }
  });
  if (hidden === 'true') { document.querySelector('#checkHidden').checked = true; }
  document.querySelector('#textareaLength').textContent = `${contentNote.value.length}/5000`;
  contentNote.focus();
};

const downloadNote = (e, t) => {
  const a = document.createElement('a');
  const noteTitle = e;
  const noteDesc = t;
  const noteDescEnd = replaceAllEnd(noteDesc);
  const noteDescTxt = replaceAllStart(noteDescEnd);
  a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(noteDescTxt)}`);
  a.setAttribute('download', `${noteTitle}.txt`);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const copy = (e) => {
  if (timeoutCopy) clearTimeout(timeoutCopy);
  const copyText = replaceAllStart(e);
  const notification = document.querySelector('#copyNotification');
  navigator.clipboard.writeText(copyText);
  notification.classList.add('show');
  timeoutCopy = setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

const deleteNote = (e) => {
  if (window.confirm('Do you really want to delete this note?')) {
    notesJSON.splice(e, 1);
    localStorage.setItem('local_notes', JSON.stringify(notesJSON));
    showNotes();
  }
};

notesContainer.addEventListener('click', (event) => {
  const { target } = event;
  if (target.classList.contains('note-action')) {
    const noteId = target.getAttribute('data-note-id');
    const noteTitle = target.getAttribute('data-note-title');
    const noteDesc = target.getAttribute('data-note-desc');
    const noteColor = target.getAttribute('data-note-color');
    const noteHidden = target.getAttribute('data-note-hidden');

    if (target.classList.contains('fa-pen')) {
      updateNote(noteId, noteTitle, noteDesc, noteColor, noteHidden);
    } else if (target.classList.contains('fa-clipboard')) {
      copy(noteDesc);
    } else if (target.classList.contains('fa-trash-can')) {
      deleteNote(noteId);
    } else if (target.classList.contains('fa-expand')) {
      toggleFullscreen(noteId);
    } else if (target.classList.contains('fa-download')) {
      downloadNote(noteTitle, noteDesc);
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-clipboard')) {
      document.activeElement.click();
    } else if (document.activeElement.classList.contains('fa-trash-can')) {
      document.activeElement.click();
    } else if (document.activeElement.classList.contains('fa-pen')) {
      document.activeElement.click();
    } else if (document.activeElement.classList.contains('fa-expand')) {
      document.activeElement.click();
    } else if (document.activeElement.classList.contains('fa-download')) {
      document.activeElement.click();
    }
  } else if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

document.querySelectorAll('.seconnecter').forEach((element) => {
  element.addEventListener('click', () => {
    connectBox.classList.add('show');
    document.querySelector('#nomConnect').focus();
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

document.querySelectorAll('.creercompte').forEach((element) => {
  element.addEventListener('click', () => {
    connectBox.classList.remove('show');
    creerBox.classList.add('show');
    document.querySelector('#nomCreer').focus();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelector('#submitCreer').addEventListener('click', async () => {
  const e = document.querySelector('#nomCreer').value.trim();
  const t = document.querySelector('#mdpCreer').value;
  const o = document.querySelector('#mdpCreerValid').value;
  if (!e || !t || !o || e.length < 4 || e.length > 25 || t.length < 6 || t.length > 50) return;
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    showError('The name can only contain letters...');
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
    showError('The password must be different from the name...');
    return;
  }
  const nomCreer = encodeURIComponent(e);
  const mdpCreer = encodeURIComponent(t);
  try {
    const response = await fetch('../assets/php/createUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nomCreer=${nomCreer}&mdpCreer=${mdpCreer}&csrf_token_creer=${document.querySelector('#csrf_token_creer').value}`,
    });
    if (response.ok) {
      creerBox.classList.remove('show');

      forms.forEach((form) => form.reset());
      alert('Account created successfully! You can now log in.');
      return;
    }
    showError('User already exists...');
  } catch (error) {
    showError('An error occurred while creating the account...');
  }
});

document.querySelector('#submitSeConnecter').addEventListener('click', async () => {
  const e = document.querySelector('#nomConnect').value.trim();
  const t = document.querySelector('#mdpConnect').value;
  if (!e || !t || e.length > 25 || t.length > 50 || !/^[a-zA-ZÀ-ÿ -]+$/.test(e)) return;
  const nomConnect = encodeURIComponent(e);
  const mdpConnect = encodeURIComponent(t);
  try {
    const response = await fetch('../assets/php/connectUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nomConnect=${nomConnect}&mdpConnect=${mdpConnect}&csrf_token_connect=${document.querySelector('#csrf_token_connect').value}`,
    });
    if (response.ok) {
      window.location.reload();
    } else {
      document.querySelector('#mdpConnect').value = '';
      let time = 10;
      const btn = document.querySelector('#submitSeConnecter');
      btn.disabled = true;
      showError('Wrong credentials...');
      const interval = setInterval(() => {
        time -= 1;
        btn.textContent = `Sign in (${time})`;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        btn.disabled = false;
        btn.textContent = 'Sign in';
      }, 11000);
    }
  } catch (error) {
    showError('An error occurred while signing in...');
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

couleurs.forEach((span, index) => {
  span.addEventListener('click', (event) => {
    couleurs.forEach((s) => {
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
  const couleurSpan = document.querySelector('.couleurs span.selectionne');
  const couleur = couleurSpan.classList[0];
  const title = titleNote.value.trim();
  const content = contentNote.value.trim();
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
    couleur,
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    hidden,
  };

  if (isUpdate) {
    isUpdate = false;
    notesJSON[document.querySelector('#idNoteInput').value] = note;
  } else {
    notesJSON.push(note);
  }

  localStorage.setItem('local_notes', JSON.stringify(notesJSON));
  noteBox.classList.remove('show');
  showNotes();
});

document.querySelectorAll('#menuIcon').forEach((element) => {
  element.addEventListener('click', () => {
    openSidebar();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      element.click();
      document.querySelector('.sideBar header i').focus();
    }
  });
});

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
    creerBox.classList.remove('show');
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
    if (t.includes(e)) {
      note.style.display = 'flex';
    } else {
      note.style.display = 'none';
    }
  });
});

document.querySelector('#btnTheme').addEventListener('click', () => {
  if (localStorage.getItem('theme') === null) {
    document.querySelector('html').className = 'light';
    metaTheme.forEach((e) => {
      e.content = '#eeeeee';
    });
    button.className = 'fa-solid fa-lightbulb';
    localStorage.setItem('theme', 'light');
    return;
  }
  if (localStorage.getItem('theme') === 'dark') {
    document.querySelector('html').className = 'light';
    metaTheme.forEach((e) => {
      e.content = '#eeeeee';
    });
    button.className = 'fa-solid fa-lightbulb';
    localStorage.setItem('theme', 'light');
  } else if (localStorage.getItem('theme') === 'dusk') {
    document.querySelector('html').className = 'dark';
    metaTheme.forEach((e) => {
      e.content = '#171717';
    });
    button.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    document.querySelector('html').className = 'dusk';
    metaTheme.forEach((e) => {
      e.content = '#1c1936';
    });
    button.className = 'fa-solid fa-star';
    localStorage.setItem('theme', 'dusk');
  }
});

document.querySelector('#newVersion header i').addEventListener('click', () => {
  document.querySelector('#newVersion').style.display = 'none';
  localStorage.setItem('version', 'hide');
});

document.querySelector('#language').addEventListener('change', () => {
  const e = document.querySelector('#language').value;
  if (e === 'fr') {
    window.location.href = '../';
  } else if (e === 'en') {
    window.location.href = '../en/';
  } else if (e === 'de') {
    window.location.href = '../de/';
  }
});

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#btnSort').addEventListener('click', () => {
  sortBox.classList.add('show');
});

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
