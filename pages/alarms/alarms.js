// pages/alarms/alarms.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        alarmDispose: null, // 紧急设备报警记录
    },
    queryAlarmDispose0(e) {// 报警处理信息列表 --- 待处理的 
        app.console("报警处理信息列表 --- 待处理的 ", e);
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        let base = app.globalData.server.baseUrl;
        let queryAlarmDispose0 = app.globalData.server.queryAlarmDispose0;
        let datas = { deptId: app.globalData.userInfo.sysUser.deptId };
        app.httpRequest({
            url: base + queryAlarmDispose0,
            method: 'POST', data: datas,
            callback: function (flag, data) {
                console.log(flag, data);
                wx.hideLoading();
                if (flag == 1 && data.data && data.data.length > 0) {
                    that.setData({
                        alarmDispose: data.data
                    });
                } else {
                    app.fail({ title: "暂无紧急报警记录", icon: "error", duration: 1000 });
                }
            },
        }, that);
    },
    chuli(e) {// 处理紧急报警设备信息
        app.console("处理紧急报警设备信息", e);
        wx.navigateTo({
            url: '../chulialarmd/chulialarmd?id=' + e.currentTarget.dataset.data
        });
    },
    yiChuli() {// 查看已处理报警记录
        app.console("查看已处理报警记录");
        wx.navigateTo({
            url: '../yichuliala/yichuliala'
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.queryAlarmDispose0();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.queryAlarmDispose0();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.queryAlarmDispose0();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})