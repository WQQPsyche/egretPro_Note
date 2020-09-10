import { component } from "@egret/ecs";
import { Behaviour } from "@egret/engine";
import { MeshFilter, Mesh } from "@egret/render";
import { AttributeSemantics } from "@egret/gltf";
@component()
class GetCubInfo extends Behaviour{
    onStart(){
        const mesh:Mesh = this.entity.getComponent(MeshFilter).mesh;
        console.log("顶点坐标___________________");
        console.log(mesh.getAttribute(AttributeSemantics.POSITION) );
        console.log("法线___________________");
        console.log(mesh.getAttribute(AttributeSemantics.NORMAL) );
        console.log("纹理贴图坐标0___________________");
        console.log(mesh.getAttribute(AttributeSemantics.TEXCOORD_0) );
        console.log("问题贴图坐标1___________________");
        console.log(mesh.getAttribute(AttributeSemantics.TEXCOORD_1));      
        console.log("顶点索引___________");
        console.log(mesh.getIndices());
    }
}