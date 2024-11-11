import { Scene } from 'phaser';
import { getPhrase, getTranslations } from '../Services/translation';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
        this.posicionp1 = { x: 300, y: 700 };
        this.posicionp2 = { x: 600, y: 650 };
        this.player1 = this.p1
        this.player2 = this.p2
    }

    create () {
        
        this.inimusic = this.sound.add('inimusic', {
            volume: 0.5 ,
        });
        this.menumusic = this.sound.add('menumusic', {
            volume: 1 ,
            loop: true,
        });
        this.clickbutton = this.sound.add('clickbutton', {
            volume: 0.2 ,
        });

        this.menumusic.play();
        this.inimusic.play();

        const bgVideo = this.add.video(575, 375, 'background');
        bgVideo.setScale(0.8);  
        bgVideo.play(true);      
        bgVideo.setLoop(true);
        this.add.image(850, 250, 'logo').setScale(1.8);

        this.p1 = this.physics.add.sprite(this.posicionp1.x, this.posicionp1.y, 'player1').setScale(0.8);
        this.p2 = this.physics.add.sprite(this.posicionp2.x, this.posicionp2.y, 'player2').setScale(0.8);
        
        this.playButton = this.add.image(850, 490, "playButton").setInteractive().setScale(0.2).setVisible(true);
        this.playButton.on('pointerover', () => {
            this.playButton.setScale(0.19);
            
        });
        this.playButton.on('pointerout', () => {
            this.playButton.setScale(0.2);
        });
        this.playButton.on('pointerdown', () => {
            this.scene.start('Lobby');
            this.clickbutton.play();
            this.inimusic.pause();
        })
        
        this.langARButton = this.add.image(40, 40, "langARButton").setInteractive().setScale(0.4).setVisible(true);
        this.langARButton.on('pointerover', () => {
            this.langARButton.setScale(0.38);
            
        });
        this.langARButton.on('pointerout', () => {
            this.langARButton.setScale(0.4);
        });
        this.langARButton.on('pointerdown', () => {
            this.changeLanguage('es-AR');
            this.clickbutton.play();
        });

        this.langFRButton = this.add.image(100, 40, "langFRButton").setInteractive().setScale(0.36).setVisible(true);
        this.langFRButton.on('pointerover', () => {
            this.langFRButton.setScale(0.34);
            
        });
        this.langFRButton.on('pointerout', () => {
            this.langFRButton.setScale(0.36);
        });
        this.langFRButton.on('pointerdown', () => {
            this.changeLanguage('fr-FR');
            this.clickbutton.play();
        });

        this.langUSButton = this.add.image(160, 40, "langUSButton").setInteractive().setScale(0.36).setVisible(true);
        this.langUSButton.on('pointerover', () => {
            this.langUSButton.setScale(0.34);
            
        });
        this.langUSButton.on('pointerout', () => {
            this.langUSButton.setScale(0.36);
        });
        this.langUSButton.on('pointerdown', () => {
            this.changeLanguage('en-US');
            this.clickbutton.play();
        });

        this.langALButton = this.add.image(220, 40, "langALButton").setInteractive().setScale(0.36).setVisible(true);
        this.langALButton.on('pointerover', () => {
            this.langALButton.setScale(0.34);
            
        });
        this.langALButton.on('pointerout', () => {
            this.langALButton.setScale(0.36);
        });
        this.langALButton.on('pointerdown', () => {
            this.changeLanguage('al-AL');
            this.clickbutton.play();
        });

        this.langBRButton = this.add.image(280, 40, "langBRButton").setInteractive().setScale(0.36).setVisible(true);
        this.langBRButton.on('pointerover', () => {
            this.langBRButton.setScale(0.34);
            
        });
        this.langBRButton.on('pointerout', () => {
            this.langBRButton.setScale(0.36);
        });
        this.langBRButton.on('pointerdown', () => {
            this.changeLanguage('pt-BR');
            this.clickbutton.play();
        });
    }

    changeLanguage(lang) {
        getTranslations(lang, () => {
            // Aquí puedes recargar o aplicar las traducciones como se necesite
            console.log(`Idioma cambiado a ${lang}`);
            // Recargar los textos visibles en la escena con las traducciones
            // Por ejemplo: this.playButton.setText(getPhrase('play'));
        });
    }

    update(){

        let isP1Moving = false;

        if (!isP1Moving) {
            this.p1.anims.play('p1_idle', true);  //repite idle
        }

         let isP2Moving = false;
        if (!isP2Moving) {
            this.p2.anims.play('p2_idle', true);  //repite idle
        }
    }
}
