/* eslint-disable no-alert */
let isUpdate = false;
let errorMessage = '';
let touchStart = 0;
let touchEnd = 0;
let timeoutCopy = null;
let timeoutError = null;
let lang = '';
const notesContainer = document.querySelector('main');
const popupBox = document.querySelector('.popup-box');
const connectBox = document.querySelector('.connect-box');
const creerBox = document.querySelector('.creer-box');
const titleTag = popupBox.querySelector('#title');
const descTag = popupBox.querySelector('#content');
const couleurs = document.querySelectorAll('.couleurs span');
const darken = document.querySelector('.darken');
const switchElement = document.querySelector('.switch');
const forms = document.querySelectorAll('form');
const sideBar = document.querySelector('.sideBar');
const notesJSON = JSON.parse(localStorage.getItem('local_notes') || '[]');
const metaTheme = document.querySelector('#themecolor');
const button = document.querySelector('#iconeTheme');

if (localStorage.getItem('theme') === 'light') {
  document.querySelector('html').className = 'light';
  metaTheme.content = '#eeeeee';
  button.className = 'fa-solid fa-lightbulb';
}

if (window.location.pathname.endsWith('en/')) {
  lang = 'en';
} else if (window.location.pathname.endsWith('de/')) {
  lang = 'de';
} else {
  lang = 'fr';
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

const showNotes = async () => {
  document.querySelector('.sideBar .listNotes').textContent = '';
  document.querySelectorAll('.note').forEach((note) => note.remove());

  if (notesJSON.length === 0) {
    if (lang === 'fr' || lang === 'en') {
      document.querySelector('.sideBar h2').textContent = 'Notes (0)';
      return;
    }
    if (lang === 'de') {
      document.querySelector('.sideBar h2').textContent = 'Notizen (0)';
      return;
    }
  }

  notesJSON
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((row, id) => {
      const {
        title, desc, couleur, date, hidden,
      } = row;

      if (!title || !date || !couleur) return;

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

      if (hidden === false) {
        descElement.innerHTML = descHtml;
      } else {
        descElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      }
      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(descElement);

      const bottomContentElement = document.createElement('div');
      bottomContentElement.classList.add('bottom-content');
      const dateElement = document.createElement('span');
      dateElement.textContent = date;

      const editIconElement = document.createElement('i');
      editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
      editIconElement.tabIndex = 0;
      editIconElement.setAttribute('data-note-id', id);
      editIconElement.setAttribute('data-note-title', title);
      editIconElement.setAttribute('data-note-desc', descEnd);
      editIconElement.setAttribute('data-note-color', couleur);
      editIconElement.setAttribute('data-note-hidden', hidden);
      editIconElement.setAttribute('role', 'button');

      const trashIconElement = document.createElement('i');
      trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
      trashIconElement.tabIndex = 0;
      trashIconElement.setAttribute('data-note-id', id);
      trashIconElement.setAttribute('role', 'button');
      bottomContentElement.appendChild(dateElement);
      bottomContentElement.appendChild(editIconElement);
      bottomContentElement.appendChild(trashIconElement);

      if (hidden === false) {
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
      paragraph.appendChild(dateSpan);

      document.querySelector('.sideBar .listNotes').appendChild(paragraph);
    });
  if (lang === 'fr' || lang === 'en') {
    document.querySelector('.sideBar h2').textContent = `Notes (${notesJSON.length})`;
  }
  if (lang === 'de') {
    document.querySelector('.sideBar h2').textContent = `Notizen (${notesJSON.length})`;
  }
  searchSideBar();
};

const toggleFullscreen = (id) => {
  const note = document.querySelector(`#note${id}`);
  note.classList.toggle('fullscreen');
  darken.classList.toggle('show');
  document.body.classList.toggle('noscroll');
};

const updateNote = (id, title, desc, couleur, hidden) => {
  const s = replaceAllStart(desc);
  document.querySelectorAll('.note').forEach((note) => {
    note.classList.remove('fullscreen');
  });
  darken.classList.remove('show');
  document.body.classList.add('noscroll');
  document.querySelector('#idNoteInput').value = id;
  isUpdate = true;
  document.querySelector('.icon').click();
  titleTag.value = title;
  descTag.value = s;
  couleurs.forEach((couleurSpan) => {
    if (couleurSpan.classList.contains(couleur)) {
      couleurSpan.classList.add('selectionne');
    } else {
      couleurSpan.classList.remove('selectionne');
    }
  });
  if (hidden === 'true') { document.querySelector('#checkHidden').checked = true; }
  descTag.focus();
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
  let confirmationMessage;
  if (lang === 'en') {
    confirmationMessage = 'Do you really want to delete this note?';
  } else if (lang === 'de') {
    confirmationMessage = 'Möchten Sie diese Notiz wirklich löschen?';
  } else {
    confirmationMessage = 'Voulez-vous vraiment supprimer cette note ?';
  }
  if (window.confirm(confirmationMessage)) {
    notesJSON.splice(e, 1);
    localStorage.setItem('local_notes', JSON.stringify(notesJSON));
    darken.classList.remove('show');
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
    }
  } else if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

document.querySelectorAll('.seconnecter').forEach((element) => {
  element.addEventListener('click', () => {
    connectBox.classList.add('show');
    document.body.classList.add('noscroll');
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
    document.body.classList.add('noscroll');
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
    if (lang === 'fr') {
      errorMessage = 'Le nom ne peut contenir que des lettres...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Der Name darf nur Buchstaben enthalten...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'The name can only contain letters...';
      showError(errorMessage);
      return;
    }
  }
  if (/^[0-9]+$/.test(t)) {
    if (lang === 'fr') {
      errorMessage = 'Mot de passe trop faible (que des chiffres)...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'Password too weak (only numbers)...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Passwort zu schwach (nur Zahlen)...';
      showError(errorMessage);
      return;
    }
  }
  if (/^[a-zA-Z]+$/.test(t)) {
    if (lang === 'fr') {
      errorMessage = 'Mot de passe trop faible (que des lettres)...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'Password too weak (only letters)...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Passwort zu schwach (nur Buchstaben)...';
      showError(errorMessage);
      return;
    }
  }
  if (t !== o) {
    if (lang === 'fr') {
      errorMessage = 'Les mots de passe ne correspondent pas...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Die Passwörter stimmen nicht überein...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'Passwords do not match...';
      showError(errorMessage);
      return;
    }
  }
  if (e === t) {
    if (lang === 'fr') {
      errorMessage = 'Le mot de passe doit être différent du nom...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Das Passwort muss sich vom Namen unterscheiden...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'The password must be different from the name...';
      showError(errorMessage);
      return;
    }
  }
  const nomCreer = encodeURIComponent(e);
  const mdpCreer = encodeURIComponent(t);
  try {
    const response = await fetch('assets/php/createUser.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `nomCreer=${nomCreer}&mdpCreer=${mdpCreer}&csrf_token_creer=${document.querySelector('#csrf_token_creer').value}`,
    });
    if (response.ok) {
      creerBox.classList.remove('show');
      document.body.classList.remove('noscroll');
      forms.forEach((form) => form.reset());
      if (lang === 'fr') {
        alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        return;
      }
      if (lang === 'de') {
        alert('Konto erfolgreich erstellt! Sie können sich jetzt anmelden.');
        return;
      }
      if (lang === 'en') {
        alert('Account created successfully! You can now log in.');
        return;
      }
    }
    if (lang === 'fr') {
      errorMessage = 'Utilisateur déjà existant...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Benutzer bereits vorhanden...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'User already exists...';
      showError(errorMessage);
    }
  } catch (error) {
    if (lang === 'fr') {
      errorMessage = 'Une erreur est survenue lors de la création du compte...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Beim Erstellen des Kontos ist ein Fehler aufgetreten...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'An error occurred while creating the account...';
      showError(errorMessage);
    }
  }
});

document.querySelector('#submitSeConnecter').addEventListener('click', async () => {
  const e = document.querySelector('#nomConnect').value.trim();
  const t = document.querySelector('#mdpConnect').value;
  if (!e || !t || e.length > 25 || t.length > 50 || !/^[a-zA-ZÀ-ÿ -]+$/.test(e)) return;
  const nomConnect = encodeURIComponent(e);
  const mdpConnect = encodeURIComponent(t);
  try {
    const response = await fetch('assets/php/connectUser.php', {
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
      if (lang === 'fr') {
        errorMessage = 'Mauvais identifiants...';
        showError(errorMessage);
        const interval = setInterval(() => {
          time -= 1;
          btn.textContent = `Se connecter (${time})`;
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          btn.disabled = false;
          btn.textContent = 'Se connecter';
        }, 11000);
        return;
      }
      if (lang === 'de') {
        errorMessage = 'Falsche Anmeldeinformationen...';
        showError(errorMessage);
        const interval = setInterval(() => {
          time -= 1;
          btn.textContent = `Anmelden (${time})`;
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          btn.disabled = false;
          btn.textContent = 'Anmelden';
        }, 11000);
        return;
      }
      if (lang === 'en') {
        errorMessage = 'Wrong credentials...';
        showError(errorMessage);
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
    }
  } catch (error) {
    if (lang === 'fr') {
      errorMessage = 'Une erreur est survenue lors de la connexion...';
      showError(errorMessage);
      return;
    }
    if (lang === 'de') {
      errorMessage = 'Beim Anmelden ist ein Fehler aufgetreten...';
      showError(errorMessage);
      return;
    }
    if (lang === 'en') {
      errorMessage = 'An error occurred while signing in...';
      showError(errorMessage);
    }
  }
});

document.querySelectorAll('.icon, .iconFloat').forEach((element) => {
  element.addEventListener('click', () => {
    popupBox.classList.add('show');
    document.body.classList.add('noscroll');
    document.querySelector('#title').focus();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') element.click();
  });
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

document.querySelector('#submitNote').addEventListener('click', () => {
  const couleurSpan = document.querySelector('.couleurs span.selectionne');
  const v = couleurSpan.classList[0];
  const e = titleTag.value.trim()
    .replaceAll(/'/g, '‘')
    .replaceAll(/"/g, '‘‘')
    .replaceAll(/</g, '←')
    .replaceAll(/>/g, '→');
  const t = descTag.value.trim()
    .replaceAll(/'/g, '‘')
    .replaceAll(/"/g, '‘‘')
    .replaceAll(/</g, '←')
    .replaceAll(/>/g, '→');
  const g = document.querySelector('#checkHidden').checked;
  if (!e || e.length > 30 || t.length > 5000) return;
  const c = {
    title: e,
    desc: t,
    couleur: v,
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    hidden: g,
  };
  if (isUpdate) {
    isUpdate = false;
    notesJSON[document.querySelector('#idNoteInput').value] = c;
  } else {
    notesJSON.push(c);
  }
  localStorage.setItem('local_notes', JSON.stringify(notesJSON));
  forms.forEach((form) => form.reset());
  popupBox.classList.remove('show');
  document.body.classList.remove('noscroll');
  showNotes();
});

document.querySelectorAll('#menuIcon').forEach((element) => {
  element.addEventListener('click', () => {
    document.querySelector('.sideBar').classList.add('show');
    darken.classList.toggle('show');
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
  if (swipeDistance > 50 && !sideBar.classList.contains('show')) {
    sideBar.classList.add('show');
    darken.classList.add('show');
    document.querySelectorAll('.note').forEach((note) => {
      note.classList.remove('fullscreen');
    });
    document.body.classList.add('noscroll');
  } else if (swipeDistance < -50 && sideBar.classList.contains('show')) {
    sideBar.classList.remove('show');
    darken.classList.remove('show');
    document.querySelectorAll('.note').forEach((note) => {
      note.classList.remove('fullscreen');
    });
    document.body.classList.add('noscroll');
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
    popupBox.classList.remove('show');
    connectBox.classList.remove('show');
    creerBox.classList.remove('show');
    darken.classList.remove('show');
    document.body.classList.remove('noscroll');
    document.querySelector('.sideBar').classList.remove('show');
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

document.querySelector('.language').addEventListener('change', () => {
  const e = document.querySelector('.language').value;
  if (e === 'fr') {
    window.location.href = '';
    return;
  }
  if (e === 'en') {
    window.location.href = 'en/';
    return;
  }
  if (e === 'de') {
    window.location.href = 'de/';
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  await showNotes();
});
