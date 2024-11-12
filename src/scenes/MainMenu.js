import { Scene } from 'phaser';
import { getPhrase, getTranslations } from '../Services/translations';

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
    
    init () {
        if (!this.inimusic || !this.inimusic.isPlaying) {
            this.inimusic = this.sound.add('inimusic', { volume: 0.5 , loop: true });
            this.inimusic.play();
        } else if (this.inimusic.isPaused) {
            this.inimusic.resume();
        }
        if (!this.menumusic || !this.menumusic.isPlaying) {
            this.menumusic = this.sound.add('menumusic', { volume: 0.5 , loop: true });
            this.menumusic.play();
        } else if (this.menumusic.isPaused) {
            this.menumusic.resume();
        }
    }
    create () {

        this.click = this.sound.add('clickbutton', { volume: 0.2 , loop: false });
        this.events.on('shutdown', () => {
            this.inimusic.pause();
        });

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
            this.click.play();
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
            this.click.play();
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
            this.click.play();
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
            this.click.play();
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
            this.click.play();
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
            this.click.play();
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
