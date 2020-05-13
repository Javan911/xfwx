// map.js
const app = getApp();
const maputils = require('../../utils/maputils.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: null,
        longitude: null,
        markers: null,
        mapWidth: '',
        mapHeight: '',
        maps: null,// 临时地图库

    },
    toaddress: function(e) {
        app.console(e)
        let id = e.markerId
        app.console("toaddress",id)
    },
    loadGroupMap(e) {// 管辖域地图
        app.console("管辖域地图 ", e);
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        let base = app.globalData.server.baseUrl;
        let quyu = app.globalData.server.quyu;
        let datas = { deptId: app.globalData.userInfo.sysUser.deptId };
        app.httpRequest({
            url: base + quyu,
            method: 'GET', data: datas,
            callback: function (flag, data) {
                console.log(flag, data);
                setTimeout(function(){
                    wx.hideLoading();
                }, 1000);
                if (flag == 1 && data.FLAG == "SUCCESSED" && data.groupList.length > 0) {
                    //data.groupList && data.groupList.forEach(function(item, index,arr){
                        //let l = maputils.GPS.gcj_decrypt_exact(item['latitude'], item['longitude']);//maputils.maputils.gcj02towgs84(item['longitude'], item['latitude']);
                    //     console.log();
                    //     item['longitude'] = l['lon'];
                    //     item['latitude'] = l['lat'];
                    // });
                    that.setData({
                        maps: data.groupList
                    });
                    that.initMap();
                } else {
                    app.fail({ title: "暂无记录", icon: "error", duration: 1000 });
                }
            },
        }, that);
    },
    initMap(e){// 初始化地图数据
        app.console("初始化地图数据", e);
        let that = this;
        if (that.data.maps){
            let datas = [];
            that.data.maps.forEach(function(item, index, arr){
                let texts = [item.groupName, item.country, item.province, item.city, item.county, item.longitude, item.latitude, item.locationDetail];
                let titles = ['集群名称', '所属国家', '所属省份', '所属城市', '所属县/区', '经度', '纬度', '详细地址'];
                let content = that.eachContent(texts, titles);
                let items = {
                    id: item.id,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    iconPath: '../../image/location-red.png',
                    callout: {
                        content: content,
                        padding: 10,
                        borderRadius: 10,
                        display: 'BYCLICK',
                        textAlign: 'left'
                    }
                };
                datas.push(items);
            });
            that.setData({
                markers: datas
            });
        }
    },
    eachContent(arr,titles){// 的带字符串内容
        let template = '';
        arr.forEach(function(item,index, arrs){
            template += titles[index] + '：' + item + '\n';
        });
        return template;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let sy = wx.getSystemInfoSync(),
            mapWidth = sy.windowWidth * 2,
            mapHeight = sy.windowHeight * 2;
        wx.getLocation({
          type: 'GCJ02',
            success(mres) {
                let map_lat = mres.latitude;
                let map_long = mres.longitude;
                let map_speed = mres.speed;
                let map_accuracy = mres.accuracy;
                that.setData({
                    latitude: map_lat
                });
                that.setData({
                    longitude: map_long
                });
            }
        });
        this.setData({
            mapWidth: mapWidth,
            mapHeight: mapHeight
        });
        this.loadGroupMap();
    },
    /**
         * 生命周期函数--监听页面显示
         */
    onShow: function () {
        let that = this;
        let sy = wx.getSystemInfoSync(),
            mapWidth = sy.windowWidth * 2,
            mapHeight = sy.windowHeight * 2;
        wx.getLocation({
          type: 'GCJ02',
            success(mres) {
                let map_lat = mres.latitude;
                let map_long = mres.longitude;
                let map_speed = mres.speed;
                let map_accuracy = mres.accuracy;
                that.setData({
                    latitude: map_lat
                });
                that.setData({
                    longitude: map_long
                });
            }
        });
        this.setData({
            mapWidth: mapWidth,
            mapHeight: mapHeight
        });
        this.loadGroupMap();
    },
});