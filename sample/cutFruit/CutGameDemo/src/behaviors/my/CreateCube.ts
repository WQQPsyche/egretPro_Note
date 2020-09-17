import { ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, EngineFactory, GameEntity } from "@egret/engine";
import { AttributeSemantics } from "@egret/gltf";
import { Mesh, MeshFilter, MeshRenderer } from "@egret/render";

@component()
class CreateCube extends Behaviour{
    onStart(){
        this.createCube();
    }

    private async createCube(){
        const cube = EngineFactory.createGameEntity3D("cubeTest")as GameEntity;

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
        const normal = [
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
        const uv = [
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
        ];

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
        const mesh = Mesh.create(vertices.length/3,indices.length);
        mesh.setAttribute(AttributeSemantics.POSITION,vertices);
        mesh.setAttribute(AttributeSemantics.NORMAL,normal);
        mesh.setAttribute(AttributeSemantics.TEXCOORD_0,uv);

        mesh.setIndices(indices,0);
        meshFilter.mesh = mesh;

        const _material = await (await ResourceManager.instance.loadUri("assets/materials/logo.mat.json")).data;

        meshRender.material = _material;
    }
}