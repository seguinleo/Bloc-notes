let isUpdate, updateId;
const url = window.location.href,
  notesContainer = document.querySelector("main"),
  popupBoxConnect = document.querySelector(".connect-popup-box"),
  popupBoxGestion = document.querySelector(".gestion-popup-box"),
  titleTagConnect = popupBoxConnect.querySelector("#titleConnect"),
  descTagConnect = popupBoxConnect.querySelector("textarea"),
  darken = document.querySelector('.darken'),
  couleurs = document.querySelectorAll('.couleurs span');

function replaceAllStart(e) {
  return e.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
}

function replaceAllEnd(e) {
  return e.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />");
}

const showNotesConnect = async () => {
  const response = await fetch("./assets/php/getNotes.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  const data = await response.json(),
    converter = new showdown.Converter({
      tasklists: true,
      smoothLivePreview: true,
      extensions: [taskListEnablerExtension]
    });
  const notesHtml = data.map((row) => {
    let { id, title, couleur, desc, date, hidden } = row;
    desc == false ? desc = "" : desc = desc;
    const descFilter = replaceAllStart(desc),
      s = hidden === 0 ? `<div id="note${id}" class="note ${couleur}"><div class="details"><p class="title">${title}</p><span>${replaceAllEnd(converter.makeHtml(descFilter))}</span></div><div class="bottom-content"><i title="Date (GMT)" class="fa-solid fa-calendar-days"></i><span>${date}</span><i class="fa-solid fa-pen" onclick="updateNoteConnect(${id},'${title}','${replaceAllEnd(descFilter)}','${couleur}','${hidden}')"></i><i class="fa-solid fa-clipboard" onclick="copy('${replaceAllEnd(descFilter)}')"></i><i class="fa-solid fa-trash-can" onclick="deleteNoteConnect(${id})"></i><i class="fa-solid fa-expand" onclick="toggleFullscreen(${id})"></i></div></div>` : `<div id="note${id}" class="note ${couleur}"><div class="details"><p class="title">${title}</p><span>*****</span></div><div class="bottom-content"><i title="Date (GMT)" class="fa-solid fa-calendar-days"></i><span>${date}</span><i class="fa-solid fa-pen" onclick="updateNoteConnect(${id},'${title}','${replaceAllEnd(descFilter)}','${couleur}','${hidden}')"></i><i class="fa-solid fa-clipboard" onclick="copy('${replaceAllEnd(descFilter)}')"></i><i class="fa-solid fa-trash-can" onclick="deleteNoteConnect(${id})"></i><i class="fa-solid fa-expand" onclick="toggleFullscreen(${id})"></i></div></div>`;
    return s;
  }).join("");
  notesContainer.insertAdjacentHTML("beforeend", notesHtml);
};

const fetchDelete = async (e) => {
  fetch("./assets/php/deleteNote.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "noteId=" + e
  })
    .then(response => {
      if (response.ok) {
        document.querySelectorAll(".note").forEach((note) => {
          note.remove();
        });
        darken.classList.remove("show");
        document.body.classList.remove('noscroll');
        showNotesConnect();
      }
    })
};

const deleteAccount = async () => {
  fetch("./assets/php/deleteAccount.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(response => {
      if (response.status === 200) {
        location.reload();
      } else {
        if (url == "https://leoseguin.fr/projets/notes/") {
          alert("Une erreur est survenue lors de la suppression de votre compte...");
        } else {
          alert("An error occurred while deleting your account...");
        }
      }
    })
};

const fetchLogout = async () => {
  fetch("assets/php/logout.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(response => {
      if (response.status === 200) {
        location.reload();
      }
    })
};

function toggleFullscreen(id) {
  const note = document.querySelector('#note' + id);
  note.classList.toggle('fullscreen');
  darken.classList.toggle('show');
  document.body.classList.toggle('noscroll');
}

function updateNoteConnect(id, title, descFilter, couleur, hidden) {
  const notes = document.querySelectorAll('.note');
  notes.forEach(note => {
    note.classList.remove('fullscreen');
  });
  darken.classList.remove("show");
  document.body.classList.add('noscroll');
  isUpdate = true;
  document.querySelector(".iconConnect").click();
  document.querySelector("#idNoteInput").value = id;
  titleTagConnect.value = title;
  descTagConnect.value = replaceAllStart(descFilter);
  couleurs.forEach((couleurSpan) => {
    couleurSpan.classList.contains(couleur) ? couleurSpan.classList.add('selectionne') : couleurSpan.classList.remove('selectionne');
  });
  hidden == 0 ? document.getElementById("checkHidden").checked = false : document.getElementById("checkHidden").checked = true;
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

function deleteNoteConnect(e) {
  if (url == "https://leoseguin.fr/projets/notes/") {
    if (confirm("Voulez-vous vraiment supprimer cette note ?")) {
      fetchDelete(e);
    }
  } else {
    if (confirm("Do you really want to delete this note?")) {
      fetchDelete(e);
    }
  }
}

function taskListEnablerExtension() {
  return [{
    type: 'output',
    regex: /<input type="checkbox"?/g,
    replace: '<input type="checkbox"'
  }];
}

document.querySelectorAll(".iconConnect").forEach((element) => {
  element.addEventListener("click", () => {
    popupBoxConnect.classList.add("show");
    document.body.classList.add('noscroll');
    titleTagConnect.focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      popupBoxConnect.classList.add("show");
      document.body.classList.add('noscroll');
      titleTagConnect.focus();
    }
  });
});

