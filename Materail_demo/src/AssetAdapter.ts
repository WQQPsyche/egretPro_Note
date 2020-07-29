import * as egret2d from "@egret/egret2d";
import * as render from "@egret/render";
import { ResourceItem, ResourceType, ResourceManager } from "@egret/core";

export class AssetAdapter implements eui.IAssetAdapter {

    private _loadRes(source: string): Promise<ResourceItem | null> {
        const Res = ResourceManager.instance;
        const item = Res.getResourceItemByName(source);
        return Res.load(item).
            then((data) => {
                return Promise.resolve(data);
            })
            .catch(() => {
                return Promise.resolve(null);
            });
    }

    private _getData(res: ResourceItem) {
        if (res.type !== ResourceType.Image) {
            return res.data;
        }

        if (res.data !== null) {
            let textureComp = res.data;
            if (res.data instanceof render.Texture) {
                textureComp = res.data;
            }
            else {
                textureComp = res.data.textureComp;
                if (textureComp === null || textureComp === undefined) {
                    textureComp = render.Texture.fromGLTF<render.Texture>(render.Texture.createGLTF({ source: res.data.source }));
                    res.data.textureComp = textureComp;
                }
            }

            //3D的texture转换为2D的texture
            return textureComp.entity.getOrAddComponent(egret2d.EgretTexture).texture;
        }
        //
        return null;
    }

    public getAsset(source: string, compFunc: Function, thisObject: any): void {
        this._loadRes(source).
            then((res: ResourceItem) => {
                const data = this._getData(res);
                if (data === null) {
                    console.error(`[eui] failed to get image:${res.uri}`);
                }

                compFunc.call(thisObject, data, source);
            })
            .catch(() => { // 异常
                console.error(`AssetAdapter:${source} load error!`);
            });
    }
}