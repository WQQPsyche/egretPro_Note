# 动画

egret pro 拥有丰富的动画系统，他提供了

- 用不同的逻辑动画不同的身体部位
- 分层和屏蔽功能
- 动画融合 

## 使用动画

1. 导入模型与动画文件到EgretPro项目当中

![导入模型示例](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/1.png)

2、打开模型预制体，在预制体根节点上添加组件@egret/animation/Animation

![Animation组件示例1](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/2.png)

- autoPlay：该动画组件是否自动播放，勾选后会在场景中加入该预制体后自动开始播放动画
- timeScale：动画速度，调整动画总体的播放速率，可实现变速。
- applyRootMotion：是否将动画数据中根节点的变换动画应用到该组件实体的变换组件上
- animations：该组件的动画资源列表
- preferBaked: 是否优先使用预烘焙动画模式，需要点击 `确定` 按钮修改该状态。



3、点击animations右侧的加号，添加该模型所需要的动画。 ![Animation组件示例2](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/3.png)

如果勾选autoPlay，则默认播放animations中的第一个动画，

如果需要切换动画，可在组件中根据资源名通过`play(animationClipName: string, playTimes: number)`方法播放

```typescript
this.entity.getComponent(Animation).play("Dog_attack_0");
```

## BakedAnimation

什么是烘焙动画？

> 转换内置的控制器动画（骨骼动画或者IK动画）为逐帧动画，可以预防一些经常发生的错误，比如一个角色动画，先播放了跑步，然后播放攻击，如果攻击动画没有下身动作的话，那么角色的下肢就会保持在跑步的最后一帧。而塌陷可以保证每个肢体都有正确的动画关键帧可读。单从效果来说是看不出区别的。

由于Animation动画是实时计算模型骨骼的位置并进行渲染的，在某些配置较低的手机上可能会出现卡顿的情况。因此,EgretPro提供一套新的动画播放机制，可提前获取每帧动画数据并进行渲染，与Animation动画基本没有区别，提高动画性能最多100%。

### 数据生成BakedAnimation数据生成

BakedAnimation所需数据需要单独生成。在@egret/animation/Animation组件的属性菜单中，preferBaked选项。

![数据生成按钮1](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/4.png)

勾选后出现预烘焙动画选项，可修改生成的BakedAnimation的播放帧频，默认为60帧。

![数据生成按钮2](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/4_1.png)

`空` 代表当前还未生成预烘焙数据，或者是当前目录的预烘焙数据丢失。

点击 `确定` 应用当前选项，若勾选了preferBaked则会生成预烘焙动画数据。

正常生成的预烘焙数据会在baked目录下， 以example项目 `resource/assets/animations/BakedAnimation/Dog_standby_out`举例

![数据生成按钮2](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/4_2.png)

生成后数据示例如下:

![生成的位置](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/5.png)

其中bakedConfig.json为预烘焙动画的配置数据。引擎找到该配置文件才能使用预烘焙动画。

此时 EgretPro 中 Animation组件已经找到了 `bakedConfig.json`;

![Animation组件演示](https://docs.egret.com/egretpro/img/docs/guide/engine-features-animation/6.png)

至此，预烘焙动画数据生成完成。

### BakedAnimation的使用

与Animation的使用方法基本一致。开发者只需将带有Animation组件的动画对象放入场景当中即可。 引擎会根据 `preferBaked` 的状态,自动选择加载预烘焙动画还是默认动画。

若不想使用预烘焙动画，只需取消 `preferBaked` 勾选，并点击确定即可。



## 动画混合

动画混合是将多个动画资源融合在同一时间播放处理的方法。 在某些情况下，你可能会遇到这样的情况：你需要角色的下肢播放走路的动画，角色的手部需要使用你一个动画资源的动作，这时候你就需要使用动画融合。

## 动画融合树

动画树是控制多个动画的播放顺序和对骨骼变换权重的影响的方式 在某些情况下，你可能会遇到这样的情况：你需要你的角色进行走路和跑步的过渡，你就可以使用动画融合树来进行处理。

## 动画骨骼蒙皮

骨骼蒙皮代表着哪些骨骼将被动画资源所影响。 当你的某个动画资源只需要影响手部骨骼，那就需要使用骨骼蒙皮了。



# 缓动动画

#### 缓动动画

- 使用了TweenLite库，开发者可以灵活的使用TweenLite里的方法。并且提供了一些基本的方法，使开发者可以简单的设定目标点的平移，旋转，缩放到目标位置。
- 首先开发者需要在egretPro.json 引入tween，然后就可以使用Tween中的方法，以下以 Tween.toPosition方法为例。

![img](https://docs.egret.com/egretpro/img/docs/guide/engine-features-behaviour-tree-ai/tween.png)



开发者使用此方法的时候需要传入三个参数,第一个为目标或目标组的Transfrom，第二个参数为动画的持续时间，第三个参数为动画参数，如目标需要移动到的位置x值，是否使用世界坐标等等。 调用方法如下： Tween.toPosition(entity.getComponent(Transform), 2, { y: 2 });

