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
        this.scale = 1;
        this.anims.play("zombie1_walk");
        break;
      case "zombie2":
        this.speed = 100;
        this.health = 5;
        this.damage = 1;
        this.scale = 1;
        this.anims.play("zombie2_walk");
        break;
      case "zombie3":
        this.speed = 150;
        this.health = 7;
        this.damage = 2;
        this.scale = 1;
        this.anims.play("zombie3_walk");
        break;
    }
  }

  //mueve el zombie automaticamente
  startMoving() {
    if (this.player) {
      this.scene.physics.moveToObject(this, this.player, this.speed);
    }
  }

  //salud zombie -daño
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
    this.ammodisp = 0;
    this.range = 400;
    this.scale = 0.7;

    scene.add.existing(this);

    this.shootTimer = scene.time.addEvent({
      delay: 2000,
      callback: this.tryToShoot,
      callbackScope: this,
      loop: true,
    });
  }

  //busca objetivo
  tryToShoot() {
    if (this.ammodisp <= 0) return;

    // sólo zombies activos y visibles
    const candidates = this.scene.zombies
      .getChildren()
      .filter((z) => z.active && z.visible);

    const target = candidates.find(
      (z) =>
        Phaser.Math.Distance.Between(this.x, this.y, z.x, z.y) <= this.range
    );

    if (target) {
      this.shoot(target);
      this.ammodisp--;
    }
  }

  //disparo
  shoot(target) {
    if (!target) {
      target = this.getTarget();
    }

    console.log("Física de la escena:", this.scene ? this.scene.physics : null);
    console.log("Target:", target);

    const damageAmount = 1;

    if (!this.scene || !this.scene.physics) {
      console.error("Error: La física de la escena no está disponible.");
      return;
    }

    //proyectil y fisica
    const key = this.type === "ballesta" ? "flechadisp" : "baladisp";
    const speed = this.type === "ballesta" ? 300 : 200;
    const proj = this.scene.physics.add
      .sprite(this.x, this.y, key)
      .setDepth(1)
      .setScale(0.1);

    //debug target válido mueve el proyectil; si no, lo destruimos
    if (target && target.active) {
      this.scene.physics.moveToObject(proj, target, speed);
    } else {
      console.error("No se pudo mover el proyectil. Target inválido.");
      proj.destroy();
    }

    //detección de impacto con zombies
    this.scene.physics.add.overlap(proj, this.scene.zombies, (proj, zombie) => {
      proj.destroy(); //destruye ammo al impacto
      zombie.health -= damageAmount;
      if (zombie.health <= 0) {
        zombie.destroy();
      }
    });
  }

  addAmmo(amount) {
    this.ammodisp += amount;
  }

  update() {}
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
    this.timer1 = 90;

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

    //data municion
    this.textAmmoP1 = this.add.text(1015, 25, "0       0", {
      fontSize: "22px",
      fill: "#fff",
      fontFamily: "Arial Black",
    });
    this.textAmmoP2 = this.add.text(830, 25, "0      0", {
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

    this.p1.ammoInventory = { bala: 0, flecha: 0 };
    this.p2.ammoInventory = { bala: 0, flecha: 0 };

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
    this.ammoGroup = this.physics.add.group();
    this.physics.add.collider(this.ammoGroup, capaSup);
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

    this.time.addEvent({
      delay: 1500,
      callback: this.spawnRandomAmmo,
      callbackScope: this,
      loop: true,
    });

    //torres
    this.towers = this.physics.add.staticGroup();
    //ubicaciones de construcción
    const positions = [
      { x: 315, y: 550, type: "ballesta" },
      { x: 800, y: 230, type: "ballesta" },
      { x: 160, y: 420, type: "cañon" },
      { x: 900, y: 520, type: "cañon" },
    ];
    positions.forEach((p) =>
      this.towers.add(new Tower(this, p.x, p.y, p.type))
    );
    this.timerText = this.add.text(590, 20, "90", {
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
    this.physics.add.collider(this.p1, this.towers);
    this.physics.add.collider(this.p2, this.towers);

    this.physics.add.overlap(
      [this.p1, this.p2],
      this.ammoGroup,
      this.onAmmoCollect,
      null,
      this
    );

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
    //colisión entre los zombies y la capa "sup"
    this.physics.add.collider(this.zombies, this.capaSup, null, this);
    //colisión entre los zombies y las torres de defensa
    this.physics.add.collider(this.zombies, this.tower, null, this);
    //colisión entre los zombies y las municiones
    this.physics.add.collider(this.zombies, this.ammoGroup, null, this);

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
  spawnRandomAmmo() {
    //busca lugar disponible
    const types = ["flecha", "bala"];
    const type = Phaser.Utils.Array.GetRandom(types);
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      const x = Phaser.Math.Between(50, this.game.config.width - 50);
      const y = Phaser.Math.Between(50, this.game.config.height - 50);
      const temp = this.physics.add
        .sprite(x, y, this.itemSprites[type].recolectable)
        .setVisible(false);
      const coll =
        this.physics.world.overlap(temp, this.ammoGroup) ||
        this.physics.world.overlap(temp, this.towers) ||
        this.physics.world.overlap(temp, this.uixCollider);
      temp.destroy();
      if (!coll) {
        this.spawnCollectibleAmmo(type, x, y);
        break;
      }
    }
  }

  //crea el recolectable
  spawnCollectibleAmmo(type, x, y) {
    const key = this.itemSprites[type].recolectable;
    const ammo = this.physics.add
      .sprite(x, y, key)
      .setData("type", type)
      .setScale(0.16)
      .setCollideWorldBounds(true);

    this.ammoGroup.add(ammo);

    this.time.delayedCall(
      5000,
      () => {
        if (ammo && ammo.active) {
          ammo.destroy();
        }
      },
      null,
      this
    );
  }

  //recoleccion municion
  onAmmoCollect(player, ammoSprite) {
    const type = ammoSprite.getData("type");
    player.ammoInventory[type]++; //suma solo al jugador que recogió
    this.updateAmmoText(player);
    ammoSprite.destroy();
  }

  //recarga municion
  onReloadAmmo(player, tower) {
    // mapeo visual → munición
    const ammoKey = tower.type === "ballesta" ? "flecha" : "bala";
    const available = player.ammoInventory[ammoKey];

    if (available > 0) {
      tower.addAmmo(available);
      player.ammoInventory[ammoKey] = 0;
      this.updateAmmoText(player);
    }
  }

  //actualiza contador
  updateAmmoText(player) {
    const txt = player === this.p1 ? this.textAmmoP1 : this.textAmmoP2;
    const inv = player.ammoInventory;
    txt.setText(` ${inv.bala}       ${inv.flecha}`);
  }

  perderVida(player) {
    if (player === 1 && this.vidap1 > 0) {
      this.vidap1--;
      this.textvidap1.setText(`x${this.vidap1}`);
    } else if (player === 2 && this.vidap2 > 0) {
      this.vidap2--;
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
    this.remainingTime = 90;
    this.timerText.setText("Preparación...");
    const buildText = this.add.text(
      300,
      400,
      getPhrase("¡RECOLECTA MUNICION!"),
      {
        fontSize: "40px",
        fill: "#ffffff",
        fontFamily: "Arial Black",
        stroke: "#000000",
        strokeThickness: 8,
      }
    );

    this.time.delayedCall(2000, () => {
      buildText.destroy();
    });
    this.timer1 = this.time.addEvent({
      delay: 90000,
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
    console.log("Oleada finalizada. Reiniciando recolección...");
    if (!this.scene || !this.scene.time) {
      console.error(
        "Error: this.scene o this.scene.time no están disponibles."
      );
      return;
    }

    // Reiniciar el Timer1 de recolección
    this.scene.time.addEvent({
      delay: 5000, // Ajusta el tiempo según necesites
      callback: () => {
        this.startTimer1(); // Llamar la función de recolección
      },
    });

    // Después de recolectar, volver a iniciar Timer2 para la siguiente oleada
    this.scene.time.addEvent({
      delay: 10000, // Espera tras la recolección antes de la siguiente oleada
      callback: () => {
        this.startTimer2(); // Iniciar nueva oleada
      },
    });
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

  //torre
  createTower(x, y, type, player) {
    const tower = new Tower(this, x, y, type);
    this.towers.add(tower);
  }

  //zombies logica
  spawnZombiesWave() {
    // Número total de zombies a spawnear
    const total = 10;
    // Creamos un evento que se dispara cada 3 segundos, repitiéndose total‑1 veces
    this.time.addEvent({
      delay: 3000,
      repeat: total - 1,
      callback: () => {
        // Cada vez que se dispare el callback, generamos un zombie
        const x = Phaser.Math.Between(50, this.game.config.width - 50);
        const y = Phaser.Math.Between(50, this.game.config.height - 50);
        const z = new Zombie(this, x, y, "zombie1", this.p1)
          .setScale(0.21)
          .setActive(true)
          .setVisible(true);
        this.zombies.add(z);
        z.startMoving();
      },
    });
  }

  //zombie que pierda vida se destruye
  clearZombies() {
    if (!this.zombies || !(this.zombies instanceof Phaser.GameObjects.Group)) {
      console.error("Error: this.zombies no es un grupo válido.");
      return;
    }

    this.zombies.getChildren().forEach((zombie) => {
      zombie.destroy(); // Eliminar cada zombie
    });
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

  //parar movimiento al soltar tecla
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
