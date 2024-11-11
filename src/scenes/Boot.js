import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.video('background', 'assets/bg.mp4');
    }

    create ()
    {
        const bgVideo = this.add.video(575, 394, 'background');
        bgVideo.setScale(0.9);  // Adjust the scale if needed
        bgVideo.play(true);      // Start the video with looping enabled
        bgVideo.setLoop(true);
        this.scene.start('Preloader');
    }
}
