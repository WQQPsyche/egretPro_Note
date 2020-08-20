import { component } from "@egret/ecs";
import { EditType, getItemsFromEnum, property, serializedField } from "@egret/core";
import { Application, Behaviour } from "@egret/engine";
import { RenderContext, ToneMapping } from "@egret/render";
import * as render from "@egret/render";
/**
 * 为同一个项目的不同场景提供不同的渲染上下文配置。
 */
@component()
export class SetRenderContext extends Behaviour {
    /**
     * 
     */
    @property(EditType.Boolean)
    @serializedField
    public gpuInstancingEnale: boolean = false;
    /**
     * 
     */
    @property(EditType.Boolean)
    @serializedField
    public logarithmicDepthBuffer: boolean = true;
    /**
     * 
     */
    @property(EditType.Boolean)
    @serializedField
    public gammaInput: boolean = true;
    /**
     * 
     */
    @property(EditType.Boolean)
    @serializedField
    public gammaOutput: boolean = false;
    /**
     * 
     */
    @property(EditType.Float)
    @serializedField
    public gammaFactor: float = 2.0;
    /**
     * 
     */
    @property(EditType.Enum, { listItems: getItemsFromEnum((render as any).ToneMapping) })
    @serializedField
    public toneMapping: ToneMapping = ToneMapping.LinearToneMapping;
    /**
     * 
     */
    @property(EditType.Boolean)
    @serializedField
    public premuItipliedAlpha: boolean = false;
    /**
     * 
     */
    @property(EditType.Float, { minimum: 0.0, maximum: 10.0 })
    @serializedField
    public toneMappingExposure: float = 1.0;
    /**
     * 
     */
    @property(EditType.Float, { minimum: 0.0, maximum: 10.0 })
    @serializedField
    public toneMappingWhitePoint: float = 1.0;

    public onStart() {
        const renderContext = Application.instance.globalEntity.getComponent(RenderContext)!;
        renderContext.gpuInstancingEnable = this.gpuInstancingEnale;
        renderContext.logarithmicDepthBuffer = this.logarithmicDepthBuffer;
        renderContext.gammaInput = this.gammaInput;
        renderContext.gammaOutput = this.gammaOutput;
        renderContext.gammaFactor = this.gammaFactor;
        renderContext.toneMapping = this.toneMapping;
        renderContext.premultipliedAlpha = this.premuItipliedAlpha;
        renderContext.toneMappingExposure = this.toneMappingExposure;
        renderContext.toneMappingWhitePoint = this.toneMappingWhitePoint;
    }
}
