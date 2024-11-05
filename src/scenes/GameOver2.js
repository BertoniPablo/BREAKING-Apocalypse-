import { Scene } from 'phaser';

export class GameOver2 extends Scene
{
    constructor ()
    {
        super('GameOver2');
    }

    create (data)
    {

        this.add.image(575, 400, 'bg-lob').setScale(1);

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
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Lobby');

        });
    }
}
