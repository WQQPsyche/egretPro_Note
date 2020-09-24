import { Vector3, Vector2, Quaternion, Rectangle } from "@egret/engine";

export class MyMeshInfo {

    public vertices: Vector3[] = [];//顶点坐标
    public indices: number[] = [];//索引值
    public uvs: Vector2[] = [];//uv坐标
    public normals: Vector3[] = [];//法线坐标

    public onsidePoint: Vector3[] = [];


    //TODO
    public size = Vector3.create(1, 1, 1);
    //TODO
    public center = Vector3.create(0, 0, 0);

/**
 * 
 * @param mesh 网格
 */
    public MeshInfo(mesh) {
        this.vertices = mesh.vertices;
        this.indices = mesh.indices;
        this.uvs = mesh.uv;
        this.normals = mesh.normals;
        this.center = mesh.bounds.center;
        this.size = mesh.bounds.size;
    }


    public Add(vert: Vector3, uv: Vector2, normal: Vector3, tangent?: Quaternion) {
        this.vertices.push(vert);
        this.uvs.push(uv);
        this.normals.push(normal);
    }
    public MapperCube(uvScale) {
        if (this.uvs.length < this.vertices.length) {
            // uvs = new List<Vector2>(vertices.Count);
            // this.uvs = []
            console.error("this.uvs.length < this.vertices.length");

        }
        //TODO

        let count = this.indices.length / 3;
        for (let i = 0; i < count; i++) {
            let _i0 = this.indices[i * 3];
            let _i1 = this.indices[i * 3 + 1];
            let _i2 = this.indices[i * 3 + 2];
            // console.error(this.center,this.size);
            
            //把三维坐标系转换成二维坐标系
            let v0: Vector3 = this.vertices[_i0].clone().subtract(this.center.clone()).add(this.size.clone().multiplyScalar(1 / 2));
            let v1: Vector3 = this.vertices[_i1].clone().subtract(this.center.clone()).add(this.size.clone().multiplyScalar(1 / 2));
            let v2: Vector3 = this.vertices[_i2].clone().subtract(this.center.clone()).add(this.size.clone().multiplyScalar(1 / 2));

            this.uvs[_i0] = Vector2.create(v0.x, v0.z);
            this.uvs[_i1] = Vector2.create(v1.x, v1.z);
            this.uvs[_i2] = Vector2.create(v2.x, v2.z);

        }

        uvScale = Math.floor(1 / uvScale * 100) / 100;

        let test1 = (1 - uvScale % 2) / 2;
       
        if (uvScale != 1) {
            for (let i = 0; i < this.uvs.length; i++) {
                this.uvs[i].multiplyScalar(uvScale).add(Vector2.create(test1, test1));
            }
        }

    }

    //TODO  合并点
    public CombineVertices(range: number) {
        // return
        let combineTime = 0;
        range *= range;
        for (let i = 0; i < this.vertices.length; i++) {
            for (let j = i + 1; j < this.vertices.length; j++) {
        
                const a = this.vertices[i].clone().subtract(this.vertices[j].clone());
                const verticesubtract = a;
                const uvsubtract = (this.uvs[i].clone().subtract(this.uvs[j].clone()));
                const dirsubtract = (this.normals[i].clone().subtract(this.normals[j].clone()));


                let dis: boolean = verticesubtract.squaredLength < range;
                let uv: boolean = uvsubtract.squaredLength < range;
                let dir: boolean = dirsubtract.squaredLength > 0.999;
                if (dis && uv && dir) {
                    // if (dis) {
                    console.warn("CombineVertices  index", i, "index2", j);

                    // debugger
                    for (let k = 0; k < this.indices.length; k++) {
                        if (this.indices[k] == j)
                            this.indices[k] = i;
                        if (this.indices[k] > j)
                            this.indices[k]--;
                    }
                 
                    this.vertices.splice(j, 1);
                    this.normals.splice(j, 1);
                    this.uvs.splice(j, 1);
                    combineTime++;
                }
            }
        }
        console.warn("combineTime", combineTime);

    }
    public Reverse() {
        let count = this.indices.length / 3;
        for (let i = 0; i < count; i++) {
            let t = this.indices[i * 3 + 2];
            this.indices[i * 3 + 2] = this.indices[i * 3 + 1];
            this.indices[i * 3 + 1] = t;
        }
        count = this.vertices.length;
        for (let i = 0; i < count; i++) {
            this.normals[i].multiplyScalar(-1);
        }
    }
}