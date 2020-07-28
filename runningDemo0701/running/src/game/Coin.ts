import { component } from "@egret/ecs";
import { Behaviour, GameEntity } from "@egret/engine";

@component()
export class Coin extends Behaviour{

}

export class CoinPool{
    static coinPool:GameEntity[] = [];
}