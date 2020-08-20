import { component, Entity } from "@egret/ecs";
import { Behaviour, Ray, RaycastInfo, Application, GameEntity } from "@egret/engine";
import { InputManager, InputState } from "@egret/input";
import { serializedField, property, EditType } from "@egret/core";
import { Camera } from "@egret/render";
import {Tween } from "@egret/tween";
import {GoodsSystem } from "./GoodsSystem";



@component()
class RayCastGoods extends Behaviour{
    
    @serializedField
    @property(EditType.Component, { componentClass: Camera })
    public camera:Camera = null;

    // // 要拾取的物品
    // @serializedField
    // @property(EditType.Entity)
    // public tg:GameEntity = null;

    
    onStart(){
        Application.instance.systemManager.registerSystem( GoodsSystem );

        Application.instance.systemManager.getSystem(GoodsSystem).camera = this.camera;

        // this._input = Application.instance.globalEntity.getComponent(InputManager);
       
    }
    // onUpdate(){
    //     for (const pointer of this._input.getPointers(InputState.Up)) {
    //         const ray = this.camera.stageToRay(pointer.position.x, pointer.position.y, this._ray);
    //         const raycastInfo = this._raycastInfo.clear();
            
    //         if((this.tg.renderer as any).raycast(this._ray,this._raycastInfo) ){
    //             console.log("拾取物品");
    //             Tween.toScale(this.tg.transform,1,{x:0,y:0,z:0,onComplete:()=>{
    //                 this.tg.destroy();
    //             }})
                
    //         }    
    //     }
    // }

}
