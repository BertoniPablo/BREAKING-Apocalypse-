import { Scene } from 'phaser';
import { getPhrase } from '../Services/translation';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create (data)
    {
        this.add.image(575, 400, 'bg-lob').setScale(1);

        this.add.text(600, 200, ('End Game'), {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        //puntaje p1        
        this.add.text(600, 500, `${('Score P1')}: ${data.scoreP1}`, {
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        //puntaje de p2
        this.add.text(600, 550, `${('Score P2')}: ${data.scoreP2}`, {
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);


        this.add.text(600, 400, `${(data.winner)}`, {
            fontFamily: 'Arial Black', 
            fontSize: 56, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.PlayAButton = this.add.image(600, 300, "PA").setInteractive().setScale(0.2).setVisible(true);
        this.PlayAButton.on('pointerover', () => {
            this.PlayAButton.setScale(0.19);
        });
        this.PlayAButton.on('pointerout', () => {
            this.PlayAButton.setScale(0.2);
        });
        this.PlayAButton.on('pointerdown', () => {
            this.scene.start('Game');
            this.vsmusic.play();
            this.clickbutton.play();
        });

    }

    getPhrase(key) {
        return this.translationService.translations['en'][key] || key;
    }
    
    updateLanguage(languageCode) {
        this.translationService.translate(languageCode).then((translations) => {
            this.applyTranslations(translations);
        });
    }

    applyTranslations(translations) {
        this.children.each((child) => {
            if (child.text) {
                const key = child.text; // Asume que el texto es el mismo que la clave
                if (translations[key]) {
                    child.setText(translations[key]);
                }
            }
        });
    }
}
