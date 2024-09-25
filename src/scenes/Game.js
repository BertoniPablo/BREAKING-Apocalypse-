import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.blocks; // matriz de bloques
        this.points1 = 0; //puntos p1
        this.points2 = 0; //puntos p2
    }

    preload (){
        this.load.image ("block", '.public/assets/cuadrado.png');

    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(500, 200,"block"). setScale (1);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.blocks = this.physics.add.staticGroup();
        for (let i = 0; i < 5; i++) { // 5 filas
            for (let j = 0; j < 10; j++) { // 10 columnas
                let blockX = 80 + j * 95;
                let blockY = 100 + i * 40;
                this.blocks.create(blockX, blockY, 'block').setScale(0.5).refreshBody();
            }
        }      

        //límites del mundo
        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

        //colisión con el límite inferior del mundo
        this.physics.world.on("worldbounds", this.checkWorldBounds, this);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
