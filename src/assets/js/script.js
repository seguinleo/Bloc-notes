'use strict';

let isUpdate, updateId;
const notesContainer = document.querySelector("main");
const popupBox = document.querySelector(".popup-box");
const connectBox = document.querySelector(".connect-box");
const creerBox = document.querySelector(".creer-box");
const titleTag = popupBox.querySelector("#title");
const descTag = popupBox.querySelector("#content");
const couleurs = document.querySelectorAll('.couleurs span');
const darken = document.querySelector('.darken');
const switchElement = document.querySelector('.switch');
const notes = JSON.parse(localStorage.getItem("local_notes") || "[]");

const showNotes = async () => {
  const converter = new showdown.Converter({
    tasklists: true,
    smoothLivePreview: true,
    extensions: [taskListEnablerExtension]
  });

  notes && (document.querySelectorAll(".note").forEach(e => e.remove()),
    notes.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((e, t) => {
      const v = e.couleur;
      const g = e.hidden;
      const f = e.title;
      const o = replaceAllStart(e.description);
      const noteDiv = document.createElement("div");
      const detailsDiv = document.createElement("div");
      const titleP = document.createElement("p");
      const descriptionSpan = document.createElement("span");
      const bottomContentDiv = document.createElement("div");
      const lastModificationIcon = document.createElement("i");
      const dateSpan = document.createElement("span");
      const modifyIcon = document.createElement("i");
      const copyIcon = document.createElement("i");
      const deleteIcon = document.createElement("i");
      const fullscreenIcon = document.createElement("i");

      noteDiv.setAttribute("id", "note" + t);
      noteDiv.classList.add("note", v);
      noteDiv.setAttribute("tabindex", "0");
      detailsDiv.classList.add("details");
      titleP.classList.add("title");
      titleP.textContent = f;
      g ? descriptionSpan.textContent = "*****" : descriptionSpan.innerHTML = replaceAllEnd(converter.makeHtml(o));
      detailsDiv.appendChild(titleP);
      detailsDiv.appendChild(descriptionSpan);
      noteDiv.appendChild(detailsDiv);
      bottomContentDiv.classList.add("bottom-content");
      lastModificationIcon.classList.add("fa-solid", "fa-calendar-days");
      lastModificationIcon.setAttribute("title", "Date (GMT)");
      dateSpan.textContent = e.date;
      modifyIcon.classList.add("fa-solid", "fa-pen");
      modifyIcon.onclick = () => {
        updateNote(t, f, o, v, g);
      };
      modifyIcon.setAttribute("tabindex", "0");
      deleteIcon.classList.add("fa-solid", "fa-trash-can");
      deleteIcon.onclick = () => {
        deleteNote(t, f);
      };
      deleteIcon.setAttribute("tabindex", "0");
      bottomContentDiv.appendChild(lastModificationIcon);
      bottomContentDiv.appendChild(dateSpan);
      bottomContentDiv.appendChild(modifyIcon);

      if (!g) {
        copyIcon.classList.add("fa-solid", "fa-clipboard");
        copyIcon.onclick = () => {
          copy(replaceAllStart(o));
        };
        copyIcon.setAttribute("tabindex", "0");
        fullscreenIcon.classList.add("fa-solid", "fa-expand");
        fullscreenIcon.onclick = () => {
          toggleFullscreen(t);
        };
        fullscreenIcon.setAttribute("tabindex", "0");
        bottomContentDiv.appendChild(copyIcon);
        bottomContentDiv.appendChild(deleteIcon);
        bottomContentDiv.appendChild(fullscreenIcon);
      } else {
        bottomContentDiv.appendChild(deleteIcon);
      }

      noteDiv.appendChild(bottomContentDiv);
      notesContainer.appendChild(noteDiv);
    }));
};

function toggleFullscreen(id) {
  const note = document.querySelector('#note' + id);
  note.classList.toggle('fullscreen');
  darken.classList.toggle('show');
  document.body.classList.toggle('noscroll');
}

function updateNote(e, t, o, v, g) {
  const notes = document.querySelectorAll('.note');
  const s = replaceAllStart(o);
  notes.forEach(note => {
    note.classList.remove('fullscreen');
  });
  darken.classList.remove("show");
  document.body.classList.add('noscroll');
  updateId = e;
  isUpdate = true;
  document.querySelector(".icon").click();
  titleTag.value = t;
  descTag.value = s;
  couleurs.forEach((couleurSpan) => {
    couleurSpan.classList.contains(v) ? couleurSpan.classList.add('selectionne') : couleurSpan.classList.remove('selectionne');
  });
  if (g) {
    document.getElementById("checkHidden").checked = true;
  }
  descTag.focus();
}

