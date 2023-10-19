/* eslint-disable no-alert */
let isUpdate = false;
let touchStart = 0;
let touchEnd = 0;
let timeoutCopy = null;
let timeoutError = null;
const notesContainer = document.querySelector('main');
const noteBox = document.querySelector('.note-popup-box');
const popupBoxGestion = document.querySelector('.gestion-popup-box');
const privateNote = document.querySelector('.private-note-popup-box');
const publicNote = document.querySelector('.public-note-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const switchElement = document.querySelector('.switch');
const couleurs = document.querySelectorAll('.couleurs span');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('.sideBar');
const metaTheme = document.querySelector('#themecolor');
const button = document.querySelector('#iconeTheme');

if (localStorage.getItem('theme') === 'light') {
  document.querySelector('html').className = 'light';
  metaTheme.content = '#eeeeee';
  button.className = 'fa-solid fa-lightbulb';
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

const taskListEnablerExtension = () => [{
  type: 'output',
  regex: /<input type="checkbox"?/g,
  replace: '<input type="checkbox"',
}];

const searchSideBar = () => {
  document.querySelectorAll('.listNotes p').forEach((element) => {
    element.addEventListener('click', () => {
      const e = element.querySelector('.titleList').textContent;
      document.querySelectorAll('.note').forEach((note) => {
        const t = note.querySelector('.note h2').textContent;
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

// eslint-disable-next-line no-undef
const converter = new showdown.Converter({
  tasklists: true,
  smoothLivePreview: true,
  extensions: [taskListEnablerExtension],
});

const showNotesConnect = async () => {
  document.querySelector('.sideBar .listNotes').textContent = '';
  document.querySelectorAll('.note').forEach((note) => note.remove());
  forms.forEach((form) => form.reset());

  const response = await fetch('assets/php/getNotes.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.length === 0) {
    document.querySelector('.sideBar h2').textContent = 'Notes (0)';
    return;
  }

  document.querySelector('.lastSync span').textContent = `${new Date().toLocaleString()}`;

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
    editIconElement.setAttribute('data-note-title', title);
    editIconElement.setAttribute('data-note-desc', descEnd);
    editIconElement.setAttribute('data-note-color', couleur);
    editIconElement.setAttribute('data-note-hidden', hidden);
    editIconElement.setAttribute('data-note-link', link);
    editIconElement.setAttribute('role', 'button');
    bottomContentElement.appendChild(editIconElement);

    if (link === '') {
      const trashIconElement = document.createElement('i');
      trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
      trashIconElement.tabIndex = 0;
      trashIconElement.setAttribute('data-note-id', id);
      trashIconElement.setAttribute('role', 'button');
      bottomContentElement.appendChild(trashIconElement);
    }

    if (hidden === 0) {
      const clipboardIconElement = document.createElement('i');
      clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
      clipboardIconElement.tabIndex = 0;
      clipboardIconElement.setAttribute('data-note-desc', descEnd);
      clipboardIconElement.setAttribute('role', 'button');
      bottomContentElement.appendChild(clipboardIconElement);

      const downloadIconElement = document.createElement('i');
      downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
      downloadIconElement.tabIndex = 0;
      downloadIconElement.setAttribute('data-note-id', id);
      downloadIconElement.setAttribute('data-note-title', title);
      downloadIconElement.setAttribute('data-note-desc', descEnd);
      downloadIconElement.setAttribute('role', 'button');
      bottomContentElement.appendChild(downloadIconElement);

      const expandIconElement = document.createElement('i');
      expandIconElement.classList.add('fa-solid', 'fa-expand', 'note-action');
      expandIconElement.tabIndex = 0;
      expandIconElement.setAttribute('data-note-id', id);
      expandIconElement.setAttribute('role', 'button');
      bottomContentElement.appendChild(expandIconElement);

      const linkIconElement = document.createElement('i');
      linkIconElement.classList.add('fa-solid', 'fa-link', 'note-action');
      linkIconElement.tabIndex = 0;
      linkIconElement.setAttribute('data-note-id', id);
      linkIconElement.setAttribute('data-note-link', link);
      linkIconElement.setAttribute('role', 'button');
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
    document.querySelector('.sideBar .listNotes').appendChild(paragraph);
  });
  document.querySelector('.sideBar h2').textContent = `Notes (${data.length})`;
  searchSideBar();
};

const fetchDelete = async (e) => {
  document.body.classList.remove('noscroll');
  try {
    await fetch('assets/php/deleteNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(e)}`,
    });
    await showNotesConnect();
  } catch (error) {
    showError('Une erreur est survenue lors de la suppression de la note...');
  }
};

const deleteAccount = async () => {
  try {
    const response = await fetch('assets/php/deleteAccount.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.ok) {
      window.location.reload();
      return;
    }
    showError('Une erreur est survenue lors de la suppression de votre compte...');
  } catch (error) {
    showError('Une erreur est survenue lors de la suppression de votre compte...');
  }
};

const fetchLogout = async () => {
  try {
    await fetch('assets/php/logout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    window.location.reload();
  } catch (error) {
    showError('Une erreur est survenue lors de la déconnexion...');
  }
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
  document.body.classList.toggle('noscroll');
};

const updateNoteConnect = (id, title, desc, couleur, hidden, link) => {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  document.body.classList.add('noscroll');
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

const deleteNoteConnect = (e) => {
  if (window.confirm('Voulez-vous vraiment supprimer cette note ?')) {
    fetchDelete(e);
  }
};

const noteAccess = (id, link) => {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  document.body.classList.add('noscroll');
  if (link === '') {
    privateNote.classList.add('show');
    document.querySelector('#idNoteInputPublic').value = id;
  } else {
    publicNote.classList.add('show');
    document.querySelector('#idNoteInputPrivate').value = id;
    document.querySelector('#linkNoteInputPrivate').value = link;
    document.querySelector('#copyNoteLink').textContent = `${window.location.href}share/${link}/`;
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
      updateNoteConnect(noteId, noteTitle, noteDesc, noteColor, noteHidden, noteLink);
    } else if (target.classList.contains('fa-clipboard')) {
      copy(noteDesc);
    } else if (target.classList.contains('fa-trash-can')) {
      deleteNoteConnect(noteId);
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
    document.body.classList.add('noscroll');
    titleNote.focus();
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
    document.body.classList.add('noscroll');
    popupBoxGestion.querySelector('i').focus();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelectorAll('.supprimerCompte').forEach((element) => {
  element.addEventListener('click', () => {
    if (window.confirm('Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ? Votre nom d\'utilisateur redeviendra disponible pour les autres utilisateurs.')) {
      deleteAccount();
    }
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelectorAll('#menuIcon').forEach((element) => {
  element.addEventListener('click', () => {
    sideBar.classList.add('show');
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      element.click();
      document.querySelector('.sideBar header i').focus();
    }
  });
});

document.body.addEventListener('touchstart', (e) => {
  touchStart = e.targetTouches[0].clientX;
});

document.body.addEventListener('touchmove', (e) => {
  touchEnd = e.targetTouches[0].clientX;
});

document.body.addEventListener('touchend', () => {
  const swipeDistance = touchEnd - touchStart;
  if (swipeDistance > 100 && !sideBar.classList.contains('show')) {
    sideBar.classList.add('show');
    document.querySelectorAll('.note').forEach((note) => {
      note.classList.remove('fullscreen');
    });
    document.body.classList.remove('noscroll');
  } else if (swipeDistance < -100 && sideBar.classList.contains('show')) {
    sideBar.classList.remove('show');
    document.querySelectorAll('.note').forEach((note) => {
      note.classList.remove('fullscreen');
    });
    document.body.classList.remove('noscroll');
  }
  touchStart = 0;
  touchEnd = 0;
});

sideBar.addEventListener('touchstart', (e) => {
  e.stopPropagation();
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
    document.body.classList.remove('noscroll');
    sideBar.classList.remove('show');
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelector('#search-input').addEventListener('keyup', () => {
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
  if (localStorage.getItem('theme') === 'light') {
    document.querySelector('html').className = 'dark';
    metaTheme.content = '#272727';
    button.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    document.querySelector('html').className = 'light';
    metaTheme.content = '#eeeeee';
    button.className = 'fa-solid fa-lightbulb';
    localStorage.setItem('theme', 'light');
  }
});

document.querySelector('#language').addEventListener('change', () => {
  const e = document.querySelector('#language').value;
  if (e === 'fr') {
    window.location.href = './';
  } else if (e === 'en') {
    window.location.href = 'en/';
  } else if (e === 'de') {
    window.location.href = 'de/';
  }
});

document.querySelector('#tri').addEventListener('change', async () => {
  try {
    await fetch('assets/php/updateSort.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `tri=${encodeURIComponent(document.querySelector('#tri').value)}`,
    });
    await showNotesConnect();
  } catch (error) {
    showError('Une erreur est survenue lors du tri des notes...');
  }
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
    const contentBrut = contentNote.value.trim();
    if (!titreBrut || titreBrut.length > 30 || contentBrut.length > 5000) return;
    const titre = encodeURIComponent(titreBrut);
    const content = encodeURIComponent(contentBrut.replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;'));
    const couleurSpan = document.querySelector('.couleurs span.selectionne');
    const couleur = encodeURIComponent(couleurSpan.classList[0]);
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const checkBox = document.querySelector('#checkHidden');
    const link = encodeURIComponent(document.querySelector('#checkLink').value);
    const hidden = checkBox.checked ? '1' : '0';
    const url = isUpdate ? 'assets/php/updateNote.php' : 'assets/php/addNote.php';
    const data = isUpdate ? `noteId=${idNote}&title=${titre}&desc=${content}&couleur=${couleur}&date=${date}&hidden=${hidden}&link=${link}&csrf_token_note=${document.querySelector('#csrf_token_note').value}` : `title=${titre}&desc=${content}&couleur=${couleur}&date=${date}&hidden=${hidden}&csrf_token_note=${document.querySelector('#csrf_token_note').value}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (response.status !== 200) {
      showError('La connexion a expiré, veuillez recharger la page...');
      return;
    }
    isUpdate = false;
    noteBox.classList.remove('show');
    document.body.classList.remove('noscroll');
    await showNotesConnect();
  } catch (error) {
    showError('Une erreur est survenue lors de l\'ajout de la note...');
  }
});

document.querySelector('#submitChangeMDP').addEventListener('click', async () => {
  const e = document.querySelector('#mdpModifNew').value;
  const t = document.querySelector('#mdpModifNewValid').value;
  if (!e || !t || e.length < 6 || e.length > 50) return;
  if (/^[0-9]+$/.test(e)) {
    showError('Mot de passe trop faible (que des chiffres)...');
    return;
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    showError('Mot de passe trop faible (que des lettres)...');
    return;
  }
  if (e !== t) {
    showError('Les mots de passe ne correspondent pas...');
    return;
  }
  const mdpNew = encodeURIComponent(e);
  try {
    await fetch('assets/php/updatePassword.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `mdpNew=${mdpNew}&csrf_token_mdp=${document.querySelector('#csrf_token_mdp').value}`,
    });
    popupBoxGestion.classList.remove('show');
    document.body.classList.remove('noscroll');
  } catch (error) {
    showError('Une erreur est survenue lors de la modification du mot de passe...');
  }
});

document.querySelector('#submitRendrePrivee').addEventListener('click', async () => {
  const id = document.querySelector('#idNoteInputPrivate').value;
  const link = document.querySelector('#linkNoteInputPrivate').value;
  try {
    await fetch('assets/php/privateNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(id)}&noteLink=${encodeURIComponent(link)}`,
    });
    publicNote.classList.remove('show');
    document.body.classList.remove('noscroll');
    await showNotesConnect();
  } catch (error) {
    showError('Une erreur est survenue lors de la suppression du lien de la note...');
  }
});

document.querySelector('#submitRendrePublique').addEventListener('click', async () => {
  const id = document.querySelector('#idNoteInputPublic').value;
  const link = Math.random().toString(36).substring(2, 15);
  try {
    await fetch('assets/php/publicNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(id)}&noteLink=${link}`,
    });
    privateNote.classList.remove('show');
    document.body.classList.remove('noscroll');
    await showNotesConnect();
  } catch (error) {
    showError('Une erreur est survenue lors de la création du lien de la note...');
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

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  await showNotesConnect();
  document.querySelectorAll('.resync').forEach((resync) => {
    resync.addEventListener('click', () => {
      window.location.reload();
    });
    resync.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') window.location.reload();
    });
  });
});
