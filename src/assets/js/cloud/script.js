import * as defaultScript from '../default.js';
import '../marked.min.js';
import '../purify.min.js';

let isUpdate = false;
const noteBox = document.querySelector('#note-popup-box');
const sortBox = document.querySelector('#sort-popup-box');
const filterBox = document.querySelector('#filter-popup-box');
const manageBox = document.querySelector('#manage-popup-box');
const settingsBox = document.querySelector('#settings-popup-box');
const privateNote = document.querySelector('#private-note-popup-box');
const publicNote = document.querySelector('#public-note-popup-box');
const titleNote = noteBox.querySelector('#title');
const contentNote = noteBox.querySelector('#content');
const forms = document.querySelectorAll('form');
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

function changeLanguage(language) {
  if (language === 'fr') {
    document.documentElement.setAttribute('lang', 'fr-FR');
    document.querySelector('#language').value = 'fr';
    document.querySelector('#icon-add').textContent = 'Ajouter une note';
    document.querySelector('#legal a').textContent = 'Mentions légales / confidentialité';
    document.querySelector('#search-option').options[0].textContent = 'Titre';
    document.querySelector('#search-option').options[1].textContent = 'Contenu';
    document.querySelector('#search-option').options[2].textContent = 'Tout';
    document.querySelector('#sort-popup-box legend').textContent = 'Trier les notes';
    document.querySelector('#sort-notes1-span').textContent = 'Date de modification';
    document.querySelector('#sort-notes2-span').textContent = 'Date de modification (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Titre';
    document.querySelector('#sort-notes4-span').textContent = 'Titre (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrer les notes par catégorie';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'Aucune catégorie';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Perso';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Travail';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Voyage';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Tâches';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Rappel';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Idées';
    });
    document.querySelector('#hide-infos').textContent = 'Masquer le contenu';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titre');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenu (Texte brut, Markdown ou HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Enregistrer';
    document.querySelector('#export-all-notes').textContent = 'Exporter toutes les notes (.txt)';
    document.querySelector('#link-markdown').textContent = 'Guide Markdown';
    document.querySelector('#link-help').textContent = 'Aide et discussions';
    document.querySelector('#log-out').textContent = 'Déconnexion';
    document.querySelector('#old-psswd').setAttribute('placeholder', 'Ancien mot de passe');
    document.querySelector('#new-psswd').setAttribute('placeholder', 'Nouveau mot de passe');
    document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirmer le mot de passe');
    document.querySelector('#change-psswd button[type="submit"]').textContent = 'Changer le mot de passe';
    document.querySelector('#gen-psswd summary').textContent = 'Changer le mot de passe';
    document.querySelector('#delete-user summary').textContent = 'Supprimer le compte';
    document.querySelector('#delete-psswd').setAttribute('placeholder', 'Mot de passe');
    document.querySelector('#delete-user button').textContent = 'Supprimer le compte';
    document.querySelector('#private-note span').textContent = 'Voulez-vous rendre votre note privée ? Le lien ne sera plus disponible.';
    document.querySelector('#private-note button').textContent = 'Rendre privée';
    document.querySelector('#public-note span').textContent = 'Voulez-vous rendre votre note publique ? Un lien sera disponible pour la partager.';
    document.querySelector('#public-note button').textContent = 'Rendre publique';
  } else if (language === 'de') {
    document.documentElement.setAttribute('lang', 'de');
    document.querySelector('#language').value = 'de';
    document.querySelector('#icon-add').textContent = 'Notiz hinzufügen';
    document.querySelector('#legal a').textContent = 'Impressum / Datenschutz';
    document.querySelector('#search-option').options[0].textContent = 'Titel';
    document.querySelector('#search-option').options[1].textContent = 'Inhalt';
    document.querySelector('#search-option').options[2].textContent = 'Alles';
    document.querySelector('#sort-popup-box legend').textContent = 'Notizen sortieren';
    document.querySelector('#sort-notes1-span').textContent = 'Änderungsdatum';
    document.querySelector('#sort-notes2-span').textContent = 'Änderungsdatum (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Titel';
    document.querySelector('#sort-notes4-span').textContent = 'Titel (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Notizen filtern nach Kategorie';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'Keine Kategorie';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Persönlich';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Arbeit';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Reise';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Aufgaben';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Erinnerung';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Ideen';
    });
    document.querySelector('#hide-infos').textContent = 'Inhalt ausblenden';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titel');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Inhalt (Rohtext, Markdown oder HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Speichern';
    document.querySelector('#export-all-notes').textContent = 'Alle Notizen exportieren (.txt)';
    document.querySelector('#link-markdown').textContent = 'Markdown-Anleitung';
    document.querySelector('#link-help').textContent = 'Hilfe und Diskussionen';
    document.querySelector('#log-out').textContent = 'Abmelden';
    document.querySelector('#old-psswd').setAttribute('placeholder', 'Altes Passwort');
    document.querySelector('#new-psswd').setAttribute('placeholder', 'Neues Passwort');
    document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Passwort bestätigen');
    document.querySelector('#change-psswd button[type="submit"]').textContent = 'Passwort ändern';
    document.querySelector('#gen-psswd summary').textContent = 'Passwort ändern';
    document.querySelector('#delete-user summary').textContent = 'Konto löschen';
    document.querySelector('#delete-psswd').setAttribute('placeholder', 'Passwort');
    document.querySelector('#delete-user button').textContent = 'Konto löschen';
    document.querySelector('#private-note span').textContent = 'Möchten Sie Ihre Notiz privat machen? Der Link wird nicht mehr verfügbar sein.';
    document.querySelector('#private-note button').textContent = 'Privat machen';
    document.querySelector('#public-note span').textContent = 'Möchten Sie Ihre Notiz öffentlich machen? Ein Link wird verfügbar sein, um es zu teilen.';
    document.querySelector('#public-note button').textContent = 'Öffentlich machen';
  } else if (language === 'es') {
    document.documentElement.setAttribute('lang', 'es');
    document.querySelector('#language').value = 'es';
    document.querySelector('#icon-add').textContent = 'Agregar una nota';
    document.querySelector('#legal a').textContent = 'Aviso legal / privacidad';
    document.querySelector('#search-option').options[0].textContent = 'Título';
    document.querySelector('#search-option').options[1].textContent = 'Contenido';
    document.querySelector('#search-option').options[2].textContent = 'Todo';
    document.querySelector('#sort-popup-box legend').textContent = 'Ordenar notas';
    document.querySelector('#sort-notes1-span').textContent = 'Fecha de modificación';
    document.querySelector('#sort-notes2-span').textContent = 'Fecha de modificación (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Título';
    document.querySelector('#sort-notes4-span').textContent = 'Título (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filtrar notas por categoría';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'Sin categoría';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Personal';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Trabajo';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Viaje';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Tareas';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Recordatorio';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Ideas';
    });
    document.querySelector('#hide-infos').textContent = 'Ocultar contenido';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Título');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenido (Texto sin formato, Markdown o HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Guardar';
    document.querySelector('#export-all-notes').textContent = 'Exportar todas las notas (.txt)';
    document.querySelector('#link-markdown').textContent = 'Guía de Markdown';
    document.querySelector('#link-help').textContent = 'Ayuda y discusiones';
    document.querySelector('#log-out').textContent = 'Cerrar sesión';
    document.querySelector('#old-psswd').setAttribute('placeholder', 'Contraseña antigua');
    document.querySelector('#new-psswd').setAttribute('placeholder', 'Nueva contraseña');
    document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirmar contraseña');
    document.querySelector('#change-psswd button[type="submit"]').textContent = 'Cambiar contraseña';
    document.querySelector('#gen-psswd summary').textContent = 'Cambiar contraseña';
    document.querySelector('#delete-user summary').textContent = 'Eliminar cuenta';
    document.querySelector('#delete-psswd').setAttribute('placeholder', 'Contraseña');
    document.querySelector('#delete-user button').textContent = 'Eliminar cuenta';
    document.querySelector('#private-note span').textContent = '¿Quieres hacer tu nota privada? El enlace ya no estará disponible.';
    document.querySelector('#private-note button').textContent = 'Hacer privado';
    document.querySelector('#public-note span').textContent = '¿Quieres hacer tu nota pública? Un enlace estará disponible para compartirlo.';
    document.querySelector('#public-note button').textContent = 'Hacer público';
  } else {
    document.documentElement.setAttribute('lang', 'en');
    document.querySelector('#language').value = 'en';
    document.querySelector('#icon-add').textContent = 'Add a note';
    document.querySelector('#legal a').textContent = 'Legal notice / privacy';
    document.querySelector('#search-option').options[0].textContent = 'Title';
    document.querySelector('#search-option').options[1].textContent = 'Content';
    document.querySelector('#search-option').options[2].textContent = 'All';
    document.querySelector('#sort-popup-box legend').textContent = 'Sort notes';
    document.querySelector('#sort-notes1-span').textContent = 'Modification date';
    document.querySelector('#sort-notes2-span').textContent = 'Modification date (Z-A)';
    document.querySelector('#sort-notes3-span').textContent = 'Title';
    document.querySelector('#sort-notes4-span').textContent = 'Title (Z-A)';
    document.querySelector('#filter-popup-box legend').textContent = 'Filter notes by category';
    document.querySelectorAll('.no-cat-filter-span').forEach((e) => {
      e.textContent = 'No category';
    });
    document.querySelectorAll('.cat-perso-filter-span').forEach((e) => {
      e.textContent = 'Personal';
    });
    document.querySelectorAll('.cat-pro-filter-span').forEach((e) => {
      e.textContent = 'Work';
    });
    document.querySelectorAll('.cat-voyage-filter-span').forEach((e) => {
      e.textContent = 'Travel';
    });
    document.querySelectorAll('.cat-task-filter-span').forEach((e) => {
      e.textContent = 'Tasks';
    });
    document.querySelectorAll('.cat-rappel-filter-span').forEach((e) => {
      e.textContent = 'Reminder';
    });
    document.querySelectorAll('.cat-idees-filter-span').forEach((e) => {
      e.textContent = 'Ideas';
    });
    document.querySelector('#hide-infos').textContent = 'Hide content';
    document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Title');
    document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Content (Raw text, Markdown or HTML)');
    document.querySelector('#note-popup-box button').textContent = 'Save';
    document.querySelector('#export-all-notes').textContent = 'Export all notes (.txt)';
    document.querySelector('#link-markdown').textContent = 'Markdown guide';
    document.querySelector('#link-help').textContent = 'Help and discussions';
    document.querySelector('#log-out').textContent = 'Log out';
    document.querySelector('#old-psswd').setAttribute('placeholder', 'Old password');
    document.querySelector('#new-psswd').setAttribute('placeholder', 'New password');
    document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirm password');
    document.querySelector('#change-psswd button[type="submit"]').textContent = 'Change password';
    document.querySelector('#gen-psswd summary').textContent = 'Change password';
    document.querySelector('#delete-user summary').textContent = 'Delete account';
    document.querySelector('#delete-psswd').setAttribute('placeholder', 'Password');
    document.querySelector('#delete-user button').textContent = 'Delete account';
    document.querySelector('#private-note span').textContent = 'Do you want to make your note private? The link will no longer be available.';
    document.querySelector('#private-note button').textContent = 'Make private';
    document.querySelector('#public-note span').textContent = 'Do you want to make your note public? A link will be available to share it.';
    document.querySelector('#public-note button').textContent = 'Make public';
  }
}

