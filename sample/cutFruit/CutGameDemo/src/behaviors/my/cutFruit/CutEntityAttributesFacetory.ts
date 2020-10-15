import { ResourceManager } from "@egret/core";
import { DefaultMaterials, DefaultMeshes, Material, Mesh } from "@egret/render";

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

}


export class MyMeshAttributes {
    vertice: number[] = [];
    uv: number[] = [];
    normal: number[] = [];
    indices: number[] = [];

    material: Material = null;
    cutFaceMaterial: Material = null;


}
