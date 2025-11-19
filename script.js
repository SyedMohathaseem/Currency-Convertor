let BASE_URL = "https://open.er-api.com/v6/latest/";
let dropdowns = document.querySelectorAll(".dropdown select");
let btn = document.querySelector("form button");
let fromCurr = document.querySelector(".from select");
let toCurr = document.querySelector(".to select");

// Populate dropdowns
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newoption = document.createElement("option");
    newoption.innerText = currCode;
    newoption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newoption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newoption.selected = "selected";
    }

    select.append(newoption);
  }

  select.addEventListener("change", (evt) => {
    updateflag(evt.target);
  });
}

// Update flag
let updateflag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Convert button
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  console.log(fromCurr.value, toCurr.value);

  // New API: open.er-api.com
  let URL = `${BASE_URL}${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    if (data.result !== "success") {
      throw new Error("API error");
    }

    let rate = data.rates[toCurr.value];

    if (!rate) {
      throw new Error("Invalid currency");
    }

    let finalAmount = (amtVal * rate).toFixed(4);

    // Show result in UI
    let resultBox = document.querySelector(".msg");
    resultBox.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

  } catch (error) {
    console.error(error);
    alert("❌ Currency conversion failed. Unsupported currency or API error.");
  }
});
