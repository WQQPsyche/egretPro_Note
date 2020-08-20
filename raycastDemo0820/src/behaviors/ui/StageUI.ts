import { ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Stage2D, Touchable2D, UIRoot } from "@egret/egret2d";
import { Behaviour } from "@egret/engine";
import { AssetAdapter } from "../../AssetAdapter";
import { ThemeAdapter } from "../../ThemeAdapter";

@component()
export class StageUI extends Behaviour {

    stage2D: Stage2D;

    clickButton: eui.Button;

    public onAwake(): void {

        const Res = ResourceManager.instance;
        Res.baseUrl = "resource/";
        Res.loadConfig("default.res.json");
        const assetAdapter: AssetAdapter = new AssetAdapter();
        const themeAdapter: ThemeAdapter = new ThemeAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", themeAdapter);

        this.stage2D = this.entity.getComponent(Stage2D);
        const stage2D = this.stage2D;
        stage2D.entity.addComponent(Touchable2D);

        const theme: eui.Theme = new eui.Theme("2d/default.thm.json", stage2D._egretStage);
        theme.addEventListener(eui.UIEvent.COMPLETE, onThemeLoadComplete, this);

        function onThemeLoadComplete(): void {

            const uiRoot = stage2D.entity.addComponent(UIRoot);

            const uiLayer: eui.UILayer = new eui.UILayer();
            uiLayer.touchEnabled = false;
            uiRoot.addChild(uiLayer);

            const clickButton = new eui.Button();
            clickButton.label = "Click!";
            clickButton.horizontalCenter = 0;
            clickButton.verticalCenter = 0;
            clickButton.width = 150;
            clickButton.height = 75;

            uiLayer.addChild(clickButton);

            clickButton.addEventListener(egret.TouchEvent.TOUCH_TAP, onButtonClick, null);
            function onButtonClick(e: egret.TouchEvent): void {
                showPannel("Button Click!");
            }

            async function showPannel(title: string) {
                const panel = new eui.Panel();
                panel.title = title;
                panel.horizontalCenter = 0;
                panel.verticalCenter = 0;
                uiLayer.addChild(panel);
            }
        }
    }

    public onStart(): void {

    }
}