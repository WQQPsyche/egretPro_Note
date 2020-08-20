import { component } from "@egret/ecs";
import { Behaviour, EngineFactory, Transform } from "@egret/engine";
import { serializedField, property, EditType } from "@egret/core";
import { ShapeDown } from "../box2d/ShapeDown";

@component()
export class Benchmark extends Behaviour {


    @serializedField
    @property(EditType.Uint)
    count: number = 10;

    async onAwake() {
        for (let i = 0; i < this.count; i++) {
            const entity = await EngineFactory.createPrefab('h5/prefab/newPrefab.prefab.json');
            const transform = entity.getComponent(Transform);
            const x = (- (this.count / 2) + i) / 1000;
            transform.setPosition({ x, y: 0, z: 0 });
            entity.addComponent(ShapeDown);
        }

    }
}