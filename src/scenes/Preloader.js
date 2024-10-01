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
        this.load.image ('block', 'cuadrado.png');
        this.load.image('logo', 'logo.png');
        this.load.image('langButton', 'lang.png');
        this.load.image('playButton', 'play.png');
        this.load.image('background', 'fondo.jpg');
        this.load.spritesheet('spritePP', 'sprite-sheet.png', {
            frameWidth: 166.6667,
            frameHeight: 158,
        });
    }

    create ()
    {
        
        //animación estática
        this.anims.create({
            key: 'PJ1_idle',
            frames: [{ key: 'spritePP', frame: 8 }],  
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'PJ2_idle',
            frames: [{ key: 'spritePP', frame: 9 }],  
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "PJ1_pala", 
            frames: this.anims.generateFrameNumbers("spritePP", {start: 6, end: 7}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_pala", 
            frames: this.anims.generateFrameNumbers("spritePP", {start: 13, end: 15}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ1_pico", 
            frames: this.anims.generateFrameNumbers("spritePP", {start: 0, end: 2 }),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_pico", 
            frames: this.anims.generateFrameNumbers("spritePP", {start: 16, end: 18}),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ1_hacha", 
            frames: this.anims.generateFrameNumbers("spritePP", {start: 3, end:5 }),
            frameRate: 10,
            repeat: 0,
        })
        this.anims.create({
            key: "PJ2_hacha", 
            frames: this.anims.generateFrameNumbers("spritePP", {start:10 , end:12 }),
            frameRate: 10,
            repeat: 0,
        })

        
        this.scene.start('MainMenu');
    }
}
