
import { component } from "@egret/ecs";
import { Vector3, Transform, Behaviour, GameEntity, Const, Rectangle } from "@egret/engine";
import { MeshFilter, Mesh, MeshRenderer, MeshNeedUpdate, Material } from "@egret/render";
import { AttributeSemantics } from "@egret/gltf";
import { CutFly } from "./CutFly";
import { MyMathUtil } from "../utils/MyMathUtil";
import { CutFlyEntityPool } from "./CutFlyEntityPool";
import { CutFillFacePool } from "./CutFillFacePool";
import { CutFillFace } from "./CutFillFace";
import { MyMeshInfo } from "../MyMeshInfo";




@component()
export class CutFruit extends Behaviour {


    /**切下来的面是否飞出 */
    public addBoxFly: boolean = false;
    public moveAfterCut: boolean = false;

    /** 是否进行补面*/
    public fill: boolean = true;


    /**补面uv缩放范围 */
    public uvRange = Rectangle.create(0, 0, 1, 1);

    //法线
    public normal = Vector3.create(0, 0, 1);

    //起始点
    public point = Vector3.create(0, 0, 0);

    /**切割完的上半部分(要飞出的部分) */
    public upBox: GameEntity = null;

    /**上次切完的补面 */
    public lastCutFaceEntity: GameEntity = null;

    /**要切割的模型的信息 */
    public cutMeshAttribute = {
        vertice: [],
        uv: [],
        normal: [],
        indices: []
    }


    startCut() {
        const lastCutFace = this.entity.getComponentInChildren(CutFillFace);
        if (lastCutFace) {
            this.lastCutFaceEntity = lastCutFace.entity as GameEntity;
        }
        const result = this.cut();

        this.entity.removeComponent(CutFruit)
        return result;

    }

    /**切面的材质 */
    public faceMaterial: Material = null;

