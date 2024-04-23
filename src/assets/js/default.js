let touchstartX = 0;
let touchendX = 0;
let timeoutNotification = null;
const sidebar = document.querySelector('#sidebar');
const metaTheme = document.querySelectorAll('.theme-color');
const buttonTheme = document.querySelector('#icon-theme');

export function generateRandomBytes(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

export function getPassword(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&~"#\'(-_)=^$€*!?,.;:/|\\@%+{}[]<>`';
  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i += 1) password += chars[parseInt(array[i] % chars.length, 10)];
  document.querySelector('#psswd-gen').textContent = password;
}

export function showSuccess(message) {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelector('#success-notification');
  notification.textContent = message;
  notification.style.display = 'block';
  timeoutNotification = setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

export function showError(message) {
  if (timeoutNotification) clearTimeout(timeoutNotification);
  const notification = document.querySelectorAll('.error-notification');
  notification.forEach((e) => {
    e.textContent = message;
    e.style.display = 'block';
    timeoutNotification = setTimeout(() => {
      e.style.display = 'none';
    }, 5000);
  });
}

export function downloadNote(title, content) {
  const a = document.createElement('a');
  a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
  a.setAttribute('download', `${title}.txt`);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function copy(content) {
  navigator.clipboard.writeText(content);
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
if (localStorage.getItem('compact') === 'true') {
  document.querySelector('#check-compact').checked = true;
  document.querySelector('main').classList.add('compact');
}
if (localStorage.getItem('spellcheck') === 'false') {
  document.querySelector('#spellcheck').checked = false;
  document.querySelector('#content').setAttribute('spellcheck', 'false');
}
if (localStorage.getItem('plugin-math') === 'true') {
  document.querySelector('#plugin-math').classList.add('active');
}
if (localStorage.getItem('plugin-highlight') === 'true') {
  document.querySelector('#plugin-highlight').classList.add('active');
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
if (localStorage.getItem('language') === null) localStorage.setItem('language', 'en');

document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
}, false);

document.querySelector('#language').addEventListener('change', async () => {
  const e = document.querySelector('#language').value;
  if (e === 'fr') localStorage.setItem('language', 'fr');
  else if (e === 'de') localStorage.setItem('language', 'de');
  else if (e === 'es') localStorage.setItem('language', 'es');
  else localStorage.setItem('language', 'en');
  window.location.reload();
});

document.querySelectorAll('#icon-add, #icon-float-add').forEach((e) => {
  e.addEventListener('click', () => {
    document.querySelector('#note-popup-box').showModal();
    document.querySelector('#textarea-length').textContent = '0/5000';
    document.querySelector('#check-hidden').disabled = false;
  });
});

document.querySelector('#control-clear').addEventListener('click', () => {
  document.querySelector('#note-popup-box #content').value = '';
});

document.querySelector('#spellcheck').addEventListener('change', () => {
  if (!document.querySelector('#spellcheck').checked) {
    localStorage.setItem('spellcheck', 'false');
    document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'false');
  } else {
    localStorage.removeItem('spellcheck');
    document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'true');
  }
});

document.querySelector('#note-popup-box #content').addEventListener('input', () => {
  const e = document.querySelector('#note-popup-box #content').value.length;
  document.querySelector('#textarea-length').textContent = `${e}/5000`;
});

document.querySelector('#settings').addEventListener('click', () => {
  document.querySelector('#settings-popup-box').showModal();
  document.querySelector('#sidebar').classList.remove('show');
});

document.querySelector('#plugins').addEventListener('click', () => {
  document.querySelector('#plugins-popup-box').showModal();
  document.querySelector('#sidebar').classList.remove('show');
});

document.querySelector('#copy-password-btn').addEventListener('click', () => {
  const psswd = document.querySelector('#psswd-gen').textContent;
  navigator.clipboard.writeText(psswd);
});

document.querySelector('#sidebar-indicator').addEventListener('click', () => {
  openSidebar();
});

document.querySelector('#check-compact').addEventListener('change', () => {
  if (document.querySelector('#check-compact').checked) {
    localStorage.setItem('compact', 'true');
    document.querySelector('main').classList.add('compact');
  } else {
    localStorage.removeItem('compact');
    document.querySelector('main').classList.remove('compact');
  }
});

document.querySelector('#btn-theme').addEventListener('click', () => {
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

document.querySelector('#btn-sort').addEventListener('click', () => document.querySelector('#sort-popup-box').showModal());

document.querySelector('#btn-filter').addEventListener('click', () => document.querySelector('#filter-popup-box').showModal());

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

document.querySelector('#search-input').addEventListener('input', () => {
  const searchValue = document.querySelector('#search-input').value.trim().toLowerCase();
  document.querySelectorAll('.note').forEach((e) => {
    if (document.querySelector('#search-option').value === '0') {
      const title = e.querySelector('.note h2').textContent.toLowerCase();
      if (title.includes(searchValue)) e.style.display = 'flex';
      else e.style.display = 'none';
    } else if (document.querySelector('#search-option').value === '1') {
      const content = e.querySelector('.details-content').textContent.toLowerCase();
      if (content.includes(searchValue)) e.style.display = 'flex';
      else e.style.display = 'none';
    } else {
      const title = e.querySelector('.note h2').textContent.toLowerCase();
      const content = e.querySelector('.details-content').textContent.toLowerCase();
      if (title.includes(searchValue) || content.includes(searchValue)) e.style.display = 'flex';
      else e.style.display = 'none';
    }
  });
});

document.querySelector('#export-all-notes').addEventListener('click', () => {
  if (document.querySelector('.note') === null) return;
  const notes = [];
  document.querySelectorAll('.note').forEach((e) => {
    const title = e.getAttribute('data-note-title');
    const content = e.getAttribute('data-note-content');
    notes.push(`${title}\n\n${content}`);
  });
  const a = document.createElement('a');
  a.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(notes.join('\n\n--------------------\n\n'))}`);
  a.setAttribute('download', 'notes.txt');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

document.querySelectorAll('.link').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelectorAll('.category').forEach((e) => {
  e.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') e.click();
  });
});

document.querySelector('#plugin-math').addEventListener('click', () => {
  document.querySelector('#plugin-math').classList.toggle('active');
  if (document.querySelector('#plugin-math').classList.contains('active')) localStorage.setItem('plugin-math', 'true');
  else localStorage.removeItem('plugin-math');
});

document.querySelector('#plugin-highlight').addEventListener('click', () => {
  document.querySelector('#plugin-highlight').classList.toggle('active');
  if (document.querySelector('#plugin-highlight').classList.contains('active')) localStorage.setItem('plugin-highlight', 'true');
  else localStorage.removeItem('plugin-highlight');
});

document.querySelectorAll('input[name="filter-notes"]').forEach((e) => {
  e.addEventListener('change', () => {
    const categories = [];
    document.querySelectorAll('input[name="filter-notes"]:checked').forEach((t) => categories.push(t.value));
    document.querySelectorAll('.note').forEach((n) => {
      const note = n;
      const category = note.getAttribute('data-note-category');
      if (categories.includes(category)) note.style.display = 'flex';
      else note.style.display = 'none';
    });
  });
});
