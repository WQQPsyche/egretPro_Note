import { ResourceManager } from "@egret/core";
import { FoodData } from "./FoodData";
import { KnifeData } from "./KnifeData";

export class DataManager{
    private static _instance:DataManager;
    public static get Instance(){
        if (!this._instance) {
            this._instance = new DataManager();
        }
        return this._instance;
    }

    public foodDatas:{[key:number]:FoodData} = {};
    public knifeDatas:{[key:number]:KnifeData} = {};

    public foodKeys:number[] = [];
    public knifeKeys:number[] = [];

    public async initData(){
      let foodDatasConfig =  await (await ResourceManager.instance.loadUri("config/foodResConfig.json")).data;
      let knifeDatasConfig = await (await ResourceManager.instance.loadUri("config/knife_type.json")).data;
    //读取food配置文件中的数据
      for (const foodData of foodDatasConfig.food_type) {
          if (foodData.prefabUrl) {
              let obj = new FoodData();
              obj.food_type = foodData.food_type;
              obj.food_name = foodData.food_name;
              obj.food_prefabUrl = foodData.prefabUrl;
              obj.food_picName = foodData.picName;
              obj.food_cutFaceMaterialUrl = foodData.cutFaceMaterialUrl;
            //      粒子效果
              obj.food_particleMaterial = foodData.particleMaterial_suipianUrl;

              const foodName = foodData.picName.replace("_avatar","");
              obj.particleMaterial_zhishui1Url = "assets/particle/texture/zhishui/"+foodName+"_zhishui_big.png.image.json";
              obj.particleMaterial_zhishui2Url = "assets/particle/texture/zhishui_small/" + foodName + "_zhishui_small.png.image.json"
              this.foodDatas[obj.food_type] = obj;
              this.foodKeys.push(obj.food_type);
          }
      }
      //读取knife配置文件中的数据
      for (const knifeData of knifeDatasConfig.knife_type) {
          if (knifeData.prefabUrl) {
              let obj = new KnifeData();
              obj.knife_type = knifeData.knife_type;
              obj.knife_name = knifeData.knife_name;
              obj.knife_prefabUrl = knifeData.prefabUrl;
              obj.knife_picName =knifeData.picName;
              this.knifeDatas[obj.knife_type] = obj;
              this.knifeKeys.push[obj.knife_type]
              
          }
      }


    }
    
}