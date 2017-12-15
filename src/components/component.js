/**
 * 基础图层组件.
 */
import * as L from "leaflet";
import {CRS} from 'proj4leaflet';
//坐标参考系统
export const crs = new L.Proj.CRS(
    'EPSG:900913',
    '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
    {
        resolutions: function () {
            let level = 19;
            let res = [];
            res[0] = Math.pow(2, 18);
            for (let i = 1; i < level; i++) {
                res[i] = Math.pow(2, (18 - i))
            }
            return res;
        }(),
        origin: [0, 0],
        bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
    }
);

//地图瓦片图层
// export const landTileLayer = L.tileLayer(
//     'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518',
//     {
//         maxZoom: 18,//缩放比为同值时缩放器将无法使用
//         minZoom: 3,
//         subdomains: [0, 1, 2],
//         tms: true
//     }
// );
// export const landTileLayer = L.tileLayer.chinaProvider(
//     'TianDiTu.Normal.Map',
//     {
//         maxZoom: 18,
//         minZoom: 5,
//     }
// );
//海图瓦片图层
// export const seaTileLayer = L.tileLayer(
//     'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
//     {
//         maxZoom: 18,//缩放比为同值时缩放器将无法使用
//         minZoom: 3,
//         subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//         tms: true
//     }
// );
export const seaTileLayer = L.tileLayer.chinaProvider(
    'Google.Satellite.Map',
    {
        maxZoom: 20,
        minZoom: 5,
    }
);
//google瓦片图层
export const googleTileLayer = L.tileLayer.chinaProvider(
    'Google.Normal.Map',
    {
        maxZoom: 18,
        minZoom: 5,
    }
);
//风机图层
export const blowerFanGroupLayer = new L.LayerGroup();
//船舶图层
export const shipGroupLayer = new L.LayerGroup();
//天气图层
export const weatherGroupLayer = new L.LayerGroup();
//测试区域中心点
export const areaCenter=[32.605275,121.178650];