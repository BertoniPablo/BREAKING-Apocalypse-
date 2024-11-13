import { Scene } from 'phaser';
import { getPhrase } from '../Services/translations';

class Zombie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, player) {
        super(scene, x, y, 'zombie');  

        this.scene = scene;
        this.player = player; 
        this.type = type;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setActive(false).setVisible(false); 

        //tipos de zombies
        switch (type) {
            case 'zombie1':
                this.speed = 50;   
                this.health = 3; 
                this.damage = 0.5 
                this.anims.play('zombie1_walk');  
                break;
            case 'zombie2':
                this.speed = 100;  
                this.health = 5;  
                this.damage = 1 
                this.anims.play('zombie2_walk');  
                break;
            case 'zombie3':
                this.speed = 150;  
                this.health = 7;  
                this.damage = 2
                this.anims.play('zombie3_walk');  
                break;
            default:
                this.speed = 50;
                this.health = 1;
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

class Tower extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        this.scene = scene;
        this.type = type;
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.setActive(true).setVisible(true);
        this.shootCooldown = 1000; // Tiempo entre disparos en ms
        this.lastShotTime = 0;
        
        // Configurar el tipo de torre
        switch (type) {
            case 'ballesta':
                this.range = 200;
                this.materialCost = { madera: 10, piedra: 5, hierro: 2 };
                break;
            case 'cañon':
                this.range = 250;
                this.materialCost = { madera: 5, piedra: 6, hierro: 3 };
                break;
            default:
                this.range = 100;
                this.materialCost = { madera: 5, piedra: 5, hierro: 2 };
        }
    }

    shoot(target) {
        if (this.scene.time.now - this.lastShotTime > this.shootCooldown) {
            this.lastShotTime = this.scene.time.now;
            const line = this.scene.add.line(
                0, 0, this.x, this.y, target.x, target.y, 0xff0000
            ).setOrigin(0, 0).setLineWidth(2);
            this.scene.time.delayedCall(100, () => line.destroy());
            target.receiveDamage(1);
        }
    }

    update(zombies) {
        const target = zombies.getChildren().find(zombie => {
            return Phaser.Math.Distance.Between(this.x, this.y, zombie.x, zombie.y) <= this.range;
        });
        if (target) {
            this.shoot(target);
        }
    }
}


export class GameCo extends Scene {
    constructor() {
        super('GameCo');
        this.posicionp1 = { x: 300, y: 385 };
        this.posicionp2 = { x: 900, y: 385 };
        this.vidap1 = 3
        this.vidap2 = 3
        this.textvidap1 = null;
        this.textvidap2 = null;
        this.enContador = false;
        this.cooldown = false; //cooldown
        this.puedeMoverse = true; //movimiento
        this.GameOver2 = false;
        this.zombieSpawned = false;
        this.currentWave = 0; // Contador de oleadas
        this.maxWaves = 5;
        this.timerText =    
        this.timer1 = null        
        this.timer2 = null
        this.remainingTime = null
        this.buildingLocations = [
            { x: 400, y: 300 }, { x: 700, y: 300 } // Puntos de construcción
        ];
        this.towers = null;
         
    }

    init (){
        this.vidap1 = 3
        this.vidap2 = 3
        this.timer1 = 60
        this.limitematerial = 10
        this.material = {
            madera: { count: 0,  limit: this.limitematerial, image: 'madera' },
            piedra: { count: 0,  limit: this.limitematerial, image:'piedra'},
            hierro: { count: 0,  limit: this.limitematerial, image: 'hierro'},
        } 

        if (!this.copmusic || !this.copmusic.isPlaying) {
            this.copmusic = this.sound.add('copmusic', { volume: 0.5 , loop: true });
            this.copmusic.play();
        } else if (this.copmusic.isPaused) {
            this.copmusic.resume();
        }

    }

