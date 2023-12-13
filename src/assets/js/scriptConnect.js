/* eslint-disable no-use-before-define */
let isUpdate = false;
let timeoutCopy = null;
let timeoutNotification = null;
let touchstartX = 0;
let touchendX = 0;
const noteBox = document.querySelector('.note-popup-box');
const sortBox = document.querySelector('.sort-popup-box');
const filterBox = document.querySelector('.filter-popup-box');
const popupBoxManage = document.querySelector('.manage-popup-box');
const privateNote = document.querySelector('.private-note-popup-box');
const publicNote = document.querySelector('.public-note-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const switchElement = document.querySelectorAll('.switch');
const colors = document.querySelectorAll('.colors span');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('.sideBar');
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

const showNotes = async () => {
  document.querySelectorAll('.listNotes p').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());
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

  data.forEach((row) => {
    const {
      id, title, content, color, date, hidden, category, link,
    } = row;

    if (!id || !title || !color || !date) return;

    const contentHtml = converter.makeHtml(content);
    // eslint-disable-next-line no-undef
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
    noteElement.setAttribute('data-note-category', category);
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

    if (category !== 0) {
      const categoryElement = document.createElement('span');
      categoryElement.classList.add('category');
      categoryElement.textContent = document.querySelector(`input[name="category"][value="${category}"]`).parentElement.textContent;
      detailsElement.appendChild(categoryElement);
    }

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
    if (link !== '') {
      const iconLink = document.createElement('i');
      iconLink.classList.add('fa-solid', 'fa-link');
      titleSpan.appendChild(iconLink);
    }

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('dateList');
    dateSpan.textContent = date;

    if (category !== 0) {
      const categoryElement = document.createElement('span');
      categoryElement.classList.add('category');
      categoryElement.textContent = document.querySelector(`input[name="category"][value="${category}"]`).parentElement.textContent;
      paragraph.appendChild(categoryElement);
    }

    paragraph.appendChild(titleSpan);
    paragraph.appendChild(dateSpan);
    sideBar.querySelector('.listNotes').appendChild(paragraph);
  });
  searchSideBar();
  noteActions();
  document.querySelector('#last-sync span').textContent = new Date().toLocaleTimeString();
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
    // eslint-disable-next-line no-unused-vars
    const credentialObject = {
      id: credential.id,
      rawId: credential.rawId,
      response: {
        attestationObject: credential.response.attestationObject,
        clientDataJSON: credential.response.clientDataJSON,
      },
      type: credential.type,
    };
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

const updateNote = (id, title, content, color, hidden, category, link) => {
  isUpdate = true;
  document.querySelectorAll('.note').forEach((e) => e.classList.remove('fullscreen'));
  document.querySelector('.iconConnect').click();
  document.querySelector('#idNote').value = id;
  document.querySelector('#checkLink').value = link;
  titleNote.value = title;
  contentNote.value = content;
  colors.forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selectionne');
    else e.classList.remove('selectionne');
  });
  document.querySelector(`input[name="category"][value="${category}"]`).checked = true;
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
  // eslint-disable-next-line no-alert
  if (window.confirm(message)) fetchDelete(e);
};

const noteAccess = (id, link) => {
  document.querySelectorAll('.note').forEach((e) => e.classList.remove('fullscreen'));
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

const searchSideBar = () => {
  sideBar.querySelectorAll('p').forEach((e) => {
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
      const noteLink = target.closest('.note').getAttribute('data-note-link');
      if (target.classList.contains('fa-pen')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteCategory, noteLink);
      else if (target.classList.contains('fa-clipboard')) copy(noteContent);
      else if (target.classList.contains('fa-trash-can')) deleteNote(noteId);
      else if (target.classList.contains('fa-expand')) toggleFullscreen(noteId);
      else if (target.classList.contains('fa-download')) downloadNote(noteTitle, noteContent);
      else if (target.classList.contains('fa-link')) noteAccess(noteId, noteLink, noteTitle, noteContent);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      document.querySelector('#search-input').focus();
    }
  });
};

switchElement.forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const checkbox = e.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
});

document.querySelectorAll('.iconConnect, .iconConnectFloat').forEach((e) => {
  e.addEventListener('click', () => {
    noteBox.classList.add('show');
    titleNote.focus();
    document.querySelector('#textareaLength').textContent = '0/5000';
  });
});

