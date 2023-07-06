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
var pass = "";
var score = 0; // 0=noValida ; 1=valida
var resetButton;
var textList = [];
var currentIndex = 0;

// Genera una frase aleatoria incoherente
var phrases = [
  "SistemInfo Led144Hrz",
  "SistemInfo SSD2Tb",
  "SistemInfo SO.Win10",
  "SistemInfo AMD-6300",
  "SistemInfo GPU-1050Ti",
  "SistemInfo RAM-8GX4",
  "Contraseña pepito",
];

function preload() {
  this.load.image("fondo", "assets/Fondo.png");
  this.load.image("monitor", "assets/monitorGN.png");
  this.load.image("celularIngreso", "assets/celularIngreso.png");
  this.load.image("victoria", "assets/celularLogueado.png");
  this.load.image("derrota", "assets/celularBloqueado.png");
  this.load.image("OtroIntento", "assets/celularIngresoFallido.png");
}

function create() {
  this.add.image(400, 250, "fondo");
  this.add.image(350, 400, "monitor");
  this.phoneEmpty = this.add.image(675, 450, "celularIngreso");

  // cambiar el texto por instrucciones de uso, dejando el comando
  explanationText = this.add.text(
    50,
    200,
    "kali@kali: encontrarContaseña -U Pepito -p resultados.txt\n dentro de esta lista esta la contraseña de Pepito\n para encontrarla muevete entre ellas con arriba o abajo\n y con derecha o izq, podras hacer el cifrado de la palabra hasta encontrar\n la contraseña",
    {
      frontSize: "20px",
      fill: "#00913f",
      fontFamily: "verdana, arial, sans-serif",
    }
  );

  //Creacion de contraseña y cesar a toda la lista de phrases
  createPass();
  scramblePhrases();
  randomPhrases();

  //creacion de texto
  for (var i = 0; i < 7; i++) {
    var phrase = phrases[i]; // Generar una frase aleatoria
    var textStyle = {
      fontSize: "20px",
      fontFamily: "Arial",
      color: "#00913f",
      lineSpacing: 0,
    };

    var text = this.add.text(50, 300 + i * 26, phrase, textStyle);
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

  this.input.keyboard.on("keydown-ENTER", addAttempts, this);
  this.input.keyboard.on("keydown", handleKeyDown);

  this.victory = this.add.image(675, 450, "victoria");
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
    this.input.keyboard.enabled = false;
  } else {
    // donde se valida que score sea 1, y si es asi muestra victoria y no se puede jugar mas
    if (textList[currentIndex].text === pass) {
      this.victory.visible = true;
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

function createPass() {
  // Encontrar la frase "Contraseña pepito" y reemplazar la palabra "pepito" por una palabra aleatoria de longitud 6
  for (let i = 0; i < phrases.length; i++) {
    if (phrases[i] === "Contraseña pepito") {
      const nuevaPalabra = genRandomPhrase();
      phrases[i] = phrases[i].replace("pepito", nuevaPalabra);
      pass = phrases[i]; // Asignar la nueva frase modificada a la variable global
      break; // Terminar el bucle una vez que se ha encontrado y reemplazado la frase
    }
  }
}

// Función para generar una palabra alfanumérica aleatoria de longitud 6
function genRandomPhrase() {
  const caracteres =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let palabra = "";
  for (let i = 0; i < 6; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    palabra += caracteres.charAt(indice);
  }
  return palabra;
}

function scramblePhrases() {
  for (let i = phrases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
  }
}

function randomPhrases() {
  console.log("entramos");
  for (let i = 0; i < phrases.length; i++) {
    phrases[i] = cifrarCesar(phrases[i]);
  }
  currentIndex = 3;
}

// Función para cifrar una cadena en César con un número de desplazamientos aleatorio entre 1 y 10
function cifrarCesar(cadena) {
  const desplazamiento = Math.floor(Math.random() * 10) + 1;
  let resultado = "";
  for (let i = 0; i < cadena.length; i++) {
    let caracter = cadena[i];
    let codigoAscii = caracter.charCodeAt(0);
    let cifradoAscii = codigoAscii;

    if (codigoAscii >= 65 && codigoAscii <= 90) {
      // Letra mayúscula
      cifradoAscii = ((codigoAscii - 65 + desplazamiento) % 26) + 65;
    } else if (codigoAscii >= 97 && codigoAscii <= 122) {
      // Letra minúscula
      cifradoAscii = ((codigoAscii - 97 + desplazamiento) % 26) + 97;
    }

    const caracterCifrado = String.fromCharCode(cifradoAscii);
    resultado += caracterCifrado;
  }
  return resultado;
}
