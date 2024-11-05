import { Scene } from 'phaser';

class Zombie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, player) {
        super(scene, x, y, 'zombie');  

        this.scene = scene;
        this.player = player; 
        this.type = type;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        //tipos de zombies
        switch (type) {
            case 'zombie1':
                this.speed = 50;   
                this.health = 3;   
                this.anims.play('zombie1_walk');  
                break;
            case 'zombie2':
                this.speed = 100;  
                this.health = 5;   
                this.anims.play('zombie2_walk');  
                break;
            case 'zombie3':
                this.speed = 150;  
                this.health = 7;  
                this.anims.play('zombie3_walk');  
                break;
            default:
                this.speed = 50;
                this.health = 3;
                this.anims.play('zombie1_walk');
                break;    
        }

    }

    startMoving() {
        if (this.player) {  
           this.scene.physics.moveToObject(this, this.player, this.speed);
        }
    }

    receiveDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.destroy();
        }
    }

}

export class GameCo extends Scene {
    constructor() {
        super('GameCo');
        this.player1 = this.p1
        this.player2 = this.p2
        this.vidaIp1 = 3;
        this.vidaIp2 =  3;
        this.posicionp1 = { x: 300, y: 385 };
        this.posicionp2 = { x: 900, y: 385 };
        this.enContador = false;
        this.cooldown = false; //cooldown
        this.puedeMoverse = true; //movimiento
        this.GameOver2 = false;
        
        
    }

    init (){

        this.limitematerial = 10
        this.material = {
            madera: { count: 0,  limit: this.limitematerial },
            piedra: { count: 0,  limit: this.limitematerial },
            hierro: { count: 0,  limit: this.limitematerial },
        } 

    }

    create() {
    
        const map = this.make.tilemap({ key: 'mapa' });
        
        const tileset = map.addTilesetImage('atlas', 'camino_');
        
        const layer = map.createLayer('camino','capasup', tileset, 0, 0);

        this.add.image(575, 384.5, 'uixcop').setScale();

        
        this.vidaIp1 = this.add.sprite(120, 40, 'vidap1', 0);
        this.vidaIp2 = this.add.sprite(255, 40, 'vidap2', 0);

        //personajes
        this.p1 = this.physics.add.sprite(this.posicionp1.x, this.posicionp1.y, 'player1');
        this.p1.setScale(0.41);
        this.p1.setBounce(0);
        this.p1.setCollideWorldBounds(true);
        this.p1.play ('p1_idle');

        this.p2 = this.physics.add.sprite(this.posicionp2.x, this.posicionp2.y, 'player2');
        this.p2.setScale(0.41);
        this.p2.setBounce(0);
        this.p2.setCollideWorldBounds(true);
        this.p2.play('p2_idle');
  
        this.p1.controls = this.input.keyboard.addKeys({
            LEFT: 'A',
            UP: 'W',
            RIGHT: 'D',
            DOWN: 'S'
        });

        this.p2.controls = this.input.keyboard.addKeys({
            LEFT: 'LEFT',
            UP: 'UP',
            RIGHT: 'RIGHT',
            DOWN: 'DOWN'
        });


        //zombies
        this.zombie1 = new Zombie(this, 100, 100, 'zombie1', this.p1).setScale(0.21);
        this.zombie2 = new Zombie(this, 300, 200, 'zombie2', this.p2).setScale(0.41);
        this.zombie3 = new Zombie(this, 500, 300, 'zombie3', this.p1).setScale(0.45);

        this.zombies = this.physics.add.group([this.zombie1, this.zombie2, this.zombie3]);

        //materiales

        this.materialGroup = this.physics.add.group();

        this.material["madera"].image = this.add.image(850, 20, 'madera').setVisible(false);
        this.material["piedra"].image = this.add.image(950, 20, 'piedra').setVisible(false);
        this.material["hierro"].image = this.add.image(1050, 20, 'hierro').setVisible(false);

        this.material["madera"].text = this.add.text(870, 20, '0', { fontSize: '24px', fontFamily: 'Arial Black' ,fill: '#ffff' });
        this.material["piedra"].text = this.add.text(970, 20, '0', { fontSize: '24px', fontFamily: 'Arial Black' ,fill: '#ffff' });
        this.material["hierro"].text = this.add.text(1070, 20, '0', { fontSize: '24px', fontFamily: 'Arial Black' ,fill: '#ffff' });

      
        //colisiones
        this.physics.add.collider(this.p1, this.p2);
        this.physics.add.collider(this.p1, this.zombies, this.onPlayerHit, null, this);
        this.physics.add.collider(this.p2, this.zombies, this.onPlayerHit, null, this);

        this.physics.add.overlap(this.p1, this.materialGroup, this.onShapeCollect, null, this);
        this.physics.add.overlap(this.p2, this.materialGroup, this.onShapeCollect, null, this);
        
        this.input.keyboard.on('keydown', (event) => this.handleKeyPress(event));
        this.input.keyboard.on('keyup', (event) => this.handleKeyRelease(event));
        
        
    }
    