    create() {
        
        this.events.on('shutdown', () => {
            this.copmusic.pause();
        });

        this.add.image(575, 400, 'camino').setScale(1.1);
        this.add.image(575, 384.5, 'uixcop').setScale(1); 
        this.uixCollider = this.physics.add.staticImage(575, 25, 'uixcopCollision').setScale(10);
        this.uixCollider.setVisible(false); 

        this.add.image(100, 40, 'corazon');
        this.add.image(230, 40, 'corazon');

        this.textvidap1 = this.add.text(120, 25, `x${this.vidap1}`, { fontSize: '22px', fill: '#fff', fontFamily: 'Arial Black' });
        this.textvidap2 = this.add.text(250, 25, `x${this.vidap2}`, { fontSize: '22px', fill: '#fff', fontFamily: 'Arial Black' });

        //personajes
        this.p1 = this.physics.add.sprite(this.posicionp1.x, this.posicionp1.y, 'player1');
        this.p1.setScale(0.35);
        this.p1.setBounce(0);
        this.p1.setCollideWorldBounds(true);
        this.p1.play ('p1_idle');

        this.p2 = this.physics.add.sprite(this.posicionp2.x, this.posicionp2.y, 'player2');
        this.p2.setScale(0.35);
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

        this.material["madera"].text = this.add.text(870, 20, '0', { fontSize: '24px', fontFamily: 'Arial Black' ,fill: '#ffff' });
        this.material["piedra"].text = this.add.text(970, 20, '0', { fontSize: '24px', fontFamily: 'Arial Black' ,fill: '#ffff' });
        this.material["hierro"].text = this.add.text(1070, 20, '0', { fontSize: '24px', fontFamily: 'Arial Black' ,fill: '#ffff' });

        this.add.image('madera_').setScale(1);
        this.add.image('piedra_').setScale(1);
        this.add.image('hierro_').setScale(1);


        this.time.addEvent({
            delay: 4000,
            callback: this.spawnMaterial,
            callbackScope: this,
            loop: true
        });

        //torres
        this.towers = this.physics.add.group();
        //ubicaciones de construcción
        this.buildingMarkers = this.add.group();
        this.buildingLocations.forEach(location => {
            const marker = this.add.circle(location.x, location.y, 20, 0xff0000).setAlpha(0.5);
            marker.setDepth(0); // Mantener detrás de los personajes
            this.buildingMarkers.add(marker);
            marker.setData('location', location);
        });

        this.timerText = this.add.text(590, 20,  '60', { fontSize: '24px', fontFamily: 'Arial Black',fill: '#ffff' });

        //colisiones
        this.physics.add.collider(this.p1, this.p2);
        this.physics.add.collider(this.p1, this.zombies, this.onPlayerHit, null, this);
        this.physics.add.collider(this.p2, this.zombies, this.onPlayerHit, null, this);

        this.physics.add.collider(this.materialGroup, this.uixCollider);
        this.physics.add.collider(this.zombies, this.uixCollider); 
        this.physics.add.collider(this.p1, this.uixCollider); 
        this.physics.add.collider(this.p2, this.uixCollider);

        this.physics.add.overlap(this.p1, this.materialGroup, this.onShapeCollect, null, this);
        this.physics.add.overlap(this.p2, this.materialGroup, this.onShapeCollect, null, this);

        this.physics.add.overlap(this.p1, this.buildingMarkers, this.handleBuildingOverlap, null, this);
        this.physics.add.overlap(this.p2, this.buildingMarkers, this.handleBuildingOverlap, null, this);

        this.input.keyboard.on('keydown', (event) => this.handleKeyPress(event));
        this.input.keyboard.on('keyup', (event) => this.handleKeyRelease(event));
        
        this.startTimer1();
    }
    
    perderVida(player) {
        if (player === 1 && this.vidap1 > 0) {
            this.vidap1--; // Disminuir vidas del Jugador 1
            this.textvidap1.setText(`x${this.vidap1}`);
        } else if (player === 2 && this.vidap2 > 0) {
            this.vidap2--; // Disminuir vidas del Jugador 2
            this.textvidap2.setText(`x${this.vidap2}`);
        }

        if (this.vidap1 === 0) {
            console.log("Jugador 1 ha perdido todas sus vidas.");
        }
        if (this.vidap2 === 0) {
            console.log("Jugador 2 ha perdido todas sus vidas.");
        }
    }

    startTimer1() {
        this.remainingTime = 60; 
        this.timerText.setText('Preparación...');
        const buildText = this.add.text.getPhrase(450, 300, '¡Build!', {
            fontSize: '40px', fill: '#ffffff', fontFamily: 'Arial Black', 
            stroke: '#000000', strokeThickness: 8, 
        });
        this.time.delayedCall(2000, () => {
            buildText.destroy();
        });
        this.timer1 = this.time.addEvent({
            delay: 60000, 
            callback: this.onTimer1Complete,
            callbackScope: this,
            loop: false
        });
    }

    startTimer2() {
        this.remainingTime = 120;
        this.timerText.setText('Oleada ' + this.currentWave);
        this.timer2 = this.time.addEvent({
            delay: 120000,  
            callback: this.onTimer2Complete,
            callbackScope: this,
            loop: false
        });

        this.spawnZombiesWave();

    }