const verifyFingerprint = async () => {
  try {
    const challenge = defaultScript.generateRandomBytes(16);
    const userId = defaultScript.generateRandomBytes(8);
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
    if (localStorage.getItem('fingerprint') === 'true') await showNotes();
    else localStorage.setItem('fingerprint', 'true');
  } catch (error) {
    if (localStorage.getItem('fingerprint') === 'true') {
      window.location.reload();
    } else document.querySelector('#check-fingerprint').checked = false;
  }
};

if (localStorage.getItem('spellcheck') === 'false') {
  document.querySelector('#spellcheck').checked = false;
  contentNote.setAttribute('spellcheck', 'false');
}

if (localStorage.getItem('compact') === 'true') {
  document.querySelector('#check-compact').checked = true;
  document.querySelector('main').classList.add('compact');
}

const noteAccess = (noteId, link) => {
  document.querySelectorAll('.note').forEach((e) => e.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  if (link === null) {
    privateNote.showModal();
    document.querySelector('#id-note-public').value = noteId;
  } else {
    publicNote.showModal();
    document.querySelector('#id-note-private').value = noteId;
    document.querySelector('#link-note-private').value = link;
    document.querySelector('#copy-note-link').textContent = link;
  }
};

const noteActions = () => {
  document.querySelectorAll('.bottom-content i').forEach((e) => {
    e.addEventListener('click', (event) => {
      const { target } = event;
      const noteId = target.closest('.note').getAttribute('data-note-id');
      const noteTitle = target.closest('.note').getAttribute('data-note-title');
      const noteContent = target.closest('.note').getAttribute('data-note-content');
      const noteColor = target.closest('.note').getAttribute('data-note-color');
      const noteHidden = target.closest('.note').getAttribute('data-note-hidden');
      const noteCategory = target.closest('.note').getAttribute('data-note-category');
      const noteLink = target.closest('.note').getAttribute('data-note-link') || null;
      if (target.classList.contains('fa-pen')) updateNote(noteId, noteTitle, noteContent, noteColor, noteHidden, noteCategory, noteLink);
      else if (target.classList.contains('fa-thumbtack')) pin(noteId);
      else if (target.classList.contains('fa-clipboard')) copy(noteContent);
      else if (target.classList.contains('fa-trash-can')) deleteNote(noteId);
      else if (target.classList.contains('fa-expand')) toggleFullscreen(noteId);
      else if (target.classList.contains('fa-download')) downloadNote(noteTitle, noteContent);
      else if (target.classList.contains('fa-link')) noteAccess(noteId, noteLink, noteTitle, noteContent);
    });
    e.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') e.click();
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      document.querySelector('#search-input').focus();
    }
  });
};

