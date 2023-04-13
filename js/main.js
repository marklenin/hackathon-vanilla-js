const API = "http://localhost:8000/movies";
let search = document.querySelector(".search input");
let cardsContainer = document.querySelector(".cardsContainer");
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
let currentPage = 1;
let pageLength = 1;

let mainForm = document.getElementById("mainForm");
let inpImg = document.getElementById("inpImg");
let inpTitle = document.getElementById("inpTitle");
let inpCategory = document.getElementById("inpCategory");
let inpYear = document.getElementById("inpYear");
let btnCreate = document.getElementById("btnCreate");

// !details modal переменные

let detailsModal = document.querySelector("#detailsModal");
let closeBtnDetailsModal = document.querySelector("#closeBtn");
let detailsImage = document.querySelector("#modalLeft");
let detailsName = document.querySelector("#modalRight h2");
let detailsPrice = document.querySelector("#modalRight h3");
let detailsSkills = document.querySelector("#modalRight p");

// ! Edit
// let editBtns = document.querySelector(".btnEdit");
let modal = document.querySelector(".editModal");
let closeBtn = document.querySelector("#closeEditModal");
let editInpTitle = document.querySelector("#editInpTitle");
let editInpImg = document.querySelector("#editInpImg");
let editInpCategory = document.querySelector("#editInpCategory");
let editInpYear = document.querySelector("#editInpYear");
let editForm = document.querySelector("#editForm");
let btnSave = document.querySelector("#editForm button");

async function fromApiToJson() {
  let res = await fetch("https://www.omdbapi.com/?apikey=b6003d8a&s=All");
  let data = await res.json();
  for (let i of data.Search) {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(i),
    });
  }
}
// fromApiToJson();

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   Проверка на заполненность полей
  if (
    !inpImg.value.trim() ||
    !inpTitle.value.trim() ||
    !inpYear.value.trim() ||
    !inpCategory.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }

  //   Создаём новый объект и туда добавляем значения наших инпутов
  let newProfile = {
    Poster: inpImg.value,
    Title: inpTitle.value,
    Year: inpYear.value,
    Type: inpCategory.value,
  };

  createProfile(newProfile);
});

// Create - добавление новых данных
async function createProfile(objProf) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objProf),
  });

  if (JSON.parse(localStorage.getItem("isAdmin"))) {
    adminReadProfile();
  } else {
    readProfile();
  }

  let inputs = document.querySelectorAll("form input");
  inputs.forEach((elem) => {
    elem.value = "";
  });
}

localStorage.setItem("isAdmin", JSON.stringify(false));

async function readProfile(search = "All") {
  let res =
    search !== "All"
      ? await fetch(`${API}?_page=${currentPage}&_limit=4`)
      : await fetch(`${API}?&_page=${currentPage}&_limit=4`);

  let data = await res.json();
  cardsContainer.innerHTML = "";
  data.forEach((elem) => {
    cardsContainer.innerHTML += `
      <div class="card">
      <img " src="${elem.Poster}" alt="${elem.Title}" onclick="showDetailsModal(${elem.id})"/>
      <h4>${elem.Title}</h4>
      <p>${elem.Type}</p>
      <p>${elem.Year}</p>
          </div>
      `;
  });
  countPages();
}

readProfile();

// ! START FILTER

let categoryBtns = document.querySelectorAll(".categoryBtns button");

categoryBtns.forEach((elem) => {
  elem.addEventListener("click", () => {
    filterFunction(elem.innerText);
    elem.classList.toggle("hoverFilter");
  });
});

async function filterFunction(search = "All") {
  let res =
    search !== "All"
      ? await fetch(`${API}?Type=${search}`)
      : await fetch(`${API}?&_page=${currentPage}&_limit=4`);

  let data = await res.json();
  cardsContainer.innerHTML = "";
  data.forEach((elem) => {
    cardsContainer.innerHTML += `
        <div class="card">
        <img " src="${elem.Poster}" alt="${elem.Title}" onclick="showDetailsModal(${elem.id})"/>
        <h4>${elem.Title}</h4>
        <p>${elem.Type}</p>
        <p>${elem.Year}</p>
            </div>
        `;
  });
  countPages();
}

// ! END FILTER

