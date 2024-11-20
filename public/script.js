// --------------------nav bar-------------------------
let navlist = document.querySelectorAll(".nav-list li a");

navlist.forEach((item) => {
  let character = item.textContent.split("");
  item.textContent = "";
  character.forEach((char, index) => {
    index += 1;
    let span = document.createElement("span");
    let delay = index / 15;

    let charUp = document.createElement("span");
    charUp.textContent = char;
    charUp.style.transitionDelay = `${delay}s`;
    charUp.classList.add("up");
    span.append(charUp);

    let charDown = document.createElement("span");
    charDown.textContent = char;
    charDown.style.transitionDelay = `${delay}s`;
    charDown.classList.add("down");
    span.append(charDown);

    item.append(span);
  });
});
// ------------------hamburger button-------------------
let list = document.querySelector(".nav-list");
let menuIcon = document.querySelector(".menu-button");
menuIcon.addEventListener("click", () => {
  menuIcon.classList.toggle("active");
  list.classList.toggle("active-menu");
});
// ---------------------signup------------------------
const form = document.querySelector("form");
const email = document.querySelector("input[type=email]");
const password = document.getElementById("password-input");

// function validateEmail(email) {
//   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailPattern.test(email);
// }

// email?.addEventListener("change", () => {
//   if (!validateEmail(email.value)) {
//     alert("Please enter a valid email address.");
//   }
// });

// function validateForm() {
//   const emailValue = email.value;
//   if (!validateEmail(emailValue)) {
//     alert("Please enter a valid email address.");
//     return false;
//   }
//   return true;
// }

form.addEventListener("submit", onSubmitFunction);

function onSubmitFunction(event) {
  if (email.value.trim() === "" || password.value.trim() === "") {
    event.preventDefault();
    alert("Please fill in the form");
    return false;
  }
  if (!validateForm()) {
    event.preventDefault();
    return false;
  }
}

function onSubmitFunction(event) {
    // Select all input fields in the form
    const inputs = document.querySelectorAll("input");
  
    let isValid = true;
  
    inputs.forEach(input => {
      input.value = input.value.trim(); // Trim spaces
      if (input.value === "") { // Check if trimmed value is empty
        isValid = false;
      }
    });
  
    if (!isValid) {
      event.preventDefault();
      alert("Please fill in all the fields correctly.");
      return false;
    }
  
    // Validate the form
    if (!validateForm()) {
      event.preventDefault();
      return false;
    }
  }
  

df

window.addEventListener("load", async () => {
  await fetch(`http://localhost:3000/admin/user?search=`)
    .then((res) => res.json())
    .then(({ data }) => {
      populateUserData(data);
    });
});

async function handleUserSearch(e) {
  if (e) {
    e.preventDefault();
  }
  const username = e.target.elements.search.value;
  await fetch(`http://localhost:3000/admin/user?search=${username}`)
    .then((res) => res.json())
    .then(({ data }) => {
      populateUserData(data);
    });
}

function populateUserData(values) {
  const container = document.getElementById("user-list");
  container.innerHTML = "";
  values.map((value) => {
    container.appendChild(
      createTemplate(value.profileImageUrl, value.username, value.email)
    );
  });
}

function createTemplate(profileImageUrl, username, email) {
  const div = document.createElement("div");
  div.innerHTML = `<div class="user-info">
                  <div class="user-name">
                  <img src="${profileImageUrl}" alt="" class="commenter-img" />
                  <p class="commenter-name">${username}</p>
                    </div>
                  <p class="commenter-name">${email}</p>
                </div>`;
  return div;
}
