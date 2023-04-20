var tiempo = 0;
var intervalo_tiempo = null;
var turno = null;
var posibilidades = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
var registros = [];
var guardar_ganador = function () {
    var o = Object();
    var c = document.querySelector(".ganador input[type=text]");
    o.nombre = c.value;
    var r = document.querySelector(".ganador .rol");
    o.rol = r.innerHTML;
    o.tiempo = tiempo;
    registros.push(o);
    fn_saveData(registros);
};


var validar_jugada = function () {
    var gano = -1;
    var zonas = document.querySelectorAll(".zona");

    for (var i = 0; i < posibilidades.length; i++) {
        var p = posibilidades[i];//[3,4,5]
        if (zonas[p[0]].innerHTML !== ""
                && zonas[p[1]].innerHTML !== ""
                && zonas[p[2]].innerHTML !== ""
                && zonas[p[0]].innerHTML === zonas[p[1]].innerHTML
                && zonas[p[0]].innerHTML === zonas[p[2]].innerHTML
                ) {
            zonas[p[0]].classList.add("jugada_ganadora");
            zonas[p[1]].classList.add("jugada_ganadora");
            zonas[p[2]].classList.add("jugada_ganadora");
            gano = 1;
            break;
        }
    }

    if (gano === -1) {
        var z_jugadas = document.querySelectorAll(".jugado");
        if (z_jugadas.length === 9) {
            gano = 0;
            for (var i = 0; i < z_jugadas.length; i++) {
                z_jugadas[i].classList.add("jugada_perdedora");
            }
        }
    }

    return gano;
};

var inicio_tiempo = function () {
    if (intervalo_tiempo === null) {
        intervalo_tiempo = setInterval(function () {
            var tiempoHMS = fn_formatoHMS(tiempo);
            timer.innerHTML = tiempoHMS;
            tiempo++;
        }, 1000);
    }
};

var para_tiempo = function () {
    clearInterval(intervalo_tiempo);
    tiempo = 0;
    intervalo_tiempo = null;
};

var asignar_turno = function (b) {
    turno = b;
    var turnoAnterior = document.querySelector(".activo");
    if (turnoAnterior) {
        turnoAnterior.classList.remove("activo");
    }
    if (b !== null) {
        if (b) {
            var cnt = document.querySelector(".rolx");
            cnt.classList.add("activo");
        } else {
            var cnt = document.querySelector(".rolo");
            cnt.classList.add("activo");
        }
    }
};

var click_jugada = function (e) {
    if (turno !== null) {
        if (e.target.innerHTML === "") {
            if (turno) {
                e.target.innerHTML = "X";
                e.target.classList.add("jugadox");
            } else {
                e.target.innerHTML = "O";
                e.target.classList.add("jugadoo");
            }
            e.target.classList.add("jugado");
            var gano = validar_jugada();
            if (gano === -1) {
                asignar_turno(!turno);
            }
            else if (gano === 1) {
                if (turno) {
                    var ganador = document.querySelector(".gamer.rolx");
                    ganador.classList.add("ganador");
                }
                else {
                    var ganador = document.querySelector(".gamer.rolo");
                    ganador.classList.add("ganador");
                }
                guardar_ganador();
                setTimeout(function () {
                    var ng = document.querySelector(".ganador input[type=text]");
                    alert("Ganaste " + ng.value + "!");
                    fin_juego();
                }, 3000);
            } else {
                setTimeout(function () {
                    alert("No hay ganador!");
                    fin_juego();
                }, 3000);
            }

        } else {
            alert("Ya fue jugado");
        }
    } else {
        alert("No se ha iniciado el juego");
    }
};

var inicio_juego = function () {
    var jugador1 = document.querySelector(".jugadores input[type=text]:nth-of-type(1)").value;
    var jugador2 = document.querySelector(".jugadores input[type=text]:nth-of-type(2)").value;
    if (jugador1 === "" || jugador2 === "") {
        alert("Por favor ingrese los nombres de ambos jugadores antes de iniciar el juego.");
        return;
    }
    var rol = aleatorio(2);
    if (rol === 1) {
        rol_gamer1.innerHTML = "X";
        gamer1.classList.add("rolx");
        rol_gamer2.innerHTML = "O";
        gamer2.classList.add("rolo");
    } else {
        rol_gamer1.innerHTML = "O";
        gamer1.classList.add("rolo");
        rol_gamer2.innerHTML = "X";
        gamer2.classList.add("rolx");
    }
    asignar_turno(true);
    inicio_tiempo();
};

