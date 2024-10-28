import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(575, 400, 'background').setScale(1.7);
        this.add.image(580, 300, 'logo').setScale(1.5);
    
        this.playButton = this.add.image(580, 460, "playButton").setInteractive().setScale(0.2).setVisible(true);
        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.19);
        });

        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.2);
        });

        this.playButton.on('pointerdown', () => {
            this.scene.start('Lobby');
        });

        this.langUSButton = this.add.image(620, 550, "langUSButton").setInteractive().setScale(0.5).setVisible(true);
        this.langUSButton.on('pointerover', () => {
            this.langUSButton.setScale(0.49);
        });
        this.langUSButton.on('pointerout', () => {
            this.langUSButton.setScale(0.5);
        });

        this.langARButton = this.add.image(460, 550, "langARButton").setInteractive().setScale(0.125).setVisible(true);
        this.langARButton.on('pointerover', () => {
            this.langARButton.setScale(0.117);
        });
        this.langARButton.on('pointerout', () => {
            this.langARButton.setScale(0.125);
        });

        this.langFRButton = this.add.image(540, 550, "langFRButton").setInteractive().setScale(0.187).setVisible(true);
        this.langFRButton.on('pointerover', () => {
            this.langFRButton.setScale(0.179);
        });
        this.langFRButton.on('pointerout', () => {
            this.langFRButton.setScale(0.187);
        });

        this.langALButton = this.add.image(700, 550, "langALButton").setInteractive().setScale(0.125).setVisible(true);
        this.langALButton.on('pointerover', () => {
            this.langALButton.setScale(0.119);
        });
        this.langALButton.on('pointerout', () => {
            this.langALButton.setScale(0.125);
        });

        this.langBRButton = this.add.image(580, 630, "langBRButton").setInteractive().setScale(0.187).setVisible(true);
        this.langBRButton.on('pointerover', () => {
            this.langBRButton.setScale(0.179);
        });
        this.langBRButton.on('pointerout', () => {
            this.langBRButton.setScale(0.187);
        });
    }
}
