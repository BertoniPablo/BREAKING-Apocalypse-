import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.player1 = {
            score: 0,
            controls: null,
            blocks: null,
        };
        this.player2 = {
            score: 0,
            controls: null,
            blocks: null,
        };
        this.timeLeft = 60; 
        this.margin = 19; //margen 
    }

    preload() {
        this.load.image("block", '/public/assets/cuadrado.png');
        this.load.image('backg', '/public/assets/fondo.jpg');
    }

    create() {
        
        this.add.image('block');
        this.add.image(560,500,'backg').setScale(2);

        const screenWidth = this.game.config.width;
        const halfScreenWidth = screenWidth / 2;

        const player1EndX = halfScreenWidth - this.margin / 2;
        const player2StartX = halfScreenWidth + this.margin / 2.5;

        this.createBlocksForPlayer(this.player1, 0, player1EndX); 
        this.createBlocksForPlayer(this.player2, player2StartX, screenWidth); 

        //controles personalizados
        this.player1.controls = this.input.keyboard.addKeys({
            PALA: 'A',  
            PICO: 'W',  
            HACHA: 'D'  
        });

        this.player2.controls = this.input.keyboard.addKeys({
            PALA: 'LEFT',  
            PICO: 'UP',    
            HACHA: 'RIGHT' 
        });

       
        this.player1.scoreText = this.add.text(10, 10, `Score P1: ${this.player1.score}`, { fontSize: '32px', fill: '#ffffff' });
        this.player2.scoreText = this.add.text(this.game.config.width - 260, 10, `Score P2: ${this.player2.score}`, { fontSize: '32px', fill: '#ffffff' });

        
        this.timerText = this.add.text(500, 10, `Time: ${this.timeLeft}`, { fontSize: '32px', fill: '#ffffff' });
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        //eventos de teclado
        this.input.keyboard.on('keydown', (event) => {
            this.handleKeyPress(event);
        });
    }

    createBlocksForPlayer(player, startX, endX) {
        player.blocks = this.physics.add.staticGroup();
        const blockWidth = 95;
        const blockHeight = 40;
        const numCols = Math.floor((endX - startX) / blockWidth);
        const numRows = 5;
        const startY = this.game.config.height - (numRows * blockHeight); 

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let blockX = startX + col * blockWidth + blockWidth / 1;
                let blockY = startY + row * blockHeight;
                player.blocks.create(blockX, blockY, 'block').setScale(0.5).refreshBody();
            }
        }
    }

    handleKeyPress(event) {
        //teclas para el jugador 1
        if (event.key === 'a') {
            this.handleBlockRemoval(this.player1, 'pala');
        } else if (event.key === 'w') {
            this.handleBlockRemoval(this.player1, 'pico');
        } else if (event.key === 'd') {
            this.handleBlockRemoval(this.player1, 'hacha');
        }

        //teclas para el jugador 2
        if (event.key === 'ArrowLeft') {
            this.handleBlockRemoval(this.player2, 'pala');
        } else if (event.key === 'ArrowUp') {
            this.handleBlockRemoval(this.player2, 'pico');
        } else if (event.key === 'ArrowRight') {
            this.handleBlockRemoval(this.player2, 'hacha');
        }
    }

    handleBlockRemoval(player, tool) {
        let block = player.blocks.getFirstAlive(); //obtener el primer bloque "vivo"
        if (block) {
            block.destroy();
            player.score += 10;
            player.scoreText.setText(`Score P${player === this.player1 ? 1 : 2}: ${player.score}`);
        }
    }

    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
            this.timerEvent.remove();
            this.scene.start('GameOver');
        }
    }

    update() {
       //
    }
}
