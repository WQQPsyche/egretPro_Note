import { EditType, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, Color, GameEntity, Ray, RaycastInfo, Transform, Vector3 } from "@egret/engine";
import { AttributeSemantics, MeshPrimitiveMode } from "@egret/gltf";
import { DefaultShaders, Material, Mesh, MeshFilter, MeshRenderer, SkinnedMeshRenderer, UniformName } from "@egret/render";

export abstract class BaseRaycast extends Behaviour {
    public readonly ray: Ray = Ray.create();
    public readonly normal: Vector3 = Vector3.create();
    public readonly raycastInfo: RaycastInfo = RaycastInfo.create();

    protected _lineMesh: Mesh | null = null;

    protected _line: GameEntity<Transform>;
    protected _normal: GameEntity<Transform>;

    public onStart() {
        this._line = this.entity.node.getChildByName("line").entity;
        this._normal = this.entity.node.getChildByName("normal").entity;

        const lineMesh = this._line.getComponent(MeshFilter).mesh!;
        lineMesh.setIndices([2, 3], lineMesh.addSubMesh(2, 1, MeshPrimitiveMode.Points));
        lineMesh.setAttribute(AttributeSemantics.COLOR_0, [
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
        ], 2);

        const lineMeshRender = this._line.getComponent(MeshRenderer);
        lineMeshRender.materials = lineMeshRender.materials.concat(Material.create(DefaultShaders.POINTS)
            .setColor(Color.BLACK)
            .setFloat(UniformName.Size, 10.0));
    }

    protected _updateRay() {
        const transform = this.entity.transform;
        const ray = this.ray;
        ray.origin.copy(transform.position);
        transform.getForward(ray.direction);
    }
}

@component()
export class RendererRaycast extends BaseRaycast {

    @property(EditType.Entity)
    @serializedField
    public target: GameEntity | null = null;

    public onUpdate() {
        const raycastInfo = this.raycastInfo;
        const lineTransform = this._line.transform;
        lineTransform.setLocalScale(1.0);
        raycastInfo.clear();
        raycastInfo.normal = this.normal;

        if (this.target && this.target.renderer) {
            this._updateRay();

            if ((this.target.renderer as any).raycast(this.ray, raycastInfo)) {
                lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                this._normal.enabled = true;
                this._normal.transform
                    .setPosition(raycastInfo.position)
                    .lookRotation(raycastInfo.normal!)
                    .setLocalScale(1.0, 1.0, raycastInfo.normal!.length);

                return;
            }
        }

        this._normal.enabled = false;
    }
}

@component()
export class MeshTriangleFollower extends Behaviour {
    @property(EditType.Component, { componentClass: RendererRaycast })
    @serializedField
    public rendererRaycaster: RendererRaycast | null = null;

    @property(EditType.Entity)
    @serializedField
    private _normal: GameEntity;

    public onLateUpdate() {
        if (!this.rendererRaycaster) {
            this._normal.enabled = false;
            return;
        }

        const triangleIndex = this.rendererRaycaster.raycastInfo.triangleIndex;
        if (triangleIndex < 0) {
            this._normal.enabled = false;
            return;
        }

        const raycastInfo = this.rendererRaycaster.raycastInfo;
        const meshRender = this.rendererRaycaster.target!.renderer! as (MeshRenderer | SkinnedMeshRenderer);
        const coord = raycastInfo.coord;
        const triangle = meshRender.getTriangle(triangleIndex).release();

        this._normal.transform.position = triangle.getPointAt(coord.x, coord.y, new Vector3()).release();
        this._normal.transform.lookRotation(triangle.getNormal(new Vector3()).release());
        this._normal.enabled = true;
    }
}

export class ColliderRaycast extends BaseRaycast {
    public target: GameEntity | null = null;

    public onUpdate() {
        const raycastInfo = this.raycastInfo;
        const lineTransform = this._line.transform;
        lineTransform.setLocalScale(1.0);
        raycastInfo.clear();
        raycastInfo.normal = this.normal;

        if (this.target) {
            this._updateRay();

            if ((this.target.renderer as any).raycast(this.ray, raycastInfo)) {
                lineTransform.setLocalScale(1.0, 1.0, raycastInfo.distance);
                this._normal.enabled = true;
                this._normal.transform
                    .setPosition(raycastInfo.position)
                    .lookRotation(raycastInfo.normal!)
                    .setLocalScale(1.0, 1.0, raycastInfo.normal!.length);

                return;
            }
        }

        this._normal.enabled = false;
    }
}