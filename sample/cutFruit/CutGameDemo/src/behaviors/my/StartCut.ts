import { EditType, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Application, Behaviour, GameEntity, Vector2, Vector3 } from "@egret/engine";
import { Input, InputCode, InputManager } from "@egret/input";
import { Cut } from "./Cut";

@component()
export class StartCut extends Behaviour{
    @serializedField
    @property(EditType.Entity)
    public target:GameEntity = null;

    private _application = Application.instance;
    private _inputManager:InputManager;

    private space:Input;
    public keyW: Input;
    public keyA: Input;
    public keyS: Input;
    public keyD: Input;

    public keyLeft: Input;
    public keyRight: Input;
    public keyUp: Input;
    public keyDown: Input;


    onStart(){
        this.setInput();
    }
    /**
     * 处理输入组件
     */
    private setInput() {
        this._application = Application.instance;

        this._inputManager = this._application.globalEntity.getComponent(InputManager);
        this.space = this._inputManager.getInput(InputCode.Space);

        this.keyW = this._inputManager.getInput(InputCode.KeyW);
        this.keyA = this._inputManager.getInput(InputCode.KeyA);
        this.keyS = this._inputManager.getInput(InputCode.KeyS);
        this.keyD = this._inputManager.getInput(InputCode.KeyD);

        this.keyLeft = this._inputManager.getInput(InputCode.ArrowLeft);
        this.keyRight = this._inputManager.getInput(InputCode.ArrowRight);
        this.keyUp = this._inputManager.getInput(InputCode.ArrowUp);
        this.keyDown = this._inputManager.getInput(InputCode.ArrowDown);
    }
    public getKeyboardMove() {

        const currentMoveTouchVector2 = Vector2.create();
        let x = 0;
        let y = 0;
        if (this.keyW.pressure > 0 || this.keyUp.pressure > 0) {
            y++;
        }
        if (this.keyS.pressure > 0 || this.keyDown.pressure > 0) {
            y--;
        }
        if (this.keyA.pressure > 0 || this.keyLeft.pressure > 0) {
            x--;
        }
        if (this.keyD.pressure > 0 || this.keyRight.pressure > 0) {
            x++;
        }

        if (!x && !y) {
            currentMoveTouchVector2.x = 0;
            currentMoveTouchVector2.y = 0;
        }
        else {
            currentMoveTouchVector2.x = x;
            currentMoveTouchVector2.y = y;
        }


        return currentMoveTouchVector2;
    }

    onUpdate(dt:number){
        const cubeMoveDirection = this.getKeyboardMove();
        if (!cubeMoveDirection.equal(Vector2.ZERO)) {
            this.entity.transform.translate(0, cubeMoveDirection.y * dt * 0.5, 0);
        }
        if (this.space.isDown) {
                console.log("开始 CUT ");
    
                const cutPosition = 
                this.entity.transform.position.clone();
                if (this.target.getComponent(Cut)) {
                    console.error("targetCub 已经有 CutTest 了"); 
                    this.target.removeComponent(Cut);
                }
                const cutTest = this.target.addComponent(Cut);
                cutTest.showVertices = true;//是否显示顶点
                cutTest.addBoxFly = false;//添加某个效果
                cutTest.point = cutPosition;//切点
                cutTest.normal.set(0, 1, 0);//切点的法向量
        
                cutTest.cutPlaneControllerEntity = this.entity;
    
            }
        }

    }