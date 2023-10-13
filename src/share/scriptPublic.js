const notesContainer = document.querySelector('main');
const link = notesContainer.getAttribute('data-link');
const replaceAllStart = (e) => e.replaceAll('<br /><br />', '\n\n').replaceAll('<br />', '\n');
const replaceAllEnd = (e) => e.replaceAll('\n\n', '<br /><br />').replaceAll('\n', '<br />');
const taskListEnablerExtension = () => [{
  type: 'output',
  regex: /<input type="checkbox"?/g,
  replace: '<input type="checkbox"',
}];

// eslint-disable-next-line no-undef
const converter = new showdown.Converter({
  tasklists: true,
  smoothLivePreview: true,
  extensions: [taskListEnablerExtension],
});

const showSharedNote = async () => {
  const response = await fetch('../../assets/php/getSharedNote.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `noteLink=${link}`,
  });
  const data = await response.json();
  data.forEach((row) => {
    const {
      title, desc, couleur, date, user,
    } = row;
    const descEnd = replaceAllEnd(desc);
    const descHtml = converter.makeHtml(desc);
    const noteElement = document.createElement('div');
    noteElement.classList.add('note', couleur);
    noteElement.tabIndex = 0;
    const detailsElement = document.createElement('div');
    detailsElement.classList.add('details');
    const titleElement = document.createElement('h2');
    titleElement.classList.add('title');
    titleElement.textContent = title;
    const descElement = document.createElement('span');
    descElement.innerHTML = descHtml;
    detailsElement.appendChild(titleElement);
    detailsElement.appendChild(descElement);
    const bottomContentElement = document.createElement('div');
    bottomContentElement.classList.add('bottom-content');
    const dateElement = document.createElement('span');
    dateElement.textContent = `${date} by ${user}`;
    bottomContentElement.appendChild(dateElement);
    const clipboardIconElement = document.createElement('i');
    clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
    clipboardIconElement.tabIndex = 0;
    clipboardIconElement.setAttribute('data-note-desc', descEnd);
    clipboardIconElement.setAttribute('role', 'button');
    bottomContentElement.appendChild(clipboardIconElement);
    const downloadIconElement = document.createElement('i');
    downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
    downloadIconElement.tabIndex = 0;
    downloadIconElement.setAttribute('data-note-title', title);
    downloadIconElement.setAttribute('data-note-desc', descEnd);
    downloadIconElement.setAttribute('role', 'button');
    bottomContentElement.appendChild(downloadIconElement);
    noteElement.appendChild(detailsElement);
    noteElement.appendChild(bottomContentElement);
    notesContainer.appendChild(noteElement);
  });
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
  const copyText = replaceAllStart(e);
  navigator.clipboard.writeText(copyText);
};

notesContainer.addEventListener('click', (event) => {
  const { target } = event;
  if (target.classList.contains('note-action')) {
    const noteTitle = target.getAttribute('data-note-title');
    const noteDesc = target.getAttribute('data-note-desc');
    if (target.classList.contains('fa-clipboard')) {
      copy(noteDesc);
    } else if (target.classList.contains('fa-download')) {
      downloadNote(noteTitle, noteDesc);
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement.classList.contains('fa-clipboard')) {
      document.activeElement.click();
    } else if (document.activeElement.classList.contains('fa-download')) {
      document.activeElement.click();
    }
  } else if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.querySelector('#search-input').focus();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await showSharedNote();
});
