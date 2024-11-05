import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(575, 394, 'background').setScale(1.02);
        this.add.image(850, 250, 'logo').setScale(2);
    
        this.playButton = this.add.image(850, 490, "playButton").setInteractive().setScale(0.2).setVisible(true);
        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.19);
        });
        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.2);
        });
        this.playButton.on('pointerdown', () => {
            this.scene.start('Lobby');
        });

        
        this.langARButton = this.add.image(40, 40, "langARButton").setInteractive().setScale(0.4).setVisible(true);
        this.langARButton.on('pointerover', () => {
            this.langARButton.setScale(0.38);
        });
        this.langARButton.on('pointerout', () => {
            this.langARButton.setScale(0.4);
        });

        this.langFRButton = this.add.image(100, 40, "langFRButton").setInteractive().setScale(0.36).setVisible(true);
        this.langFRButton.on('pointerover', () => {
            this.langFRButton.setScale(0.34);
        });
        this.langFRButton.on('pointerout', () => {
            this.langFRButton.setScale(0.36);
        });

        this.langUSButton = this.add.image(160, 40, "langUSButton").setInteractive().setScale(0.36).setVisible(true);
        this.langUSButton.on('pointerover', () => {
            this.langUSButton.setScale(0.34);
        });
        this.langUSButton.on('pointerout', () => {
            this.langUSButton.setScale(0.36);
        });

        this.langALButton = this.add.image(220, 40, "langALButton").setInteractive().setScale(0.36).setVisible(true);
        this.langALButton.on('pointerover', () => {
            this.langALButton.setScale(0.34);
        });
        this.langALButton.on('pointerout', () => {
            this.langALButton.setScale(0.36);
        });

        this.langBRButton = this.add.image(280, 40, "langBRButton").setInteractive().setScale(0.36).setVisible(true);
        this.langBRButton.on('pointerover', () => {
            this.langBRButton.setScale(0.34);
        });
        this.langBRButton.on('pointerout', () => {
            this.langBRButton.setScale(0.36);
        });
    }
}
