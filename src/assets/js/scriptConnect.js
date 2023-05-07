let isUpdate;
let errorMessage;
const notesContainer = document.querySelector('main');
const popupBoxConnect = document.querySelector('.connect-popup-box');
const popupBoxGestion = document.querySelector('.gestion-popup-box');
const titleTagConnect = popupBoxConnect.querySelector('#titleConnect');
const descTagConnect = popupBoxConnect.querySelector('textarea');
const darken = document.querySelector('.darken');
const switchElement = document.querySelector('.switch');
const couleurs = document.querySelectorAll('.couleurs span');
const forms = document.querySelectorAll('form');

function replaceAllStart(e) {
  return e.replaceAll('<br /><br />', '\n\n').replaceAll('<br />', '\n');
}

function replaceAllEnd(e) {
  return e.replaceAll('\n\n', '<br /><br />').replaceAll('\n', '<br />');
}

function showError(message) {
  const notification = document.getElementById('errorNotification');
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

function taskListEnablerExtension() {
  return [{
    type: 'output',
    regex: /<input type="checkbox"?/g,
    replace: '<input type="checkbox"',
  }];
}

// eslint-disable-next-line no-undef
const converter = new showdown.Converter({
  tasklists: true,
  smoothLivePreview: true,
  extensions: [taskListEnablerExtension],
});

const showNotesConnect = async () => {
  document.querySelectorAll('.note').forEach((note) => {
    note.remove();
  });
  const response = await fetch('/projets/notes/assets/php/getNotes.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const data = await response.json();
  data.forEach((row) => {
    const {
      id, title, couleur, desc, date, hidden,
    } = row;
    if (desc) {
      const descEnd = replaceAllEnd(desc);
      const result = hidden === 0 ? `<div id="note${id}" tabindex="0" class="note ${couleur}"><div class="details"><p class="title">${title}</p><span>${converter.makeHtml(desc)}</span></div><div class="bottom-content"><i title="Date (GMT)" class="fa-solid fa-calendar-days"></i><span>${date}</span><i class="fa-solid fa-pen" tabindex="0" onclick="updateNoteConnect(${id},'${title}','${descEnd}','${couleur}','${hidden}')"></i><i class="fa-solid fa-clipboard" tabindex="0" onclick="copy('${descEnd}')"></i><i class="fa-solid fa-trash-can" tabindex="0" onclick="deleteNoteConnect(${id})"></i><i class="fa-solid fa-expand" tabindex="0" onclick="toggleFullscreen(${id})"></i></div></div>` : `<div id="note${id}" tabindex="0" class="note ${couleur}"><div class="details"><p class="title">${title}</p><span>*****</span></div><div class="bottom-content"><i title="Date (GMT)" class="fa-solid fa-calendar-days"></i><span>${date}</span><i class="fa-solid fa-pen" tabindex="0" onclick="updateNoteConnect(${id},'${title}','${descEnd}','${couleur}','${hidden}')"></i><i class="fa-solid fa-trash-can" tabindex="0" onclick="deleteNoteConnect(${id})"></i></div></div>`;
      notesContainer.insertAdjacentHTML('beforeend', result);
    }
  });
};

const fetchDelete = async (e) => {
  try {
    await fetch('/projets/notes/assets/php/deleteNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `noteId=${encodeURIComponent(e)}`,
    });
    darken.classList.remove('show');
    document.body.classList.remove('noscroll');
    await showNotesConnect();
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Une erreur est survenue lors de la suppression de la note...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'An error occurred while deleting the note...';
    showError(errorMessage);
  }
};

const deleteAccount = async () => {
  try {
    const response = await fetch('/projets/notes/assets/php/deleteAccount.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.ok) {
      window.location.reload();
      return;
    }
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Une erreur est survenue lors de la suppression de votre compte...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'An error occurred while deleting your account...';
    showError(errorMessage);
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Une erreur est survenue lors de la suppression de votre compte...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'An error occurred while deleting your account...';
    showError(errorMessage);
  }
};

const fetchLogout = async () => {
  try {
    await fetch('/projets/notes/assets/php/logout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    window.location.reload();
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Une erreur est survenue lors de la déconnexion...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'An error occurred while logging out...';
    showError(errorMessage);
  }
};

// eslint-disable-next-line no-unused-vars
function toggleFullscreen(id) {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
  darken.classList.toggle('show');
  document.body.classList.toggle('noscroll');
}

// eslint-disable-next-line no-unused-vars
function updateNoteConnect(id, title, desc, couleur, hidden) {
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  darken.classList.remove('show');
  document.body.classList.add('noscroll');
  isUpdate = true;
  document.querySelector('.iconConnect').click();
  document.querySelector('#idNoteInputConnect').value = id;
  titleTagConnect.value = title;
  descTagConnect.value = replaceAllStart(desc);
  couleurs.forEach((couleurSpan) => {
    if (couleurSpan.classList.contains(couleur)) {
      couleurSpan.classList.add('selectionne');
    } else {
      couleurSpan.classList.remove('selectionne');
    }
  });
  if (hidden === '1') document.getElementById('checkHidden').checked = true;
  descTagConnect.focus();
}

// eslint-disable-next-line no-unused-vars
function copy(e) {
  const copyText = replaceAllStart(e);
  const notification = document.getElementById('copyNotification');
  navigator.clipboard.writeText(copyText);
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// eslint-disable-next-line no-unused-vars
function deleteNoteConnect(e) {
  if (!window.location.pathname.endsWith('en.php')) {
    if (window.confirm('Voulez-vous vraiment supprimer cette note ?')) {
      fetchDelete(e);
    }
    return;
  }
  if (window.confirm('Do you really want to delete this note?')) {
    fetchDelete(e);
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-clipboard')) {
      document.activeElement.click();
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-trash-can')) {
      document.activeElement.click();
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-pen')) {
      document.activeElement.click();
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-expand')) {
      document.activeElement.click();
    }
  }
});

switchElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const checkbox = switchElement.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    switchElement.classList.toggle('checked');
  }
});

