const db = wx.cloud.database();
Page({
  data: {
    image: []
  },
  insert:function() {
    // db.collection('user').add({
    //   data: {
    //     name:'xiaoming',
    //     age: '18'
    //   },
    //   success: res => {
    //     console.log(res);
    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
    db.collection('user').add({// 增
      data:{
        name: 'xiaohua',
        age: 20
      }
    }).then(res => {
      console.log(res)
    })
  },
  update:function(){// 改
    db.collection('user').doc('3e1ef27b5d299a21068ba9f65dac6c9d').update({
      data: {
        name: 'bigfat',
        age: 58
      }
    }).then( res => {
      console.log(res)
    }).catch( err => {
      console.log(err)
    })
  },
  search:function() {// 查
    db.collection('user').where({
      name:'bigfat'
    }).get().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  delete: function() {// 删
    db.collection('user').doc('3e1ef27b5d299a21068ba9f65dac6c9d').remove().then(res=> {
      console.log(res);
    }).catch( err => {
      console.log(err)
    })
  },
  sum: function() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        a: 4,
        b: 8
      }
    }).then(res => {
      console.log(res)
    }).catch(res=> {
      console.log(res)
    })
  },
  openId: function(){// 云函数
    wx.cloud.callFunction({
      name: 'login',
      data:{}
    }).then( res=> {
      console.log(res)
    }).catch( err => {
      console.log(err)
    })
  },
  batchDelete: function(){
    wx.cloud.callFunction({
      name: 'batchDelete'
    }).then( res=> {
      console.log(res);
    }).catch(err=> {
      console.error(err)
    })
  },
  upload: function() {// 上传图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: new Date().getTime()+'.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log('上传成功', res.fileID)
            db.collection('image').add({
              data: {
                fileID: res.fileID
              }
            }).then(res => {
              console.log(res);
            }).catch(err => {
              console.error(err);
            })
          },
        })
      }
    })
  },
  getfile: function() {// 获取openid
    wx.cloud.callFunction({
      name: 'login'
    }).then( res => {
      console.log(res.result.openid)
      db.collection('image').where({
        _openid: res.result.openid
      }).get().then( res2 => {
        console.log(res2.data)
        this.setData({
          images: res2.data
        })
      })
    })
  },
  download: function(event) {// 下载文件
    console.log(event.target.dataset.fileid)
    wx.cloud.downloadFile({
      fileID: event.target.dataset.fileid
    }).then(res => {
      console.log(res.tempFilePath)
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) { 
          wx.showToast({
            title: '保存成功'
          })
        }
      })
    }).catch(error => {
    })
  }
})