function taskListEnablerExtension() {
  return [{
    type: 'output',
    regex: /<input type="checkbox"?/g,
    replace: '<input type="checkbox"'
  }];
}

function replaceAllStart(e) {
  return e.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
}

function replaceAllEnd(e) {
  return e.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />");
}

function copy(e) {
  const copyText = replaceAllStart(e),
    notification = document.getElementById("copyNotification");
  navigator.clipboard.writeText(copyText);
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function deleteNote(e, f) {
  if (!window.location.pathname.endsWith('en.php')) {
    if (confirm(`Voulez-vous vraiment supprimer la note ${f} ?`)) {
      notes.splice(e, 1);
      localStorage.setItem("local_notes", JSON.stringify(notes));
      darken.classList.remove("show");
      document.body.classList.remove('noscroll');
      showNotes();
    }
    return;
  }
  if (confirm(`Do you really want to delete the note ${f}?`)) {
    notes.splice(e, 1);
    localStorage.setItem("local_notes", JSON.stringify(notes));
    darken.classList.remove("show");
    document.body.classList.remove('noscroll');
    showNotes();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (document.activeElement.classList.contains("fa-clipboard")) {
      document.activeElement.click();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (document.activeElement.classList.contains("fa-trash-can")) {
      document.activeElement.click();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (document.activeElement.classList.contains("fa-pen")) {
      document.activeElement.click();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (document.activeElement.classList.contains("fa-expand")) {
      document.activeElement.click();
    }
  }
});

document.querySelectorAll(".seconnecter").forEach((element) => {
  element.addEventListener("click", () => {
    connectBox.classList.add("show");
    document.body.classList.add('noscroll');
    document.querySelector("#nomConnect").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      element.click();
    }
  });
});

switchElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const checkbox = switchElement.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    switchElement.classList.toggle('checked');
  }
});

document.querySelectorAll(".creercompte").forEach((element) => {
  element.addEventListener("click", () => {
    connectBox.classList.remove("show");
    creerBox.classList.add("show");
    document.body.classList.add('noscroll');
    document.querySelector("#nomCreer").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      element.click();
    }
  });
});

document.querySelector("#submitCreer").addEventListener("click", async () => {
  const e = document.querySelector("#nomCreer").value.trim();
  const t = document.querySelector("#mdpCreer").value;
  const o = document.querySelector("#mdpCreerValid").value;
  if (!e || !t || !o) {
    return;
  }
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Le nom ne peut contenir que des lettres...");
      return;
    }
    alert("The name can only contain letters...");
    return;
  }
  if (e.length < 4) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Nom trop court (<4)...");
      return;
    }
    alert("Name too short (<4)...");
    return;
  }
  if (t.length < 6) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Mot de passe trop faible (<6)...");
      return;
    }
    alert("Password too weak (<6)...");
    return;
  }
  if (/^[0-9]+$/.test(t)) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Le mot de passe ne peut pas contenir que des chiffres...");
      return;
    }
    alert("Password too weak (only numbers)...");
    return;
  }
  if (/^[a-zA-Z]+$/.test(t)) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Le mot de passe ne peut pas contenir que des lettres...");
      return;
    }
    alert("Password too weak (only letters)...");
    return;
  }
  if (t !== o) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Les mots de passe ne correspondent pas...");
      return;
    }
    alert("Passwords do not match...");
    return;
  }
  if (e === t) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Le mot de passe doit être différent du nom...");
      return;
    }
    alert("The password must be different from the username...");
    return;
  }
  const nomCreer = encodeURIComponent(e);
  const mdpCreer = encodeURIComponent(t);
  try {
    const response = await fetch("/projets/notes/assets/php/formCreer.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `nomCreer=${nomCreer}&mdpCreer=${mdpCreer}&csrf_token_creer=${document.getElementById("csrf_token_creer").value}`
    });
    if (response.ok) {
      if (!window.location.pathname.endsWith('en.php')) {
        alert("Compte créé ! Veuillez vous connecter.");
      } else {
        alert("Account created! Please log in.");
      }
      creerBox.classList.remove("show");
      document.body.classList.remove('noscroll');
      document.querySelectorAll("form").forEach(form => form.reset());
      return;
    }
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Utilisateur déjà existant...");
      return;
    }
    alert("User already exists...");
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Une erreur est survenue lors de la création du compte...");
      return;
    }
    alert("An error occurred while creating the account...");
  }
});

