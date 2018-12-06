<template lang="pug">
div(color="white")
  v-toolbar(flat color="white")
    v-toolbar-title Resouces
    v-breadcrumbs(
      :items="items"
      divider=">"
    )
    v-spacer
    v-dialog(v-model="dialog" width="30%")
      v-btn(slot="activator" color="red lighten-2" dark) Upload file
      v-card
        v-card-title.headline.blue(primary-title) Add user!
        v-card-text
          v-flex(
            class="text-xs-center text-sm-center text-md-center text-lg-center"
          )
            v-text-field(
              v-model="name"
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
  </v-flex>
  v-data-table(
    :headers="headers"
    :items="desserts"
  )
    template(slot="items" slot-scope="props")
      td {{ props.item.name }}
      td {{ props.item.calories }}
      td {{ props.item.fat }}
      td {{ props.item.carbs }}
      td {{ props.item.protein }}
      td.justify-center.layout.px-0
        v-icon(small @click="editItem(props.item)") edit
        v-icon(small @click="deleteItem(props.item)") delete
    template(slot="no-data")
      v-btn(
        color="primary"
        @click="initialize"
      ) Reset
  //- TODO: Upload progress
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Dessert (100g serving)',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Calories', value: 'calories' },
      { text: 'Fat (g)', value: 'fat' },
      { text: 'Carbs (g)', value: 'carbs' },
      { text: 'Protein (g)', value: 'protein' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    items: [
      {
        text: 'Dashboard',
        disabled: false,
        href: 'breadcrumbs_dashboard'
      },
      {
        text: 'Link 1',
        disabled: false,
        href: 'breadcrumbs_link_1'
      },
      {
        text: 'Link 2',
        disabled: true,
        href: 'breadcrumbs_link_2'
      }
    ],
    desserts: [],
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
    imageFile: ''
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.desserts = [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7
        }
      ]
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
    // 上传图片到七牛
    async uploadImgToQiniu(file) {
      const res = await axios.post('/api/resource/upload', {
        token: this.$store.state.token
      })
      console.log(res)
      const axiosInstance = axios.create({ withCredentials: false })
      // withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
      let data = new FormData()
      data.append('token', res.data.token)
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