const showNotes = async () => {
  const sort = localStorage.getItem('sort_notes');
  document.querySelector(`input[name="sort-notes"][value="${sort}"]`).checked = true;
  document.querySelectorAll('#list-notes *').forEach((e) => e.remove());
  document.querySelectorAll('.note').forEach((e) => e.remove());
  forms.forEach((form) => form.reset());

  try {
    const data = new URLSearchParams({ csrf_token: csrfToken });
    const res = await fetch('./assets/php/getNotes.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    if (!res.ok) throw new Error('An error occurred - ' + res.status);

    const notesJSON = await res.json();

    if (notesJSON.length === 0) {
      const numberOfNotesElement = document.createElement('h2');
      if (localStorage.getItem('language') === 'de') numberOfNotesElement.textContent = 'Notizen (0)';
      else if (localStorage.getItem('language') === 'es') numberOfNotesElement.textContent = 'Notas (0)';
      else numberOfNotesElement.textContent = 'Notes (0)';
      document.querySelector('#sidebar #list-notes').appendChild(numberOfNotesElement);
      return;
    }

    if (sort === '1') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return b.date.localeCompare(a.date);
      });
    } else if (sort === '2') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return a.date.localeCompare(b.date);
      });
    } else if (sort === '3') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return a.title.localeCompare(b.title);
      });
    } else if (sort === '4') {
      notesJSON.sort((a, b) => {
        if (a.pinned === 1 && b.pinned === 0) return -1;
        if (a.pinned === 0 && b.pinned === 1) return 1;
        return b.title.localeCompare(a.title);
      });
    }

    const numberOfNotesElement = document.createElement('h2');
    if (localStorage.getItem('language') === 'de') numberOfNotesElement.textContent = `Notizen (${notesJSON.length})`;
    else if (localStorage.getItem('language') === 'es') numberOfNotesElement.textContent = `Notas (${notesJSON.length})`;
    else numberOfNotesElement.textContent = `Notes (${notesJSON.length})`;
    document.querySelector('#sidebar #list-notes').appendChild(numberOfNotesElement);

    const fragment = document.createDocumentFragment();

    notesJSON.forEach((row) => {
      const { id, title, content, color, date, hidden, category, pinned, link } = row;

      if (!id || !title || !color || !date) return;

      const bottomContentElement = document.createElement('div');
      bottomContentElement.classList.add('bottom-content');

      const paragraph = document.createElement('p');

      const noteElement = document.createElement('div');
      noteElement.classList.add('note', color);
      noteElement.setAttribute('data-note-id', id);
      noteElement.setAttribute('data-note-title', title);
      noteElement.setAttribute('data-note-content', content);
      noteElement.setAttribute('data-note-color', color);
      noteElement.setAttribute('data-note-hidden', hidden);
      noteElement.setAttribute('data-note-category', category);

      const titleElement = document.createElement('h2');
      titleElement.classList.add('title');
      titleElement.textContent = title;

      const contentElement = document.createElement('div');
      contentElement.classList.add('details-content');
      if (hidden === 0) contentElement.innerHTML = marked.parse(content);
      else contentElement.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';

      const detailsElement = document.createElement('div');
      detailsElement.classList.add('details');
      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(contentElement);

      const editIconElement = document.createElement('i');
      editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action');
      editIconElement.tabIndex = 0;
      editIconElement.setAttribute('role', 'button');
      editIconElement.setAttribute('aria-label', 'Edit note');
      bottomContentElement.appendChild(editIconElement);

      const pinElement = document.createElement('i');
      pinElement.classList.add('fa-solid', 'fa-thumbtack', 'note-action');
      pinElement.tabIndex = 0;
      pinElement.setAttribute('role', 'button');
      pinElement.setAttribute('aria-label', 'Pin note');
      bottomContentElement.appendChild(pinElement);

      if (link === null) {
        const trashIconElement = document.createElement('i');
        trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action');
        trashIconElement.tabIndex = 0;
        trashIconElement.setAttribute('role', 'button');
        trashIconElement.setAttribute('aria-label', 'Delete note');
        bottomContentElement.appendChild(trashIconElement);
      } else {
        noteElement.setAttribute('data-note-link', link);
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('category');
        const iconLink = document.createElement('i');
        iconLink.classList.add('fa-solid', 'fa-link');
        categoryElement.appendChild(iconLink);
        paragraph.appendChild(categoryElement);
      }

      if (hidden === 0 && content !== '') {
        const clipboardIconElement = document.createElement('i');
        clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action');
        clipboardIconElement.tabIndex = 0;
        clipboardIconElement.setAttribute('role', 'button');
        clipboardIconElement.setAttribute('aria-label', 'Copy note content');
        bottomContentElement.appendChild(clipboardIconElement);

        const downloadIconElement = document.createElement('i');
        downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action');
        downloadIconElement.tabIndex = 0;
        downloadIconElement.setAttribute('role', 'button');
        downloadIconElement.setAttribute('aria-label', 'Download note');
        bottomContentElement.appendChild(downloadIconElement);

        const linkIconElement = document.createElement('i');
        linkIconElement.classList.add('fa-solid', 'fa-link', 'note-action');
        linkIconElement.tabIndex = 0;
        linkIconElement.setAttribute('role', 'button');
        linkIconElement.setAttribute('aria-label', 'Share note');
        bottomContentElement.appendChild(linkIconElement);

        const expandIconElement = document.createElement('i');
        expandIconElement.classList.add('fa-solid', 'fa-expand', 'note-action');
        expandIconElement.tabIndex = 0;
        expandIconElement.setAttribute('role', 'button');
        expandIconElement.setAttribute('aria-label', 'Fullscreen note');
        bottomContentElement.appendChild(expandIconElement);
      }

      noteElement.appendChild(detailsElement);
      noteElement.appendChild(bottomContentElement);
      paragraph.setAttribute('tabindex', '0');
      paragraph.setAttribute('role', 'button');

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('title-list');
      titleSpan.textContent = title;

      const dateSpan = document.createElement('span');
      dateSpan.classList.add('date-list');
      dateSpan.textContent = new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (pinned === 1) {
        noteElement.classList.add('pinned');
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('category');
        const iconPin = document.createElement('i');
        iconPin.classList.add('fa-solid', 'fa-thumbtack');
        categoryElement.appendChild(iconPin);
        paragraph.appendChild(categoryElement);
      }

      if (category !== 0) {
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('category');
        categoryElement.textContent = document.querySelector(`input[name="category"][value="${category}"]`).parentElement.textContent;
        paragraph.appendChild(categoryElement);
      }

      if (hidden !== 0) {
        const categoryElement = document.createElement('span');
        categoryElement.classList.add('category');
        const iconEye = document.createElement('i');
        iconEye.classList.add('fa-solid', 'fa-eye-slash');
        categoryElement.appendChild(iconEye);
        paragraph.appendChild(categoryElement);
      }

      fragment.appendChild(noteElement);
      paragraph.appendChild(titleSpan);
      paragraph.appendChild(dateSpan);
      document.querySelector('#sidebar #list-notes').appendChild(paragraph);
    });

    document.querySelector('main').appendChild(fragment);
    defaultScript.searchSidebar();
    noteActions();
    document.querySelector('#last-sync span').textContent = new Date().toLocaleTimeString();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
  }
};