document.querySelector('#checkFingerprint').addEventListener('change', () => {
  if (document.querySelector('#checkFingerprint').checked) verifyFingerprint();
  else localStorage.removeItem('fingerprint');
});

document.querySelectorAll('input[name="sortNotes"]').forEach((e) => {
  if (e.value === localStorage.getItem('sort_notes')) e.checked = true;
});

document.querySelectorAll('.manage-account').forEach((e) => {
  e.addEventListener('click', () => {
    popupBoxManage.classList.add('show');
    popupBoxManage.querySelector('i').focus();
  });
});

document.querySelectorAll('.linkp').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#delete-account').addEventListener('click', () => {
  let message = '';
  if (window.location.href.endsWith('/en/')) message = 'Do you really want to delete your account as well as all your notes saved in the cloud? Your username will become available again for other users.';
  else if (window.location.href.endsWith('/de/')) message = 'Möchten Sie wirklich Ihr Konto sowie alle Ihre in der Cloud gespeicherten Notizen löschen? Ihr Benutzername wird für andere Benutzer wieder verfügbar.';
  else if (window.location.href.endsWith('/es/')) message = '¿Estás seguro de que quieres eliminar tu cuenta y todas tus notas almacenadas en la nube? Su nombre de usuario volverá a estar disponible para otros usuarios.';
  else message = 'Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ? Votre nom d\'utilisateur redeviendra disponible pour les autres utilisateurs.';
  // eslint-disable-next-line no-alert
  if (window.confirm(message)) deleteAccount();
});

document.querySelectorAll('header i').forEach((e) => {
  e.addEventListener('click', () => {
    isUpdate = false;
    forms.forEach((form) => form.reset());
    noteBox.classList.remove('show');
    popupBoxManage.classList.remove('show');
    publicNote.classList.remove('show');
    privateNote.classList.remove('show');
    sortBox.classList.remove('show');
    filterBox.classList.remove('show');
    closeSidebar();
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

document.querySelector('#newVersion header i').addEventListener('click', () => {
  document.querySelector('#newVersion').style.display = 'none';
  localStorage.setItem('version', 'hide');
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
    colors.forEach((e) => e.classList.remove('selectionne'));
    event.target.classList.add('selectionne');
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
  if (index === 0) span.classList.add('selectionne');
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

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#log-out').addEventListener('click', () => fetchLogout());
document.querySelector('#menuIcon').addEventListener('click', () => openSidebar());
document.querySelector('#btnSort').addEventListener('click', () => sortBox.classList.add('show'));
document.querySelector('#btnFilter').addEventListener('click', () => filterBox.classList.add('show'));
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

document.querySelector('#submitNote').addEventListener('click', async () => {
  try {
    const idNote = document.querySelector('#idNote').value;
    const titleBrut = titleNote.value.trim();
    const contentBrut = contentNote.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const title = encodeURIComponent(titleBrut);
    const content = encodeURIComponent(contentBrut);
    const color = encodeURIComponent(document.querySelector('.colors span.selectionne').classList[0]);
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hidden = document.querySelector('#checkHidden').checked ? '1' : '0';
    const category = document.querySelector('input[name="category"]:checked').value;
    const link = encodeURIComponent(document.querySelector('#checkLink').value);

    if (!titleBrut || !color || !date || titleBrut.length > 30 || contentBrut.length > 5000) return;
    if (isUpdate && !idNote) return;

    const data = isUpdate ? `noteId=${idNote}&title=${title}&content=${content}&color=${color}&date=${date}&hidden=${hidden}&category=${category}&link=${link}&csrf_token_note=${document.querySelector('#csrf_token_note').value}` : `title=${title}&content=${content}&color=${color}&date=${date}&hidden=${hidden}&category=${category}&csrf_token_note=${document.querySelector('#csrf_token_note').value}`;
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
  if (!id || !link) return;
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
  if (!id) return;
  const link = window.crypto.getRandomValues(new Uint8Array(10)).reduce((p, i) => p + (i % 36).toString(36), '');
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

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  if (localStorage.getItem('fingerprint') !== 'true') await showNotes();
  document.querySelector('#last-sync').addEventListener('click', () => window.location.reload());
});
