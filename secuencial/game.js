//python3 -m http.server
var map, tiles, background, wall, platforms, player, cursors;

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
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('pj', { start: 0, end: 5 }), // Rango de fotogramas para la animación
        frameRate: 10, // Velocidad de reproducción en cuadros por segundo
        repeat: -1 // -1 para repetir la animación indefinidamente, 0 para no repetir
      });

    background.setCollisionByProperty({collides: true});
    platforms.setCollisionByExclusion([-1]);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player,background);
    platforms.forEachTile(tile => {
        if (tile.properties["OneWay"]) {
          tile.setCollision(false, false, true, false);
        }
     });
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    this.physics.world.collide(player, platforms);

    const { left, right, up } = cursors;
    
    if (left.isDown){
        player.setFlipX(true)
        player.setVelocityX(-150);
        //this.anims.play('walk', true); 
    }
    else if (right.isDown){
        player.setFlipX(false)
        player.setVelocityX(150); 
        //this.anims.play('walk', true);     
    }
    else{
        player.setVelocityX(0);
        //this.anims.stop();          
    }

    if (up.isDown && player.body.onFloor()){
        player.setVelocityY(-330);
    }
}