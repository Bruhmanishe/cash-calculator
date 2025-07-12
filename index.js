const dataElement = document.querySelector(".data");
let inputs = document.querySelectorAll(".money-input");
const result = document.getElementById("resultData");
const refreshBtn = document.getElementById("refreshBtn");
const editBtn = document.getElementById("editBtn");
let isEditingInputs = false;

// window.onload = () => {
window.onclick = () => {
  inputs.forEach((input) => {
    if (input.value === "") return (input.value = 0);
    calcAmount(input);
  });
};
loadStoredInputsInLocalStorage();
applyCalcToInputs();
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
      if (parseFloat(el.getAttribute("result")) >= 0)
        return parseFloat(el.getAttribute("result"));
    })
    .reduce((a, cv) => a + cv);
}

function storeDataInLocalStorage(input) {
  const storedData = JSON.parse(localStorage.getItem("savedData"));
  storedData[input.getAttribute("name")] = input.value;
  localStorage.setItem("savedData", JSON.stringify(storedData));
}

function loadStoredInputsInLocalStorage() {
  if (!localStorage.getItem("inputs")) return;
  const inputsContainers = dataElement.querySelectorAll(`.inputs__container`);
  inputsContainers.forEach((cont) => {
    cont.innerHTML = "";
  });

  const inputsObj = JSON.parse(localStorage.getItem("inputs"));
  const inputsArray = Object.keys(inputsObj)
    .map((key) => {
      return inputsObj[key];
    })
    .sort((a, b) => parseInt(b.labelValue) - parseInt(a.labelValue));

  inputsArray.forEach((input) => {
    const htmlToInsert = `
            <div class="${
              input.labelValue + (input.type == "coins" ? "c" : "")
            } cash-calculator__input">
              <input
                type="text"
                name="${
                  input.labelValue + (input.type == "coins" ? "c" : "")
                }-input"
                value="0"
                class="money-input"
              />
              <label for="${
                input.labelValue + (input.type == "coins" ? "c" : "")
              }-input" ${input.type}>${input.labelValue}</label>
            </div>`;
    dataElement
      .querySelector(`.${input.type}`)
      .querySelector(".inputs__container")
      .insertAdjacentHTML("beforeend", htmlToInsert);
  });
  inputs = document.querySelectorAll(".money-input");
}

function storeInputsInLocalStorage() {
  inputs = document.querySelectorAll(".money-input");
  const inputsObj = {};
  inputs.forEach((input) => {
    inputsObj[input.getAttribute("name")] = {
      name: input.getAttribute("name"),
      classes: input.className,
      type: input.parentElement.querySelector("label").hasAttribute("coins")
        ? "coins"
        : "banknotes",
      labelValue: input.parentElement.querySelector("label").innerText,
    };
  });
  localStorage.setItem("inputs", JSON.stringify(inputsObj));
}

function deleteInput(input) {
  input.parentElement.remove();
  storeInputsInLocalStorage();
  loadStoredInputsInLocalStorage();
  inputs.forEach((input) => {
    addDelBtnToInput(input);
  });
}

function addDelBtnToInput(input) {
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = "&#10060;";
  input.parentElement.insertAdjacentElement("beforeend", deleteBtn);
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    deleteInput(input);
  });
}

function removeDelBtnToInput(input) {
  if (input.parentElement.querySelector(".delete-btn"))
    input.parentElement.querySelector(".delete-btn").remove();
}

function addNewInput(labelValue, type) {
  const inputsObj = {};
  inputs.forEach((input) => {
    inputsObj[input.getAttribute("name")] = {
      name: input.getAttribute("name"),
      classes: input.className,
      type: input.parentElement.querySelector("label").hasAttribute("coins")
        ? "coins"
        : "banknotes",
      labelValue: input.parentElement.querySelector("label").innerText,
    };
  });
  inputsObj[labelValue + (type === "coins" ? "c-input" : "-input")] = {
    name: labelValue + (type === "coins" ? "c-input" : "-input"),
    classes: inputs[1].className,
    type,
    labelValue: labelValue,
  };
  localStorage.setItem("inputs", JSON.stringify(inputsObj));
}

editBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();

  if (!localStorage.getItem("inputs")) {
    storeInputsInLocalStorage();
  }
  loadStoredInputsInLocalStorage();
  if (!isEditingInputs) {
    isEditingInputs = true;
    editBtn.querySelector("img").src = "./img/accept-cahnges-button.png";
    inputs.forEach((input) => {
      addDelBtnToInput(input);
      // input.setAttribute("autocomplete", "off");
      // !localStorage.getItem("savedData")
      //   ? localStorage.setItem("savedData", JSON.stringify({}))
      //   : (input.value = JSON.parse(localStorage.getItem("savedData"))[
      //       input.getAttribute("name")
      //     ]
      //       ? JSON.parse(localStorage.getItem("savedData"))[
      //           input.getAttribute("name")
      //         ]
      //       : 0);

      // // console.log(input.value);
      // input.oninput = (e) => {
      //   e.stopImmediatePropagation();
      //   const allowedSymbols = "0123456789";
      //   for (let i = 0; allowedSymbols.length > i; i++) {
      //     if (input.value.length < 1) return calcAmount(input);
      //     if (input.value.length > 1 && input.value[0] == 0)
      //       input.value = input.value.slice(0, 0);
      //     if (input.value[input.value.length - 1] === allowedSymbols[i])
      //       return calcAmount(input);
      //     if (i === allowedSymbols.length - 1)
      //       return (input.value = input.value.slice(0, -1));
      //   }
      //   calcFinalResult();
      // };
      // calcAmount(input);
    });
    const inputsContainers = dataElement.querySelectorAll(`.inputs__container`);
    inputsContainers.forEach((cont) => {
      const addBtn = document.createElement("button");
      const input = document.createElement("input");
      const div = document.createElement("div");
      div.className = "add-input__container";
      div.appendChild(input);
      div.appendChild(addBtn);

      addBtn.innerHTML = "<span>&#43;</span>";
      addBtn.className = "add-input__btn";
      cont.parentElement.appendChild(div);

      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        if (
          parseInt(input.value) > 0 &&
          input.value.length < 5 &&
          input.value[0] !== "0"
        ) {
          addNewInput(
            input.value,
            cont.hasAttribute("coins") ? "coins" : "banknotes"
          );
          loadStoredInputsInLocalStorage();
          inputs.forEach((input) => {
            addDelBtnToInput(input);
          });
          input.value = 0;
        }
      });
    });
  } else {
    isEditingInputs = false;
    editBtn.querySelector("img").src = "./img/change-inputs-button.png";
    applyCalcToInputs();
    console.log(isEditingInputs);
    inputs = document.querySelectorAll(".money-input");
    inputs.forEach((input) => {
      removeDelBtnToInput(input);
    });
    const inputsContainers = dataElement.querySelectorAll(`.inputs__container`);
    inputsContainers.forEach((cont) => {
      cont.parentElement.querySelector(".add-input__container").remove();
    });
  }
});

function applyCalcToInputs() {
  inputs.forEach((input, index) => {
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
      if (isEditingInputs) return;
      e.stopImmediatePropagation();
      const allowedSymbols = "0123456789";
      for (let i = 0; allowedSymbols.length > i; i++) {
        if (input.value.length < 1) return calcAmount(input);
        if (input.value.length > 1 && input.value[0] == 0)
          input.value =
            input.value.slice(0, 0) + input.value[input.value.length - 1];
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
}
// };
