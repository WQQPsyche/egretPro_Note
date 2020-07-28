import { System, system, Matcher } from "@egret/ecs";
import { GameEntity } from "@egret/engine";
import { Coin, CoinPool } from "./Coin";
import { Tween, Elastic } from "@egret/tween";


@system()
export class CoinSystem extends System{

    player:GameEntity = null;

    getMatchers(){
        return  [
            Matcher.create(GameEntity,true,Coin)
        ];
    }
    onFrame(){
        const coins = this.groups[0].entities as GameEntity[];

        for (const coin of coins) {
            
            console.log( coin.transform.position.z,  this.player.transform.position.z);
            
            if(coin.transform.position.z < this.player.transform.position.z-5){
                coin.enabled = false;
                coin.getComponent(Coin).enabled = false;
                CoinPool.coinPool.push(coin);        
            }
            //判断玩家与金币的碰撞
            if (coin.transform.position.getDistance(this.player.transform.position)<1) { 
                coin.getComponent(Coin).enabled = false;
                
                Tween.toPosition(coin.transform,1,{
                    y:3,
                    ease:Elastic.easeOut,
                    onComplete:()=>{
                        coin.enabled = false;
                        CoinPool.coinPool.push(coin);
                    }
                })
            }
            }
        }
    }
