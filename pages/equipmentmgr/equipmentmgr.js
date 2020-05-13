// 设备信息管理 equipmentmgr.js
//获取应用实例
const app = getApp()

Page({
    data: {
        equipmentTitle: '设备信息如下',
        btn: '加载更多',
        hasMore: true,
        hasDelPatrol: true,
        hasAddEquipment: true,
        hasEditEquipment:true,
        start: 1,
        size: 10,
        equipments: [],
        inputShowed: false,
        inputVal: "",
        hasShow: true,
        searchInstall: [],
    },
    editEquipment(e) {// 编辑设备信息
        app.console("编辑设备信息", e);
        wx.navigateTo({
            url: '../editequipment/editequipment?id=' + e.currentTarget.dataset.data
        });
    },
    notMore(e) {// 没有更多了
        app.console("没有更多了", e);
        wx.showLoading({
            title: '已完成...',
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 1000);
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        app.console("检索", e);
        let that = this;
        let arr = [];
        this.data.equipments && this.data.equipments.forEach(function (item, index, arrs) {
            app.console("item", item);
            if (item.imei.indexOf(e.detail.value) != -1 || item.equipmentName.indexOf(e.detail.value) != -1) {
                if (arr.indexOf(item) == -1) arr.push(item);
            }
        });

        this.setData({
            inputVal: e.detail.value,
            searchInstall: arr
        });
        app.console("searchInstall", arr);
    },
    search(e) {//  关键字检索
        app.console("关键字检索", e);
        let that = this;
        this.setData({
            inputShowed: false
        });
        this.setData({
            equipments: that.data.searchInstall
        });
        app.console("searchInstall", that.data.equipments);
    },
    loadMore() { // 加载设备
        let that = this; // 使用方所有管辖人员 分页数据 + deptId + token + start(1) + size(10)
        let base = app.globalData.server.baseUrl;
        let queryEquipmentByDeptId = app.globalData.server.queryEquipmentByDeptId;
        app.console(base, queryEquipmentByDeptId, that.data.start, that.data.size);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + queryEquipmentByDeptId,
            data: { deptId: app.globalData.userInfo.sysUser.deptId, start: that.data.start, size: that.data.size },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.data && data.data.length > 0) {
                        app.console("进来了", data.data);
                        let datas = that.data.equipments.concat(data.data);
                        app.console("数据", datas);
                        let starts = that.data.start + 1;
                        that.setData({
                            start: starts,
                            equipments: datas,
                            hasMore: data.hasMore
                        });
                        app.console("更新数据", that.data.equipments);
                    } else {
                        wx.showLoading({
                            title: '暂无数据！',
                        });
                        that.setData({
                            hasMore: false
                        });
                        setTimeout(function () {
                            wx.hideLoading();
                        }, 1000);
                    }
                }, 500);
            }
        }, that);
    },
    onLoad: function (e) {
        this.loadMore();
    }
})