    cut() {

        const oldMeshRenderer = this.entity.getComponentInChildren(MeshRenderer);

        const oldVertices = this.cutMeshAttribute.vertice;
        const oldNormal = this.cutMeshAttribute.normal;
        const oldUV = this.cutMeshAttribute.uv;
        const oldIndices = this.cutMeshAttribute.indices;


        //点是否在平面上
        let above: boolean[] = [];
        //记录新的indices
        let newTriangles: number[] = [];

        const a = new MyMeshInfo();
        const b = new MyMeshInfo();

        for (let i = 0; i < oldVertices.length / 3; i++) {

            above[i] = MyMathUtil.vector3Dot_vector(
                oldVertices[i * 3] - this.point.x,
                oldVertices[i * 3 + 1] - this.point.y,
                oldVertices[i * 3 + 2] - this.point.z,
                this.normal
            ) >= 0;

            //记录被法线分开的点，按之前的顺序顺序
            if (above[i]) {
                newTriangles[i] = a.vertices.length / 3;

                a.add(
                    [oldVertices[i * 3], oldVertices[i * 3 + 1], oldVertices[i * 3 + 2]],
                    [oldUV[i * 2], oldUV[i * 2 + 1]],
                    [oldNormal[i * 3], oldNormal[i * 3 + 1], oldNormal[i * 3 + 2]]
                )

            }
            else {
                newTriangles[i] = b.vertices.length / 3;
                b.add(
                    [oldVertices[i * 3], oldVertices[i * 3 + 1], oldVertices[i * 3 + 2]],
                    [oldUV[i * 2], oldUV[i * 2 + 1]],
                    [oldNormal[i * 3], oldNormal[i * 3 + 1], oldNormal[i * 3 + 2]]
                )
            }
        }

        if (a.vertices.length == 0 || b.vertices.length == 0) {
            // console.error("物体没有被切割,所有的点都在一侧");
            return;
        }




        let cutPoint: number[] = [];
        let triangleCount = oldIndices.length / 3;

        for (let i = 0; i < triangleCount; i++) {
            let _i0 = oldIndices[i * 3];
            let _i1 = oldIndices[i * 3 + 1];
            let _i2 = oldIndices[i * 3 + 2];

            let _a0 = above[_i0];
            let _a1 = above[_i1];
            let _a2 = above[_i2];

            //都在同侧 
            if (_a0 && _a1 && _a2) {

                a.indices.push(newTriangles[_i0]);
                a.indices.push(newTriangles[_i1]);
                a.indices.push(newTriangles[_i2]);

            }
            else if (!_a0 && !_a1 && !_a2) {
                b.indices.push(newTriangles[_i0]);
                b.indices.push(newTriangles[_i1]);
                b.indices.push(newTriangles[_i2]);

            }
            //异侧 需要切割
            else {

                let up, down0, down1;
                if (_a1 == _a2 && _a0 != _a1) {
                    up = _i0;
                    down0 = _i1;
                    down1 = _i2;
                }
                else if (_a2 == _a0 && _a1 != _a2) {
                    up = _i1;
                    down0 = _i2;
                    down1 = _i0;
                }
                else {
                    up = _i2;
                    down0 = _i0;
                    down1 = _i1;
                }

                if (above[up]) {
                    cutPoint = this.splitTriangle(oldVertices, oldUV, oldNormal, a, b, this.point, this.normal, newTriangles, up, down0, down1, true, cutPoint);
                }
                else {
                    cutPoint = this.splitTriangle(oldVertices, oldUV, oldNormal, b, a, this.point, this.normal, newTriangles, up, down0, down1, false, cutPoint);
                }
            }
        }


        if (cutPoint.length == 0) {
            console.log("物体没有被切割");
            return false;
        }

        a.combineVertices(0.001);
        b.combineVertices(0.001);



        //******************创建上下新建的物体和补的面 开始 */


        this.upBox = CutFlyEntityPool.Instance.getCutFlyEntity();
        const upBoxMeshFilter = this.upBox.getComponent(MeshFilter);
        this.upBox.getComponent(MeshRenderer).material = oldMeshRenderer.material;


        const cut_up = CutFillFacePool.Instance.getCutFillFaceEntity();
        cut_up.getComponent(MeshRenderer).material = this.faceMaterial;

        const cut_down = CutFillFacePool.Instance.getCutFillFaceEntity();
        cut_down.getComponent(MeshRenderer).material = this.faceMaterial;


        //******************创建上下新建的物体和补的面 结束*/
        const a_mesh = upBoxMeshFilter.mesh;
        // reset index vert
        this.compareVertInfoToOldMesh(a_mesh, a.vertices);
        this.compareIndcisInfoToOldMesh(a_mesh, a.indices);



        a_mesh.setAttribute(AttributeSemantics.POSITION, a.vertices);
        a_mesh.setAttribute(AttributeSemantics.NORMAL, a.normals);
        a_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, a.uvs);
        a_mesh.setIndices(a.indices);
        upBoxMeshFilter.mesh = a_mesh;
        a_mesh.needUpdate(MeshNeedUpdate.All)


        //设置返回的信息
        const returnMeshAttribute = {
            vertice: b.vertices.slice(),
            uv: b.uvs.slice(),
            normal: b.normals.slice(),
            indices: b.indices.slice(),
        }


        const b_mesh = this.entity.getComponent(MeshFilter).mesh;
        this.compareVertInfoToOldMesh(b_mesh, b.vertices);
        this.compareIndcisInfoToOldMesh(b_mesh, b.indices);


