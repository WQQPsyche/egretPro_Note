import { System, system, Matcher } from "@egret/ecs";
import { GameEntity, Ray, RaycastInfo, Application } from "@egret/engine";
import { InputManager, InputState } from "@egret/input";
import { Camera } from "@egret/render";
import {Tween } from "@egret/tween";
import { Goods } from "./Goods";


@system()
export class GoodsSystem extends System{

    private _ray:Ray = Ray.create();
    private _raycastInfo:RaycastInfo = RaycastInfo.create();
    private _input:InputManager;
    public camera:Camera;
    private _goods:GameEntity[];

    private _deleteGoods:GameEntity[] = [];

    getMatchers(){
        return [
            Matcher.create(GameEntity,true,Goods)
        ]
    }
    onStart(){
        console.log(this.groups);
        
        this._goods = this.groups[0].entities as GameEntity[];
        this._input = Application.instance.globalEntity.getComponent(InputManager);
    }
    onFrame(){
        

        for (const pointer of this._input.getPointers(InputState.Up)) {

            const ray = this.camera.stageToRay(pointer.position.x, pointer.position.y, this._ray);
            const raycastInfo = this._raycastInfo.clear();
           
            for(const item of this._goods){
                if( (item.renderer as any).raycast(this._ray,this._raycastInfo) )
                {
                
                    Tween.toScale(item.transform,0.5,{x:0,y:0,z:0,onComplete:()=>{
                        if(item){
                            this._deleteGoods.push( item );
                        }
                        
                    }});
                }


                
            }

              
        }
        for (const deleteItem of this._deleteGoods) {
            for (var i = 0; i < this._goods.length; i++ ) {
                if(deleteItem == this._goods[i]){
                    deleteItem.destroy();
                    this._goods.splice(i,1);
                    i--;
                }
            }
        }
        this._deleteGoods.length = 0;



    }
    }

   
}