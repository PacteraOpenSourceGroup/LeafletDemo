/**
 * Created by Xiang on 2017/12/5.
 * 区域船舶图层、船舶轨迹
 */
import * as L from "leaflet";
import {shipGroupLayer,areaCenter} from '../components/component';
import {leafletMap} from '../components/leafletMap';
import {toFixed6, getCenterPoint, geoPoint, geoLine, geoArea} from '../utils/geoJSONUtil';
import {getShipTrack} from '../net/FetchUtil';
//添加船舶marker
export const addShips = (data) => {
    //转换GeoJSON图层数据
    let geoJsonData = [];
    for (let i = 0; i < data.length; i++) {
        geoJsonData.push(
            geoPoint(
                {
                    "id": data[i].mmsi,
                    "name": data[i].name,
                    "popupContent": data[i].name,
                },
                toFixed6(data[i].lon),
                toFixed6(data[i].lat) //[经度，纬度]跟L.latLng方法定义的参数相反
            )
        );
    }
    //添加marker图层
    initMarkerLayer(geoJsonData).addTo(shipGroupLayer);
    //测试区域线框
    L.geoJSON(geoLine([
            {
                properties: {"name": "点1到点2", "popupContent": "上边"},
                point1: [121.316300, 32.719600],
                point2: [121.041000, 32.719600]
            },
            {
                properties: {"name": "点2到点3", "popupContent": "左边"},
                point1: [121.041000, 32.719600],
                point2: [121.041000, 32.490800]
            },
            {
                properties: {"name": "点3到点4", "popupContent": "下边"},
                point1: [121.041000, 32.490800],
                point2: [121.316300, 32.490800]
            },
            {
                properties: {"name": "点4到点1", "popupContent": "右边"},
                point1: [121.316300, 32.490800],
                point2: [121.316300, 32.719600]
            }
        ]),
        {onEachFeature: onEachFeature}
    ).addTo(shipGroupLayer);
    //测试区域
    // L.geoJSON(geoArea(
    //     {
    //         "name": "测试区域",
    //         "popupContent": "测试区域选中",
    //         "style": {
    //             color: "green",
    //             //fillColor: "",
    //             fillOpacity: 0.8,
    //             opacity: 1,
    //             weight: 2,
    //         }
    //     },
    //     [[121.316300, 32.719600], [121.041000, 32.719600], [121.041000, 32.490800], [121.316300, 32.490800]]),
    //     {
    //         style: function (feature) {
    //             return feature.properties && feature.properties.style;
    //         },
    //         onEachFeature: onEachFeature
    //     }
    // ).addTo(shipGroupLayer);
    //平移到中心点
    //[32.60527505615429,121.17865]
    //let center=getCenterPoint([[121.316300, 32.719600], [121.041000, 32.719600], [121.041000, 32.490800], [121.316300, 32.490800]]);
    //leafletMap.panTo(areaCenter);
};

//marker icon
let shipIcon = L.icon({
    iconUrl: 'static/img/marker_icon.png',
    iconSize: [56, 56],
    iconAnchor: [28, 50],
    popupAnchor: [0, -30],
});

let hoverIcon = L.icon({
    iconUrl: 'static/img/marker_icon_hover.png',
    iconSize: [56, 56],
    iconAnchor: [28, 50],
    popupAnchor: [0, -30],
});
//添加GeoLayer图层
export const initMarkerLayer = (geoJsonData) => L.geoJSON(
    geoJsonData,
    {
        pointToLayer: (feature, latlng) => {
            let marker = L.marker(latlng, {icon: shipIcon, riseOnHover: true});
            //船舶信息展示
            let popupContent = '暂无信息';
            if (feature.properties && feature.properties.popupContent) {
                popupContent = feature.properties.popupContent +
                    '</br>这艘船的经纬度是：</br>纬度：' +
                    feature.geometry.coordinates[1] +
                    '</br>经度：' + feature.geometry.coordinates[0];
            }
            let shipInfoTip = L.tooltip({direction: 'top', offset: L.point(0, -30)}).setContent(popupContent);
            marker.bindTooltip(shipInfoTip);
            //鼠标悬浮时切换图标
            marker.on('mouseover', function (e) {
                marker.setIcon(hoverIcon);
            });
            marker.on('mouseout', function (e) {
                marker.setIcon(shipIcon);
            });
            //点击事件
            marker.on("click", function (e) {
                let etm = parseInt(new Date().getTime() / 1000);
                let btm = etm - 12 * 60 * 60;
                //船舶轨迹查询
                getShipTrack(feature.properties.id, btm, etm, (json) => {
                    console.log(json);
                    let points = json.points;
                    let trackPoint = [];
                    for (let i = 0; i < points.length - 1; i++) {
                        trackPoint.push({
                            properties: {
                                "name": "轨迹点",
                                "popupContent": "轨迹点",
                                "style": {
                                    color: "#B0DE5C",
                                    fillColor: "#B0DE5C",
                                    fillOpacity: 0.8,
                                    opacity: 1,
                                    weight: 2,
                                }
                            },
                            point1: [toFixed6(points[i].lon), toFixed6(points[i].lat)],
                            point2: [toFixed6(points[i + 1].lon), toFixed6(points[i + 1].lat)]
                        })
                    }
                    L.geoJSON(geoLine(trackPoint), {
                        style: function (feature) {
                            return feature.properties && feature.properties.style;
                        }
                    }).addTo(shipGroupLayer);
                });
            });
            //根据地图缩放等级显示不同的图标
            // leafletMap.on('zoomend', function (e) {
            //     if (leafletMap.getZoom() > 11) {
            //         marker.setIcon(customIcon);
            //     } else {
            //         marker.setIcon(myIcon);
            //     }
            // });
            return marker;
        }
    }
);

export const onEachFeature = (feature, layer) => {
    let popupContent = '';
    if (feature.properties && feature.properties.popupContent) {
        popupContent = feature.properties.popupContent +
            '</br>这个标记的经纬度是：</br>纬度：' +
            feature.geometry.coordinates[1] +
            '</br>经度：' + feature.geometry.coordinates[0];
    }
    layer.bindPopup(popupContent);
};

