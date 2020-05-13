//login.js
//获取应用实例
const app = getApp()

Page({
    data: {
        copyright: '智慧安防云管理',
        title: "消防管理登录",
        loginname: "登录账号：",
        pwd: "登录密码",
        loginbtn: "登录",
        user: {
            userName: "",
            password: "",
        },
        remind: '加载中',
        angle: 0 // 动画使用
    },
    changePwd(e){// 监听密码改变
        let upu = "user.password"; 
        this.setData({
            [upu] : e.detail.value
        });
    },
    changeUserName(e) {// 监听账号改变
        let upp = "user.userName";
        this.setData({
            [upp] : e.detail.value
        });
    },
    checkInfo(){
        app.console("checkInfo",this.data.user);
        this.login();
    },
    login() {
        let that = this;
        let base = app.globalData.server.baseUrl;
        let login = app.globalData.server.wxLogin;
        app.console(base, login);
        if (that.data.user.userName.length <= 0) {
            app.console("login","账号为空");
            app.fail({
                title: "账号为空",
                icon: "none",
                duration: 1500
            });
            return;
        }
        if (that.data.user.password.length <= 0) {
            app.console("密码为空");
            app.fail({
                title: "密码为空",
                icon: "none",
                duration: 1500
            });
            return;
        }
        app.console("正在进行校验");
        wx.showLoading({
            title: '正在登录校验',
        });
        app.httpRequest({
            url: base + login,
            data: that.data.user,
            callback: function(flag, data) {
                app.console("httpRequest",flag, data);
                // 将数据缓存至本地
                app.globalData.userInfo = data;
                setTimeout(function(){
                    wx.hideLoading();
                    that.checkUserInfo();
                }, 300);
            }
        },that);
    },
    checkUserInfo() { // 校验用户信息
        let userInfo = app.globalData.userInfo;
        app.console("checkUserInfo",userInfo);
        if (userInfo) {
            switch (userInfo.FLAG) {
                case "SUCCESSED":
                    { //登录成功
                        app.fail({
                            title: "登录成功",
                            icon: "success",
                            duration: 1000
                        });
                        app.globalData.isLogin = true;
                        setTimeout(function() {
                            wx.switchTab({
                                url: '../index/index'
                            });
                        }, 100);
                        break;
                    }
                case "PHONE_NOT_EXIST":
                    { //账号不存在
                        app.fail({
                            title: "登录成功",
                            icon: "warn",
                            duration: 1000
                        });
                        break;
                    }
                case "FALSE":
                    { //密码错误
                        app.fail({
                            title: "密码错误",
                            icon: "error",
                            duration: 1000
                        });
                        break;
                    }
            }
        } else { // 服务器内部异常或网络不通
            app.fail({
                title: "服务器内部异常或网络不通",
                icon: "error",
                duration: 2000
            });
        }
    },
    onLoad: function() {
        
    },
    onShow: function() {
        
    },
    onReady: function() {// 动画
        var that = this;
        setTimeout(function() {
            that.setData({
                remind: ''
            });
        }, 1000);
        wx.onAccelerometerChange(function(res) {
            var angle = -(res.x * 30).toFixed(1);
            if (angle > 14) {
                angle = 14;
            } else if (angle < -14) {
                angle = -14;
            }
            if (that.data.angle !== angle) {
                that.setData({
                    angle: angle
                });
            }
        });
    }
})