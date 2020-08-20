import { component, Entity } from "@egret/ecs";
import { Behaviour, Ray, RaycastInfo, Application, GameEntity } from "@egret/engine";
import { InputManager, InputState } from "@egret/input";
import { serializedField, property, EditType } from "@egret/core";
import { Camera } from "@egret/render";
import {Tween } from "@egret/tween";


@component()
class RayTest extends Behaviour{
    
    private _ray:Ray = Ray.create();
    private _raycastInfo:RaycastInfo = RaycastInfo.create();

    private _input:InputManager;

    @serializedField
    @property(EditType.Component, { componentClass: Camera })
    public camera:Camera = null;

    // 要拾取的物品
    @serializedField
    @property(EditType.Entity)
    public tg:GameEntity = null;

    
    onStart(){
        this._input = Application.instance.globalEntity.getComponent(InputManager);
       
    }
    onUpdate(){
        for (const pointer of this._input.getPointers(InputState.Up)) {
            //将屏幕的触摸点基于该相机的视角转换成一条世界射线
            const ray = this.camera.stageToRay(pointer.position.x, pointer.position.y, this._ray);
            const raycastInfo = this._raycastInfo.clear();

            //判断立方体是否和射线相交
            if((this.tg.renderer as any).raycast(this._ray,this._raycastInfo) ){
                console.log("拾取物品");
                Tween.toScale(this.tg.transform,1,{x:0,y:0,z:0,onComplete:()=>{
                    this.tg.destroy();
                }})
                
            }    
        }
    }

}



