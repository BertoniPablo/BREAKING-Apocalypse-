import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {

        this.add.image(512, 384, 'background').setScale(2);

        this.add.text(600, 384, 'End Game', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        
        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