        b_mesh.setAttribute(AttributeSemantics.POSITION, b.vertices);
        b_mesh.setAttribute(AttributeSemantics.NORMAL, b.normals);
        b_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, b.uvs);
        b_mesh.setIndices(b.indices);
        this.entity.getComponent(MeshFilter).mesh = b_mesh;
        b_mesh.needUpdate(MeshNeedUpdate.All)





        //生成的两个切面
        if (this.fill && cutPoint.length > 2) {

            const cut: MyMeshInfo = this.fillCutEdges(cutPoint, this.point, this.normal);

            {
                const cut_mesh = cut_down.getComponent(MeshFilter).mesh;
                this.compareVertInfoToOldMesh(cut_mesh, cut.vertices);

                cut_mesh.setAttribute(AttributeSemantics.POSITION, cut.vertices);
                cut_mesh.setAttribute(AttributeSemantics.NORMAL, cut.normals);
                cut_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, cut.uvs);
                cut_mesh.setIndices(cut.indices);
                cut_down.getComponent(Transform).setParent(this.entity.transform);
                cut_mesh.needUpdate(MeshNeedUpdate.All)

            }
            //反转切面
            cut.reverse();

            {
                const cut_mesh = cut_up.getComponent(MeshFilter).mesh;
                this.compareVertInfoToOldMesh(cut_mesh, cut.vertices);

                cut_mesh.setAttribute(AttributeSemantics.POSITION, cut.vertices);
                cut_mesh.setAttribute(AttributeSemantics.NORMAL, cut.normals);
                cut_mesh.setAttribute(AttributeSemantics.TEXCOORD_0, cut.uvs);
                cut_mesh.setIndices(cut.indices);
                cut_up.getComponent(MeshFilter).mesh = cut_mesh;
                cut_up.getComponent(Transform).setParent(this.upBox.transform);

                cut_mesh.needUpdate(MeshNeedUpdate.All)
            }
        }
        else {
        }

        if (this.addBoxFly) {
            this.upBox.addComponent(CutFly);

            if (this.lastCutFaceEntity) {
                this.lastCutFaceEntity.getComponent(Transform).setParent(this.upBox.transform);
            }
            this.upBox.transform.position.set(
                this.entity.transform.position.x,
                this.entity.transform.position.y + 0.2,
                this.entity.transform.position.z,

            )
            this.upBox.transform.position = this.upBox.transform.position

        } else {
            this.upBox.destroy();
        }

        return returnMeshAttribute;
    }



    /**给分开的物体加上切割的点 计算cutPoint */
    public splitTriangle(vertices: number[], uvs: number[], normals: number[], top: MyMeshInfo, bottom: MyMeshInfo, point: Vector3, normal: Vector3, newTriangles: number[], up: number, down0: number, down1: number, isAbove: boolean, cutPoint: number[]) {

        const topDot = MyMathUtil.vector3Dot_vector(
            point.x - vertices[up * 3],
            point.y - vertices[up * 3 + 1],
            point.z - vertices[up * 3 + 2],
            normal
        )


        const aScale = this.clamp01(topDot / MyMathUtil.vector3Dot_vector(
            vertices[down0 * 3] - vertices[up * 3],
            vertices[down0 * 3 + 1] - vertices[up * 3 + 1],
            vertices[down0 * 3 + 2] - vertices[up * 3 + 2],
            normal
        ))

        const bScale = this.clamp01(topDot / MyMathUtil.vector3Dot_vector(
            vertices[down1 * 3] - vertices[up * 3],
            vertices[down1 * 3 + 1] - vertices[up * 3 + 1],
            vertices[down1 * 3 + 2] - vertices[up * 3 + 2],
            normal
        ))


        const pos_a: number[] = [
            vertices[up * 3] + (vertices[down0 * 3] - vertices[up * 3]) * aScale,
            vertices[up * 3 + 1] + (vertices[down0 * 3 + 1] - vertices[up * 3 + 1]) * aScale,
            vertices[up * 3 + 2] + (vertices[down0 * 3 + 2] - vertices[up * 3 + 2]) * aScale,
        ];

        //         const pos_b: Vector3 = v0.clone().add(v2_v0_subtract.multiplyScalar(bScale));
        const pos_b: number[] = [
            vertices[up * 3] + (vertices[down1 * 3] - vertices[up * 3]) * bScale,
            vertices[up * 3 + 1] + (vertices[down1 * 3 + 1] - vertices[up * 3 + 1]) * bScale,
            vertices[up * 3 + 2] + (vertices[down1 * 3 + 2] - vertices[up * 3 + 2]) * bScale,
        ];


        const uv_a: number[] = [
            uvs[up * 2] + (uvs[down0 * 2] - uvs[up * 2]) * aScale,
            uvs[up * 2 + 1] + (uvs[down0 * 2 + 1] - uvs[up * 2 + 1]) * aScale,
        ];
        const uv_b: number[] = [
            uvs[up * 2] + (uvs[down1 * 2] - uvs[up * 2]) * bScale,
            uvs[up * 2 + 1] + (uvs[down1 * 2 + 1] - uvs[up * 2 + 1]) * bScale,
        ];

        const normal_a: number[] = [
            normals[up * 3] + (normals[down0 * 3] - normals[up * 3]) * aScale,
            normals[up * 3 + 1] + (normals[down0 * 3 + 1] - normals[up * 3 + 1]) * aScale,
            normals[up * 3 + 2] + (normals[down0 * 3 + 2] - normals[up * 3 + 2]) * aScale,
        ];

        let l1 = Math.sqrt(normal_a[0] * normal_a[0] + normal_a[1] * normal_a[1] + normal_a[2] * normal_a[2]);
        if (l1 > Const.EPSILON) {
            l1 = 1.0 / l1;
            normal_a[0] = normal_a[0] * l1;
            normal_a[1] = normal_a[1] * l1;
            normal_a[2] = normal_a[2] * l1;
        } else {
            console.error("l < Const.EPSILON");
            normal_a[0] = 0.0;
            normal_a[1] = 0.0;
            normal_a[2] = 1.0;
        }

        const normal_b: number[] = [
            normals[up * 3] + (normals[down1 * 3] - normals[up * 3]) * bScale,
            normals[up * 3 + 1] + (normals[down1 * 3 + 1] - normals[up * 3 + 1]) * bScale,
            normals[up * 3 + 2] + (normals[down1 * 3 + 2] - normals[up * 3 + 2]) * bScale,
        ];

        let l2 = Math.sqrt(normal_b[0] * normal_b[0] + normal_b[1] * normal_b[1] + normal_b[2] * normal_b[2]);
        if (l2 > Const.EPSILON) {
            l2 = 1.0 / l2;
            normal_b[0] = normal_b[0] * l2;
            normal_b[1] = normal_b[1] * l2;
            normal_b[2] = normal_b[2] * l2;
        } else {
            console.error("l < Const.EPSILON");
            normal_b[0] = 0.0;
            normal_b[1] = 0.0;
            normal_b[2] = 1.0;
        }

        const top_a = top.vertices.length / 3;
        top.add(pos_a, uv_a, normal_a);


        const top_b = top.vertices.length / 3;
        top.add(pos_b, uv_b, normal_b);

        //单独一侧的点和另外两个新点
        top.indices.push(newTriangles[up]);


        top.indices.push(top_a);
        top.indices.push(top_b);

        const down_a = bottom.vertices.length / 3;
        bottom.add(pos_a, uv_a, normal_a);


        const down_b = bottom.vertices.length / 3;
        bottom.add(pos_b, uv_b, normal_b);



        //同一侧的两个点分别和新的点相连
        bottom.indices.push(newTriangles[down0]);
        bottom.indices.push(newTriangles[down1]);
        bottom.indices.push(down_b);

        bottom.indices.push(newTriangles[down0]);
        bottom.indices.push(down_b);
        bottom.indices.push(down_a);


        if (isAbove) {
            cutPoint = cutPoint.concat(pos_a).concat(pos_b)
        } else {
            cutPoint = cutPoint.concat(pos_b).concat(pos_a)

        }
        return cutPoint;
    }

    private clamp01(num: number) {
        if (num > 1) {
            num = 1;
        }
        if (num < 0) {
            num = 0;
        }
        return num;

    }

    /**根据切出的点创建面 */
    fillCutEdges(edges: number[], pos: Vector3, normal: Vector3): MyMeshInfo {

        if (edges.length < 3)
            console.log("edges point less 3!");


        let arr: number[][] = [];
        for (var i = 0; i < edges.length; i += 3) {
            let hasEage = false;
            for (let j = 0; j < arr.length; j += 3) {
                if (arr[i] == arr[j] && arr[i + 1] == arr[j + 1] && arr[i + 2] == arr[j + 2]) {
                    hasEage = true;
                    break;
                }
            }
            if (!hasEage) {
                arr.push([edges[i], edges[i + 1], edges[i + 2]]);
            }
        }


        arr.sort((left, right) => {
            const leftAngle = Math.atan2(left[2], left[0]);
            const rightAngle = Math.atan2(right[2], right[0]);
            return leftAngle > rightAngle ? 1 : - 1;
        });


        arr.push([pos.x, pos.y, pos.z]);


        const cutEdges = new MyMeshInfo();
        for (let i = 0; i < arr.length; i++) {
            cutEdges.add(
                [arr[i][0], arr[i][1], arr[i][2]],
                [0, 0],
                [normal.x, normal.y, normal.z],
            );

        }

        for (let i = 0; i < arr.length - 1; i++) {
            cutEdges.indices.push(arr.length - 1);
            cutEdges.indices.push(i);
            cutEdges.indices.push(i + 1);
        }

        cutEdges.indices.push(arr.length - 1);
        cutEdges.indices.push(arr.length - 2);
        cutEdges.indices.push(0);


        //计算uv缩放
        let xMax = 0;
        let xMin = 0;
        let yMax = 0;
        let yMin = 0;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] > xMax) {
                xMax = arr[i][0];
            }
            if (arr[i][0] < xMin) {
                xMin = arr[i][0];
            }
            if (arr[i][2] > yMax) {
                yMax = arr[i][2];
            }
            if (arr[i][2] < yMin) {
                yMin = arr[i][2];
            }
        }


        const uvScale = xMax - xMin;
        cutEdges.mapperCube(this.uvRange, uvScale);
        return cutEdges;
    }



    /**和旧的mesh比较 把不用的点归零*/
    public compareVertInfoToOldMesh(oldMesh: Mesh, newPositionVertices: number[]) {
        const verticesOld = oldMesh.getAttribute("POSITION");
        if (verticesOld.length > newPositionVertices.length) {
            for (let i = newPositionVertices.length; i < verticesOld.length; i++) {
                newPositionVertices[i] = 0;
            }
        }
    }

    /**和旧的mesh比较 把不用的点归零*/
    public compareIndcisInfoToOldMesh(oldMesh: Mesh, newIndices: number[]) {
        const indicesOld = oldMesh.getIndices();
        if (indicesOld.length > newIndices.length) {
            for (let i = newIndices.length; i < indicesOld.length; i++) {
                newIndices[i] = 0;
            }
        }
    }

    //合并切割面的点
    //根据性能需要合并
    public combineCutPoiot(cutPoint: number[], combineRange: number) {
        combineRange *= combineRange;
        for (let i = 0; i < cutPoint.length / 3; i++) {
            for (let j = i + 1; j < cutPoint.length / 3; j++) {

                const verticesubtract = [
                    cutPoint[i * 3] - cutPoint[j * 3],
                    cutPoint[i * 3 + 1] - cutPoint[j * 3 + 1],
                    cutPoint[i * 3 + 2] - cutPoint[j * 3 + 2],
                ]

                let dis: boolean = MyMathUtil.squaredLength(verticesubtract) < combineRange;
                if (dis) {
                    cutPoint.splice(j * 3, 3);
                }
            }
        }
        return cutPoint;
    }

}


