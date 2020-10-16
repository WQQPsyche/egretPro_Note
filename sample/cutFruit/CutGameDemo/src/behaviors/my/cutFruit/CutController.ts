import { EditType, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Application, Behaviour, GameEntity, Vector3 } from "@egret/engine";
import { AttributeSemantics } from "@egret/gltf";
import { Material, Mesh, MeshFilter, MeshNeedUpdate, MeshRenderer } from "@egret/render";
import { Cut } from "../Cut";
import { CutEntityAttributesFactory, MyMeshAttributes } from "./CutEntityAttributesFacetory";
import { CutFlySystem } from "./CutFlySystem";
import { CutFruit } from "./CutFruit";
import { TweenLite, Tween } from "@egret/tween";
import { CutFlyEntityPool } from "./CutFlyEntityPool";
import { CutFillFacePool } from "./CutFillFacePool";


@component()
export class CutController extends Behaviour{
    
    @serializedField
    @property(EditType.Entity)
    public targetEntity:GameEntity = null;

    @serializedField
    @property(EditType.Entity)
    public carmeraEntity:GameEntity = null;

    @serializedField
    @property(EditType.Entity)
    public knifeModel:GameEntity = null;

    /**切面材质 */
    public faceMaterial: Material = null;
    /**模型信息 */
    public cutMeshAttribute: MyMeshAttributes = new MyMeshAttributes();
    private isMoving = false;//
    public lastCutTime: number = 0;

    @property(EditType.Boolean)
    @serializedField
    public isAutoCut:boolean = false;

    /**自动切割间隔 1s*/
    public autoCutInterval = 0.5;
   /**是否正在播刀切下去的动画 */
   isPlayerKnifeAni = false;

   public isNextEntity:boolean = false;

    private _knifePos:Vector3;
    private _scale:Vector3;
    async onStart(){

       
        //初始化一些参数
        this.isMoving = true;
        this.lastCutTime = Date.now();




        Application.instance.systemManager.registerSystem(CutFlySystem);

        await CutEntityAttributesFactory.instance.initAllPrefabMeshInfomation();
        
        //1、初始化第一个被切割的实体
        this.setCutTargetAttribute(CutEntityAttributesFactory.instance.getRandomMesh() ,this.targetEntity);
        //2.设置刀的位置
        this._knifePos = this.targetEntity.transform.position;
        this._scale = this.targetEntity.transform.localScale;
        this.knifeModel.transform.setLocalPosition(this._knifePos.x+ this._scale.x/2,this._knifePos.y+ this._scale.y/2,this._knifePos.z);
        

        
    }

    onUpdate(){

        this._knifePos = this.targetEntity.transform.position;
        this._scale = this.targetEntity.transform.localScale;   ``
        if (this.knifeModel.transform.position.y < this._knifePos.y-this._scale.y/2) {
           
            
            
            //重新设置刀片的位置
            this.knifeModel.transform.setLocalPosition(this._knifePos.x+ this._scale.x/2,this._knifePos.y+ this._scale.y/2,this._knifePos.z);
             // 产生以下切割对象
            this.targetEntity.removeComponent(Cut);

            this.targetEntity.getComponent(MeshFilter).mesh = null;
            
             this.setCutTargetAttribute(CutEntityAttributesFactory.instance.getRandomMesh() ,this.targetEntity);

             
        }
    

        if(this.isAutoCut  && (Date.now()-this.lastCutTime)/1000>this.autoCutInterval){
            this.cutTargetEntity(false);
        }

    }

    /**
     * 设置被切割实体的mesh属性
     * @param prefabUrl 预置体Mesh
     * @param targetEntity 被切割对象
     */
    private setCutTargetAttribute(prefabUrl: string, targetEntity: GameEntity) {

        let targetMesh = targetEntity.getComponent(MeshFilter).mesh;

        if (!targetMesh) {
            targetMesh = Mesh.create(1000 * 3, 1500 * 3);
            targetEntity.getComponent(MeshFilter).mesh = targetMesh;
        }

        const meshAttributes = CutEntityAttributesFactory.instance.prefabMeshAttributesMaps[prefabUrl];

        const vertices = meshAttributes.vertice.slice();
        const oldNormal = meshAttributes.normal.slice();
        const oldUV = meshAttributes.uv.slice();
        const oldIndices = meshAttributes.indices.slice();

        this.faceMaterial = meshAttributes.cutFaceMaterial;


        targetMesh.setAttribute(AttributeSemantics.POSITION, vertices);
        targetMesh.setAttribute(AttributeSemantics.NORMAL, oldNormal);
        targetMesh.setAttribute(AttributeSemantics.TEXCOORD_0, oldUV);
        targetMesh.setIndices(oldIndices);

        targetEntity.getComponent(MeshRenderer).material = meshAttributes.material;
        
        /** */
        targetMesh.needUpdate(MeshNeedUpdate.All);

        console.log(targetMesh);
        

        this.cutMeshAttribute.vertice = vertices;
        this.cutMeshAttribute.normal = oldNormal;
        this.cutMeshAttribute.uv = oldUV;
        this.cutMeshAttribute.indices = oldIndices;        
        
    }

    private cutTargetEntity(isClick:boolean) {
       
        const cutTest = this.targetEntity.getOrAddComponent(Cut);
        // cutTest.point.set(0,this.entity.transform.position.y - this.targetEntity.transform.position.y,0);
        cutTest.point.set(0,this.knifeModel.transform.position.y,0)
        cutTest.normal.set(0,1,0);
        cutTest.addBoxFly = true;
        cutTest.cutPlaneControllerEntity = this.entity;

        // cutTest.cutMeshAttribute = this.cutMeshAttribute;
        cutTest.faceMaterial = this.faceMaterial;

        this.lastCutTime = Date.now();
        this.playKnifeMoveAnimation();
    }

    private playKnifeMoveAnimation() {
        
        this.isPlayerKnifeAni = true;
        TweenLite.to(this.knifeModel.transform.localEulerAngles, 0.05, {
            y: 45, onUpdate: () => {
                this.knifeModel.transform.localEulerAngles = this.knifeModel.transform.localEulerAngles;
            }, onComplete: () => {
                TweenLite.to(this.knifeModel.transform.localEulerAngles, 0.02, {
                    y: 0, onUpdate: () => {
                        this.knifeModel.transform.localEulerAngles = this.knifeModel.transform.localEulerAngles;
                    }, onComplete: () => {   
                        this.knifeModel.transform.translate(0,-0.1,0);
                        this.isPlayerKnifeAni = false;
                    }
                });
            }
        });
        
    }





}