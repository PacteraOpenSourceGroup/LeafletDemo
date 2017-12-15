/**
 * Created by Xiang on 2017/12/4.
 * GeoJSON相关工具
 */
export const type = {
    FEATURE_COLLECTION: "FeatureCollection",
    FEATURE: "Feature",
    POINT: "Point",
    LINE_STRING: "LineString",
    POLYGON: "Polygon"
};
//geo点坐标数据
export const geoPoint = (properties, lng, lat) => {
    return {
        "type": type.FEATURE,
        // {
        //     "name": data[i].name,
        //     "popupContent": data[i].name,
        // }
        "properties": properties,
        "geometry": {
            "type": type.POINT,
            "coordinates": [lng, lat]//[经度，纬度]跟L.latLng方法定义的参数相反
        }
    }
};
//geo线段数据
export const geoLine = (lineDatas) => {
    let features = [];
    for (let i = 0; i < lineDatas.length; i++) {
        features.push({
            "type": type.FEATURE,
            "properties": lineDatas[i].properties,
            "geometry": {
                "type": type.LINE_STRING,
                "coordinates": [lineDatas[i].point1, lineDatas[i].point2]
            }
        });
    }
    return {
        "type": type.FEATURE_COLLECTION,
        "features": [...features]
    }
};
//geo区域数据
export const geoArea = (properties, areaDatas) => {
    areaDatas.push(areaDatas[0]);
    return {
        "type": type.FEATURE,
        "properties": properties,
        "geometry": {
            "type": type.POLYGON,
            "coordinates": [areaDatas]
        }
    };
};
//获取坐标中心点
export const getCenterPoint = (data) => {
    let total = data.length;
    let X = 0, Y = 0, Z = 0;
    data.forEach(g => {
        let lat, lon, x, y, z;
        lat = g[1] * Math.PI / 180;
        lon = g[0] * Math.PI / 180;
        x = Math.cos(lat) * Math.cos(lon);
        y = Math.cos(lat) * Math.sin(lon);
        z = Math.sin(lat);
        X += x;
        Y += y;
        Z += z;
    });
    X = X / total;
    Y = Y / total;
    Z = Z / total;
    let Lon = Math.atan2(Y, X);
    let Hyp = Math.sqrt(X * X + Y * Y);
    let Lat = Math.atan2(Z, Hyp);
    return [Lat * 180 / Math.PI, Lon * 180 / Math.PI];
};
//精确到6位小数
export const toFixed6 = (num) => {
    return (num / 1000000).toFixed(6);
};