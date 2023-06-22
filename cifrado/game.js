// comando python para ejecutar web server: python3 -m http.server
var config = {
  type: Phaser.AUTO,
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

var game = new Phaser.Game(config);

function preload() {
  this.load.image("fondo", "assets/Fondo.png");
  this.load.image("monitor", "assets/monitor.png");
  this.load.image("celular", "assets/celular.png");
  this.load.image("celularVacio", "assets/celularVacio.png");
  //this.load.image("sky", "assets/space3.png");
  //this.load.image("logo", "assets/phaser3-logo.png");
  //this.load.image("red", "assets/red.png");
}

function create() {
  //this.add.image(400, 300, "sky");
  this.add.image(400, 250, "fondo");
  this.add.image(260, 400, "monitor");
  this.phoneEmpty = this.add.image(675, 450, "celularVacio");
  this.phoneLoad = this.add.image(675, 450, "celular");

  this.phoneLoad.visible = false;

  this.isEnterPressed = false;
  this.input.keyboard.on("keydown-ENTER", () => {
    this.phoneLoad.visible = true;
    this.phoneEmpty.visible = false;
    this.isEnterPressed = true;
  });
  this.input.keyboard.on("keyup-ENTER", () => {
    this.phoneLoad.visible = false;
    this.phoneEmpty.visible = true;
    this.isEnterPressed = false;
  });

  /*var particles = this.add.particles("red");
  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  var logo = this.physics.add.image(400, 100, "logo");

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);**/
}
