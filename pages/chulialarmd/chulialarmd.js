// pages/chulialarmd/chulialarmd.js

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '当前报警设备信息如下：',
        alarm:{}, // 当前报警设备信息
    },
    changeInput(e) {// 监听输入框改变的值
        app.console(e);
        let alarm = 'alarm.' + e.currentTarget.dataset.datas;
        this.setData({
            [alarm]: e.detail.value
        });
    },
    saveGroup() {// 保存 报警处理信息
        app.console(this.data.alarm);
        this.save();
    },
    save() {
        let that = this;
        let base = app.globalData.server.baseUrl;
        let updateAlarmDis = app.globalData.server.updateAlarmDis;
        app.console("正在进行校验", updateAlarmDis);
        wx.showLoading({
            title: '数据处理中',
        });
        app.httpRequest({
            url: base + updateAlarmDis,
            method: 'POST',
            data: that.data.alarm,
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.data == 1) {
                        wx.showLoading({
                            title: '处理成功',
                        });
                    } else {
                        wx.showLoading({
                            title: '处理失败',
                        });
                    }
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1500);
                }, 300);
            }
        }, that);
    },
    loadAlarmDis() {
        let that = this;
        let base = app.globalData.server.baseUrl;
        let queryAlarmDisById = app.globalData.server.queryAlarmDisById;
        app.console("数据加载中");
        wx.showLoading({
            title: '数据加载中',
        });
        app.httpRequest({
            url: base + queryAlarmDisById,
            method: 'POST',
            data: {id: that.data.alarm.id},
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.data) {
                        that.setData({
                            alarm: data.data
                        });
                    } else {
                        wx.showLoading({
                            title: '加载失败',
                        });
                    }
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1500);
                }, 300);
            }
        }, that);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let alarm = 'alarm.id';
        this.setData({
            [alarm]: Number(options.id)
        });
        this.loadAlarmDis();
    }
})