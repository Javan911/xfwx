//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        server : {
            baseUrl: "https://aoduniot.com/wx",
            //baseUrl: "http://192.168.1.108:8899/wx",
            //baseUrl : "http://2390y10g68.zicp.vip/wx",
            //baseUrl: 'http://me546926.vicp.io/wx',
            wxLogin: "/wxlogin", // 登录
            getLoginSms: "/getLoginSms", // 获取验证码
            wxLoginSms: "/wxLoginSms", // 手机号码，验证码登录
            quyu: '/listGroup', // 集群列表
            editUser: '/editSysUser', // 修改用户
            addGroup: '/addGroup', // 添加集群
            delGroup: '/delGroup', //集群删除
            editGroup: '/editGroup', // 集群修改
            addSysUser: '/addSysUser', // 添加用户
            queryInstallsByGroupId: '/queryInstallsByGroupId', // 安装指定 适用方的点列表 +  deptId+token
            equipmentType: '/listEquipmentType', // 设备类型列表
            listEquipment: '/listEquipment', // 微信小程序模糊查询所有设备 + id + token
            addInstall: '/addInstall', // 设备安装
            editEquipment: '/editEquipment', // 修改设备信息
            queryInstallById: '/queryInstallById', // 查询指定id的安装点信息 + id --》 Install
            listInstall: '/listInstall', // 集群安装点列表
            queryPatrolByDeptId: '/queryPatrolByDeptId', // 使用方所有管辖人员 分页数据 + deptId + token + start(1) + size(10)
            addGroupDuty: '/addGroupDuty', // 添加责任人
            delGroupDuty: '/delGroupDuty', // 删除责任人
            updateAlarmDis: '/updateAlarmDis', // 处理报警设备
            queryAlarmDisById: '/queryAlarmDisById', // 查询指定id的报警设备信息 + id + token == > data
            queryAlarmDispose0: '/queryAlarmDispose0', // 报警处理信息列表 --- 待处理的 ==> deptId + token
            queryAlarmDispose1: '/queryAlarmDispose1', // 报警处理信息列表 --- 已处理的 ==> deptId + token
            equipmentById: '/equipmentById', // 微信小程序根据ID查询指定设备详细信息
            queryEquipmentByDeptId: '/queryEquipmentByDeptId', //查询指定使用方 的所有设备 分页查询 map==> token + deptId
            queryGroupLinkmanListByDeptId: '/queryGroupLinkmanListByDeptId', // 查询指定 使用方下的所有报警联系人列表
            deleteInstall: '/deleteInstall', // 微信小程序删除安装点 id+token
            addGroupPatrol: '/addGroupPatrol', // 添加管辖员 新增管辖员 -传入groupId+userId+token -传出1/0
            delGroupPatrol: '/delGroupPatrol', // 删除管辖员
            listGroupDuty: '/listGroupDuty', // 微信小程序查询该单位仍未指派为责任人或管辖员的用户 -传入deptId+token -传出List<SysUser> sysUserList +FLAG（SUCCESSED/FALSE）
            listGroupPatrolByGroupId: '/listGroupPatrolByGroupId', // 查询指定集群管辖员 -传入groupId+token -传出List<SysUser> groupPatrolList + FLAG（SUCCESSED/FALSE）
            listGroupDutyByGroupId: '/listGroupDutyByGroupId ', // 查询指定集群责任人  -传入groupId+token -传出 List<SysUser> groupDutyList +FLAG（SUCCESSED/FALSE）
            delInstall: '/delInstall', //delInstall 解绑设备与安装点（删除安装点） -传入imei+token -传出1/0 
            editInstall: '/editInstall', //editInstall 修改安装点信息 -传入安装点实体对象信息+token -传出1/0
            listGroupLinkman: '/listGroupLinkman', //报警联系人列表 -传入imei+token -传出List<EquipmentLinkman> equipmentLinkmanList + FLAG(SUCCESSED/FALSE)
            addGroupLinkman: '/addGroupLinkman', // 添加报警联系人 -传入EquipmentLinkman实体类对象信息+token -传出 1/0
            editGroupLinkman: '/editGroupLinkman', // 修改报警联系人 -传入EquipmentLinkman实体类对象信息+token -传出 1/0
            delGroupLinkman: '/editGroupLinkman', // 删除报警联系人 -传入id+token -传出 1/0
            queryGroupByIdOfChilds: '/queryGroupByIdOfChilds', //  根据管辖域id查询当前管辖信息，及其子管辖域 -传入id+token -传出 map - key: group、 key : groups
            queryGroupById: '/queryGroupById', // 查询指定id的管辖域 -传入id+token -传出 group
            equipmentTypeAndEquipment: '/equipmentTypeAndEquipment', // 加载设备类型及其设备信息
            mapAPI: {
                ak: 'ZAhflLIS8yXBgLP9qWpE3WOU13sTroOx',//'1x3SDxkj7KpTg9RdIDNCFe8D007cnGU7',
                //url: 'https://api.map.baidu.com/geocoder/v2/?location=',
                url: 'https://api.map.baidu.com/reverse_geocoding/v3/?location=',
                params: '&output=json&coordtype=wgs84ll&ak='
            }
        },
        userInfo: null,
        isLogin : false // 登录成功标识
    },
  trans: function (n) {
    console.log(n);
    n = n + '';
    n = n.split('.');
    console.log(n);
    n[1] = n[1].substring(0, 8);
    n = n.join('.');
    return Number(n);
  },
    httpRequest(data, target) {
        let that = target ? target : this;
        data.data.TOKEN = this.globalData.userInfo && this.globalData.userInfo.TOKEN;
        wx.request({
            url: data.url,
            data: data.data,
            method: data.method ? data.method : 'GET',
            dataType: 'json',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                data.callback && data.callback.call(that, 1, res.data);
            },
            fail(res) {
                data.callback && data.callback.call(that, 0, res.data);
            }
        });
    },
    fail(data, target) {
        let that = target ? target : this;
        wx.showToast({
            title: data.title ? data.title : '失败',
            icon: data.icon ? data.icon : 'info',
            duration: data.duration ? data.duration : 2000
        });
        data.callback && data.callback.call(that);
    },
    consoleFlag : false, // 开发者模式控制台打印
    console(){
        if (this.consoleFlag)
            console.log(arguments);
    },
    getCityInfo(latitude, longitude, target, callback) { // 调用地理位置解析
        let map = this.globalData.server.mapAPI;
        let url = map.url + latitude + ',' + longitude + map.params + map.ak;
        console.log(url);
        wx.request({
            url: url,
            data: {},
            header: {
                'Content-Type': "application/json"
            },
            success: function (res) {
                callback && callback.call(target, 1, res);
            },
            fail(res) {
                callback && callback.call(target, 0, res);
            }
        });
    },
})

/**
    "pages/login/login", // 登录
    "pages/index/index", // 首页
    "pages/myself/myself", // 个人信息
	"pages/listgroup/listgroup", // 管辖域列表
    "pages/seegroup/seegroup", // 新增管辖域
    "pages/addgroup/addgroup", // 新增管辖域
    "pages/editgroup/editgroup", // 编辑管辖域
    "pages/addgroupatrol/addgroupatrol", // 指派管辖员
    "pages/editinstall/editinstall", // 修改安装点信息
    "pages/addinstall/addinstall", // 新增安装点信息
    "pages/installmgr/installmgr", // 安装点信息管理
    "pages/installinfo/installinfo", // 安装点信息管理，详情
    "pages/addlinkman/addlinkman", // 新增报警联系人
    "pages/patrol/patrol", // 管辖员管理模块
    "pages/linkmanmgr/linkmanmgr", // 报警联系人
    "pages/equipmentmgr/equipmentmgr", // 设备信息管理列表
    "pages/chulialarmd/chulialarmd", // 处理紧急设备报警信息
    "pages/yichuliala/yichuliala", // 已处理紧急设备报警信息
    "pages/map/map", // 地图
 */