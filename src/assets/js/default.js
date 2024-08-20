let touchstartX = 0;
let touchendX = 0;
let timeoutNotification = null;
const sidebar = document.querySelector('#sidebar');
const metaTheme = document.querySelectorAll('.theme-color');
const buttonTheme = document.querySelector('#icon-theme');
export let isLocked = true;
export const maxNoteContent = 20000;
export const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
export const forms = document.querySelectorAll('form');

export function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

export function getPassword(length) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialChars = '&~"#\'(-_)=^$€*!?,.;:/|\\@%+{}[]<>`';
  const allChars = lowercase + uppercase + digits + specialChars;
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i += 1) {
    const randomIndex = parseInt(array[i] % allChars.length, 10);
    password += allChars[randomIndex];
  }
  document.querySelector('#psswd-gen').textContent = password;
}

export function showSuccess(message) {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelector('#success-notification');
  notification.textContent = message;
  notification.classList.remove('d-none');
  timeoutNotification = setTimeout(() => {
    notification.classList.add('d-none');
  }, 5000);
}

export function showError(message) {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelectorAll('.error-notification');
  notification.forEach((e) => {
    e.textContent = message;
    e.classList.remove('d-none');
    timeoutNotification = setTimeout(() => {
      e.classList.add('d-none');
    }, 5000);
  });
}

export function downloadNote(noteId) {
  document.querySelector('#id-note-download').value = noteId;
  document.querySelectorAll('input[name="download-notes"]').forEach((e) => {
    e.checked = false;
  });
  document.querySelector('#download-popup-box').showModal();
}

export function copy(content) {
  navigator.clipboard.writeText(content);
}

export function toggleFullscreen (noteId) {
  const note = document.querySelector(`.note[data-note-id="${noteId}"]`);
  note.classList.toggle('fullscreen');
  note.querySelector('.bottom-content .expand-note').classList.toggle('fa-expand');
  note.querySelector('.bottom-content .expand-note').classList.toggle('fa-compress');
}

export function searchSidebar() {
  sidebar.querySelectorAll('#list-notes p').forEach((e) => {
    e.addEventListener('click', () => {
      const titleList = e.querySelector('.title-list').textContent;
      document.querySelectorAll('.note').forEach((note) => {
        const title = note.querySelector('.title').textContent;
        if (title === titleList) note.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      });
    });
    e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') e.click();
    });
  });
}

export const getLockApp = async () => {
  try {
    const data = new URLSearchParams({ csrf_token: csrfToken });
    const res = await fetch('./assets/php/getLockApp.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      showError(`An error occurred - ${res.status}`);
      return;
    }
    const serverLocked = await res.json();
    if (serverLocked.lockApp) {
      document.querySelector('#btn-unlock-float').classList.remove('d-none');
      document.querySelectorAll('#sidebar button').forEach((e) => e.classList.add('d-none'));
      document.querySelectorAll('.btn-add-note').forEach((e) => e.classList.add('d-none'));
      document.querySelector('#lock-app-slider').classList.add('d-none');
      document.querySelector('#check-lock-app').checked = true;
    } else isLocked = false;
  } catch (error) {
    showError(`An error occurred - ${error}`);
  }
}

export const verifyFingerprint = async () => {
  try {
    const challenge = generateRandomBytes(16);
    const userId = generateRandomBytes(8);
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
          userVerification: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    });
    isLocked = false;
    document.querySelector('#btn-unlock-float').classList.add('d-none');
    document.querySelectorAll('#sidebar button').forEach((e) => e.classList.remove('d-none'));
    document.querySelectorAll('.btn-add-note').forEach((e) => e.classList.remove('d-none'));
    document.querySelector('#lock-app-slider').classList.remove('d-none');
  } catch (error) {
    showError(`An error occurred - ${error}`);
    document.querySelector('#check-lock-app').checked = !document.querySelector('#check-lock-app').checked;
  }
};

export function openSidebar() {
  sidebar.classList.add('show');
}

export function closeSidebar() {
  sidebar.classList.remove('show');
}

export function handleGesture() {
  if (touchendX - touchstartX > 75 && !sidebar.classList.contains('show')) openSidebar();
  else if (touchendX - touchstartX < -75 && sidebar.classList.contains('show')) closeSidebar();
}

