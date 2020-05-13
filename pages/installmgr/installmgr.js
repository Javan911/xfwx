// 安装点信息管理 installmgr.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        inputVal: "",
        title: '安装信息管理',
        hasShow: true,
        hasAddInstall: false,
        hasSeeInstall: true,
        hasDelInstall: true,
        hasEditInstall: true,
        hasUnbindInstall: true,
        searchInstall : [],
        id: null,
        installList: null,// 当前管辖域安装点列表
        installListEqu: null, // 当前管辖域设备信息
        groupPatrolList: null, // 当前管辖域管辖员
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
        let that = this;
        let arr = [];
        that.data.installList.forEach(function(item){
            if (item.imei.indexOf(e.detail.value) != -1 || item.installName.indexOf(e.detail.value) != -1){
                arr.push(item);
            }
        });

        this.setData({
            inputVal: e.detail.value,
            searchInstall: arr
        });
    },
    search(e){//  关键字检索
        app.console("关键字检索", e);
        this.setData({
            inputShowed: false
        });
        this.listInstall();
    },
    unbindInstall(e) {// 解绑设备
        app.console("解绑设备", e);
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确定解绑设备吗',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '解绑设备中...',
                    });
                    let base = app.globalData.server.baseUrl;
                    let delInstall = app.globalData.server.delInstall;
                    let datas = { imei: e.currentTarget.dataset.data };
                    app.httpRequest({
                        url: base + delInstall,
                        method: 'POST', data: datas,
                        callback: function (flag, data) {
                            console.log(flag, data);
                            wx.hideLoading();
                            that.listInstall();
                            if (flag == 1 && data == 1) {
                                app.fail({ title: "解绑设备成功", icon: "success", duration: 1000 });
                            } else {
                                app.fail({ title: "解绑设备失败", icon: "error", duration: 1000 });
                            }
                        },
                    }, that);
                }
            }
        });
    },
    seeInstall(e){// 安装点详情
        app.console("安装点详情", e);
        wx.showLoading({
            title: '您没有权限操作',
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 1000);
    },
    editInstall(e) {// 编辑安装点
        app.console("编辑安装点", e);
        wx.navigateTo({
            url: '../editinstall/editinstall?id=' + e.currentTarget.dataset.data
        });
    },
    delInstall(e) {// 删除安装点
        app.console("删除安装点", e);
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确定移除该管辖员吗',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '移除中...',
                    });
                    let base = app.globalData.server.baseUrl;
                    let deleteInstall = app.globalData.server.deleteInstall;
                    let datas = { id: e.currentTarget.dataset.data };
                    app.httpRequest({
                        url: base + deleteInstall,
                        method: 'POST', data: datas,
                        callback: function (flag, data) {
                            console.log(flag, data);
                            wx.hideLoading();
                            if (flag == 1 && data == 1) {
                                app.fail({ title: "删除成功", icon: "success", duration: 1500 });
                                that.listInstall();
                            } else {
                                app.fail({ title: "删除失败", icon: "error", duration: 1500 });
                            }
                        },
                    }, that);
                }
            }
        });
    },
    listInstall() { // 加载安装点信息
        let that = this;
        let base = app.globalData.server.baseUrl;
        let queryInstallsByGroupId = app.globalData.server.queryInstallsByGroupId;
        app.console(base, queryInstallsByGroupId, app.globalData.userInfo.sysUser.deptId);
        wx.showLoading({
            title: '数据加载中...',
        });
        let datas = { deptId: app.globalData.userInfo.sysUser.deptId };
        datas.keywords = null;
        if(that.data.inputVal) datas.keywords = that.data.inputVal;
        app.httpRequest({
            url: base + queryInstallsByGroupId,
            data: datas,
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data, data.installs);
                setTimeout(function () {
                    wx.hideLoading();
                    that.setData({
                        installList: null
                    });
                    if (flag == 1 && data.installs && data.installs.length > 0) {
                        that.setData({
                            installList: data.installs
                        });
                    } else {
                        wx.showLoading({
                            title: '暂无数据！',
                        });
                    }
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000);
                }, 500);
            }
        }, that);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.listInstall();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.listInstall();
    },

    /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
    onPullDownRefresh: function () {
        this.listInstall();
    },
})
