import { component } from "@egret/ecs";
import { Behaviour } from "@egret/engine";
import { RenderTexture, Camera, MeshRenderer, Material, DefaultShaders } from "@egret/render";
/**
 * 
 */
@component()
export class RenderTextureStarter extends Behaviour {
    /**
     * 
     */
    public onStart() {
        const camera = this.entity.getComponentInChildren(Camera);
        const renderer = this.entity.getComponent(MeshRenderer);
        if (camera !== null && renderer !== null) {
            camera.renderTarget = RenderTexture.create({ width: 512, height: 512 });
            renderer.material = Material.create(DefaultShaders.MESH_BASIC).setTexture(camera.renderTarget);
        }
    }
}
