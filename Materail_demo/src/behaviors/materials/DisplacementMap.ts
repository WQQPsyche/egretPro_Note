import { EditType, property, ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, Color, EngineFactory, EntityModelAssetEntity, Transform, Vector2 } from "@egret/engine";
import { DefaultShaders, DirectionalLight, Material, MeshRenderer } from "@egret/render";

@component()
export class DisplacementMap extends Behaviour {
    public async onStart() {
        const Res = ResourceManager.instance;
        Res.baseUrl = "resource/";
        await Res.loadUri("assets/Models/ninja/ninjaHead_Low.prefab.json");
        await Res.loadUri("assets/Models/ninja/normal.image.json");
        await Res.loadUri("assets/Models/ninja/ao.image.json");
        await Res.loadUri("assets/Models/ninja/displacement.image.json");
        const lightObj = EngineFactory.createGameEntity3D("Light");
        const light = lightObj.addComponent(DirectionalLight);
        light.color.set(1.0, 0.0, 0.0, 1.0);
        const ninja = EntityModelAssetEntity.createInstance("assets/Models/ninja/ninjaHead_Low.prefab.json");
        ninja.getComponent(Transform).setPosition(0, -185, -63);
        ninja.getComponent(Transform).setLocalEulerAngles(-38, 179, 0);
        ninja.addComponent(GUIScript);
    }
    public onUpdate() {

    }
}
@component()
class GUIScript extends Behaviour {
    @property(EditType.Float, { minimum: 0.0, maximum: 1.0 })
    public metalness: number = 1.0;
    @property(EditType.Float, { minimum: 0.0, maximum: 1.0 })
    public roughness: number = 0.4;
    @property(EditType.Float, { minimum: 0.0, maximum: 1.0 })
    public aoMapIntensity: number = 1.0;
    // @paper.editor.property(paper.editor.EditType.FLOAT)
    // public envMapIntensity: number = 0.0;
    @property(EditType.Float, { minimum: 0.0, maximum: 3.0 })
    public displacementScale: number = 2.436143;
    @property(EditType.Float)
    public displacementBias: number = -0.428408;
    @property(EditType.Float, { minimum: -1.0, maximum: 1.0 })
    public normalScale: number = 1.0;

    private _material: Material | null = null;

    public onAwake() {
        const Res = ResourceManager.instance;
        Res.baseUrl = "resource/";
        const normalMap = Res.getResource("assets/Models/ninja/normal.image.json");
        const aoMap = Res.getResource("assets/Models/ninja/ao.image.json");
        const displacementMap = Res.getResource("assets/Models/ninja/displacement.image.json");
        this._material = Material.create(DefaultShaders.MESH_PHYSICAL);
        this._material.setColor("diffuse", Color.WHITE);
        this._material.setTexture("normalMap", normalMap).
            setTexture("aoMap", aoMap).
            setTexture("displacementMap", displacementMap);
        this._material.addDefine("STANDARD");
        this.entity.getComponentInChildren(MeshRenderer).material = this._material;
    }
    public onUpdate() {
        const material = this._material!;
        material.setFloat("metalness", this.metalness);
        material.setFloat("roughness", this.roughness);
        material.setFloat("aoMapIntensity", this.aoMapIntensity);
        material.setFloat("displacementScale", this.displacementScale);
        material.setFloat("displacementBias", this.displacementBias);
        material.setVector2("normalScale", Vector2.create(1, 1).multiplyScalar(this.normalScale).release());
    }
}