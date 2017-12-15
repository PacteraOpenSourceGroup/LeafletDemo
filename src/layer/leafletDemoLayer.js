/**
 * Created by Xiang on 2017/12/4.
 * api demo图层
 */
import {landTileLayer, cities} from '../components/component';
import {leafletMap, addLayerControl} from '../components/leafletMap';
import * as L from "leaflet";
//三个坐标点
L.marker([31.2303904, 121.47370209999997]).addTo(cities);
L.marker([31.2303904, 121.45370209999997], {rotationAngle: 270}).addTo(cities);
let big = [50, 50];
let small = [20, 20];
//    以下部分是Icon Demo
let iconB = L.Icon.extend({
    options: {
        iconSize: big
    }
});
let iconS = L.Icon.extend({
    options: {
        iconSize: small
    }
});
let bigIcon = new iconB({iconUrl: 'static/img/icon1.jpeg'});
let smallIcon = new iconS({iconUrl: 'static/img/icon1.jpeg'});
//draggable 为true表示标签可拖拽
let custom = L.marker([31.2303904, 121.46370209999997], {
    icon: bigIcon,
    draggable: true,
    title: '可爱的表情'
}).addTo(cities).bindPopup("我是一句话")
    .openPopup();
L.circle(
    [31.2303904, 121.47370209999997],
    50,
    {
        color: 'red',
        fillColor: '#ff0000',
        fillOpacity: 0.5
    }
).addTo(leafletMap);
L.circle(
    [31.2303904, 121.47370209999997],
    100,
    {
        color: 'green',
        fillColor: '#aaffff',
        fillOpacity: 0.5
    }
).addTo(leafletMap).bindPopup("我是个pop");

L.circle([31.2303904, 121.45370209999997], 150, {
    color: 'green',
    fillColor: '#ccaaff',
    fillOpacity: 0.5
}).addTo(leafletMap)
    .bindPopup('这是一句</br>看见了吧');


//摄制中心点和缩放比
//    leafletMap.setView([31.2303904, 121.47370209999997], 15);


leafletMap.on('click', function () {
    console.log('--->click 点击事件')
});
leafletMap.on('mousedown', function () {
    console.log('--->mousedown 按下不抬起')
});
leafletMap.on('mouseup', function () {
    console.log('--->mouseup 按下抬起');
});
leafletMap.on('dblclick', function () {
    console.log('--->dblclick 双击触发');
});
//    leafletMap.on('mouseover', function () {
//        console.log('--->mouseover 鼠标移出移进地图都会触发');
//    });
//触发极度频繁
//    leafletMap.on('mousemove', function () {
//        console.log('--->mousemove 鼠标在地图上移动触发');
//    });
leafletMap.on('viewreset', function () {
    console.log('--->viewreset 重绘内容时触发');
    console.log('--->getCenter ' + leafletMap.getCenter());
    console.log('--->getSize' + leafletMap.getSize());
    console.log('--->hasLayer是否有此图层 ' + leafletMap.hasLayer(landTileLayer));

});
leafletMap.on('autopanstart', function () {
    console.log('--->autopanstart 自动平移时触发');
});
leafletMap.on('whenReady', function () {
    console.log('--->whenReady 页面完全加载完');
});
landTileLayer.on("load", function () {
    console.log("--->layout 图层被加载一次")
});

leafletMap.on('zoomend', function (ev) {
    if (leafletMap.getZoom() > 14) {
        custom.setIcon(bigIcon);
    } else {
        custom.setIcon(smallIcon);
    }
});

let overlayMaps = {
    "城市中的点": cities
};

let baseLayers = {
    "第一层": landTileLayer,
    "第二层": landTileLayer
};

addLayerControl(baseLayers, overlayMaps);

//定时器滚动地图
let startTime = new Date().getTime();
let interval = setInterval(function () {
    if (new Date().getTime() - startTime > 6000) {
        clearInterval(interval);
        return;
    }
    leafletMap.setView([31.2303904, 121.47370209999997], 9, {duration: 1, animate: true});
    setTimeout(function () {
        leafletMap.setView([31.2303904, 121.45370209999997], 15, {duration: 1, animate: true});
        leafletMap.panTo([31.2303904, 121.47370209999997]);//平移坐标
    }, 2000);
}, 2000);