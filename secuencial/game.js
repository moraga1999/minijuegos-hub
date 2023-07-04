//python3 -m http.server
var map, tiles, background, wall, platforms, player;
var btn1, btn2, btn3, btn4, btn5, btn6, btn7;
var instructions = [];
var groupSprites;
var runFlag = false;
var actions = [false, false , false];

var sceneConfig = {
    key: 'main',
    preload: preload,
    create: create,
    update: update
};

var gameConfig = {
    type: Phaser.AUTO,
    width: 24*48,
    height: 18*48,
    pixelArt: true,
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    },
    scene: sceneConfig
};

var game = new Phaser.Game(gameConfig);

function preload() {
    this.load.image('button', 'assets/btn.png');
    this.load.image('act1', 'assets/act1.png');
    this.load.image('act2', 'assets/act2.png');
    this.load.image('act3', 'assets/act3.png');
    this.load.image('act4', 'assets/act4.png');
    this.load.image('act5', 'assets/act5.png');
    this.load.image('buttonred', 'assets/btnred.png');
    this.load.image('buttongreen', 'assets/btngreen.png');
    this.load.image('tiles','assets/tileset.png');
    this.load.tilemapTiledJSON('map','map.json');
    this.load.image('player', 'assets/pj.png');
    this.load.spritesheet('pj', 'assets/pjspritesheet.png', {frameWidth: 21, frameHeight: 27});
}

