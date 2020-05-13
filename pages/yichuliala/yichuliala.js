//报警记录 -- yichuli.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        hasMore: true,
        start: 1,
        size: 10,
        alarmDispose: [], // 紧急设备报警记录
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        this.queryAlarmDispose1();
    },
    queryAlarmDispose1() {// 报警处理信息列表 --- 待处理的 
        app.console("报警处理信息列表 --- 待处理的 ");
        let that = this;
        wx.showLoading({
            title: '加载中...',
        });
        let base = app.globalData.server.baseUrl;
        let queryAlarmDispose1 = app.globalData.server.queryAlarmDispose1;
        let datas = { deptId: app.globalData.userInfo.sysUser.deptId, start: that.data.start, size: that.data.size };
        app.httpRequest({
            url: base + queryAlarmDispose1,
            method: 'POST', data: datas,
            callback: function (flag, data) {
                console.log(flag, data);
                wx.hideLoading();
                if (flag == 1 && data.data && data.data.length > 0) {                
                    let datas = that.data.alarmDispose.concat(data.data);
                    let starts = that.data.start + 1;
                    that.setData({
                        start: starts,
                        alarmDispose: datas,
                        hasMore: data.hasMore
                    });
                } else {
                    app.fail({ title: "暂无紧急报警记录", icon: "error", duration: 1000 });
                    that.setData({
                        hasMore: false
                    });
                }
            },
        }, that);
    }
})