const toggleFullscreen = (noteId) => {
  const note = document.querySelector(`.note[data-note-id="${noteId}"]`);
  note.classList.toggle('fullscreen');
  document.body.classList.toggle('body-fullscreen');
};

const fetchDelete = async (noteId) => {
  try {
    const data = new URLSearchParams({ noteId, csrf_token: csrfToken });
    const res = await fetch('./assets/php/deleteNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError('An error occurred - ' + res.status);
      return;
    }
    await showNotes();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
  }
};

const fetchLogout = async () => {
  try {
    const res = await fetch('./assets/php/logout.php', {
      method: 'POST',
    });
    if (!res.ok) {
      defaultScript.showError('An error occurred - ' + res.status);
      return;
    }
    window.location.reload();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
  }
};

const updateNote = (noteId, title, content, color, hidden, category, link) => {
  isUpdate = true;
  document.querySelectorAll('.note').forEach((e) => e.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  document.querySelector('#icon-add').click();
  document.querySelector('#id-note').value = noteId;
  titleNote.value = title;
  contentNote.value = content;
  document.querySelectorAll('#colors span').forEach((e) => {
    if (e.classList.contains(color)) e.classList.add('selected');
    else e.classList.remove('selected');
  });
  document.querySelector(`input[name="category"][value="${category}"]`).checked = true;
  if (link === null) {
    document.querySelector('#check-hidden').disabled = false;
    if (parseInt(hidden, 10) === 1) document.querySelector('#check-hidden').checked = true;
  } else document.querySelector('#check-hidden').disabled = true;
  document.querySelector('#textarea-length').textContent = `${contentNote.value.length}/5000`;
  contentNote.focus();
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

const copy = (content) => {
  navigator.clipboard.writeText(content);
};

const pin = async (noteId) => {
  try {
    const data = new URLSearchParams({ noteId, csrf_token: csrfToken });
    const res = await fetch('./assets/php/pinNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError('An error occurred - ' + res.status);
      return;
    }
    await showNotes();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
  }
};

const deleteNote = (noteId) => {
  document.querySelectorAll('.note').forEach((note) => note.classList.remove('fullscreen'));
  document.body.classList.remove('body-fullscreen');
  let message = '';
  if (localStorage.getItem('language') === 'fr') message = 'Êtes-vous sûr de vouloir supprimer cette note ?';
  else if (localStorage.getItem('language') === 'de') message = 'Möchten Sie diese Notiz wirklich löschen?';
  else if (localStorage.getItem('language') === 'es') message = '¿Estás seguro que quieres eliminar esta nota?';
  else message = 'Do you really want to delete this note?';
  if (window.confirm(message)) fetchDelete(noteId);
};

document.querySelectorAll('#icon-add, #icon-float-add').forEach((e) => {
  e.addEventListener('click', () => {
    noteBox.showModal();
    document.querySelector('#textarea-length').textContent = '0/5000';
    document.querySelector('#check-hidden').disabled = false;
  });
});

document.querySelector('#control-clear').addEventListener('click', () => {
  contentNote.value = '';
});

document.querySelector('#spellcheck').addEventListener('change', () => {
  if (!document.querySelector('#spellcheck').checked) {
    localStorage.setItem('spellcheck', 'false');
    contentNote.setAttribute('spellcheck', 'false');
  } else {
    localStorage.removeItem('spellcheck');
    contentNote.setAttribute('spellcheck', 'true');
  }
});

document.querySelector('#check-fingerprint').addEventListener('change', () => {
  if (document.querySelector('#check-fingerprint').checked) verifyFingerprint();
  else localStorage.removeItem('fingerprint');
});

document.querySelector('#manage-account').addEventListener('click', () => {
  manageBox.showModal();
});

document.querySelector('#settings').addEventListener('click', () => {
  settingsBox.showModal();
  document.querySelector('#sidebar').classList.remove('show');
});

document.querySelectorAll('.fa-xmark').forEach((e) => {
  e.addEventListener('click', () => {
    isUpdate = false;
    forms.forEach((form) => form.reset());
    document.querySelectorAll('dialog').forEach((dialog) => dialog.close());
  });
});

document.querySelector('#language').addEventListener('change', async () => {
  const e = document.querySelector('#language').value;
  if (e === 'fr') {
    localStorage.setItem('language', 'fr');
    changeLanguage('fr');
  } else if (e === 'de') {
    localStorage.setItem('language', 'de');
    changeLanguage('de');
  } else if (e === 'es') {
    localStorage.setItem('language', 'es');
    changeLanguage('es');
  } else {
    localStorage.setItem('language', 'en');
    changeLanguage('en');
  }
  await showNotes();
});

contentNote.addEventListener('input', () => {
  const e = contentNote.value.length;
  document.querySelector('#textarea-length').textContent = `${e}/5000`;
});

document.querySelector('#copy-note-link-btn').addEventListener('click', () => {
  const link = document.querySelector('#copy-note-link').textContent;
  navigator.clipboard.writeText(`localhost/share/?link=${link}`);
});

document.querySelector('#log-out').addEventListener('click', () => fetchLogout());
document.querySelector('#btn-sort').addEventListener('click', () => sortBox.showModal());
document.querySelector('#btn-filter').addEventListener('click', () => filterBox.showModal());
document.querySelector('#submit-gen-psswd').addEventListener('click', () => defaultScript.getPassword(16));
forms.forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()));

