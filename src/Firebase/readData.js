import surfaceData from "./data2.json";
import siloContents from "./data.json";
import siloScatter from "./data3.json"
// import pointsJson from './points.json';

// console.log("Xc : ",(surfaceData.Xc));

let silo = [];
// for (let i = 0; i < pointsJson.length; i++) {
//   silo.push(JSON.parse(pointsJson[i]));
// }
silo.push({ x: siloContents.x, y: siloContents.y, z: siloContents.z });

export const siloSurfaceForBasavaraj = {
  Xc: surfaceData.Xc,
  Yc: surfaceData.Yc,
  Zc: surfaceData.Zc,
  Xc2: surfaceData.Xc2,
  Yc2: surfaceData.Yc2,
  Zc2: surfaceData.Zc2,
  Xco2: surfaceData.Xco2,
  Yco2: surfaceData.Yco2,
  Zco2: surfaceData.Zco2,
  CPx: surfaceData.CPx,
  CPy: surfaceData.CPy,
  CPz: surfaceData.CPz,
};

export const siloContentsForBasavaraj = {
  points: silo,
};

export const Scatter = siloScatter