document.querySelectorAll('.iconConnect').forEach((element) => {
  element.addEventListener('click', () => {
    popupBoxConnect.classList.add('show');
    document.body.classList.add('noscroll');
    titleTagConnect.focus();
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
    if (!window.location.pathname.endsWith('en.php')) {
      if (window.confirm('Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ? Votre nom d\'utilisateur redeviendra disponible pour les autres utilisateurs.')) {
        deleteAccount();
      }
      return;
    }
    if (window.confirm('Do you really want to delete your account and all your notes saved in the cloud? Your username will become available to other users again.')) {
      deleteAccount();
    }
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
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
    popupBoxConnect.classList.remove('show');
    popupBoxGestion.classList.remove('show');
    darken.classList.remove('show');
    document.body.classList.remove('noscroll');
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
});

document.querySelector('#search-input').addEventListener('keyup', () => {
  const e = document.querySelector('#search-input').value.trim().toLowerCase();
  document.querySelectorAll('.note').forEach((element) => {
    const note = element;
    const t = note.querySelector('.note p').textContent.toLowerCase();
    if (t.includes(e)) {
      note.style.display = 'flex';
    } else {
      note.style.display = 'none';
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

document.querySelector('#tri').addEventListener('change', async () => {
  try {
    await fetch('/projets/notes/assets/php/sort.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `tri=${encodeURIComponent(document.querySelector('#tri').value)}`,
    });
    await showNotesConnect();
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Une erreur est survenue lors du tri des notes...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'An error occurred while sorting the notes...';
    showError(errorMessage);
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

document.querySelector('#submitNoteConnect').addEventListener('click', async () => {
  try {
    const titreBrut = document.querySelector('#titleConnect').value.trim();
    const contentBrut = document.querySelector('#descConnect').value;
    if (!titreBrut || !contentBrut || contentBrut.length > 2000) return;
    const titre = encodeURIComponent(titreBrut.replaceAll(/'/g, '‘').replaceAll(/\\/g, '/'));
    const content = encodeURIComponent(contentBrut.replaceAll(/'/g, '‘').replaceAll(/\\/g, '/'));
    const couleurSpan = document.querySelector('.couleurs span.selectionne');
    const couleur = encodeURIComponent(couleurSpan.classList[0]);
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const checkBox = document.getElementById('checkHidden');
    const hidden = checkBox.checked ? 1 : 0;
    const url = isUpdate ? '/projets/notes/assets/php/updateNote.php' : '/projets/notes/assets/php/formAddNote.php';
    const data = isUpdate ? `noteId=${document.querySelector('#idNoteInputConnect').value}&title=${titre}&filterDesc=${content}&couleur=${couleur}&date=${date}&hidden=${hidden}` : `titleConnect=${titre}&descriptionConnect=${content}&couleurConnect=${couleur}&date=${date}&hidden=${hidden}`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    isUpdate = false;
    popupBoxConnect.classList.remove('show');
    document.body.classList.remove('noscroll');
    forms.forEach((form) => form.reset());
    await showNotesConnect();
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Une erreur est survenue lors de l\'ajout de la note...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'An error occurred while adding the note...';
    showError(errorMessage);
  }
});

document.querySelector('#submitChangeMDP').addEventListener('click', async () => {
  const e = document.querySelector('#mdpModifNew').value;
  const t = document.querySelector('#mdpModifNewValid').value;
  if (!e || !t) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Un ou plusieurs champs sont vides...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'One or more fields are empty...';
    showError(errorMessage);
    return;
  }
  if (e.length < 6) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Mot de passe trop faible (<6)...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'Password too weak (<6)...';
    showError(errorMessage);
    return;
  }
  if (/^[0-9]+$/.test(e)) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Mot de passe trop faible (que des chiffres)...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'Password too weak (only numbers)...';
    showError(errorMessage);
    return;
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Mot de passe trop faible (que des lettres)...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'Password too weak (only letters)...';
    showError(errorMessage);
    return;
  }
  if (e !== t) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Les mots de passe ne correspondent pas...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'Passwords do not match...';
    showError(errorMessage);
    return;
  }
  const mdpNew = encodeURIComponent(e);
  try {
    await fetch('/projets/notes/assets/php/formChangeMDP.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `mdpNew=${mdpNew}`,
    });
    popupBoxGestion.classList.remove('show');
    document.body.classList.remove('noscroll');
    forms.forEach((form) => form.reset());
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      errorMessage = 'Une erreur est survenue lors de la modification du mot de passe...';
      showError(errorMessage);
      return;
    }
    errorMessage = 'An error occurred while changing the password...';
    showError(errorMessage);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  showNotesConnect();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/projets/notes/sw.js');
});
