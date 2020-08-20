import { component } from "@egret/ecs";
import { Vector3, GameEntity, Behaviour, EngineFactory } from "@egret/engine";
import { MeshFilter, MeshRenderer, DefaultMeshes, DefaultMaterials, MeshCreater } from "@egret/render";
import { Rigidbody, BoxCollider, CapsuleCollider, ConeCollider, CylinderCollider, SphereCollider } from "@egret/oimo";
/**
 * 
 */
@component()
export class CollidersStarter extends Behaviour {

    public onStart() {
        for (let i = 0; i < 100; i++) {
            let entity: GameEntity | null = null;

            switch (Math.floor(Math.random() * 5)) {
                case 0: {
                    const size = Vector3.create(Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5, Math.random() * 1.5 + 0.5).release();
                    entity = EngineFactory.createGameEntity3D(`Box ${i}`);
                    entity.addComponent(MeshFilter).mesh = DefaultMeshes.CUBE;
                    entity.transform.setLocalScale(size);
                    const boxCollider = entity.addComponent(BoxCollider);
                    boxCollider.box.size = size;
                    break;
                }

                case 1: {
                    const size = Math.random() * 1.5 + 0.5;
                    entity = EngineFactory.createGameEntity3D(`Sphere ${i}`);
                    entity.addComponent(MeshFilter).mesh = DefaultMeshes.SPHERE;
                    entity.transform.setLocalScale(size);
                    const sphereCollider = entity.addComponent(SphereCollider);
                    sphereCollider.sphere.radius = size * 0.5;
                    break;
                }

                case 2: {
                    const sizeA = Math.random() * 1.5 + 0.5;
                    const sizeB = Math.random() * 1.5 + 0.5;
                    entity = EngineFactory.createGameEntity3D(`Cylinder ${i}`);
                    entity.addComponent(MeshFilter).mesh = DefaultMeshes.CYLINDER;
                    entity.transform.setLocalScale(sizeA, sizeB, sizeA);
                    const cylinderCollider = entity.addComponent(CylinderCollider);
                    cylinderCollider.frustumCone.topRadius = sizeA * 0.5;
                    cylinderCollider.frustumCone.bottomRadius = sizeA * 0.5;
                    cylinderCollider.frustumCone.height = sizeB;
                    break;
                }

                case 3: {
                    const sizeA = Math.random() * 1.5 + 0.5;
                    const sizeB = Math.random() * 1.5 + 0.5;
                    entity = EngineFactory.createGameEntity3D(`Cone ${i}`);
                    entity.addComponent(MeshFilter).mesh = DefaultMeshes.CONE;
                    entity.transform.setLocalScale(sizeA, sizeB, sizeA);
                    const coneCollider = entity.addComponent(ConeCollider);
                    coneCollider.frustumCone.bottomRadius = sizeA * 0.5;
                    coneCollider.frustumCone.height = sizeB;
                    break;
                }

                case 4: {
                    const sizeA = Math.random() * 1.5 + 0.5;
                    const sizeB = Math.random() * 1.5 + 0.5;
                    entity = EngineFactory.createGameEntity3D(`Capsule ${i}`);
                    entity.addComponent(MeshFilter).mesh = MeshCreater.createCapsule(sizeA * 0.5, sizeB * 0.5);
                    const capsuleCollider = entity.addComponent(CapsuleCollider);
                    capsuleCollider.capsule.radius = sizeA * 0.5;
                    capsuleCollider.capsule.height = sizeB * 0.5;
                    break;
                }
            }
            //
            if (entity !== null) {
                entity.transform.setLocalPosition(
                    Math.random() * 8.0 - 4.0,
                    Math.random() * 8.0 + 4.0,
                    Math.random() * 8.0 - 4.0
                );
                const renderer = entity.addComponent(MeshRenderer);
                renderer.castShadows = true;
                renderer.material = DefaultMaterials.MESH_PHYSICAL;
                entity.addComponent(Rigidbody);
            }
        }
    }
}
