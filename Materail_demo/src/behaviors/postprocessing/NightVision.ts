import { ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour } from "@egret/engine";

@component()
export class NightVision extends Behaviour {

    public async onStart() {
        const Res = ResourceManager.instance;
        Res.baseUrl = "resource/";
        await Res.loadUri("assets/textures/HeatLookup.image.json");
        await Res.loadUri("assets/textures/HeatNoise.image.json");

    }
    public onUpdate(deltaTime: number): any {

    }

}