/**
 * Created by Xiang on 2017/12/5.
 */

import {shipGroupLayer} from '../components/component';
import {getAreaShip} from '../net/FetchUtil';
import {addShips} from '../layer/shipLayer';
/**
 * 刷新船舶图层数据
 */
export const refreshShipLayer = () => {
    //获取区域船舶
    getAreaShip((json) => {
        console.log(json);
        shipGroupLayer.clearLayers();
        addShips(json.data);
    });
}