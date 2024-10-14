import {Scene} from 'phaser' ;

export class GameCo extends Scene
{
    constructor ()
    {
        super ('GameCo');
    }
    
    create (){
        this.add.image('background').setScale(2);
    }

    update(){

    }


}