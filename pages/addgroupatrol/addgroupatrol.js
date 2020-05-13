//指派管辖员 addgroupatrol.js
//获取应用实例
const app = getApp()

Page({
    data: {
        groupPatrol : {}, // 管辖员
        userList: null, // 用户
        deptId: null, // 部门id
    },
    radioChangeType(e) {// 管辖员改变
        app.console("管辖员改变", e);
        let userId = 'groupPatrol.userId';
        this.setData({
            [userId]: e.detail.value
        });
    },
    save(e){// 保存管辖员数据
        app.console("保存管辖员数据", e);
        let that = this;
        if (that.data.groupPatrol && that.data.groupPatrol.userId){
            let base = app.globalData.server.baseUrl;
            let addGroupPatrol = app.globalData.server.addGroupPatrol;
            wx.showLoading({
                title: '数据加载中...',
            });
            app.httpRequest({
                url: base + addGroupPatrol,
                method: 'POST',
                data: that.data.groupPatrol,
                callback: function (flag, data) {
                    app.console("httpRequest", flag, data);
                    setTimeout(function () {
                        wx.hideLoading();
                        if (flag == 1 && data == 1) {
                            wx.showLoading({
                                title: '指派管辖员成功！',
                            });
                            that.loadUserList();
                        } else {
                            wx.showLoading({
                                title: '指派管辖员失败！',
                            });
                        }
                        setTimeout(function () {
                            wx.hideLoading();
                        }, 1500);
                    }, 300);
                }
            }, that);
        }
    },
    loadUserList() {// 查询指定管辖域
        let that = this;
        let base = app.globalData.server.baseUrl;
        let listGroupDuty = app.globalData.server.listGroupDuty;
        app.console("查询指定管辖域");
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + listGroupDuty,
            method: 'POST',
            data: { deptId: that.data.deptId },
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.sysUserList.length > 0) {
                        that.setData({
                            userList: data.sysUserList
                        });
                    } else {
                        wx.showLoading({
                            title: '没有可用管辖员',
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
        let groupId = 'groupPatrol.groupId';
        this.setData({
            [groupId]: e.groupId,
            deptId: app.globalData.userInfo.sysUser.deptId
        });
        this.loadUserList();
    }
})