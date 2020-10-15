import { Vector3 } from "@egret/engine";

export class MyMathUtil {

    public static vector2Dot(x1: number, y1: number, x2: number, y2: number) {
        return x1 * y1 + x2 * y2;
    }

    public static vector3Dot(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        return x1 * x2 + y1 * y2 + z1 * z2;
    }

    public static vector3Dot_vector(x1: number, y1: number, z1: number, vector3: Vector3) {
        return x1 * vector3.x + y1 * vector3.y + z1 * vector3.z;
    }
    public static squaredLength(numbers: number[]) {
        let result = 0;
        for (let vector of numbers) {
            result += vector * vector;
        }
        return result;
    }


}