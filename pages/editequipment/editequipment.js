//编辑设备信息 editequipment.js
//获取应用实例
const app = getApp()

Page({
    data: {
        equipment: {} // 设备信息
    },
    changeInput(e) {// 监听输入框改变的值
        app.console(e);
        let value = 'equipment.' + e.currentTarget.dataset.datas;
        this.setData({
            [value]: e.detail.value
        });
    },
    save(e) {// 保存设备信息
        app.console("保存设备信息", this.data.install);
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确定需要保存吗',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '保存中...',
                    });
                    let base = app.globalData.server.baseUrl;
                    let editEquipment = app.globalData.server.editEquipment;
                    wx.showLoading({
                        title: '数据处理中...',
                    });
                    app.httpRequest({
                        url: base + editEquipment,
                        method: 'POST',
                        data: that.data.equipment,
                        callback: function (flag, data) {
                            app.console("httpRequest", flag, data);
                            setTimeout(function () {
                                wx.hideLoading();
                                if (flag == 1 && data == 1) {
                                    wx.showLoading({
                                        title: '修改成功',
                                    });
                                } else {
                                    wx.showLoading({
                                        title: '修改失败',
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
    loadEquit(){// 加载
        let that = this; // 使用方所有管辖人员 分页数据 + deptId + token + start(1) + size(10)
        let base = app.globalData.server.baseUrl;
        let equipmentById = app.globalData.server.equipmentById;
        app.console(base, equipmentById, that.data.start, that.data.size);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + equipmentById,
            data: { id: that.data.equipment.id },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.FLAG == "SUCCESSED") {
                        that.setData({
                            equipment: data.equipment
                        });
                    } else {
                        wx.showLoading({
                            title: '加载出错！',
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
        app.console(e);
        let id = 'equipment.id';
        this.setData({
            [id]: e.id
        });
        this.loadEquit();
    }
})