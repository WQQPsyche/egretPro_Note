import { component } from "@egret/ecs";
import { property, serializedField, EditType } from "@egret/core";
import { Behaviour, Application, GameEntity, RaycastInfo, Plane, Vector3, EngineFactory, Ray } from "@egret/engine";
import { InputState, InputManager } from "@egret/input";
import { Camera, DefaultMeshes, MeshFilter, MeshRenderer, DefaultMaterials } from "@egret/render";

@component()
export class DragTest extends Behaviour {

    @property(EditType.Component, { componentClass: Camera })
    @serializedField
    public camera: Camera | null = null;

    private readonly _plane: Plane = Plane.create(Vector3.UP, -1.5);
    private readonly _ray: Ray = Ray.create();
    private readonly _raycasyInfo: RaycastInfo = RaycastInfo.create();
    private readonly _cubes: Record<uint, GameEntity> = {};

    public onUpdate() {
        if (this.camera === null) {
            return;
        }

        const inputManager = Application.instance.globalEntity.getComponent(InputManager)!;
        const cubes = this._cubes;

        for (const pointer of inputManager.getPointers(InputState.Hold)) {
            if (!(pointer.index in cubes)) {
                const cube = cubes[pointer.index] = EngineFactory.createGameEntity3D(`Pointer${pointer.index}`, {
                    parent: this.entity
                });
                const meshFilter = cube.addComponent(MeshFilter);
                meshFilter.mesh = DefaultMeshes.CUBE;
                const meshRenderer = cube.addComponent(MeshRenderer);
                meshRenderer.material = DefaultMaterials.MESH_PHONG;
                meshRenderer.castShadows = true;
                meshRenderer.receiveShadows = true;
            }

            const cube = cubes[pointer.index];
            const ray = this.camera.stageToRay(pointer.position.x, pointer.position.y, this._ray);
            const raycastInfo = this._raycasyInfo.clear();

            if (this._plane.raycast(ray, raycastInfo)) {
                cube.transform.localPosition = raycastInfo.position;
            }
        }

        for (const pointer of inputManager.getPointers(InputState.Up)) {
            if (pointer.index in cubes) {
                cubes[pointer.index].destroy();
                delete cubes[pointer.index];
            }
        }
    }
}
