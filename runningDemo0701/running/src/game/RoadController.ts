import { component } from "@egret/ecs";
import { Behaviour, GameEntity, EngineFactory, Vector3 } from "@egret/engine";
import { MeshFilter, DefaultMeshes, MeshRenderer, DefaultMaterials, Material } from "@egret/render";
import { ResourceManager, serializedField, property, EditType } from "@egret/core";
import { Coin, CoinPool } from "./Coin";

@component()
class RoadController extends Behaviour{

    private roadSize:Vector3 = Vector3.create(5,1,10);
    private roads:GameEntity[] = [];
    
    @serializedField
    @property(EditType.Entity)
    public player = null;

    private coinPerfabUrl:string = "assets/perfab/coin.prefab.json";

    async onStart(){
        const RoadMaterial:Material = (await ResourceManager.instance.loadUri("assets/materials/ground.mat.json")).data;

        for(let i = 0; i < 3; i++ ){
            const road:GameEntity = EngineFactory.createGameEntity3D("road"+i);
            road.addComponent(MeshFilter).mesh = DefaultMeshes.CUBE;
            road.addComponent(MeshRenderer).material = RoadMaterial;
            road.transform.localScale = this.roadSize;
            road.transform.setPosition(0,0,i*this.roadSize.z);
            this.roads.push(road);
            this.createCoins(road);
        }
    }
    onUpdate(){
        
        if(this.roads.length == 0) return;

        const currentRoad = this.roads[0];
       
        
        if( this.player.transform.position.z > currentRoad.transform.position.z ){
            const changeRoad = this.roads.shift();
            changeRoad.transform.setPosition(0,0, this.roads[this.roads.length-1].transform.position.z+this.roadSize.z);
            this.roads.push(changeRoad);
            this.createCoins(changeRoad);
          
        }


    }

    async createCoins(road:GameEntity){
        const coindCnt = Math.floor(Math.random()*3) + 1;
        for (let i = 0; i < coindCnt; i++) {
            let coin:GameEntity = null;
            if(CoinPool.coinPool.length>0){
                coin = CoinPool.coinPool.pop();
                coin.enabled = true;
                coin.getComponent(Coin).enabled = true; 
            }else{
            // 创建金币---预置体
            coin = await EngineFactory.createPrefab(this.coinPerfabUrl) as GameEntity;
            coin.addComponent(Coin);
            
            }

            coin.transform.setPosition(Math.random() * this.roadSize.x - this.roadSize.x / 2, 1, road.transform.position.z + i * 1.5)
        }
    }
}