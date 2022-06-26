let canvas = null;
let ctx = null;
let novaLargura = null;
qtdVida = 5;
let espacoSideral = new Image();
espacoSideral.src = "Imagens/espacoSideral.png";
let naveImg = new Image();
naveImg.src = "Imagens/nave_semFundo.png";
let ovniImg = new Image();
ovniImg.src = "Imagens/ovni_semFfundo.png";
let explosaoImg = new Image();
explosaoImg.src = "Imagens/explosao.png";
let explosaoAudio = new Audio();
explosaoAudio.src = "Audios/colisaoNaveOvni.mp3";
let ovnisAbatidos = null;
let tirosNave = [];
let ovnisInvasao = []
let ovni = {
    width: 60,
    height: 60,
    px: Math.round((Math.random() * 400) + 20),
    py: -25,
    dy: 1,
    vy: 0.9,
    numOvni: Math.round((Math.random() * 12) + 1),
    colisaoOvniNave(i) {
        if (typeof ovnisInvasao[i] !== 'undefined') {
            if (nave.py < ovnisInvasao[i].py + ovnisInvasao[i].height / 5
                && (nave.px + nave.width >= ovnisInvasao[i].px && nave.px <= ovnisInvasao[i].px + ovnisInvasao[i].width)) {
                ctx.drawImage(explosaoImg, nave.px - 10, nave.py, 150, 150);
                explosaoAudio.play();
                ovnisInvasao.splice(i, 1);
                calculoDeVidaNave();
            }
        }
    },
    colisaoBottom(i) {
        if (typeof (ovnisInvasao[i]) !== "undefined") {
            if (ovnisInvasao[i].py > 500) {
                ovnisInvasao.splice(i, 1);

                calculoDeVidaNave()

            }
        }

    },

    desenharOvni(i) {

        ctx.drawImage(ovniImg, ovnisInvasao[i].px, ovnisInvasao[i].py, ovni.width, ovni.height);


    },
    colisaoOvniTiro(i) {
        for (let k = 0; k < tirosNave.length; k++) {

            if (typeof ovnisInvasao[i] !== 'undefined') {

                if (ovnisInvasao[i].py + ovnisInvasao[i].height / 10 > tirosNave[k].py && (tirosNave[k].px >= ovnisInvasao[i].px && tirosNave[k].px <=
                    ovnisInvasao[i].px + ovnisInvasao[i].width)) {

                    explosaoAudio.play();
                    ctx.drawImage(explosaoImg, ovnisInvasao[i].px - 30, (ovnisInvasao[i].py + ovnisInvasao[i].height) / 2, 150, 150);
                    tirosNave.splice(k, 1);
                    placarJogo();
                    ovnisInvasao.splice(i, 1);

                }


            }
        }
    },
    moverOvni() {


        if (ovnisInvasao.length == 0) {

            this.numOvni = Math.round((Math.random() * 5) + 1);
            for (let j = 0; j < this.numOvni; j++) {
                ovni.px = Math.round((Math.random() * 400) + 20)
                ovnisInvasao.push({ px: ovni.px, py: ovni.dy - 25 * j, dy: ovni.dy, vy: ovni.vy, height: ovni.height, width: ovni.width })

            }


        } else {
            for (let i = 0; i < ovnisInvasao.length; i++) {

                ovnisInvasao[i].py += ovnisInvasao[i].vy * ovnisInvasao[i].dy;
                this.desenharOvni(i);
                this.colisaoOvniTiro(i)
                this.colisaoBottom(i);
                this.colisaoOvniNave(i);


            }


        }

    }
}
function calculoDeVidaNave() {
    if (qtdVida == 0) {
        document.getElementById("vida").style.display = "none";
        qtdVida = 5;
        setTimeout(() => {
            window.location.reload();

        }, 800)



    } else {
        novaLargura = (window.getComputedStyle(document.getElementById("vida")).width).split("px");
        novaLargura = parseInt(novaLargura[0]);
        novaLargura = parseInt(novaLargura - 0.25 * novaLargura);
        document.getElementById("vida").style.width = novaLargura.toString() + "px";
        qtdVida--;
    }
}
let nave = {
    px: 215,
    py: 430,
    vx: 10,
    vy: 5,
    width: 70,
    height: 70,
    dx: 1,
    dy: 1,

    colisaoBordas() {
        if (this.px + this.width >= 500) {
            this.px = 500 - this.width;
        }
        if (this.px <= 0) {
            this.px = 0;
        }
        if (this.py + this.width >= 500) {
            this.py = 500 - this.height;
        }
        if (this.py <= 0) {
            this.py = 0;
        }
    },
    tirar() {

        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(this.px + (this.width - tiros.width) / 2, this.py - tiros.height, tiros.width, tiros.height)
        tirosNave.push({ px: this.px + (this.width - tiros.width) / 2, py: this.py - tiros.height, vy: tiros.vy, dy: tiros.dy })

    }

}
let tiros = {
    width: 4,
    height: 20,
    vy: 5,
    dy: -1,
    movimentarTiros() {
        for (let z = 0; z < tirosNave.length; z++) {
            tirosNave[z].py += tirosNave[z].vy * tirosNave[z].dy;
            this.desenharTiros(tirosNave[z].py, z);
        }


    },
    desenharTiros(py, z) {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(tirosNave[z].px, py, tiros.width, tiros.height);
        this.colisaoTiros(py, z);


    },
    colisaoTiros(py, z) {

        if (py + tiros.height < 0) {
            tirosNave.splice(z, 1);

        }



    }

}
window.addEventListener("keydown", (e) => {
    if (e.keyCode == 37 || e.keyCode == 39) {
        if (e.keyCode == 37) {
            nave.dx = -1;
            nave.dy = 0;

        }
        if (e.keyCode == 39) {
            nave.dx = 1;
            nave.dy = 0;

        }
        /*
        if (e.keyCode == 38) {
            nave.dx = 0;
            nave.dy = -1;
    
        }
        if (e.keyCode == 40) {
            nave.dx = 0;
            nave.dy = 1;
    
        }
    */
        nave.px += nave.vx * nave.dx
        // nave.py += nave.vy * nave.dy
    }

    if (e.keyCode == 32) {
        nave.tirar();

    }
});

desenharImagemFundo = () => {

    ctx.drawImage(espacoSideral, 0, 0, 500, 500)
}

desenharNave = () => {
    ctx.drawImage(naveImg, nave.px, nave.py, nave.width, nave.height)
}
desenharJogo = () => {

    desenharImagemFundo();
    desenharNave();
    nave.colisaoBordas();
    tiros.movimentarTiros();
    ovni.moverOvni();
    window.requestAnimationFrame(desenharJogo);
}
function placarJogo() {
    ovnisAbatidos++;
    document.querySelector("#placar>span").innerHTML = ovnisAbatidos.toString();
}

game = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ovnisAbatidos = parseInt(document.querySelector("#placar>span").innerHTML);
    desenharJogo();

}

window.addEventListener("load", game);