//管辖员 信息列表 patrol.js
//获取应用实例
const app = getApp()

Page({
    data: {
        patrolTitle: '当前管辖员信息如下',
        btn: '加载更多',
        hasMore : true,
        hasDelPatrol: true,
        start:1,
        size:10,
        patrols : [],
    },
    editInstall(e) {// 编辑安装点
        app.console("编辑安装点", e);
        wx.navigateTo({
            url: '../editinstall/editinstall?id=' + e.currentTarget.dataset.data
        });
    },
    notMore(e){// 没有更多了
        app.console("没有更多了", e);
        wx.showLoading({
            title: '已完成...',
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 1000);
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
                                that.setData({
                                    patrols: []
                                });
                                that.loadMore();
                            } else {
                                app.fail({ title: "移除失败", icon: "error", duration: 1500 });
                            }
                        },
                    }, that);
                }
            }
        });
    },
    loadMore() { // 加载管辖人员
        let that = this; // 使用方所有管辖人员 分页数据 + deptId + token + start(1) + size(10)
        let base = app.globalData.server.baseUrl;
        let queryPatrolByDeptId = app.globalData.server.queryPatrolByDeptId;
        app.console(base, queryPatrolByDeptId, that.data.start, that.data.size);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + queryPatrolByDeptId,
            data: { deptId: app.globalData.userInfo.sysUser.deptId, start: that.data.start, size: that.data.size },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.data && data.data.length > 0) {
                        app.console("进来了", data.data);
                        let datas = that.data.patrols.concat(data.data);
                        app.console("数据", datas);
                        let starts = that.data.start + 1;
                        that.setData({
                            start: starts,
                            patrols: datas,
                            hasMore: data.hasMore
                        });
                        app.console("更新数据", that.data.patrols);
                    } else {
                        wx.showLoading({
                            title: '暂无数据！',
                        });
                        that.setData({
                            hasMore : false
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