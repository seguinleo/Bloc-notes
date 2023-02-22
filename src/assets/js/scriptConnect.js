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
    .then(response => response.text())
    .then(data => {
      notesContainer.insertAdjacentHTML("beforeend", data);
      return;
    });
}
function updateNoteConnect(e, t, o, v) {
  isUpdate = true,
  document.querySelector(".iconConnect").click(),
  document.querySelector("#idNoteInput").value = e,
  couleurTagConnect.value = v,
  titleTagConnect.value = t,
  descTagConnect.value = o.replaceAll("<br />", "\r\n")
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
  const e = encodeURIComponent(document.querySelector("#titleConnect").value.trim()),
  v = encodeURIComponent(document.querySelector("#couleurConnect").value.trim()),
  t = encodeURIComponent(document.querySelector("#descConnect").value.trim()),
  url = isUpdate ? "assets/php/updateNote.php" : "assets/php/formAddNote.php",
  data = isUpdate ? `noteId=${document.querySelector("#idNoteInput").value.trim()}&title=${e}&filterDesc=${t}&couleur=${v}` : `titleConnect=${e}&descriptionConnect=${t}&couleurConnect=${v}`;
  if (!e || !t || !v) {
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
