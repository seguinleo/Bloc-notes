let isUpdate, updateId;
const url = window.location.href,
  notesContainer = document.querySelector("main"),
  popupBox = document.querySelector(".popup-box"),
  connectBox = document.querySelector(".connect-box"),
  creerBox = document.querySelector(".creer-box"),
  titleTag = popupBox.querySelector("#title"),
  descTag = popupBox.querySelector("#content"),
  couleurs = document.querySelectorAll('.couleurs span'),
  darken = document.querySelector('.darken'),
  notes = JSON.parse(localStorage.getItem("local_notes") || "[]");

const showNotes = async () => {
  notes && (document.querySelectorAll(".note").forEach(e => e.remove()),
    notes.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((e, t) => {
      const v = e.couleur,
        g = e.hidden,
        f = replaceAllStart(e.title),
        o = replaceAllStart(e.description),
        converter = new showdown.Converter({
          tasklists: true,
          smoothLivePreview: true,
          extensions: [taskListEnablerExtension]
        }),
        noteDiv = document.createElement("div"),
        detailsDiv = document.createElement("div"),
        titleP = document.createElement("p"),
        descriptionSpan = document.createElement("span"),
        bottomContentDiv = document.createElement("div"),
        lastModificationIcon = document.createElement("i"),
        dateSpan = document.createElement("span"),
        modifyIcon = document.createElement("i"),
        copyIcon = document.createElement("i"),
        deleteIcon = document.createElement("i"),
        fullscreenIcon = document.createElement("i");
      noteDiv.setAttribute("id", "note" + t);
      noteDiv.classList.add("note", v);
      detailsDiv.classList.add("details");
      titleP.classList.add("title");
      titleP.textContent = f;
      g ? descriptionSpan.innerHTML = "*****" : descriptionSpan.innerHTML = replaceAllEnd(converter.makeHtml(o));
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
      copyIcon.classList.add("fa-solid", "fa-clipboard");
      copyIcon.onclick = () => {
        copy(replaceAllStart(o));
      };
      deleteIcon.classList.add("fa-solid", "fa-trash-can");
      deleteIcon.onclick = () => {
        deleteNote(t);
      };
      fullscreenIcon.classList.add("fa-solid", "fa-expand");
      fullscreenIcon.onclick = () => {
        toggleFullscreen(t);
      };
      bottomContentDiv.appendChild(lastModificationIcon);
      bottomContentDiv.appendChild(dateSpan);
      bottomContentDiv.appendChild(modifyIcon);
      bottomContentDiv.appendChild(copyIcon);
      bottomContentDiv.appendChild(deleteIcon);
      bottomContentDiv.appendChild(fullscreenIcon);
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
  const notes = document.querySelectorAll('.note'),
    s = replaceAllStart(o);
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
  g ? document.getElementById("checkHidden").checked = true : document.getElementById("checkHidden").checked = false;
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

function deleteNote(e) {
  if (url == "https://leoseguin.fr/projets/notes/") {
    if (confirm("Voulez-vous vraiment supprimer cette note ?")) {
      notes.splice(e, 1);
      localStorage.setItem("local_notes", JSON.stringify(notes));
      darken.classList.remove("show");
      document.body.classList.remove('noscroll');
      showNotes();
      return;
    }
  } else {
    if (confirm("Do you really want to delete this note?")) {
      notes.splice(e, 1);
      localStorage.setItem("local_notes", JSON.stringify(notes));
      darken.classList.remove("show");
      document.body.classList.remove('noscroll');
      showNotes();
      return;
    }
  }
}

document.querySelectorAll(".seconnecter").forEach((element) => {
  element.addEventListener("click", () => {
    connectBox.classList.add("show");
    document.body.classList.add('noscroll');
    document.querySelector("#nomConnect").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      connectBox.classList.add("show");
      document.body.classList.add('noscroll');
      document.querySelector("#nomConnect").focus();
    }
  });
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
      connectBox.classList.remove("show");
      creerBox.classList.add("show");
      document.body.classList.add('noscroll');
      document.querySelector("#nomCreer").focus();
    }
  });
});

