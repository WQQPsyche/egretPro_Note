import { BoxCollider, Rigidbody } from "@egret/oimo";
import { Application, EngineFactory, GameEntity, Transform } from "@egret/engine";
import { Mesh, MeshFilter, MeshRenderer } from "@egret/render";
import { CutFillFace } from "./CutFillFace";

export class CutFillFacePool{
    private static _instance:CutFillFacePool = null;
    public static get Instance(){
        if (!this._instance) {
            this._instance = new CutFillFacePool();
        }

        return this._instance;
    }

    private _pool:GameEntity<Transform>[] = [];

    public entityCount:number = 0;

    public getCutFillFaceEntity():GameEntity{
        let _entity = null;
        if (this._pool.length>0) {
            console.error("fillface回收池中的");
            _entity = this._pool.pop();
            _entity.enabled = true;
            _entity.transform.position.set(0,0,0);
            _entity.transform.localPosition.set(0,0,0);
            _entity.transform.localEulerAngles.set(0,0,0);
        }else{
            _entity = EngineFactory.createGameEntity3D("cut_face_"+this.entityCount);
            _entity.addComponent(MeshFilter).mesh = Mesh.create(1600*3,2400*3);
            _entity.addComponent(MeshRenderer);
            _entity.addComponent(CutFillFace);
            this.entityCount++;
        }
     
        return _entity;        
    }

    /**
     * returnFillFaceEntity
     */
    public returnPool(entity:GameEntity) {
        entity.parent = Application.instance.sceneManager.activeScene.root.entity;
        entity.enabled = false;
        // entity.removeComponent(MeshFilter);
        // entity.addComponent(MeshFilter).mesh = Mesh.create(1600*3,2400*3);
        // entity.removeComponent(MeshRenderer);
        // entity.addComponent(MeshRenderer);
        // entity.removeComponent(Rigidbody);
        // entity.removeComponent(BoxCollider);
        // this._pool.push(entity);
    }

    /**
     * clear
     */
    public clear() {
        for (const entity of this._pool) {
            entity.destroy();
        }
        this._pool = [];
    }

        
    
}