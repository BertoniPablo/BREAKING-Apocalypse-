import { Scene } from "phaser";
import { getPhrase } from "../Services/translations";

class Zombie extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type, player) {
    super(scene, x, y, "zombie");

    this.scene = scene;
    this.player = player;
    this.type = type;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setActive(false).setVisible(false);

    //tipos de zombies
    switch (type) {
      case "zombie1":
        this.speed = 50;
        this.health = 3;
        this.damage = 0.5;
        this.anims.play("zombie1_walk");
        break;
      case "zombie2":
        this.speed = 100;
        this.health = 5;
        this.damage = 1;
        this.anims.play("zombie2_walk");
        break;
      case "zombie3":
        this.speed = 150;
        this.health = 7;
        this.damage = 2;
        this.anims.play("zombie3_walk");
        break;
      default:
        this.speed = 50;
        this.health = 1;
        this.anims.play("zombie1_walk");
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
    this.type = type; // "flecha" o "bala"
    this.ammo = 0;
    this.range = 200;

    scene.add.existing(this);

    this.shootTimer = scene.time.addEvent({
      delay: 1000,
      callback: this.tryToShoot,
      callbackScope: this,
      loop: true,
    });
  }

  tryToShoot() {
    if (this.ammo > 0) {
      // buscar target y disparar
      const zombies = this.scene.zombies.getChildren();
      const target = zombies.find(
        (z) =>
          Phaser.Math.Distance.Between(this.x, this.y, z.x, z.y) <= this.range
      );
      if (target) {
        this.shoot(target);
        this.ammo--;
      }
    }
  }

  shoot(target) {
    const key = this.scene.itemSprites[this.type].disparo;
    const proj = this.scene.physics.add.sprite(this.x, this.y, key).setDepth(1);
    // mover proyectil hacia el objetivo
    this.scene.physics.moveToObject(
      proj,
      target,
      this.type === "flecha" ? 300 : 200
    );
  }

  addAmmo(amount) {
    this.ammo += amount;
  }

  update() {
    // El disparo está gestionado por tryToShoot periódico
  }
}

export class GameCo extends Scene {
  constructor() {
    super("GameCo");
    this.posicionp1 = { x: 300, y: 385 };
    this.posicionp2 = { x: 900, y: 385 };
    this.vidap1 = 3;
    this.vidap2 = 3;
    this.textvidap1 = null;
    this.textvidap2 = null;
    this.enContador = false;
    this.cooldown = false; //cooldown
    this.puedeMoverse = true; //movimiento
    this.GameOver2 = false;
    this.zombieSpawned = false;
    this.currentWave = 0; // Contador de oleadas
    this.maxWaves = 5;
    this.timerText = this.timer1 = null;
    this.timer2 = null;
    this.remainingTime = null;
    this.buildingLocations = [
      { x: 400, y: 300 },
      { x: 700, y: 300 }, // Puntos de construcción
    ];
    this.tower = null;
  }

  init() {
    this.vidap1 = 3;
    this.vidap2 = 3;
    this.timer1 = 60;

    if (!this.copmusic || !this.copmusic.isPlaying) {
      this.copmusic = this.sound.add("copmusic", { volume: 0.5, loop: true });
      this.copmusic.play();
    } else if (this.copmusic.isPaused) {
      this.copmusic.resume();
    }
  }

