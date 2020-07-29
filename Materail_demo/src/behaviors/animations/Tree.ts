import { Animation, AnimationState, GLTFAnimation } from "@egret/animation";
import { EditType, ListItem, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Application, Behaviour, MathUtil } from "@egret/engine";

export let treeAnimations: ListItem[] = [];

@component()
export class AnimationTree extends Behaviour {

    private firstAnimation: string = "";
    private secondAnimation: string = "";

    private _isPlaying: boolean = false;

    public onStart() {
        const animation = this.entity.getComponent(Animation);
        if (animation) {
            for (const animationAsset of animation.animations) {
                if (!animationAsset) {
                    continue;
                }

                for (const glftAnimation of animationAsset.glTF.animations as GLTFAnimation[]) {
                    for (const animationClip of glftAnimation.extensions.egret.clips) {
                        treeAnimations.push({ label: `assets/animations/Mixamo/xbot@${animationClip.name}.ani.bin`, value: animationClip.name });
                    }
                }
            }
        }
        if (treeAnimations.length > 0) {
            this.secondAnimation = treeAnimations[1].value;
            this.firstAnimation = treeAnimations[0].value;
        }
        this.play = true;
    }

    public onUpdate() {
        const animation = this.entity.getComponent(Animation);
        const firstState = animation.getState(this.firstAnimation) as AnimationState;
        const secondState = animation.getState(this.secondAnimation) as AnimationState;
        this._blending1DStates(firstState, secondState, (Math.sin(Application.instance.clock.frameTime) + 1.0) * 0.5);
    }

    private _blending1DStates(a: AnimationState, b: AnimationState, lerps: number) {
        a.weight = 1.0 - lerps;
        b.weight = lerps;
        a.timeScale = MathUtil.lerp(a.totalTime / b.totalTime, 1.0, a.weight);
        b.timeScale = MathUtil.lerp(b.totalTime / a.totalTime, 1.0, b.weight);
    }

    @property(EditType.Boolean)
    @serializedField
    public get play(): boolean {
        return this._isPlaying;
    }

    public set play(value: boolean) {
        if (this._isPlaying !== value) {
            const animation = this.entity.getComponent(Animation);
            if (animation) {
                const animationController = animation.animationController!;
                const layer = animationController.getOrAddLayer(0);
                const tree = animationController.createAnimationTree(layer.machine, "treeTest");
                animationController.createAnimationNode(tree, treeAnimations[0].label, this.firstAnimation);
                animationController.createAnimationNode(tree, treeAnimations[1].label, this.secondAnimation);

                if (value) {
                    animation.play("treeTest", 0);
                }
                else {
                    animation.stop();
                }
            }

            this._isPlaying = value;
        }
    }
}