<template lang="pug">
div(color="white")
  v-toolbar(flat color="white")
    v-toolbar-title Resouces
    v-breadcrumbs(
      :items="paths"
    )
      template(slot="item" slot-scope="props")
        a(@click="goto(props.item.id)") {{ props.item.text }}
      v-icon(slot="divider") chevron_right
    v-spacer
    v-dialog(v-model="folder.dialog" width="30%")
      v-btn(slot="activator" color="red lighten-2" dark) New folder
      v-card
        v-card-title.headline.blue(primary-title) New folder
        v-card-text
          v-flex(
            class="text-xs-center text-sm-center text-md-center text-lg-center"
          )
            v-form(ref="folder")
              v-text-field(
                v-model="folder.name"
                label="Folder Name"
                prepend-icon="folder"
                :rules="folder.rules"
              )
        v-card-actions
          v-spacer
          v-btn(flat ripple @click="folder.dialog = false") cancel
          v-btn(flat ripple @click="newFolder") confirm
    v-dialog(v-model="dialog" width="30%")
      v-btn(slot="activator" color="red lighten-2" dark) Upload file
      v-card
        v-card-title.headline.blue(primary-title) Upload file
        v-card-text
          v-progress-linear(
            v-model="progress"
            :active="show"
            :indeterminate="query"
            :query="true"
            color="blue"
          )
          v-flex(
            class="text-xs-center text-sm-center text-md-center text-lg-center"
          )
            v-text-field(
              v-model="imageName"
              label="Select file"
              prepend-icon="attach_file"
              @click="pickFile"
            )
            input(
              ref="file"
              type="file"
              style="display: none"
              accept="*/*"
              @change="onFilePicked"
            )
  v-data-table(
    :headers="headers"
    :items="files"
  )
    template(slot="items" slot-scope="props")
      td
        v-icon.small {{ props.item.type === 'folder' ? 'folder' : 'file_copy' }}
        a(@click="enter(props.item)" href="#") {{ props.item.filename }}
      td {{ props.item.filesize }}
      td {{ props.item.updateTime }}
      td.justify-center.layout.px-0
        v-icon(small @click="editItem(props.item)") edit
        v-icon(small @click="deleteItem(props.item)") delete
    template(slot="no-data")
      v-alert(
        :value="true"
        color="info"
        icon="info"
      ) Sorry, nothing to display here :(
  //- TODO: Upload progress
</template>

<script>
import axios from 'axios'
import http from '../../utils/http'
import filesize from 'filesize'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    rootId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'filename',
        align: 'left',
        value: 'filename'
      },
      { text: 'filesize', value: 'filesize' },
      { text: 'update_time', value: 'updateTime' },
      { text: 'Actions', value: 'name', align: 'center', sortable: false }
    ],
    paths: [],
    files: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    title: 'Image Upload',
    imageName: '',
    imageUrl: '',
    imageFile: '',
    folder: {
      name: '',
      rules: [
        v => v && (/^[\da-z]+$/i.test(v) || 'Invalid character!'),
        v => v && (v.length <= 32 || '32 characters at most')
      ],
      dialog: false
    },
    progress: 0,
    query: false,
    show: false,
    interval: 0
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    now() {
      return this.paths[this.paths.length - 1].id
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    paths(val) {
      this.initialize()
    }
  },

  created() {
    this.paths.push({
      text: 'Root',
      id: this.rootId
    })
  },

  methods: {
    async initialize() {
      const domainId = this.id
      try {
        const res = await http.get(`/domain/${domainId}/folder/${this.now}`)
        let files = []
        res.data.folder.forEach(folder => {
          files.push({
            id: folder._id,
            filename: folder.foldername,
            updateTime: folder.meta.updateAt,
            filesize: 0,
            type: 'folder'
          })
        })
        res.data.file.forEach(file => {
          files.push({
            id: file._id,
            filename: file.filename,
            updateTime: file.meta.updateAt,
            filesize: filesize(file.entity.size),
            tpye: 'file'
          })
        })
        this.files = files
      } catch (error) {
        console.log(error)
      }
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.desserts.splice(index, 1)
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },

    pickFile() {
      this.$refs.file.click()
    },
    uploadInputchange() {
      let file = document.getElementById('uploadFileInput').files[0] // 选择的图片文件
      this.uploadImgToQiniu(file)
    },
    // 上传到七牛
    async uploadImgToQiniu(file) {
      this.query = true
      this.show = true
      this.progress = 0
      const res = await axios.post(`/api/folder/${this.now}/upload`, {
        token: this.$store.state.token
      })
      console.log(res)
      const axiosInstance = axios.create({ withCredentials: false })
      // withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
      let data = new FormData()
      data.append('token', res.data.token)
      data.append('file', file)
      this.query = false
      axiosInstance({
        method: 'POST',
        url: 'http://upload-z2.qiniup.com', //上传地址
        data: data,
        // 超时时间，因为图片上传有可能需要很久
        onUploadProgress: progressEvent => {
          let imgLoadPercent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          this.progress = imgLoadPercent
          if (this.progress == 100) {
            this.show = false
            this.query = true
          }
        }
      })
        .then(res => {
          this.dialog = false
          this.initialize()
        })
        .catch(err => {
          console.log(err)
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
    },
    async newFolder() {
      if (this.$refs.folder.validate()) {
        const domainId = this.id
        const folder = this.folder.name
        try {
          const res = await http.put(`/domain/${domainId}/folder/${this.now}`, {
            folder
          })
          this.initialize()
        } catch (error) {
          console.log(error)
        } finally {
          this.folder.dialog = false
        }
      }
    },
    goto(id) {
      this.paths.forEach((path, index) => {
        if (path.id === id) {
          this.paths.splice(index + 1, this.paths.length)
          return
        }
      })
    },
    enter(val) {
      if (val.type === 'folder') {
        this.paths.push({
          text: val.filename,
          id: val.id
        })
      }
      console.log(val)
    }
  }
}
</script>
