export class CheckPoint {

    cssId: string;
    docPosition: number;
    destinationV: V3;
    destinationAngleDeg: number;
    angleRad: number;

    constructor(id: string, docPosY: number, destinationX: number, destinationY: number, destinationZ:number, angleDeg: number){
        this.cssId = id;
        this.docPosition = docPosY;
        this.destinationV = new V3(destinationX, destinationY, destinationZ);
        this.destinationAngleDeg = angleDeg;
        this.angleRad = angleDeg * Math.PI / 180;
    }
}

export class V3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}