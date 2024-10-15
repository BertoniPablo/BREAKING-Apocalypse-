import {Scene} from 'phaser' ;

export class GameCo extends Scene
{
    constructor (){
        super ('GameCo');
        this.madera = 0
        this.piedra = 0
        this.metal = 0

    }
    
    
    create (){
        this.add.image(512, 384, 'mapa');
    }

    update(){

    }


}
