import { Scene } from 'phaser';

export class Lobby extends Scene
{
    constructor ()
    {
        super('Lobby');
    }

    create ()
    {
        this.add.image(580, 384, 'background').setScale(2);
    
        this.VSButton = this.add.image(580, 300, "VS").setInteractive().setScale(1).setVisible(true);
        this.VSButton.on('pointerover', () => {
            this.VSButton.setScale(0.97);
        });

        this.VSButton.on('pointerout', () => {
            this.VSButton.setScale(1);
        });

        this.VSButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        this.COPButton = this.add.image(600, 550, "COP").setInteractive().setScale(0.9).setVisible(true);
        this.COPButton.on('pointerover', () => {
            this.COPButton.setScale(0.87);
        });
        this.COPButton.on('pointerout', () => {
            this.COPButton.setScale(0.9);
        });

        this.COPButton.on('pointerdown', () => {
            this.scene.start('GameCo');
        });

    }
}
