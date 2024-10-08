import { Scene } from 'phaser';

class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, player) {
        super(scene, x, y, 'blocks'); 

        this.scene = scene;
        this.player = player;
        this.type = type;

        let frame;
        switch (type) {
            case 'tierra':
                frame = 1; 
                this.keyremove = player === 1 ? 'a' : 'LEFT';
                break;
            case 'madera':
                frame = 0; 
                this.keyremove = player === 1 ? 'd' : 'RIGHT';
                break;
            case 'piedra':
                frame = 2; 
                this.keyremove = player === 1 ? 'w' : 'UP';
                break;
            default:
                frame = 0; 
                this.keyremove = '';
        }

        
        this.setFrame(frame);
        this.setPosition(x, y);
        this.setScale(0.5);

        
        this.scene.add.existing(this);

        
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
    }
    destroy() {
        super.destroy();
    }
}


export class Game extends Scene {

    constructor() {
        super('Game');
        this.player1 = {
            score: 0,
            controls: null,
            blocks: []
        };
        this.player2 = {
            score: 0,
            controls: null,
            blocks: []
        };
        this.timeLeft = 60; 
        this.margin = 19; //margen 
    }
    
    init(){
        this.timeLeft = 60
    }

    
    preload() {
        this.load.spritesheet('blocksheet', 'public/assets/spriteBLOQUES.png', {
            frameWidth: 113,
            frameHeight: 112,
        });
        this.load.spritesheet('spriteP1', 'public/assets/sprite-sheetP1.png', {
            frameWidth: 124,
            frameHeight: 158,
        });
        this.load.spritesheet('spriteP2', 'public/assets/sprite-sheetP2.png', {
            frameWidth: 124,
            frameHeight: 158,
        });
        
    }

    create() {
        
        this.add.image(580, 384, 'background').setScale(2);
        this.player1.sprite = this.add.sprite(300, 385, 'spriteP1').setScale(0.87); 
        this.player2.sprite = this.add.sprite(900, 385, 'spriteP2').setScale(0.87); 

    
        let blockTierra = new Block(this, 100, 200, 'tierra' );  
        let blockMadera = new Block(this, 200, 200, 'madera' );  
        let blockPiedra = new Block(this, 300, 200, 'piedra' );  
    
        const screenWidth = this.game.config.width;
        const halfScreenWidth = screenWidth / 2;

        const player1EndX = halfScreenWidth - this.margin / 2;
        const player2StartX = halfScreenWidth + this.margin / 2.5;

        this.createBlocksForPlayer(this.player1, 0, player1EndX, 1); 
        this.createBlocksForPlayer(this.player2, player2StartX, screenWidth, 2);

        //controles personalizados
        this.player1.controls = this.input.keyboard.addKeys({
            pala: 'A',  
            pico: 'W',  
            hacha: 'D'  
        });

        this.player2.controls = this.input.keyboard.addKeys({
            pala: 'LEFT',  
            pico: 'UP',    
            hacha: 'RIGHT' 
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
        
        this.physics.add.collider(this.player1.sprite, this.player1.blocks);
        this.physics.add.collider(this.player2.sprite, this.player2.blocks);

        // Colisiones con el límite inferior
        this.physics.world.setBounds(0, 0, screenWidth, this.game.config.height - 50);
    }

    createBlocksForPlayer(player, startX, endX, playerNumber) {
        player.blocks = [];
        const blockWidth = 50;
        const blockHeight = 50;
        const numCols = Math.floor((endX - startX) / blockWidth);
        const numRows = 5;
        const startY = this.game.config.height - (numRows * blockHeight);

        const blockTypes = ['tierra', 'madera', 'piedra'];

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const blockX = startX + col * blockWidth + blockWidth / 2;
                const blockY = startY + row * blockHeight;
                const blockType = blockTypes[Phaser.Math.Between(0, 2)];  //aleatoriamente el tipo de bloque
                const block = new Block(this, blockX, blockY, blockType, playerNumber);
                player.blocks.push(block); 
            }
        }
    }

    handleKeyPress(event) {
        // teclas para el jugador 1
        if (event.key === 'a') {
            this.handleBlockRemoval(this.player1, 'A');
            this.player1.sprite.play('PJ1_pala');
        } else if (event.key === 'w') {
            this.handleBlockRemoval(this.player1, 'W');
            this.player1.sprite.play('PJ1_pico');
        } else if (event.key === 'd') {
            this.handleBlockRemoval(this.player1, 'D');
            this.player1.sprite.play('PJ1_hacha');
        } else {
            this.player1.sprite.play('PJ1_idle');
        }
    
        // teclas para el jugador 2
        if (event.key === 'ArrowLeft') {
            this.handleBlockRemoval(this.player2, 'LEFT');
            this.player2.sprite.play('PJ2_pala');
        } else if (event.key === 'ArrowUp') {
            this.handleBlockRemoval(this.player2, 'UP');
            this.player2.sprite.play('PJ2_pico');
        } else if (event.key === 'ArrowRight') {
            this.handleBlockRemoval(this.player2, 'RIGHT');
            this.player2.sprite.play('PJ2_hacha');
        } else {
            this.player2.sprite.play('PJ2_idle');
        }
    }
    

    handleBlockRemoval(player, key) {
        let blockToRemove = player.blocks.find(block => block.keyremove === key);
        if (blockToRemove) {
            blockToRemove.destroy();
            player.blocks = player.blocks.filter(block => block !== blockToRemove);  // eliminar el bloque de la lista
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
