import { component } from "@egret/ecs";
import { Behaviour, Transform, EngineFactory } from "@egret/engine";
import { serializedField, property, EditType } from "@egret/core";

@component()
export class ShapeDown extends Behaviour {

    @serializedField
    @property(EditType.String)
    public prefab: string = "box2d/prefab/TwoCube.prefab.json";

    public async onUpdate() {
        const transform = this.entity.getComponent(Transform);
        if (transform && transform.position.y <= -7) {
            const x = Math.random() * 10 - 5;
            const entity = await EngineFactory.createPrefab(this.prefab);
            const transform2 = entity.getOrAddComponent(Transform)!;
            transform2.setPosition({ x, y: 7.0, z: transform.position.z });
            transform2.setParent(this.entity.parent.transform);
            entity.addComponent(ShapeDown).prefab = this.prefab;
            this.entity.removeComponent(ShapeDown);
            this.entity.destroy();
        }
    }
}