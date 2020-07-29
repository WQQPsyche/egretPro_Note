import { component } from "@egret/ecs";
import { EditType, getItemsFromEnum, property, serializedField } from "@egret/core";
import { Application, Behaviour, Vector3 } from "@egret/engine";
import { InputCode, Input, InputManager } from "@egret/input";
import * as engine from "@egret/engine"; //TODO
//
import { Rotater } from "../Rotater";
/**
 * 
 */
@component()
export class InputTest extends Behaviour {
    /** 
     * 
     */
    @property(EditType.Enum, { listItems: getItemsFromEnum(((engine as any).InputCode)) }) // TODO
    @serializedField
    public inputType: InputCode = InputCode.Unknown;
    /** */
    private readonly _defaultPostion: Vector3 = Vector3.create();
    private readonly _defaulteulerAngle: Vector3 = Vector3.create();
    private readonly _upPosition: Vector3 = Vector3.create(0.0, 2.0, 0.0);
    private _input: Input | null = null;
    private _rotator: Rotater | null = null;
    /** 
     * @_inheritdoc
     */
    public onStart() {
        this._defaultPostion.copy(this.entity.transform.localPosition);
        this._defaulteulerAngle.copy(this.entity.transform.localEulerAngles);
        //
        this._rotator = this.entity.getComponent(Rotater);
        if (this._rotator !== null) {
            this._rotator.speed.set(0.0, 100.0, 0.0);
            this._rotator.enabled = false;
        }
        //
        const inputManager = Application.instance.globalEntity.getComponent(InputManager)!;
        this._input = inputManager.getInput(this.inputType);
    }
    /** 
     * @_inheritdoc
     */
    public onUpdate() {
        if (this._input === null) {
            return;
        }
        //
        const { transform } = this.entity;
        if (this._input.isDown) {
            transform.localPosition = this._defaultPostion;
            transform.localEulerAngles = this._defaulteulerAngle;
            transform.translate(this._upPosition);
            if (this._rotator !== null) {
                this._rotator.enabled = true;
            }
        }
        else if (this._input.isUp) {
            transform.localPosition = this._defaultPostion;
            transform.localEulerAngles = this._defaulteulerAngle;
            if (this._rotator !== null) {
                this._rotator.enabled = false;
            }
        }
    }
}
