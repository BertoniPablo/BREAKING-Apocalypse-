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

        this.load.image('VS', 'versus.png');
        this.load.image('COP', 'coop.png');

        this.load.spritesheet('blocks', 'spriteBLOQUES.png', {
            frameWidth: 113,
            frameHeight: 113,
        });

        this.load.spritesheet('spriteP1', 'sprite-sheetP1.png', {
            frameWidth:122.77778,
            frameHeight: 158,
        });
        this.load.spritesheet('spriteP2', 'sprite-sheetP2.png', {
            frameWidth:122.77778,
            frameHeight: 158,
        });
    }

    create ()
    {
        //animación estática
        this.anims.create({
            key: 'PJ1_idle',
            frames: [{ key: 'spriteP1', frame: 8 }],  
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'PJ2_idle',
            frames: [{ key: 'spriteP2', frame: 0 }],  
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "PJ1_pala", 
            frames: this.anims.generateFrameNumbers("spriteP1", {start: 6, end: 7}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_pala", 
            frames: this.anims.generateFrameNumbers("spriteP2", {start: 4, end: 5}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ1_pico", 
            frames: this.anims.generateFrameNumbers("spriteP1", {start: 0, end: 2 }),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_pico", 
            frames: this.anims.generateFrameNumbers("spriteP2", {start: 6, end: 8}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ1_hacha", 
            frames: this.anims.generateFrameNumbers("spriteP1", {start: 3, end:5 }),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_hacha", 
            frames: this.anims.generateFrameNumbers("spriteP2", {start:1 , end:3 }),
            frameRate: 10,
            repeat: 0,
        })

        
        this.scene.start('MainMenu');
    }
}
