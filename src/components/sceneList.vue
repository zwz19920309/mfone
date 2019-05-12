<template>
  <div>
    <el-table
      border
      :data="cSceneList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="isEdit"></el-table-column>
      <el-table-column prop="id" label="应用id" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="note" label="描述"></el-table-column>
      <el-table-column prop="app_id" label="应用appid" width="180"></el-table-column>
      <el-table-column prop="app_secret" label="应用appsecret" width="180"></el-table-column>
      <!-- <el-table-column prop="start_at" :formatter="dateFormat" label="开始时间"></el-table-column>
      <el-table-column prop="end_at" :formatter="dateFormat" label="结束时间"></el-table-column>-->
      <el-table-column label="详情">
        <template slot-scope="scope">
          <span class="detail" @click="toSceneSignonList(scope.$index, scope.row)">签到活动列表</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="操作" width="180" v-if="isEdit">
        <template slot-scope="scope">
          <el-button
            v-for="(item, key) in cDynamic.actionbutton"
            :key="key"
            :type="item.type"
            :size="item.size"
            @click="func(item.action, scope.row)"
          >{{ item.label }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mar10 pad10 t-right" v-if="isEdit">
      <el-button
        v-for="(item, key) in cDynamic.bluckActionbutton"
        :key="key"
        :type="item.type"
        :size="item.size"
        @click="func(item.action, scenes)"
      >{{ item.label }}</el-button>
    </div>
    <div class="pad10">
      <edit-scene-dialog :callBack="handleScene" :scene="scene" ref="editScene"></edit-scene-dialog>
    </div>
    <div class="pad10">
      <edit-scene-dialog :callBack="addNewScene" :scene="newScene" ref="newScene"></edit-scene-dialog>
    </div>
  </div>
</template>

<script>
import { bulkDeleteScene, updateScene, addScene } from '@/api/getData'
export default {
  components: {
    'edit-scene-dialog': () => import('@/components/editSceneDialog.vue')
  },
  data() {
    let that = this
    return {
      newScene: { name: '', note: '', start_at: '', end_at: '' },
      scene: {},
      scenes: {},
      editType: 1,
      cSceneList: this.sceneList || [],
      cDynamic: this.dynamic || {
        actionbutton: [
          { label: '编辑', type: 'primary', size: 'mini', action: async function (row) { that.editAction(row) } },
          { label: '删除', type: 'danger', size: 'mini', action: async function (row) { await that.handleDelete(row) } }
        ],
        bluckActionbutton: [
          { label: '新建应用', type: 'primary', size: 'mini', action: async function () { that.newAction() } },
          { label: '批量删除', type: 'danger', size: 'mini', action: async function () { await that.handleBluckEdit() } }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    async func(func, data) {
      func && func(data)
    },
    async handleScene(data) {
      if (!data.name || !data.note) {
        this.$message({ message: '请完善信息', type: 'warning' })
        return
      }
      let res = await updateScene({ name: data.name, note: data.note, id: data.id })
      if (res.status === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.$refs.editScene.close()
        this.callBack && this.callBack()
      }
    },
    async addNewScene(data) {
      console.log('@data: ', data)
      if (!data.name || !data.note) {
        this.$message({ message: '请完善信息', type: 'warning' })
        return
      }
      let res = await addScene({ name: data.name, note: data.note, pid: 1 })
      if (res.status === 200) {
        this.$message({ message: '添加成功', type: 'success' })
        this.$refs.newScene.close()
        this.callBack && this.callBack()
      }
    },
    async newAction(row) { // 新建
      this.$refs.newScene.open()
    },
    async editAction(row) { // 编辑
      this.scene = Object.assign({}, row)
      this.$refs.editScene.open()
    },
    async handleDelete(row) {
      this.$confirm('确认删除该选项?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async () => {
        let res = await bulkDeleteScene({ ids: [row.id] })
        if (res.status === 200) {
          this.$message({ message: '删除成功', type: 'success' })
          this.callBack && this.callBack()
        }
      })
    },
    async handleSelectionChange(data) {
      this.scenes = data
    },
    async handleBluckEdit() {
      if (this.scenes.length < 1) {
        this.$message({ message: '请选择要删除的选项', type: 'warning' })
        return
      }
      let ids = []
      this.scenes.forEach(ele => {
        ids.push(ele.id)
      })
      let res = await bulkDeleteScene({ 'ids': ids })
      if (res.status === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.callBack && this.callBack()
      }
    },
    dateFormat(row, column) {
      let date = new Date(row[column.property])
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    },
    toSceneSignonList(index, row) {
      this.$router.push({ path: '/scenesignon', query: { id: row.id } })
    }
  },
  props: ['sceneList', 'isEdit', 'callBack', 'dynamic'], // isEdit false: 只显示：true: 可操作, 'dynamic': 外部传入操作按钮详情以及回调函数
  watch: {
    'dynamic': function (newVal, oldVal) {
      this.cDynamic = newVal
    },
    'sceneList': function (newVal, oldVal) {
      this.cSceneList = newVal
    }
  }
}
</script>
<style lang="less">
.detail {
  padding: 0 5px;
  text-decoration: underline;
  color: #409eff;
  cursor: pointer;
}
</style>
