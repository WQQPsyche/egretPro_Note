import { entity } from "@egret/ecs";
import { EngineFactory, GameEntity, Transform } from "@egret/engine";
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
        let _entity = null;
        if (this._pool.length>0) {
            _entity = this._pool.pop();
            _entity.enabled = true;
            _entity.transform.position.set(0,0,0);
            _entity.transform.localPosition.set(0,0,0);
            _entity.transform.localEulerAngles.set(0,0,0);
        }else{
            _entity = EngineFactory.createGameEntity3D("cut_fly_"+this.entityCount);
            _entity.addComponent(MeshFilter).mesh = Mesh.create(1000*3,1500*3);
            _entity.addComponent(MeshRenderer);
            _entity.addComponent(CutFly);
            this._pool.push(_entity);
            this.entityCount++;
        }
     
        return _entity;
    }

    public returnPool(entity:GameEntity){
        entity.enabled = false;
        this._pool.push(entity);
    }

    public clear(){
        console.warn(this._pool.length);
        this.entityCount = 0;
        for (const entity of this._pool) {
            entity.removeAllComponent();
            entity.destroy();
        }
        this._pool = [];
    }

}