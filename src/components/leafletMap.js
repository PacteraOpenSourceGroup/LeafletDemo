/**
 * Created by Xiang on 2017/12/4.
 * 主图
 */
import * as L from "leaflet";
import {
    crs,
    //landTileLayer,
    seaTileLayer,
    shipGroupLayer,
    blowerFanGroupLayer,
    weatherGroupLayer,
    googleTileLayer,
    areaCenter
} from '../components/component';
import {refreshShipLayer} from './layerFuncs';
/**
 * 初始化地图
 *
 * @param {any} layers
 * @param {any} center
 */
const initMap = (layers, center) => L.map('map', {
    // crs: crs,
    layers: [...layers],
    center: center,//初始化中心点
    zoom: 15,
    closePopupOnClick: true,//为false的时候点击旁边区域不会关闭pop
    zoomSnap: 1,//默认为1，操作缩放比
    trackResize: true,//是否根据浏览器大小变化而刷新
    dragging: true,//为false时不可拖动
    zoomControl: false
});
//添加图层控制器
export const addLayerControl = (baseLayers, overlayLayers) => {
    L.control.layers(baseLayers, overlayLayers).addTo(leafletMap);
};
//获取地图对象
export const leafletMap = initMap([seaTileLayer, shipGroupLayer, blowerFanGroupLayer, weatherGroupLayer]);
leafletMap.on('load', function () {
    console.log('--->load 页面完全加载完');
    //添加图层控制器
    addLayerControl(
        {
            "google": googleTileLayer,
            "海图": seaTileLayer,
        },
        {
            "船舶图层": shipGroupLayer,
            "风机图层": blowerFanGroupLayer,
            "天气图层": weatherGroupLayer,
        }
    );
    //刷新各图层数据
    //setInterval立即执行一次后，再间隔执行
    let getShip = function () {
        //刷新船舶图层数据
        refreshShipLayer();
        return getShip;
    };
    setInterval(getShip(), 15000);
}).setView(areaCenter, 11);
