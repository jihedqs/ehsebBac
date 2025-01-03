function Subject(subject, dvrConDis, dvrOralDis, somme, multiplier) {
  this.subject = subject;
  this.dvrConDis = dvrConDis;
  this.dvrOralDis = dvrOralDis;
  this.somme = somme;
  this.score = { controle: 0, synthese: 0, oral: 0 };
  this.average = 0;
  this.multiplier = multiplier;
}

const mat = [
  new Subject("Francais", "visible", "visible", 4, 2),
  new Subject("Philo", "hidden", "hidden", 2, 1),
  new Subject("English", "visible", "visible", 4, 2),
  new Subject("Arab", "visible", "visible", 4, 1),
  new Subject("Option", "visible", "visible", 4, 1),
  new Subject("Histoire", "visible", "visible", 4, 1),
  new Subject("Geo", "visible", "visible", 4, 1),
  new Subject("Prog", "visible", "visible", 4, 3),
  new Subject("STI", "visible", "visible", 4, 3),
  new Subject("Math", "visible", "hidden", 3, 3),
  new Subject("Physique", "visible", "visible", 4, 3),
  new Subject("Sport", "visible", "hidden", 3, 1),
];

const next = document.querySelector(".next-btn");
const prev = document.querySelector(".prev-btn");
const su = document.querySelector("#su");
const calc = document.querySelector("#calc");
const contrle = document.querySelector(".controle");
const oral = document.querySelector(".oral");
const averageDisplay = document.getElementById("average");
const syntheseInput = document.getElementById("synthese");
const oralInput = document.getElementById("oral");
const oralLabel = document.getElementById("oralLabel");
const controleInput = document.getElementById("controle");
const table = document.querySelector("#subjectTable");
const sctable = document.querySelector("#ScoreTable");

averageDisplay.textContent = "Moyen: 0.00 ";
prev.classList.add("hidden");

let num = 0;
let clicker = false;
let scores = [];

function show(num) {
  let sub = mat[num];
  su.textContent = sub.subject;
  contrle.classList.remove("visible", "hidden");
  oral.classList.remove("visible", "hidden");
  contrle.classList.add(sub.dvrConDis);
  oral.classList.add(sub.dvrOralDis);
  if (
    sub.subject == "Physique" ||
    sub.subject == "Prog" ||
    sub.subject == "STI"
  ) {
    oralLabel.textContent = "Tp:";
  } else {
    oralLabel.textContent = "Oral:";
  }
  syntheseInput.value = sub.score.synthese || "";
  oralInput.value = sub.score.oral || "";
  controleInput.value = sub.score.controle || "";
  averageDisplay.textContent = `Moyen: ${sub.average || "0.00"}`;
}

function update(x) {
  let sub = mat[x];
  let syn = parseFloat(syntheseInput.value) || 0;
  let oralDvr = parseFloat(oralInput.value) || 0;
  let controleDvr = parseFloat(controleInput.value) || 0;

  sub.score.controle = controleDvr;
  sub.score.oral = oralDvr;
  sub.score.synthese = syn;

  syntheseInput.value = oralInput.value = controleInput.value = "";
}

function moy(sub) {
  return (
    (sub.score.oral + sub.score.controle + sub.score.synthese * 2) /
    sub.somme
  ).toFixed(2);
}

function realTime(x) {
  let sub = mat[x];
  let syn = parseFloat(syntheseInput.value) || 0;
  let oralDvr = parseFloat(oralInput.value) || 0;
  let controleDvr = parseFloat(controleInput.value) || 0;

  sub.score.controle = controleDvr;
  sub.score.oral = oralDvr;
  sub.score.synthese = syn;

  sub.average = moy(sub);
  averageDisplay.textContent = `Moyen: ${sub.average || "0.00"}`;
}

next.addEventListener("click", function () {
  let sub = mat[num];
  update(num);
  sub.average = moy(sub);

  clicker = false;
  console.log(mat[num]);
  num++;
  if (num >= mat.length - 1) {
    next.classList.add("hidden");
    calc.classList.add("visible");
  }
  prev.disabled = false;
  prev.classList.remove("hidden");
  averageDisplay.textContent = "Moyen: 0.00";
  show(num);
});

prev.addEventListener("click", function () {
  num--;
  clicker = false;
  if (num <= 0) {
    prev.classList.add("hidden");
  }
  mat[num].average = 0;
  calc.classList.remove("visible");
  next.classList.remove("hidden");
  averageDisplay.textContent = "Moyen: 0.00";
  console.log(mat[num]);
  show(num);
});

[syntheseInput, oralInput, controleInput].forEach((input) => {
  input.addEventListener("input", function () {
    realTime(num);
    clicker = false;
  });
});
let i = localStorage.length;

calc.addEventListener("click", function () {
  if (!clicker) {
    clicker = true;
    let sub = mat[mat.length - 1];
    update(mat.length - 1);
    sub.average = moy(sub);
    let res =
      mat.reduce(
        (acc, sub) => acc + parseFloat(sub.average) * sub.multiplier,
        0
      ) / 22;
    averageDisplay.textContent = `Moyen: ${res.toFixed(2)}`;
    scores.push(res.toFixed(2));
    i = localStorage.length + 1;
    window.localStorage.setItem("score" + i, res.toFixed(2));
    console.log(mat);
    console.log(scores);
    tableApp();
    tableScore();
  }
});

function clearLastAverages() {
  const rowCount = table.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}

function tableApp() {
  clearLastAverages();
  mat.forEach((sub) => {
    const row = table.insertRow(table.rows.length);
    const cellSubject = row.insertCell(0);
    const cellScore = row.insertCell(1);

    cellSubject.textContent = sub.subject;
    cellScore.textContent = sub.average || "0.00";
  });
}

window.onload = function () {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("score")) {
      const score = localStorage.getItem(key);
      if (score) {
        scores.push(score);
      }
    }
  }
  scores.forEach((score, index) => {
    const row = sctable.insertRow();
    const colNum = row.insertCell(0);
    const colScore = row.insertCell(1);
    colNum.textContent = index + 1;
    colScore.textContent = score;
  });
};

function tableScore() {
  const row = sctable.insertRow();
  const colNum = row.insertCell(0);
  const colScore = row.insertCell(1);
  colNum.textContent = scores.length;
  colScore.textContent = scores[scores.length - 1];
}