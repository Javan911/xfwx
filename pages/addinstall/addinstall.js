//新增安装点 addinstall.js
//获取应用实例
const app = getApp()

Page({
    data: {
        flags: false,
        status:[{id:1,name:'正常'}, {id:0, name:'异常'}],//安装点状态
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
    checkInfo(){// 检查数据
        app.console("检查数据",this.data.install);
        this.setData({ flags: true});
        for(let key in this.data.install){
            if (!this.data.install[key]){
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
    save(e){// 保存新增安装点
        app.console("保存新增安装点", this.data.install);
        let that = this;
        if (this.checkInfo() && that.data.flags){
            let base = app.globalData.server.baseUrl;
            let addInstall = app.globalData.server.addInstall;
            wx.showLoading({
                title: '数据加载中...',
            });
            app.httpRequest({
                url: base + addInstall,
                method: 'POST',
                data: that.data.install,
                callback: function (flag, data) {
                    app.console("httpRequest", flag, data);
                    setTimeout(function () {
                        wx.hideLoading();
                        that.setData({ flags: false });
                        if (flag == 1 && data == 1) {
                            wx.showLoading({
                                title: '新增安装点成功',
                            });
                            wx.navigateBack({
                                delta: 2
                            })
                        } else {
                            wx.showLoading({
                                title: '新增安装点失败',
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
                setTimeout(function(){
                    wx.hideLoading();
                }, 1000);
            }
        });
    },
    onLoad: function (e) {
        app.console(e);
        let groupId = 'install.groupId';
        let userId = 'install.userId';
        this.setData({
            [groupId]: e.groupId,
            [userId]: app.globalData.userInfo.sysUser.userId
        });
    }
})