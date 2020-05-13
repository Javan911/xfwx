/** 管辖域--集群管理.js **/
const app = getApp();


Page({
    data: {
        hasAddGroup : true,
        title : '管辖域管理列表',
        list: [] // 管辖域列表数据
    },
    addGroup(e){// 新增管辖域（一级）
        app.console(this);
        wx.navigateTo({
            url: '../addgroup/addgroup?parentId=' + e.currentTarget.dataset.data + '&deptId=' + app.globalData.userInfo.sysUser.deptId
        });
    },
    loadGroup() {// 获取当前所有的管辖域
        let base = app.globalData.server.baseUrl;
        let quyu = app.globalData.server.quyu;
        app.console(base + quyu);
        app.httpRequest({
            url: base + quyu, data: {}, 
            callback: function (flag, data) {
                app.console(data);
                wx.hideLoading();
                // 将数据缓存至本地
                if (flag == 1 && data.FLAG == "SUCCESSED") {
                    this.setData({
                        list: data.groupList
                    });
                } else if (flag == 1 && data.FLAG != "SUCCESSED"){
                    app.fail({ title: "暂无数据", icon: "error", duration: 1000 });
                } else {
                    app.fail({ title: "数据请求失败了", icon: "error", duration: 1000 });
                }
                app.console(this.data.list);
            }
        }, this);
    },
    onLoad(){
        this.loadGroup();
    },
    seeGroup(e){// 管辖域查看
        app.console(e.currentTarget.dataset.item);
        wx.navigateTo({
            url: '../seegroup/seegroup?id=' + e.currentTarget.dataset.item.id
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.loadGroup();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.loadGroup();
    },

    /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
    onPullDownRefresh: function () {
        this.loadGroup();
    },
    /**
     * 收缩核心代码
     */
    kindToggle(e) {
        const id = e.currentTarget.id
        const list = this.data.list
        for (let i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].show = !list[i].show
            } else {
                list[i].show = false
            }
        }
        /**
         * key和value名称一样时，可以省略
         * 
         * list:list=>list
         */
        this.setData({
            list
        })
    }
})