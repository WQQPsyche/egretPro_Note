import { ResourceManager } from "@egret/core";
import { EngineFactory, GameEntity, Transform, Vector3 } from "@egret/engine";
import { DefaultMaterials, DefaultMeshes, Material, Mesh, MeshFilter, MeshRenderer } from "@egret/render";
import { DataManager } from "./data/DataManager";
import { KnifeData } from "./data/KnifeData";

export class CutEntityAttributesFactory{
    private static _instance: CutEntityAttributesFactory;

    public static get instance() {
        if (!this._instance) {
            this._instance = new CutEntityAttributesFactory();
        }
        return this._instance;
    }

    public prefabMeshAttributesMaps: { [key: string]: MyMeshAttributes } = {};

    private defaultMeshs = {
        "CUBE": DefaultMeshes.CUBE,
        "CYLINDER": DefaultMeshes.CYLINDER,
        "PYRAMID": DefaultMeshes.PYRAMID,
        "SPHERE": DefaultMeshes.SPHERE
    }

    public meshs = ["CUBE", "CYLINDER", "PYRAMID", "SPHERE"]

    /**
     * 获取模型的数据：mesh  martarial cutFaceMaterial
     */
    async initAllPrefabMeshInfomation() {

        for (const key in this.defaultMeshs) {

            const meshAttributes = this.createMyMeshAttribute(this.defaultMeshs[key])
            const testMaterial = await (await ResourceManager.instance.loadUri("assets/materials/logo.mat.json")).data;
           
            // meshAttributes.material = testMaterial;
            meshAttributes.material = DefaultMaterials.MESH_PHYSICAL;
            meshAttributes.cutFaceMaterial = testMaterial;

           
            
            this.prefabMeshAttributesMaps[key] = meshAttributes;
        }

        console.log(" ALL prefabMeshAttributesMaps", this.prefabMeshAttributesMaps);

        }
    
    // 获取food实体上的这些信息 包括mesh 材质 切面材质等
    public foodModelMeshAttributesMaps:{[key:number]:MyMeshAttributes} = {};

    async addFoodMeshInformation(food_id:number){
        if (this.foodModelMeshAttributesMaps[food_id]) {
            return;
        }
        let foodData = DataManager.Instance.foodDatas[food_id];

        const foodPrefab = await EngineFactory.createPrefab(foodData.food_prefabUrl) as GameEntity;
        foodPrefab.enabled = false;
        //记录mesh相关的属性
        const foodMeshAttributes = this.createMyMeshAttribute(foodPrefab.getComponentInChildren(MeshFilter).mesh);
        if (food_id == 40) {
            console.log(foodMeshAttributes);
            
        }
        //记录material相关的属性
        const mat = foodPrefab.getComponentInChildren(MeshRenderer);
        foodMeshAttributes.material = mat.material;

        const faceMaterial = await (await ResourceManager.instance.loadUri(foodData.food_cutFaceMaterialUrl)).data;
        foodMeshAttributes.cutFaceMaterial = faceMaterial;
        // ????
        foodMeshAttributes.lengthStart = mat.localBoundingBox.center.y + mat.localBoundingBox.size.y/2;
        foodMeshAttributes.lengthEnd = mat.localBoundingBox.center.y - mat.localBoundingBox.size.y/2;
        foodMeshAttributes.heigtStart = mat.localBoundingBox.center.z + mat.localBoundingBox.size.z/2;

        this.foodModelMeshAttributesMaps[food_id] = foodMeshAttributes;

        foodPrefab.destroy();//获取完信息之后 再销毁实体

    }


    /**
     * 获取模型的mesh属性包括顶点坐标 顶点法线 uv坐标 顶点索引
     */
    private createMyMeshAttribute(targetMesh: Mesh) :MyMeshAttributes{
        const cutMeshAttribute = new MyMeshAttributes();

        const vertices = targetMesh.getAttribute("POSITION");
        const oldNormal = targetMesh.getAttribute("NORMAL");
        const oldUV: any = targetMesh.getAttribute("TEXCOORD_0");
        const oldIndices = targetMesh.getIndices();

        cutMeshAttribute.vertice = [];
        cutMeshAttribute.uv = [];
        cutMeshAttribute.normal = [];
        cutMeshAttribute.indices = [];


        for (let i = 0; i < vertices.length; i++) {
            cutMeshAttribute.vertice.push(vertices[i])
        }
        for (let i = 0; i < oldNormal.length; i++) {
            cutMeshAttribute.normal.push(oldNormal[i])
        }
        for (let i = 0; i < oldUV.length; i++) {
            cutMeshAttribute.uv.push(oldUV[i])
        }
        for (let i = 0; i < oldIndices.length; i++) {
            cutMeshAttribute.indices.push(oldIndices[i])
        }
        return cutMeshAttribute;
    }

    getRandomMesh() {
        return this.meshs[Math.floor(Math.random() * this.meshs.length)];

    }

    getRandomFoodMesh(){
        const random_id = Math.floor(Math.random()* DataManager.Instance.foodKeys.length);
        const food_key = DataManager.Instance.foodKeys[random_id];
        return this.foodModelMeshAttributesMaps[food_key]

    }


    public knifeInfosMaps:{[key:number]:KnifeMeshAttributes} = {};

    public async addKnifeInfos(knifeid){
        if(this.knifeInfosMaps[knifeid]){
            return;
        }
        const knifeData = DataManager.Instance.knifeDatas[knifeid];

        const knifePrefab = await EngineFactory.createPrefab(knifeData.knife_prefabUrl) as GameEntity;
        knifePrefab.enabled = false;
        const knifeInfo = new KnifeMeshAttributes();
        knifeInfo.knifeMesh = knifePrefab.getComponentInChildren(MeshFilter).mesh;
        knifeInfo.knifeMaterial = knifePrefab.getComponentInChildren(MeshRenderer).material;
        knifeInfo.knifeLocalScale = knifePrefab.getComponentInChildren(MeshFilter).entity.getComponent(Transform).localScale;
        knifeInfo.knifeLocalPosition = knifePrefab.getComponentInChildren(MeshFilter).entity.getComponent(Transform).localPosition;
        knifeInfo.knifeLocalEularAngle = knifePrefab.getComponentInChildren(MeshFilter).entity.getComponent(Transform).localEulerAngles;

        this.knifeInfosMaps[knifeid] = knifeInfo;

        knifePrefab.destroy();



    }

}


export class MyMeshAttributes {
    vertice: number[] = [];
    uv: number[] = [];
    normal: number[] = [];
    indices: number[] = [];

    material: Material = null;
    cutFaceMaterial: Material = null;

    lengthEnd:number = 0;
    lengthStart:number = 0;
    heigtStart:number = 0;


}

export class KnifeMeshAttributes{
    knifeMesh:Mesh;
    knifeMaterial:Material;
    knifeLocalEularAngle:Vector3;
    knifeLocalPosition:Vector3;
    knifeLocalScale:Vector3;
}
