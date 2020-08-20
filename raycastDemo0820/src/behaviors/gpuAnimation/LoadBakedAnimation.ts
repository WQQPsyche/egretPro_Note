import { Animation } from "@egret/animation";
import { component } from "@egret/ecs";
import { Behaviour, EngineFactory } from "@egret/engine";


@component()
export class LoadBakedAnimation extends Behaviour {

    public animationUris: string[] = [];

    public async onStart() {

        const entity = await EngineFactory.createPrefab("assets/animations/BakedAnimation/Dog_standby_out/Dog_standby.gltf.prefab.json");
        const animation = entity.getComponent(Animation);
        console.log("预制体加载完成");
        console.log("准备播放");
        animation.play();
    }
}