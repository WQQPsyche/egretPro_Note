import { component } from "@egret/ecs";
import { Behaviour } from "@egret/engine";

@component()
export class CutFly extends Behaviour{
    //默认速度
    public defualtMoveSpeed = {
        x: 2,
        y: 4,
        z: 2,
    }

    public defualtRotateSpeed = {
        x: 60,
        y: 30,
        z: 60,
    }


    public moveSpeed = {
        x: 2,
        y: 3,
        z: 3,
    }

    public moveSpeedLength = 0.01;

    public rotateSpeed = {
        x: 60,
        y: 30,
        z: 60,
    }

    public distance = 5;

}