//výběr obtížnosti
function tajne() {
    generacePole(64);
    document.getElementById("oznamovac").innerText = "OBJEVILI JSTE TAJNOU OBTÍŽNOST!";
}

function lehke() {
    generacePole(8);
}

function stredni() {
    generacePole(16);
}

function tezke() {
    generacePole(32);
}

//globální 2d pole
let policka = [];

function generacePole(velikostPole) {
    //vyprázdnit a resetovat
    document.getElementById("pole").innerHTML=("");
    policka = [];
    document.documentElement.style.setProperty("--tablePozadi", "#fff");
    document.documentElement.style.setProperty("--tableSekundarniPozadi", "#bbb");

    if(!(velikostPole == 64)) {
        document.getElementById("oznamovac").innerText = "";
    }

    //vygenerovat
    for(let x = 0; x < velikostPole; x++) {
        const tr = document.createElement("tr");
        policka[x] = [];
        for(let y = 0; y < velikostPole; y++) {
            const td = document.createElement("td");

            //nastavení parametrů buňky
            //zabombování
            td.setAttribute("jeBomba", (Math.random() < 0.1));
            td.setAttribute("jeOdkryto", false);
            td.setAttribute("pocetBombsedu", 0);

            //změnit velikost dle obtížnosti a předtím reset
            td.classList.remove("lehke");
            td.classList.remove("stredni");
            td.classList.remove("tezke");
            td.classList.remove("tajne");

            if (velikostPole == 8) {
                td.classList.add("lehke");
            } else if (velikostPole == 16) {
                td.classList.add("stredni");
            } else if (velikostPole == 32) {
                td.classList.add("tezke");
            } else {
                td.classList.add("tajne");
            }
            

            //přidání td do 2d pole
            policka[x][y] = td;

            //přidání posluchače na levé kliknutí
            td.addEventListener("click", () => {
                //tohle je fakt divné a nemám to rád, co je "===" ?!?, musel jsem dost googlit
                if(td.getAttribute("jeBomba") === "true") {
                    if(!(td.classList.contains("vlajecka"))) {
                        prohraEfekt(velikostPole);
                    }
                } else {
                    odkrytPolicko(x, y);
                    zkouskaVyhry(velikostPole);
                }
            });

            //přidání posluchače na pravé kliknutí
            td.addEventListener("contextmenu", () => {
                if (td.getAttribute("jeOdkryto") === "false") {
                    td.classList.toggle("vlajecka");
                }
            });
            
            tr.appendChild(td);
        }
        document.getElementById("pole").appendChild(tr);
    }
}

function odkrytPolicko(x, y) {
    const td = policka[x][y];

    if(!(td.classList.contains("vlajecka"))) {
        td.setAttribute("jeOdkryto", true);
        policka[x][y].classList.add("odkryto");

        //odkryje i sousední políčka s 0 bombsedama
        if (zjistitPocetBombsedu(x, y) === 0) {
            for(var dx = -1; dx <= 1; dx++) {
                for(var dy = -1; dy <= 1; dy++) {

                    // Vynechání hlavní buňky
                    if(dx === 0 && dy === 0) continue;

                    //posunutí na správné místo
                    const nx = x + dx;
                    const ny = y + dy;

                    //postupuje jen jestli existuje
                    if(policka[nx] && policka[nx][ny]) {
                        if(policka[nx][ny].getAttribute("jeOdkryto") === "false") {
                            odkrytPolicko(nx, ny);
                            
                        }
                    }
                }
            }
        }
        //zobrazí počet bombsedů pro hráče pokud není 0
        if(zjistitPocetBombsedu(x, y) !== 0) {
            td.innerHTML = zjistitPocetBombsedu(x, y);
        } else {
            td.classList.add("nula");
        }   
    }    
}

function zjistitPocetBombsedu(x, y) {
    const td = policka[x][y];
    var pocet = 0;

    //projde všechny buňky kolem hlavní buňky
    for(var dx = -1; dx <= 1; dx++) {
        for(var dy = -1; dy <= 1; dy++) {

            //posunutí na správné místo
            const nx = x + dx;
            const ny = y + dy;

            //přidá 1 do proměnné počet za každého bombseda
            if(policka[nx] && policka[nx][ny]) {
                if(policka[nx][ny].getAttribute("jeBomba") === "true") {
                    pocet += 1;
                }
            }
        }
    }
    return pocet;
}

function zkouskaVyhry(velikostPole) {
    for(let x = 0; x < velikostPole; x++) {
        for(let y = 0; y < velikostPole; y++) {

            //pokud je odkryto nebo je bomba
            if((policka[x][y].getAttribute("jeOdkryto") === "false") && (policka[x][y].getAttribute("jeBomba") === "false")) {
                return false;
            }
        }
    }
    vyhraEfekt(velikostPole);
    return true;
}

//nastaví styl pro výhru
function vyhraEfekt(velikostPole) {
    resetTrid(velikostPole);
    document.documentElement.style.setProperty("--tablePozadi", "#00ff00");
    document.getElementById("oznamovac").innerText = "VÍTĚZSTVÍ! Jste skvělím bombohledem!";
    odhalitBomby(velikostPole);
}

//nastaví styl pro prohru
function prohraEfekt(velikostPole) {
    resetTrid(velikostPole);
    document.documentElement.style.setProperty("--tablePozadi", "#ff8800");
    odhalitBomby(velikostPole);
    odhalitPole(velikostPole);

    //velice vtipná ("velice" ... "vtipná") zpráva po prohře
    var prsty = (1 + (Math.floor(Math.random() * 10)));
    var zprava = ("PROHRA! Ztrácíte ")
    if(prsty == 1) {
        document.getElementById("oznamovac").innerText = zprava + prsty + " prst!";
    } else if (prsty > 4) {
        document.getElementById("oznamovac").innerText = zprava + prsty + " prstů!";
    } else {
        document.getElementById("oznamovac").innerText = zprava + prsty + " prsty!";
    }
}

function resetTrid(velikostPole) {
    for(let x = 0; x < velikostPole; x++) {
        for(let y = 0; y < velikostPole; y++) {
            policka[x][y].classList.remove("nula");
            policka[x][y].classList.remove("vlajecka");
        }
    }
}

function odhalitBomby(velikostPole) {
    for(let x = 0; x < velikostPole; x++) {
        for(let y = 0; y < velikostPole; y++) {
            if(policka[x][y].getAttribute("jeBomba") === "true") {
                policka[x][y].classList.add("bomba");
            }
        }
    }
}

function odhalitPole(velikostPole) {
    for(let x = 0; x < velikostPole; x++) {
        for(let y = 0; y < velikostPole; y++) {
            if((policka[x][y].getAttribute("jeBomba") === "false")) {
                if(zjistitPocetBombsedu(x, y) !== 0) {
                    policka[x][y].innerHTML = zjistitPocetBombsedu(x, y);
                }
            } else {
                policka[x][y].innerHTML = "B";
            }
        }
    }
}