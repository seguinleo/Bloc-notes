const url = window.location.href;
if (url == "https://leoseguin.fr/projets/notes/en.php" && localStorage.getItem("lang") == null) { localStorage.setItem("lang", "en"); }
if (url == "https://leoseguin.fr/projets/notes/" && localStorage.getItem("lang") == null) { localStorage.setItem("lang", "fr"); }
if (url == "https://leoseguin.fr/projets/notes/en.php" && localStorage.getItem("lang") == "fr") { window.open("./", "_self"); }
if (url == "https://leoseguin.fr/projets/notes/" && localStorage.getItem("lang") == "en") { window.open("./en.php", "_self"); }
const notesContainer = document.querySelector("main"),
  popupBoxConnect = document.querySelector(".connect-popup-box"),
  popupBoxGestion = document.querySelector(".gestion-popup-box"),
  couleurTagConnect = popupBoxConnect.querySelector("#couleurConnect"),
  titleTagConnect = popupBoxConnect.querySelector("#titleConnect"),
  descTagConnect = popupBoxConnect.querySelector("textarea");
let isUpdate = false, updateId;
function showNotesConnect() {
  fetch("assets/php/getNotes.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(row => {
        const { id, title, couleur, desc, date, hidden } = row,
          titleFilter = title.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n"),
          descFilter = desc.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n"),
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
        let s;
        if (hidden == 0) {
          s = `<div id="note${id}" class="note ${couleur}"><div class="details"><p class="title">${titleFilter}</p><span>${converter.makeHtml(descFilter).replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}</span></div><div class="bottom-content"><i title="Date (GMT)" class="fa-solid fa-calendar-days"></i><span>${date}</span><i class="fa-solid fa-pen" onclick="updateNoteConnect(${id},'${titleFilter}','${descFilter.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}','${couleur}','${hidden}')"></i><i class="fa-solid fa-clipboard" onclick="copy('${descFilter.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}')"></i><i class="fa-solid fa-trash-can" onclick="deleteNoteConnect(${id})"></i><i class="fa-solid fa-expand" onclick="toggleFullscreen(${id})"></i></div></div>`;
        } else {
          s = `<div id="note${id}" class="note ${couleur}"><div class="details"><p class="title">${titleFilter}</p><span>******</span></div><div class="bottom-content"><i title="Date (GMT)" class="fa-solid fa-calendar-days"></i><span>${date}</span><i class="fa-solid fa-pen" onclick="updateNoteConnect(${id},'${titleFilter}','${descFilter.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}','${couleur}','${hidden}')"></i><i class="fa-solid fa-clipboard" onclick="copy('${descFilter.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}')"></i><i class="fa-solid fa-trash-can" onclick="deleteNoteConnect(${id})"></i><i class="fa-solid fa-expand" onclick="toggleFullscreen(${id})"></i></div></div>`;
        }
        notesContainer.insertAdjacentHTML("beforeend", s);
      });
      return;
    });
}
function toggleFullscreen(id) {
  const note = document.querySelector('#note' + id);
  const body = document.querySelector('.darken');
  note.classList.toggle('fullscreen');
  body.classList.toggle('show');
}
function updateNoteConnect(id, title, descFilter, couleur, hidden) {
  const notes = document.querySelectorAll('.note');
  notes.forEach(note => {
    note.classList.remove('fullscreen');
  });
  document.querySelector('.darken').classList.remove("show");
  isUpdate = true,
    document.querySelector(".iconConnect").click(),
    document.querySelector("#idNoteInput").value = id,
    couleurTagConnect.value = couleur,
    titleTagConnect.value = title,
    descTagConnect.value = descFilter.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
  if (hidden == 0) {
    document.getElementById("checkHidden").checked = false;
  } else {
    document.getElementById("checkHidden").checked = true;
  }
}
function copy(e) {
  const copyText = e.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
  navigator.clipboard.writeText(copyText);
  const notification = document.getElementById("copyNotification");
  notification.classList.add("show");
  setTimeout(function () {
    notification.classList.remove("show");
  }, 2000);
}
function deleteNoteConnect(e) {
  if ("fr" === localStorage.getItem("lang")) {
    if (confirm("Voulez-vous vraiment supprimer cette note ?")) {
      fetch("assets/php/deleteNote.php", {
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
            document.querySelector('.darken').classList.remove("show");
            showNotesConnect();
            return;
          } else {
            alert("Une erreur est survenue...");
            return;
          }
        })
    }
  } else {
    if (confirm("Do you really want to delete this note?")) {
      fetch("assets/php/deleteNote.php", {
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
            showNotesConnect();
            document.querySelector('.darken').classList.remove("show");
            return;
          } else {
            alert("An error occurred...");
            return;
          }
        })
    }
  }
}
function deleteAccount() {
  fetch("assets/php/deleteAccount.php", {
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
        if ("fr" === localStorage.getItem("lang")) {
          alert("Une erreur est survenue lors de la suppression de votre compte...");
          return;
        } else {
          alert("An error occurred while deleting your account...");
          return;
        }
      }
    })
    .catch(() => {
      if ("fr" === localStorage.getItem("lang")) {
        alert("Une erreur est survenue lors de la suppression de votre compte...");
        return;
      } else {
        alert("An error occurred while deleting your account...");
        return;
      }
    });
}
document.querySelectorAll(".iconConnect").forEach((element) => {
  element.addEventListener("click", () => {
    popupBoxConnect.classList.add("show");
    document.querySelector("#titleConnect").focus();
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      popupBoxConnect.classList.add("show");
      document.querySelector("#titleConnect").focus();
    }
  });
});
document.querySelectorAll(".sedeconnecter").forEach((element) => {
  element.addEventListener("click", () => {
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
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
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
    }
  });
});
document.querySelectorAll(".gestionCompte").forEach((element) => {
  element.addEventListener("click", () => {
    popupBoxGestion.classList.add("show");
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      popupBoxGestion.classList.add("show");
    }
  });
});
document.querySelectorAll(".supprimerCompte").forEach((element) => {
  element.addEventListener("click", () => {
    if (localStorage.getItem("lang") === "fr") {
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
      if (localStorage.getItem("lang") === "fr") {
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
document.querySelector("#tri").addEventListener("change", () => {
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
        return;
      } else {
        alert("Une erreur est survenue...");
        return;
      }
    })
});
document.querySelector("#submitNoteConnect").addEventListener("click", () => {
  const titreBrut = document.querySelector("#titleConnect").value,
    contentBrut = document.querySelector("#descConnect").value,
    titre = encodeURIComponent(titreBrut.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    content = encodeURIComponent(contentBrut.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    couleur = encodeURIComponent(document.querySelector("#couleurConnect").value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const checkBox = document.getElementById("checkHidden");
  let hidden;
  if (checkBox.checked) {
    hidden = 1;
  } else {
    hidden = 0;
  }
  const url = isUpdate ? "assets/php/updateNote.php" : "assets/php/formAddNote.php",
    data = isUpdate ? `noteId=${document.querySelector("#idNoteInput").value}&title=${titre}&filterDesc=${content}&couleur=${couleur}&date=${date}&hidden=${hidden}` : `titleConnect=${titre}&descriptionConnect=${content}&couleurConnect=${couleur}&date=${date}&hidden=${hidden}`;
  console.log(date);
  if (!titreBrut || contentBrut.length > 2000) {
    return;
  }
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
        showNotesConnect();
        isUpdate = false;
        popupBoxConnect.classList.remove("show");
        document.querySelectorAll("form").forEach(form => form.reset());
        return;
      } else {
        if ("fr" === localStorage.getItem("lang")) {
          alert("Une erreur est survenue...");
          return;
        } else {
          alert("An error occurred...");
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
document.querySelector("#submitChangeMDP").addEventListener("click", () => {
  const e = document.querySelector("#mdpModifNew").value,
    t = document.querySelector("#mdpModifNewValid").value;
  if (!e || !t) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Un ou plusieurs champs sont vides...");
      return;
    } else {
      alert("One or more fields are empty...");
      return;
    }
  }
  if (e.length < 6) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Mot de passe trop faible (<6)...");
      return;
    } else {
      alert("Password too weak (<6)...");
      return;
    }
  }
  if (/^[0-9]+$/.test(e)) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Mot de passe trop faible (que des chiffres)...");
      return;
    } else {
      alert("Password too weak (only numbers)...");
      return;
    }
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Mot de passe trop faible (que des lettres)...");
      return;
    } else {
      alert("Password too weak (only letters)...");
      return;
    }
  }
  if (e !== t) {
    if ("fr" === localStorage.getItem("lang")) {
      alert("Les mots de passe ne correspondent pas...");
      return;
    } else {
      alert("Passwords do not match...");
      return;
    }
  }
  const mdpNew = encodeURIComponent(e);
  fetch("assets/php/formChangeMDP.php", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "mdpNew=" + mdpNew
  })
    .then(response => {
      if (response.status === 200) {
        if (localStorage.getItem("lang") === "fr") {
          alert("Mot de passe modifié !");
        } else {
          alert("Password changed !");
        }
        popupBoxGestion.classList.remove("show");
        document.querySelectorAll("form").forEach(form => form.reset());
        return;
      } else {
        if ("fr" === localStorage.getItem("lang")) {
          alert("Une erreur est survenue...");
          return;
        } else {
          alert("An error occurred...");
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
    document.querySelector('.darken').classList.remove("show");
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      isUpdate = false;
      document.querySelectorAll("form").forEach(form => form.reset());
      popupBoxConnect.classList.remove("show");
      popupBoxGestion.classList.remove("show");
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
  showNotesConnect();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
});