//! SEARCH FUNCTION
async function searchFunction() {
  let res =
    search.value.length == 0
      ? await fetch(`${API}?&_page=${currentPage}&_limit=4`)
      : await fetch(API);

  let data = await res.json();
  cardsContainer.innerHTML = "";
  data.forEach((elem) => {
    let title = elem.Title.toLowerCase();
    let ser = search.value.toLowerCase();
    let year = elem.Year;
    if (title.includes(ser) || year.includes(ser)) {
      //   container.innerHTML = "";
      cardsContainer.innerHTML += `<div class="card">
      <img " src="${elem.Poster}" alt="${elem.Title}" onclick="showDetailsModal(${elem.id})"/>
            <h4>${elem.Title}</h4>
            <p>${elem.Type}</p>
            <p>${elem.Year}</p>
    </div>
        `;
    }
  });
  countPages();
}

async function adminReadProfile(search = "") {
  let res =
    search !== "All"
      ? await fetch(`${API}?_page=${currentPage}&_limit=4`)
      : await fetch(`${API}?&_page=${currentPage}&_limit=4`);

  let data = await res.json();
  cardsContainer.innerHTML = "";
  data.forEach((elem) => {
    cardsContainer.innerHTML += `
      <div class="card">
          <img " src="${elem.Poster}" alt="${elem.Title}" onclick="showDetailsModal()"/>
          <h4>${elem.Title}</h4>
          <p>${elem.Type}</p>
          <p>${elem.Year}</p>
          <button onclick="deleteProfile(${elem.id})">delete</button>
          <button onclick="showModalEdit(${elem.id})">edit</button>
      </div>
    `;
  });
  countPages();
}

search.addEventListener("input", searchFunction);
//! END SEARCH FUNCTION

//! START PAGINATION

async function countPages() {
  let res = await fetch(API);
  let data = await res.json();
  pageLength = Math.ceil(data.length / 3);
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) {
    console.log("false");
    return;
  }
  //   if (currentPage >= pageLength) return;
  console.log("prev");
  currentPage--;
  if (JSON.parse(localStorage.getItem("isAdmin"))) {
    adminReadProfile();
  } else {
    readProfile();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage > pageLength) {
    console.log("true");
    return;
  }
  //   if (currentPage <= 1) return;
  console.log("next");
  currentPage++;
  if (JSON.parse(localStorage.getItem("isAdmin"))) {
    adminReadProfile();
  } else {
    readProfile();
  }
});

//! END PAGINATION

//! Delete - удаление одного элемента по id

async function deleteProfile(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  if (localStorage.getItem("isAdmin")) {
    adminReadProfile();
  } else {
    readProfile();
  }
}

// ! Edit
async function showModalEdit(id) {
  modal.style.display = "flex";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  editInpTitle.value = data.Title;
  editInpImg.value = data.Poster;
  editInpCategory.value = data.Type;
  editInpYear.value = data.Year;
  btnSave.setAttribute("id", data.id);
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let editedProfile = {
    Poster: editInpImg.value,
    Title: editInpTitle.value,
    Year: editInpYear.value,
    Type: editInpCategory.value,
  };
  editProfileFunc(editedProfile, btnSave.id);
});

async function editProfileFunc(editedProfile, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editedProfile),
    });
    modal.style.display = "none";
    adminReadProfile();
  } catch (error) {
    console.error(error);
  }
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// ! admin

let showAdminFormBtn = document.getElementById("showAdminFormBtn");
let adminForm = document.getElementById("adminForm");
let adminInp = document.getElementById("adminInp");
let adminBtn = document.getElementById("adminBtn");
let adminExitBtn = document.getElementById("adminExitBtn");

localStorage.setItem("isAdmin", JSON.stringify(false));

showAdminFormBtn.addEventListener("click", () => {
  adminForm.classList.toggle("adminFormShow");
  adminInp.style.display = "inline-block";
  adminBtn.style.display = "inline-block";
  adminExitBtn.style.display = "none";
});

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  passwordValue();
  adminInp.style.display = "none";
  adminBtn.style.display = "none";
});

readProfile();

async function passwordValue() {
  let res = await fetch("http://localhost:8000/admin");
  let data = await res.json();
  if (data.password == adminInp.value) {
    localStorage.setItem("isAdmin", JSON.stringify(true));
    adminReadProfile();
    adminInp.value = "";
    adminExitBtn.style.display = "inline-block";
  }
}

adminExitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("isAdmin", JSON.stringify(false));
  readProfile();
  adminForm.classList.add("adminFormShow");
});

// ! details

async function showDetailsModal(id) {
  detailsModal.style.display = "flex";
  let res = await fetch(`${API}/${id}`);
  let data = await res.json();
  detailsImage.src = data.Poster;
  detailsName.innerText = data.Title;
  detailsPrice.innerText = data.Type;
  detailsSkills.innerText = data.Year;
}

closeBtnDetailsModal.addEventListener("click", () => {
  detailsModal.style.display = "none";
});
