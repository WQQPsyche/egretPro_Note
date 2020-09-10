import { component } from "@egret/ecs";
import { Behaviour, EngineFactory, GameEntity } from "@egret/engine";
import { MeshFilter, MeshRenderer, Mesh, DefaultMaterials } from "@egret/render";
import { AttributeSemantics } from "@egret/gltf";
import { ResourceManager } from "@egret/core";

@component()
class CreateMeshTest extends Behaviour{

    onStart(){
        // this.createPlaneDemo();
        this.createBox();
    }






    private async createPlaneDemo(){
    
        const plane = EngineFactory.createGameEntity3D("planeTest") as GameEntity;

        const meshFilter = plane.addComponent(MeshFilter);
        const meshRenderer = plane.addComponent(MeshRenderer);
        /**
         * 开始创建Mesh
         */
        //顶点坐标
        const vertices = [
            -0.5,0.5,0,
            0.5,0.5,0,
            0.5,-0.5,0,
            -0.5,-0.5,0            
        ];
        //法线：每个顶点的法线
        const normals = [
            0,0,-1,
            0,0,-1,
            0,0,-1,
            0,0,-1
        ];
        //uv坐标
 
        const uvs = [
            0,0,
            1,0,
            1,1,
            0,1
        ];

        // 顶点索引
        const indices = [
            0, 2, 1,
            0, 3, 2
        ];
        const mesh = Mesh.create(vertices.length / 3, indices.length);
        mesh.setAttribute(AttributeSemantics.POSITION, vertices);
        mesh.setAttribute(AttributeSemantics.NORMAL, normals);
        mesh.setAttribute(AttributeSemantics.TEXCOORD_0, uvs);
        mesh.setIndices(indices, 0);

        meshFilter.mesh = mesh;

        const testMaterial1 = await (await ResourceManager.instance.loadUri("assets/materials/logo.mat.json")).data;
        meshRenderer.material = testMaterial1;
    }

    private async createBox(){
        const cube = EngineFactory.createGameEntity3D("cubeTest");

        const meshFilter = cube.addComponent(MeshFilter);
        const meshRender = cube.addComponent(MeshRenderer);

        const vertices = [
            //左
            -0.5,0.5,0.5,
            -0.5,0.5,-0.5,
            -0.5,-0.5,0.5,
            -0.5,-0.5,-0.5,
            //右
            0.5,0.5,-0.5,
            0.5,0.5,0.5,
            0.5,-0.5,-0.5,
            0.5,-0.5,0.5,
            //下
            -0.5,-0.5,-0.5,
            0.5,-0.5,-0.5,
            -0.5,-0.5,0.5,
            0.5,-0.5,0.5,
            //上
            -0.5,0.5,0.5,
            0.5,0.5,0.5,
            -0.5,0.5,-0.5,
            0.5,0.5,-0.5,
            //后
            -0.5,0.5,-0.5,
            0.5,0.5,-0.5,
            -0.5,-0.5,-0.5,
            0.5,-0.5,-0.5,
            //前
            0.5,0.5,0.5,
            -0.5,0.5,0.5,
            0.5,-0.5,0.5,
            -0.5,-0.5,0.5
        ];

        const normals = [
            //左
            1,0,0,
            1,0,0,
            1,0,0,
            1,0,0,
            //右
            1,0,0,
            1,0,0,
            1,0,0,
            1,0,0,
            //下
            0,-1,0,
            0,-1,0,
            0,-1,0,
            0,-1,0,
            //上
            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,
            //前
            0,0,-1,
            0,0,-1,
            0,0,-1,
            0,0,-1,
            // 后
            0,0,1,
            0,0,1,
            0,0,1,
            0,0,1
        ];
        const uvs = [
            0,0,
            1,0,
            0,1,
            1,1,

            0,0,
            1,0,
            0,1,
            1,1,

            0,0,
            1,0,
            0,1,
            1,1,

            0,0,
            1,0,
            0,1,
            1,1,

            0,0,
            1,0,
            0,1,
            1,1,

            0,0,
            1,0,
            0,1,
            1,1
        ]

        const indices = [
            0, 2, 1,
            2, 3, 1,
            4, 6, 5,
            6, 7, 5, 
            8, 10, 9, 
            10, 11, 9, 
            12, 14, 13, 
            14, 15, 13, 
            16, 18, 17, 
            18, 19, 17, 
            20, 22, 21, 
            22, 23, 21
        ];

        

        const mesh = Mesh.create(vertices.length / 3, indices.length);
        mesh.setAttribute(AttributeSemantics.POSITION, vertices);
        mesh.setAttribute(AttributeSemantics.NORMAL, normals);
        mesh.setAttribute(AttributeSemantics.TEXCOORD_0, uvs);
       
        mesh.setIndices(indices, 0);
        meshFilter.mesh = mesh;

        
        const testMaterial = await (await ResourceManager.instance.loadUri("assets/materials/logo.mat.json")).data;
        meshRender.material = testMaterial;
        // meshRender.material = DefaultMaterials.MESH_PHONG;
    }
}