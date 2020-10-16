import { ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, EngineFactory, GameEntity, Transform, Vector2, Vector3 } from "@egret/engine";
import { AttributeSemantics } from "@egret/gltf";
import { DefaultMaterials, DefaultMeshes, Material, Mesh, MeshFilter, MeshRenderer } from "@egret/render";
import { CutFillFacePool } from "./cutFruit/CutFillFacePool";
import { CutFlyEntityPool } from "./cutFruit/CutFlyEntityPool";
import { MyMeshInfo } from "./MyMeshInfo";
import {StartCut} from "./StartCut";
import { CutController } from "./cutFruit/CutController";
import { CutFly } from "./cutFruit/CutFly";

export let cutPointRoot: GameEntity = null;

export let cutTime = 0;

@component()
export class Cut extends Behaviour{

    public showVertices: boolean = false;//显示顶点
    public addBoxFly: boolean = false;//添加fly效果
    public point:Vector3 = Vector3.create(0.0, 0, 0); //切割点  
    public normal:Vector3 = Vector3.create(0, 0, 1);//切割点法线

    public cutPlaneControllerEntity: GameEntity = null;

    private verticesEntity_aRoot: GameEntity = null;
    private verticesEntity_bRoot: GameEntity = null;
    public faceMaterial:Material = null;

