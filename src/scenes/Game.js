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
        this.scene.physics.add.existing(this, true); //blocks estáticos
        
        
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
        this.timeLeft = 10; 
        this.margin = 19; //margen 
    }
    
    init() {
        this.timeLeft = 10;
        this.player1 = {
            score: 0,
        }
        this.player2 = {
            score: 0,
        }
    }

    create() {

        this.add.image(580, 384, 'background').setScale(2);
        this.player1.sprite = this.physics.add.sprite(300, 385, 'spriteP1').setScale(0.87);
        this.player2.sprite = this.physics.add.sprite(900, 385, 'spriteP2').setScale(0.87);

        //comportamientos players
        
        this.player1.sprite.setCollideWorldBounds(true);
        this.player2.sprite.setCollideWorldBounds(true);

        this.player1.sprite.body.setGravityY(400); 
        this.player2.sprite.body.setGravityY(400); 
    
        const screenWidth = this.game.config.width;
        const halfScreenWidth = screenWidth / 2;

        const player1EndX = halfScreenWidth - this.margin / 2;
        const player2StartX = halfScreenWidth + this.margin / 2.5;

        this.createBlocksForPlayer(this.player1, 0, player1EndX, 1);
        this.createBlocksForPlayer(this.player2, player2StartX, screenWidth, 2);

        this.setColliders();
        
        //controles perso
        this.player1.controls = this.input.keyboard.addKeys({
            pala: 'a',  
            pico: 'w',  
            hacha: 'd',  
            jump: 'SPACE'
        });
        this.player2.controls = this.input.keyboard.addKeys({
            pala: 'LEFT',  
            pico: 'UP',    
            hacha: 'RIGHT',
            jump: 'SHIFT' 
        });

       
        this.player1.scoreText = this.add.text(10, 10, `Score P1: ${this.player1.score}`, { fontSize: '32px', fill: '#ffffff' });
        this.player2.scoreText = this.add.text(this.game.config.width - 270, 10, `Score P2: ${this.player2.score}`, { fontSize: '32px', fill: '#ffffff' });

        this.timerText = this.add.text(500, 10, `Time: ${this.timeLeft}`, { fontSize: '32px', fill: '#ffffff' });
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
       
        this.input.keyboard.on('keydown', (event) => {
            this.handleKeyPress(event);
        });
    }

    update() {
        if (this.player1.controls.jump.isDown && this.player1.sprite.body.touching.down) {
            this.player1.sprite.setVelocityY(-400); 
        }
        if (this.player2.controls.jump.isDown && this.player2.sprite.body.touching.down) {
            this.player2.sprite.setVelocityY(-400); 
        }

        //detecta la primer columna de cada jugador
        this.checkClosestColumn(this.player1); 
        this.checkClosestColumn(this.player2);
    }

    checkClosestColumn(player) {
        let closestBlock = null;
        let minDistance = Infinity;
    
        player.blocks.forEach(block => {
            // Calculamos la distancia horizontal (eje X) entre el jugador y el bloque
            const distanceX = Math.abs(player.sprite.x - block.x);
    
            // Verificamos si el bloque está más cerca que el bloque más cercano encontrado hasta ahora
            if (distanceX < minDistance && block.y < player.sprite.y) {
                minDistance = distanceX;
                closestBlock = block;
            }
        });
        if (closestBlock) {
            this.physics.add.collider(player.sprite, closestBlock);
        }
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
                const blockType = blockTypes[Phaser.Math.Between(0, 2)];  
                const block = new Block(this, blockX, blockY, blockType, playerNumber);
                player.blocks.push(block);
            }
        }
    }

    handleLanding(playerSprite, block) {
        if (playerSprite.body.touching.down) {
            // El jugador ha aterrizado en un bloque
            console.log(`Jugador aterrizó sobre un bloque de tipo: ${block.type}`);
            
            // Aquí puedes añadir cualquier lógica adicional, como restar puntos, etc.
        }
    }
    
    setColliders() {

        this.physics.add.collider(this.player1.sprite, this.player2.sprite);

        this.player1.blocks.forEach(block => {
            this.physics.add.collider(this.player1.sprite, block, this.handleLanding, null, this);
        });
        this.player2.blocks.forEach(block => {
            this.physics.add.collider(this.player2.sprite, block, this.handleLanding, null, this);
        });
    }

    handleKeyPress(event) {
       
        if (event.key === 'a') {
            this.handleBlockRemoval(this.player1, 'a');
            this.player1.sprite.play('PJ1_pala');
        } else if (event.key === 'w') {
            this.handleBlockRemoval(this.player1, 'w');
            this.player1.sprite.play('PJ1_pico');
        } else if (event.key === 'd') {
            this.handleBlockRemoval(this.player1, 'd');
            this.player1.sprite.play('PJ1_hacha');
        }
    
        if (event.key === 'ArrowLeft') {
            this.handleBlockRemoval(this.player2, 'LEFT');
            this.player2.sprite.play('PJ2_pala');
        } else if (event.key === 'ArrowUp') {
            this.handleBlockRemoval(this.player2, 'UP');
            this.player2.sprite.play('PJ2_pico');
        } else if (event.key === 'ArrowRight') {
            this.handleBlockRemoval(this.player2, 'RIGHT');
            this.player2.sprite.play('PJ2_hacha');
        } 
    }

    handleBlockRemoval(player, key) {
        let blockToRemove = player.blocks.find(block => block.keyremove === key);
        if (blockToRemove) {
            //guardar posición del bloque
            const x = blockToRemove.x;
            const y = blockToRemove.y;
            const currentType = blockToRemove.type;
    
            blockToRemove.destroy();
            player.blocks = player.blocks.filter(block => block !== blockToRemove);  
            const blockTypes = ['tierra', 'madera', 'piedra'];
            let newType = currentType;
            
            while (newType === currentType) {
                newType = blockTypes[Phaser.Math.Between(0, blockTypes.length - 1)];
            }
            
            //regenerar bloque aleatorio 
            this.time.addEvent({
                delay: 9000,  
                callback: () => {
                    const newBlock = new Block(this, x, y, newType, player === this.player1 ? 1 : 2);
                    player.blocks.push(newBlock);
                },
                callbackScope: this
            });
    
            player.score += 10;
            player.scoreText.setText(`Score P${player === this.player1 ? 1 : 2}: ${player.score}`);
        }
    }

    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
            this.timerEvent.remove();
        

            //determinar qn ganó
         let winner;
            if (this.player1.score > this.player2.score) {
             winner = 'Player 1 WINS';
            } else if (this.player2.score > this.player1.score) {
             winner = 'Player 2 WINS';
            } else {
                winner = 'It\'s a TIE';
            }

            this.scene.start('GameOver', { 
                scoreP1: this.player1.score, 
                scoreP2: this.player2.score, 
                winner: winner 
            });
        }
    }
    
}
