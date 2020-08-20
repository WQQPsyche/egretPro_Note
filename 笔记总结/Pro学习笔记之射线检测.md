# 射线碰撞检测

在我们的游戏开发过程中，有一个很重要的工作就是进行碰撞检测。例如在射击游戏中子弹是否击中敌人，在RPG游戏中是否捡到装备等等。在进行碰撞检测时，我们最常用的工具就是射线，egretPro也为我们提供了射线类以及相关的函数接口。

射线是在三维世界中从一个点沿一个方向发射的一条无限长的线。在射线的轨迹上，一旦与添加了碰撞器的模型发生碰撞，将停止发射。我们可以利用射线实现子弹击中目标的检测，鼠标点击拾取物体等功能

## 射线的创建和显示

**Ray**射线类与**RaycastInfo**射线碰撞检测信息类是两个最常用的射线碰撞检测的工具类。

- 创建一条射线Ray需要指明射线的起点（origin）和射线的方向（direction）。创建一个射线Ray类对象：
  **static create(origin?: Readonly<IVector3>, direction?: Readonly<IVector3>): Ray**

- **RaycastInfo**类用于存储发射射线后产生的碰撞信息。创建一个射线碰撞信息对象：

  ​     static **create**(): **RaycastInfo**

- - ​	distance 从射线起点到射线与碰撞器的交点的距离
  - ​	normal 射线射入平面的法向量
  - ​	position 射线与碰撞器交点的坐标（Vector3对象）

**下面是常用的API介绍**

Ray射线类常用的方法和属性：

```typescript

    //该射线的起点。 
    readonly origin: Vector3;
    
    // 该射线的方向。- 单位向量。
    readonly direction: Vector3;
```

```typescript
    /**
     * 创建一个射线。
     * @param origin 射线的起点。
     * @param direction 射线的方向。
     */
    static create(origin?: Readonly<IVector3>, direction?: Readonly<IVector3>): Ray;
    /**
     * 通过一个起点和一个终点设置该射线的属性。
     * @param from 一个起点。
     * @param to 一个终点。
     */
    fromPoints(from: Readonly<IVector3>, to: Readonly<IVector3>): this;
    /**
     * 将该射线乘以一个矩阵。
     * - `this *= matrix`
     * @param matrix 一个矩阵。
     */
    applyMatrix(matrix: Readonly<Matrix4>): this;
    /**
     * 将输入射线与一个矩阵相乘的结果写入该射线。
     * - `this = input * matrix`
     * @param matrix 一个矩阵。
     * @param input 输入射线。
     */
    applyMatrix(matrix: Readonly<Matrix4>, input: Readonly<Ray>): this;
    /**
     * 获取射线上一个目标点，该点到一个指定点的欧氏距离（直线距离）最近。
     * @param point 一个指定点。
     * @param target 一个目标点。
     */
    getClosestPointToPoint(point: Readonly<IVector3>, target: Vector3): Vector3;
    /**
     * 获取从该射线的起点沿着射线方向移动一段距离的一个点。
     * @param distanceDelta 移动距离。
     * @param target 一个点。
     */
    getPointAt(distanceDelta: float, target: Vector3): Vector3;
    /**
     * 获取一点到该射线最近的欧氏距离（直线距离）的平方。
     * @param point 一个点。
     */
    getSquaredDistance(point: Readonly<IVector3>): float;
    /**
     * 获取一点到该射线最近的欧氏距离（直线距离）。
     * @param point 一个点。
     */
    getDistance(point: Readonly<IVector3>): float;
    /**
     * 获取该射线起点到一个平面的欧氏距离（直线距离）。
     * - 如果射线并不与平面相交，则返回 `-1` 。
     * @param plane 一个平面。
     */
    getDistanceToPlane(plane: Readonly<Plane>): float;
```

RaycastInfo类常用的属性和方法

```typescript
 		/**
     * 交点到射线起始点的距离。
     * - 如果未相交则为 -1.0。
     */
    distance: number;
    /**
     * 相交的点。
     */
    readonly position: Vector3;
    /**
     * 三角形或几何面相交的 UV 坐标。
     */
    readonly coord: Vector2;
    /**
     * 相交的法线向量。
     * - 设置该值，将会在检测时计算相交的法线向量，并将结果写入该值。
     * - 默认为 `null` ，不计算。
     */
    normal: Vector3 | null;
    /**
     * 相交的变换组件。
     * - 如果有的话。
     */
    transform: any | null;
    /**
     * 相交的碰撞组件。（如果有的话）
     */
    collider: ICollider | null;
    /**
     * 相交的刚体组件。（如果有的话）
     */
    rigidbody: IRigidbody | null;
```



```typescript
/**
 * 射线检测接口。
 * @public
 */
export declare interface IRaycast {
    /**
     * 检测该几何体是否与一个射线相交。
     *
     * @remarks
     * 当射线的原点在该几何体内部时不算相交。
     *
     * @param ray 一个射线。
     * @param raycastInfo 是否将检测的详细数据写入该值。
     * @returns 。
     */
    raycast(ray: Readonly<IRay>, raycastInfo?: any | null): boolean;
}

```

## 案例演示：使用鼠标拾取物品