    async onStart(){

        if (!cutPointRoot) {
            cutPointRoot = EngineFactory.createGameEntity3D("cutPointRoot");
        } else {
            cutPointRoot.destroy();
            cutPointRoot = EngineFactory.createGameEntity3D("cutPointRoot");
        }

        // 获取实体的
        const meshFilter = this.entity.getComponent(MeshFilter);
        const oldMeshRenderer = this.entity.getComponent(MeshRenderer);

        const cubeMesh = meshFilter.mesh;
        const vertices = cubeMesh.getAttribute("POSITION");//网格的顶点位置
        const oldNormal = cubeMesh.getAttribute("NORMAL");//网格的法向量
        const oldUV = cubeMesh.getAttribute("TEXCOORD_0");// uv
        const oldIndices = cubeMesh.getIndices();//获取顶点的索引数据

        //记录每个顶点是否在切面上
        let above: boolean[] = [];
        //记录新的indices
        let newTriangles: number[] = [];
        
        const a = new MyMeshInfo();
        const b = new MyMeshInfo();
        
        //整理坐标点
        const myvertices: Vector3[] = [];
        const myuvs: Vector2[] = [];
        const myNormals: Vector3[] = [];

        /**
         * 将实体的顶点分成切面上 切面下
         */
        for (let i = 0; i < vertices.length / 3; i++) {
            const vert = Vector3.create(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
            myvertices.push(vert);//顶点坐标
            myuvs.push(Vector2.create(oldUV[i * 2], oldUV[i * 2 + 1]));//uv坐标
            myNormals.push(Vector3.create(oldNormal[i * 3], oldNormal[i * 3 + 1], oldNormal[i * 3 + 2]));//法线坐标

            /**
             * dot 点积 计算两个矢量的夹角的余弦值，在程序中经常用来判断两个物体是否在同一侧 true同侧 false背后
             * subtract 两个向量相减
             */
            //这里是用来判断实体的坐标点是在切面的上面，还是下面
            above[i] = Vector3.dot(vert.clone().subtract(this.point), this.normal) >= 0;

            if (above[i]) {//切面上的点
                //记录每一个点在对应切开之后的实体上的顶点索引 
                newTriangles[i] = a.vertices.length;

                a.vertices.push(vert);
                a.uvs.push(Vector2.create(oldUV[i * 2], oldUV[i * 2 + 1]));
                a.normals.push(Vector3.create(oldNormal[i * 3], oldNormal[i * 3 + 1], oldNormal[i * 3 + 2]));
              
            }else {
                newTriangles[i] = b.vertices.length;

                b.vertices.push(vert);
                b.uvs.push(Vector2.create(oldUV[i * 2], oldUV[i * 2 + 1]));
                b.normals.push(Vector3.create(oldNormal[i * 3], oldNormal[i * 3 + 1], oldNormal[i * 3 + 2]));    
            }
        }
        if (a.vertices.length == 0 || b.vertices.length == 0) {
            console.error(a.vertices.length,b.vertices.length);
            
            console.error("物体没有被切割,所有的点都在一侧");

            let lastBox:GameEntity = CutFlyEntityPool.Instance.getCutFlyEntity();
            lastBox.getComponent(MeshFilter).mesh = this.entity.getComponent(MeshFilter).mesh;
            return;

        }

        /**
         * 开始处理分割之后的顶点索引值
         */
        const cutPoint: Vector3[] = [];
        for (let i = 0; i < oldIndices.length/3; i++) {
            //每次拿出3个顶点索引--也就是拿到一个三角面
            let _i0 = oldIndices[i * 3];
            let _i1 = oldIndices[i * 3 + 1];
            let _i2 = oldIndices[i * 3 + 2];
            //获取这3个顶点索引在切面的上还是下？
            let _a0 = above[_i0];
            let _a1 = above[_i1];
            let _a2 = above[_i2];
            //接下来就是判断这个三角面有没有被切割
            
            if (_a0 && _a1 && _a2) {//全部是true
                //都在切面上 那么这个索引点就应该是属于A
                a.indices.push(newTriangles[_i0]);
                a.indices.push(newTriangles[_i1]);
                a.indices.push(newTriangles[_i2]);
                
            }else if (!_a0 && !_a1 && !_a2) {
                b.indices.push(newTriangles[_i0]);
                b.indices.push(newTriangles[_i1]);
                b.indices.push(newTriangles[_i2]);
            }else{
                //这个三角面被切割了
                let up, down0, down1;
                if (_a1 == _a2 && _a0 != _a1) {
                    up = _i0;
                    down0 = _i1;
                    down1 = _i2;
                }else if (_a2 == _a0 && _a1 != _a2){
                    up = _i1;
                    down0 = _i2;
                    down1 = _i0;
                }else {
                    up = _i2;
                    down0 = _i0;
                    down1 = _i1;
                }
                if (above[up]) {

                    this.SplitTriangle(myvertices, myuvs, myNormals, a, b, this.point, this.normal, newTriangles, up, down0, down1,true, cutPoint);
                }
                else {
                    this.SplitTriangle(myvertices, myuvs, myNormals,  b, a, this.point, this.normal, newTriangles, up, down0, down1, false,cutPoint);
                }
            }                       
            
        }

        // console.warn("cutPoint.length:", cutPoint.length);
        if (cutPoint.length == 0) {
            // console.error("cutPoint.length ==0 ");
            // console.log("切割位置 this.point", this.point);

            return;
        }

        //******************创建上下新建的物体和补的面 开始 */
        cutTime++;

/*      const upBox = EngineFactory.createGameEntity3D("upBox" + cutTime);
        const upBoxMeshFilter = upBox.addComponent(MeshFilter);
        upBox.addComponent(MeshRenderer).material = oldMeshRenderer.material;


        const downBox = EngineFactory.createGameEntity3D("downBox" + cutTime );
        const downBoxMeshFilter = downBox.addComponent(MeshFilter);
        downBox.addComponent(MeshRenderer).material = oldMeshRenderer.material; */


        const upBox = CutFlyEntityPool.Instance.getCutFlyEntity();    
        const upBoxMeshFilter = upBox.getComponent(MeshFilter);
        upBox.getComponent(MeshRenderer).material = oldMeshRenderer.material;

        // const downBox = CutFlyEntityPool.Instance.getCutFlyEntity();
        // const downBoxMeshFilter = downBox.getComponent(MeshFilter);
        // downBox.getComponent(MeshRenderer).material = oldMeshRenderer.material; 
        
        const downBox = EngineFactory.createGameEntity3D("downBox" + cutTime );
        const downBoxMeshFilter = downBox.addComponent(MeshFilter);
        downBox.addComponent(MeshRenderer).material = oldMeshRenderer.material;
        

        const a_normal = [];
        for (let i = 0; i < a.normals.length; i++) {
            a_normal.push(a.normals[i].x, a.normals[i].y, a.normals[i].z)
        }
        const a_uv = [];
        for (let i = 0; i < a.uvs.length; i++) {
            a_uv.push(a.uvs[i].x, a.uvs[i].y)
        }

        const a_vertices = [];
        for (let i = 0; i < a.vertices.length; i++) {
            a_vertices.push(a.vertices[i].x, a.vertices[i].y, a.vertices[i].z)

        }

        const a_mesh = Mesh.create(a_vertices.length / 3, a.indices.length);
        if (a_vertices.length == 0) {
            debugger;
        }
        a_mesh.setAttribute(AttributeSemantics.POSITION, a_vertices);
        a_mesh.setAttribute(AttributeSemantics.NORMAL, a_normal);
        a_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, a_uv);
        a_mesh.setIndices(a.indices);
        upBoxMeshFilter.mesh = a_mesh;

        const b_normal = [];
        for (let i = 0; i < b.normals.length; i++) {
            b_normal.push(b.normals[i].x, b.normals[i].y, b.normals[i].z)
        }
        const b_uv = [];
        for (let i = 0; i < b.uvs.length; i++) {
            b_uv.push(b.uvs[i].x, b.uvs[i].y)
        }

        const b_vertices = [];
        for (let i = 0; i < b.vertices.length; i++) {
            b_vertices.push(b.vertices[i].x, b.vertices[i].y, b.vertices[i].z)
        }

        const b_mesh = Mesh.create(b_vertices.length / 3, b.indices.length);
        if (b_vertices.length == 0) {
            debugger;
        }
        b_mesh.setAttribute(AttributeSemantics.POSITION, b_vertices);
        b_mesh.setAttribute(AttributeSemantics.NORMAL, b_normal);
        b_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, b_uv);
        b_mesh.setIndices(b.indices);
        downBoxMeshFilter.mesh = b_mesh;

