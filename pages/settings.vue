<template>
  <v-flex 
    xs12 
    class="text-xs-center text-sm-center text-md-center text-lg-center"
  >
    <img 
      v-if="imageUrl"
      :src="imageUrl" 
      height="150"
    >
    <v-text-field
      v-model="imageName"
      label="Select Image" 
      prepend-icon="attach_file"
      @click="pickFile"
    />
    <input
      ref="image"
      type="file"
      style="display: none" 
      accept="image/*"
      @change="onFilePicked"
    >
  </v-flex>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      title: 'Image Upload',
      dialog: false,
      imageName: '',
      imageUrl: '',
      imageFile: ''
    }
  },
  fetch({ store, redirect }) {
    if (!store.state.auth.token) {
      return redirect('/')
    }
  },
  methods: {
    pickFile() {
      this.$refs.image.click()
    },
    uploadInputchange() {
      let file = document.getElementById('uploadFileInput').files[0] // 选择的图片文件
      this.uploadImgToQiniu(file)
    },
    // 上传图片到七牛
    async uploadImgToQiniu(file) {
      const res = await axios.post('/api/qiniu/upload', {
        token: this.$store.state.token
      })
      console.log(res)
      const axiosInstance = axios.create({ withCredentials: false })
      // withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
      let data = new FormData()
      data.append('token', res.data.token)
      data.append('key', res.data.key)
      data.append('file', file)
      axiosInstance({
        method: 'POST',
        url: 'http://upload-z2.qiniup.com', //上传地址
        data: data,
        // 超时时间，因为图片上传有可能需要很久
        onUploadProgress: progressEvent => {
          //imgLoadPercent 是上传进度，可以用来添加进度条
          let imgLoadPercent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          console.log(imgLoadPercent)
        }
      })
        .then(res => {
          console.log(res)
          if (res.data.success === true) {
            try {
              this.$store.commit('auth/SET_USER', res.data.user)
            } catch (error) {
              alert('failed')
            }
          } else {
            alert('failed')
          }
        })
        .catch(err => {
          alert('failed')
        })
    },
    onFilePicked(e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
          this.uploadImgToQiniu(files[0])
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
      }
    }
  }
}
</script>
