
//index.js
//获取应用实例

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    scale: 16,
    latitude: "",
    longitude: "",
    cellphone:'',
    userId:'',
    mapmarkers: [],
    policeStationList: [],
    newsList:[],
    userName:'',
    homeAddress:'',
    emerCellphone:'',
    success:false,
    picture:null,
    video:null,
    serverPic:'',
    alarmContent:'',
   
  },

  onReady: function () {
    var that = this;


    wx.request({
      url: "https://643360878.fifasky.xyz/users/GetUserInfor",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        userId: this.data.userId 
      },
      
      complete: function (res) {
        console.log(res);
        that.setData({

          toastHidden: false,
          userName: res.data.UserName,
          cellphone: res.data.UserCellPhone,
          homeAddress: res.data.UserAddress,
          emerCellphone: res.data.UserRelative,
        });

        if (that.data.success == true) {
          wx.navigateTo({
            url: '../index/index?celphone=' + that.data.cellphone
          })
        }
        else {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    }); 


    wx.request({
      url: 'https://643360878.fifasky.xyz/policenews/PoliceNewsIndex',
      header:
      {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      complete:function(res)
      {

        that.setData(
          {
            newsList:res.data
          }
        );
        console.log(res);
      }
    })

  },
  
  onLoad: function (options) {
    var that = this;
    this.ctx = wx.createCameraContext();
    qqmapsdk = new QQMapWX({
      key: '63MBZ-HNDCK-RVLJN-AZHF3-7FCJS-7WFPD'
    });
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    that.setData({
      cellphone: options.celphone,
      userId: options.uid
    });

    console.log(options.celphone);

    wx.getLocation({
      success: function (res) {

        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
    })
  },

  onShow: function () {
    var that = this;

    qqmapsdk.search({
      keyword: '派出所',
      success: function (res) {
        var policeMarkers=new Array();
        for (var i = 0; i < res.data.length; i++) {

          policeMarkers.push({
             id:res.data[i].id,
             iconPath: "../../imgs/location.png",
             latitude: res.data[i].location.lat,
             longitude:res.data[i].location.lng,
             width: 35,
             height: 35
           }); 



        }
        that.setData({
          policeStationList: res.data,
          mapmarkers: policeMarkers
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });

  },
  /**
     * 滑动切换tab
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
/**
 * 点击出现派出所列表
 */
  doPoliceStationSelect: function (e) {

    var that=this;
    var index = e.currentTarget.dataset.id;
    var tel = new String;
    tel = that.data.policeStationList[index].tel; 
    console.log(index);
    wx.makePhoneCall({
      phoneNumber: tel,
      success:function()
      {
       
      },
      fail:function()
      {
        wx.showToast({
          title: '电话拨打失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  doShowNewsDetail:function(e)
  {
    var that=this;
    var index = e.currentTarget.dataset.id;
    
    var title = that.data.newsList[index].NewsTitle;
    var content = that.data.newsList[index].NewsContent;
    
    wx.navigateTo({
      url: '../news/news?title='+title+'&content='+content 
    })
  },
  setLoginName: function (e) {
    this.setData({
      userName: e.detail.value
    })

  },
  setHomeAddress: function (e) {
    this.setData({
      homeAddress: e.detail.value
    })

  },
  setEmerCellphone: function (e) {
    this.setData({
      emerCellphone: e.detail.value
    })

  },
  inputAlarmContent:function(e)
  {
    this.setData({
      alarmContent: e.detail.value
    })
  } ,
  btnSaveSetting: function (e) {
    
  var that=this;
    wx.request({
      url: "https://643360878.fifasky.xyz/users/UpdateUserInfor",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        userId: this.data.userId,
        userCellPhone: this.data.cellphone,
        userName: this.data.userName,
        UserRelativeCellPhone: this.data.emerCellphone,
        address: this.data.homeAddress
      },
      complete: function (res) {
        console.log(res);
        that.setData({

          toastHidden: false,
          success: res.data.success
        });

        if (that.data.success == true) {
        wx.showToast({
          title: '保存成功',
          icon:'none',
          duration:2000
        })
        }
        else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          })
        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    }); 
  },

  submitAlarm:function()
  {
    var that = this;
    wx.uploadFile({
      url: 'https://643360878.fifasky.xyz/alarms/CreateAlarm/',
      filePath: this.data.picture,
      formData: {
        userId: this.data.userId,
        Longitide: this.data.longitude,
        Latitude: this.data.latitude,
        AlarmContent: this.data.alarmContent,
        FileType: '1',
      }, 
      name: 'AlarmFile',
      header: {
         'content-type': 'multipart/form-data'
       }, 
      success: function (res) {
        console.log(res);
        console.log(res.data.fileName);
        that.setData({
          serverPic: res.data.fileName
        });
  
        
      }
    });
     
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          picture: res.tempImagePath
        })
      }
    })
  },
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          picture: res.tempThumbPath,
          video: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  } 

})