  create() {
    this.events.on("shutdown", () => {
      this.copmusic.pause();
    });

    //UIX
    this.add.image(575, 384.5, "uixcop").setScale(1);
    this.uixCollider = this.physics.add
      .staticImage(575, 25, "uixcopCollision")
      .setScale(10);
    this.uixCollider.setVisible(false);

    //data vida
    this.add.image(100, 40, "corazon");
    this.add.image(230, 40, "corazon");
    this.textvidap1 = this.add.text(120, 25, `x${this.vidap1}`, {
      fontSize: "22px",
      fill: "#fff",
      fontFamily: "Arial Black",
    });
    this.textvidap2 = this.add.text(250, 25, `x${this.vidap2}`, {
      fontSize: "22px",
      fill: "#fff",
      fontFamily: "Arial Black",
    });

    //mundo
    const map = this.make.tilemap({ key: "mapajuego" });

    const tilesetCamino = map.addTilesetImage("camino", "caminojuego");
    map.createLayer("camino", tilesetCamino).setDepth(-1);

    const tilesetSup = map.addTilesetImage("atlas_superficie", "atlas");
    const capaSup = map.createLayer("capasup", tilesetSup);
    capaSup.setCollisionByProperty({ collides: true }).setDepth(-1);

    //personajes
    this.p1 = this.physics.add.sprite(
      this.posicionp1.x,
      this.posicionp1.y,
      "player1"
    );
    this.p1.setScale(0.35);
    this.p1.setBounce(0);
    this.p1.setCollideWorldBounds(true);
    this.p1.play("p1_idle");

    this.p2 = this.physics.add.sprite(
      this.posicionp2.x,
      this.posicionp2.y,
      "player2"
    );
    this.p2.setScale(0.35);
    this.p2.setBounce(0);
    this.p2.setCollideWorldBounds(true);
    this.p2.play("p2_idle");

    //controles
    this.p1.controls = this.input.keyboard.addKeys({
      LEFT: "A",
      UP: "W",
      RIGHT: "D",
      DOWN: "S",
    });
    this.p2.controls = this.input.keyboard.addKeys({
      LEFT: "LEFT",
      UP: "UP",
      RIGHT: "RIGHT",
      DOWN: "DOWN",
    });

    //zombies
    this.zombies = this.physics.add.group([
      (this.zombie1 = new Zombie(this, 100, 100, "zombie1", this.p1).setScale(
        0.21
      )),
      (this.zombie2 = new Zombie(this, 300, 200, "zombie2", this.p2).setScale(
        0.41
      )),
      (this.zombie3 = new Zombie(this, 500, 300, "zombie3", this.p1).setScale(
        0.45
      )),
    ]);

    //municion
    this.itemSprites = {
      flecha: {
        recolectable: "flechas",
        disparo: "flechadisp",
      },
      bala: {
        recolectable: "balas",
        disparo: "baladisp",
      },
    };

    this.ammoGroup = this.physics.add.group();

    for (let i = 0; i < 5; i++) {
      this.spawnCollectibleAmmo(
        "flecha",
        Phaser.Math.Between(100, 1100),
        Phaser.Math.Between(100, 600)
      );
      this.spawnCollectibleAmmo(
        "bala",
        Phaser.Math.Between(100, 1100),
        Phaser.Math.Between(100, 600)
      );
    }

    //torres
    this.towers = this.physics.add.group({
      classType: Tower,
      runChildUpdate: true,
    });
    //ubicaciones de construcción
    this.towers = this.add.group({ classType: Tower, runChildUpdate: true });
    const positions = [
      { x: 200, y: 300, type: "ballesta" },
      { x: 400, y: 300, type: "ballesta" },
      { x: 800, y: 300, type: "cañon" },
      { x: 1000, y: 300, type: "cañon" },
    ];
    positions.forEach((p) =>
      this.towers.add(new Tower(this, p.x, p.y, p.type))
    );

    this.timerText = this.add.text(590, 20, "60", {
      fontSize: "24px",
      fontFamily: "Arial Black",
      fill: "#ffff",
    });

    //colisiones
    this.physics.add.collider(this.p1, capaSup);
    this.physics.add.collider(this.p2, capaSup);
    this.physics.add.collider(this.zombies, capaSup);
    this.physics.add.collider(this.ammoGroup, capaSup);
    this.physics.add.collider(this.towers, capaSup);

    this.physics.add.collider(this.p1, this.p2);
    this.physics.add.collider(
      this.p1,
      this.zombies,
      this.onPlayerHit,
      null,
      this
    );
    this.physics.add.collider(
      this.p2,
      this.zombies,
      this.onPlayerHit,
      null,
      this
    );

    this.physics.add.collider(this.ammoGroup, this.uixCollider);
    this.physics.add.collider(this.zombies, this.uixCollider);
    this.physics.add.collider(this.p1, this.uixCollider);
    this.physics.add.collider(this.p2, this.uixCollider);

    this.physics.add.overlap(
      [this.p1, this.p2],
      this.ammoGroup,
      this.onAmmoCollect,
      null,
      this
    );
    this.physics.add.overlap(
      [this.p1, this.p2],
      this.towers,
      this.onReloadAmmo,
      null,
      this
    );

    this.physics.add.overlap(
      this.p1,
      this.buildingMarkers,
      this.handleBuildingOverlap,
      null,
      this
    );
    this.physics.add.overlap(
      this.p2,
      this.buildingMarkers,
      this.handleBuildingOverlap,
      null,
      this
    );

    //presion teclas
    this.input.keyboard.on("keydown", (event) => this.handleKeyPress(event));
    this.input.keyboard.on("keyup", (event) => this.handleKeyRelease(event));

    this.startTimer1();
  }

