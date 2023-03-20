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
        const { id, title, couleur, desc, date } = row,
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
          }),
          s = `<div class="note ${couleur}">
              <div class="details">
                <p class="title">${titleFilter}</p>
                <span>${converter.makeHtml(descFilter).replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}</span>
              </div>
              <div class="bottom-content">
                <span>${date}</span>
                <i title="Modifier" class="fa-solid fa-pen" onclick="updateNoteConnect(${id},'${titleFilter}','${descFilter.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}','${couleur}')"></i>
                <i title="Copier" class="fa-solid fa-clipboard" onclick="copy('${descFilter.replaceAll("\n\n", "<br /><br />").replaceAll("\n", "<br />")}')"></i>
                <i title="Supprimer" class="fa-solid fa-trash-can" onclick="deleteNoteConnect(${id})"></i>
                <i title="Note chiffrée" class="fa-solid fa-lock" onclick="alert('Note chiffrée et sauvegardée dans le cloud')"></i>
              </div>
            </div>`;
        notesContainer.insertAdjacentHTML("beforeend", s);
      });
      return;
    });
}
function updateNoteConnect(id, title, descFilter, couleur) {
  isUpdate = true,
    document.querySelector(".iconConnect").click(),
    document.querySelector("#idNoteInput").value = id,
    couleurTagConnect.value = couleur,
    titleTagConnect.value = title,
    descTagConnect.value = descFilter.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
}
function copy(e) {
  const copyText = e.replaceAll("<br /><br />", "\n\n").replaceAll("<br />", "\n");
  navigator.clipboard.writeText(copyText);
  alert("Note copiée dans le presse-papiers !");
}
function deleteNoteConnect(e) {
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
          document.querySelectorAll(".note").forEach(function (note) {
            note.remove();
          });
          showNotesConnect();
          return;
        } else {
          alert("Une erreur est survenue...");
          return;
        }
      })
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
        alert("Une erreur est survenue lors de la suppression de votre compte...");
        return;
      }
    })
    .catch(error => {
      alert("Une erreur est survenue lors de la suppression de votre compte...");
      return;
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
    if (confirm("Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ?")) {
      deleteAccount();
    }
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      if (confirm("Voulez-vous vraiment supprimer votre compte ainsi que toutes vos notes enregistrées dans le cloud ?")) {
        deleteAccount();
      }
    }
  });
});
document.querySelector("#submitNoteConnect").addEventListener("click", () => {
  const e = encodeURIComponent(document.querySelector("#titleConnect").value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    t = encodeURIComponent(document.querySelector("#descConnect").value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    v = encodeURIComponent(document.querySelector("#couleurConnect").value.replaceAll(/'/g, "‘").replaceAll(/\\/g, "/")),
    url = isUpdate ? "assets/php/updateNote.php" : "assets/php/formAddNote.php",
    data = isUpdate ? `noteId=${document.querySelector("#idNoteInput").value}&title=${e}&filterDesc=${t}&couleur=${v}` : `titleConnect=${e}&descriptionConnect=${t}&couleurConnect=${v}`;
  if (!e) {
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
        document.querySelectorAll(".note").forEach(function (note) {
          note.remove();
        });
        showNotesConnect();
        isUpdate = false;
        popupBoxConnect.classList.remove("show");
        document.querySelectorAll("form").forEach(form => form.reset());
        return;
      } else {
        alert("Une erreur est survenue...");
        return;
      }
    })
    .catch(error => {
      alert("Une erreur est survenue...");
      return;
    });
});
document.querySelector("#submitChangeMDP").addEventListener("click", () => {
  const e = document.querySelector("#mdpModifNew").value,
    t = document.querySelector("#mdpModifNewValid").value;
  if (!e || !t) {
    alert("Un ou plusieurs champs sont vides...");
    return;
  }
  if (e.length < 6) {
    alert("Mot de passe trop faible (<6)...");
    return;
  }
  if (/^[0-9]+$/.test(e)) {
    alert("Le mot de passe ne peut pas contenir que des chiffres...");
    return;
  }
  if (/^[a-zA-Z]+$/.test(e)) {
    alert("Le mot de passe ne peut pas contenir que des lettres...");
    return;
  }
  if (e !== t) {
    alert("Les mots de passe ne correspondent pas...");
    return;
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
        alert("Mot de passe modifié !");
        popupBoxGestion.classList.remove("show");
        document.querySelectorAll("form").forEach(form => form.reset());
        return;
      } else {
        alert("Une erreur est survenue...");
        return;
      }
    })
    .catch(error => {
      alert("Une erreur est survenue...");
      return;
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
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      isUpdate = false;
      document.querySelectorAll("form").forEach(form => form.reset());
      popupBoxConnect.classList.remove("show");
      popupBoxGestion.classList.remove("show");
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
document.addEventListener("DOMContentLoaded", () => {
  showNotesConnect();
});
