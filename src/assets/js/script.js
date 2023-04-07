const url = window.location.href;
if (url == "https://leoseguin.fr/projets/notes/en.php" && localStorage.getItem("lang") == null) { localStorage.setItem("lang", "en"); }
if (url == "https://leoseguin.fr/projets/notes/" && localStorage.getItem("lang") == null) { localStorage.setItem("lang", "fr"); }
if (url == "https://leoseguin.fr/projets/notes/en.php" && localStorage.getItem("lang") == "fr") { window.open("./", "_self"); }
if (url == "https://leoseguin.fr/projets/notes/" && localStorage.getItem("lang") == "en") { window.open("./en.php", "_self"); }
const notesContainer = document.querySelector("main"),
  popupBox = document.querySelector(".popup-box"),
  connectBox = document.querySelector(".connect-box"),
  creerBox = document.querySelector(".creer-box"),
  couleurTag = popupBox.querySelector("#couleur"),
  titleTag = popupBox.querySelector("#title"),
  descTag = popupBox.querySelector("#content"),
  notes = JSON.parse(localStorage.getItem("local_notes") || "[]");
let isUpdate = false, updateId;
function showNotes() {
  notes && (document.querySelectorAll(".note").forEach(e => e.remove()),
  notes.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach((e, t) => {
      const v = e.couleur,
        f = e.title.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n"),
        o = e.description.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n"),
        taskListEnablerExtension = () => {
          return [{
            type: 'output',
            regex: /<input type="checkbox"?/g,
            replace: '<input type="checkbox"'
          }];
        },
        converter = new showdown.Converter({
          tasklists: true,
          smoothLivePreview: true,
          extensions: [taskListEnablerExtension]
        });
      const noteDiv = document.createElement("div");
      noteDiv.setAttribute("id", "note" + t);
      noteDiv.classList.add("note", v);
      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("details");
      const titleP = document.createElement("p");
      titleP.classList.add("title");
      titleP.textContent = f;
      const descriptionSpan = document.createElement("span");
      descriptionSpan.innerHTML = converter.makeHtml(o).replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />");
      detailsDiv.appendChild(titleP);
      detailsDiv.appendChild(descriptionSpan);
      noteDiv.appendChild(detailsDiv);
      const bottomContentDiv = document.createElement("div");
      bottomContentDiv.classList.add("bottom-content");
      const lastModificationIcon = document.createElement("i");
      lastModificationIcon.classList.add("fa-solid", "fa-calendar-days");
      lastModificationIcon.setAttribute("title", "Date (GMT)");
      const dateSpan = document.createElement("span");
      dateSpan.textContent = e.date;
      const modifyIcon = document.createElement("i");
      modifyIcon.classList.add("fa-solid", "fa-pen");
      modifyIcon.onclick = () => {
        updateNote(t, f, o.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />"), v);
      };
      const copyIcon = document.createElement("i");
      copyIcon.classList.add("fa-solid", "fa-clipboard");
      copyIcon.onclick = () => {
        copy(o.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />"));
      };
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fa-solid", "fa-trash-can");
      deleteIcon.onclick = () => {
        deleteNote(t);
      };
      const fullscreenIcon = document.createElement("i");
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
}
function toggleFullscreen(id) {
  const note = document.querySelector('#note' + id);
  const body = document.querySelector('.darken');
  note.classList.toggle('fullscreen');
  body.classList.toggle('show');
}
function updateNote(e, t, o, v) {
  const notes = document.querySelectorAll('.note');
  notes.forEach(note => {
    note.classList.remove('fullscreen');
  });
  document.querySelector('.darken').classList.remove("show");
  const s = o.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
  updateId = e,
    isUpdate = true,
    document.querySelector(".icon").click(),
    couleurTag.value = v,
    titleTag.value = t,
    descTag.value = s;
}
function copy(e) {
  const copyText = e.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
  navigator.clipboard.writeText(copyText);
  const notification = document.getElementById("copyNotification");
  notification.classList.add("show");
  setTimeout(function() {
    notification.classList.remove("show");
  }, 2000);
}
function deleteNote(e) {
  if ("fr" === localStorage.getItem("lang")) {
    if (confirm("Voulez-vous vraiment supprimer cette note ?")) {
      notes.splice(e, 1),
        localStorage.setItem("local_notes", JSON.stringify(notes));
        document.querySelector('.darken').classList.remove("show");
        showNotes();
        return;
    }
  } else {
    if (confirm("Do you really want to delete this note?")) {
      notes.splice(e, 1),
        localStorage.setItem("local_notes", JSON.stringify(notes));
        document.querySelector('.darken').classList.remove("show");
        showNotes();
        return;
    }
  }
}
document.querySelectorAll(".seconnecter").forEach((element) => {
  element.addEventListener("click", () => {
    connectBox.classList.add("show");
    document.querySelector("#nomConnect").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      connectBox.classList.add("show");
      document.querySelector("#nomConnect").focus();
    }
  });
});
document.querySelectorAll(".creercompte").forEach((element) => {
  element.addEventListener("click", () => {
    connectBox.classList.remove("show");
    creerBox.classList.add("show");
    document.querySelector("#nomCreer").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      connectBox.classList.remove("show");
      creerBox.classList.add("show");
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
    if ("fr" === localStorage.getItem("lang")) {
      alert("Le nom ne peut contenir que des lettres...");
      return;
    } else {
      alert("The name can only contain letters...");
      return;
    }
  }
  if (e.length < 4) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Nom trop court (<4)...");
      return;
    } else {
      alert("Name too short (<4)...");
      return;
    }
  }
  if (t.length < 6) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Mot de passe trop faible (<6)...");
      return;
    } else {
      alert("Password too weak (<6)...");
      return;
    }
  }
  if (/^[0-9]+$/.test(t)) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Le mot de passe ne peut pas contenir que des chiffres...");
      return;
    } else {
      alert("Password too weak (only numbers)...");
      return;
    }
  }
  if (/^[a-zA-Z]+$/.test(t)) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Le mot de passe ne peut pas contenir que des lettres...");
      return;
    } else {
      alert("Password too weak (only letters)...");
      return;
    }
  }
  if (t !== o) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Les mots de passe ne correspondent pas...");
      return;
    } else {
      alert("Passwords do not match...");
      return;
    }
  }
  if (e === t) {
    if ("fr" === localStorage.getItem("lang")) {
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
    const response = await fetch("assets/php/formCreer.php", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "nomCreer=" + nomCreer + "&mdpCreer=" + mdpCreer
    });
    if (response.ok) {
      if ("fr" === localStorage.getItem("lang")) {
        alert("Compte créé ! Veuillez vous connecter.");
      } else {
        alert("Account created! Please log in.");
      }
      creerBox.classList.remove("show");
      document.querySelectorAll("form").forEach(form => form.reset());
      return;
    } else {
      if ("fr" === localStorage.getItem("lang")) {
        alert("Utilisateur déjà existant...");
        return;
      } else {
        alert("User already exists...");
        return;
      }
    }
  } catch (error) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Une erreur est survenue lors de la création du compte...");
      return;
    } else {
      alert("An error occurred while creating the account...");
      return;
    }
  }
});
document.querySelector("#submitSeConnecter").addEventListener("click", () => {
  const e = document.querySelector("#nomConnect").value.trim(),
    t = document.querySelector("#mdpConnect").value;
  if (!e || !t) {
    return;
  }
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Le nom ne peut contenir que des lettres...");
      return;
    } else {
      alert("The name can only contain letters...");
      return;
    }
  }
  const nomConnect = encodeURIComponent(e),
    mdpConnect = encodeURIComponent(t);
  fetch("assets/php/formConnect.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "nomConnect=" + nomConnect + "&mdpConnect=" + mdpConnect
  })
    .then(response => {
      if (response.status === 200) {
        location.reload();
      } else {
        if ("fr" === localStorage.getItem("lang")) {
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
    .catch(() => {
      if ("fr" === localStorage.getItem("lang")) {
        alert("Une erreur est survenue...");
        return;
      } else {
        alert("An error occurred...");
        return;
      }
    });
});
document.querySelectorAll(".icon").forEach((element) => {
  element.addEventListener("click", () => {
    popupBox.classList.add("show");
    document.querySelector("#title").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      popupBox.classList.add("show");
      document.querySelector("#title").focus();
    }
  });
});
document.querySelector("#submitNote").addEventListener("click", () => {
  const v = couleurTag.value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/").replaceAll(/"/g, "‘‘"),
    e = titleTag.value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/").replaceAll(/"/g, "‘‘"),
    t = descTag.value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/").replaceAll(/"/g, "‘‘");
  if (!e) {
    return;
  }
  const c = {
    couleur: v,
    title: e,
    description: t,
    date: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  if (isUpdate) {
    isUpdate = false;
    notes[updateId] = c;
  } else {
    notes.push(c);
  }
  localStorage.setItem("local_notes", JSON.stringify(notes));
  document.querySelectorAll("form").forEach(form => form.reset());
  showNotes();
  popupBox.classList.remove("show");
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
    document.querySelector('.darken').classList.remove("show");
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      isUpdate = false;
      document.querySelectorAll("form").forEach(form => form.reset());
      popupBox.classList.remove("show");
      connectBox.classList.remove("show");
      creerBox.classList.remove("show");
      document.querySelector('.darken').classList.remove("show");
    }
  });
});
document.querySelector("#search-input").addEventListener("keyup", () => {
  const e = document.querySelector("#search-input").value.trim().toLowerCase();
  document.querySelectorAll(".note").forEach((element) => {
    const t = element.querySelector(".note p").innerText.toLowerCase();
    if (t.includes(e)) {
      element.style.display = "flex";
    } else {
      element.style.display = "none";
    }
  });
});
document.addEventListener("keydown", e => {
  e.ctrlKey && "k" === e.key && (e.preventDefault(),
    document.querySelector('#search-input').focus())
});
document.querySelector(".lang").addEventListener("click", () => {
  if ("en" === localStorage.getItem("lang")) {
    localStorage.setItem("lang", "fr");
    window.open('./', '_self');
    return;
  } else {
    localStorage.setItem("lang", "en");
    window.open('./en.php', '_self');
    return;
  }
});
document.querySelector(".lang").addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    if ("en" === localStorage.getItem("lang")) {
      localStorage.setItem("lang", "fr");
      window.open('./', '_self');
      return;
    } else {
      localStorage.setItem("lang", "en");
      window.open('./en.php', '_self');
      return;
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  showNotes();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
});