if (localStorage.getItem('theme') === 'light') {
  document.querySelector('html').className = 'light';
  metaTheme.forEach((e) => {
    e.content = '#f3f3f3';
  });
  buttonTheme.className = 'fa-solid fa-lightbulb';
} else if (localStorage.getItem('theme') === 'dusk') {
  document.querySelector('html').className = 'dusk';
  metaTheme.forEach((e) => {
    e.content = '#1c1936';
  });
  buttonTheme.className = 'fa-solid fa-star';
} else if (localStorage.getItem('theme') === 'leaf') {
  document.querySelector('html').className = 'leaf';
  metaTheme.forEach((e) => {
    e.content = '#001b1e';
  });
  buttonTheme.className = 'fa-solid fa-leaf';
} else if (localStorage.getItem('theme') === 'carrot') {
  document.querySelector('html').className = 'carrot';
  metaTheme.forEach((e) => {
    e.content = '#001b1e';
  });
  buttonTheme.className = 'fa-solid fa-carrot';
} else {
  document.querySelector('html').className = 'dark';
  metaTheme.forEach((e) => {
    e.content = '#121212';
  });
  buttonTheme.className = 'fa-solid fa-moon';
}
if (localStorage.getItem('compact') === 'true') {
  document.querySelector('#check-compact').checked = true;
  document.querySelector('main').classList.add('compact');
}
if (localStorage.getItem('hide-sidebar') === 'true') {
  document.querySelector('#check-hide-sidebar').checked = true;
  document.querySelector('#sidebar-indicator').classList.add('d-none');
}
if (localStorage.getItem('spellcheck') === 'false') {
  document.querySelector('#spellcheck').checked = false;
  document.querySelector('#content').setAttribute('spellcheck', 'false');
}
if (localStorage.getItem('accent_color') === '5') {
  document.querySelector('body').classList = 'accent5';
  document.querySelector('#accent-colors .accent5-span').classList.add('selected');
} else if (localStorage.getItem('accent_color') === '4') {
  document.querySelector('body').classList = 'accent4';
  document.querySelector('#accent-colors .accent4-span').classList.add('selected');
} else if (localStorage.getItem('accent_color') === '3') {
  document.querySelector('body').classList = 'accent3';
  document.querySelector('#accent-colors .accent3-span').classList.add('selected');
} else if (localStorage.getItem('accent_color') === '2') {
  document.querySelector('body').classList = 'accent2';
  document.querySelector('#accent-colors .accent2-span').classList.add('selected');
} else if (localStorage.getItem('accent_color') === '1') {
  document.querySelector('body').classList = 'accent1';
  document.querySelector('#accent-colors .accent1-span').classList.add('selected');
} else {
  localStorage.setItem('accent_color', '1');
  document.querySelector('body').classList = 'accent1';
  document.querySelector('#accent-colors .accent1-span').classList.add('selected');
}
if (
  localStorage.getItem('sort_notes') !== '1'
  && localStorage.getItem('sort_notes') !== '2'
  && localStorage.getItem('sort_notes') !== '3'
  && localStorage.getItem('sort_notes') !== '4'
) localStorage.setItem('sort_notes', '1');
if (localStorage.getItem('lang') === null) localStorage.setItem('lang', 'en');

document.addEventListener('touchstart', (e) => {
  touchstartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
  touchendX = e.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#language').addEventListener('change', async (e) => {
  const lang = e.target.value;
  if (lang === 'fr') localStorage.setItem('lang', 'fr');
  else if (lang === 'de') localStorage.setItem('lang', 'de');
  else if (lang === 'es') localStorage.setItem('lang', 'es');
  else localStorage.setItem('lang', 'en');
  window.location.reload();
});

document.querySelector('#control-clear').addEventListener('click', () => {
  document.querySelector('#note-popup-box #content').value = '';
});

document.querySelector('#check-spellcheck').addEventListener('change', (e) => {
  if (e.target.checked) {
    localStorage.removeItem('spellcheck');
    document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'true');
  } else {
    localStorage.setItem('spellcheck', 'false');
    document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'false');
  }
});

document.querySelector('#note-popup-box #content').addEventListener('input', (e) => {
  const length = e.target.value.length;
  document.querySelector('#textarea-length').textContent = `${length}/${maxNoteContent}`;
});

document.querySelector('#settings').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#settings-popup-box').showModal();
});

