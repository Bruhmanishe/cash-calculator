const inputs = document.querySelectorAll(".money-input");
const result = document.getElementById("resultData");
const refreshBtn = document.getElementById("refreshBtn");

window.onload = () => {
  window.onclick = () => {
    inputs.forEach((input) => {
      if (input.value === "") return (input.value = 0);
      calcAmount(input);
    });
  };
  inputs.forEach((input) => {
    input.setAttribute("autocomplete", "off");
    !localStorage.getItem("savedData")
      ? localStorage.setItem("savedData", JSON.stringify({}))
      : (input.value = JSON.parse(localStorage.getItem("savedData"))[
          input.getAttribute("name")
        ]
          ? JSON.parse(localStorage.getItem("savedData"))[
              input.getAttribute("name")
            ]
          : 0);

    // console.log(input.value);
    input.oninput = (e) => {
      e.stopImmediatePropagation();
      const allowedSymbols = "0123456789";
      for (let i = 0; allowedSymbols.length > i; i++) {
        if (input.value.length < 1) return calcAmount(input);
        if (input.value.length > 1 && input.value[0] == 0)
          input.value = input.value.slice(0, 0);
        if (input.value[input.value.length - 1] === allowedSymbols[i])
          return calcAmount(input);
        if (i === allowedSymbols.length - 1)
          return (input.value = input.value.slice(0, -1));
      }
      calcFinalResult();
    };
    calcAmount(input);
  });

  refreshBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    inputs.forEach((input) => ((input.value = 0), calcAmount(input)));
  });

  function calcAmount(input) {
    const moneyData = input.parentElement
      .querySelector("label")
      .hasAttribute("coins")
      ? parseInt(input.parentElement.querySelector("label").innerText) / 100
      : parseInt(input.parentElement.querySelector("label").innerText);
    // console.log(input.value);

    input.setAttribute(
      "result",
      input.value === "" ? 0 : moneyData * parseInt(input.value)
    );
    calcFinalResult();
    storeDataInLocalStorage(input);
  }

  function calcFinalResult() {
    result.innerText = [...inputs]
      .map((el) => {
        return parseFloat(el.getAttribute("result"));
      })
      .reduce((a, cv) => a + cv);
  }

  function storeDataInLocalStorage(input) {
    const storedData = JSON.parse(localStorage.getItem("savedData"));
    storedData[input.getAttribute("name")] = input.value;
    localStorage.setItem("savedData", JSON.stringify(storedData));
  }
};
