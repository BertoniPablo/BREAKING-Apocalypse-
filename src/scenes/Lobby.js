import { Scene } from 'phaser';

export class Lobby extends Scene
{
    constructor ()
    {
        super('Lobby');
    }

    create ()
    {
        this.add.image(575, 394, 'bg-lob').setScale(1.02);
    
        this.VSButton = this.add.image(300, 385, "VS").setInteractive().setScale(1).setVisible(true);
        this.VSButton.on('pointerover', () => {
            this.VSButton.setScale(0.97);
        });
        this.VSButton.on('pointerout', () => {
            this.VSButton.setScale(1);
        });

        this.VSButton.on('pointerdown', () => {
            this.scene.start('Game');
            this.vsmusic = this.sound.add('musicaVS', {
                volume: 0.5 ,
                loop: true
            });
            this.vsmusic.play();
        });

        this.backButton = this.add.image(40,40, 'back').setInteractive().setScale(0.19).setVisible(true);
        this.backButton.on('pointerover', () => {
            this.backButton.setScale(0.18);
        });
        this.backButton.on('pointerout', () => {
            this.backButton.setScale(0.19);
        });

        this.backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        this.COPButton = this.add.image(900, 385, "COP").setInteractive().setScale(0.9).setVisible(true);
        this.COPButton.on('pointerover', () => {
            this.COPButton.setScale(0.87);
        });
        this.COPButton.on('pointerout', () => {
            this.COPButton.setScale(0.9);
        });

        this.COPButton.on('pointerdown', () => {
            this.scene.start('GameCo');
            this.copmusic = this.sound.add('musicaCOP', {
                volume: 0.5 ,
                loop: true
            });
            this.copmusic.play();
        });

    }
}
