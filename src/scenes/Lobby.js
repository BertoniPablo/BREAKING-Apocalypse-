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
    
        this.VSButton = this.add.image(580, 460, "VSButton").setInteractive().setScale(0.2).setVisible(true);
        this.VSButton.on('pointerover', () => {
            this.VSButton.setScale(0.19);
        });

        this.VSButton.on('pointerout', () => {
            this.VSButton.setScale(0.2);
        });

        this.VSButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        this.COPButton = this.add.image(620, 550, "COPButton").setInteractive().setScale(0.5).setVisible(true);
        this.COPButton.on('pointerover', () => {
            this.COPButton.setScale(0.49);
        });
        this.COPButton.on('pointerout', () => {
            this.COPButton.setScale(0.5);
        });

        this.COPButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

    }
}