```typescript
 /**
     * 将舞台坐标基于该相机的视角转换为世界射线。
     * @param stageX 舞台水平坐标。
     * @param stageY 舞台垂直坐标。
     * @param ray 射线。
     */
    stageToRay(stageX: float, stageY: float, ray?: Ray | null): Ray;
```

案例1：

![](images/%E6%8B%BE%E5%8F%96%E5%8D%95%E4%B8%AA%E7%89%A9%E5%93%81.gif)



直接给场景中的根节点Root添加该组件即可。

Raytest1.ts

```typescript
import { component, Entity } from "@egret/ecs";
import { Behaviour, Ray, RaycastInfo, Application, GameEntity } from "@egret/engine";
import { InputManager, InputState } from "@egret/input";
import { serializedField, property, EditType } from "@egret/core";
import { Camera } from "@egret/render";
import {Tween } from "@egret/tween";


@component()
class RayTest extends Behaviour{
    
    private _ray:Ray = Ray.create();
    private _raycastInfo:RaycastInfo = RaycastInfo.create();

    private _input:InputManager;

    @serializedField
    @property(EditType.Component, { componentClass: Camera })
    public camera:Camera = null;

    // 要拾取的物品
    @serializedField
    @property(EditType.Entity)
    public tg:GameEntity = null;

    
    onStart(){
        this._input = Application.instance.globalEntity.getComponent(InputManager);
       
    }
    onUpdate(){
        for (const pointer of this._input.getPointers(InputState.Up)) {
            //将屏幕的触摸点基于该相机的视角转换成一条世界射线
            const ray = this.camera.stageToRay(pointer.position.x, pointer.position.y, this._ray);
            const raycastInfo = this._raycastInfo.clear();

            //判断立方体是否和射线相交
            if((this.tg.renderer as any).raycast(this._ray,this._raycastInfo) ){
                console.log("拾取物品");
                Tween.toScale(this.tg.transform,1,{x:0,y:0,z:0,onComplete:()=>{
                    this.tg.destroy();
                }})
                
            }    
        }
    }

}
```

案例2：拾取多个物品

![](images/%E6%8B%BE%E5%8F%96%E5%A4%9A%E4%B8%AA%E7%89%A9%E5%93%81.gif)



给每一个cube添加Goods组件，标明这是该拾取的物品。

```typescript
import { component } from "@egret/ecs";
import { Behaviour } from "@egret/engine";

@component()
export class Goods extends Behaviour{
}
```

在system中获取具有Goods组件的实体集合，给这些实体添加射线碰撞检测的行为。

```typescript
import { System, system, Matcher } from "@egret/ecs";
import { GameEntity, Ray, RaycastInfo, Application } from "@egret/engine";
import { InputManager, InputState } from "@egret/input";
import { Camera } from "@egret/render";
import {Tween } from "@egret/tween";
import { Goods } from "./Goods";


@system()
export class GoodsSystem extends System{

    private _ray:Ray = Ray.create();
    private _raycastInfo:RaycastInfo = RaycastInfo.create();
    private _input:InputManager;
    public camera:Camera;
    private _goods:GameEntity[];

    private _deleteGoods:GameEntity[] = [];

    getMatchers(){
        return [
            Matcher.create(GameEntity,true,Goods)
        ]
    }
    onStart(){
        console.log(this.groups);
        
        this._goods = this.groups[0].entities as GameEntity[];
        this._input = Application.instance.globalEntity.getComponent(InputManager);
    }
    onFrame(){
        

        for (const pointer of this._input.getPointers(InputState.Up)) {

            const ray = this.camera.stageToRay(pointer.position.x, pointer.position.y, this._ray);
            const raycastInfo = this._raycastInfo.clear();
           
            for(const item of this._goods){
                if( (item.renderer as any).raycast(this._ray,this._raycastInfo) )
                {
                
                    Tween.toScale(item.transform,0.5,{x:0,y:0,z:0,onComplete:()=>{
                        if(item){
                            this._deleteGoods.push( item );
                        }
                        
                    }});
                }               
            }
              
        }
        for (const deleteItem of this._deleteGoods) {
            for (var i = 0; i < this._goods.length; i++ ) {
                if(deleteItem == this._goods[i]){
                    deleteItem.destroy();
                    this._goods.splice(i,1);
                    i--;
                }
            }
        }
        this._deleteGoods.length = 0;
    }
    }

   
}
```

在组件**RayCastGoods**中注册该系统。

```typescript
import { component, Entity } from "@egret/ecs";
import { Behaviour, Ray, RaycastInfo, Application, GameEntity } from "@egret/engine";
import { InputManager, InputState } from "@egret/input";
import { serializedField, property, EditType } from "@egret/core";
import { Camera } from "@egret/render";
import {Tween } from "@egret/tween";
import {GoodsSystem } from "./GoodsSystem";



@component()
class RayCastGoods extends Behaviour{
    
    @serializedField
    @property(EditType.Component, { componentClass: Camera })
    public camera:Camera = null; 
    onStart(){
        Application.instance.systemManager.registerSystem( GoodsSystem );
        Application.instance.systemManager.getSystem(GoodsSystem).camera = this.camera;
       
    }
}

```

