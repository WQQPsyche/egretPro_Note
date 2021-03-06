
import { entity } from "@egret/ecs";
import { EngineFactory, GameEntity, Transform } from "@egret/engine";
import { Rigidbody,BoxCollider } from "@egret/oimo";
import { Mesh, MeshFilter, MeshRenderer } from "@egret/render";
import { CutFly } from "./CutFly";

export class CutFlyEntityPool{
    private static _instance:CutFlyEntityPool;

    public static get Instance(){
        if (!this._instance) {
            this._instance = new CutFlyEntityPool();
        }
        return this._instance;
    }

    private _pool:GameEntity<Transform>[] = [];
    public entityCount = 0;

    public getCutFlyEntity(){
        let _entity:GameEntity= null;
        
        if (this._pool.length>0) {
            console.error("fly回收池中的");
            
            _entity = this._pool.pop();
            _entity.enabled = true;
            // _entity.getComponent(MeshFilter).mesh = Mesh.create(1000*3,1500*3);
            // _entity.getComponent(MeshRenderer).material = null;
            _entity.transform.position.set(0,0,0);
            _entity.transform.localPosition.set(0,0,0);
            _entity.transform.localEulerAngles.set(0,0,0);
        }else{
            _entity = EngineFactory.createGameEntity3D("cut_fly_"+this.entityCount);
            _entity.addComponent(MeshFilter).mesh = Mesh.create(1000*3,1500*3);
            _entity.addComponent(MeshRenderer);
            _entity.addComponent(CutFly);
            this.entityCount++;
        }
     
        return _entity;
    }

    public returnPool(entity:GameEntity){
        entity.enabled = false;
        // entity.removeComponent(MeshFilter);
        // entity.addComponent(MeshFilter).mesh = Mesh.create(1600*3,2400*3);
        // entity.removeComponent(MeshRenderer);
        // entity.addComponent(MeshRenderer);
        // entity.removeComponent(Rigidbody);
        // entity.removeComponent(BoxCollider);
        // this._pool.push(entity);
    }

    public clear(){
        for (const entity of this._pool) {
            entity.destroy();
        }
        this._pool = [];
    }

}