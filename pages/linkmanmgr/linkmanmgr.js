// 报警联系人信息管理 linkmanmgr.js
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
        title: '报警联系人信息管理',
        hasShow: true,
        searchInstall: [],
        id: null,
        linkList: null,// 当前报警联系人
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
        this.data.linkList && this.data.linkList.forEach(function (item, index, arrs) {
            item.linkman && item.linkman.forEach(function (itm) {
                app.console("item.linkman", itm);
                if (itm.name.indexOf(e.detail.value) != -1 || itm.telephone.indexOf(e.detail.value) != -1) {
                    app.console("item.linkman -- if", itm);
                    if(arr.indexOf(itm) == -1)arr.push(itm);
                }
            });
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
        let datas = this.data.linkList;
        datas && datas.forEach(function(item,index, arrs){
            item.linkman && item.linkman.forEach(function(itm, idx, arr){
                itm['show'] = true;
                if (itm.name.indexOf(that.data.inputVal) != -1 || itm.telephone.indexOf(that.data.inputVal) != -1){
                    itm['show'] = false;
                }
                app.console("show", itm.show);
            });
        });
        this.setData({
            linkList: datas
        });
    },
    queryGroupLinkmanListByDeptId() { // 查询指定 使用方下的所有报警联系人列表
        let that = this;
        let base = app.globalData.server.baseUrl;
        let queryGroupLinkmanListByDeptId = app.globalData.server.queryGroupLinkmanListByDeptId;
        app.console(base, queryGroupLinkmanListByDeptId, app.globalData.userInfo.sysUser.deptId);
        wx.showLoading({
            title: '数据加载中...',
        });
        let datas = { deptId: app.globalData.userInfo.sysUser.deptId };
        datas.keywords = null;
        if (that.data.inputVal) datas.keywords = that.data.inputVal;
        app.httpRequest({
            url: base + queryGroupLinkmanListByDeptId,
            data: datas,
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data, data.data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.data && data.data.length > 0) {
                        data.data.forEach(function(item, idx, arr){
                            arr[idx]['linkman'] = (arr[idx] && arr[idx]['linkman']) ? JSON.parse(arr[idx]['linkman']) : arr[idx]['linkman'];
                        });
                        that.setData({
                            linkList: data.data
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
                app.console("结果集", that.data.linkList);
            }
        }, that);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.queryGroupLinkmanListByDeptId();
    }
})