    update() {
        
        //actualiza los zombies
        this.zombies.children.iterate(zombie => {
            zombie.startMoving();
            zombie.update();  
        });

        if (!this.puedeMoverse || this.enContador) {
            return;
        }

        //movimiento p1
        let isP1Moving = false;
    
        if (this.p1.controls.RIGHT.isDown) {
            this.p1.setVelocityX(150);  
            this.p1.anims.play('p1_walkright', true);  
            isP1Moving = true;
        } else if (this.p1.controls.LEFT.isDown) {
            this.p1.setVelocityX(-150);
            this.p1.anims.play('p1_walkleft', true);
            isP1Moving = true;
        } else {
            this.p1.setVelocityX(0); 
        }
    
        if (this.p1.controls.UP.isDown) {
            this.p1.setVelocityY(-150);
            this.p1.anims.play('p1_walkup', true);
            isP1Moving = true;
        } else if (this.p1.controls.DOWN.isDown) {
            this.p1.setVelocityY(150);
            this.p1.anims.play('p1_walkdown', true);
            isP1Moving = true;
        } else {
            this.p1.setVelocityY(0);
        }
    
        //no movimiento - activa idle
        if (!isP1Moving) {
            this.p1.anims.play('p1_idle', true);  //repite idle
        }
        
        //movimiento p2 
        let isP2Moving = false;
    
        if (this.p2.controls.RIGHT.isDown) {
            this.p2.setVelocityX(150);
            this.p2.anims.play('p2_walkright', true);
            isP2Moving = true;
        } else if (this.p2.controls.LEFT.isDown) {
            this.p2.setVelocityX(-150);
            this.p2.anims.play('p2_walkleft', true);
            isP2Moving = true;
        } else {
            this.p2.setVelocityX(0);
        }
    
        if (this.p2.controls.UP.isDown) {
            this.p2.setVelocityY(-150);
            this.p2.anims.play('p2_walkup', true);
            isP2Moving = true;
        } else if (this.p2.controls.DOWN.isDown) {
            this.p2.setVelocityY(150);
            this.p2.anims.play('p2_walkdown', true);
            isP2Moving = true;
        } else {
            this.p2.setVelocityY(0);
        }
    
        if (!isP2Moving) {
            this.p2.anims.play('p2_idle', true);  //repite idle
        }

    }
    
    onSecond() {
        if (this.GameOver2) {
            return;
        }
        const x = Phaser.Math.Between(40, this.game.config.width - 40); 
        const y = 52;
        let material = this.recolectables.create(
            Phaser.Math.Between(3, 780, this.game.config.width - 40),
            52,
            type
        );
        material.setData("type", type);
    }

    onShapeCollect(player, material) {
        const type = material.getData("type");
        const materialInfo = this.material[type];

        if (materialInfo.count < materialInfo.limit) {
            materialInfo.count += 1;
            material.destroy();
            materialInfo.text.setText(materialInfo.count);

        } else {
            material.destroy();
        }
    }

    handleKeyPress(event) {
        
        if (event.key === 'a') {
            this.p1.anims.play('p1_walkleft');
        } else if (event.key === 'w') {
            this.p1.anims.play('p1_walkup');
        } else if (event.key === 'd') {
            this.p1.anims.play('p1_walkright');
        } else if (event.key === 's') {
            this.p1.anims.play('p1_walkdown');
        }

        if (event.key === 'ArrowLeft') {
            this.p2.anims.play('p2_walkleft');
        } else if (event.key === 'ArrowUp') {
            this.p2.anims.play('p2_walkup');
        } else if (event.key === 'ArrowRight') {
            this.p2.anims.play('p2_walkright');
        } else if (event.key === 'ArrowDown') {
            this.p2.anims.play('p2_walkdown');
        }
    }

    handleKeyRelease(event) {
        //cuándo se sueltan teclas activar idle
        if (['a', 'w', 's', 'd'].includes(event.key)) {
            this.p1.anims.play('p1_idle', true);  
            this.p1.setVelocity(0, 0);  
        }
        if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) {
            this.p2.anims.play('p2_idle', true);  
            this.p2.setVelocity(0, 0);  
        }
    }

    iniciarCooldown() {
        this.cooldownP1 = true;
        this.time.delayedCall(350, () => {
            this.cooldownP1 = false;
        });
    
        this.cooldownP2 = true;
        this.time.delayedCall(350, () => {
            this.cooldownP2 = false;
        });
    }

}
