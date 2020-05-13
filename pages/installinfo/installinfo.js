//安装点详细信息installinfo.js
//获取应用实例
const app = getApp()

Page({
    data: {
        title: '当前管辖域信息如下',
        childTitle: '子管辖域信息如下',
        titleCount: '当前设备信息',
        btn: '保存',
        hasEditGroup: true,
        hasDelGroup: true,
        hasAddGroup: true,
        hasDelGroupPatrol: true,
        hasAddGroupPatrol: true,
        hasAddInstall: true,
        hasDelInstall: true,
        hasEditInstall: true,
        hasUnbindInstall: true,
        id: null,
        installList: null,// 当前管辖域安装点列表
        groupPatrol: '当前管辖管辖员信息',//  管辖员标题
        installListEqu: null, // 当前管辖域设备信息
        groupPatrolList: null, // 当前管辖域管辖员
        group: null, // 当前管辖域信息
        groups: null // 当前管辖域子管辖域信息
    },
    addInstall(e) {// 新增安装点
        app.console("新增安装点", e);
        wx.navigateTo({
            url: '../addinstall/addinstall?groupId=' + e.currentTarget.dataset.data
        });
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
                            if (flag == 1 && data == 1) {
                                app.fail({ title: "解绑设备成功", icon: "success", duration: 1000 });
                                that.listInstall();
                            } else {
                                app.fail({ title: "解绑设备失败", icon: "error", duration: 1000 });
                            }
                        },
                    }, that);
                }
            }
        });
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
    delGroupPatrol(e) {// 删除管辖员
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
                    let delGroupPatrol = app.globalData.server.delGroupPatrol;
                    let datas = { userId: e.currentTarget.dataset.data };
                    app.httpRequest({
                        url: base + delGroupPatrol,
                        method: 'POST', data: datas,
                        callback: function (flag, data) {
                            console.log(flag, data);
                            wx.hideLoading();
                            if (flag == 1 && data == 1) {
                                app.fail({ title: "移除成功", icon: "success", duration: 1500 });
                                that.loadGroupInfo();
                            } else {
                                app.fail({ title: "移除失败", icon: "error", duration: 1500 });
                            }
                        },
                    }, that);
                }
            }
        });
    },
    addGroupPatrol(e) {// 指派管辖员
        app.console("指派管辖员", e);
        wx.navigateTo({
            url: '../addgroupatrol/addgroupatrol?groupId=' + e.currentTarget.dataset.data
        });
    },
    addGroup(e) {// 新增管辖域（一级）
        app.console(this);
        wx.navigateTo({
            url: '../addgroup/addgroup?parentId=' + e.currentTarget.dataset.data + '&deptId=' + app.globalData.userInfo.sysUser.deptId
        });
    },
    editGroup(e) {// 编辑当前管辖域
        app.console("editGroup", e);
        wx.navigateTo({
            url: '../editgroup/editgroup?id=' + e.currentTarget.dataset.data + '&deptId=' + app.globalData.userInfo.sysUser.deptId
        });
    },
    delGroup(e) {// 删除当前管辖域
        app.console("delGroup", e);
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确定删除该管辖域吗',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '删除中...',
                    });
                    let base = app.globalData.server.baseUrl;
                    let delGroup = app.globalData.server.delGroup;
                    let datas = { id: e.currentTarget.dataset.data };
                    app.httpRequest({
                        url: base + delGroup,
                        method: 'POST', data: datas,
                        callback: function (flag, data) {
                            console.log(flag, data);
                            wx.hideLoading();
                            if (flag == 1 && data == 1) {
                                app.fail({ title: "删除成功", icon: "success", duration: 1000 });
                                that.listGroupPatrolByGroupId();
                            } else {
                                app.fail({ title: "删除失败", icon: "error", duration: 1000 });
                            }
                        },
                    }, that);
                }
            }
        });
    },
    loadGroupInfo() { // 加载管辖域信息
        let that = this;
        let base = app.globalData.server.baseUrl;
        let queryGroupByIdOfChilds = app.globalData.server.queryGroupByIdOfChilds;
        app.console(base, queryGroupByIdOfChilds, that.data.id);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + queryGroupByIdOfChilds,
            data: { id: that.data.id },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.code == 200) {
                        that.setData({
                            group: data.group,
                            groups: data.groups
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
    loadInstallGroup() { // 加载管辖域设备信息信息
        let that = this;
        let base = app.globalData.server.baseUrl;
        let listEquipment = app.globalData.server.listEquipment;
        app.console(base, listEquipment, that.data.id);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + listEquipment,
            data: { id: that.data.id },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data, data.equipmentList);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.FLAG == "SUCCESSED" && data.equipmentList.length > 0) {
                        that.setData({
                            installListEqu: data.equipmentList
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
    listGroupPatrolByGroupId() { // 加载管辖域管辖员信息
        let that = this;
        let base = app.globalData.server.baseUrl;
        let listGroupPatrolByGroupId = app.globalData.server.listGroupPatrolByGroupId;
        app.console(base, listGroupPatrolByGroupId, that.data.id);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + listGroupPatrolByGroupId,
            data: { groupId: that.data.id },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data, data.groupPatrolList);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.FLAG == "SUCCESSED" && data.groupPatrolList.length > 0) {
                        that.setData({
                            groupPatrolList: data.groupPatrolList
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
    listInstall() { // 加载管辖域安装点信息
        let that = this;
        let base = app.globalData.server.baseUrl;
        let listInstall = app.globalData.server.listInstall;
        app.console(base, listInstall, that.data.id);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + listInstall,
            data: { groupId: that.data.id },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data, data.installList);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.FLAG == "SUCCESSED" && data.installList.length > 0) {
                        that.setData({
                            installList: data.installList
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
    onLoad: function (e) {
        this.setData({
            id: e.id
        });
        app.console("seegroup", this.data);
        this.loadGroupInfo();
        this.loadInstallGroup();
        this.listGroupPatrolByGroupId();
        this.listInstall();
    },
    onShow: function () {

    },
    onReady: function () {// 动画

    }
})