var fin_juego = function () {
    para_tiempo();
    timer.innerHTML = "00:00:00";
    asignar_turno(null);
    document.querySelector(".rolx").classList.remove("rolx");
    document.querySelector(".rolo").classList.remove("rolo");
    rol_gamer1.innerHTML = "";
    rol_gamer2.innerHTML = "";
    btnSaveGamer1.classList.remove("oculto");
    btnSaveGamer2.classList.remove("oculto");
    jugador1.readOnly = false;
    jugador2.readOnly = false;
    iniciar.classList.remove("oculto");
    reiniciar.classList.add("oculto");
    var g = document.querySelector(".ganador");
    if (g) {
        g.classList.remove("ganador");
    }
    var zonas = document.querySelectorAll(".zona");
    for (var i = 0; i < zonas.length; i++) {
        var z = zonas[i];
        z.classList.remove("jugado");
        z.classList.remove("jugadox");
        z.classList.remove("jugadoo");
        z.classList.remove("jugada_ganadora");
        z.classList.remove("jugada_perdedora");
        z.innerHTML = "";
    }


};

var guardarJugador = function (e) {
    var txtJugador = null;
    if (e.target === btnSaveGamer1) {
        txtJugador = jugador1;
    } else {
        txtJugador = jugador2;
    }
    txtJugador.classList.remove("error");
    if (txtJugador.value === "") {
        txtJugador.classList.add("error");
    } else {
        var key = txtJugador.id;
        var value = txtJugador.value;
        localStorage.setItem(key, value);
        alert("El jugador ha sido almacenado en el LocalStorage");
    }
};

var renderScore = function (vr) {
    var html = "<table>";
    html += "<thead><tr>";
    html += "<th>#</th><th>Nombre</th><th>Rol</th><th>Tiempo</th>";
    html += "</tr></thead>";
    html += "<tbody>";
    for (var i = 0; i < vr.length; i++) {
        var jugador = vr[i];
        html += "<tr>";
        html += "<td>" + (i + 1) + "</td>";
        html += "<td>" + jugador.nombre + "</td>";
        html += "<td>" + jugador.rol + "</td>";
        html += "<td>" + fn_formatoHMS(jugador.tiempo) + "</td>";
        html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    data.innerHTML = html;
};

window.onload = function () {
    registros = fn_loadData();
    btnSaveGamer1.onclick = guardarJugador;
    btnSaveGamer2.onclick = guardarJugador;

    sortByTime.onchange = function (e) {
        if (e.target.checked) {
            var vr = JSON.parse(JSON.stringify(registros)); 
            vr = ordenar_arreglo(vr);
            renderScore(vr);
        } else {
            renderScore(registros);
        }
    };

    iniciar.onclick = function (e
            ) {
        var jd1 = localStorage.getItem("jugador1");
        var jd2 = localStorage.getItem("jugador2");
        if (jd1 === null || jd2 === null) {
            alert("Guarde los nombres de los jugadores");
        } else {
            btnSaveGamer1.classList.add("oculto");
            btnSaveGamer2.classList.add("oculto");
            jugador1.readOnly = true;
            jugador2.readOnly = true;
            iniciar.classList.add("oculto");
            reiniciar.classList.remove("oculto");
            inicio_juego();
        }
    };
    reiniciar.onclick = function (e) {
        btnSaveGamer1.classList.remove("oculto");
        btnSaveGamer2.classList.remove("oculto");
        jugador1.readOnly = false;
        jugador2.readOnly = false;
        reiniciar.classList.add("oculto");
        iniciar.classList.remove("oculto");

    };
    resultado.onclick = function (e) {
        sortByTime.checked = false;
        renderScore(registros);
        tabla.classList.add("show");
    };
    cerrar.onclick = function () {
        tabla.classList.remove("show");
    };

    var nj1 = localStorage.getItem("jugador1");
    if (nj1 !== null) {
        jugador1.value = nj1;
    }

    var nj2 = localStorage.getItem("jugador2");
    if (nj2 !== null) {
        jugador2.value = nj2;
    }

    var zonas = document.querySelectorAll(".zona");
    for (var i = 0; i < zonas.length; i++) {
        var z = zonas[i];
        z.onclick = click_jugada;
    }

};