document.querySelector('#copy-password-btn').addEventListener('click', () => {
  const psswd = document.querySelector('#psswd-gen').textContent;
  navigator.clipboard.writeText(psswd);
});

document.querySelectorAll('input[name="sort-notes"]').forEach(async (e) => {
  e.addEventListener('change', async () => {
    if (e.value === '1' || e.value === '2' || e.value === '3' || e.value === '4') {
      localStorage.setItem('sort_notes', e.value);
      await showNotes();
    }
  });
});

document.querySelector('#add-note').addEventListener('submit', async () => {
  try {
    const noteId = document.querySelector('#id-note').value;
    const title = titleNote.value.trim();
    const content = contentNote.value.trim();
    const color = document.querySelector('#colors .selected').classList[0];
    const hidden = document.querySelector('#check-hidden').checked ? 1 : 0;
    const category = document.querySelector('input[name="category"]:checked').value;

    if (!title || title.length > 30 || content.length > 5000 || !color) return;
    if (isUpdate && !noteId) return;
    if (!/^[0-9]+$/.test(category)) return;

    const cleanContent = DOMPurify.sanitize(content, {
      SANITIZE_NAMED_PROPS: true,
    });

    const data = isUpdate ? new URLSearchParams({
      noteId,
      title,
      content: cleanContent,
      color,
      hidden,
      category,
      csrf_token: csrfToken,
    }) : new URLSearchParams({
      title,
      content: cleanContent,
      color,
      hidden,
      category,
      csrf_token: csrfToken,
    });

    const url = isUpdate ? './assets/php/updateNote.php' : './assets/php/addNote.php';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError('An error occurred - ' + res.status);
      return;
    }
    isUpdate = false;
    noteBox.close();
    await showNotes();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
  }
});