function create() {
    map = this.make.tilemap({ key: 'map', tileWidth: 48, tileHeight: 48 });
    tiles = map.addTilesetImage('tileset', 'tiles');
    background = map.createLayer('background', tiles, 0, 0);
    wall = map.createLayer('wall', tiles, 0 ,0);
    platforms = map.createLayer('platforms', tiles, 0, 0);
    player = this.physics.add.sprite(400, 300, 'player');
    player.setScale(2,2);

    groupSprites = this.add.group({setScale: { x: 0.5, y: 0.5}});
    player.setCollideWorldBounds(true);

    background.setCollisionByProperty({collides: true});
    platforms.setCollisionByExclusion([-1]);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player,background);
    this.physics.add.collider(player, btn1, null, null, this);
    platforms.forEachTile(tile => {
        if (tile.properties["OneWay"]) {
          tile.setCollision(false, false, true, false);
        }
     });
    //BOTONES
    btn1 = this.add.sprite(1030, 150, 'button');
    btn1.setScale(0.5,0.5);
    this.add.text(940, 130, '1', { fontFamily: 'Arial', fontSize: '34px', fill: '#000000' });
    this.add.text(980, 125, 'MOVER', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    this.add.text(980, 150, 'IZQUIERDA', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    btn1.setInteractive();
    btn1.on('pointerdown', moveLeft, this);

    btn2 = this.add.sprite(1030, 250, 'button');
    btn2.setScale(0.5,0.5);
    this.add.text(940, 230, '2', { fontFamily: 'Arial', fontSize: '34px', fill: '#000000' });
    this.add.text(980, 225, 'MOVER', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    this.add.text(980, 250, 'DERECHA', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    btn2.setInteractive();
    btn2.on('pointerdown', moveRight, this);

    btn3 = this.add.sprite(1030, 350, 'button');
    btn3.setScale(0.5,0.5);
    this.add.text(940, 330, '3', { fontFamily: 'Arial', fontSize: '34px', fill: '#000000' });
    this.add.text(980, 325, 'SALTAR', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    this.add.text(980, 350, 'ARRIBA', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    btn3.setInteractive();
    btn3.on('pointerdown', jumpUp, this);

    btn4 = this.add.sprite(1030, 450, 'button');
    btn4.setScale(0.5,0.5);
    this.add.text(940, 430, '4', { fontFamily: 'Arial', fontSize: '34px', fill: '#000000' });
    this.add.text(980, 425, 'SALTAR', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    this.add.text(980, 450, 'IZQUIERDA', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    btn4.setInteractive();
    btn4.on('pointerdown', jumpLeft, this);

    btn5 = this.add.sprite(1030, 550, 'button');
    btn5.setScale(0.5,0.5);
    this.add.text(940, 530, '5', { fontFamily: 'Arial', fontSize: '34px', fill: '#000000' });
    this.add.text(980, 525, 'SALTAR', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    this.add.text(980, 550, 'DERECHA', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    btn5.setInteractive();
    btn5.on('pointerdown', jumpRight, this);

    btn6 = this.add.sprite(1030, 720, 'buttongreen');
    btn6.setScale(0.4,0.4);
    this.add.text(965, 705, 'EJECUTAR', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    btn6.setInteractive();
    btn6.on('pointerdown', runInstructions, this);

    btn7 = this.add.sprite(1030, 800, 'buttonred');
    btn7.setScale(0.4,0.4);
    this.add.text(970, 785, 'ELIMINAR', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' });
    btn7.setInteractive();
    btn7.on('pointerdown', deleteInstructions, this);
}

function update() {
    this.physics.world.collide(player, platforms);
    groupSprites.children.iterate((child) => {
        child.setScale(0.5, 0.5);
      });    
    if (actions[0]){
        player.setFlipX(true);
        player.setVelocityX(-150);
    }
    else if (actions[1]){
        player.setFlipX(false);
        player.setVelocityX(150); 
    }
    else{
        player.setVelocityX(0);
    }
    if (actions[2] && player.body.onFloor()){
        player.setVelocityY(-330);
    }
}

function moveLeft() {
    if (instructions.length < 8) {
        let x = 100 + instructions.length * 100;
        instructions.push(1);
        groupSprites.create(x, 780, 'act1');
        console.log(instructions);
    }else{
        console.log("length full!")
    }
}
function moveRight() {
    if (instructions.length < 8) {
        let x = 100 + instructions.length * 100;
        instructions.push(2);
        groupSprites.create(x, 780, 'act2');
        console.log(instructions);
    }else{
        console.log("length full!")
    }
}
function jumpUp() {
    if (instructions.length < 8) {
        let x = 100 + instructions.length * 100;
        instructions.push(3);
        groupSprites.create(x, 780, 'act3');
        console.log(instructions);
    }else{
        console.log("length full!")
    }
}
function jumpLeft() {
    if (instructions.length < 8) {
        let x = 100 + instructions.length * 100;
        instructions.push(4);
        groupSprites.create(x, 780, 'act4');
        console.log(instructions);
    }else{
        console.log("length full!")
    }
}
function jumpRight() {
    if (instructions.length < 8) {
        let x = 100 + instructions.length * 100;
        instructions.push(5);
        groupSprites.create(x, 780, 'act5');
        console.log(instructions);
    }else{
        console.log("length full!")
    }
}
function runInstructions(){
    console.log("running..");
    executeInstruction(0);
}
function deleteInstructions() {
    console.log("instructions deleted")
    instructions= [];
    groupSprites.clear(true)
}
function executeInstruction(index) {
    if (index > 0) {
        //debemos borrar elemento de group anterior, ya que su bloque termino
        let child = groupSprites.getFirstAlive();
        groupSprites.remove(child, true, true);
        child.destroy();
    }
    //inicializar actions, ya que finalizaron actions anteriores
    actions = [false, false , false];
    //fijar actions
    if(index < instructions.length){
        switch (instructions[index]) {
            //activar actions según el caso
            case 1:
                //mover izquierda
                actions[0]= true;
                break;
            case 2:
                //mover derecha
                actions[1]= true;
                break;
            case 3:
                //saltar arriba
                actions[2]= true;
                break;
            case 4:
                //saltar izquierda
                actions[0]= true;
                actions[2]= true;
                break;
            case 5:
                //saltar derecha
                actions[1]= true;
                actions[2]= true;
                break;
            default:
                break;
        }
    }
    if (index + 1 <= instructions.length) {
        // Después de un segundo, ejecutar el siguiente bloque
        const context = this; // Guardar el contexto actual en una variable
        setTimeout(function() {
            executeInstruction.call(context, index + 1);
        }, 1000);
    } else {
        // Fin de la ejecución
        instructions = [];
    }
}

