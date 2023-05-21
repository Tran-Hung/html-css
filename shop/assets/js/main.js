var register = document.querySelector(".header__navbar-item.register");
var login = document.querySelector(".header__navbar-item.login");
var registerForm = document.querySelector(".auth-form.register");
var loginForm = document.querySelector(".auth-form.login");
var modal = document.querySelector(".modal");
const modalBody = document.querySelector('.modal__body');
const cancle = document.querySelector('.auth-form__controls-back');

login.onclick = function () {
    modal.style.display = "flex";
    if (registerForm.classList.contains("active"))
        registerForm.classList.remove("active")
    loginForm.classList.add("active")
}

register.onclick = function () {
    modal.style.display = "flex";
    if (loginForm.classList.contains("active"))
        loginForm.classList.remove("active")
    registerForm.classList.add("active")
}

function hidenAuthForm() {
    modal.style.display = "none";
}

cancle.addEventListener('click', hidenAuthForm)
modal.addEventListener('click', hidenAuthForm)
modalBody.addEventListener('click', function (event){
    event.stopPropagation();
})