import { property, EditType, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import {
    Vector3, Ray, RaycastInfo,
    Transform, Behaviour, Application, NodeLayer,
} from "@egret/engine";
import { CollisionManager } from "@egret/collision";
import * as gltf from "@egret/gltf";
import {
    DefineName, UniformName,
    Mesh, Material,
    MeshFilter, MeshRenderer,
    DefaultShaders,
} from "@egret/render";
/**
 * 一个简易的碰撞体射线检测组件。
 */
@component()
export default class ColliderRaycaster extends Behaviour {
    /** */
    private static _lineMaterial: Material | null = null;
    private static _pointMaterial: Material | null = null;
    /**
     * 需要被检测的实体。
     */
    @property(EditType.Component, { componentClass: Transform })
    @serializedField
    public target: Transform | null = null;
    /** */
    private readonly _collisionManager: CollisionManager = Application.instance.globalEntity.getComponent(CollisionManager)!;
    private readonly _ray: Ray = Ray.create();
    private readonly _raycastInfo: RaycastInfo = RaycastInfo.create();
    private readonly _normal: Vector3 = Vector3.create();
    private _lineMesh: Mesh | null = null;
    /** */
    private _updateRay() {
        const transform = this.entity.transform;
        const ray = this._ray;
        ray.origin.copy(transform.position);
        transform.getForward(ray.direction);
    }
    /** 
     * 
     */
    public onStart() {
        const meshFilter = this.entity.getOrAddComponent(MeshFilter);
        const meshRenderer = this.entity.getOrAddComponent(MeshRenderer);
        this._lineMesh = meshFilter.mesh = Mesh.create(3, 3, [gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.COLOR_0]);
        this._lineMesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.LineStrip;
        this._lineMesh.setIndices([0, 1, 2], 0);
        this._lineMesh.setIndices([0, 1], this._lineMesh.addSubMesh(2, 1, gltf.MeshPrimitiveMode.Points));
        this._lineMesh.setAttribute(gltf.AttributeSemantics.POSITION, [
            0.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ]);
        this._lineMesh.setAttribute(gltf.AttributeSemantics.COLOR_0, [
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
        ]);
        if (!ColliderRaycaster._lineMaterial) {
            ColliderRaycaster._lineMaterial = Material.create(DefaultShaders.LINEDASHED)
                .addDefine(DefineName.USE_COLOR);
            ColliderRaycaster._pointMaterial = Material.create(DefaultShaders.POINTS)
                .addDefine(DefineName.USE_COLOR)
                .setFloat(UniformName.Size, 10.0);
        }
        meshRenderer.materials = [
            ColliderRaycaster._lineMaterial,
            ColliderRaycaster._pointMaterial,
        ];
    }
    /**
     * 
     */
    public onLateUpdate() {
        if (this.target === null) {
            return;
        }
        const mesh = this._lineMesh!;
        const colors = mesh.getColors()!;
        const vertices = mesh.getVertices()!;
        const raycastInfo = this._raycastInfo;
        const isHit = raycastInfo.transform !== null;
        raycastInfo.clear();
        const normal = raycastInfo.normal = this._normal;
        this._updateRay();
        //
        if (this._collisionManager.raycastSingle(this._ray, this.target.entity, NodeLayer.Default, 10.0, raycastInfo)) {
            normal.applyDirection(this.entity.transform.worldToLocalMatrix);
            vertices[3] = 0.0;
            vertices[4] = 0.0;
            vertices[5] = raycastInfo.distance;
            vertices[6] = normal.x;
            vertices[7] = normal.y;
            vertices[8] = normal.z + raycastInfo.distance;
            mesh.uploadVertexBuffer(gltf.AttributeSemantics.POSITION);
            //
            if (!isHit) {
                for (let i = 0, l = colors.length; i < l; i += 4) {
                    colors[i + 0] = 1.0;
                    colors[i + 1] = 0.0;
                    colors[i + 2] = 0.0;
                }
                mesh.uploadVertexBuffer(gltf.AttributeSemantics.COLOR_0);
            }
        }
        else if (isHit) {
            vertices[3] = 0.0;
            vertices[4] = 0.0;
            vertices[5] = 5.0;
            vertices[6] = 0.0;
            vertices[7] = 0.0;
            vertices[8] = 5.0;
            for (let i = 0, l = colors.length; i < l; i += 4) {
                colors[i + 0] = 0.0;
                colors[i + 1] = 1.0;
                colors[i + 2] = 0.0;
            }
            mesh.uploadVertexBuffer([gltf.AttributeSemantics.POSITION, gltf.AttributeSemantics.COLOR_0]);
        }
    }
}
