/**
 * 这个例子用于展示如何使用相机裁切功能渲染特定对象
 * 
 * MainCamera 对象中挂载了几个组件
 * * CullingMaskBehaviour:提供了 layer10/layer11/layer12 三个属性，对应着 UserLayer.UserLayer10-12三个层,这三个属性的设值会修改 Camera 是否渲染这三个 Layer
 * * RotateAround : 旋转该对象
 * 
 * 您可以在 Inspector 中通过修改 CullingMaskBehaviour 的 layer10/layer11/layer12 属性决定是否渲染放在这三个层上的对象
 */

import { EditType, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, Const, EngineFactory, NodeLayer, TreeNode, Application } from "@egret/engine";
import { Camera, DefaultMeshes, DefaultShaders, Material, MeshFilter, MeshRenderer, RenderContext } from "@egret/render";
/**
 * 
 */
@component()
export class CullingMaskBehaviour extends Behaviour {

    private _layer10: boolean = true;
    private _layer11: boolean = true;
    private _layer12: boolean = true;
    private _mainCamera: Camera | null = null;

    @property(EditType.Boolean)
    @serializedField
    public get layer10() {
        return this._layer10;
    }
    public set layer10(value: boolean) {
        this._layer10 = value;
        if (value) {
            this._mainCamera!.cullingMask |= NodeLayer.UserLayer10;
        }
        else {
            this._mainCamera!.cullingMask &= ~NodeLayer.UserLayer10;
        }
    }

    @property(EditType.Boolean)
    @serializedField
    public get layer11() {
        return this._layer11;
    }
    public set layer11(value: boolean) {
        this._layer11 = value;
        if (value) {
            this._mainCamera!.cullingMask |= NodeLayer.UserLayer11;
        }
        else {
            this._mainCamera!.cullingMask &= ~NodeLayer.UserLayer11;
        }
    }

    @property(EditType.Boolean)
    @serializedField
    public get layer12() {
        return this._layer12;
    }
    public set layer12(value: boolean) {
        this._layer12 = value;
        if (value) {
            this._mainCamera!.cullingMask |= NodeLayer.UserLayer12;
        }
        else {
            this._mainCamera!.cullingMask &= ~NodeLayer.UserLayer12;
        }
    }

    public onStart() {
        const mainCamera = this.entity.getComponent(Camera);
        mainCamera.cullingMask = NodeLayer.UserLayer10 | NodeLayer.UserLayer11 | NodeLayer.UserLayer12;
        mainCamera.fov = 70.0 * Const.DEG_RAD;
        this._mainCamera = mainCamera;
        //
        const materials = [
            Material.create(DefaultShaders.MESH_LAMBERT).setColor(0xff0000),
            Material.create(DefaultShaders.MESH_LAMBERT).setColor(0x00ff00),
            Material.create(DefaultShaders.MESH_LAMBERT).setColor(0x0000ff)
        ];
        const layers = [NodeLayer.UserLayer10, NodeLayer.UserLayer11, NodeLayer.UserLayer12];
        for (let i = 0; i < 300; ++i) {
            const layer = (i % 3);
            const gameEntity = EngineFactory.createGameEntity3D("Cube " + i);
            gameEntity.addComponent(MeshFilter).mesh = DefaultMeshes.CUBE;
            gameEntity.addComponent(MeshRenderer).material = materials[layer];
            gameEntity.getComponent(MeshRenderer).isStatic = true;
            gameEntity.getComponent(TreeNode).layer = layers[layer];
            gameEntity.transform
                .setLocalPosition(
                    Math.random() * 800.0 - 400.0,
                    Math.random() * 800.0 - 400.0,
                    Math.random() * 800.0 - 400.0,
                )
                .setLocalEulerAngles(
                    Math.random() * 360.0,
                    Math.random() * 360.0,
                    Math.random() * 360.0,
                )
                .setLocalScale(
                    (Math.random() + 0.5) * 20.0,
                    (Math.random() + 0.5) * 20.0,
                    (Math.random() + 0.5) * 20.0,
                );
        }
        //
        Application.instance.globalEntity.getComponent(RenderContext)!.gpuInstancingEnable = true;
        for (const material of materials) {
            material.gpuInstancingEnable = true;
        }
    }
}

// window['__reflectMap']['CullingMaskBehaviour'] = CullingMaskBehaviour;
