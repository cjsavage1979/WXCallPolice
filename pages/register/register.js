// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellphone: '',
    userPassword: '',
    userRepassword: '',
    success: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  cellphoneInput: function (e) {
    this.setData({
      cellphone: e.detail.value
    });
    console.log(e.detail.value);


  },
  passwordInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    })

  },
  repasswordInput: function (e) {
    this.setData({
      userRepassword: e.detail.value
    })

  },
  register: function (e) {
    var that = this;
    if (that.data.userPassword != that.data.userRepassword)
    {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'sucess',
        duration: 2000
      }) 
    }
    else
    {
      wx.request({
        url: 'https://643360878.fifasky.xyz/users/CreateUser',
        method: "POST",
        data: {
          userCellphone: this.data.cellphone,
          userPwd: this.data.userPassword
        },
        complete: function (res) {
          console.log(res);
          that.setData({
            toastHidden: false,
            success: res.data.success
          });
          if (that.data.success == true) {
            wx.showToast({
              title: '注册成功',
              icon: 'sucess',
              duration: 2000
            })
          }
          else {
            wx.showToast({
              title: '注册失败',
              icon: 'loading',
              duration: 2000
            })
          }
        }


      })
    }
  },
  logIn: function (e) {
    wx.navigateTo({
      url: '../login/login'
    })
  }
})