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

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');

        this.load.image('langUSButton', 'langUS.png');
        this.load.image('langARButton', 'langAR.png');
        this.load.image('langFRButton', 'langFR.png');
        this.load.image('langITButton', 'langIT.png');
        this.load.image('langBRButton', 'langBR.png');

        this.load.image('playButton', 'play.png');
        this.load.image('background', 'bg.png');

        this.load.image('back', 'backboton.png');
        this.load.image('VS', 'versus.png');
        this.load.image('COP', 'coop.png');

        this.load.image ('mapa','mapacop.jpeg');
        

        this.load.spritesheet('P1-idle', 'player1-idle.png', {
            frameWidth: 130,
            frameHeight: 158,
        });
        this.load.spritesheet('P2-idle', 'player2-idle.png', {
            frameWidth: 130,
            frameHeight: 158,
        });

        this.load.spritesheet('player1','player1sprite.png', {
           frameWidth: 125,
           frameHeight: 158,
        });
        this.load.spritesheet('player2','player2sprite.png', {
            frameWidth: 125,
            frameHeight: 158,
        });
        

        this.load.spritesheet('blocks', 'spriteBLOQUES.png', {
            frameWidth: 113,
            frameHeight: 113,
        });

        this.load.spritesheet('spriteP1', 'sprite-sheetP1.png', {
            frameWidth:135,
            frameHeight: 158,
        });
        this.load.spritesheet('spriteP2', 'sprite-sheetP2.png', {
            frameWidth:136.3636,
            frameHeight: 158,
        });
    }

    create ()
    {
        //animaciones coop
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
