<template>
  <view class="container">
    <!-- 视频列表容器 -->
    <scroll-view  v-if="!showFormFlag" scroll-y class="video-list" style="padding: 5px;">
      <view v-for="(video, index) in videoList" :key="index" class="video-item">
        <!-- 视频播放区域 -->
		<view style="margin-bottom: 5px;">
			<video :src="video.fileUrl" show-progress="true"  controls class="video-player"></video>
			<!-- 视频名称 -->
			<view style="display: flex;">
				<text style="color: #949494;">文件名:</text><text style="color: #5c5c5c;">{{ video.fileName }}</text>
				<button @tap="saveVideo(video.fileUrl)" type="primary" size="mini">下载</button>
			</view>
		</view>
        
      </view>
    </scroll-view>
	<view v-if="showFormFlag" class="form-container">
	     <uni-forms :modelValue="formData">
	     			<uni-forms-item label="文件名" name="fileName">
	     				<uni-easyinput type="text" v-model="formData.fileName" placeholder="请输入文件名" />
	     			</uni-forms-item>
	     			<uni-forms-item label="上传者" name="autor">
	     				<uni-easyinput type="text" v-model="formData.autor" placeholder="请输入上传者" />
	     			</uni-forms-item>
					<uni-forms-item label="视频" name="video">
						<view style="display: flex;justify-content: space-around;">
							<button class="video-button" size="mini" style="background-color: #41a863;color: white;" @tap="selectVideo">选择视频</button>
							<span v-if="videoSelected">{{orgFileName}}</span>
						</view>
							
					</uni-forms-item>
					<view  style="display: flex;justify-content: space-around;">
						<button @tap="onSubmit" type="primary">确认</button>
						<button @tap="onCancle">取消</button>
					</view>
						
	     		</uni-forms>
	    </view>

    <!-- 固定在左下角的上传视频按钮 -->
    <button v-if="!showFormFlag" class="fixed-upload-button" @tap="showForm" style="font-size: 12px;">上传</button>
  </view>
</template>

<script>
import config from '@/common/config.js'
import {list} from '@/api/video.js'
export default {
  data() {
    return {
	  baseUrl:'',
      videoSelected: false,
      videoURL: '',
	  uploaderName: '', // 上传者姓名
	  orgFileName: '', // 自定义文件名
	  showFormFlag: false,
	  formData:{},
	  videoList:[]
    };
  },
  onShow() {
	  this.baseUrl = config.APP_SERVER_URL
	  this.getVideos()
  	console.log(config.APP_SERVER_URL,'app');
  },
  methods: {
selectVideo() {
  uni.chooseVideo({
    success: async (res) => {
      this.videoSelected = true;
	  let urlThunk = res.tempFilePath.split('/');
	  let houzui = res.tempFilePath.split('.')
	  this.orgFileName =urlThunk[urlThunk.length-2]+'.' +houzui[houzui.length-1];
      this.videoURL = res.tempFilePath;
      // 准备上传
    },
    fail: (err) => {
      console.error('选择视频失败:', err);
    }
  });
},
	getVideos(){
		let that = this
		let url = this.baseUrl
		list().then(res =>{
			res.forEach(item => {
				item.fileUrl = url + item.fileUrl;
			})
			that.videoList=res
			console.log(that.videoList);
		})
	},
    saveVideo(fileUrl) {
	// 打开loading等待
	      uni.showLoading({ mask: true, title: '加载中' })
	 
	      // 先下载视频
	      uni.downloadFile({
	        url:fileUrl,
	        success: (res) => {
	          const that = this
	 
	          if (res.statusCode === 200) {
	            // 关闭loading
	            uni.hideLoading()
	 
	            // 保存视频到手机相册
	            uni.saveVideoToPhotosAlbum({
	              filePath: res.tempFilePath,
	              success: function() {
	                // 成功提示
	                that.$refs.uToast.show({
	                    title: '保存成功', 
	                    type: 'success', 
	                    position: 'bottom'
	                })
	              }
	            })
	          }
	},
	})
    },
	 showForm() {
	      this.showFormFlag = true;
	    },
	restFrom(){
		this.showFormFlag=false;
		this.formData.fileName=""
		this.formData.autor=""
		this.videoURL=""
		this.videoSelected=false
	},
	onSubmit() {
			let autor = this.formData.autor;
			let fileName = this.formData.fileName;
		      try {
		        // 显示加载提示
		        uni.showLoading({
		          title: '视频上传中...',
		        });
		
		        // 开始上传任务
		        const uploadTask = uni.uploadFile({
		          url: this.baseUrl + '/video/upload-video', // 确保baseUrl已正确设置
		          filePath: this.videoURL,
		          name: 'video',// 与后端接收的参数名对应
				  formData: { // 添加formData传递额外参数
				        fileName: fileName, // 用户自定义的文件名
						autor:autor
				    },
		          header: {
		            'Content-Type': 'multipart/form-data'
		          },
		          success: (uploadRes) => {
					    
		            uni.hideLoading(); // 隐藏加载提示
		            if (uploadRes.statusCode === 200) {
		              const result = JSON.parse(uploadRes.data);
		              uni.showToast({
		                title: '视频上传成功',
		                icon: 'none',
		              });
					  this.restFrom()
					  this.getVideos()
		              // 这里可以处理上传成功后的逻辑，比如跳转页面或保存返回的信息
		            } else {
						console.log(uploadRes,'ures');
		              uni.showToast({
		                title: '服务器错误',
		                content: `状态码：${uploadRes.statusCode}`,
		                icon: 'none',
		              });
		            }
		          },
		          fail: (err) => {
		            uni.hideLoading();
		            uni.showToast({
		              title: '上传失败',
		              content: err.errMsg || '未知错误',
		              icon: 'none',
		            });
		          },
		          onProgressUpdate: (progressEvent) => {
		            // 更新上传进度
		            const percent = Math.round(progressEvent.progress * 100);
		            uni.showToast({
		              title: `${percent}%`,
		              icon: 'none',
		              duration: 200, // 显示较短时间后自动消失，避免频繁弹出
		            });
		          },
		        });
		
		        // 等待上传完成（实际上此处无需await，因为上传任务是异步进行的，不影响后续逻辑）
		        // 但为了保持代码完整性，你可以选择监听uploadTask的complete事件处理完成逻辑
		        uploadTask.onProgressUpdate((event) => {
		          // 此处代码重复了，实际逻辑已在uploadFile中处理，可忽略
		        });
		
		      } catch (error) {
		        uni.hideLoading();
		        console.error('上传过程中出现错误:', error);
		        uni.showToast({
		          title: '上传失败，请重试',
		          icon: 'none',
		        });
		      }
	    },
	onCancle(){
		this.restFrom()
	}	
  },
};
</script>


<style >
.container {
  position: relative;
}

/* 上传按钮样式，固定在页面底部，简洁明快的设计 */
.container .fixed-upload-button {
  position: fixed;
  top: 20px;
  right: 5px;
  width: 40pxs;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 8px;
  color: #fff;
  background-color: #007aff;
  border-radius: 20px;
  z-index: 99;
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.form-container{
	padding: 10rpx;
}

</style>