    onTimer1Complete() {
        //siguiente oleada
        const waveText = this.add.text.getPhrase(500, 200, '¡The waves are coming!', { 
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black',
            stroke: '#000000', strokeThickness: 8, 
        });
        this.time.delayedCall(2000, () => {
            waveText.destroy();
        });
        if (this.currentWave < this.maxWaves) {
            this.currentWave++;
            this.startTimer2();
        } else {
            console.log('Todas las oleadas completadas.');
            this.timerText.setText('Juego completado');
        }
    }
    
    onTimer2Complete() {
        this.clearZombies(); 
        this.startTimer1();
    }

    update() {

        this.buildingMarkers.children.iterate(marker => {
            marker.setDepth(0); //circulos abajo
        });
        
        //actualiza los zombies
        this.zombies.children.iterate(zombie => {
           
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
            this.p2.anims.play('p2_idle', true);
        }

        if (this.zombieSpawned) {
            this.spawnZombies(); 
        }

    
        if (this.timer1 && !this.timer1.hasDispatched) {
            this.remainingTime -= this.game.loop.delta / 1000; 
            this.timerText.setText(` ${Math.max(0, Math.ceil(this.remainingTime))}`);
        } else if (this.timer2 && !this.timer2.hasDispatched) {
            this.remainingTime -= this.game.loop.delta / 1000;
            this.timerText.setText(` ${Math.max(0, Math.ceil(this.remainingTime))}`);
        }

        this.towers.getChildren().forEach(tower => {
            tower.update(this.zombies);
        });
    }

    //construcciones
    handleBuildingOverlap(player, marker) {
        const location = marker.getData('location');
        const requiredMaterials = player.buildingType === 'ballesta' 
            ? { madera: 10, piedra: 5, hierro: 2 } 
            : { madera: 5, piedra: 6, hierro: 3 };

        if (this.hasRequiredMaterials(requiredMaterials)) {
            const towerType = player.buildingType === 'ballesta' ? 'ballesta' : 'cañon';
            const newTower = new Tower(this, location.x, location.y, towerType);
            this.towers.add(newTower);
            this.reduceMaterials(requiredMaterials);
        }
    }
    hasRequiredMaterials(cost) {
        return Object.keys(cost).every(key => this.material[key].count >= cost[key]);
    }
    reduceMaterials(cost) {
        Object.keys(cost).forEach(key => {
            this.material[key].count -= cost[key];
            this.material[key].text.setText(this.material[key].count); //actualizar
        });
    }
    createTower(x, y, type, player) {
        const tower = new Tower(this, x, y, type);
        this.towers.add(tower);
    }


    spawnZombiesWave() {
        let zombiesToSpawn = [];

        switch (this.currentWave) {
            case 1:
                zombiesToSpawn.push('zombie1');
                break;
            case 2:
                zombiesToSpawn.push('zombie1', 'zombie1', 'zombie2');
                break;
            case 3:
                zombiesToSpawn.push('zombie1', 'zombie2', 'zombie2');
                break;
            case 4:
                zombiesToSpawn.push('zombie2', 'zombie2', 'zombie3');
                break;
            case 5:
                zombiesToSpawn.push('zombie3', 'zombie3');
                break;
            default:
                break;
        }
       
        zombiesToSpawn.forEach(type => {
            const x = Phaser.Math.Between(40, this.game.config.width - 40);
            const y = Phaser.Math.Between(40, this.game.config.height - 40);
            const zombie = new Zombie(this, x, y, type, this.p1).setScale(0.21);
            zombie.setActive(true).setVisible(true); 
            this.zombies.add(zombie);
            zombie.startMoving(); 
        });
    }

    clearZombies() {
        this.zombies.children.iterate(zombie => {
            zombie.setActive(false).setVisible(false);
            zombie.destroy(); 
        });
    }

    spawnMaterial() {

        const types = Object.keys(this.material);
        const type = types[Phaser.Math.Between(0, types.length - 1)];

        const x = Phaser.Math.Between(40, this.game.config.width - 40);
        const y = Phaser.Math.Between(40, this.game.config.height - 40);

        const material = this.materialGroup.create(x, y, type);
        material.setData("type", type); 
        material.setCollideWorldBounds(true); 
    }

    spawnZombies() {
        //generar zombies 
        if (this.zombies.countActive(true) < 5) { 
            const x = Phaser.Math.Between(40, this.game.config.width - 40);
            const y = Phaser.Math.Between(40, this.game.config.height - 40);
            const zombieType = `zombie${Phaser.Math.Between(1, 3)}`; 
            const zombie = new Zombie(this, x, y, zombieType, this.p1).setScale(0.21);
            this.zombies.add(zombie);
        }
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
