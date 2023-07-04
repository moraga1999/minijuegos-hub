// comando python para ejecutar web server: python -m http.server
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  autoCenter: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
  },
};

var game = new Phaser.Game(config);

var attempts = Phaser.Math.Between(5, 10);
var attemptsText;
var explanationText;
var victory;
var defeat;
var user = "Nicolas Rojas";
var score = 0; // 0=noValida ; 1=valida
var resetButton;
//var pass = "contraseña pepito"; //la matriz se mueve entera para poder mostrar cantraseña en una columna y la pass en la otra
var textList = [];
var currentIndex = 3;

// Genera una frase aleatoria incoherente
var phrases = [
  "Comp.info1 Led60Hrz",
  "Comp.info2 SSD2Tb",
  "Comp.info3 SO.Win10",
  "Comp.info4 AMD-6300",
  "Comp.info5 GPU-1050Ti",
  "Comp.info6 RAM-8GX4",
  "Contraseña pepito",
];

function preload() {
  this.load.image("fondo", "assets/Fondo.png");
  this.load.image("monitor", "assets/monitorGN.png");
  this.load.image("celularIngreso", "assets/celularIngreso.png");
  this.load.image("victoria", "assets/victoria.png");
  this.load.image("derrota", "assets/celularBloqueado.png");
  this.load.image("OtroIntento", "assets/celularIngresoFallido.png");
}

function create() {
  this.add.image(400, 250, "fondo");
  this.add.image(350, 400, "monitor");
  this.phoneEmpty = this.add.image(675, 450, "celularIngreso");

  explanationText = this.add.text(
    50,
    200,
    "kali@kali: encontrarContaseña -U Pepito -p resultados.txt\n Se encontro toda esta informacion en el archivo resultados.txt\n Dentro de la informacion cifrada esta la contraseña de pepito",
    {
      frontSize: "20px",
      fill: "#00913f",
      fontFamily: "verdana, arial, sans-serif",
    }
  );
  //creacion de texto
  for (var i = 0; i < 7; i++) {
    var phrase = phrases[i]; // Generar una frase aleatoria
    var textStyle = {
      fontSize: "20px",
      fontFamily: "Arial",
      color: "#00913f",
      lineSpacing: 0,
    };

    var text = this.add.text(50, 270 + i * 26, phrase, textStyle);
    textList.push(text);
  }
  updateTextStyles();

  //establecer el texto base para los intentos de validacion de clave
  attemptsText = this.add.text(16, 16, "Intentos: " + attempts, {
    // (x,y,text)
    frontSize: "20px",
    fill: "#fff",
    fontFamily: "verdana, arial, sans-serif",
  });
  /*
  resetButton = this.add
    .text(700, 10, "Reiniciar", { font: "24px Arial", fill: "#ffffff" })
    .setInteractive()
    .on("pointerdown", resetGame, this);
*/
  this.input.keyboard.on("keydown-ENTER", addAttempts, this);
  this.input.keyboard.on("keydown", handleKeyDown);

  this.victory = this.add.image(400, 300, "victoria");
  this.defeat = this.add.image(675, 450, "derrota");
  this.tryAnother = this.add.image(675, 450, "OtroIntento");

  //dejamos en no visibles las imagenes que no necesitemos ahora mismo
  this.victory.visible = false;
  this.defeat.visible = false;
  this.tryAnother.visible = false;
}

function update() {}

function handleKeyDown(event) {
  switch (event.code) {
    case "ArrowUp":
      moveListUp();
      break;
    case "ArrowDown":
      moveListDown();
      break;
    case "ArrowLeft":
      shiftPhrase(-1);
      break;
    case "ArrowRight":
      shiftPhrase(1);
      break;
  }
}

function addAttempts() {
  attempts--;
  attemptsText.setText("Intentos: " + attempts);
  score = Phaser.Math.Between(0, 15);

  this.time.delayedCall(200, upshot, [], this);
}

function upshot() {
  // si se acaban los intentos se muestra la derrota y no se puede jugar mas
  if (attempts == 0) {
    this.defeat.visible = true;
    this.time.delayedCall(
      2000,
      function () {
        this.defeat.visible = false;
      },
      [],
      this
    );
    this.input.keyboard.enabled = false;
  } else {
    // donde se valida que score sea 1, y si es asi muestra victoria y no se puede jugar mas
    if (textList[currentIndex].text === "Contraseña pepito") {
      this.victory.visible = true;
      this.time.delayedCall(
        750,
        function () {
          this.victory.visible = false;
        },
        [],
        this
      );
      this.input.keyboard.enabled = false;
    } else {
      this.tryAnother.visible = true;
      //this.defeat.visible = true;
      this.time.delayedCall(
        750,
        function () {
          this.tryAnother.visible = false;
        },
        [],
        this
      );
    }
  }
}

function resetGame() {
  // Restaurar el número de intentos
  attempts = Phaser.Math.Between(5, 10);
  attemptsText.setText("Intentos: " + attempts);

  // Habilitar la entrada del teclado
  this.input.keyboard.enabled = true;
}

function moveListUp() {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = textList.length - 1;
  }

  updateTextStyles();
}

function moveListDown() {
  currentIndex++;

  if (currentIndex >= textList.length) {
    currentIndex = 0;
  }

  updateTextStyles();
}

function updateTextStyles() {
  // Actualiza los estilos de los textos para resaltar el texto central
  textList.forEach(function (text, index) {
    var textStyle = {
      fontSize: "20px",
      fontFamily: "Arial",
      color: "#00913f",
      lineSpacing: 0,
    };

    // Resalta la frase central
    if (index === Math.floor(currentIndex)) {
      textStyle.backgroundColor = "#fff";
    } else {
      textStyle.backgroundColor = "transparent"; // Restablece el fondo transparente para las frases no seleccionadas
    }

    text.setStyle(textStyle);
  });
}

function shiftPhrase(shiftAmount) {
  console.log(currentIndex);
  var selectedText = textList[currentIndex];
  var originalText = selectedText._text; // Obtener el texto original sin cifrado
  //console.log(selectedText);
  console.log(originalText);
  var shiftedText = "";

  for (var i = 0; i < originalText.length; i++) {
    var charCode = originalText.charCodeAt(i);

    // Aplica el cifrado César al carácter
    if (charCode >= 65 && charCode <= 90) {
      // Mayúsculas
      charCode = ((charCode - 65 + shiftAmount + 26) % 26) + 65;
    } else if (charCode >= 97 && charCode <= 122) {
      // Minúsculas
      charCode = ((charCode - 97 + shiftAmount + 26) % 26) + 97;
    }

    shiftedText += String.fromCharCode(charCode);
  }

  selectedText.text = shiftedText;
  selectedText.originalText = shiftedText; // Actualizar el texto original sin cifrado
}
