/* eslint-disable no-alert */
let isUpdate = false;
let timeoutCopy = null;
let timeoutError = null;
let touchstartX = 0;
let touchendX = 0;
const notesContainer = document.querySelector('main');
const noteBox = document.querySelector('.note-popup-box');
const sortBox = document.querySelector('.sort-popup-box');
const popupBoxGestion = document.querySelector('.gestion-popup-box');
const privateNote = document.querySelector('.private-note-popup-box');
const publicNote = document.querySelector('.public-note-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const switchElement = document.querySelector('.switch');
const couleurs = document.querySelectorAll('.couleurs span');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('.sideBar');
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

document.querySelectorAll('input[name="sortNotes"]').forEach((element) => {
  const e = element;
  if (e.value === localStorage.getItem('sort_notes')) e.checked = true;
});

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

const showNotes = async () => {
  document.querySelector('.sideBar .listNotes').textContent = '';
  document.querySelectorAll('.note').forEach((note) => note.remove());
  forms.forEach((form) => form.reset());

  const response = await fetch('../assets/php/getNotes.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `sort=${encodeURIComponent(localStorage.getItem('sort_notes'))}`,
  });

  const data = await response.json();

  if (data.length === 0) {
    document.querySelector('.sideBar h2').textContent = 'Notizen (0)';
    return;
  }

  document.querySelector('.lastSync span').textContent = new Date().toLocaleTimeString();

  data.forEach((row) => {
    const {
      id, title, desc, couleur, date, hidden, link,
    } = row;

    if (!id || !title) return;

    const descEnd = replaceAllEnd(desc);
    const descHtml = converter.makeHtml(desc);
    const noteElement = document.createElement('div');
    noteElement.id = `note${id}`;
    noteElement.classList.add('note', couleur);
    noteElement.tabIndex = 0;
    const detailsElement = document.createElement('div');
    detailsElement.classList.add('details');
    const titleElement = document.createElement('h2');
    titleElement.classList.add('title');
    titleElement.textContent = title;
    const descElement = document.createElement('span');

    if (hidden === 0) {
      descElement.innerHTML = DOMPurify.sanitize(descHtml);
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
    editIconElement.setAttribute('data-note-title', title);
    editIconElement.setAttribute('data-note-desc', descEnd);
    editIconElement.setAttribute('data-note-color', couleur);
    editIconElement.setAttribute('data-note-hidden', hidden);
    editIconElement.setAttribute('data-note-link', link);
    editIconElement.setAttribute('role', 'button');
    editIconElement.setAttribute('aria-label', 'Bearbeiten');
    bottomContentElement.appendChild(editIconElement);

    if (link === '') {
      const trashIconElement = document.createElement('i');
      trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
      trashIconElement.tabIndex = 0;
      trashIconElement.setAttribute('data-note-id', id);
      trashIconElement.setAttribute('role', 'button');
      trashIconElement.setAttribute('aria-label', 'Löschen');
      bottomContentElement.appendChild(trashIconElement);
    }

    if (hidden === 0 && desc !== '') {
      const clipboardIconElement = document.createElement('i');
      clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
      clipboardIconElement.tabIndex = 0;
      clipboardIconElement.setAttribute('data-note-desc', descEnd);
      clipboardIconElement.setAttribute('role', 'button');
      clipboardIconElement.setAttribute('aria-label', 'Kopieren');
      bottomContentElement.appendChild(clipboardIconElement);

      const downloadIconElement = document.createElement('i');
      downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
      downloadIconElement.tabIndex = 0;
      downloadIconElement.setAttribute('data-note-id', id);
      downloadIconElement.setAttribute('data-note-title', title);
      downloadIconElement.setAttribute('data-note-desc', descEnd);
      downloadIconElement.setAttribute('role', 'button');
      downloadIconElement.setAttribute('aria-label', 'Herunterladen');
      bottomContentElement.appendChild(downloadIconElement);

      const expandIconElement = document.createElement('i');
      expandIconElement.classList.add('fa-solid', 'fa-expand', 'note-action');
      expandIconElement.tabIndex = 0;
      expandIconElement.setAttribute('data-note-id', id);
      expandIconElement.setAttribute('role', 'button');
      expandIconElement.setAttribute('aria-label', 'Vollbild');
      bottomContentElement.appendChild(expandIconElement);

      const linkIconElement = document.createElement('i');
      linkIconElement.classList.add('fa-solid', 'fa-link', 'note-action');
      linkIconElement.tabIndex = 0;
      linkIconElement.setAttribute('data-note-id', id);
      linkIconElement.setAttribute('data-note-link', link);
      linkIconElement.setAttribute('role', 'button');
      linkIconElement.setAttribute('aria-label', 'Link');
      bottomContentElement.appendChild(linkIconElement);
    }

    noteElement.appendChild(detailsElement);
    noteElement.appendChild(bottomContentElement);
    notesContainer.appendChild(noteElement);
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
  sideBar.querySelector('h2').textContent = `Notas (${data.length})`;
  searchSideBar();
};

const fetchDelete = async (e) => {
  try {
    await fetch('../assets/php/deleteNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(e)}`,
    });
    await showNotes();
  } catch (error) {
    showError('Se produjo un error al eliminar la nota...');
  }
};

const deleteAccount = async () => {
  try {
    const response = await fetch('../assets/php/deleteAccount.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.ok) {
      window.location.reload();
      return;
    }
    showError('Se produjo un error al eliminar tu cuenta...');
  } catch (error) {
    showError('Se produjo un error al eliminar tu cuenta...');
  }
};

const fetchLogout = async () => {
  try {
    await fetch('../assets/php/logout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    window.location.reload();
  } catch (error) {
    showError('Se produjo un error al cerrar la sesión...');
  }
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
};

const updateNote = (id, title, desc, couleur, hidden, link) => {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  isUpdate = true;
  document.querySelector('.iconConnect').click();
  document.querySelector('#idNoteInput').value = id;
  document.querySelector('#checkLink').value = link;
  titleNote.value = title;
  contentNote.value = replaceAllStart(desc);
  couleurs.forEach((couleurSpan) => {
    if (couleurSpan.classList.contains(couleur)) {
      couleurSpan.classList.add('selectionne');
    } else {
      couleurSpan.classList.remove('selectionne');
    }
  });
  if (link === '') {
    document.querySelector('#checkHidden').disabled = false;
    if (hidden === '1') document.querySelector('#checkHidden').checked = true;
  } else {
    document.querySelector('#checkHidden').disabled = true;
  }
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
  if (window.confirm('¿Estás seguro que quieres eliminar esta nota?')) {
    fetchDelete(e);
  }
};

const noteAccess = (id, link) => {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  if (link === '') {
    privateNote.classList.add('show');
    document.querySelector('#idNoteInputPublic').value = id;
    privateNote.querySelector('i').focus();
  } else {
    publicNote.classList.add('show');
    document.querySelector('#idNoteInputPrivate').value = id;
    document.querySelector('#linkNoteInputPrivate').value = link;
    document.querySelector('#copyNoteLink').textContent = `${window.location.href.replace('/es/', '')}/share/${link}/`;
    publicNote.querySelector('i').focus();
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
    const noteLink = target.getAttribute('data-note-link');
    if (target.classList.contains('fa-pen')) {
      updateNote(noteId, noteTitle, noteDesc, noteColor, noteHidden, noteLink);
    } else if (target.classList.contains('fa-clipboard')) {
      copy(noteDesc);
    } else if (target.classList.contains('fa-trash-can')) {
      deleteNote(noteId);
    } else if (target.classList.contains('fa-expand')) {
      toggleFullscreen(noteId);
    } else if (target.classList.contains('fa-download')) {
      downloadNote(noteTitle, noteDesc);
    } else if (target.classList.contains('fa-link')) {
      noteAccess(noteId, noteLink, noteTitle, noteDesc);
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
    } else if (document.activeElement.classList.contains('fa-link')) {
      document.activeElement.click();
    }
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

document.querySelectorAll('.sedeconnecter').forEach((element) => {
  element.addEventListener('click', () => {
    fetchLogout();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') fetchLogout();
  });
});

document.querySelectorAll('.gestionCompte').forEach((element) => {
  element.addEventListener('click', () => {
    popupBoxGestion.classList.add('show');
    popupBoxGestion.querySelector('i').focus();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelectorAll('.supprimerCompte').forEach((element) => {
  element.addEventListener('click', () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta y todas tus notas almacenadas en la nube? Su nombre de usuario volverá a estar disponible para otros usuarios.')) {
      deleteAccount();
    }
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
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
    popupBoxGestion.classList.remove('show');
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

document.querySelector('.exportAll').addEventListener('click', () => {
  if (document.querySelector('.note') === null) {
    return;
  }
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
  if (e === 'fr') {
    window.location.href = '../';
  } else if (e === 'en') {
    window.location.href = '../en/';
  } else if (e === 'de') {
    window.location.href = '../de/';
  } else if (e === 'es') {
    window.location.href = '../es/';
  }
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
  try {
    const idNote = document.querySelector('#idNoteInput').value;
    const titreBrut = titleNote.value.trim();
    const contentBrut = contentNote.value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (!titreBrut || titreBrut.length > 30 || contentBrut.length > 5000) return;
    const titre = encodeURIComponent(titreBrut);
    const content = encodeURIComponent(contentBrut);
    const couleurSpan = document.querySelector('.couleurs span.selectionne');
    const couleur = encodeURIComponent(couleurSpan.classList[0]);
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const checkBox = document.querySelector('#checkHidden');
    const link = encodeURIComponent(document.querySelector('#checkLink').value);
    const hidden = checkBox.checked ? '1' : '0';
    const url = isUpdate ? '../assets/php/updateNote.php' : '../assets/php/addNote.php';
    const data = isUpdate ? `noteId=${idNote}&title=${titre}&desc=${content}&couleur=${couleur}&date=${date}&hidden=${hidden}&link=${link}&csrf_token_note=${document.querySelector('#csrf_token_note').value}` : `title=${titre}&desc=${content}&couleur=${couleur}&date=${date}&hidden=${hidden}&csrf_token_note=${document.querySelector('#csrf_token_note').value}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (response.status !== 200) {
      showError('Se agotó el tiempo de conexión, por favor recarga la página...');
      return;
    }
    isUpdate = false;
    noteBox.classList.remove('show');
    await showNotes();
  } catch (error) {
    showError('Se produjo un error al agregar la nota...');
  }
});

document.querySelector('#submitChangeMDP').addEventListener('click', async () => {
  const e = document.querySelector('#mdpModifNew').value;
  const t = document.querySelector('#mdpModifNewValid').value;
  if (!e || !t || e.length < 6 || e.length > 50) return;
  if (/^[0-9]+$/.test(e)) {
    showError('Contraseña demasiado débil (solo números)...');
    return;
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    showError('Contraseña demasiado débil (solo letras)...');
    return;
  }
  if (e !== t) {
    showError('Las contraseñas no coinciden...');
    return;
  }
  const mdpNew = encodeURIComponent(e);
  try {
    await fetch('../assets/php/updatePassword.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `mdpNew=${mdpNew}&csrf_token_mdp=${document.querySelector('#csrf_token_mdp').value}`,
    });
    popupBoxGestion.classList.remove('show');
  } catch (error) {
    showError('Se produjo un error al cambiar la contraseña...');
  }
});

document.querySelector('#submitRendrePrivee').addEventListener('click', async () => {
  const id = document.querySelector('#idNoteInputPrivate').value;
  const link = document.querySelector('#linkNoteInputPrivate').value;
  try {
    await fetch('../assets/php/privateNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(id)}&noteLink=${encodeURIComponent(link)}`,
    });
    publicNote.classList.remove('show');
    await showNotes();
  } catch (error) {
    showError('Se produjo un error al eliminar el enlace de la nota...');
  }
});

document.querySelector('#submitRendrePublique').addEventListener('click', async () => {
  const id = document.querySelector('#idNoteInputPublic').value;
  const link = Math.random().toString(36).substring(2, 15);
  try {
    await fetch('../assets/php/publicNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(id)}&noteLink=${link}`,
    });
    privateNote.classList.remove('show');
    await showNotes();
  } catch (error) {
    showError('Se produjo un error al crear el enlace de la nota...');
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
  document.querySelectorAll('.resync').forEach((resync) => {
    resync.addEventListener('click', () => {
      window.location.reload();
    });
    resync.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') window.location.reload();
    });
  });
});
