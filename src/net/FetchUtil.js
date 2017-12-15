/**
 * Created by Xiang on 2017/12/5.
 * 网络请求
 */
import 'whatwg-fetch';
import fetchJsonp from 'fetch-jsonp';
let shipKey = '3208f3937403494bb05851a02c990051';//船讯网提供的 API key (授权码)
let area = '121316300,32719600-121041000,32719600-121041000,32490800-121316300,32490800';//测试区域坐标
let baseUrl = 'http://api.shipxy.com/apicall/';//船讯网url
let GetAreaShip = baseUrl + 'GetAreaShip';//区域船舶查询url
let GetShipTrack = baseUrl + 'GetShipTrack';//船舶轨迹查询url
let GetManyShip = baseUrl + 'GetManyShip';//多船查询url
let GetSingleShip = baseUrl + 'GetSingleShip';//单船查询url
let QueryShip = baseUrl + 'QueryShip';//船舶搜索url

export const get = (url, params, callback) => {
    if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += '&' + paramsArray.join('&');
        }
    }
    fetchJsonp(
        url,
        {jsonpCallback: 'jsf'}
    ).then((response) => {
            return response.json();
        }
    ).then((json) => {
        callback && callback(json);
        //console.log(json);
    }).catch((e) => {
        console.log(e);
    });
};
/**
 * 区域船舶查询
 * @param callback
 */
export const getAreaShip = (callback) => {
    let params = {
        v: 2,//版本号为 2
        k: shipKey,
        enc: 1,//返回结果格式:0 - 二进制 Base64 编码，1 –Json，默认为 1
        mode: 0,//0 要全部数据，1 更新
        scode: 0,//0 首次调用，后期要用服务端返回的 scode 填充 如使用 Scode，每次返回的只是有更新的船舶。
        xy: area
    };
    get(GetAreaShip, params, callback);
};

/**
 * 船舶轨迹查询
 * @param id
 * @param btm
 * @param etm
 * @param callback
 */
export const getShipTrack = (id, btm, etm, callback) => {
    let params = {
        v: 2,
        k: shipKey,
        enc: 1,
        cut: 1,//0 不截断 1 可截断(如果轨迹数据量很大，不截断会造成长时间等 待)
        id: id,//船舶在船讯网中的唯一识别码(mmsi)
        btm: btm,//轨迹开始时间
        etm: etm,//轨迹结束时间
    };
    get(GetShipTrack, params, callback);
};
/**
 * 多船查询
 * @param id
 * @param callback
 */
export const getManyShip = (id, callback) => {
    let params = {
        v: 2,
        k: shipKey,
        enc: 1,
        id: id,//船舶在船讯网中的唯一识别码(mmsi)例：477765900,412370000

    };
    get(GetManyShip, params, callback);
};

/**
 * 单船查询
 * @param id
 * @param callback
 * @param idtype
 */
export const getSingleShip = (id, callback, idtype) => {
    let params = {
        v: 2,
        k: shipKey,
        enc: 1,
        id: id,//船舶在船讯网中的唯一识别码(mmsi)例：477765900
        idtype: idtype ? idtype : 0//若为 0 表示 id 为 mmsi，不为 0 表示 id 为 imo，默认为 0
    };
    get(GetSingleShip, params, callback);
};

/**
 * 船舶搜索
 * @param kw
 * @param callback
 * @param max
 */
export const queryShip = (kw, callback, max) => {
    let params = {
        v: 2,
        k: shipKey,
        enc: 1,
        kw: kw,//船舶参数，可以是船名、呼号、MMSI、IMO 等例：cosco
        max: max ? max : 10//最多返回的结果数量，该值最大 100
    };
    get(QueryShip, params, callback);
};