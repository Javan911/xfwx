//编辑安装点 editinstall.js
//获取应用实例
const app = getApp()

Page({
    data: {
        imei:'',//旧设备号
        status: [{ id: 1, name: '正常' }, { id: 0, name: '异常' }],//安装点状态
        installMsg: {
            groupId: '集群号',
            imei: 'IMEI',
            installName: '安装点名称',
            installLocation: '安装位置',
            status: '状态：1正常；0异常',
            userId: '安装人员',
            longitude: '经度',
            latitude: '纬度',
        }, // 安装点信息
        install: {
            groupId: null,
            imei: null,
            installName: null,
            installLocation: null,
            status: null,
            userId: null,
            longitude: null,
            latitude: null,
            oldImei:null,
        } // 安装点
    },
    scanner() {// 扫描二维码
        var that = this;
        var show;
        wx.scanCode({
            success: (res) => {
                app.console("扫码", res);
                let install = 'install.imei';
                that.setData({
                    [install]: JSON.parse(res.result).i
                });
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: (res) => {
                wx.showToast({
                    title: '失败',
                    icon: 'success',
                    duration: 2000
                })
            },
            complete: (res) => {
            }
        });
    },
    checkInfo() {// 检查数据
        app.console("检查数据", this.data.install);
        for (let key in this.data.install) {
            if (!this.data.install[key]) {
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
        let value = 'install.' + e.currentTarget.dataset.datas;
        this.setData({
            [value]: e.detail.value
        });
    },
    radioChangeType(e) {// 监听单选按钮改变的值
        app.console("监听单选按钮改变的值", e);
        let status = 'install.status';
        this.setData({
            [status]: e.detail.value
        });
    },
    save(e) {// 保存新增安装点
        app.console("保存新增安装点", this.data.install);
        let that = this; 
        if (this.checkInfo()) {
            let base = app.globalData.server.baseUrl;
            let editInstall = app.globalData.server.editInstall;
            wx.showLoading({
                title: '数据加载中...',
            });
            app.httpRequest({
                url: base + editInstall,
                method: 'POST',
                data: that.data.install,
                callback: function (flag, data) {
                    app.console("httpRequest", flag, data);
                    setTimeout(function () {
                        wx.hideLoading();
                        if (flag == 1 && data == 1) {
                            wx.showLoading({
                                title: '修改安装点成功',
                            });
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 2000);
                        } else {
                            wx.showLoading({
                                title: '修改安装点失败',
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
    getPosition() {// 获得经纬度信息
        let that = this;
        wx.chooseLocation({// 得到经纬度
            success: function (res) {
                app.console(res.latitude + ',' + res.longitude);
                wx.showLoading({
                    title: '数据处理中...',
                });
                let longitude = 'install.longitude';
                let latitude = 'install.latitude';
                that.setData({
                  [longitude]: app.trans(res.longitude),//经度
                  [latitude]: app.trans(res.latitude)//纬度
                });
                setTimeout(function () {
                    wx.hideLoading();
                }, 1000);
            }
        });
    },
    queryInstallById() {// 获取当前指定id的安装点
        let that = this;
        let base = app.globalData.server.baseUrl;
        let queryInstallById = app.globalData.server.queryInstallById;
        app.console(base + queryInstallById);
        app.httpRequest({
            url: base + queryInstallById,
            method: 'POST', data: { id : that.data.install.id},
            callback: function (flag, data) {
                console.log(flag, data);
                wx.hideLoading();
                if (flag == 1) {
                    let imei = data.imei;
                    for(let key in data){
                        if(!data[key]){
                            delete data[key];
                        }
                    }
                    let oldImei = 'install.oldImei';
                    data.imei = null;
                    this.setData({
                        install: data
                    });
                    this.setData({
                        [oldImei]: imei,
                        imei: imei
                    });
                } else if (data == null) {
                    app.fail({ title: "暂无数据", icon: "error", duration: 1000 });
                } else {
                    app.fail({ title: "数据请求失败了", icon: "error", duration: 1000 });
                }
            },
        }, that);
    },
    onLoad: function (e) {
        app.console(e);
        let id = 'install.id';
        this.setData({
            [id]: e.id
        });
        this.queryInstallById();
    }
})