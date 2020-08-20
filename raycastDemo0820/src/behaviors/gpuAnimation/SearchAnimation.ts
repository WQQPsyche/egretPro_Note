import { component } from "@egret/ecs";
import { Behaviour, Application } from "@egret/engine";
import { property, EditType, serializedField } from "@egret/core";
import { AnimationSystem, Animation } from "@egret/animation";

@component()
export class SearchAnimation extends Behaviour {
    private _currentFrame: number = 0;

    @property(EditType.Uint)
    public get currentFrame() {
        return this._currentFrame;
    }

    public set currentFrame(value: number) {
        if (value !== this._currentFrame) {
            this._currentFrame = value;
            this.getBonesDataFromAnimation(value);
        }
    }

    private animation: Animation | null = null;

    private animationSystem: AnimationSystem | null = null;

    public onStart() {
        const animationSystem = Application.instance.systemManager.getSystem(AnimationSystem);
        this.animationSystem = animationSystem;
        this.animation = this.entity.getComponent(Animation);
        // console.log(`animation:`, this.animationSystem)
        this.getBonesDataFromAnimation(2);
    }

    public getBonesDataFromAnimation(frame: number) {
        if (!this.animation || !this.animationSystem) {
            return;
        }
        const animation = this.animation;
        const animationSystem = this.animationSystem;
        const last = animation.lastAnimationState;
        const name = animation.animations[0].glTF.animations[0].extensions.egret.clips[0].name;
        if (last) {
            (last as any)['_playState'] = 1;
        }
        animation.play(name, 1);
        const dt = 1 / 25;
        animationSystem._updateEntityAnimatonState(this.entity, dt * (frame + 1));
        animation.stop();
    }
}