import { ThreeDService } from '../services/three-d.service';
import * as Three from 'three';

export class CheckPoint {

    cssId: string;
    docStartPosition: number;
    docEndPosition: number;
    // destinationV: V3;
    destinationV: Three.Vector3
    destinationAngleDeg: number;
    angleRad: number;

    constructor(id: string, docStartPosY: number, endPositionY: number, destinationX: number, destinationY: number, destinationZ:number, angleDeg: number){
        this.cssId = id;
        this.docStartPosition = docStartPosY;
        this.docEndPosition = endPositionY;
        // this.destinationV = new V3(destinationX, destinationY, destinationZ);
        this.destinationV = new Three.Vector3(destinationX, destinationY, destinationZ);
        // console.log('vector3', this.destinationV)
        this.destinationAngleDeg = angleDeg;
        this.angleRad = angleDeg * Math.PI / 180;
    }
}

// export class V3 {
//     x: number;
//     y: number;
//     z: number;
//     constructor(x: number, y: number, z: number) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//     }
// }