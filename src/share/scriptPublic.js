const notesContainer = document.querySelector('main');
const link = notesContainer.getAttribute('data-link');
// eslint-disable-next-line no-undef
const converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('tasklists', true);
converter.setOption('strikethrough', true);
converter.setOption('parseImgDimensions', true);
converter.setOption('simpleLineBreaks', true);
converter.setOption('simplifiedAutoLink', true);

const showSharedNote = async () => {
  if (!link || !/^[a-zA-Z0-9]+$/.test(link)) return;

  const response = await fetch('/seguinleo-notes/assets/php/getSharedNote.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `noteLink=${link}`,
  });

  if (response.status !== 200) {
    const notFoundElement = document.createElement('h1');
    notFoundElement.classList.add('align-center');
    notFoundElement.textContent = 'Note not found or expired.';
    notesContainer.appendChild(notFoundElement);
    return;
  }

  const data = await response.json();

  const {
    title, content, date,
  } = data;

  if (!title || !content || content.length > 5000 || !date) return;

  const contentHtml = converter.makeHtml(content);
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');
  noteElement.tabIndex = 0;

  const detailsElement = document.createElement('div');
  detailsElement.classList.add('details');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('title');
  titleElement.textContent = title;

  const contentElement = document.createElement('span');
  // eslint-disable-next-line no-undef
  contentElement.innerHTML = DOMPurify.sanitize(contentHtml);
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
});
