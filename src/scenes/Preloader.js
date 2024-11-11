import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload (){

        this.load.setPath('assets');
        this.load.image('logo', 'menu/logo.png');

        this.load.audio("vsmusic", "versus/towerdefense.wav");
        this.load.audio("copmusic", "cooperativo/apocalipsis.wav");
        this.load.audio('menumusic', 'menu/menumusica.mp3');
        this.load.audio('inimusic', 'menu/musicainicio.mp3');
        this.load.audio("clickbutton", "lobby/click.mp3");

        this.load.image('langUSButton', 'menu/langUS.png');
        this.load.image('langARButton', 'menu/langAR.png');
        this.load.image('langFRButton', 'menu/langFR.png');
        this.load.image('langALButton', 'menu/langAL.png');
        this.load.image('langBRButton', 'menu/langBR.png');

        this.load.image('playButton', 'menu/play.png');
        this.load.image('PA', 'versus/playagain.png');
        this.load.video('background', 'menu/bg.mp4');

        this.load.image('bg-lob', 'lobby/bg-lobby.png');
        this.load.image('back', 'lobby/backboton.png');
        this.load.image('VS', 'lobby/versus.png');
        this.load.image('COP', 'lobby/coop.png');
        
        
        this.load.image ('uixcop', 'cooperativo/uixCOP.png');
        this.load.image('uixcopCollision','cooperativo/collider.png');
        this.load.image('corazon', 'cooperativo/vida.png');
        

        this.load.image('bg-vs','versus/bgVS.jpeg');
        this.load.image ('uixvs', 'versus/uixVS.png');
        
        //cooperativo
        
        this.load.tilemapTiledJSON('mapa', 'mapa/mapacop.json');
        this.load.atlas('atlas_superficie', 'mapa/atlas_superficie.png', 'mapa/atlas_superficie.json', 64, 64);
        this.load.image('camino', 'mapa/camino.png', 64, 64);


        this.load.image('madera_','cooperativo/madera.png');
        this.load.image('piedra_','cooperativo/piedra.png');
        this.load.image('hierro_','cooperativo/hierro.png');


        this.load.image('cañon', 'cooperativo/cañon1.png');
        this.load.image('ballesta', 'cooperativo/ballesta1.png');
 

        //players
        this.load.spritesheet('P1-idle', 'cooperativo/player1-idle.png', {
            frameWidth: 130,
            frameHeight: 158,
        });
        this.load.spritesheet('P2-idle', 'cooperativo/player2-idle.png', {
            frameWidth: 130,
            frameHeight: 158,
        });

        this.load.spritesheet('player1','cooperativo/player1sprite.png', {
           frameWidth: 125,
           frameHeight: 158,
        });
        this.load.spritesheet('player2','cooperativo/player2sprite.png', {
            frameWidth: 125,
            frameHeight: 158,
        });

        //zombies
        this.load.spritesheet('zombie1', 'cooperativo/zombie1-Sheet.png', {
            frameWidth: 264,
            frameHeight: 390,
        });
        this.load.spritesheet('zombie2', 'cooperativo/zombie2-Sheet.png', {
            frameWidth: 125,
            frameHeight: 158,
        });
        this.load.spritesheet('zombie3','cooperativo/zombie3-Sheet.png', {
            frameWidth: 130,
            frameHeight: 170,
        });


        //versus
        this.load.spritesheet('blocks', 'versus/spriteBLOQUES.png', {
            frameWidth: 113,
            frameHeight: 113,
        });

        this.load.spritesheet('spriteP1', 'versus/sprite-sheetP1.png', {
            frameWidth:135,
            frameHeight: 158,
        });
        this.load.spritesheet('spriteP2', 'versus/sprite-sheetP2.png', {
            frameWidth:136.3636,
            frameHeight: 158,
        });
    }

    create (){
        //animaciones coop

        //pjs
        this.anims.create({
            key: 'p1_idle',
            frames: this.anims.generateFrameNumbers('P1-idle', { start: 0, end: 2 }),  
            frameRate: 5,
            repeat: -1 
            
        });   
        this.anims.create({
            key: "p1_walkleft", 
            frames: this.anims.generateFrameNumbers("player1", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "p1_walkup", 
            frames: this.anims.generateFrameNumbers("player1", {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "p1_walkright", 
            frames: this.anims.generateFrameNumbers("player1", {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "p1_walkdown", 
            frames: this.anims.generateFrameNumbers("player1", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        })

        this.anims.create({
            key: "p2_idle", 
            frames: this.anims.generateFrameNumbers("P2-idle", {start: 0, end: 2}),
            frameRate: 5,
            repeat: -1,
        })
        this.anims.create({
            key: "p2_walkleft", 
            frames: this.anims.generateFrameNumbers("player2", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "p2_walkup", 
            frames: this.anims.generateFrameNumbers("player2", {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "p2_walkright", 
            frames: this.anims.generateFrameNumbers("player2", {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "p2_walkdown", 
            frames: this.anims.generateFrameNumbers("player2", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        })
       
        //zombies
        this.anims.create({
            key: 'zombie1_walk',
            frames: this.anims.generateFrameNumbers('zombie1', {start: 0, end: 4}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'zombie2_walk',
            frames: this.anims.generateFrameNumbers('zombie2', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'zombie3_walk',
            frames: this.anims.generateFrameNumbers('zombie3', {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1,
        })

        //animaciones vs
         
        this.anims.create({
            key: "PJ1_pala", 
            frames: this.anims.generateFrameNumbers("spriteP1", {start: 8, end: 10}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_pala", 
            frames: this.anims.generateFrameNumbers("spriteP2", {start: 4, end: 6}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ1_pico", 
            frames: this.anims.generateFrameNumbers("spriteP1", {start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_pico", 
            frames: this.anims.generateFrameNumbers("spriteP2", {start: 7, end: 10}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ1_hacha", 
            frames: this.anims.generateFrameNumbers("spriteP1", {start: 4, end:7 }),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_hacha", 
            frames: this.anims.generateFrameNumbers("spriteP2", {start:0 , end:3 }),
            frameRate: 10,
            repeat: 0,
        })

        
        this.scene.start('MainMenu');
    }
}
