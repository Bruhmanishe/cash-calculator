const donateBtn = document.getElementById("donateBtn");
const payPalBtn = document.getElementById("donate-button-container");

donateBtn.addEventListener("click", (e) => {
  console.log(123);
  if (!payPalBtn.classList.contains("show-donate-btn"))
    payPalBtn.classList = "show-donate-btn";
  else payPalBtn.classList = "hide-donate-btn";
});
