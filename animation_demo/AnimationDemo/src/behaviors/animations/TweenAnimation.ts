import { component } from "@egret/ecs";
import { Behaviour, Transform, Application } from "@egret/engine";
import {  Tween } from "@egret/tween";


@component()
class TweenAnimation extends Behaviour{
    onAwake(){
        Application.instance.egretProUtil.addEventListener("palyTween",1,this.playTween,this);
    }
    playTween(){
        Tween.toPosition(this.entity.getComponent(Transform),2,{y:2});
    }
    onStart(){
        // Tween.toPosition(this.entity.getComponent(Transform),2,{y:2});
    }
}