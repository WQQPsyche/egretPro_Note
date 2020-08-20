import { component } from "@egret/ecs";
import { Behaviour, Transform, EngineFactory } from "@egret/engine";
import { serializedField, property, EditType } from "@egret/core";
import { ShapeDown } from "./ShapeDown";

@component()
export class CreatePrefabs extends Behaviour {

    @serializedField
    @property(EditType.String)
    public prefab: string = "box2d/prefab/SphereCollisionFiltering.prefab.json";

    @serializedField
    @property(EditType.Float)
    public offsetX: number = 0.0;

    @serializedField
    @property(EditType.Float)
    public offsetY: number = 0.0;


    public async onStart() {
        for (let i = 0; i < 10; i++) {
            const entity = await EngineFactory.createPrefab(this.prefab);
            const transform = entity.getOrAddComponent(Transform)!;
            const y = this.offsetY;
            const x = -2.5 + i * 0.6 + this.offsetX;
            transform.setPosition({ x, y, z: -2.0 });
            transform.setParent(this.entity.getComponent(Transform));
            entity.addComponent(ShapeDown).prefab = this.prefab;
        }
    }
}