        /**
         * 第三讲 创建补面
         */
        const testMaterial = await (await ResourceManager.instance.loadUri("assets/materials/logo.mat.json")).data;                   
/* 
        //上补面实体
        const cut_up = EngineFactory.createGameEntity3D("cut_up" + cutTime );
        const cut_upMeshFilter = cut_up.addComponent(MeshFilter);
        cut_up.addComponent(MeshRenderer).material = testMaterial;

        //下补面实体
        const cut_down = EngineFactory.createGameEntity3D("cut_down" + cutTime );
        const cut_downMeshFilter = cut_down.addComponent(MeshFilter);
        cut_down.addComponent(MeshRenderer).material = testMaterial;
         */

        
        //上补面实体
        const cut_up = CutFillFacePool.Instance.getCutFillFaceEntity();
        const cut_upMeshFilter = cut_up.getComponent(MeshFilter);
        cut_up.getComponent(MeshRenderer).material = this.faceMaterial;

        //下补面实体
        // const cut_down = CutFillFacePool.Instance.getCutFillFaceEntity();
        // const cut_downMeshFilter = cut_down.getComponent(MeshFilter);
        // cut_down.getComponent(MeshRenderer).material = this.faceMaterial;
        const cut_down = EngineFactory.createGameEntity3D("cut_down" + cutTime );
        const cut_downMeshFilter = cut_down.addComponent(MeshFilter);
        cut_down.addComponent(MeshRenderer).material = testMaterial;
        cut_down.parent = downBox;
        
        if (cutPoint.length > 2) {
    
            const cut: MyMeshInfo = this.FastFillCutEdges(cutPoint, this.point, this.normal);
            {
                const cutnormal = [];
                for (let i = 0; i < cut.normals.length; i++) {
                    cutnormal.push(cut.normals[i].x, cut.normals[i].y, cut.normals[i].z)
                }
                const cut_uv = [];
                for (let i = 0; i < cut.uvs.length; i++) {
                    cut_uv.push(cut.uvs[i].x, cut.uvs[i].y)
                }

                const cutvertices = [];
                for (let i = 0; i < cut.vertices.length; i++) {
                    cutvertices.push(cut.vertices[i].x, cut.vertices[i].y, cut.vertices[i].z)
                }

                const cut_mesh = Mesh.create(cutvertices.length / 3, cut.indices.length);
                cut_mesh.setAttribute(AttributeSemantics.POSITION, cutvertices);
                if (cutvertices.length == 0) {
                    debugger;
                }

                cut_mesh.setAttribute(AttributeSemantics.NORMAL, cutnormal);
                cut_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, cut_uv);
                cut_mesh.setIndices(cut.indices);
                cut_downMeshFilter.mesh = cut_mesh;
               
                cut_down.getComponent(Transform).setParent(downBox.transform, true);


            }
          