document.querySelector("#submitCreer").addEventListener("click", async () => {
  const e = document.querySelector("#nomCreer").value.trim(),
    t = document.querySelector("#mdpCreer").value,
    o = document.querySelector("#mdpCreerValid").value;
  if (!e || !t || !o) {
    return;
  }
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Le nom ne peut contenir que des lettres...");
      return;
    } else {
      alert("The name can only contain letters...");
      return;
    }
  }
  if (e.length < 4) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Nom trop court (<4)...");
      return;
    } else {
      alert("Name too short (<4)...");
      return;
    }
  }
  if (t.length < 6) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Mot de passe trop faible (<6)...");
      return;
    } else {
      alert("Password too weak (<6)...");
      return;
    }
  }
  if (/^[0-9]+$/.test(t)) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Le mot de passe ne peut pas contenir que des chiffres...");
      return;
    } else {
      alert("Password too weak (only numbers)...");
      return;
    }
  }
  if (/^[a-zA-Z]+$/.test(t)) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Le mot de passe ne peut pas contenir que des lettres...");
      return;
    } else {
      alert("Password too weak (only letters)...");
      return;
    }
  }
  if (t !== o) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Les mots de passe ne correspondent pas...");
      return;
    } else {
      alert("Passwords do not match...");
      return;
    }
  }
  if (e === t) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Le mot de passe doit être différent du nom...");
      return;
    } else {
      alert("The password must be different from the username...");
      return;
    }
  }
  const nomCreer = encodeURIComponent(e),
    mdpCreer = encodeURIComponent(t);
  try {
    const response = await fetch("./assets/php/formCreer.php", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "nomCreer=" + nomCreer + "&mdpCreer=" + mdpCreer + "&csrf_token_creer=" + document.getElementById("csrf_token_creer").value
    });
    if (response.ok) {
      if (url == "https://leoseguin.fr/projets/notes/") {
        alert("Compte créé ! Veuillez vous connecter.");
      } else {
        alert("Account created! Please log in.");
      }
      creerBox.classList.remove("show");
      document.body.classList.remove('noscroll');
      document.querySelectorAll("form").forEach(form => form.reset());
      return;
    } else {
      if (url == "https://leoseguin.fr/projets/notes/") {
        alert("Utilisateur déjà existant...");
        return;
      } else {
        alert("User already exists...");
        return;
      }
    }
  } catch (error) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Une erreur est survenue lors de la création du compte...");
      return;
    } else {
      alert("An error occurred while creating the account...");
      return;
    }
  }
});

document.querySelector("#submitSeConnecter").addEventListener("click", async () => {
  const e = document.querySelector("#nomConnect").value.trim(),
    t = document.querySelector("#mdpConnect").value;
  if (!e || !t) {
    return;
  }
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Le nom ne peut contenir que des lettres...");
      return;
    } else {
      alert("The name can only contain letters...");
      return;
    }
  }
  const nomConnect = encodeURIComponent(e),
    mdpConnect = encodeURIComponent(t);
  fetch("./assets/php/formConnect.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "nomConnect=" + nomConnect + "&mdpConnect=" + mdpConnect + "&csrf_token_connect=" + document.getElementById("csrf_token_connect").value
  })
    .then(response => {
      if (response.status === 200) {
        location.reload();
      } else {
        if (url == "https://leoseguin.fr/projets/notes/") {
          alert("Mauvais identifiants...");
          document.querySelector("#mdpConnect").value = "";
          const button = document.querySelector("#submitSeConnecter");
          button.disabled = true;
          let time = 10;
          button.textContent = `Se connecter (${time})`;
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
        } else {
          alert("Wrong credentials...");
          document.querySelector("#mdpConnect").value = "";
          const button = document.querySelector("#submitSeConnecter");
          button.disabled = true;
          let time = 10;
          button.textContent = `Sign in (${time})`;
          const interval = setInterval(() => {
            time--;
            button.textContent = `Sign in (${time})`;
          }, 1000);
          setTimeout(() => {
            clearInterval(interval);
            button.disabled = false;
            button.textContent = 'Sign in';
          }, 11000);
          return;
        }
      }
    })
});

document.querySelectorAll(".icon").forEach((element) => {
  element.addEventListener("click", () => {
    popupBox.classList.add("show");
    document.body.classList.add('noscroll');
    document.querySelector("#title").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      popupBox.classList.add("show");
      document.body.classList.add('noscroll');
      document.querySelector("#title").focus();
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
  if (index === 0) {
    couleurSpan.classList.add('selectionne');
  }
});

document.querySelector("#submitNote").addEventListener("click", () => {
  const couleurSpan = document.querySelector('.couleurs span.selectionne'),
    v = couleurSpan.classList[0],
    e = titleTag.value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/").replaceAll(/"/g, "‘‘"),
    t = descTag.value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/").replaceAll(/"/g, "‘‘"),
    g = document.getElementById("checkHidden").checked;
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
      isUpdate = false;
      document.querySelectorAll("form").forEach(form => form.reset());
      popupBox.classList.remove("show");
      connectBox.classList.remove("show");
      creerBox.classList.remove("show");
      document.body.classList.remove('noscroll');
      darken.classList.remove("show");
    }
  });
});

document.querySelector("#search-input").addEventListener("keyup", () => {
  const e = document.querySelector("#search-input").value.trim().toLowerCase();
  document.querySelectorAll(".note").forEach((element) => {
    const t = element.querySelector(".note p").innerText.toLowerCase();
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
    navigator.serviceWorker.register("sw.js");
  }
});