  //spawn municiones
  spawnCollectibleAmmo(type, x, y) {
    const key = this.itemSprites[type].recolectable;
    const ammo = this.physics.add
      .sprite(x, y, key)
      .setData("type", type)
      .setScale(0.16)
      .setCollideWorldBounds(true);

    this.ammoGroup.add(ammo);
  }

  //recoleccion municion
  onAmmoCollect(player, ammoSprite) {
    const type = ammoSprite.getData("type");
    this.towers.getChildren().forEach((tower) => {
      if (tower.type === type) {
        tower.addAmmo(1);
      }
    });
    ammoSprite.destroy();
  }

  //recarga municion
  onReloadAmmo(player, tower) {
    const t = tower.type;
    const inv = player.ammoInventory[t];
    if (inv > 0) {
      tower.addAmmo(inv);
      player.ammoInventory[t] = 0;
    }
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

  //temporizadores
  startTimer1() {
    this.remainingTime = 60;
    this.timerText.setText("Preparación...");
    const buildText = this.add.text(450, 300, getPhrase("¡Build!"), {
      fontSize: "40px",
      fill: "#ffffff",
      fontFamily: "Arial Black",
      stroke: "#000000",
      strokeThickness: 8,
    });

    this.time.delayedCall(2000, () => {
      buildText.destroy();
    });
    this.timer1 = this.time.addEvent({
      delay: 60000,
      callback: this.onTimer1Complete,
      callbackScope: this,
      loop: false,
    });
  }

  startTimer2() {
    this.remainingTime = 120;
    this.timerText.setText("Oleada " + this.currentWave);
    this.timer2 = this.time.addEvent({
      delay: 120000,
      callback: this.onTimer2Complete,
      callbackScope: this,
      loop: false,
    });

    this.spawnZombiesWave();
  }

  onTimer1Complete() {
    //siguiente oleada
    const waveText = this.add.text(
      500,
      200,
      getPhrase("¡The waves are coming!"),
      {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial Black",
        stroke: "#000000",
        strokeThickness: 8,
      }
    );
    this.time.delayedCall(2000, () => {
      waveText.destroy();
    });
    if (this.currentWave < this.maxWaves) {
      this.currentWave++;
      this.startTimer2();
    } else {
      console.log("Todas las oleadas completadas.");
      this.timerText.setText("Juego completado");
    }
  }

  onTimer2Complete() {
    this.clearZombies();
    this.startTimer1();
  }

  //upd
  update() {
    //marcadores
    if (this.buildingMarkers) {
      this.buildingMarkers.children.iterate((marker) => marker.setDepth(0));
    }
    //actualiza zombies
    if (this.zombies && this.zombies.getChildren) {
      this.zombies.getChildren().forEach((zombie) => zombie.update());
    }

    if (!this.puedeMoverse || this.enContador) {
      return;
    }

    //movimiento p1
    let isP1Moving = false;
    if (this.p1.controls.RIGHT.isDown) {
      this.p1.setVelocityX(150);
      this.p1.anims.play("p1_walkright", true);
      isP1Moving = true;
    } else if (this.p1.controls.LEFT.isDown) {
      this.p1.setVelocityX(-150);
      this.p1.anims.play("p1_walkleft", true);
      isP1Moving = true;
    } else {
      this.p1.setVelocityX(0);
    }
    if (this.p1.controls.UP.isDown) {
      this.p1.setVelocityY(-150);
      this.p1.anims.play("p1_walkup", true);
      isP1Moving = true;
    } else if (this.p1.controls.DOWN.isDown) {
      this.p1.setVelocityY(150);
      this.p1.anims.play("p1_walkdown", true);
      isP1Moving = true;
    } else {
      this.p1.setVelocityY(0);
    }
    if (!isP1Moving) {
      this.p1.anims.play("p1_idle", true);
    }

    //movimiento p2
    let isP2Moving = false;
    if (this.p2.controls.RIGHT.isDown) {
      this.p2.setVelocityX(150);
      this.p2.anims.play("p2_walkright", true);
      isP2Moving = true;
    } else if (this.p2.controls.LEFT.isDown) {
      this.p2.setVelocityX(-150);
      this.p2.anims.play("p2_walkleft", true);
      isP2Moving = true;
    } else {
      this.p2.setVelocityX(0);
    }
    if (this.p2.controls.UP.isDown) {
      this.p2.setVelocityY(-150);
      this.p2.anims.play("p2_walkup", true);
      isP2Moving = true;
    } else if (this.p2.controls.DOWN.isDown) {
      this.p2.setVelocityY(150);
      this.p2.anims.play("p2_walkdown", true);
      isP2Moving = true;
    } else {
      this.p2.setVelocityY(0);
    }
    if (!isP2Moving) {
      this.p2.anims.play("p2_idle", true);
    }

    //temporizadores y texto
    if (this.timer1 && !this.timer1.hasDispatched) {
      this.remainingTime -= this.game.loop.delta / 1000;
      this.timerText.setText(` ${Math.max(0, Math.ceil(this.remainingTime))}`);
    } else if (this.timer2 && !this.timer2.hasDispatched) {
      this.remainingTime -= this.game.loop.delta / 1000;
      this.timerText.setText(` ${Math.max(0, Math.ceil(this.remainingTime))}`);
    }

    //actualiza torres
    if (this.towers && this.towers.getChildren) {
      this.towers.getChildren().forEach((tower) => tower.update());
    }
  }

  //recarga sistem
  handleBuildingOverlap(player, marker) {
    const location = marker.getData("location");
    const towerType = player.buildingType === "ballesta" ? "ballesta" : "cañon";
    const newTower = new Tower(this, location.x, location.y, towerType);

    // Inicializar sin munición
    newTower.ammo = 0; // Flechas o balas, según el tipo
    this.towers.add(newTower);
  }

  createTower(x, y, type, player) {
    const tower = new Tower(this, x, y, type);
    this.towers.add(tower);
  }

  //zombies logica
  spawnZombiesWave() {
    let zombiesToSpawn = [];

    switch (this.currentWave) {
      case 1:
        zombiesToSpawn.push("zombie1");
        break;
      case 2:
        zombiesToSpawn.push("zombie1", "zombie1", "zombie2");
        break;
      case 3:
        zombiesToSpawn.push("zombie1", "zombie2", "zombie2");
        break;
      case 4:
        zombiesToSpawn.push("zombie2", "zombie2", "zombie3");
        break;
      case 5:
        zombiesToSpawn.push("zombie3", "zombie3");
        break;
      default:
        break;
    }

    zombiesToSpawn.forEach((type) => {
      const x = Phaser.Math.Between(40, this.game.config.width - 40);
      const y = Phaser.Math.Between(40, this.game.config.height - 40);
      const zombie = new Zombie(this, x, y, type, this.p1).setScale(0.21);
      zombie.setActive(true).setVisible(true);
      this.zombies.add(zombie);
      zombie.startMoving();
    });
  }

  clearZombies() {
    this.zombies.getChildren.iterate((zombie) => {
      zombie.setActive(false).setVisible(false);
      zombie.destroy();
    });
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

  //movimiento
  handleKeyPress(event) {
    if (event.key === "a") {
      this.p1.anims.play("p1_walkleft");
    } else if (event.key === "w") {
      this.p1.anims.play("p1_walkup");
    } else if (event.key === "d") {
      this.p1.anims.play("p1_walkright");
    } else if (event.key === "s") {
      this.p1.anims.play("p1_walkdown");
    }

    if (event.key === "ArrowLeft") {
      this.p2.anims.play("p2_walkleft");
    } else if (event.key === "ArrowUp") {
      this.p2.anims.play("p2_walkup");
    } else if (event.key === "ArrowRight") {
      this.p2.anims.play("p2_walkright");
    } else if (event.key === "ArrowDown") {
      this.p2.anims.play("p2_walkdown");
    }
  }

  handleKeyRelease(event) {
    //cuándo se sueltan teclas activar idle
    if (["a", "w", "s", "d"].includes(event.key)) {
      this.p1.anims.play("p1_idle", true);
      this.p1.setVelocity(0, 0);
    }
    if (
      ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(event.key)
    ) {
      this.p2.anims.play("p2_idle", true);
      this.p2.setVelocity(0, 0);
    }
  }

  //caminar por mapa
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
