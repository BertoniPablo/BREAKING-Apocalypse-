import {Scene} from 'phaser' ;

export class GameCo extends Scene
{
    constructor (){
        super ('GameCo');
        this.vidaIp1 = 3
        this.vidaIp2 = 3
        this.move = true; 
        this.cooldown = false; //cooldown
        this.madera = 0
        this.piedra = 0
        this.metal = 0

    }
    
    
    create (){
        this.add.image(550, 384, 'mapa');

        //AGREGAR GRUPO SPRITE PERSONAJES
        this.p1.sprite = this.physics.add.sprite(300, 385, 'player1').setScale(0.87);
        this.p2.sprite = this.physics.add.sprite(900, 385, 'player2').setScale(0.87);

        //CREAR PHYSICS HEREDA DE SPRITE OBJECT
        //controles
        this.p1.controls = this.input.keyboard.addKeys({
            pala: 'a',  
            pico: 'w',  
            hacha: 'd',  
            jump: 'SPACE'
        });
        this.p2.controls = this.input.keyboard.addKeys({
            pala: 'LEFT',  
            pico: 'UP',    
            hacha: 'RIGHT',
            jump: 'SHIFT' 
        });

        this.physics.add.collider (this.p1 , this.p2);

        //CREAR VIDAS DE CADA PJ

        //CREAR TORRETAS Y BALLESTAS

        //CREAR ZOMBIES

        //CREAR ELEMENTOS PARA CONSTRUCCION3

    }

    update(){

    }


}
