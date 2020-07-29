import { ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Application, Behaviour, Color, Const, EngineFactory, Matrix3, Vector3 } from "@egret/engine";
import { CullFace, FrontFace } from "@egret/gltf";
import { Camera, DefaultMaterials, DefaultMeshes, DefineName, HemisphereLight, LightShadow, Material, MeshCreater, MeshFilter, MeshRenderer, RenderContext, SceneLight, SpotLight, Texture, TextureEncoding, ToneMapping, UniformName } from "@egret/render";
import { Rotater } from "../Rotater";

/**
 * 这个例子用于展示如何使用色调映射(ToneMapping)技术
 * 
 * RenderContext提供以下属性可供修改
 * * toneMapping : 色调映射算法类型
 * * toneMappingExposure : 色调映射的曝光级别
 * * toneMappingWhitePoint：色调映射的白点
 * 
 * 您可以通过Application.instance.globalEntity.getComponent(RenderContext)获取这个组件
 */

@component()
export class CreateToneMappingObject extends Behaviour {
    public async onAwake() {
        const Res = ResourceManager.instance;
        Res.baseUrl = "resource/";
        await Res.loadUri("assets/textures/tonemapping/brick_diffuse.image.json");
        await Res.loadUri("assets/textures/tonemapping/brick_bump.image.json");
        await Res.loadUri("assets/textures/tonemapping/brick_roughness.image.json");
        await Res.loadUri("threejs/textures/cube/pisa/pisa.image.json");
        {
            const renderContext = Application.instance.globalEntity.getComponent(RenderContext)!;
            renderContext.gammaInput = true;
            renderContext.gammaOutput = true;
            renderContext.gammaFactor = 2.0;
            renderContext.toneMapping = ToneMapping.Uncharted2ToneMapping;
            renderContext.toneMappingExposure = 3.0;
            renderContext.toneMappingWhitePoint = 5.0;

        }
        {
            const MainCamera = Application.instance.sceneManager.activeScene.root.getChildByName("Main Camera");
            const mainCamera = MainCamera.entity.getComponent(Camera);
            mainCamera.fov = 40.0 * Const.DEG_RAD;
            mainCamera.far = 2000.0;
            mainCamera.near = 1.0;
            mainCamera.backgroundColor.fromHex(0x000000);
            mainCamera.entity.transform.setLocalPosition(0.0, 40.0, -40 * 3.5).lookAt(Vector3.ZERO);

        }

        { // Create game object.
            const torusKnotMesh = MeshCreater.createTorusKnot(18.0, 8.0, 150.0, 20.0);
            const textureDiffue = Res.getResource("assets/textures/tonemapping/brick_diffuse.image.json") as Texture;
            const textureBump = Res.getResource("assets/textures/tonemapping/brick_bump.image.json") as Texture;
            const textureRoughness = Res.getResource("assets/textures/tonemapping/brick_roughness.image.json") as Texture;
            const textureEnv = Res.getResource("threejs/textures/cube/pisa/pisa.image.json") as Texture;
            textureEnv.autoReleaseImages = false;
            textureDiffue.glTFTexture.extensions.egret.encoding = TextureEncoding.sRGBEncoding;
            const gameObject = EngineFactory.createGameEntity3D("Torus Knot");
            gameObject.addComponent(MeshFilter).mesh = torusKnotMesh;
            const material = Material.create(DefaultMaterials.MESH_STANDARD);
            material.setFloat(UniformName.BumpScale, -0.05)
                .setFloat(UniformName.Metalness, 0.8)
                .setFloat(UniformName.Roughness, 0.9)
                .setColor(Color.WHITE)
                .setTexture(textureDiffue)
                .setTexture(UniformName.BumpMap, textureBump)
                .setTexture(UniformName.RoughnessMap, textureRoughness)
                .setTexture(UniformName.EnvMap, textureEnv)
                .setUVTransform(Matrix3.create().fromUVTransform(0.0, 0.0, 9.0, 0.5, 0.0, 0.0, 0.0).release())
                .addDefine(DefineName.PREMULTIPLIED_ALPHA);
            gameObject.addComponent(MeshRenderer).material = material;
            gameObject.getComponent(MeshRenderer).receiveShadows = true;
            gameObject.getComponent(MeshRenderer).castShadows = true;
            gameObject.addComponent(Rotater).speed.y = -15;
        }
        { // Create lights.
            Application.instance.globalEntity.getComponent(SceneLight).ambientColor.fromHex(0x000000);
            const hemisphereLight = EngineFactory.createGameEntity3D("Hemisphere Light").addComponent(HemisphereLight);
            hemisphereLight.color.fromHex(0x111111);
            hemisphereLight.groundColor.fromHex(0x000000);
            hemisphereLight.entity.transform.setLocalPosition(0.0, 100.0, 0.0).lookAt(Vector3.ZERO);
            const spotLight = EngineFactory.createGameEntity3D("Spot Light").addComponent(SpotLight);
            spotLight.angle = Math.PI / 7.0;
            spotLight.decay = 2.0;
            spotLight.distance = 300.0;
            spotLight.penumbra = 0.8;
            spotLight.color.fromHex(0xFFFFFF);
            spotLight.entity.addComponent(LightShadow);
            spotLight.entity.transform.setLocalPosition(50.0, 100.0, -50.0).lookAt(Vector3.ZERO);
        }

        { // Create background.
            const gameObject = EngineFactory.createGameEntity3D("Background");
            gameObject.addComponent(MeshFilter).mesh = DefaultMeshes.CUBE;
            const material = Material.create(DefaultMaterials.MESH_STANDARD);
            material.setFloat(UniformName.Metalness, 0.0)
                .setFloat(UniformName.Roughness, 1.0)
                .setColor(0xFFFFFF)
                .setCullFace(true, FrontFace.CCW, CullFace.Front);
            gameObject.addComponent(MeshRenderer).material = material;
            gameObject.getComponent(MeshRenderer).receiveShadows = true;
            gameObject.transform.setLocalPosition(0.0, 50.0, 0.0).setLocalScale(200.0);
        }


    }
    public onUpdate(deltaTime: number): any {

    }
}
