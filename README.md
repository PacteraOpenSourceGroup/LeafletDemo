# LeafletDemo

**初衷：**
因为要做一个防碰撞的警报/预警系统，所以带着小伙伴最近在整地图相关的技术，有一些特殊要求

- **不使用收费的地图源**
- **非瓦片图加载性能在秒级**
- **丰富的API**
- **成熟的实际商业案例**

综合上述需要和朋友的推荐，使用/学习了Leaflet.js。基于播撒欢笑播撒爱的初衷，把体验过程中遇到的一些情况和积累，分享给大家。

运行的案例地址在src/html下，3个demo拽浏览器都能跑

----------

**Leaflet倒包的小要点**
倒包需要样式的css和功能的js,但是**js一定要在css后加载**

```
 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"
   integrity="sha512-M2wvCLH6DSRazYeZRIm1JnYyh22purTM+FDB5CsyxtQJYeKq83arPe5wgbNmcFXGqiSH2XR8dT/fJISVA1r/zQ=="
   crossorigin=""/>
    <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"
   integrity="sha512-lInM/apFSqyy1o6s89K4iQUKg6ppXEgsVxT35HbzUupEVRh2Eu9Wdl4tHj7dZO0s1uvplcYGmt3498TtHq+log=="
   crossorigin=""></script>
```

**地图的坑：**

地图的坑是做的过程中遇到的第一个问题

- **国内的地图源和国外的地图源有偏差**
- **免费的地图加载多数偏慢**
- **mapbox奇卡无比而且很难玩**
- **其他**

为什么相同的GPS坐标在不同地图上结果不同？
知识解释来源于：
https://www.zhihu.com/question/20982283
http://www.cnblogs.com/cglNet/archive/2013/11/26/3443637.html

>  谷歌用的WGS84坐标系，但是中国这边国家测绘要求用GCJ-02加密一次
> 
>   百度在GCJ-02要求加密的基础上，又自己对坐标加密了一次，它官方文档里说叫BD-09,从GPS坐标转到百度坐标有接口提供，反过来不提供

解决方法：使用第三方算法库来解决相关问题
https://github.com/kartena/Proj4Leaflet
```
//倒包
<script src="../lib/proj4-compressed.js"></script>
<script src="../js/proj4leaflet.js"></script>
```
官方的支持：http://leafletjs.com/reference-1.2.0.html#crs
解决的具体代码：

```

    var crs = new L.Proj.CRS(
        'EPSG:3395',
        '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
        {
            resolutions: function () {
                level = 19;
                var res = [];
                res[0] = Math.pow(2, 18);
                for (var i = 1; i < level; i++) {
                    res[i] = Math.pow(2, (18 - i))
                }
                return res;
            }(),
            origin: [0, 0],
            bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
        }
    );
```
然后定义L.map对象时，作为属性传入即可


--------

**事件分发**:
地图本身和地图上面的元素都可以拦截事件，已知场景下是从上层图层自上而下传递事件。

常规元素添加监听姿式如下：

```
 L.marker(testLatLng, {icon: myIcon, rotationAngel: 180})
            .addTo(leafletMap)
            .on('click', function (e) {
                L.popup()
                    .setLatLng(e.latlng)
                    .setContent('这个标记的经纬度是：</br>纬度：' + e.latlng.lat + '</br>经度：' + e.latlng.lng)
                    .openOn(leafletMap);
                console.log(e);
            });
```

地图添加监听姿式如下：

```
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
        console.log('--->hasLayer是否有此图层 ' + leafletMap.hasLayer(layout));

    });
    leafletMap.on('autopanstart', function () {
        console.log('--->autopanstart 自动平移时触发');
    });
    leafletMap.on('whenReady', function () {
        console.log('--->whenReady 页面完全加载完');
    });
    layout.on("load", function () {
        console.log("--->layout 图层被加载一次")
    });
```

效果如下：
![这里写图片描述](http://img.blog.csdn.net/20171201130738495?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZGR3aGFuMDEyMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

各种有用没用的回调API都已经对外开放，都属于[map这一层的功能](http://leafletjs.com/reference-1.2.0.html#map)

-------

**自定义Icon**

系统默认的Icon是一个蓝色雨滴状的Icon,我们也完全可以自定义。

Icon其实有2层分别是实质Icon和阴影Icon，如果不需要高端的背景操作，shadow相关设置都可以不设置。

这里提一个不同缩放比情况下不同UI呈现的小实现
首先设定两种不同的Icon的类型
一大一小，在大区域显示小的，近景显示大的
```
 var big = [50, 50];
 var small = [20, 20];
 var iconB = L.Icon.extend({
        options: {
            iconSize: big
        }
    });
    var iconS = L.Icon.extend({
        options: {
            iconSize: small
        }
    });
```
然后获取地图的缩放回调进行不同的逻辑处理：

```
  leafletMap.on('zoomend', function (ev) {
        if (leafletMap.getZoom() > 14) {
            custom.setIcon(bigIcon);
        } else {
            custom.setIcon(smallIcon);
        }
    });
```

-------

**高端操作：Icon角度旋转**
普通的点/线/图形基础库已经完全满足了我们的需求，但是如果是做导航类的，就会有方向性的需要，就会有icon像车头一样变动。

找了一堆找到个比较好的实现[Leaflet.RotatedMarker](https://github.com/bbecquet/Leaflet.RotatedMarker)

简单易用就一个类，内部实现是对Icon的style进行修改旋转一个角度，造成了icon旋转的“假象”

像这样

![这里写图片描述](http://img.blog.csdn.net/20171201142708343?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZGR3aGFuMDEyMw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

```
    L.marker([31.2303904, 121.45370209999997], {rotationAngle: 270}).addTo(cities);
```