document.querySelector('#plugins').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#plugins-popup-box').showModal();
});

document.querySelector('#copy-password-btn').addEventListener('click', () => {
  const psswd = document.querySelector('#psswd-gen').textContent;
  navigator.clipboard.writeText(psswd);
});

document.querySelector('#sidebar-indicator').addEventListener('click', () => {
  openSidebar();
});

document.querySelector('#check-compact').addEventListener('change', (e) => {
  if (e.target.checked) {
    localStorage.setItem('compact', 'true');
    document.querySelector('main').classList.add('compact');
  } else {
    localStorage.removeItem('compact');
    document.querySelector('main').classList.remove('compact');
  }
});

document.querySelector('#check-hide-sidebar').addEventListener('change', (e) => {
  if (e.target.checked) {
    localStorage.setItem('hide-sidebar', 'true');
    document.querySelector('#sidebar-indicator').classList.add('d-none');
  } else {
    localStorage.removeItem('hide-sidebar');
    document.querySelector('#sidebar-indicator').classList.remove('d-none');
  }
});

document.querySelector('#btn-theme').addEventListener('click', () => {
  if (localStorage.getItem('theme') === 'light') {
    document.querySelector('html').className = 'dusk';
    metaTheme.forEach((e) => {
      e.content = '#1c1936';
    });
    buttonTheme.className = 'fa-solid fa-star';
    localStorage.setItem('theme', 'dusk');
  } else if (localStorage.getItem('theme') === 'dusk') {
    document.querySelector('html').className = 'leaf';
    metaTheme.forEach((e) => {
      e.content = '#001b1e';
    });
    buttonTheme.className = 'fa-solid fa-leaf';
    localStorage.setItem('theme', 'leaf');
  } else if (localStorage.getItem('theme') === 'leaf') {
    document.querySelector('html').className = 'carrot';
    metaTheme.forEach((e) => {
      e.content = '#331500';
    });
    buttonTheme.className = 'fa-solid fa-carrot';
    localStorage.setItem('theme', 'carrot');
  } else if (localStorage.getItem('theme') === 'carrot') {
    document.querySelector('html').className = 'dark';
    metaTheme.forEach((e) => {
      e.content = '#121212';
    });
    buttonTheme.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'dark');
  } else {
    document.querySelector('html').className = 'light';
    metaTheme.forEach((e) => {
      e.content = '#f3f3f3';
    });
    buttonTheme.className = 'fa-solid fa-lightbulb';
    localStorage.setItem('theme', 'light');
  }
});

document.querySelector('#btn-sort').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#sort-popup-box').showModal();
});

document.querySelector('#btn-add-folder').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#folder-popup-box').showModal();
});

document.querySelector('#btn-filter').addEventListener('click', () => {
  closeSidebar();
  document.querySelector('#filter-popup-box').showModal();
});

document.querySelector('#folder-popup-box button').addEventListener('click', async () => {
  const folderName = document.querySelector('#name-folder').value.trim();
  const select = document.querySelector('#folders');
  if (folderName === '' || folderName.length > 18) return;
  const option = document.createElement('option');
  option.value = folderName;
  option.textContent = folderName;
  select.appendChild(option);
  document.querySelector('#folder-popup-box').close();
});

document.querySelectorAll('#colors span').forEach((span, index) => {
  span.addEventListener('click', (event) => {
    document.querySelectorAll('#colors span').forEach((e) => e.classList.remove('selected'));
    event.target.classList.add('selected');
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
  if (index === 0) span.classList.add('selected');
});

document.querySelectorAll('#accent-colors span').forEach((span) => {
  span.addEventListener('click', (event) => {
    document.querySelectorAll('#accent-colors span').forEach((e) => e.classList.remove('selected'));
    event.target.classList.add('selected');
    if (span.classList.contains('accent5-span')) {
      document.querySelector('body').classList = 'accent5';
      localStorage.setItem('accent_color', '5');
    } else if (span.classList.contains('accent4-span')) {
      document.querySelector('body').classList = 'accent4';
      localStorage.setItem('accent_color', '4');
    } else if (span.classList.contains('accent3-span')) {
      document.querySelector('body').classList = 'accent3';
      localStorage.setItem('accent_color', '3');
    } else if (span.classList.contains('accent2-span')) {
      document.querySelector('body').classList = 'accent2';
      localStorage.setItem('accent_color', '2');
    } else {
      document.querySelector('body').classList = 'accent1';
      localStorage.setItem('accent_color', '1');
    }
  });
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') span.click();
  });
});

