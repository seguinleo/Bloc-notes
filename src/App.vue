<template>
  <div id="offline" class="d-none">
    <p>You are offline</p>
  </div>
  <header class="d-none">
    <button type="button" id="sidebar-indicator" aria-label="Open sidebar" @click="openSidebar()">
      <i class="fa-solid fa-bars"></i>
    </button>
    <div id="div-search" role="search">
      <i class="fa-solid fa-magnifying-glass" role="none"></i>
      <input v-model="searchValue" type="search" id="search-input" maxlength="30" aria-label="Search" autocomplete="off"
        @input="searchNotes()">
      <kbd>CTRL</kbd><kbd>K</kbd>
    </div>
  </header>
  <div id="sidebar" class="d-none">
    <nav>
      <div class="row">
        <img v-if="new Date().getMonth() === 11" src="./assets/img/christmas.png" alt="christmas" class="christmas"
          width="36" height="29" loading="lazy">
        <h1 class="main-title">Bloc-notes</h1>
      </div>
      <div class="row nav-buttons">
        <button v-if="name && !isLocked" id="manage-account" type="button" aria-label="Manage account"
          @click="showManageAccountPopup()">
          <i class="fa-solid fa-circle-user"></i>
        </button>
        <button v-if="!name && !isLocked" id="log-in" type="button" aria-label="Log in" @click="showLoginPopup()">
          <i class="fa-solid fa-circle-user"></i>
        </button>
        <button v-if="!isLocked" type="button" id="btn-sort" aria-label="Sort notes" @click="showSortPopup()">
          <i class="fa-solid fa-arrow-up-wide-short"></i>
        </button>
        <button v-if="!isLocked" type="button" id="btn-filter" aria-label="Filter notes" @click="showFilterPopup()">
          <i class="fa-solid fa-filter"></i>
        </button>
        <button v-if="!isLocked" type="button" id="btn-download-all" aria-label="Download all notes"
          @click="downloadAllNotes()">
          <i class="fa-solid fa-download"></i>
        </button>
        <button v-if="!isLocked" type="button" id="btn-settings" aria-label="Settings" @click="showSettingsPopup()">
          <i class="fa-solid fa-gear"></i>
        </button>
        <button type="button" id="btn-colorpicker" aria-label="Change app color" @click="showColorPickerPopup()">
          <i class="fa-solid fa-palette"></i>
        </button>
      </div>
      <div id="list-notes"></div>
    </nav>
  </div>
  <main>
    <button v-if="isLocked" id="btn-unlock-float" type="button" aria-label="Unlock app" @click="unlockApp()">
      <i class="fa-solid fa-lock"></i>
    </button>
    <button v-else type="button" id="btn-add-note" aria-label="Add a note" @click="showAddNotePopup()">
      <i class="fa-solid fa-plus"></i>
    </button>
    <div id="success-notification" class="d-none"></div>
    <dialog id="sort-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <fieldset>
            <legend></legend>
            <div class="row">
              <label class="custom-check">
                <input type="radio" name="sort-notes" value="1" id="sort-notes1" checked>
                <span id="sort-notes1-span" tabindex="0" role="button"></span>
              </label><label class="custom-check">
                <input type="radio" name="sort-notes" value="2" id="sort-notes2">
                <span id="sort-notes2-span" tabindex="0" role="button"></span>
              </label><label class="custom-check">
                <input type="radio" name="sort-notes" value="3" id="sort-notes3">
                <span id="sort-notes3-span" tabindex="0" role="button"></span>
              </label><label class="custom-check">
                <input type="radio" name="sort-notes" value="4" id="sort-notes4">
                <span id="sort-notes4-span" tabindex="0" role="button"></span>
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    </dialog>
    <dialog id="filter-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <fieldset>
            <legend></legend>
            <div id="filter-categories" class="row"></div>
          </fieldset>
        </div>
      </div>
    </dialog>
    <dialog id="delete-note-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <form :id="name ? 'delete-cloud-note' : 'delete-local-note'">
            <div class="error-notification d-none"></div>
            <div class="row">
              <span></span>
            </div>
            <input id="id-note-delete" type="hidden">
            <div class="row">
              <button type="submit" class="btn-cancel"></button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
    <dialog id="download-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <fieldset>
            <legend></legend>
            <input id="id-note-download" type="hidden">
            <div class="row">
              <label class="custom-check">
                <input type="radio" name="download-notes" value="txt" id="txt-download">
                <span tabindex="0" role="button">.TXT</span>
              </label><label class="custom-check">
                <input type="radio" name="download-notes" value="md" id="md-download">
                <span tabindex="0" role="button">.MD</span>
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    </dialog>
    <dialog id="folder-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-arrow-left"></i>
          </div>
          <div id="folders">
            <label class="custom-check">
              <input type="radio" name="add-folder" value="" id="none-folder-add-span" checked>
              <span tabindex="0" role="button">
                <i class="fa-solid fa-xmark"></i>
              </span>
            </label>
            <span class="list"></span>
          </div>
          <form id="add-folder" autocomplete="off">
            <div class="error-notification d-none"></div>
            <div class="row">
              <input type="text" id="name-folder" maxlength="18" aria-label="Name">
            </div>
            <button type="submit" @click="createFolder()"></button>
          </form>
        </div>
      </div>
    </dialog>
    <dialog id="category-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-arrow-left"></i>
          </div>
          <div id="categories">
            <label class="custom-check">
              <input type="radio" name="add-cat" value="" id="none-cat-add-span" checked>
              <span tabindex="0" role="button">
                <i class="fa-solid fa-xmark"></i>
              </span>
            </label>
            <span class="list"></span>
          </div>
          <form id="add-category" autocomplete="off">
            <div class="error-notification d-none"></div>
            <div class="row">
              <input type="text" id="name-category" maxlength="18" aria-label="Name">
            </div>
            <button type="submit" @click="createCategory()"></button>
          </form>
        </div>
      </div>
    </dialog>
    <dialog id="reminder-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-arrow-left"></i>
          </div>
          <div class="row">
            <input type="datetime-local" id="date-reminder-input" aria-label="Date">
          </div>
        </div>
      </div>
    </dialog>
    <dialog id="note-popup-box">
      <div class="popup">
        <div class="content">
          <div class="popup-header">
            <div id="submit-note" class="done">
              <button type="submit" :form="name ? 'add-cloud-note' : 'add-local-note'" aria-label="Save note">
                <i class="fa-solid fa-check"></i>
              </button>
            </div>
            <div class="close">
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
          <form :id="name ? 'add-cloud-note' : 'add-local-note'" autocomplete="off">
            <input id="id-note" type="hidden">
            <div class="error-notification d-none"></div>
            <input type="text" id="title" maxlength="30" aria-label="Title" autofocus required>
            <textarea id="content" maxlength="20000" spellcheck="true" aria-label="Content"
              @input="updateNoteContentLength()"></textarea>
            <div class="row">
              <span id="textarea-length">
                {{ noteContentLength }}/{{ maxNoteContentLength }}
              </span>
              <span class="editor-control">
                <i class="fa-solid fa-broom" tabindex="0" role="button" aria-label="Clear content"
                  @click="clearNoteContent()"></i>
              </span>
            </div>
            <div class="row">
              <button type="button" id="btn-add-folder" aria-label="Add a folder" @click="showFolderPopup()">
                <i class="fa-solid fa-folder"></i>
              </button>
              <button type="button" id="btn-add-category" aria-label="Add a category" @click="showCatPopup()">
                <i class="fa-solid fa-tags"></i>
              </button>
              <button type="button" id="btn-add-reminder" aria-label="Add a reminder" @click="showReminderPopup()">
                <i class="fa-solid fa-bell"></i>
              </button>
            </div>
            <div class="row">
              <div id="colors">
                <span class="bg-default" tabindex="0" role="button" aria-label="Default"></span>
                <span class="bg-red" tabindex="0" role="button" aria-label="Red"></span>
                <span class="bg-orange" tabindex="0" role="button" aria-label="Orange"></span>
                <span class="bg-yellow" tabindex="0" role="button" aria-label="Yellow"></span>
                <span class="bg-lime" tabindex="0" role="button" aria-label="Lime"></span>
                <span class="bg-green" tabindex="0" role="button" aria-label="Green"></span>
                <span class="bg-cyan" tabindex="0" role="button" aria-label="Cyan"></span>
                <span class="bg-light-blue" tabindex="0" role="button" aria-label="Light blue"></span>
                <span class="bg-blue" tabindex="0" role="button" aria-label="Blue"></span>
                <span class="bg-purple" tabindex="0" role="button" aria-label="Purple"></span>
                <span class="bg-pink" tabindex="0" role="button" aria-label="Pink"></span>
              </div>
            </div>
            <div class="row d-flex align-items-center">
              <span id="hide-infos"></span>
              <label class="switch">
                <input type="checkbox" class="checkbox" id="check-hidden">
                <span class="toggle-thumb">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="off">
                    <rect x="12" y="6" width="1" height="12" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="on">
                    <circle cx="12" cy="12" r="5" stroke-width="1" fill="none" />
                  </svg>
                </span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </dialog>
    <dialog id="colorpicker-popup-box">
      <IroJs />
    </dialog>
    <dialog id="settings-popup-box">
      <div class="popup">
        <div class="content">
          <div class="close">
            <i class="fa-solid fa-xmark"></i>
          </div>
          <div class="error-notification d-none"></div>
          <div id="legal" class="row">
            <a href="https://leoseguin.fr/mentionslegales/"></a>
          </div>
          <div class="row">
            <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" id="link-markdown"
              rel="noopener noreferrer"></a>
          </div>
          <div class="row">
            <a href="https://github.com/seguinleo/Bloc-notes/wiki/Shortcuts" rel="noopener noreferrer">Shortcuts</a>
          </div>
          <div class="row">
            <a href="https://github.com/seguinleo/Bloc-notes/discussions" id="link-help" rel="noopener noreferrer"></a>
          </div>
          <div class="row">
            <select id="language" aria-label="Language" @change="toggleLang($event.target.value)">
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="es">ES</option>
            </select>
          </div>
          <div class="row d-flex align-items-center">
            <span id="spellcheck-slider-info"></span>
            <label id="spellcheck-slider" class="switch">
              <input v-model="spellcheck" type="checkbox" id="check-spellcheck" class="checkbox" checked
                @change="toggleSpellcheck()">
              <span class="toggle-thumb">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="off">
                  <rect x="12" y="6" width="1" height="12" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="on">
                  <circle cx="12" cy="12" r="5" stroke-width="1" fill="none" />
                </svg>
              </span>
            </label>
          </div>
          <div class="row d-flex align-items-center">
            <span id="lock-app-slider-info"></span>
            <label class="switch">
              <input type="checkbox" id="toggle-lock-app" class="checkbox" checked @click="toggleLockApp()">
              <span class="toggle-thumb">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="off">
                  <rect x="12" y="6" width="1" height="12" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" class="on">
                  <circle cx="12" cy="12" r="5" stroke-width="1" fill="none" />
                </svg>
              </span>
            </label>
          </div>
          <div class="row">
            <p class="version">
              GPL-3.0 &copy;
              <a href="https://github.com/seguinleo/Bloc-notes/" rel="noopener noreferrer">v25.4.1</a>
            </p>
          </div>
        </div>
      </div>
    </dialog>
    <template v-if="name">
      <dialog id="manage-popup-box">
        <div class="popup">
          <div class="content">
            <div class="close">
              <i class="fa-solid fa-xmark"></i>
            </div>
            <div id="user-name" class="row bold">
              {{ name }}
            </div>
            <div class="row">
              <span id="last-login"></span>
              <span id="last-login-date"></span>
            </div>
            <div class="row">
              <button type="button" id="log-out"></button>
            </div>
            <div class="row">
              <span id="storage-usage"></span>
              <progress id="storage" max="1000000" value="0"></progress>
            </div>
            <details id="gen-psswd">
              <summary></summary>
              <form id="change-psswd">
                <div class="error-notification d-none"></div>
                <div class="row">
                  <input id="old-psswd" type="password" minlength="10" maxlength="64" aria-label="Old password"
                    required>
                </div>
                <div class="row">
                  <input id="new-psswd" type="password" minlength="10" maxlength="64" aria-label="New password"
                    required>
                </div>
                <div class="row">
                  <input id="new-psswd-valid" type="password" minlength="10" maxlength="64"
                    aria-label="Confirm new password" required>
                </div>
                <div class="row d-flex">
                  <p id="psswd-gen"></p>
                  <button type="button" id="copy-password-btn" aria-label="Copy password" @click="copyPassword()">
                    <i class="fa-solid fa-clipboard"></i>
                  </button>
                  <button type="button" id="submit-gen-psswd" aria-label="Generate password" @click="getPassword(20)">
                    <i class="fa-solid fa-arrow-rotate-right"></i>
                  </button>
                </div>
                <button type="submit"></button>
              </form>
            </details>
            <details id="delete-user">
              <summary></summary>
              <form id="delete-account">
                <div class="error-notification d-none"></div>
                <div class="row">
                  <input id="delete-psswd" type="password" minlength="10" maxlength="64" aria-label="Password" required>
                </div>
                <button type="submit" class="btn-cancel"></button>
              </form>
            </details>
          </div>
        </div>
      </dialog>
      <dialog id="private-note-popup-box">
        <div class="popup">
          <div class="content">
            <div class="close">
              <i class="fa-solid fa-xmark"></i>
            </div>
            <form id="public-note">
              <div class="error-notification d-none"></div>
              <div class="row">
                <span></span>
              </div>
              <input id="id-note-public" type="hidden">
              <div class="row">
                <button type="submit"></button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="public-note-popup-box">
        <div class="popup">
          <div class="content">
            <div class="close">
              <i class="fa-solid fa-xmark"></i>
            </div>
            <div class="d-flex">
              <p id="copy-note-link"></p>
              <button type="button" id="copy-note-link-btn" aria-label="Copy link">
                <i class="fa-solid fa-clipboard"></i>
              </button>
            </div>
            <form id="private-note">
              <div class="error-notification d-none"></div>
              <div class="row">
                <span></span>
              </div>
              <input id="id-note-private" type="hidden">
              <input id="link-note-private" type="hidden">
              <div class="row">
                <button type="submit" class="btn-cancel"></button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </template>
    <template v-else>
      <dialog id="login-popup-box">
        <div class="popup">
          <div class="content">
            <div class="close">
              <i class="fa-solid fa-xmark"></i>
            </div>
            <form id="connect-form" autocomplete="off">
              <div class="error-notification d-none"></div>
              <div class="row">
                <input id="name-connect" type="text" minlength="3" maxlength="30" spellcheck="false"
                  autocapitalize="off" aria-label="Name" required>
              </div>
              <div class="row">
                <input id="psswd-connect" type="password" minlength="10" maxlength="64" aria-label="Password" required>
              </div>
              <div class="row">
                <button type="submit"></button>
              </div>
              <div class="row align-center">
                <button type="button" id="create-account"></button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="create-box">
        <div class="popup">
          <div class="content">
            <div class="close">
              <i class="fa-solid fa-xmark"></i>
            </div>
            <form id="create-form" autocomplete="off">
              <div class="error-notification d-none"></div>
              <div class="row">
                <input id="name-create" type="text" minlength="3" maxlength="30" spellcheck="false" autocapitalize="off"
                  aria-label="Name" required>
              </div>
              <div class="row">
                <input id="psswd-create" type="password" minlength="10" maxlength="64" aria-label="Password" required>
              </div>
              <div class="row">
                <input id="psswd-create-valid" type="password" minlength="10" maxlength="64"
                  aria-label="Confirm password" required>
              </div>
              <div class="row d-flex">
                <p id="psswd-gen"></p>
                <button type="button" id="copy-password-btn" aria-label="Copy password" @click="copyPassword()">
                  <i class="fa-solid fa-clipboard"></i>
                </button>
                <button type="button" id="submit-gen-psswd" aria-label="Generate password">
                  <i class="fa-solid fa-arrow-rotate-right"></i>
                </button>
              </div>
              <div class="row">
                <i class="fa-solid fa-circle-info" role="none"></i>
                <span id="create-infos"></span>
              </div>
              <button type="submit"></button>
            </form>
          </div>
        </div>
      </dialog>
      <div data-note-id="welcome" class="note bg-default d-none">
        <div class="details">
          <h2 class="title">👋Bienvenue !</h2>
          <div class="details-content details-content-fr d-none">
            <div>
              Bloc-notes est un outil <span class="bold">rapide, privé et sécurisé</span><br>pour prendre des notes en
              <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown" rel="noopener noreferrer">Markdown ou
                HTML</a>.
            </div>
            <div>
              Créez une note avec <i class="fa-solid fa-plus"></i> en bas à droite et ajoutez
              <ul>
                <li>des listes de tâches,</li>
                <li>des rappels,</li>
                <li>des liens,</li>
                <li>des images,</li>
                <li>etc.</li>
              </ul>
              Vous pouvez également créer des dossiers et des catégories.
            </div>
            <div>
              Connectez-vous avec <i class="fa-solid fa-circle-user"></i> pour synchroniser vos notes sur tous vos
              appareils.
            </div>
            <div>
              Toutes vos notes sont <kbd>chiffrées</kbd> dans votre navigateur <span class="bold">et</span> dans le
              cloud.
            </div>
            <div>
              Une fois connecté.e, vous pouvez partager des notes grâce à un lien public.
            </div>
          </div>
          <div class="details-content details-content-en">
            <div>
              Bloc-notes is a <span class="bold">fast, private and secure</span><br>tool for taking notes in
              <a href="https://github.com/seguinleo/Bloc-notes/wiki/Markdown " rel="noopener noreferrer">Markdown or
                HTML</a>.
            </div>
            <div>
              Create a note with <i class="fa-solid fa-plus"></i> at the bottom right and add
              <ul>
                <li>to-do lists,</li>
                <li>reminders,</li>
                <li>links,</li>
                <li>images,</li>
                <li>etc.</li>
              </ul>
              You can also create folders and categories.
            </div>
            <div>
              Log in with <i class="fa-solid fa-circle-user"></i> to sync your notes across all your devices.
            </div>
            <div>
              All your notes are <kbd>encrypted</kbd> in your browser <span class="bold">and</span> in the cloud.
            </div>
            <div>
              Once logged in, you can share notes using a public link.
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<script>
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import IroJs from './components/IroJs.vue'
import markedKatex from 'marked-katex-extension'
import 'katex/dist/katex.min.css'

