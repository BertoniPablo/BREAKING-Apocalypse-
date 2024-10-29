import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { Lobby } from './scenes/Lobby';
import { GameCo } from './scenes/GameCo';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1150,
    height: 800,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
     physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
    },
     scene: [
        Boot,
        Preloader,
        MainMenu,
        Lobby,
        GameCo,
        Game,
        GameOver
    ]
};

export default new Phaser.Game(config);
