document.addEventListener("DOMContentLoaded", (event) => {
  const savedCode = localStorage.getItem("cod");
  if (savedCode) {
    document.getElementById("codeInput").value = savedCode;
    runCode(savedCode);
  }
});

document.getElementById("codeInput").addEventListener("input", () => {
  const code = document.getElementById("codeInput").value;
  localStorage.setItem("cod", code);
  runCode(code);
});

function runCode(code) {
  const outputElement = document.getElementById("output");
  try {
    const result = eval(code);
    outputElement.innerHTML = result === undefined ? "" : result;
  } catch (error) {
    outputElement.innerHTML = error;
  }
}