document.querySelectorAll(".sedeconnecter").forEach((element) => {
  element.addEventListener("click", () => {
    fetchLogout();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      fetchLogout();
    }
  });
});

document.querySelectorAll(".gestionCompte").forEach((element) => {
  element.addEventListener("click", () => {
    popupBoxGestion.classList.add("show");
    document.body.classList.add('noscroll');
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      popupBoxGestion.classList.add("show");
      document.body.classList.add('noscroll');
    }
  });
});

document.querySelectorAll(".supprimerCompte").forEach((element) => {
  element.addEventListener("click", () => {
    if (url == "https://leoseguin.fr/projets/notes/") {
      if (confirm("Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ? Votre nom d'utilisateur redeviendra disponible pour les autres utilisateurs.")) {
        deleteAccount();
      }
    } else {
      if (confirm("Do you really want to delete your account and all your notes saved in the cloud? Your username will become available to other users again.")) {
        deleteAccount();
      }
    }
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      if (url == "https://leoseguin.fr/projets/notes/") {
        if (confirm("Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ? Votre nom d'utilisateur redeviendra disponible pour les autres utilisateurs.")) {
          deleteAccount();
        }
      } else {
        if (confirm("Do you really want to delete your account and all your notes saved in the cloud? Your username will become available to other users again.")) {
          deleteAccount();
        }
      }
    }
  });
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
    popupBoxConnect.classList.remove("show");
    popupBoxGestion.classList.remove("show");
    darken.classList.remove("show");
    document.body.classList.remove('noscroll');
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      isUpdate = false;
      document.querySelectorAll("form").forEach(form => form.reset());
      popupBoxConnect.classList.remove("show");
      popupBoxGestion.classList.remove("show");
      darken.classList.remove("show");
      document.body.classList.remove('noscroll');
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

document.querySelector("#tri").addEventListener("change", async () => {
  fetch("assets/php/sort.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "tri=" + document.querySelector("#tri").value
  })
    .then(response => {
      if (response.ok) {
        document.querySelectorAll(".note").forEach((note) => {
          note.remove();
        });
        showNotesConnect();
      }
    })
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

document.querySelector("#submitNoteConnect").addEventListener("click", async () => {
  const titreBrut = document.querySelector("#titleConnect").value,
    contentBrut = document.querySelector("#descConnect").value;
  if (!titreBrut || !contentBrut || contentBrut.length > 2000) {
    return;
  }
  const titre = encodeURIComponent(titreBrut.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    content = encodeURIComponent(contentBrut.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    couleurSpan = document.querySelector('.couleurs span.selectionne'),
    couleur = couleurSpan.classList[0],
    date = new Date().toISOString().slice(0, 19).replace('T', ' '),
    checkBox = document.getElementById("checkHidden");
  let hidden;
  checkBox.checked ? hidden = 1 : hidden = 0;
  const url = isUpdate ? "./assets/php/updateNote.php" : "./assets/php/formAddNote.php",
    data = isUpdate ? `noteId=${document.querySelector("#idNoteInput").value}&title=${titre}&filterDesc=${content}&couleur=${couleur}&date=${date}&hidden=${hidden}` : `titleConnect=${titre}&descriptionConnect=${content}&couleurConnect=${couleur}&date=${date}&hidden=${hidden}`;
  fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data
  })
    .then(response => {
      if (response.status === 200) {
        document.querySelectorAll(".note").forEach((note) => {
          note.remove();
        });
        isUpdate = false;
        popupBoxConnect.classList.remove("show");
        document.body.classList.remove('noscroll');
        document.querySelectorAll("form").forEach(form => form.reset());
        showNotesConnect();
      }
    })
});

document.querySelector("#submitChangeMDP").addEventListener("click", async () => {
  const e = document.querySelector("#mdpModifNew").value,
    t = document.querySelector("#mdpModifNewValid").value;
  if (!e || !t) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Un ou plusieurs champs sont vides...");
      return;
    } else {
      alert("One or more fields are empty...");
      return;
    }
  }
  if (e.length < 6) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Mot de passe trop faible (<6)...");
      return;
    } else {
      alert("Password too weak (<6)...");
      return;
    }
  }
  if (/^[0-9]+$/.test(e)) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Mot de passe trop faible (que des chiffres)...");
      return;
    } else {
      alert("Password too weak (only numbers)...");
      return;
    }
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Mot de passe trop faible (que des lettres)...");
      return;
    } else {
      alert("Password too weak (only letters)...");
      return;
    }
  }
  if (e !== t) {
    if (url == "https://leoseguin.fr/projets/notes/") {
      alert("Les mots de passe ne correspondent pas...");
      return;
    } else {
      alert("Passwords do not match...");
      return;
    }
  }
  const mdpNew = encodeURIComponent(e);
  fetch("./assets/php/formChangeMDP.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "mdpNew=" + mdpNew
  })
    .then(response => {
      if (response.status === 200) {
        if (url == "https://leoseguin.fr/projets/notes/") {
          alert("Mot de passe modifié !");
        } else {
          alert("Password changed !");
        }
        popupBoxGestion.classList.remove("show");
        document.body.classList.remove('noscroll');
        document.querySelectorAll("form").forEach(form => form.reset());
      }
    })
});

document.addEventListener("DOMContentLoaded", () => {
  showNotesConnect();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
});
