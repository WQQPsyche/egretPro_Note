import { ResourceManager } from "@egret/core";
import { CutEntityAttributesFactory } from "../CutEntityAttributesFacetory";
import { DataManager } from "./DataManager";

export class LoadData{
    private static _instance:LoadData;
    public static get Instance(){
        if (!this._instance) {
            this._instance = new LoadData();
        }

        return this._instance;
    }

    public currentResNum = 0;
    public totalResNumber:number;
    public loadPercent:number;

    async startLoad(){

        //加载数据
        await DataManager.Instance.initData();

        for(const foodId in DataManager.Instance.foodDatas){
            await CutEntityAttributesFactory.instance.addFoodMeshInformation(parseInt(foodId));

        }
        for(const knifeid in DataManager.Instance.knifeDatas){
            await CutEntityAttributesFactory.instance.addKnifeInfos(knifeid);
        }


    }

    // todo 
    async loadUriAndUpdateLoadingUI(url: string = "", onlyLoad = false) {

        this.currentResNum++;

        if (url && url !== "") {
            await ResourceManager.instance.loadUri(url);
        }

        if (this.currentResNum <= this.totalResNumber) {
            const percent = Math.floor(this.currentResNum / this.totalResNumber * 100);
        } else {
        }
    }

}