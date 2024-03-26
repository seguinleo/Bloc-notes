import '../../../assets/js/marked.min.js';

let stop = false;
const notesContainer = document.querySelector('main');
const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get('link');

const showSharedNote = async () => {
  if (!link) {
    const notFoundElement = document.createElement('h1');
    notFoundElement.classList.add('align-center');
    notFoundElement.textContent = 'Note not found or expired.';
    notesContainer.textContent = '';
    notesContainer.appendChild(notFoundElement);
    stop = true;
    return;
  }

  const response = await fetch('../assets/php/getSharedNote.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `noteLink=${link}`,
  });

  if (!response.ok) {
    const notFoundElement = document.createElement('h1');
    notFoundElement.classList.add('align-center');
    notFoundElement.textContent = 'Note not found or expired.';
    notesContainer.textContent = '';
    notesContainer.appendChild(notFoundElement);
    stop = true;
    return;
  }

  const data = await response.json();

  const {
    title, content, date,
  } = data;

  if (!title || !content || content.length > 5000 || !date) return;

  document.title = title;

  const contentHtml = marked.parse(content);
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');
  noteElement.tabIndex = 0;

  const detailsElement = document.createElement('div');
  detailsElement.classList.add('details');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('title');
  titleElement.textContent = title;

  const contentElement = document.createElement('span');
  contentElement.innerHTML = contentHtml;
  detailsElement.appendChild(titleElement);
  detailsElement.appendChild(contentElement);

  const bottomContentElement = document.createElement('div');
  bottomContentElement.classList.add('bottom-content');

  const dateElement = document.createElement('span');
  dateElement.textContent = new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  bottomContentElement.appendChild(dateElement);

  const clipboardIconElement = document.createElement('i');
  clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
  clipboardIconElement.tabIndex = 0;
  clipboardIconElement.setAttribute('data-note-content', content);
  clipboardIconElement.setAttribute('role', 'button');
  clipboardIconElement.setAttribute('aria-label', 'Copy note to clipboard');
  bottomContentElement.appendChild(clipboardIconElement);

  const downloadIconElement = document.createElement('i');
  downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
  downloadIconElement.tabIndex = 0;
  downloadIconElement.setAttribute('data-note-title', title);
  downloadIconElement.setAttribute('data-note-content', content);
  downloadIconElement.setAttribute('role', 'button');
  downloadIconElement.setAttribute('aria-label', 'Download note');
  bottomContentElement.appendChild(downloadIconElement);
  noteElement.appendChild(detailsElement);
  noteElement.appendChild(bottomContentElement);
  notesContainer.textContent = '';
  notesContainer.appendChild(noteElement);
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

const copy = (content) => navigator.clipboard.writeText(content);

notesContainer.addEventListener('click', (event) => {
  const { target } = event;
  if (target.classList.contains('note-action')) {
    const noteTitle = target.getAttribute('data-note-title');
    const noteContent = target.getAttribute('data-note-content');
    if (target.classList.contains('fa-clipboard')) copy(noteContent);
    else if (target.classList.contains('fa-download')) downloadNote(noteTitle, noteContent);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-clipboard')) document.activeElement.click();
    else if (document.activeElement.classList.contains('fa-download')) document.activeElement.click();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await showSharedNote();
  setInterval(async () => {
    if (!stop) await showSharedNote();
  }, 5000);
});