document.querySelector('#change-psswd').addEventListener('submit', async () => {
  const a = document.querySelector('#old-psswd').value;
  const e = document.querySelector('#new-psswd').value;
  const t = document.querySelector('#new-psswd-valid').value;
  if (!a || !e || !t || e.length < 8 || e.length > 64) return;
  if (/^[0-9]+$/.test(e)) {
    defaultScript.showError('Password too weak (only numbers)...');
    return;
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    defaultScript.showError('Password too weak (only letters)...');
    return;
  }
  if (e !== t) {
    defaultScript.showError('Passwords do not match...');
    return;
  }
  const psswdOld = a;
  const psswdNew = e;
  try {
    const data = new URLSearchParams({ psswdOld, psswdNew, csrf_token: csrfToken });
    const res = await fetch('./assets/php/updatePsswd.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError('An error occurred - ' + res.status);
      forms.forEach((form) => form.reset());
      return;
    }
    manageBox.close();
    defaultScript.showSuccess('Successfully changed password!');
    forms.forEach((form) => form.reset());
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
    forms.forEach((form) => form.reset());
  }
});

document.querySelector('#delete-account').addEventListener('submit', async () => {
  const psswd = document.querySelector('#delete-psswd').value;
  if (!psswd || psswd.length < 8 || psswd.length > 64) return;
  try {
    const data = new URLSearchParams({ psswd, csrf_token: csrfToken });
    const res = await fetch('./assets/php/deleteAccount.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      console.log(res)
      defaultScript.showError('An error occurred - ' + res.status);
      forms.forEach((form) => form.reset());
      return;
    }
    window.location.reload();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
    forms.forEach((form) => form.reset());
  }
});

