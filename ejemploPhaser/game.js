// comando python para ejecutar web server: python3 -m http.server

// espacio en el cual establece la cinfiguracion inicial del juego
var config = {
  type: Phaser.AUTO,
  //el tamaño de la pantalla en la que se mostrara el jeugo
  width: 800,
  height: 600,
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

// se usa la configuracion ya creada para iniciar un juego
var game = new Phaser.Game(config);

// seccion en la que se hace una carga antes del inicio del juego a los assets
function preload() {
  this.load.image("sky", "assets/space3.png");
  this.load.image("logo", "assets/phaser3-logo.png");
  this.load.image("red", "assets/red.png");
}

//es el main del juego, responsable de establecer el entorno y preparar todo lo necesario para iniciar el juego de forma adecuada.
function create() {
  //al usar add.image, estas añadiendo la imagen "sky", definida en el preload, en las coordenadas 400 300 dentro del juego
  this.add.image(400, 300, "sky");

  //al usar add.particles, estan crando particulas que tendran la imagen de red textura
  var particles = this.add.particles("red");

  //luego crear emitter estas generando un punto desde el cual esas particulas antes creadas seran emitidas
  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  //physics.add.image lo que hace es darle fisicas a la imagen logo, esta fisica esta configurada en el config inicial, como la gravity
  //diciendo que la imagen por si sola caera o se movera en el eje y.
  var logo = this.physics.add.image(400, 100, "logo");

  //le asignas la velocidad en el eje x e y a la imagen
  logo.setVelocity(100, 200);
  //con esto dices que el posible rebotar, en una pared vertical u horizontal
  logo.setBounce(1, 1);
  //estableces los bordes de la imagen como una pared solida, en la que podra rebotar o chocar el logo
  logo.setCollideWorldBounds(true);

  //hacer que el logo al moverse emita las particulas antes definidas
  emitter.startFollow(logo);
}
