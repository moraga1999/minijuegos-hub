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
    width: 16*48,
    height: 14*48,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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
}

function create() {
    map = this.make.tilemap({ key: 'map', tileWidth: 48, tileHeight: 48 });
    tiles = map.addTilesetImage('tileset', 'tiles');
    background = map.createLayer('background', tiles, 0, 0);
    wall = map.createLayer('wall', tiles, 0 ,0);
    platforms = map.createLayer('platforms', tiles, 0, 0);

    player = this.physics.add.sprite(400, 300, 'player')
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(2,2);
    platforms.setCollisionByExclusion([-1]);
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    this.physics.world.collide(player, platforms);

    const { left, right, up } = cursors;
    
    if (left.isDown){
        player.setFlipX(true)
        player.setVelocityX(-100);
        //this.anims.play('walk', true); 
    }
    else if (right.isDown){
        player.setFlipX(false)
        player.setVelocityX(100); 
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