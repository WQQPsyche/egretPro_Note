import { property, EditType, ListItem, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour } from "@egret/engine";
import { MeshFilter } from "@egret/render";
import { Animation, AnimationMask, GLTFAnimation } from "@egret/animation";

export let animatins: ListItem[] = [];

@component({ allowMultiple: true })
export class AnimationHelper extends Behaviour {
    @property(EditType.Enum, { listItems: animatins })
    @serializedField
    public get animation(): string {
        return this._animation;
    }
    public set animation(value: string) {
        if (this._animation === value) {
            return;
        }

        this._animation = value;
        this.play();
    }

    @property(EditType.Float, { minimum: 0.0, maximum: 10.0 })
    @serializedField
    public fadeTime: number = 0.3;

    @property(EditType.Uint, { minimum: 0, maximum: 10 })
    @serializedField
    public layerIndex: uint = 0;

    @property(EditType.Boolean)
    @serializedField
    public get layerAdditive(): boolean {
        return this._layerAdditive;
    }
    public set layerAdditive(value: boolean) {
        if (this._layerAdditive === value) {
            return;
        }

        this._layerAdditive = value;
        this.play();
    }

    @property(EditType.Enum, { listItems: animatins })
    @serializedField
    public get addtiveAnimation(): string {
        return this._addtiveAnimation;
    }
    public set addtiveAnimation(value: string) {
        if (this._addtiveAnimation === value) {
            return;
        }

        this._addtiveAnimation = value;
        this.play();
    }

    @property(EditType.String)
    @serializedField
    public get maskJointNames(): string {
        return this._maskJointNames;
    }
    public set maskJointNames(value: string) {
        if (this._maskJointNames === value) {
            return;
        }

        this._maskJointNames = value;
        this.play();
    }

    @property(EditType.Button)
    @serializedField
    public play: () => void = () => {
        const animation = this.entity.getComponent(Animation);
        if (animation) {


            const animationController = animation.animationController!;
            const layer = animationController.getOrAddLayer(1);
            // animationController.getOrAddLayer(this.layerIndex).weight = 0.5;
            let mask = layer.mask as AnimationMask | null;
            layer.weight = 1;

            if (this._maskJointNames.length) {
                const masks = this._maskJointNames.split(",");

                if (!mask) {
                    layer.mask = mask = AnimationMask.create();
                    layer.additive = this.layerAdditive;
                    mask.createJoints(this.entity.getComponentInChildren(MeshFilter)!.mesh!);
                }

                for (const joint of masks) {
                    mask.addJoint(joint);
                }
            }
            else if (mask) {
                mask.removeJoints();
            }
            animation.fadeIn(this.animation, this.fadeTime, 0, this.layerIndex);
            if (this.layerAdditive === true) {
                animation.fadeIn(this.addtiveAnimation, this.fadeTime, 0, 1, this.layerAdditive);
            }
            else {
                layer.weight = 0;
                animationController.getOrAddLayer(this.layerIndex).weight = 1;
            }

        }
    }

    @property(EditType.Boolean)
    @serializedField
    public logEvents: boolean = false;

    private _animation: string = "";
    private _addtiveAnimation: string = "";
    private _layerAdditive: boolean = false;
    private _maskJointNames: string = "";
    private readonly _animations: ListItem[] = [];

    public onAwake(logEvents?: boolean) {
        if (logEvents) {
            this.logEvents = true;
        }
    }

    public onStart() {
        const animation = this.entity.getComponent(Animation);
        if (animation) {
            for (const animationAsset of animation.animations) {
                if (!animationAsset) {
                    continue;
                }

                for (const glftAnimation of animationAsset.glTF.animations as GLTFAnimation[]) {
                    for (const animationClip of glftAnimation.extensions.egret.clips) {
                        this._animations.push({ label: animationClip.name, value: animationClip.name });
                        animatins.push({ label: animationClip.name, value: animationClip.name });
                    }
                }
            }
        }
        if (this._animations.length > 0) {
            this.animation = this._animations[0].value;
            this.addtiveAnimation = this._animations[0].value;
        }
    }

    public onAnimationEvent(animationEvent: AnimationEvent) {
        if (this.logEvents) {
            console.log(animationEvent.type, animationEvent.animationName);
        }
    }
}