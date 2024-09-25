import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.blocks; //matriz de bloques
        this.keyA; // para eliminar bloques
        this.score = 0; 
        this.timeLeft = 60; 
    }

    preload() {
        this.load.image("block", '.public/assets/cuadrado.png'); 
        this.load
    }

    create() {
    
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        
        this.createBlocksAtBottom();//matriz de bloques en la parte inferior de la pantalla

        this.timerText = this.add.text(10, 50, `Time: ${this.timeLeft}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }); 

        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        });

        this.timerEvent = this.time.addEvent({
            delay: 1000,                
            callback: this.updateTimer, 
            callbackScope: this,
            loop: true                  
        });
        

        this.input.keyboard.on('keydown-A', () => {
            this.removeBlock();
        });
    }

    createBlocksAtBottom() {
        this.blocks = this.physics.add.staticGroup();
        
        const screenWidth = this.game.config.width;
        const screenHeight = this.game.config.height;

        const blockWidth = 95; 
        const blockHeight = 40; 

        const numCols = Math.floor(screenWidth / blockWidth);
        const numRows = 5; 

       
        const startY = screenHeight - (numRows * blockHeight); 
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let blockX = col * blockWidth + blockWidth / 2;
                let blockY = startY + row * blockHeight;
                this.blocks.create(blockX, blockY, 'block').setScale(0.5).refreshBody();
            }
        }
    }

    removeBlock() {
        let block = this.blocks.getFirstAlive(); //primer bloque vivo del grupo

        if (block) {
            block.destroy(); 
            
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
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
        
    }
}