            cut.Reverse();
            {
                const cutnormal = [];
                for (let i = 0; i < cut.normals.length; i++) {
                    cutnormal.push(cut.normals[i].x, cut.normals[i].y, cut.normals[i].z)
                }
                const cut_uv = [];
                for (let i = 0; i < cut.uvs.length; i++) {
                    cut_uv.push(cut.uvs[i].x, cut.uvs[i].y)
                }

                const cutvertices = [];
                for (let i = 0; i < cut.vertices.length; i++) {
                    cutvertices.push(cut.vertices[i].x, cut.vertices[i].y, cut.vertices[i].z)
                }

                const cut_mesh = Mesh.create(cutvertices.length / 3, cut.indices.length);
                cut_mesh.setAttribute(AttributeSemantics.POSITION, cutvertices);
                if (cutvertices.length == 0) {
                    debugger;
                }
                cut_mesh.setAttribute(AttributeSemantics.NORMAL, cutnormal);
                cut_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, cut_uv);
                cut_mesh.setIndices(cut.indices);
                cut_upMeshFilter.mesh = cut_mesh;
                cut_up.getComponent(Transform).setParent(upBox.transform, true);
            }

        //////////显示顶点/////////
        if (this.showVertices) {
            
/*           
             //显示upBox的顶点
             this.verticesEntity_aRoot = EngineFactory.createGameEntity3D("verticesEntity_aRoot");
             this.verticesEntity_aRoot.parent = upBox;
             for (let i = 0; i < a.vertices.length; i++) {
                    const verticePositionEntity = EngineFactory.createGameEntity3D("a_vertices_" + i);
                    verticePositionEntity.addComponent(MeshFilter).mesh = DefaultMeshes.CUBE;
                    verticePositionEntity.addComponent(MeshRenderer).material = DefaultMaterials.MESH_NORMAL;
                    verticePositionEntity.parent = this.verticesEntity_aRoot;
                    verticePositionEntity.transform.setLocalScale(0.03, 0.03, 0.03);
                    verticePositionEntity.transform.localPosition = a.vertices[i];
        
                }
*/
            this.verticesEntity_bRoot = EngineFactory.createGameEntity3D("verticesEntity_bRoot");
            this.verticesEntity_bRoot.parent = downBox;
            for (let i = 0; i < b.vertices.length; i++) {
                    const verticePositionEntity = EngineFactory.createGameEntity3D("b_vertices_" + i);
                    verticePositionEntity.addComponent(MeshFilter).mesh = DefaultMeshes.CUBE;
                    verticePositionEntity.addComponent(MeshRenderer).material = DefaultMaterials.MESH_NORMAL;
                    verticePositionEntity.parent = this.verticesEntity_bRoot;
                    verticePositionEntity.transform.setLocalScale(0.03, 0.03, 0.03);
                    verticePositionEntity.transform.localPosition = b.vertices[i];
        
                 }
            for (let i = 0; i < cutPoint.length; i++) {
                    const verticePositionEntity = EngineFactory.createGameEntity3D("cutPoint" + i);
                    verticePositionEntity.addComponent(MeshFilter).mesh = DefaultMeshes.SPHERE;
                    verticePositionEntity.addComponent(MeshRenderer).material = DefaultMaterials.MISSING;
                    verticePositionEntity.parent = cutPointRoot;
                    verticePositionEntity.transform.setLocalScale(0.05, 0.05, 0.05);
                    verticePositionEntity.transform.localPosition = cutPoint[i];
        
                }
        } //显示顶点end----

        if (this.cutPlaneControllerEntity) {
                // this.cutPlaneControllerEntity.getComponent(StartCut).target = downBox;
                // cutPoint.length = 0;
                this.cutPlaneControllerEntity.getComponent(CutController).targetEntity = downBox;
                cutPoint.length = 0;
                // cutPoint.length = 0;
        }

        //移动下面的半块
        // downBox.transform.translate(Vector3.create(-2,0,0));
        // upBox.destroy();
        //销毁原来的实体
        this.entity.destroy();


        }
    }
    /**
     * 
     * @param vertices 实体所有的顶点坐标
     * @param uvs 实体所有的uv坐标
     * @param normals 实体所有的法线坐标
     * @param top 上切块
     * @param bottom 下切块
     * @param point 切点
     * @param normal 切点的法向量
     * @param newTriangles 新切块的顶点索引
     * @param up 
     * @param down0 
     * @param down1 被切割三角面的三个钉钉
     * @param isAbove 是否在切面上
     * @param cutPoint ？？？
     */
    public SplitTriangle(vertices: Vector3[], uvs: Vector2[], normals: Vector3[], top: MyMeshInfo, bottom: MyMeshInfo, point: Vector3, normal: Vector3, newTriangles: number[], up: number, down0: number, down1: number, isAbove: boolean, cutPoint: Vector3[]){
        // 确定切割点的位置坐标
        const v0 = vertices[up].clone();
        const v1 = vertices[down0].clone();
        const v2 = vertices[down1].clone();
        const subtract = point.clone().subtract(v0);
        const topDot = Vector3.dot(subtract, normal);

        const aScale = this.Clamp01(topDot / Vector3.dot(v1.clone().subtract(v0), normal));
        const bScale = this.Clamp01(topDot / Vector3.dot(v2.clone().subtract(v0), normal));

        const pos_a: Vector3 = v0.clone().add((v1.clone().subtract(v0)).multiplyScalar(aScale));
        const pos_b: Vector3 = v0.clone().add((v2.clone().subtract(v0)).multiplyScalar(bScale));
        // 确定切割点的uv坐标
        const u0 = uvs[up].clone();
        const u1 = uvs[down0].clone();
        const u2 = uvs[down1].clone();
        const uv_a = u0.clone().add((u1.clone().subtract(u0)).multiplyScalar(aScale));
        const uv_b = u0.clone().add((u2.clone().subtract(u0)).multiplyScalar(bScale));

        // 确定切割点的法线坐标
        const n0 = normals[up].clone();
        const n1 = normals[down0].clone();
        const n2 = normals[down1].clone();
        const normal_a = (n0.clone().add((n1.clone().subtract(n0)).multiplyScalar(aScale))).normalize();
        const normal_b = (n0.clone().add((n2.clone().subtract(n0)).multiplyScalar(bScale))).normalize();
        //上切块添加新产生的两个点
        const top_a = top.vertices.length;
        top.Add(pos_a, uv_a, normal_a);

        const top_b = top.vertices.length;
        top.Add(pos_b, uv_b, normal_b);
        //单独一侧的点和另外两个新点
        top.indices.push(newTriangles[up]);
        top.indices.push(top_a);
        top.indices.push(top_b);
        //下切块添加新产生的两个点
        const down_a = bottom.vertices.length;
        bottom.Add(pos_a, uv_a, normal_a);

        const down_b = bottom.vertices.length;
        bottom.Add(pos_b, uv_b, normal_b);


        //同一侧的两个点分别和新的点相连
        bottom.indices.push(newTriangles[down0]);
        bottom.indices.push(newTriangles[down1]);
        bottom.indices.push(down_b);

        bottom.indices.push(newTriangles[down0]);
        bottom.indices.push(down_b);
        bottom.indices.push(down_a);

        if (isAbove) {
            cutPoint.push(pos_a, pos_b);
        } else {
            cutPoint.push(pos_b, pos_a);
        }



    }
    private Clamp01(num: number) {
        if (num > 1) {
            num = 1;
        }
        if (num < 0) {
            num = 0;
        }
        return num;

    }

    private FastFillCutEdges(edges: Vector3[], pos: Vector3, normal: Vector3):MyMeshInfo{
        // 去重
        let arr:Vector3[] = [];
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            
            let hasEage = false;
            for (const item of arr) {
                if (item.equal(edge)) {
                    hasEage = true;
                    break;
                }
            }
            if (!hasEage) {
                arr.push(edge);
            }
            
        }
        //去重之后，让坐标点按照中心顺时针排序
        arr.sort((left, right) => {
            const leftAngle = Math.atan2(left.z, left.x);
            const rightAngle = Math.atan2(right.z, right.x);
            return leftAngle > rightAngle ? 1 : - 1;
        }); 
        //把切点(0,y,0)也存入arr中   
        arr.push(pos);  
        //创建mesh
        const cutEdges = new MyMeshInfo();
        for (let i = 0; i < arr.length; i++) {
            cutEdges.Add(arr[i], Vector2.ZERO.clone(), normal);
        }

        // console.error(arr);

        
        //顶点索引 三角面
        for (let i = 0; i < arr.length - 2; i++) {
            cutEdges.indices.push(arr.length - 1);
            cutEdges.indices.push(i);
            cutEdges.indices.push(i + 1);
        }
        cutEdges.indices.push(arr.length - 1);
        cutEdges.indices.push(arr.length - 2);
        cutEdges.indices.push(0);

        // console.error(cutEdges);

        //TODO
        let xMax = 0;
        let xMin = 0;
        let yMax = 0;
        let yMin = 0;
        
        for (let i = 0; i < cutEdges.vertices.length; i++) {
            if (cutEdges.vertices[i].x > xMax) {
                xMax = cutEdges.vertices[i].x;
            }
            if (cutEdges.vertices[i].x < xMin) {
                xMin = cutEdges.vertices[i].x;
            }
            if (cutEdges.vertices[i].z > yMax) {
                yMax = cutEdges.vertices[i].y;
            }
            if (cutEdges.vertices[i].z < yMin) {
                yMin = cutEdges.vertices[i].y;
            }
        }

        //todo 和原始尺寸比较大小 然后再定缩放
        const uvScale = xMax - xMin;
        
        cutEdges.MapperCube(uvScale);
        return cutEdges;        

    }

    onUpdate(){

    }
}