export default {
  data() {
    return {
      name: '',
      spellcheck: true,
      touchstartX: 0,
      touchendX: 0,
      timeoutNotification: null,
      fingerprintEnabled: true,
      isLocked: true,
      isUpdate: false,
      dataByteSize: 0,
      noteContentLength: 0,
      maxNoteContentLength: 20000,
      maxDataByteSize: 1000000,
      searchValue: '',
      notesJSON: [],
      localDbName: 'notes_db',
      localDbKeyName: 'key',
      localDbKey: null,
      noteLink: '',
      urlParams: '',
      markedConfig: {
        breaks: true,
        renderer: {
          link({ href, text }) {
            return `<a rel="noreferrer noopener" href="${href}">${text}</a>`
          },
          image({ href, title, text }) {
            return `<img src="${encodeURI(href)}" alt="${text}" title="${title}" crossorigin>`
          }
        }
      },
      purifyConfig: {
        SANITIZE_NAMED_PROPS: true,
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ['dialog', 'footer', 'form', 'header', 'main', 'nav', 'style']
      },
      katexConfig: {
        throwOnError: false,
        nonStandard: true
      }
    }
  },
  components: {
    IroJs
  },
  async mounted() {
    this.urlParams = new URLSearchParams(window.location.search)
    if (this.urlParams.get('link')) {
      await this.showSharedNote()
      return
    }
    await this.getLockApp()
    await this.fetchAccount()
    document.querySelector('header').classList.remove('d-none')
    document.querySelector('#sidebar').classList.remove('d-none')
    if ('serviceWorker' in navigator) await navigator.serviceWorker.register('./sw.js')
    this.changeLanguage(localStorage.getItem('lang') || 'en')
    if (!this.name && localStorage.getItem('lang') === 'fr' &&
      document.querySelector('.details-content-fr')) {
      document.querySelector('.details-content-fr').classList.remove('d-none')
      document.querySelector('.details-content-en').classList.add('d-none')
    }
    if (navigator.onLine) document.querySelector('#offline').classList.add('d-none')
    else document.querySelector('#offline').classList.remove('d-none')
    if (this.name) await this.getCloudNotes()
    else await this.getLocalNotes()

    if (localStorage.getItem('spellcheck') === 'false') {
      document.querySelector('#check-spellcheck').checked = false
      document.querySelector('#content').setAttribute('spellcheck', 'false')
    }

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key.toUpperCase() === 'K') {
        e.preventDefault()
        document.querySelector('#search-input').focus()
      } else if (e.altKey && e.shiftKey && e.key.toUpperCase() === 'N') {
        e.preventDefault()
        document.querySelector('#btn-add-note').click()
      } else if (e.altKey && e.shiftKey && e.key.toUpperCase() === 'S') {
        e.preventDefault()
        document.querySelector('#btn-settings').click()
      }
    })

    document.addEventListener('touchstart', (e) => {
      this.touchstartX = e.changedTouches[0].screenX
    }, { passive: true })

    document.addEventListener('touchend', (e) => {
      if (this.isLocked) return
      this.touchendX = e.changedTouches[0].screenX
      if (this.touchendX - this.touchstartX > 75) {
        document.querySelector('#sidebar').classList.add('show')
        this.preventBodyScrolling(true)
      } else if (this.touchstartX - this.touchendX > 75) {
        document.querySelector('#sidebar').classList.remove('show')
        this.preventBodyScrolling(false)
      }
    }, { passive: true })

    document.querySelectorAll('#colors span').forEach((span, index) => {
      span.addEventListener('click', (event) => {
        document.querySelectorAll('#colors span').forEach((e) => e.classList.remove('selected'))
        event.target.classList.add('selected')
      })
      span.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') span.click()
      })
      if (index === 0) span.classList.add('selected')
    })

    document.querySelectorAll('.close i').forEach((e) => {
      e.addEventListener('click', () => {
        e.closest('dialog').close()
      })
    })

    document.querySelectorAll('dialog').forEach((dialog) => {
      if (dialog.id === 'folder-popup-box') return
      if (dialog.id === 'category-popup-box') return
      if (dialog.id === 'reminder-popup-box') return
      dialog.addEventListener('close', () => {
        document.querySelectorAll('form').forEach((form) => form.reset())
        document.querySelectorAll('input[type="hidden"]').forEach((input) => input.value = '')
      })
    })

    document.querySelectorAll('form').forEach((e) => e.addEventListener('submit', (event) => event.preventDefault()))

    document.querySelectorAll('input[name="download-notes"]').forEach((e) => {
      e.addEventListener('change', async (event) => {
        if (this.fingerprintEnabled) {
          const res = await this.verifyFingerprint()
          if (!res) return
        }
        if (this.notesJSON.length === 0) return
        const a = document.createElement('a')
        let filename = ''
        let allNotesContent = []
        const allNotes = document.querySelectorAll('.note')
        if (document.querySelector('#id-note-download').value === '') {
          const notesPromises = Array.from(allNotes).map(async (note) => {
            const noteId = note.getAttribute('data-note-id');
            const noteData = this.notesJSON.find((note) => note.id === noteId);
            const title = this.name
              ? noteData.title
              : await this.decryptLocalNotes(this.localDbKey, noteData.title);
            const content = this.name
              ? noteData.content
              : await this.decryptLocalNotes(this.localDbKey, noteData.content);
            return `# ${title}\n${content}`;
          });

          allNotesContent = await Promise.all(notesPromises);
          filename = event.target.value === 'txt' ? 'all-notes.txt' : 'all-notes.md';
        } else {
          const note = document.querySelector(`.note[data-note-id="${document.querySelector('#id-note-download').value}"]`)
          const noteId = note.getAttribute('data-note-id')
          const title = this.name
            ? this.notesJSON.find((note) => note.id === noteId).title
            : await this.decryptLocalNotes(this.localDbKey, this.notesJSON.find((note) => note.id === noteId).title)
          const content = this.name
            ? this.notesJSON.find((note) => note.id === noteId).content
            : await this.decryptLocalNotes(this.localDbKey, this.notesJSON.find((note) => note.id === noteId).content)
          allNotesContent = [`# ${title}\n${content}`]
          filename = event.target.value === 'txt' ? `${title}.txt` : `${title}.md`
        }
        const blob = new Blob([allNotesContent.join('\n\n')], { type: 'text/plaincharset=utf-8' })
        const url = URL.createObjectURL(blob)
        a.href = url
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        document.querySelector('#download-popup-box').close()
      })
    })

    document.querySelectorAll('.custom-check').forEach((e) => {
      e.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') e.click()
      })
    })

    document.querySelectorAll('#sort-popup-box input[name="sort-notes"]').forEach(async (e) => {
      e.addEventListener('change', async () => {
        if (!['1', '2', '3', '4'].includes(e.value)) return
        if (e.value === '1') localStorage.removeItem('sort_notes')
        else localStorage.setItem('sort_notes', e.value)
        if (this.name) await this.getCloudNotes()
        else await this.getLocalNotes()
      })
    })

    if (this.name) {
      document.querySelector('#add-cloud-note').addEventListener('submit', async () => {
        try {
          if (this.dataByteSize > this.maxDataByteSize) {
            this.showError('You have reached the maximum storage capacity...')
            return
          }
          if (this.isLocked) return
          const noteId = document.querySelector('#id-note').value
          const title = document.querySelector('#note-popup-box #title').value.trim()
          const content = document.querySelector('#note-popup-box #content').value.trim()
          const color = document.querySelector('#colors .selected').classList[0]
          const hidden = document.querySelector('#check-hidden').checked ? 1 : 0
          const folder = document.querySelector('#folders input[name="add-folder"]:checked').value
          const category = document.querySelector('#categories input[name="add-cat"]:checked').value
          const reminder = document.querySelector('#date-reminder-input').value

          if (!title || title.length > 30 || content.length > this.maxNoteContentLength || !color) return
          if (this.isUpdate && !noteId) return
          if (noteId && !/^[a-zA-Z0-9]+$/.test(noteId)) return

          const cleanContent = DOMPurify.sanitize(content, this.purifyConfig)

          const data = new URLSearchParams({
            title,
            content: cleanContent,
            color,
            hidden,
            folder,
            category,
            reminder
          })

          if (this.isUpdate) data.set('noteId', noteId)

          const url = this.isUpdate ? 'api/updateNote.php' : 'api/addNote.php'
          const res = await fetch(url, {
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
          if (!res.ok) {
            this.showError(`An error occurred - ${res.status}`)
            return
          }
          document.querySelector('#note-popup-box').close()
          document.querySelector('#note-popup-box form').reset()
          this.noteContentLength = 0
          await this.getCloudNotes()
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
        }
      })
      document.querySelector('#delete-cloud-note').addEventListener('submit', async () => {
        const noteId = document.querySelector('#id-note-delete').value
        if (!noteId) return
        await this.fetchDelete(noteId)
        document.querySelector('#delete-note-popup-box').close()
      })
      document.querySelector('#copy-note-link-btn').addEventListener('click', () => {
        const link = document.querySelector('#copy-note-link').textContent
        const url = new URL(`./?link=${encodeURIComponent(link)}`, window.location.href)
        navigator.clipboard.writeText(url.href)
      })
      document.querySelector('#change-psswd').addEventListener('submit', async () => {
        if (this.isLocked) return
        const a = document.querySelector('#old-psswd').value
        const e = document.querySelector('#new-psswd').value
        const t = document.querySelector('#new-psswd-valid').value
        if (!a || !e || !t || e.length < 10 || e.length > 64) return
        if (/^[0-9]+$/.test(t)) {
          this.showError('Password too weak (only numbers)...')
          return
        }
        if (/^[a-z]+$/.test(t)) {
          this.showError('Password too weak (only lowercase letters)...')
          return
        }
        if (/^[A-Z]+$/.test(t)) {
          this.showError('Password too weak (only uppercase letters)...')
          return
        }
        if (/^[a-zA-Z]+$/.test(t)) {
          this.showError('Password too weak (only letters)...')
          return
        }
        if (/^[a-zA-Z0-9]+$/.test(t)) {
          this.showError('Password should contain one special character...')
          return
        }
        if (e !== t) {
          this.showError('Passwords do not match...')
          return
        }
        const psswdOld = a
        const psswdNew = e
        try {
          const data = new URLSearchParams({ psswdOld, psswdNew })
          const res = await fetch('api/updatePsswd.php', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
          if (!res.ok) {
            this.showError(`An error occurred - ${res.status}`)
            document.querySelectorAll('form').forEach((form) => form.reset())
            return
          }
          this.showSuccess('Successfully changed password!')
          document.querySelectorAll('form').forEach((form) => form.reset())
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
          document.querySelectorAll('form').forEach((form) => form.reset())
        }
      })
      document.querySelector('#delete-account').addEventListener('submit', async () => {
        if (this.isLocked) return
        const psswd = document.querySelector('#delete-psswd').value
        if (!psswd || psswd.length < 10 || psswd.length > 64) return
        try {
          const data = new URLSearchParams({ psswd })
          const res = await fetch('api/deleteAccount.php', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
          if (!res.ok) {
            this.showError(`An error occurred - ${res.status}`)
            document.querySelectorAll('form').forEach((form) => form.reset())
            return
          }
          window.location.reload()
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
          document.querySelectorAll('form').forEach((form) => form.reset())
        }
      })
      document.querySelector('#private-note').addEventListener('submit', async () => {
        const noteId = document.querySelector('#id-note-private').value
        const link = document.querySelector('#link-note-private').value
        if (!noteId || !link || !/^[a-zA-Z0-9]+$/.test(link)) return
        try {
          const data = new URLSearchParams({ noteId, noteLink: link })
          const res = await fetch('api/privateNote.php', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
          if (!res.ok) {
            this.showError(`An error occurred - ${res.status}`)
            return
          }
          document.querySelector('#public-note-popup-box').close()
          await this.getCloudNotes()
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
        }
      })
      document.querySelector('#public-note').addEventListener('submit', async () => {
        const noteId = document.querySelector('#id-note-public').value
        if (!noteId) return
        try {
          const data = new URLSearchParams({ noteId })
          const res = await fetch('api/publicNote.php', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
          if (!res.ok) {
            this.showError(`An error occurred - ${res.status}`)
            return
          }
          document.querySelector('#private-note-popup-box').close()
          await this.getCloudNotes()
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
        }
      })
      document.querySelector('#log-out').addEventListener('click', () => this.fetchLogout())
    } else {
      document.querySelector('#add-local-note').addEventListener('submit', async () => {
        try {
          if (this.isLocked) return
          const noteId = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
          const title = document.querySelector('#note-popup-box #title').value.trim()
          const content = document.querySelector('#note-popup-box #content').value.trim()
          const color = document.querySelector('#colors .selected').classList[0]
          const date = new Date().toISOString().slice(0, 19).replace('T', ' ')
          const hidden = document.querySelector('#check-hidden').checked ? 1 : 0
          const folder = document.querySelector('#folders input[name="add-folder"]:checked').value
          const category = document.querySelector('#categories input[name="add-cat"]:checked').value
          const reminder = document.querySelector('#date-reminder-input').value

          if (!title || title.length > 30 || content.length > this.maxNoteContentLength || !color) return

          const mdContent = DOMPurify.sanitize(content, this.purifyConfig)

          const dbName = 'notes_db'
          const objectStoreName = 'key'
          const db = await this.openIndexedDB(dbName, objectStoreName)
          let key = await this.getKeyFromDB(db, objectStoreName)

          if (!key) {
            key = await window.crypto.subtle.generateKey(
              { name: 'AES-GCM', length: 256 },
              true,
              ['encrypt', 'decrypt'],
            )
            await this.storeKeyInDB(db, objectStoreName, key)
          }

          const enTitle = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: new Uint8Array(12) },
            key,
            new TextEncoder().encode(JSON.stringify(title)),
          )

          const enContent = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: new Uint8Array(12) },
            key,
            new TextEncoder().encode(JSON.stringify(mdContent)),
          )

          const note = {
            id: noteId,
            title: this.arrayBufferToBase64(enTitle),
            content: this.arrayBufferToBase64(enContent),
            color,
            date,
            hidden,
            folder,
            category,
            reminder,
            pinned: 0,
          }

          if (this.isUpdate) {
            const noteIdToUpdate = document.querySelector('#id-note').value;
            const noteToUpdate = this.notesJSON.find((note) => note.id === noteIdToUpdate);

            if (!noteToUpdate) return
            noteToUpdate.title = note.title;
            noteToUpdate.content = note.content;
            noteToUpdate.color = note.color;
            noteToUpdate.date = note.date;
            noteToUpdate.hidden = note.hidden;
            noteToUpdate.folder = note.folder;
            noteToUpdate.category = note.category;
            noteToUpdate.reminder = note.reminder;
            noteToUpdate.pinned = note.pinned;
          } else this.notesJSON.push(note)

          localStorage.setItem('local_notes', JSON.stringify(this.notesJSON))
          document.querySelector('#note-popup-box').close()
          document.querySelector('#note-popup-box form').reset()
          this.noteContentLength = 0
          await this.getLocalNotes()
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
        }
      })
      document.querySelector('#delete-local-note').addEventListener('submit', async () => {
        const noteId = document.querySelector('#id-note-delete').value
        if (!noteId) return
        this.notesJSON.splice(noteId, 1)
        localStorage.setItem('local_notes', JSON.stringify(this.notesJSON))
        document.querySelector(`.note[data-note-id="${noteId}"]`).remove()
        await this.getLocalNotes()
        document.querySelector('#delete-note-popup-box').close()
      })
      document.querySelector('#create-account').addEventListener('click', () => {
        document.querySelector('#login-popup-box').close()
        document.querySelector('#create-box').showModal()
      })
      document.querySelector('#create-form').addEventListener('submit', async () => {
        if (this.isLocked) return
        const e = document.querySelector('#name-create').value.trim()
        const t = document.querySelector('#psswd-create').value
        const o = document.querySelector('#psswd-create-valid').value
        if (!e || !t || !o || e.length < 3 || e.length > 30 || t.length < 10 || t.length > 64) return
        if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
          this.showError('Name can only contain letters, spaces and accents...')
          return
        }
        if (/^[0-9]+$/.test(t)) {
          this.showError('Password too weak (only numbers)...')
          return
        }
        if (/^[a-z]+$/.test(t)) {
          this.showError('Password too weak (only lowercase letters)...')
          return
        }
        if (/^[A-Z]+$/.test(t)) {
          this.showError('Password too weak (only uppercase letters)...')
          return
        }
        if (/^[a-zA-Z]+$/.test(t)) {
          this.showError('Password too weak (only letters)...')
          return
        }
        if (/^[a-zA-Z0-9]+$/.test(t)) {
          this.showError('Password should contain one special character...')
          return
        }
        if (t !== o) {
          this.showError('Passwords do not match...')
          return
        }
        if (e === t) {
          this.showError('Username and password cannot be the same...')
          return
        }
        const nameCreate = e
        const psswdCreate = t
        try {
          const data = new URLSearchParams({ nameCreate, psswdCreate })
          const res = await fetch('api/createUser.php', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
          if (!res.ok) {
            this.showError('Username already taken...')
            document.querySelectorAll('form').forEach((form) => form.reset())
            return
          }
          document.querySelector('#create-box').close()
          document.querySelectorAll('form').forEach((form) => form.reset())
          let message = ''
          if (localStorage.getItem('lang') === 'fr') message = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
          else if (localStorage.getItem('lang') === 'de') message = 'Konto erfolgreich erstellt! Sie können sich jetzt anmelden.'
          else if (localStorage.getItem('lang') === 'es') message = '¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.'
          else message = 'Account successfully created! You can now log in.'
          this.showSuccess(message)
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
          document.querySelectorAll('form').forEach((form) => form.reset())
        }
      })
      document.querySelector('#connect-form').addEventListener('submit', async () => {
        if (this.isLocked) return
        const e = document.querySelector('#name-connect').value.trim()
        const t = document.querySelector('#psswd-connect').value
        if (!e || !t || e.length > 30 || t.length > 64) return
        const nameConnect = e
        const psswdConnect = t
        try {
          const data = new URLSearchParams({ nameConnect, psswdConnect })
          const res = await fetch('api/connectUser.php', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
          })
          if (!res.ok) {
            document.querySelectorAll('form').forEach((form) => form.reset())
            let time = 10
            const btn = document.querySelector('#connect-form button[type="submit"]')
            const btnText = btn.textContent
            btn.disabled = true
            this.showError('Wrong username or password...')
            const interval = setInterval(() => {
              time -= 1
              btn.textContent = time
            }, 1000)
            setTimeout(() => {
              clearInterval(interval)
              btn.disabled = false
              btn.textContent = btnText
            }, 10000)
            return
          }
          window.location.reload()
        } catch (error) {
          this.showError(`An error occurred - ${error}`)
          document.querySelectorAll('form').forEach((form) => form.reset())
        }
      })
    }

    window.addEventListener('offline', async () => {
      document.querySelector('#offline').classList.remove('d-none')
    })

    window.addEventListener('online', async () => {
      document.querySelector('#offline').classList.add('d-none')
      await this.getCloudNotes()
    })
  },
  methods: {
    arrayBufferToBase64(buffer) {
      const binary = []
      const bytes = new Uint8Array(buffer)
      for (let i = 0; i < bytes.byteLength; i += 1) binary.push(String.fromCharCode(bytes[i]))
      return window.btoa(binary.join(''))
    },
    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64)
      const byteArray = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i += 1) byteArray[i] = binaryString.charCodeAt(i)
      return byteArray.buffer
    },
    openIndexedDB(dbName, objectStoreName) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1)
        request.onupgradeneeded = (event) => {
          const db = event.target.result
          if (!db.objectStoreNames.contains(objectStoreName)) db.createObjectStore(objectStoreName)
        }
        request.onsuccess = (event) => resolve(event.target.result)
        request.onerror = (event) => reject(event.target.error)
      })
    },
    async getKeyFromDB(db, objectStoreName) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, 'readonly')
        const objectStore = transaction.objectStore(objectStoreName)
        const request = objectStore.get('encryptionKey')
        request.onsuccess = (event) => resolve(event.target.result)
        request.onerror = (event) => reject(event.target.error)
      })
    },
    async storeKeyInDB(db, objectStoreName, key) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, 'readwrite')
        const objectStore = transaction.objectStore(objectStoreName)
        objectStore.put(key, 'encryptionKey')
        transaction.oncomplete = () => resolve()
        transaction.onerror = (event) => reject(event.target.error)
      })
    },
    async decryptLocalNotes(key, data) {
      const deData = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(12) },
        key,
        this.base64ToArrayBuffer(data),
      )
      return JSON.parse(new TextDecoder().decode(deData))
    },
    generateRandomBytes(length) {
      const array = new Uint8Array(length)
      window.crypto.getRandomValues(array)
      return array
    },
    getPassword(length) {
      const lowercase = 'abcdefghijklmnopqrstuvwxyz'
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const digits = '0123456789'
      const specialChars = '&~"#\'(-_)=^$€*!?,.:/|\\@%+{}[]<>`'
      const allChars = lowercase + uppercase + digits + specialChars
      let password = ''
      const array = new Uint32Array(length)
      window.crypto.getRandomValues(array)
      for (let i = 0; i < length; i += 1) {
        const randomIndex = parseInt(array[i] % allChars.length, 10)
        password += allChars[randomIndex]
      }
      document.querySelector('#psswd-gen').textContent = password
    },
    copyPassword() {
      const psswd = document.querySelector('#psswd-gen').textContent
      navigator.clipboard.writeText(psswd)
    },
    async getLockApp() {
      try {
        const res = await fetch('api/getLockApp.php', {
          method: 'POST',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        })
        if (!res.ok) {
          this.showError(`An error occurred - ${res.status}`)
          return
        }
        const serverLocked = await res.json()
        if (!serverLocked.lockApp) {
          this.fingerprintEnabled = false
          this.isLocked = false
          document.querySelector('#toggle-lock-app').checked = false
        }
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    async verifyFingerprint() {
      try {
        const challenge = this.generateRandomBytes(32)
        const publicKeyOptions = {
          challenge,
          rp: {
            name: 'Bloc-notes',
          },
          allowCredentials: [],
          userVerification: "preferred",
          timeout: 60000,
        }
        const credential = await navigator.credentials.get({ publicKey: publicKeyOptions })
        if (credential) return 1
        else {
          this.showError('An error occurred - No credential')
          return 0
        }
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
        return 0
      }
    },
    async createFingerprint() {
      try {
        const challenge = this.generateRandomBytes(32)
        const username = document.querySelector('#user-name') ? document.querySelector('#user-name').textContent : 'local'
        const userId = new TextEncoder().encode(username)
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
              {
                type: 'public-key',
                alg: -257,
              }
            ],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'preferred',
            },
            excludeCredentials: [{
              type: 'public-key',
              id: userId
            }],
            timeout: 60000,
            attestation: 'none',
          },
        })
        this.fingerprintEnabled = true
        this.isLocked = false
        return 1
      } catch (error) {
        document.querySelector('#toggle-lock-app').checked = false
        this.showError(`An error occurred - ${error}`)
        return 0
      }
    },
    async toggleLockApp() {
      if (this.isLocked) return
      if (this.fingerprintEnabled) {
        const res = await this.verifyFingerprint()
        if (!res) {
          document.querySelector('#toggle-lock-app').checked = true
          return
        }
      } else {
        const res = await this.createFingerprint()
        if (!res) {
          document.querySelector('#toggle-lock-app').checked = false
          return
        }
      }
      try {
        const data = new URLSearchParams({ lock_app: document.querySelector('#toggle-lock-app').checked })
        const res = await fetch('api/lockApp.php', {
          method: 'POST',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: data,
        })
        if (!res.ok) {
          this.showError(`An error occurred - ${res.status}`)
        }
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    async unlockApp() {
      await this.verifyFingerprint().then(async (res) => {
        if (!res) return
        this.isLocked = false
        if (this.name) await this.getCloudNotes()
        else await this.getLocalNotes()
      })
    },
    showManageAccountPopup() {
      document.querySelector('#manage-popup-box').showModal()
    },
    showLoginPopup() {
      document.querySelector('#login-popup-box').showModal()
    },
    showSettingsPopup() {
      document.querySelector('#settings-popup-box').showModal()
    },
    showSortPopup() {
      document.querySelector('#sort-popup-box').showModal()
    },
    showFilterPopup() {
      document.querySelector('#filter-popup-box').showModal()
    },
    showColorPickerPopup() {
      document.querySelector('#settings-popup-box').close()
      document.querySelector('#colorpicker-popup-box').showModal()
    },
    showAddNotePopup() {
      this.isUpdate = false
      document.querySelector('#note-popup-box').showModal()
      document.querySelectorAll('#colors span').forEach((e) => {
        e.classList.remove('selected')
      })
      document.querySelector('#colors span').classList.add('selected')
      document.querySelector('#check-hidden').disabled = false
      document.querySelector('#folders input[name="add-folder"][value=""').checked = true
      document.querySelector('#categories input[name="add-cat"][value=""').checked = true
    },
    showFolderPopup() {
      document.querySelector('#folder-popup-box').showModal()
    },
    showCatPopup() {
      document.querySelector('#category-popup-box').showModal()
    },
    showReminderPopup() {
      document.querySelector('#reminder-popup-box').showModal()
    },
    async toggleLang(lang) {
      const validLanguages = ['fr', 'de', 'es']
      if (validLanguages.includes(lang)) localStorage.setItem('lang', lang)
      else localStorage.removeItem('lang')
      this.changeLanguage(localStorage.getItem('lang') || 'en')
      if (this.name) await this.getCloudNotes()
      else await this.getLocalNotes()
    },
    openSidebar() {
      if (this.isLocked) return
      this.preventBodyScrolling(true)
      document.querySelector('#sidebar').classList.add('show')
    },
    searchNotes() {
      const searchValue = this.searchValue.trim().toLowerCase()
      document.querySelectorAll('.note').forEach(async (note) => {
        const noteId = note.getAttribute('data-note-id')
        const noteTitle = this.name
          ? this.notesJSON.find((note) => note.id === noteId).title
          : await this.decryptLocalNotes(this.localDbKey, this.notesJSON.find((note) => note.id === noteId).title)
        const noteContent = this.name
          ? this.notesJSON.find((note) => note.id === noteId).content
          : await this.decryptLocalNotes(this.localDbKey, this.notesJSON.find((note) => note.id === noteId).content)
        if (noteTitle.includes(searchValue) || noteContent.includes(searchValue)) note.classList.remove('d-none')
        else note.classList.add('d-none')
      })
    },
    createFolder() {
      const folderName = document.querySelector('#name-folder').value.trim()
      const folders = document.querySelector('#folders .list')
      if (!folderName || folderName.length > 18) return
      if (Array.from(folders.children).some((e) => e.querySelector('span').textContent === folderName)) return
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = 'add-folder'
      input.value = folderName
      input.id = `${folderName}-folder-add-span`
      input.checked = true
      const label = document.createElement('label')
      label.classList.add('custom-check')
      const span = document.createElement('span')
      span.textContent = folderName
      span.tabIndex = 0
      span.role = 'button'
      label.appendChild(input)
      label.appendChild(span)
      folders.appendChild(label)
      document.querySelector('#name-folder').value = ''
      document.querySelector('#folder-popup-box').close()
    },
    createCategory() {
      const categoryName = document.querySelector('#name-category').value.trim()
      const categories = document.querySelector('#categories .list')
      if (!categoryName || categoryName.length > 18) return
      if (Array.from(categories.children).some((e) => e.querySelector('span').textContent === categoryName)) return
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = 'add-cat'
      input.value = categoryName
      input.id = `${categoryName}-cat-add-span`
      input.checked = true
      const label = document.createElement('label')
      label.classList.add('custom-check')
      const span = document.createElement('span')
      span.textContent = categoryName
      span.tabIndex = 0
      span.role = 'button'
      label.appendChild(input)
      label.appendChild(span)
      categories.appendChild(label)
      document.querySelector('#name-category').value = ''
      document.querySelector('#category-popup-box').close()
    },
    downloadAllNotes() {
      document.querySelectorAll('#download-popup-box input[name="download-notes"]').forEach((e) => {
        e.checked = false
      })
      document.querySelector('#download-popup-box').showModal()
    },
    toggleSpellcheck() {
      if (this.spellcheck) {
        localStorage.removeItem('spellcheck')
        document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'true')
      } else {
        localStorage.setItem('spellcheck', 'false')
        document.querySelector('#note-popup-box #content').setAttribute('spellcheck', 'false')
      }
    },
    clearNoteContent() {
      document.querySelector('#note-popup-box #content').value = ''
      this.noteContentLength = 0
    },
    preventBodyScrolling(bool) {
      if (bool) {
        document.body.style.overflowY = 'hidden'
        document.body.style.position = 'fixed'
      } else {
        document.body.style.overflowY = 'auto'
        document.body.style.position = 'relative'
      }
    },
    updateNoteContentLength() {
      const content = document.querySelector('#note-popup-box #content').value
      this.noteContentLength = content.length
    },
    showSuccess(message) {
      if (this.timeoutNotification) clearTimeout(this.timeoutNotification)
      const notification = document.querySelector('#success-notification')
      notification.textContent = message
      notification.classList.remove('d-none')
      this.timeoutNotification = setTimeout(() => {
        notification.classList.add('d-none')
      }, 5000)
    },
    showError(message) {
      if (this.timeoutNotification) clearTimeout(this.timeoutNotification)
      const notification = document.querySelectorAll('.error-notification')
      notification.forEach((e) => {
        e.textContent = message
        e.classList.remove('d-none')
        this.timeoutNotification = setTimeout(() => {
          e.classList.add('d-none')
        }, 5000)
      })
    },
    downloadNote(noteId) {
      if (!noteId) return
      document.querySelector('#id-note-download').value = noteId
      document.querySelectorAll('#download-popup-box input[name="download-notes"]').forEach((e) => {
        e.checked = false
      })
      document.querySelector('#download-popup-box').showModal()
    },
    copy(content) {
      navigator.clipboard.writeText(content)
    },
    toggleFullscreen(noteId) {
      if (!noteId) return
      document.querySelectorAll('.note').forEach((note) => {
        if (note.getAttribute('data-note-id') !== noteId) note.classList.remove('fullscreen')
      })
      document.querySelector('#sidebar').classList.remove('show')
      const note = document.querySelector(`.note[data-note-id="${noteId}"]`)
      note.querySelector('.details').scrollTop = 0
      note.classList.toggle('fullscreen')
      this.preventBodyScrolling(false)
    },
    shareNote(noteId, link) {
      if (!noteId) return
      if (link) {
        document.querySelector('#public-note-popup-box').showModal()
        document.querySelector('#id-note-private').value = noteId
        document.querySelector('#link-note-private').value = link
        document.querySelector('#copy-note-link').textContent = link
      } else {
        document.querySelector('#private-note-popup-box').showModal()
        document.querySelector('#id-note-public').value = noteId
      }
    },
    noteActions() {
      document.querySelectorAll('.bottom-content i').forEach((e) => {
        e.addEventListener('click', async (event) => {
          const { target } = event
          const noteId = target.closest('.note').getAttribute('data-note-id')
          if (!noteId) return
          const noteTitle = this.name
            ? this.notesJSON.find((note) => note.id === noteId).title
            : await this.decryptLocalNotes(this.localDbKey, this.notesJSON.find((note) => note.id === noteId).title)
          const noteContent = this.name
            ? this.notesJSON.find((note) => note.id === noteId).content
            : await this.decryptLocalNotes(this.localDbKey, this.notesJSON.find((note) => note.id === noteId).content)
          const noteColor = this.notesJSON.find((note) => note.id === noteId).color
          const noteHidden = this.notesJSON.find((note) => note.id === noteId).hidden
          const noteFolder = this.notesJSON.find((note) => note.id === noteId).folder || ''
          const noteCategory = this.notesJSON.find((note) => note.id === noteId).category || ''
          const noteLink = this.notesJSON.find((note) => note.id === noteId).link
          const noteReminder = this.notesJSON.find((note) => note.id === noteId).reminder
          if (target.classList.contains('edit-note')) this.name ? this.updateCloudNote(
            noteId,
            noteTitle,
            noteContent,
            noteColor,
            noteHidden,
            noteFolder,
            noteCategory,
            noteLink,
            noteReminder
          ) : this.updateLocalNote(
            noteId,
            noteTitle,
            noteContent,
            noteColor,
            noteHidden,
            noteFolder,
            noteCategory,
            noteLink,
            noteReminder
          )
          else if (target.classList.contains('pin-note')) this.name ? this.pinCloudNote(noteId) : this.pinLocalNote(noteId)
          else if (target.classList.contains('copy-note')) this.copy(noteContent)
          else if (target.classList.contains('delete-note')) this.name ? this.deleteCloudNote(noteId) : this.deleteLocalNote(noteId)
          else if (target.classList.contains('download-note')) this.downloadNote(noteId)
          else if (target.classList.contains('share-note')) this.shareNote(noteId, noteLink, noteTitle, noteContent)
        })
        e.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') e.click()
        })
      })
      document.querySelectorAll('.note').forEach((e) => {
        e.addEventListener('click', (event) => {
          if (event.target.parentElement.classList.contains('bottom-content') || event.target.classList.contains('bottom-content')) return
          if (event.target.tabIndex > -1) return
          if (document.getSelection().toString()) return
          this.toggleFullscreen(event.currentTarget.getAttribute('data-note-id'))
        })
      })
      document.querySelectorAll('#filter-popup-box input[name="filter-notes"]').forEach((e) => {
        e.addEventListener('change', () => {
          const selectedCategories = []
          const checkedCategories = document.querySelectorAll('#filter-popup-box input[name="filter-notes"]:checked')
          if (checkedCategories.length === 0) {
            document.querySelectorAll('.note').forEach((note) => note.classList.remove('d-none'))
            return
          }
          checkedCategories.forEach((category) => selectedCategories.push(category.value))
          document.querySelectorAll('.note').forEach((note) => {
            const noteId = note.getAttribute('data-note-id')
            const noteCategory = this.notesJSON.find((note) => note.id === noteId).category || ''
            if (selectedCategories.includes(noteCategory)) note.classList.remove('d-none')
            else note.classList.add('d-none')
          })
        })
      })
      document.querySelectorAll('.p-note-list').forEach((e) => {
        e.addEventListener('click', (event) => {
          this.toggleFullscreen(event.currentTarget.getAttribute('data-note-id'))
        })
        e.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') e.click()
        })
      })
    },
    noteFolderOrCategories(allFolders, allCategories) {
      for (const folder of allFolders) {
        const folders = document.querySelector('#folders .list')
        const input = document.createElement('input')
        input.type = 'radio'
        input.name = 'add-folder'
        input.value = folder
        input.id = `${folder}-folder-add-span`
        const label = document.createElement('label')
        label.classList.add('custom-check')
        const span = document.createElement('span')
        span.textContent = folder
        span.tabIndex = 0
        span.role = 'button'
        label.appendChild(input)
        label.appendChild(span)
        folders.appendChild(label)
      }
      for (const category of allCategories) {
        const categories = document.querySelector('#categories .list')
        const input = document.createElement('input')
        input.type = 'radio'
        input.name = 'add-cat'
        input.value = category
        input.id = `${category}-cat-add-span`
        const label = document.createElement('label')
        label.classList.add('custom-check')
        const span = document.createElement('span')
        span.textContent = category
        span.tabIndex = 0
        span.role = 'button'
        label.appendChild(input)
        label.appendChild(span)
        categories.appendChild(label)

        const sortCategories = document.querySelector('#filter-categories')
        const sortInput = document.createElement('input')
        sortInput.type = 'checkbox'
        sortInput.name = 'filter-notes'
        sortInput.value = category
        sortInput.id = `${category}-filter-span`
        const sortLabel = document.createElement('label')
        sortLabel.classList.add('custom-check')
        const sortSpan = document.createElement('span')
        sortSpan.textContent = category
        sortSpan.tabIndex = 0
        sortSpan.role = 'button'
        sortLabel.appendChild(sortInput)
        sortLabel.appendChild(sortSpan)
        sortCategories.appendChild(sortLabel)
      }
    },
    async getCloudNotes() {
      if (this.isLocked) return
      const sort = localStorage.getItem('sort_notes') || '1'
      document.querySelector(`#sort-popup-box input[name="sort-notes"][value="${encodeURIComponent(sort)}"]`).checked = true
      document.querySelector('#list-notes').textContent = ''
      document.querySelector('#filter-categories').textContent = ''
      document.querySelector('#folders .list').textContent = ''
      document.querySelector('#categories .list').textContent = ''
      document.querySelectorAll('.note').forEach((e) => e.remove())

      marked.use(this.markedConfig)
      marked.use(markedKatex(this.katexConfig))

      try {
        const res = await fetch('api/getNotes.php', {
          method: 'POST',
          mode: 'same-origin',
        })

        if (!res.ok) throw new Error(`An error occurred - ${res.status}`)

        this.dataByteSize = 0
        document.querySelector('#storage-usage').textContent = `0 kB / ${this.maxDataByteSize / 1000000} MB`
        const response = await res.json()
        this.notesJSON = response.notes

        document.querySelector('#last-login-date').textContent = `${response.lastLogin}GMT`

        if (this.notesJSON.length === 0) return

        this.notesJSON.sort((a, b) => {
          if (a.pinned === 1 && b.pinned === 0) return -1
          if (a.pinned === 0 && b.pinned === 1) return 1

          switch (sort) {
            case '1':
              return b.date.localeCompare(a.date)
            case '2':
              return a.date.localeCompare(b.date)
            case '3':
              return a.title.localeCompare(b.title)
            case '4':
              return b.title.localeCompare(a.title)
            default:
              break
          }
        })

        const numberOfNotesElement = document.createElement('h2')
        if (localStorage.getItem('lang') === 'de') numberOfNotesElement.textContent = `Notizen (${this.notesJSON.length})`
        else if (localStorage.getItem('lang') === 'es') numberOfNotesElement.textContent = `Notas (${this.notesJSON.length})`
        else numberOfNotesElement.textContent = `Notes (${this.notesJSON.length})`
        document.querySelector('#list-notes').appendChild(numberOfNotesElement)

        const fragment = document.createDocumentFragment()
        const allFolders = new Set()
        const allCategories = new Set()

        this.notesJSON.forEach((row) => {
          const {
            id, title, content, color, date, hidden, folder, category, pinned, link, reminder
          } = row

          if (!id || !title || !color || !date) return

          this.dataByteSize += new Blob([title, content]).size

          const bottomContentElement = document.createElement('div')
          bottomContentElement.classList.add('bottom-content')

          const paragraph = document.createElement('p')
          paragraph.classList.add('p-note-list')
          paragraph.tabIndex = 0
          paragraph.setAttribute('role', 'button')
          paragraph.setAttribute('data-note-id', id)

          const noteElement = document.createElement('div')
          noteElement.classList.add('note', color)
          noteElement.setAttribute('data-note-id', id)

          const titleElement = document.createElement('h2')
          titleElement.classList.add('title')
          titleElement.textContent = title

          const contentElement = document.createElement('div')
          contentElement.classList.add('details-content')

          const detailsElement = document.createElement('div')
          detailsElement.classList.add('details')
          detailsElement.appendChild(titleElement)
          detailsElement.appendChild(contentElement)

          const dateElement = document.createElement('div')
          dateElement.classList.add('date')
          dateElement.textContent += new Date(date).toLocaleDateString()

          const editIconElement = document.createElement('i')
          editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action', 'edit-note')
          editIconElement.tabIndex = 0
          editIconElement.setAttribute('role', 'button')
          editIconElement.setAttribute('aria-label', 'Edit note')
          bottomContentElement.appendChild(editIconElement)

          const pinElement = document.createElement('i')
          pinElement.classList.add('fa-solid', 'note-action', 'pin-note')
          pinElement.tabIndex = 0
          pinElement.setAttribute('role', 'button')
          pinElement.setAttribute('aria-label', 'Pin note')
          bottomContentElement.appendChild(pinElement)

          if (pinned) {
            noteElement.classList.add('pinned')
            const pinnedElement = document.createElement('span')
            pinnedElement.classList.add('custom-check')
            const iconPin = document.createElement('i')
            iconPin.classList.add('fa-solid', 'fa-thumbtack')
            pinnedElement.appendChild(iconPin)
            paragraph.appendChild(pinnedElement)
            pinElement.classList.add('fa-thumbtack-slash')
          } else pinElement.classList.add('fa-thumbtack')

          if (link) {
            const linkElement = document.createElement('span')
            linkElement.classList.add('custom-check')
            const iconLink = document.createElement('i')
            iconLink.classList.add('fa-solid', 'fa-link')
            linkElement.appendChild(iconLink)
            paragraph.appendChild(linkElement)
          } else {
            const trashIconElement = document.createElement('i')
            trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action', 'delete-note')
            trashIconElement.tabIndex = 0
            trashIconElement.setAttribute('role', 'button')
            trashIconElement.setAttribute('aria-label', 'Delete note')
            bottomContentElement.appendChild(trashIconElement)
          }

          if (reminder) {
            const reminderElement = document.createElement('span')
            reminderElement.classList.add('custom-check')
            const iconReminder = document.createElement('i')
            iconReminder.classList.add('fa-solid', 'fa-bell')
            reminderElement.appendChild(iconReminder)
            paragraph.appendChild(reminderElement)

            const reminderElementTitle = document.createElement('span')
            reminderElementTitle.classList.add('reminder-date')
            const reminderIcon = document.createElement('i')
            reminderIcon.classList.add('fa-solid', 'fa-bell')
            reminderElementTitle.appendChild(reminderIcon)
            const reminderSpan = document.createElement('span')
            reminderSpan.textContent = new Date(reminder).toLocaleDateString(undefined, {
              weekday: 'short',
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
            reminderElementTitle.appendChild(reminderSpan)
            titleElement.appendChild(reminderElementTitle)
          }

          if (hidden) {
            const hiddenElement = document.createElement('span')
            hiddenElement.classList.add('custom-check')
            const eyeIconElement = document.createElement('i')
            eyeIconElement.classList.add('fa-solid', 'fa-eye-slash')
            const iconEye = document.createElement('i')
            iconEye.classList.add('fa-solid', 'fa-eye-slash')
            hiddenElement.appendChild(iconEye)
            paragraph.appendChild(hiddenElement)
            contentElement.appendChild(eyeIconElement)
          } else {
            if (content) {
              const clipboardIconElement = document.createElement('i')
              clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action', 'copy-note')
              clipboardIconElement.tabIndex = 0
              clipboardIconElement.setAttribute('role', 'button')
              clipboardIconElement.setAttribute('aria-label', 'Copy note content')
              bottomContentElement.appendChild(clipboardIconElement)

              const downloadIconElement = document.createElement('i')
              downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action', 'download-note')
              downloadIconElement.tabIndex = 0
              downloadIconElement.setAttribute('role', 'button')
              downloadIconElement.setAttribute('aria-label', 'Download note')
              bottomContentElement.appendChild(downloadIconElement)

              const linkIconElement = document.createElement('i')
              linkIconElement.classList.add('fa-solid', 'fa-link', 'note-action', 'share-note')
              linkIconElement.tabIndex = 0
              linkIconElement.setAttribute('role', 'button')
              linkIconElement.setAttribute('aria-label', 'Share note')
              bottomContentElement.appendChild(linkIconElement)
              const parsedContent = marked.parse(content)
              contentElement.innerHTML = parsedContent
            }
          }

          if (folder) {
            allFolders.add(folder)
            paragraph.setAttribute('data-folder', folder)
          }

          if (category) {
            allCategories.add(category)
            paragraph.setAttribute('data-category', category)
            const categoryElement = document.createElement('span')
            categoryElement.classList.add('custom-check')
            categoryElement.textContent = category
            paragraph.appendChild(categoryElement)
          }

          const titleSpan = document.createElement('span')
          titleSpan.classList.add('title-list')
          titleSpan.textContent = title

          const dateSpan = document.createElement('span')
          dateSpan.classList.add('date-list')
          dateSpan.textContent = new Date(date).toLocaleDateString(undefined, {
            weekday: 'short',
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })

          noteElement.appendChild(detailsElement)
          noteElement.appendChild(dateElement)
          noteElement.appendChild(bottomContentElement)
          fragment.appendChild(noteElement)
          paragraph.appendChild(titleSpan)
          paragraph.appendChild(dateSpan)

          if (!folder) document.querySelector('#list-notes').appendChild(paragraph)
          else {
            const folderDetails = document.querySelector(`details[data-folder="${encodeURIComponent(folder)}"]`)
            if (!folderDetails) {
              const newFolderDetails = document.createElement('details')
              newFolderDetails.setAttribute('open', 'open')
              newFolderDetails.setAttribute('data-folder', encodeURIComponent(folder))
              const summary = document.createElement('summary')
              const folderIcon = document.createElement('i')
              folderIcon.classList.add('fa-solid', 'fa-folder')
              summary.appendChild(folderIcon)
              const folderSpan = document.createElement('span')
              folderSpan.textContent = folder
              summary.appendChild(folderSpan)
              newFolderDetails.appendChild(summary)
              newFolderDetails.appendChild(paragraph)
              document.querySelector('#list-notes').appendChild(newFolderDetails)
            } else folderDetails.appendChild(paragraph)
          }
        })

        this.noteFolderOrCategories(allFolders, allCategories)

        document.querySelector('main').appendChild(fragment)
        document.querySelector('#storage').value = this.dataByteSize
        document.querySelector('#storage-usage').textContent = `${(this.dataByteSize * 0.001).toFixed(2)} kB / ${this.maxDataByteSize / 1000000} MB`
        this.noteActions()
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    async fetchAccount() {
      try {
        const res = await fetch('api/getUser.php', {
          method: 'POST',
          mode: 'same-origin',
        })
        const response = await res.json()
        this.name = response.name
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    async fetchDelete(noteId) {
      if (!noteId) return
      try {
        const data = new URLSearchParams({ noteId })
        const res = await fetch('api/deleteNote.php', {
          method: 'POST',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: data,
        })
        if (!res.ok) {
          this.showError(`An error occurred - ${res.status}`)
          return
        }
        await this.getCloudNotes()
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    async fetchLogout() {
      try {
        const res = await fetch('api/logout.php', {
          method: 'POST',
          mode: 'same-origin',
        })
        if (!res.ok) {
          this.showError(`An error occurred - ${res.status}`)
          return
        }
        window.location.reload()
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    async updateCloudNote(noteId, title, content, color, hidden, folder, category, link, reminder) {
      if (hidden && this.fingerprintEnabled) {
        const res = await this.verifyFingerprint()
        if (!res) return
      }
      this.isUpdate = true
      this.noteContentLength = content.length
      document.querySelector('#note-popup-box').showModal()
      document.querySelector('#id-note').value = noteId
      document.querySelector('#note-popup-box #title').value = title
      document.querySelector('#note-popup-box #content').value = content
      document.querySelector(`#folders input[name="add-folder"][value="${folder}"]`).checked = true
      document.querySelector(`#categories input[name="add-cat"][value="${category}"]`).checked = true
      document.querySelector('#date-reminder-input').value = reminder
      document.querySelectorAll('#colors span').forEach((e) => {
        if (e.classList.contains(color)) e.classList.add('selected')
        else e.classList.remove('selected')
      })
      document.querySelector('#check-hidden').checked = hidden
      if (!link) document.querySelector('#check-hidden').disabled = false
      else document.querySelector('#check-hidden').disabled = true
      document.querySelector('#note-popup-box #content').focus()
    },
    async pinLocalNote(noteId) {
      if (!noteId) return
      const note = document.querySelector(`.note[data-note-id="${noteId}"]`)
      const pinned = note.classList.contains('pinned')
      if (pinned) note.classList.add('pinned')
      else note.classList.remove('pinned')
      this.notesJSON.find((note) => note.id === noteId).pinned = pinned ? 0 : 1
      localStorage.setItem('local_notes', JSON.stringify(this.notesJSON))
      await this.getLocalNotes()
    },
    async pinCloudNote(noteId) {
      if (!noteId) return
      try {
        const data = new URLSearchParams({ noteId })
        const res = await fetch('api/pinNote.php', {
          method: 'POST',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: data,
        })
        if (!res.ok) {
          this.showError(`An error occurred - ${res.status}`)
          return
        }
        await this.getCloudNotes()
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    deleteCloudNote(noteId) {
      document.querySelector('#delete-note-popup-box').showModal()
      document.querySelector('#id-note-delete').value = noteId
    },
    async getLocalNotes() {
      if (this.isLocked) return
      const sort = localStorage.getItem('sort_notes') || '1'
      document.querySelector(`#sort-popup-box input[name="sort-notes"][value="${encodeURIComponent(sort)}"]`).checked = true
      document.querySelector('#list-notes').textContent = ''
      document.querySelector('#filter-categories').textContent = ''
      document.querySelector('#folders .list').textContent = ''
      document.querySelector('#categories .list').textContent = ''

      marked.use(this.markedConfig)
      marked.use(markedKatex(this.katexConfig))

      try {
        this.notesJSON = JSON.parse(localStorage.getItem('local_notes')) || []

        if (this.notesJSON.length === 0) {
          if (!document.querySelector('.note[data-note-id="welcome"]')) return
          document.querySelector('.note[data-note-id="welcome"]').classList.remove('d-none')
          document.querySelector('.note[data-note-id="welcome"]').addEventListener('click', (event) => {
            if (event.target.parentElement.classList.contains('bottom-content') || event.target.classList.contains('bottom-content')) return
            if (event.target.tabIndex > -1) return
            if (document.getSelection().toString()) return
            this.toggleFullscreen(event.currentTarget.getAttribute('data-note-id'))
          })
          return
        }
        document.querySelectorAll('.note').forEach((e) => e.remove())

        const db = await this.openIndexedDB(this.localDbName, this.localDbKeyName)
        this.localDbKey = await this.getKeyFromDB(db, this.localDbKeyName)

        this.notesJSON.sort((a, b) => {
          if (a.pinned === 1 && b.pinned === 0) return -1
          if (a.pinned === 0 && b.pinned === 1) return 1

          switch (sort) {
            case '1':
              return b.date.localeCompare(a.date)
            case '2':
              return a.date.localeCompare(b.date)
            case '3':
              return a.title.localeCompare(b.title)
            case '4':
              return b.title.localeCompare(a.title)
            default:
              break
          }
        })

        const numberOfNotesElement = document.createElement('h2')
        if (localStorage.getItem('lang') === 'de') numberOfNotesElement.textContent = `Notizen (${this.notesJSON.length})`
        else if (localStorage.getItem('lang') === 'es') numberOfNotesElement.textContent = `Notas (${this.notesJSON.length})`
        else numberOfNotesElement.textContent = `Notes (${this.notesJSON.length})`
        document.querySelector('#list-notes').appendChild(numberOfNotesElement)

        const fragment = document.createDocumentFragment()
        const allFolders = new Set()
        const allCategories = new Set()

        const promises = this.notesJSON.map(async (row) => {
          const {
            id, title, content, color, date, hidden, pinned, folder, category, reminder
          } = row
          if (!title || !color || !date) return
          const deTitleString = await this.decryptLocalNotes(this.localDbKey, title)
          const deContentString = await this.decryptLocalNotes(this.localDbKey, content)
          const bottomContentElement = document.createElement('div')
          bottomContentElement.classList.add('bottom-content')

          const paragraph = document.createElement('p')
          paragraph.classList.add('p-note-list')
          paragraph.tabIndex = 0
          paragraph.setAttribute('role', 'button')
          paragraph.setAttribute('data-note-id', id)

          const noteElement = document.createElement('div')
          noteElement.classList.add('note', color)
          noteElement.setAttribute('data-note-id', id)

          const titleElement = document.createElement('h2')
          titleElement.classList.add('title')
          titleElement.textContent = deTitleString

          const contentElement = document.createElement('div')
          contentElement.classList.add('details-content')

          const detailsElement = document.createElement('div')
          detailsElement.classList.add('details')
          detailsElement.appendChild(titleElement)
          detailsElement.appendChild(contentElement)

          const dateElement = document.createElement('div')
          dateElement.classList.add('date')
          dateElement.textContent += new Date(date).toLocaleDateString()

          const editIconElement = document.createElement('i')
          editIconElement.classList.add('fa-solid', 'fa-pen', 'note-action', 'edit-note')
          editIconElement.tabIndex = 0
          editIconElement.setAttribute('role', 'button')
          editIconElement.setAttribute('aria-label', 'Edit note')
          bottomContentElement.appendChild(editIconElement)

          const pinElement = document.createElement('i')
          pinElement.classList.add('fa-solid', 'note-action', 'pin-note')
          pinElement.tabIndex = 0
          pinElement.setAttribute('role', 'button')
          pinElement.setAttribute('aria-label', 'Pin note')
          bottomContentElement.appendChild(pinElement)

          const trashIconElement = document.createElement('i')
          trashIconElement.classList.add('fa-solid', 'fa-trash-can', 'note-action', 'delete-note')
          trashIconElement.tabIndex = 0
          trashIconElement.setAttribute('role', 'button')
          trashIconElement.setAttribute('aria-label', 'Delete note')
          bottomContentElement.appendChild(trashIconElement)

          if (pinned) {
            noteElement.classList.add('pinned')
            const pinnedElement = document.createElement('span')
            pinnedElement.classList.add('custom-check')
            const iconPin = document.createElement('i')
            iconPin.classList.add('fa-solid', 'fa-thumbtack')
            pinnedElement.appendChild(iconPin)
            paragraph.appendChild(pinnedElement)
            pinElement.classList.add('fa-thumbtack-slash')
          } else pinElement.classList.add('fa-thumbtack')

          if (reminder) {
            const reminderElement = document.createElement('span')
            reminderElement.classList.add('custom-check')
            const iconReminder = document.createElement('i')
            iconReminder.classList.add('fa-solid', 'fa-bell')
            reminderElement.appendChild(iconReminder)
            paragraph.appendChild(reminderElement)

            const reminderElementTitle = document.createElement('span')
            reminderElementTitle.classList.add('reminder-date')
            const reminderIcon = document.createElement('i')
            reminderIcon.classList.add('fa-solid', 'fa-bell')
            reminderElementTitle.appendChild(reminderIcon)
            const reminderSpan = document.createElement('span')
            reminderSpan.textContent = new Date(reminder).toLocaleDateString(undefined, {
              weekday: 'short',
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
            reminderElementTitle.appendChild(reminderSpan)
            titleElement.appendChild(reminderElementTitle)
          }

          if (hidden) {
            const hiddenElement = document.createElement('span')
            hiddenElement.classList.add('custom-check')
            const eyeIconElement = document.createElement('i')
            eyeIconElement.classList.add('fa-solid', 'fa-eye-slash')
            const iconEye = document.createElement('i')
            iconEye.classList.add('fa-solid', 'fa-eye-slash')
            hiddenElement.appendChild(iconEye)
            paragraph.appendChild(hiddenElement)
            contentElement.appendChild(eyeIconElement)
          } else {
            if (deContentString) {
              const clipboardIconElement = document.createElement('i')
              clipboardIconElement.classList.add('fa-solid', 'fa-clipboard', 'note-action', 'copy-note')
              clipboardIconElement.tabIndex = 0
              clipboardIconElement.setAttribute('role', 'button')
              clipboardIconElement.setAttribute('aria-label', 'Copy note content')
              bottomContentElement.appendChild(clipboardIconElement)

              const downloadIconElement = document.createElement('i')
              downloadIconElement.classList.add('fa-solid', 'fa-download', 'note-action', 'download-note')
              downloadIconElement.tabIndex = 0
              downloadIconElement.setAttribute('role', 'button')
              downloadIconElement.setAttribute('aria-label', 'Download note')
              bottomContentElement.appendChild(downloadIconElement)

              const parsedContent = marked.parse(deContentString)
              contentElement.innerHTML = parsedContent
            }
          }

          if (folder) {
            allFolders.add(folder)
            paragraph.setAttribute('data-folder', folder)
          }

          if (category) {
            allCategories.add(category)
            paragraph.setAttribute('data-category', category)
            const categoryElement = document.createElement('span')
            categoryElement.classList.add('custom-check')
            categoryElement.textContent = category
            paragraph.appendChild(categoryElement)
          }

          noteElement.appendChild(detailsElement)
          noteElement.appendChild(dateElement)
          noteElement.appendChild(bottomContentElement)

          const titleSpan = document.createElement('span')
          titleSpan.classList.add('title-list')
          titleSpan.textContent = deTitleString

          const dateSpan = document.createElement('span')
          dateSpan.classList.add('date-list')
          dateSpan.textContent = new Date(date).toLocaleDateString(undefined, {
            weekday: 'short',
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })

          fragment.appendChild(noteElement)
          paragraph.appendChild(titleSpan)
          paragraph.appendChild(dateSpan)
          if (!folder) document.querySelector('#list-notes').appendChild(paragraph)
          else {
            const folderDetails = document.querySelector(`details[data-folder="${encodeURIComponent(folder)}"]`)
            if (!folderDetails) {
              const newFolderDetails = document.createElement('details')
              newFolderDetails.setAttribute('open', 'open')
              newFolderDetails.setAttribute('data-folder', encodeURIComponent(folder))
              const summary = document.createElement('summary')
              const folderIcon = document.createElement('i')
              folderIcon.classList.add('fa-solid', 'fa-folder')
              summary.appendChild(folderIcon)
              const folderSpan = document.createElement('span')
              folderSpan.textContent = folder
              summary.appendChild(folderSpan)
              newFolderDetails.appendChild(summary)
              newFolderDetails.appendChild(paragraph)
              document.querySelector('#list-notes').appendChild(newFolderDetails)
            } else {
              folderDetails.appendChild(paragraph)
            }
          }
        })
        await Promise.all(promises)

        this.noteFolderOrCategories(allFolders, allCategories)

        document.querySelector('main').appendChild(fragment)
        this.noteActions()
      } catch (error) {
        this.showError(`An error occurred - ${error}`)
      }
    },
    async updateLocalNote(noteId, title, content, color, hidden, folder, category, reminder) {
      if (hidden && this.fingerprintEnabled) {
        const res = await this.verifyFingerprint()
        if (!res) return
      }
      this.isUpdate = true
      this.noteContentLength = content.length
      document.querySelector('#note-popup-box').showModal()
      document.querySelector('#id-note').value = noteId
      document.querySelector('#note-popup-box #title').value = title
      document.querySelector('#note-popup-box #content').value = content
      document.querySelector(`#folders input[name="add-folder"][value="${folder}"]`).checked = true
      document.querySelector(`#categories input[name="add-cat"][value="${category}"]`).checked = true
      document.querySelector('#date-reminder-input').value = reminder
      document.querySelectorAll('#colors span').forEach((e) => {
        if (e.classList.contains(color)) e.classList.add('selected')
        else e.classList.remove('selected')
      })
      document.querySelector('#check-hidden').checked = hidden
      document.querySelector('#note-popup-box #content').focus()
    },
    async pin(noteId) {
      if (!noteId) return
      const note = document.querySelector(`.note[data-note-id="${noteId}"]`)
      const pinned = note.classList.contains('pinned')
      if (pinned) note.classList.add('pinned')
      else note.classList.remove('pinned')
      this.notesJSON.find((note) => note.id === noteId).pinned = pinned ? 0 : 1
      localStorage.setItem('local_notes', JSON.stringify(this.notesJSON))
      await this.getLocalNotes()
    },
    deleteLocalNote(noteId) {
      document.querySelector('#delete-note-popup-box').showModal()
      document.querySelector('#id-note-delete').value = noteId
    },
    async showSharedNote() {
      const urlParams = new URLSearchParams(window.location.search)
      this.noteLink = urlParams.get('link')
      document.querySelector('main').textContent = ''
      document.querySelector('main').classList.add('shared')
      if (!this.noteLink) {
        const notFoundElement = document.createElement('h1')
        notFoundElement.classList.add('align-center')
        notFoundElement.textContent = 'Note not found or expired.'
        document.querySelector('main').appendChild(notFoundElement)
        return
      }

      const data = new URLSearchParams({ noteLink: this.noteLink })
      const res = await fetch('api/getSharedNote.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })

      if (!res.ok) {
        const notFoundElement = document.createElement('h1')
        notFoundElement.classList.add('align-center')
        notFoundElement.textContent = 'Note not found or expired.'
        document.querySelector('main').appendChild(notFoundElement)
        return
      }

      const note = await res.json()

      marked.use(this.markedConfig)
      marked.use(markedKatex(this.katexConfig))

      const {
        title, content, date,
      } = note

      document.title = title

      const cleanContent = DOMPurify.sanitize(content, this.purifyConfig)

      const contentHtml = marked.parse(cleanContent)
      const noteElement = document.createElement('div')
      noteElement.classList.add('shared-note')
      noteElement.tabIndex = 0

      const detailsElement = document.createElement('div')
      detailsElement.classList.add('details')

      const titleElement = document.createElement('h2')
      titleElement.classList.add('title')
      titleElement.textContent = title

      const contentElement = document.createElement('span')
      contentElement.innerHTML = contentHtml

      detailsElement.appendChild(titleElement)
      detailsElement.appendChild(contentElement)

      const bottomContentElement = document.createElement('div')
      bottomContentElement.classList.add('bottom-content')

      const dateElement = document.createElement('span')
      dateElement.classList.add('date')
      dateElement.textContent = new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      bottomContentElement.appendChild(dateElement)
      noteElement.appendChild(detailsElement)
      noteElement.appendChild(bottomContentElement)
      document.querySelector('main').appendChild(noteElement)
    },
    changeLanguage(language) {
      if (language === 'fr') {
        document.documentElement.setAttribute('lang', 'fr-FR')
        document.querySelector('#language').value = 'fr'
        document.querySelector('#legal a').textContent = 'Mentions légales / confidentialité'
        document.querySelector('#sort-popup-box legend').textContent = 'Trier les notes'
        document.querySelector('#sort-notes1-span').textContent = 'Date de modification'
        document.querySelector('#sort-notes2-span').textContent = 'Date de modification (Z-A)'
        document.querySelector('#sort-notes3-span').textContent = 'Titre'
        document.querySelector('#sort-notes4-span').textContent = 'Titre (Z-A)'
        document.querySelector('#filter-popup-box legend').textContent = 'Filtrer les notes par catégorie'
        document.querySelector('#download-popup-box legend').textContent = 'Type d\'export'
        document.querySelector('#spellcheck-slider-info').textContent = 'Vérif. ortho.'
        document.querySelector('#lock-app-slider-info').textContent = 'Vérouiller app'
        document.querySelector('#hide-infos').textContent = 'Masquer contenu'
        document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titre')
        document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenu (Texte brut, Markdown ou HTML)')
        document.querySelector('#delete-note-popup-box button').textContent = 'Supprimer la note'
        document.querySelector('#delete-note-popup-box span').textContent = 'La suppression est définitive.'
        document.querySelector('#folder-popup-box button').textContent = 'Créer le dossier'
        document.querySelector('#folder-popup-box #name-folder').setAttribute('placeholder', 'Nom du dossier')
        document.querySelector('#category-popup-box button').textContent = 'Créer la catégorie'
        document.querySelector('#category-popup-box #name-category').setAttribute('placeholder', 'Nom de la catégorie')
        document.querySelector('#link-markdown').textContent = 'Guide Markdown'
        document.querySelector('#link-help').textContent = 'Aide et discussions'

        if (this.name) {
          document.querySelector('#log-out').textContent = 'Déconnexion'
          document.querySelector('#last-login').textContent = 'Dernière connexion:'
          document.querySelector('#old-psswd').setAttribute('placeholder', 'Ancien mot de passe')
          document.querySelector('#new-psswd').setAttribute('placeholder', 'Nouveau mot de passe')
          document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirmer le mot de passe')
          document.querySelector('#change-psswd button[type="submit"]').textContent = 'Changer le mot de passe'
          document.querySelector('#gen-psswd summary').textContent = 'Changer le mot de passe'
          document.querySelector('#delete-user summary').textContent = 'Supprimer le compte'
          document.querySelector('#delete-psswd').setAttribute('placeholder', 'Mot de passe')
          document.querySelector('#delete-user button').textContent = 'Supprimer le compte'
          document.querySelector('#private-note span').textContent = 'Voulez-vous rendre votre note privée ? Le lien ne sera plus disponible.'
          document.querySelector('#private-note button').textContent = 'Rendre privée'
          document.querySelector('#public-note span').textContent = 'Voulez-vous rendre votre note publique ? Un lien sera disponible pour la partager.'
          document.querySelector('#public-note button').textContent = 'Rendre publique'
        } else {
          if (document.querySelector('.details-content-fr')) {
            document.querySelector('.details-content-fr').classList.remove('d-none')
            document.querySelector('.details-content-en').classList.add('d-none')
          }
          document.querySelector('#create-account').textContent = 'Pas encore de compte ?'
          document.querySelector('#name-connect').setAttribute('placeholder', 'Nom')
          document.querySelector('#psswd-connect').setAttribute('placeholder', 'Mot de passe')
          document.querySelector('#connect-form').querySelector('button').textContent = 'Se connecter'
          document.querySelector('#name-create').setAttribute('placeholder', 'Nom')
          document.querySelector('#psswd-create').setAttribute('placeholder', 'Mot de passe')
          document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirmer le mot de passe')
          document.querySelector('#create-infos').textContent = 'Votre mot de passe est stocké en toute sécurité et vos notes chiffrées. Il vous sera impossible de récupérer votre mot de passe si vous l\'oubliez.'
          document.querySelector('#create-form button[type="submit"]').textContent = 'Créer mon compte'
        }
      } else if (language === 'de') {
        document.documentElement.setAttribute('lang', 'de')
        document.querySelector('#language').value = 'de'
        document.querySelector('#legal a').textContent = 'Impressum / Datenschutz'
        document.querySelector('#sort-popup-box legend').textContent = 'Notizen sortieren'
        document.querySelector('#sort-notes1-span').textContent = 'Änderungsdatum'
        document.querySelector('#sort-notes2-span').textContent = 'Änderungsdatum (Z-A)'
        document.querySelector('#sort-notes3-span').textContent = 'Titel'
        document.querySelector('#sort-notes4-span').textContent = 'Titel (Z-A)'
        document.querySelector('#filter-popup-box legend').textContent = 'Notizen filtern nach Kategorie'
        document.querySelector('#download-popup-box legend').textContent = 'Exporttyp'
        document.querySelector('#spellcheck-slider-info').textContent = 'Rechtschreibprüfung'
        document.querySelector('#lock-app-slider-info').textContent = 'App sperren'
        document.querySelector('#hide-infos').textContent = 'Inhalt ausblenden'
        document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Titel')
        document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Inhalt (Rohtext, Markdown oder HTML)')
        document.querySelector('#delete-note-popup-box button').textContent = 'Notiz löschen'
        document.querySelector('#delete-note-popup-box span').textContent = 'Die Löschung ist endgültig.'
        document.querySelector('#folder-popup-box button').textContent = 'Erstellen'
        document.querySelector('#folder-popup-box #name-folder').setAttribute('placeholder', 'Ordnername')
        document.querySelector('#category-popup-box button').textContent = 'Erstellen'
        document.querySelector('#category-popup-box #name-category').setAttribute('placeholder', 'Kategoriename')
        document.querySelector('#link-markdown').textContent = 'Markdown-Anleitung'
        document.querySelector('#link-help').textContent = 'Hilfe und Diskussionen'

        if (this.name) {
          document.querySelector('#log-out').textContent = 'Abmelden'
          document.querySelector('#last-login').textContent = 'Letzter Login:'
          document.querySelector('#old-psswd').setAttribute('placeholder', 'Altes Passwort')
          document.querySelector('#new-psswd').setAttribute('placeholder', 'Neues Passwort')
          document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Passwort bestätigen')
          document.querySelector('#change-psswd button[type="submit"]').textContent = 'Passwort ändern'
          document.querySelector('#gen-psswd summary').textContent = 'Passwort ändern'
          document.querySelector('#delete-user summary').textContent = 'Konto löschen'
          document.querySelector('#delete-psswd').setAttribute('placeholder', 'Passwort')
          document.querySelector('#delete-user button').textContent = 'Konto löschen'
          document.querySelector('#private-note span').textContent = 'Möchten Sie Ihre Notiz privat machen? Der Link ist nicht mehr verfügbar.'
          document.querySelector('#private-note button').textContent = 'Privat machen'
          document.querySelector('#public-note span').textContent = 'Möchten Sie Ihre Notiz öffentlich machen? Ein Link wird verfügbar sein, um sie zu teilen.'
          document.querySelector('#public-note button').textContent = 'Öffentlich machen'
        } else {
          if (document.querySelector('.details-content-fr')) {
            document.querySelector('.details-content-fr').classList.add('d-none')
            document.querySelector('.details-content-en').classList.remove('d-none')
          }
          document.querySelector('#create-account').textContent = 'Noch kein Konto?'
          document.querySelector('#name-connect').setAttribute('placeholder', 'Name')
          document.querySelector('#psswd-connect').setAttribute('placeholder', 'Passwort')
          document.querySelector('#connect-form').querySelector('button').textContent = 'Anmelden'
          document.querySelector('#name-create').setAttribute('placeholder', 'Name')
          document.querySelector('#psswd-create').setAttribute('placeholder', 'Passwort')
          document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Passwort bestätigen')
          document.querySelector('#create-infos').textContent = 'Ihr Passwort wird sicher gespeichert und Ihre Notizen verschlüsselt. Sie können Ihr Passwort nicht wiederherstellen, wenn Sie es vergessen.'
          document.querySelector('#create-form button[type="submit"]').textContent = 'Mein Konto erstellen'
        }
      } else if (language === 'es') {
        document.documentElement.setAttribute('lang', 'es')
        document.querySelector('#language').value = 'es'
        document.querySelector('#legal a').textContent = 'Aviso legal / privacidad'
        document.querySelector('#sort-popup-box legend').textContent = 'Ordenar notas'
        document.querySelector('#sort-notes1-span').textContent = 'Fecha de modificación'
        document.querySelector('#sort-notes2-span').textContent = 'Fecha de modificación (Z-A)'
        document.querySelector('#sort-notes3-span').textContent = 'Título'
        document.querySelector('#sort-notes4-span').textContent = 'Título (Z-A)'
        document.querySelector('#filter-popup-box legend').textContent = 'Filtrar notas por categoría'
        document.querySelector('#download-popup-box legend').textContent = 'Tipo de exportación'
        document.querySelector('#spellcheck-slider-info').textContent = 'Corrector ortográfico'
        document.querySelector('#lock-app-slider-info').textContent = 'Bloquear aplicación'
        document.querySelector('#hide-infos').textContent = 'Ocultar contenido'
        document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Título')
        document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Contenido (Texto sin formato, Markdown o HTML)')
        document.querySelector('#delete-note-popup-box button').textContent = 'Eliminar nota'
        document.querySelector('#delete-note-popup-box span').textContent = 'La eliminación es definitiva.'
        document.querySelector('#folder-popup-box button').textContent = 'Crear'
        document.querySelector('#folder-popup-box #name-folder').setAttribute('placeholder', 'Nombre de la carpeta')
        document.querySelector('#category-popup-box button').textContent = 'Crear'
        document.querySelector('#category-popup-box #name-category').setAttribute('placeholder', 'Nombre de la categoría')
        document.querySelector('#link-markdown').textContent = 'Guía de Markdown'
        document.querySelector('#link-help').textContent = 'Ayuda y discusiones'

        if (this.name) {
          document.querySelector('#log-out').textContent = 'Cerrar sesión'
          document.querySelector('#last-login').textContent = 'Último inicio de sesión:'
          document.querySelector('#old-psswd').setAttribute('placeholder', 'Contraseña antigua')
          document.querySelector('#new-psswd').setAttribute('placeholder', 'Nueva contraseña')
          document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirmar contraseña')
          document.querySelector('#change-psswd button[type="submit"]').textContent = 'Cambiar contraseña'
          document.querySelector('#gen-psswd summary').textContent = 'Cambiar contraseña'
          document.querySelector('#delete-user summary').textContent = 'Eliminar cuenta'
          document.querySelector('#delete-psswd').setAttribute('placeholder', 'Contraseña')
          document.querySelector('#delete-user button').textContent = 'Eliminar cuenta'
          document.querySelector('#private-note span').textContent = '¿Desea hacer privada su nota? El enlace ya no estará disponible.'
          document.querySelector('#private-note button').textContent = 'Hacer privada'
          document.querySelector('#public-note span').textContent = '¿Desea hacer pública su nota? Un enlace estará disponible para compartirla.'
          document.querySelector('#public-note button').textContent = 'Hacer pública'
        } else {
          if (document.querySelector('.details-content-fr')) {
            document.querySelector('.details-content-fr').classList.add('d-none')
            document.querySelector('.details-content-en').classList.remove('d-none')
          }
          document.querySelector('#create-account').textContent = '¿Aún no tienes una cuenta?'
          document.querySelector('#name-connect').setAttribute('placeholder', 'Nombre')
          document.querySelector('#psswd-connect').setAttribute('placeholder', 'Contraseña')
          document.querySelector('#connect-form').querySelector('button').textContent = 'Iniciar sesión'
          document.querySelector('#name-create').setAttribute('placeholder', 'Nombre')
          document.querySelector('#psswd-create').setAttribute('placeholder', 'Contraseña')
          document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirmar contraseña')
          document.querySelector('#create-infos').textContent = 'Su contraseña se almacena de forma segura y sus notas están cifradas. No podrá recuperar su contraseña si la olvida.'
          document.querySelector('#create-form button[type="submit"]').textContent = 'Crear mi cuenta'
        }
      } else {
        document.documentElement.setAttribute('lang', 'en')
        document.querySelector('#language').value = 'en'
        document.querySelector('#legal a').textContent = 'Legal notice / privacy'
        document.querySelector('#sort-popup-box legend').textContent = 'Sort notes'
        document.querySelector('#sort-notes1-span').textContent = 'Modification date'
        document.querySelector('#sort-notes2-span').textContent = 'Modification date (Z-A)'
        document.querySelector('#sort-notes3-span').textContent = 'Title'
        document.querySelector('#sort-notes4-span').textContent = 'Title (Z-A)'
        document.querySelector('#filter-popup-box legend').textContent = 'Filter notes by category'
        document.querySelector('#download-popup-box legend').textContent = 'Export type'
        document.querySelector('#spellcheck-slider-info').textContent = 'Spell check'
        document.querySelector('#lock-app-slider-info').textContent = 'Lock app'
        document.querySelector('#hide-infos').textContent = 'Hide content'
        document.querySelector('#note-popup-box #title').setAttribute('placeholder', 'Title')
        document.querySelector('#note-popup-box textarea').setAttribute('placeholder', 'Content (Raw text, Markdown or HTML)')
        document.querySelector('#delete-note-popup-box button').textContent = 'Delete note'
        document.querySelector('#delete-note-popup-box span').textContent = 'Deletion is permanent.'
        document.querySelector('#folder-popup-box button').textContent = 'Create folder'
        document.querySelector('#folder-popup-box #name-folder').setAttribute('placeholder', 'Folder name')
        document.querySelector('#category-popup-box button').textContent = 'Create category'
        document.querySelector('#category-popup-box #name-category').setAttribute('placeholder', 'Category name')
        document.querySelector('#link-markdown').textContent = 'Markdown guide'
        document.querySelector('#link-help').textContent = 'Help and discussions'

        if (this.name) {
          document.querySelector('#log-out').textContent = 'Log out'
          document.querySelector('#last-login').textContent = 'Last login:'
          document.querySelector('#old-psswd').setAttribute('placeholder', 'Old password')
          document.querySelector('#new-psswd').setAttribute('placeholder', 'New password')
          document.querySelector('#new-psswd-valid').setAttribute('placeholder', 'Confirm password')
          document.querySelector('#change-psswd button[type="submit"]').textContent = 'Change password'
          document.querySelector('#gen-psswd summary').textContent = 'Change password'
          document.querySelector('#delete-user summary').textContent = 'Delete account'
          document.querySelector('#delete-psswd').setAttribute('placeholder', 'Password')
          document.querySelector('#delete-user button').textContent = 'Delete account'
          document.querySelector('#private-note span').textContent = 'Do you want to make your note private? The link will no longer be available.'
          document.querySelector('#private-note button').textContent = 'Make private'
          document.querySelector('#public-note span').textContent = 'Do you want to make your note public? A link will be available to share it.'
          document.querySelector('#public-note button').textContent = 'Make public'
        } else {
          if (document.querySelector('.details-content-fr')) {
            document.querySelector('.details-content-fr').classList.add('d-none')
            document.querySelector('.details-content-en').classList.remove('d-none')
          }
          document.querySelector('#create-account').textContent = 'Don\'t have an account yet?'
          document.querySelector('#name-connect').setAttribute('placeholder', 'Name')
          document.querySelector('#psswd-connect').setAttribute('placeholder', 'Password')
          document.querySelector('#connect-form').querySelector('button').textContent = 'Log in'
          document.querySelector('#name-create').setAttribute('placeholder', 'Name')
          document.querySelector('#psswd-create').setAttribute('placeholder', 'Password')
          document.querySelector('#psswd-create-valid').setAttribute('placeholder', 'Confirm password')
          document.querySelector('#create-infos').textContent = 'Your password is stored securely and your notes are encrypted. You will not be able to recover your password if you forget it.'
          document.querySelector('#create-form button[type="submit"]').textContent = 'Create my account'
        }
      }
    }
  }
}
</script>