document.querySelector('#private-note').addEventListener('submit', async () => {
  const noteId = document.querySelector('#id-note-private').value;
  const link = document.querySelector('#link-note-private').value;
  if (!noteId || !link || !/^[a-zA-Z0-9]+$/.test(link)) return;
  try {
    const data = new URLSearchParams({ noteId, noteLink: link, csrf_token: csrfToken });
    const res = await fetch('./assets/php/privateNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError('An error occurred - ' + res.status);
      return;
    }
    publicNote.close();
    await showNotes();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
  }
});

document.querySelector('#public-note').addEventListener('submit', async () => {
  const noteId = document.querySelector('#id-note-public').value;
  if (!noteId) return;
  try {
    const data = new URLSearchParams({ noteId, csrf_token: csrfToken });
    const res = await fetch('./assets/php/publicNote.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!res.ok) {
      defaultScript.showError('An error occurred - ' + res.status);
      return;
    }
    privateNote.close();
    await showNotes();
  } catch (error) {
    defaultScript.showError('An error occurred - ' + error);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) await navigator.serviceWorker.register('sw.js');
  document.querySelector('#last-sync').addEventListener('click', () => window.location.reload());
  changeLanguage(localStorage.getItem('language'));
  if (localStorage.getItem('fingerprint') !== 'true') await showNotes();
  else {
    verifyFingerprint();
    document.querySelector('#check-fingerprint').checked = true;
  }
});
