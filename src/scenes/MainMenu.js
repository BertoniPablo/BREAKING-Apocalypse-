import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(580, 384, 'background').setScale(2);
        this.add.image(580, 300, 'logo').setScale(1.5);
    
        this.playButton = this.add.image(580, 460, "playButton").setInteractive().setScale(0.2).setVisible(true);
        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.19);
        });

        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.2);
        });

        this.playButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        this.langButton = this.add.image(580, 550, "langButton").setInteractive().setScale(0.5).setVisible(true);
        this.langButton.on('pointerover', () => {
            this.langButton.setScale(0.49);
        });

        this.langButton.on('pointerout', () => {
            this.langButton.setScale(0.5);
        });

    }
}
