import { component } from "@egret/ecs";
import { Behaviour, Vector3, Application } from "@egret/engine";
import { Animation } from "@egret/animation";
import { property, EditType, serializedField } from "@egret/core";
import { InputManager, Pointer, InputCode } from "@egret/input";
import { CoinSystem } from "./CoinSystem";

@component()
class PlayerController extends Behaviour{
    
    @property(EditType.Float)
    public moveSpeed = 5;

    @serializedField
    @property(EditType.Entity)
    public camera = null;

    private offsetPosition:Vector3;
    private inputManager:InputManager;
    private roadBound = 2;

    private startPostionX:number;

    onAwake(){
        Application.instance.systemManager.registerSystem(CoinSystem);
        Application.instance.systemManager.getSystem(CoinSystem).player = this.entity;
    }

    onStart(){
        const animation = this.entity.getComponentInChildren(Animation);
        animation.play("Boy_run_0");

        this.inputManager = Application.instance.globalEntity.getComponent(InputManager);
        
        //监听2d的消息
        Application.instance.egretProUtil.addEventListener("2dTouchBegin",1,this.touchBeginFrom2D,this);
        Application.instance.egretProUtil.addEventListener("2dTouchMove",1,this.touchMoveFrom2D,this);
        

    }
    touchBeginFrom2D(){
        
        this.startPostionX = this.entity.transform.position.x;
    }

    touchMoveFrom2D(messag:any){

        let moveX = this.startPostionX + messag/100;
        if(moveX > this.roadBound){
            moveX = this.roadBound
        }
        if(moveX < -this.roadBound){
            moveX = -this.roadBound;
        }

        this.entity.transform.setPosition(
            moveX,
            this.entity.transform.position.y,
            this.entity.transform.position.z
        );
    }

    
    onUpdate(dt){

       
            let moveX = 0;
    
            this.entity.transform.translate(0,0,this.moveSpeed*dt);
            this.camera.transform.translate(0,0,this.moveSpeed*dt);
    
            const _leftMouse = this.inputManager.getInput(InputCode.LeftMouse);
            // 鼠标左键按下的时候记录下主角的位置
            if(_leftMouse.isDown){
                this.startPostionX = this.entity.transform.position.x;
            }
            //获取鼠标移动的距离
            if(_leftMouse.isHold){
                const point = _leftMouse.entity.getComponent(Pointer);
                moveX = point.position.x - point.downPosition.x;
                
            }
            if (moveX) {
                let playerNextPostionX = this.startPostionX + moveX/100;
                if (playerNextPostionX > this.roadBound) {
                    playerNextPostionX = this.roadBound;
                }
    
                if (playerNextPostionX < -this.roadBound) {
                    playerNextPostionX = -this.roadBound;
                }
    
                this.entity.transform.setPosition( playerNextPostionX,
                    this.entity.transform.position.y,
                    this.entity.transform.position.z);
            }
    
            }
}