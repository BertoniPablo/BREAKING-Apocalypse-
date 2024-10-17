import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create (data)
    {

        this.add.image(512, 384, 'background').setScale(2);

        this.add.text(600, 300, 'End Game', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        //puntaje p1        
        this.add.text(600, 500, `Score P1: ${data.scoreP1}`, {
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        //puntaje de p2
        this.add.text(600, 550, `Score P2: ${data.scoreP2}`, {
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);


        this.add.text(600, 400, `${data.winner}`, {
            fontFamily: 'Arial Black', 
            fontSize: 56, 
            color: '#FFD700',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
