import { component } from "@egret/ecs";
import { Behaviour, Transform, EngineFactory } from "@egret/engine";
import { serializedField, property, EditType } from "@egret/core";
import { ShapeDown } from "./ShapeDown";

@component()
export class CompoundShape extends Behaviour {

    @serializedField
    @property(EditType.String)
    public prefab: string = "box2d/prefab/TwoCube.prefab.json";

    @serializedField
    @property(EditType.Float)
    public x: number = 0.0;

    public async onStart() {
        for (let i = 0; i < 20; i++) {
            const entity = await EngineFactory.createPrefab(this.prefab);
            const transform = entity.getOrAddComponent(Transform)!;
            const y = 0.2 + i;
            transform.setPosition({ x: this.x, y, z: 0 });
            transform.setParent(this.entity.getComponent(Transform));
            entity.addComponent(ShapeDown).prefab = this.prefab;
        }
    }
}