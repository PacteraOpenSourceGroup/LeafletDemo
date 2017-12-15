/**
 * Created by Xiang on 2017/12/4.
 * 使用GeoJSON数据生成的图层
 */
import * as L from "leaflet";
import {landTileLayer,seaTileLayer} from '../components/component';
import {leafletMap, addLayerControl} from '../components/leafletMap';
import {type} from '../utils/geoJSONUtil';
//各地经纬坐标
let nanJing = L.latLng(32.04, 118.78),
    wuXi = L.latLng(31.59, 120.29),
    suZhou = L.latLng(31.32, 120.62),
    shangHai = L.latLng(31.23, 121.47);
let geoPoints = [
    {
        name: 'nanJing',
        popupContent: '这里是南京！',
        lng: nanJing.lng,
        lat: nanJing.lat,
    },
    {
        name: 'shangHai',
        popupContent: '这里是上海！',
        lng: shangHai.lng,
        lat: shangHai.lat,
    },
    {
        name: 'suZhou',
        popupContent: '这里是苏州！',
        lng: suZhou.lng,
        lat: suZhou.lat,
    },
    {
        name: 'wuXi',
        popupContent: '这里是无锡！',
        lng: wuXi.lng,
        lat: wuXi.lat,
    }
];
//获取地图
// let leafletMap = L.map('map', {
//     crs: mapComponent.crs,
//     layers: [mapComponent.landTileLayer, mapComponent.landTileLayer]
// });
//let leafletMap = initMap([landTileLayer, landTileLayer], suZhou)
//设置中心点和缩放等级
// leafletMap.setView(suZhou, 8);
//鼠标移动获取坐标
//let latlngInfo = {info: ''};
// leafletMap.on('mousemove', function (e) {
//     latlngInfo.info = '<h4>纬度：</h4><p>' + e.latlng.lat + '</p><h4>经度：</h4><p>' + e.latlng.lng + '</p>';
// });
// //vue数据绑定
// new Vue({
//     el: '#latlngInfo',
//     data: latlngInfo
// });
//GeoJSON图层数据
let geoJsonData = [];
for (let i = 0; i < geoPoints.length; i++) {
    geoJsonData.push({
        "type": type.FEATURE,
        "properties": {
            "name": geoPoints[i].name,
            "popupContent": geoPoints[i].popupContent,
        },
        "geometry": {
            "type": type.POINT,
            "coordinates": [geoPoints[i].lng, geoPoints[i].lat]//[经度，纬度]跟L.latLng方法定义的参数相反
        }
    });
}
let geoLineData = {
    "type": type.FEATURE_COLLECTION,
    "features": [
        {
            "type": type.FEATURE,
            "properties": {
                "name": geoPoints[0].name,
                "popupContent": geoPoints[0].popupContent,
            },
            "geometry": {
                "type": type.LINE_STRING,
                "coordinates": [[geoPoints[0].lng, geoPoints[0].lat], [geoPoints[3].lng, geoPoints[3].lat]]
            }
        },

        {
            "type": type.FEATURE,
            "properties": {
                "name": geoPoints[1].name,
                "popupContent": geoPoints[1].popupContent,
            },
            "geometry": {
                "type": type.LINE_STRING,
                "coordinates": [[geoPoints[3].lng, geoPoints[3].lat], [geoPoints[2].lng, geoPoints[2].lat]]
            }
        },

        {
            "type": type.FEATURE,
            "properties": {
                "name": geoPoints[1].name,
                "popupContent": geoPoints[1].popupContent,
            },
            "geometry": {
                "type": type.LINE_STRING,
                "coordinates": [[geoPoints[2].lng, geoPoints[2].lat], [geoPoints[1].lng, geoPoints[1].lat]]
            }
        }
    ]
};
let geoPolygonData = {
    "type": type.FEATURE,
    "properties": {
        "name": geoPoints[0].name,
        "popupContent": geoPoints[0].popupContent,
        "style": {
            color: "#999",
            fillColor: "#B0DE5C",
            fillOpacity: 0.8,
            opacity: 1,
            weight: 2,
        }
    },
    "geometry": {
        "type": type.POLYGON,
        "coordinates": [[
            [geoPoints[0].lng, geoPoints[0].lat],
            [geoPoints[3].lng, geoPoints[3].lat],
            [geoPoints[2].lng, geoPoints[2].lat],
            [geoPoints[1].lng, geoPoints[1].lat],
            [120.19, 30.26],
            [geoPoints[0].lng, geoPoints[0].lat]
        ]]
    }
};
//marker icon
let myIcon = L.icon({
    iconUrl: 'static/img/marker_icon.png',
    iconSize: [64, 64],
    iconAnchor: [32, 58],
});
let customIcon = L.icon({
    iconUrl: 'static/img/icon1.jpeg',
    iconSize: [64, 64],
    iconAnchor: [32, 58],
});
function onEachFeature(feature, layer) {
    let popupContent = '';
    if (feature.properties && feature.properties.popupContent) {
        popupContent = feature.properties.popupContent +
            '</br>这个标记的经纬度是：</br>纬度：' +
            feature.geometry.coordinates[1] +
            '</br>经度：' + feature.geometry.coordinates[0];
    }
    layer.bindPopup(popupContent);
}
//添加GeoLayer图层
let geoMarkerLayer = L.geoJSON(
    geoJsonData,
    {
        pointToLayer: function (feature, latlng) {
            //根据地图缩放等级显示不同的图标
            let marker = L.marker(latlng, {icon: myIcon, rotationAngle: 45});
            leafletMap.on('zoomend', function (e) {
                if (leafletMap.getZoom() > 11) {
                    marker.setIcon(customIcon);
                } else {
                    marker.setIcon(myIcon);
                }
            });
            return marker;
        },
        onEachFeature: onEachFeature
    }
    ),
    geoRedCircleLayer = L.geoJSON(
        geoJsonData,
        {
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, 500, {
                    color: 'red',//表示边框颜色
                    fillColor: '#ff0000',//表示填充颜色
                    fillOpacity: 0.5//表示透明度
                });
            },
            onEachFeature: onEachFeature
        }
    ),
    geoGreenCircleLayer = L.geoJSON(
        geoJsonData,
        {
            pointToLayer: function (feature, latlng) {
                return L.circle(latlng, 1000, {
                    color: 'green',//表示边框颜色
                    fillColor: '#aaffff',//表示填充颜色
                    fillOpacity: 0.5//表示透明度
                });
            },
            onEachFeature: onEachFeature
        }
    ),
    geoLineLayer = L.geoJSON(geoLineData, {onEachFeature: onEachFeature}),
    geoPolygonLayer = L.geoJSON(geoPolygonData, {
        style: function (feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature
    });
let geoLayerGroup = L.layerGroup([geoMarkerLayer, geoRedCircleLayer, geoGreenCircleLayer, geoLineLayer, geoPolygonLayer]).addTo(leafletMap);
//额外添加杭州坐标
let hangZhouGeoPoint = {
    "type": type.FEATURE,
    "properties": {
        "name": "hangZhou",
        "popupContent": "这里是杭州！"
    },
    "geometry": {
        "type": type.POINT,
        "coordinates": [120.19, 30.26]
    }
};
geoMarkerLayer.addData(hangZhouGeoPoint);
geoRedCircleLayer.addData(hangZhouGeoPoint);
geoGreenCircleLayer.addData(hangZhouGeoPoint);
geoLineLayer.addData({
    "type": type.FEATURE,
    "properties": {
        "name": geoPoints[1].name,
        "popupContent": geoPoints[1].popupContent,
    },
    "geometry": {
        "type": type.LINE_STRING,
        "coordinates": [[geoPoints[1].lng, geoPoints[1].lat], [120.19, 30.26]]
    }
});
//添加图层控制器
let baseMaps = {
        "地图": landTileLayer,
        "海图": seaTileLayer
    },
    overLayMaps = {
        //"markerLayer": geoLayerGroup,
        "marker": geoMarkerLayer,
        "redCircle": geoRedCircleLayer,
        "greenCircle": geoGreenCircleLayer,
        "geoLine": geoLineLayer,
        "geoPolygon": geoPolygonLayer
    };
addLayerControl(baseMaps, overLayMaps);
//比例尺
//L.control.scale().addTo(leafletMap);