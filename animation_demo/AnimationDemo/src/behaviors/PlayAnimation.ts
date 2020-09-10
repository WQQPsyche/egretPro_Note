import { Behaviour, Application } from "@egret/engine";
import { Animation } from "@egret/animation";
import { component } from "@egret/ecs";

@component()
class PlayAnimation extends Behaviour{
    // onAwake(){
    //     // Application.instance.egretProUtil.addEventListener("palyAnimation",1,this.playAnimation,this)
    //     this.playAnimation(); 
    // }

    // playAnimation(){
    //     const animation = this.entity.getComponent(Animation);
    //     animation.play("Girl_win_0916_0",0);
    // }
    
    onStart(){
        const animation = this.entity.getComponent(Animation);
        animation.play("Girl_win_0916_0",1);
    }

    onAnimationEvent(animationEvent:AnimationEvent){
        console.log( animationEvent );
        
    }
}