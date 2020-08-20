import { EditType, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, Color, GameEntity, Ray, RaycastInfo, Transform, Vector3, EngineFactory } from "@egret/engine";
import { ComponentType } from "@egret/gltf";
import { DefaultShaders, DefaultMeshes, Material, Shader, Mesh, MeshFilter, MeshRenderer, SkinnedMeshRenderer, UniformName, BlendMode, RenderQueue } from "@egret/render";

@component()
export class XRay extends Behaviour {

    private static _shader: Shader | null = null;

    //     @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 4.0 })
    //     public p: number = 3.0;
    //     @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 2.0 })
    //     public c: number = 1.0;
    //     @paper.editor.property(paper.editor.EditType.COLOR)
    //     public readonly glowColor: egret3d.Color = egret3d.Color.INDIGO.clone();

    public onStart() {
        // Create shader.
        if (XRay._shader === null) {
            XRay._shader = Shader.create(DefaultShaders.MESH_PHONG)
                .addDefine(
                    "CUSTOM_XRAY",
                    {
                        custom_vertex: `
                            uniform float _c;
                            uniform float _p;
                            varying float _intensity;
                        `,
                        custom_end_vertex: `
                            vec3 _normal = normalize( normalMatrix * (cameraPosition - modelMatrix[2].xyz) );
                            _intensity = pow( _c - dot(transformedNormal, _normal), _p );
                        `,
                        custom_fragment: `
                            varying float _intensity;
                        `,
                        custom_end_fragment: `
                            gl_FragColor *= _intensity;
                        `,
                    }
                )
                .addUniform("_c", ComponentType.Float, 1.3)
                .addUniform("_p", ComponentType.Float, 3.0)
                ;
        }

        const meshRenderer = this.entity.renderer as MeshRenderer | null;
        if (meshRenderer) {
            meshRenderer.material = Material.create(XRay._shader)
                .setBlend(BlendMode.Additive, RenderQueue.Blend)
                .setColor(Color.INDIGO);
        }
    }

    //     public onUpdate() {
    //         if (this.gameObject.renderer && this.gameObject.renderer!.material) {
    //             this.gameObject.renderer!.material!
    //                 .setFloat("_p", this.p)
    //                 .setFloat("_c", this.c)
    //                 .setColor(this.glowColor);
    //         }
    //     }
}
