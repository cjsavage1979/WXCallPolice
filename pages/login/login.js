// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appName:'报警系统',
    cellphone:'',
    userPassword: '',
    uid:'',
    success:true
  },

   
  cellphoneInput:function(e)
  {
    this.setData({
      cellphone: e.detail.value
    }) ;
    console.log(e.detail.value);


  },
  passwordInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    })

  },
  logIn:function(e)
  {
    
    var that = this;

    if (that.data.cellphone.length == 0 || that.data.userPassword.length==0)
    {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    

    wx.request({
      url: "https://643360878.fifasky.xyz/users/UserLogin",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
    data:{
      userCellphone: this.data.cellphone,
      userPwd: this.data.userPassword
    } ,
      complete: function (res) {
        console.log(res);
        that.setData({
         
          toastHidden: false,
          success: res.data.success,
          uid: res.data.userId
        });

        if (that.data.success==true)
        {
          wx.navigateTo({
            url: '../index/index?celphone=' + that.data.cellphone+'&uid='+that.data.uid
          })
        }
        else
        {
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
  },
  register:function(e)
  {
    wx.navigateTo({
      url: '../register/register'
    })
  }

})