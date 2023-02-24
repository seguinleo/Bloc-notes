const notesContainer = document.querySelector("main"),
popupBox = document.querySelector(".popup-box"),
connectBox = document.querySelector(".connect-box"),
creerBox = document.querySelector(".creer-box"),
couleurTag = popupBox.querySelector("#couleur"),
titleTag = popupBox.querySelector("#title"),
descTag = popupBox.querySelector("#content"),
notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;
function showNotes() {
  notes && (document.querySelectorAll(".note").forEach(e => e.remove()),
  notes.forEach((e, t) => {
    const v = e.couleur,
    f = e.title.replaceAll(/"/g, "&lsquo;&lsquo;").replaceAll(/</g, "&#x2190;").replaceAll(/>/g, "&#x2192;").replace(/\\/g, "/").replaceAll(/'/g, "&lsquo;"),
    o = e.description.replaceAll("\n", "<br />").replaceAll(/"/g, "&lsquo;&lsquo;").replace(/\\/g, "/").replaceAll(/'/g, "&lsquo;"),
    s = `<div class="note ${v}"><div class="details"><p>${f}</p><span>${o}</span></div><div class="bottom-content"><span>${e.date}</span><div class="settings"><i title="Modifier" class="fa-solid fa-pen-to-square" onclick="updateNote(${t},'${f}','${o}','${v}')"></i><i title="Supprimer" class="fa-solid fa-trash" onclick="deleteNote(${t})"></i></div></div><div><span class="status">Note stockée sur l'appareil</span></div></div>`;
    notesContainer.insertAdjacentHTML("beforeend", s)
  }))
}
function updateNote(e, t, o, v) {
  const s = o.replaceAll("<br />", "\n");
  updateId = e,
  isUpdate = true,
  document.querySelector(".icon").click(),
  couleurTag.value = v,
  titleTag.value = t,
  descTag.value = s
}
function deleteNote(e) {
  if (confirm("Voulez-vous vraiment supprimer cette note ?")) {
    notes.splice(e, 1),
    localStorage.setItem("notes", JSON.stringify(notes)),
    showNotes();
  }
}
document.querySelectorAll(".seconnecter").forEach((element) => {
  element.addEventListener("click", () => {
    connectBox.classList.add("show");
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      connectBox.classList.add("show");
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
    alert("Un ou plusieurs champs sont vides...");
    return;
  }
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    alert("Le nom ne peut contenir que des lettres...");
    return;
  }
  if (e.length < 4) {
    alert("Nom trop court (<4)...");
    return;
  }
  if (t.length < 6) {
    alert("Mot de passe trop faible (<6)...");
    return;
  }
  if (/^[0-9]+$/.test(t)) {
    alert("Le mot de passe ne peut pas contenir que des chiffres...");
    return;
  }
  if (/^[a-zA-Z]+$/.test(t)) {
    alert("Le mot de passe ne peut pas contenir que des lettres...");
    return;
  }
  if (t !== o) {
    alert("Les mots de passe ne correspondent pas...");
    return;
  }
  if (e === t) {
    alert("Le mot de passe doit être différent du nom...");
    return;
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
      alert("Compte créé ! Veuillez vous connecter.");
      creerBox.classList.remove("show");
      document.querySelectorAll("form").forEach(form => form.reset());
      return;
    } else {
      alert("Utilisateur déjà existant...");
      return;
    }
  } catch (error) {
    alert("Une erreur est survenue lors de la création du compte...");
    return;
  }
});
document.querySelector("#submitSeConnecter").addEventListener("click", () => {
  const e = document.querySelector("#nomConnect").value.trim(),
  t = document.querySelector("#mdpConnect").value;
  if (!e || !t) {
    alert("Un ou plusieurs champs sont vides...");
    return;
  }
  if (!/^[a-zA-ZÀ-ÿ -]+$/.test(e)) {
    alert("Le nom ne peut contenir que des lettres...");
    return;
  }
  if (e.length < 4) {
    alert("Nom trop court (<4)...");
    return;
  }
  if (t.length < 6) {
    alert("Mot de passe trop faible (<6)...");
    return;
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
        alert("Mauvais identifiants...");
        document.querySelector("#mdpConnect").value = "";
        document.querySelector("#submitSeConnecter").disabled = true;
        setTimeout(() => {
          document.querySelector("#submitSeConnecter").disabled = false;
        }, 5000);
        return;
      }
    })
    .catch(error => {
      alert("Une erreur est survenue...");
      return;
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
  const v = couleurTag.value,
  e = titleTag.value.replaceAll(/"/g, "&lsquo;&lsquo;").replaceAll(/</g, "&#x2190;").replaceAll(/>/g, "&#x2192;").replace(/\\/g, "/").replaceAll(/'/g, "&lsquo;"),
  t = descTag.value.replaceAll("\n", "<br />").replaceAll(/"/g, "&lsquo;&lsquo;").replace(/\\/g, "/").replaceAll(/'/g, "&lsquo;");
  if (!e) {
    return;
  }
  const c = {
    couleur: v,
    title: e,
    description: t,
    date: new Date().toLocaleDateString()
  };
  if (isUpdate) {
    isUpdate = false;
    notes[updateId] = c;
  } else {
    notes.push(c);
  }
  localStorage.setItem("notes", JSON.stringify(notes));
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
  });
  element.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      isUpdate = false;
      document.querySelectorAll("form").forEach(form => form.reset());
      popupBox.classList.remove("show");
      connectBox.classList.remove("show");
      creerBox.classList.remove("show");
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
  showNotes();
});
