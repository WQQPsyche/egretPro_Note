import { EditType, property, ResourceManager, serialize, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, GameEntity } from "@egret/engine";
import { DataManager } from "../data/DataManager";
import { ParticleRenderer } from "@egret/particle";

@component()
export class ParticleController extends Behaviour{
    @property(EditType.Entity)
    @serializedField
    public suipian:GameEntity = null;

    @property(EditType.Entity)
    @serializedField
    public zhishui1:GameEntity = null;

    @property(EditType.Entity)
    @serializedField
    public zhishui2:GameEntity = null;

    async changeParticleTexture(foodType:number){
       
        const resManager = ResourceManager.instance;
        const foodData = DataManager.Instance.foodDatas[foodType];
        
        if (foodData.food_particleMaterial && foodData.food_particleMaterial != "") {
            this.suipian.enabled = true;
            const texture_suipian = await (await ResourceManager.instance.loadUri(foodData.food_particleMaterial)).data;
            const material_suipian = this.suipian.getComponent(ParticleRenderer).material;
            material_suipian.setTexture(texture_suipian);
            this.suipian.getComponent(ParticleRenderer).material = null;
            setTimeout(() => {
                this.suipian.getComponent(ParticleRenderer).material = material_suipian;
            }, 1);
        }else{
            this.suipian.enabled = false;
        }

        {
           
            const texture_zhishui1 = await (await ResourceManager.instance.loadUri(foodData.particleMaterial_zhishui1Url)).data;
            const material_zhishui1 = this.zhishui1.getComponent(ParticleRenderer).material;
           
            material_zhishui1.setTexture(texture_zhishui1);
            this.zhishui1.getComponent(ParticleRenderer).material = null;
            setTimeout(() => {
                this.zhishui1.getComponent(ParticleRenderer).material = material_zhishui1;
            }, 1);
        }

        {
            
           
            const texture_zhishui2 = await (await ResourceManager.instance.loadUri(foodData.particleMaterial_zhishui2Url)).data;
            const material_zhishui2 = this.zhishui2.getComponent(ParticleRenderer).material;
            material_zhishui2.setTexture(texture_zhishui2);
            this.zhishui2.getComponent(ParticleRenderer).material = null;
            setTimeout(() => {
                this.zhishui2.getComponent(ParticleRenderer).material = material_zhishui2;
            }, 1);
        }

    }
}