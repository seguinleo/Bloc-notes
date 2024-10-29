/* global marked, DOMPurify */

import '../../../assets/js/marked.min.js';
import '../../../assets/js/purify.min.js';

marked.use({
  breaks: true
});

let stop = false;
const notesContainer = document.querySelector('#main');
const urlParams = new URLSearchParams(window.location.search);
const noteLink = urlParams.get('link');
const allAccentColors = [
  'accent1',
  'accent2',
  'accent3',
  'accent4',
  'accent5',
  'accent6',
  'accent7',
  'accent8',
];

document.body.classList.add(allAccentColors[Math.floor(Math.random() * allAccentColors.length)]);

const showSharedNote = async () => {
  if (!noteLink) {
    const notFoundElement = document.createElement('h1');
    notFoundElement.classList.add('align-center');
    notFoundElement.textContent = 'Note not found or expired.';
    notesContainer.textContent = '';
    notesContainer.appendChild(notFoundElement);
    stop = true;
    return;
  }

  const data = new URLSearchParams({ noteLink });
  const res = await fetch('../assets/php/getSharedNote.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  });

  if (!res.ok) {
    const notFoundElement = document.createElement('h1');
    notFoundElement.classList.add('align-center');
    notFoundElement.textContent = 'Note not found or expired.';
    notesContainer.textContent = '';
    notesContainer.appendChild(notFoundElement);
    stop = true;
    return;
  }

  const note = await res.json();

  const {
    title, content, date,
  } = note;

  document.title = title;

  const cleanContent = DOMPurify.sanitize(content, {
    SANITIZE_NAMED_PROPS: true,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['dialog', 'footer', 'form', 'header', 'main', 'nav', 'style'],
  });

  const contentHtml = marked.parse(cleanContent);
  const noteElement = document.createElement('div');
  noteElement.classList.add('shared-note');
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
  noteElement.appendChild(detailsElement);
  noteElement.appendChild(bottomContentElement);
  notesContainer.textContent = '';
  notesContainer.appendChild(noteElement);
};

document.addEventListener('DOMContentLoaded', async () => {
  await showSharedNote();
  setInterval(async () => {
    if (!stop) await showSharedNote();
  }, 5000);
});
