import { component } from "@egret/ecs";
import { Behaviour, NodeLayer } from "@egret/engine";
import * as engine from "@egret/engine";
import { serializedField, property, EditType, getItemsFromEnum } from "@egret/core";
import { BaseCollider } from "@egret/box2d";

@component()
export class GroupIndex extends Behaviour {

    public static index: number = -1;

    @serializedField
    @property(EditType.Boolean)
    public useCustomGroupIndex: boolean = false;

    @serializedField
    @property(EditType.Int)
    public groupIndex: number = 0;

    @serializedField
    @property(EditType.Enum, { minimum: 0, listItems: getItemsFromEnum((engine as any).NodeLayer) }, true)
    public maskBits: NodeLayer[] = [];

    public onStart() {
        const components = this.entity.components;
        for (const component of components) {
            if (component instanceof BaseCollider) {
                if (this.useCustomGroupIndex) {
                    component.groupIndex = this.groupIndex;
                }
                else {
                    component.groupIndex = GroupIndex.index--;
                }
                let maskBits = 0;
                this.maskBits.map((value, index, array) => {
                    if (array.lastIndexOf(value) === index) {
                        maskBits += value;
                    }
                });
                console.log(maskBits);
                component.cullingMask = maskBits;
            }
        }
    }

}