/* global marked */

import '../../../assets/js/marked.min.js';

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

  const contentHtml = marked.parse(content);
  const noteElement = document.createElement('div');
  noteElement.classList.add('shared-note', 'bg-default');
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
  noteElement.appendChild(detailsElement);
  noteElement.appendChild(bottomContentElement);
  notesContainer.textContent = '';
  notesContainer.appendChild(noteElement);
};

const copy = (content) => navigator.clipboard.writeText(content);

notesContainer.addEventListener('click', (event) => {
  const { target } = event;
  if (target.classList.contains('note-action')) {
    const noteContent = target.getAttribute('data-note-content');
    if (target.classList.contains('fa-clipboard')) copy(noteContent);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-clipboard')) document.activeElement.click();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await showSharedNote();
  setInterval(async () => {
    if (!stop) await showSharedNote();
  }, 5000);
});
