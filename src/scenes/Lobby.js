import { Scene } from 'phaser';

export class Lobby extends Scene
{
    constructor ()
    {
        super('Lobby');
    }

    create () {
        this.add.image(575, 394, 'bg-lob').setScale(1.02);

        this.click = this.sound.add('clickbutton', { volume: 0.5 , loop: false });
        this.menumusic = this.sound.add('menumusic', { volume: 0.5 , loop: false });
        this.menumusic.play();

        this.VSButton = this.add.image(300, 385, "VS").setInteractive().setScale(1).setVisible(true);
        this.VSButton.on('pointerover', () => {
            this.VSButton.setScale(0.97);
        });
        this.VSButton.on('pointerout', () => {
            this.VSButton.setScale(1);
        });
        this.VSButton.on('pointerdown', () => {
            this.menumusic.pause();
            this.scene.start('Game');
            this.click.play();
          
        });

        this.COPButton = this.add.image(900, 385, "COP").setInteractive().setScale(0.9).setVisible(true);
        this.COPButton.on('pointerover', () => {
            this.COPButton.setScale(0.87);
        });
        this.COPButton.on('pointerout', () => {
            this.COPButton.setScale(0.9);
        });
        this.COPButton.on('pointerdown', () => {
            this.menumusic.pause();
            this.scene.start('GameCo');
            this.click.play();
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
            this.click.play();
        });

       
    }
}
