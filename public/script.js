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
let list = document.querySelector(".nav-list")
let menuIcon=document.querySelector(".menu-button");
menuIcon.addEventListener("click",()=>{
    menuIcon.classList.toggle("active");
    list.classList.toggle("active-menu");
});
// ---------------------signup------------------------
const form = document.querySelector("form");
const email = document.querySelector("input[type=email]");
const password = document.getElementById("password-input");


function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

email.addEventListener('change', () => {
    if (!validateEmail(email.value)) {
        alert('Please enter a valid email address.');
    }
});

function validateForm() {
    const emailValue = email.value;
    if (!validateEmail(emailValue)) {
        alert('Please enter a valid email address.');
        return false;
    }
    return true;
}

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