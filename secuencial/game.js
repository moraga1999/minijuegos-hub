// comando python para ejecutar web server: python3 -m http.server

function preload ()
{
    this.load.image('tiles','assets/tileset.png')
    this.load.tilemapTiledJSON('map','assets/map.json')
}

function create ()
{
    const map = this.make.tilemap({ key: 'map' });
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    const tiles = map.addTilesetImage('tileset', 'tiles');
    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    const layer = map.createLayer('background', tiles, 0, 0);
}

var config = {
    type: Phaser.AUTO,
    width: 16*48,
    height: 14*48,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);