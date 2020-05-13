//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {
        flushTimer : null,
        nowDate : '',
        phonenumber : '',
        userName : '',
        groupList :[
            { name: '管辖域', img: '/image/image_1.png', page: 'listgroup/listgroup'},
            { name: '安装点', img: '/image/image_2.png', page: 'installmgr/installmgr' },
            { name: '管辖员', img: '/image/image_3.png', page: 'patrol/patrol' },
            { name: '设备', img: '/image/image_1.png', page: 'equipmentmgr/equipmentmgr' },
            { name: '联系人', img: '/image/image_4.png', page: 'linkmanmgr/linkmanmgr' }
        ], // 数据集
        equipmentTypes:null, // 设备类型及其设备信息
    },
    loadEquipmentTypes(){// 加载设备类型及其设备信息
        let that = this;
        let base = app.globalData.server.baseUrl;
        let equipmentTypeAndEquipment = app.globalData.server.equipmentTypeAndEquipment;
        app.httpRequest({
            url: base + equipmentTypeAndEquipment,
            data: { deptId: app.globalData.userInfo.sysUser.deptId },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.FLAG == "SUCCESSED") {
                        that.setData({
                            equipmentTypes: data.data
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
    flushDate(){// 刷新时间
        this.data.flushTimer = setInterval(function () { 
            this.flushNowDate(); 
        }.bind(this), 1000);
    },
    flushNowDate() {//刷新时间
        this.setData({
           nowDate :utils.formatTime(new Date())
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                phonenumber: app.globalData.userInfo.sysUser.phonenumber,
                userName: app.globalData.userInfo.sysUser.userName,
            });
        }
        this.flushDate();
        this.loadEquipmentTypes();
    },
    ClickPersonality: function () {//个人信息
        wx.navigateTo({
            url: '/pages/myself/myself',
        })
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
        this.loadEquipmentTypes();
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
        this.flushDate();
        this.loadEquipmentTypes();
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