document.querySelector("#submitSeConnecter").addEventListener("click", async () => {
  const e = document.querySelector("#nomConnect").value.trim();
  const t = document.querySelector("#mdpConnect").value;
  if (!e || !t) {
    return;
  }
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Le nom ne peut contenir que des lettres...");
      return;
    }
    alert("The name can only contain letters...");
    return;
  }
  const nomConnect = encodeURIComponent(e);
  const mdpConnect = encodeURIComponent(t);
  try {
    const response = await fetch("/projets/notes/assets/php/formConnect.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `nomConnect=${nomConnect}&mdpConnect=${mdpConnect}&csrf_token_connect=${document.getElementById("csrf_token_connect").value}`
    });
    if (response.ok) {
      location.reload();
      return;
    }
    document.querySelector("#mdpConnect").value = "";
    let time = 10;
    const button = document.querySelector("#submitSeConnecter");
    button.disabled = true;
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Mauvais identifiants...");
      const interval = setInterval(() => {
        time--;
        button.textContent = `Se connecter (${time})`;
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        button.disabled = false;
        button.textContent = 'Se connecter';
      }, 11000);
      return;
    }
    alert("Wrong credentials...");
    const interval = setInterval(() => {
      time--;
      button.textContent = `Sign in (${time})`;
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      button.disabled = false;
      button.textContent = 'Sign in';
    }, 11000);
  } catch (error) {
    if (!window.location.pathname.endsWith('en.php')) {
      alert("Une erreur est survenue lors de la connexion...");
      return;
    }
    alert("An error occurred while logging in...");
  }
});

document.querySelectorAll(".icon").forEach((element) => {
  element.addEventListener("click", () => {
    popupBox.classList.add("show");
    document.body.classList.add('noscroll');
    document.querySelector("#title").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      element.click();
    }
  });
});

couleurs.forEach((couleurSpan, index) => {
  couleurSpan.addEventListener('click', (event) => {
    couleurs.forEach((couleurSpan) => {
      couleurSpan.classList.remove('selectionne');
    });
    event.target.classList.add('selectionne');
  });
  couleurSpan.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      couleurSpan.click();
    }
  });
  if (index === 0) {
    couleurSpan.classList.add('selectionne');
  }
});

document.querySelector("#submitNote").addEventListener("click", () => {
  const couleurSpan = document.querySelector('.couleurs span.selectionne');
  const v = couleurSpan.classList[0];
  const e = titleTag.value.trim().replaceAll(/'/g, "‘").replaceAll(/\\/g, "/").replaceAll(/"/g, "‘‘");
  const t = descTag.value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/").replaceAll(/"/g, "‘‘");
  const g = document.getElementById("checkHidden").checked;
  if (!e || !t || t.length > 2000) {
    return;
  }
  const c = {
    couleur: v,
    title: e,
    description: t,
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    hidden: g
  };
  if (isUpdate) {
    isUpdate = false;
    notes[updateId] = c;
  } else {
    notes.push(c);
  }
  localStorage.setItem("local_notes", JSON.stringify(notes));
  document.querySelectorAll("form").forEach(form => form.reset());
  popupBox.classList.remove("show");
  document.body.classList.remove('noscroll');
  showNotes();
});

document.querySelectorAll("form").forEach((element) => {
  element.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

document.querySelectorAll("header i").forEach((element) => {
  element.addEventListener("click", () => {
    isUpdate = false;
    document.querySelectorAll("form").forEach(form => form.reset());
    popupBox.classList.remove("show");
    connectBox.classList.remove("show");
    creerBox.classList.remove("show");
    document.body.classList.remove('noscroll');
    darken.classList.remove("show");
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      element.click();
    }
  });
});

document.querySelector("#search-input").addEventListener("keyup", () => {
  const e = document.querySelector("#search-input").value.trim().toLowerCase();
  document.querySelectorAll(".note").forEach((element) => {
    const t = element.querySelector(".note p").textContent.toLowerCase();
    t.includes(e) ? element.style.display = "flex" : element.style.display = "none";
  });
});

document.addEventListener("keydown", e => {
  e.ctrlKey && "k" === e.key && (e.preventDefault(),
    document.querySelector('#search-input').focus())
});

document.addEventListener("DOMContentLoaded", () => {
  showNotes();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/projets/notes/sw.js");
  }
});
