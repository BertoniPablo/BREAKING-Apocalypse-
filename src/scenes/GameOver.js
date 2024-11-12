import { Scene } from 'phaser';
import { getPhrase } from '../Services/translations';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create (data)
    {
        this.add.image(575, 400, 'bg-lob').setScale(1);
        this.click = this.sound.add('clickbutton', { volume: 0.5 , loop: false });

        this.add.text(600, 200, getPhrase ('End Game'), {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        //puntaje p1        
        this.add.text(600, 600, `${getPhrase('Score P1')}: ${data.scoreP1}`, {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        //puntaje de p2
        this.add.text(600, 650, `${getPhrase('Score P2')}: ${data.scoreP2}`, {
            fontFamily: 'Arial Black', 
            fontSize: 36, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);


        this.add.text(600, 300, `${(data.winner)}`, {
            fontFamily: 'Arial Black', 
            fontSize: 56, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.PlayAButton = this.add.image(600, 400, "PA").setInteractive().setScale(0.2).setVisible(true);
        this.PlayAButton.on('pointerover', () => {
            this.PlayAButton.setScale(0.19);
        });
        this.PlayAButton.on('pointerout', () => {
            this.PlayAButton.setScale(0.2);
        });
        this.PlayAButton.on('pointerdown', () => {
            this.scene.start('Game');
            this.click.play();
            
        });

        this.BackmenuButton = this.add.image(600, 480, "BM").setInteractive().setScale(0.2).setVisible(true);
        this.BackmenuButton.on('pointerover', () => {
            this.BackmenuButton.setScale(0.19);
        });
        this.BackmenuButton.on('pointerout', () => {
            this.BackmenuButton.setScale(0.2);
        });
        this.BackmenuButton.on('pointerdown', () => {
            this.scene.start('Lobby');
            this.click.play();
            
        });


    }

}
