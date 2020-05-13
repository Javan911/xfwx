//个人信息myself.js
//获取应用实例
const app = getApp()

Page({
    data: {
        title: '我的信息修改',
        btn : '保存',
        userInfo : {},
        user: {}
    },
    changePhonenumber(e){// 监听电话改变
        let uppn = "user.phonenumber";
        this.setData({
            [uppn]: e.detail.value
        });
    },
    changeEmail(e){// 监听邮箱地址改变
        let upe = "user.email";
        this.setData({
            [upe]: e.detail.value
        });
    },
    changePwd(e) {// 监听密码改变
        let upu = "user.password";
        this.setData({
            [upu]: e.detail.value
        });
    },
    changeUserName(e) {// 监听姓名改变
        let upp = "user.userName";
        this.setData({
            [upp]: e.detail.value
        });
    },
    changeInfo() {
        let that = this;
        let base = app.globalData.server.baseUrl;
        let editUser = app.globalData.server.editUser;
        if (!that.data.user.password){
            app.fail({
                title: "密码不你能为空",
                icon: "wran",
                duration: 2000
            });
            return;
        }
        app.console(base, editUser, that.data.user);
        wx.showLoading({
            title: '数据保存中...',
        });
        app.httpRequest({
            url: base + editUser,
            data: that.data.user,
            method : 'POST',
            callback: function (flag, data) {
                app.console("httpRequest", flag, data);
                setTimeout(function () {
                    wx.hideLoading();
                    if(flag == 1){
                        // 将数据缓存至本地
                        app.globalData.userInfo.sysUser = that.user;
                        wx.showLoading({
                            title: '保存成功！',
                        });
                    }else{
                        wx.showLoading({
                            title: '保存失败！',
                        });
                    }
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 100);
                }, 500);
            }
        }, that);
    },
    onLoad: function () {
        let userInfo = app.globalData.userInfo;
        this.setData({
            userInfo,
            user : userInfo.sysUser
        });
    },
    onShow: function () {

    },
    onReady: function () {// 动画
        
    }
})