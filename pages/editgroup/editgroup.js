//编辑管辖域 editgroup.js
//获取应用实例
const app = getApp()

Page({
    data: {
        addGroupMsg: {// 添加集群
            parent: false,
            country: "国家",
            province: "省份",
            city: "市",
            county: "县/区",
            longitude: "经度",
            latitude: "纬度",
            title: '编辑集群信息',
            address: '详细地址',
            autoCheck: '选择集群位置信息',
            id: {
                details: 'details',
                groupName: 'groupName'
            },
            group: {
                groupName: null,//集群名称
                longitude: null,//经度
                latitude: null,//纬度
                country: null,// 国家
                province: null,//省份
                city: null, // 市
                county: null, // 区
                locationDetail: null,// 详细地址
                parentId: null // 父级集群号
            }
        }
    },
    getGroupAddress() {// 获得集群位置信息
        let that = this;
        wx.chooseLocation({// 得到经纬度
            success: function (res) {
                app.console(res.latitude + ',' + res.longitude);
                wx.showLoading({
                    title: '数据处理中...',
                });
                app.getCityInfo(res.latitude, res.longitude, that, function (flag, data) {
                    wx.hideLoading();
                    app.console(flag, data);
                    if (flag = 1 && data.statusCode == 200) {
                        let result = data.data.result;
                        let longitude = 'addGroupMsg.group.longitude';
                        let latitude = 'addGroupMsg.group.latitude';
                        let country = 'addGroupMsg.group.country';
                        let province = 'addGroupMsg.group.province';
                        let city = 'addGroupMsg.group.city';
                        let county = 'addGroupMsg.group.county';
                        this.setData({
                          [longitude]: app.trans(res.longitude),//经度
                          [latitude]: app.trans(res.latitude),//纬度
                            [country]: result.addressComponent.country,// 国家
                            [province]: result.addressComponent.province,//省份
                            [city]: result.addressComponent.city, // 市
                            [county]: result.addressComponent.district // 区
                        });
                        app.console(this.data.addGroupMsg.group);
                    } else {
                        app.fail({ title: "连接超时", icon: "error", duration: 1000 });
                    }
                });
            }
        });
    },
    changeInput(e) {// 监听输入框改变的值
        app.console(e);
        let groupName = 'addGroupMsg.group.' + e.currentTarget.dataset.datas;
        this.setData({
            [groupName]: e.detail.value
        });
    },
    saveGroup() {// 保存管辖域
        app.console(this.data.addGroupMsg);
        this.save();
    },
    save() {
        app.console("正在进行校验");
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确定修改该管辖域吗',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '数据修改中...',
                    });
                    let base = app.globalData.server.baseUrl;
                    let editGroup = app.globalData.server.editGroup;
                    let datas = that.data.addGroupMsg.group;
                    app.httpRequest({
                        url: base + editGroup,
                        method: 'POST',
                        data: that.data.addGroupMsg.group,
                        callback: function (flag, data) {
                            app.console("httpRequest", flag, data);
                            setTimeout(function () {
                                wx.hideLoading();
                                if (flag == 1 && data == 1) {
                                    wx.showLoading({
                                        title: '修改管辖域成功',
                                    });
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                } else {
                                    wx.showLoading({
                                        title: '次改管辖域失败',
                                    });
                                }
                                setTimeout(function () {
                                    wx.hideLoading();
                                }, 1500);
                            }, 300);
                        }
                    }, that);
                }
            }
        });
    },
    loadGroupInfo(){// 查询指定管辖域
        let that = this;
        let base = app.globalData.server.baseUrl;
        let queryGroupById = app.globalData.server.queryGroupById;
        app.console("查询指定管辖域");
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + queryGroupById,
            method: 'POST',
            data: { id: that.data.addGroupMsg.group.id},
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1) {
                        let group = 'addGroupMsg.group';
                        that.setData({
                            [group]: data
                        });
                    } else {
                        wx.showLoading({
                            title: '新增管辖域失败',
                        });
                        setTimeout(function () {
                            wx.hideLoading();
                        }, 1500);
                    }
                }, 300);
            }
        }, that);
    },
    onLoad: function (e) {
        app.console(e);
        let id = 'addGroupMsg.group.id';
        this.setData({
            [id]: e.id
        });
        this.loadGroupInfo();
    }
})