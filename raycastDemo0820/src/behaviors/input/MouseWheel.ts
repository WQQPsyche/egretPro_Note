import { component } from "@egret/ecs";
import { Application, Behaviour } from "@egret/engine";
import { InputManager, AxisIndex } from "@egret/input";

/**
 * 
 */
@component()
export class MouseWheel extends Behaviour {

    private _inputManager: InputManager | null = null;

    public onStart() {
        this._inputManager = Application.instance.globalEntity.getComponent(InputManager)!;
    }

    public onUpdate() {
        if (this._inputManager === null) {
            return;
        }

        const wheelY = this._inputManager.getAxis(AxisIndex.WheelY);

        if (wheelY !== 0.0) {
            for (const { entity } of this.entity.node.children) {
                entity.transform.rotate(wheelY, 0.0, 0.0);
            }
        }
    }
}
