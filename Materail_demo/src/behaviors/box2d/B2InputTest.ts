import { Behaviour, Application, Vector2, GameEntity, TestPointInfo, Plane, Transform, IRigidbody } from "@egret/engine";
import { component } from "@egret/ecs";
import { InputManager, InputCode, Input } from "@egret/input";
import { PhysicsWorld, Rigidbody } from "@egret/box2d";
import { Camera, MeshRenderer } from "@egret/render";
import { serializedField, property, EditType } from "@egret/core";

@component()
export class B2InputTest extends Behaviour {

    input: Input | null = null;

    @serializedField
    @property(EditType.Entity)
    camera: GameEntity | null = null;

    holdEntity: Transform | null = null;

    holdRigidBody: Rigidbody | null = null;

    onStart() {
        const inputManager = Application.instance.globalEntity.getComponent(InputManager)!;
        this.input = inputManager.getInput(InputCode.LeftMouse);
    }

    public onUpdate() {
        if (this.input === null) {
            return;
        }
        if (this.input.isDown) {
            const inputManager = Application.instance.globalEntity.getComponent(InputManager)!;
            const pointer = inputManager.getPointer(0);
            const physicsWorld = Application.instance.globalEntity.getComponent(PhysicsWorld)!;
            const camera = this.camera!.getComponent(Camera)!;
            const position = pointer.downPosition;
            const ray = camera.stageToRay(position.x, position.y);
            const testPointInfo = new TestPointInfo();
            physicsWorld.hitTestFromRay(ray, testPointInfo);
            if (testPointInfo.rigidbody) {
                this.holdRigidBody = testPointInfo.rigidbody;
                this.holdEntity = testPointInfo.transform;
            }

        }
        else if (this.input.isHold) {
            if (this.holdEntity === this.entity.getComponent(Transform)) {
                const inputManager = Application.instance.globalEntity.getComponent(InputManager)!;
                const pointer = inputManager.getPointer(0);
                const camera = this.camera!.getComponent(Camera)!;
                const position = pointer.lastPosition;
                const ray = camera.stageToRay(position.x, position.y);
                const physicsWorld = Application.instance.globalEntity.getComponent(PhysicsWorld)!;
                const inputInWorld = physicsWorld.rayToWorld(ray);
                const velocity = new Vector2().set(inputInWorld.x - this.holdEntity!.position.x, inputInWorld.y - this.holdEntity!.position.y);
                this.holdRigidBody!.linearVelocity = velocity;
            }
        }
        else if (this.input.isUp) {
            this.holdEntity = null;
            this.holdRigidBody = null;
        }
    }
}