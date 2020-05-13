//新增报警联系人 addlinkman.js
//获取应用实例
const app = getApp()

Page({
    data: {
        status: [{ id: 1, name: '主' }, { id: 0, name: '备' }],
        linkman :{
            id:null,
            groupId:null,
            linkman:null,
            deptId:null
        },
        man:{
            name: null,
            telephone:null,
            type:null
        }
    },
    checkInfo() {// 检查数据
        app.console("检查数据", this.data.man);
        for (let key in this.data.man) {
            if (!this.data.man[key]) {
                app.fail({
                    title: "您还有未选数据",
                    icon: "none",
                    duration: 1500
                });
                return false;
            }
        }
        return true;
    },
    changeInput(e) {// 监听输入框改变的值
        app.console(e);
        let value = 'man.' + e.currentTarget.dataset.datas;
        this.setData({
            [value]: e.detail.value
        });
    },
    radioChangeType(e) {// 监听单选按钮改变的值
        app.console("监听单选按钮改变的值", e);
        let status = 'man.type';
        this.setData({
            [status]: e.detail.value
        });
    },
    save(e) {// 保存新增报警联系人
        app.console("保存新增报警联系人", this.data.install);
        let that = this;
        if (this.checkInfo()) {
            let base = app.globalData.server.baseUrl;
            let addGroupLinkman = that.data.linkman.id ? app.globalData.server.editGroupLinkman: app.globalData.server.addGroupLinkman;
            if (that.data.linkman.linkman){
                let link = JSON.parse(that.data.linkman.linkman);
                link.push(that.data.man);
                let td = 'linkman.linkman';
                that.setData({
                    [td]: JSON.stringify(link)
                });
            }else{
                let td = 'linkman.linkman';
                let deptId = 'linkman.deptId';
                let link = [];
                link.push(that.data.man);
                that.setData({
                    [td]: JSON.stringify(link),
                    [deptId]: app.globalData.userInfo.sysUser.deptId
                });
            }
            wx.showLoading({
                title: '数据加载中...',
            });
            app.httpRequest({
                url: base + addGroupLinkman,
                method: 'POST',
                data: that.data.linkman,
                callback: function (flag, data) {
                    app.console("httpRequest", flag, data);
                    setTimeout(function () {
                        wx.hideLoading();
                        if (flag == 1 && data == 1) {
                            wx.showLoading({
                                title: '新增成功',
                            });
                            wx.navigateBack({
                                delta: 2
                            })
                        } else {
                            wx.showLoading({
                                title: '新增失败',
                            });
                        }
                        setTimeout(function () {
                            wx.hideLoading();
                            that.listGroupLinkman();
                        }, 1500);
                    }, 300);
                }
            }, that);
        }
    },
    listGroupLinkman() { // 加载报警联系人
        let that = this;
        let base = app.globalData.server.baseUrl;
        let listGroupLinkman = app.globalData.server.listGroupLinkman;
        app.console(base, listGroupLinkman, that.data.linkman.groupId);
        wx.showLoading({
            title: '数据加载中...',
        });
        app.httpRequest({
            url: base + listGroupLinkman,
            data: { groupId: that.data.linkman.groupId },
            method: 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if (flag == 1 && data.FLAG == "SUCCESSED" && data.data.length > 0) {
                        let datas = data.data[0];
                        that.setData({
                            linkman: datas
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
        app.console(that.data.linkman);
    },
    onLoad: function (e) {
        app.console(e);
        let groupId = 'linkman.groupId';
        this.setData({
            [groupId]: e.groupId
        });
        this.listGroupLinkman();
    }
})