document.querySelectorAll('.fa-xmark').forEach((e) => {
  e.addEventListener('click', () => {
    e.closest('dialog').close();
  });
});

document.querySelectorAll('dialog').forEach((dialog) => {
  if (dialog.id === 'folder-popup-box') return;
  dialog.addEventListener('close', () => {
    forms.forEach((form) => form.reset());
    document.querySelectorAll('input[type="hidden"]').forEach((input) => input.value = '');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

document.querySelector('#submit-gen-psswd').addEventListener('click', () => getPassword(20));
forms.forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()));

document.querySelector('#search-input').addEventListener('input', (e) => {
  const searchValue = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.note').forEach((note) => {
    const title = note.querySelector('.title').textContent.toLowerCase();
    const content = note.querySelector('.details-content').textContent.toLowerCase();
    if (title.includes(searchValue) || content.includes(searchValue)) note.classList.remove('d-none');
    else note.classList.add('d-none');
  });
});

document.querySelector('#btn-download-all').addEventListener('click', () => {
  document.querySelectorAll('input[name="download-notes"]').forEach((e) => {
    e.checked = false;
  });
  document.querySelector('#download-popup-box').showModal();
});

document.querySelectorAll('input[name="download-notes"]').forEach((e) => {
  e.addEventListener('change', (event) => {
    const allNotes = document.querySelectorAll('.note');
    if (allNotes.length === 0) return;
    const a = document.createElement('a');
    let blob, url, filename;
    if (event.target.value === '3') {
      let allNotesHTML = [];
      if (document.querySelector('#id-note-download').value === '') {
        allNotesHTML = Array.from(allNotes).map((note) => {
          const title = note.querySelector('.title').textContent;
          const content = note.querySelector('.details-content').innerHTML;
          return `<h2>${title}</h2>${content}`;
        });
        filename = 'all-notes.html';
      } else {
        const note = document.querySelector(`.note[data-note-id="${document.querySelector('#id-note-download').value}"]`);
        const title = note.querySelector('.title').textContent;
        const content = note.querySelector('.details-content').innerHTML;
        allNotesHTML = [`<h2>${title}</h2>${content}`];
        filename = `${title}.html`;
      }
      blob = new Blob([allNotesHTML.join('')], { type: 'text/html;charset=utf-8' });
    } else {
      let allNotesContent = [];
      if (document.querySelector('#id-note-download').value === '') {
        allNotesContent = Array.from(allNotes).map((note) => {
          const title = note.getAttribute('data-note-title');
          const content = note.getAttribute('data-note-content');
          return `# ${title}\n${content}`;
        });
        filename = event.target.value === '1' ? 'all-notes.txt' : 'all-notes.md';
      } else {
        const note = document.querySelector(`.note[data-note-id="${document.querySelector('#id-note-download').value}"]`);
        const title = note.getAttribute('data-note-title');
        const content = note.getAttribute('data-note-content');
        allNotesContent = [`# ${title}\n${content}`];
        filename = event.target.value === '1' ? `${title}.txt` : `${title}.md`;
      }
      blob = new Blob([allNotesContent.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    }
    url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});

document.querySelectorAll('.link').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelectorAll('.custom-check').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#check-lock-app').addEventListener('change', async (e) => {
  if (isLocked) return;
  if (e.target.checked) await verifyFingerprint();
  try {
    const data = new URLSearchParams({ csrf_token: csrfToken, lock_app: e.target.checked });
    const res = await fetch('./assets/php/lockApp.php', {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) showError(`An error occurred - ${res.status}`);
  } catch (error) {
    showError(`An error occurred - ${error}`);
  }
});

document.querySelectorAll('input[name="filter-notes"]').forEach((e) => {
  e.addEventListener('change', () => {
    const categories = [];
    document.querySelectorAll('input[name="filter-notes"]:checked').forEach((t) => categories.push(t.value));
    document.querySelectorAll('.note').forEach((note) => {
      const category = note.getAttribute('data-note-category');
      if (categories.includes(category)) note.classList.remove('d-none');
      else note.classList.add('d-none');
    });
  });
});
