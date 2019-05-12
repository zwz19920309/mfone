<template>
  <div>
    <el-table
      border
      :data="prizeList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="isEdit"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="note" label="描述" width="250"></el-table-column>
      <el-table-column class="header" label="图片icon" width="150">
        <template slot-scope="scope">
          <img class="g-icon" :src="scope.row.icon">
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
    <div class="pad10 t-right" v-if="isEdit">
      <el-button
        v-for="(item, key) in cDynamic.bluckActionbutton"
        :key="key"
        :type="item.type"
        :size="item.size"
        @click="func(item.action, prizes)"
      >{{ item.label }}</el-button>
    </div>
    <div class="pad10">
      <edit-prize-dialog ref="editPrizeRef" :callBack="editPrize" :prize="prize"></edit-prize-dialog>
    </div>
    <div class="pad10">
      <edit-prize-dialog ref="newPrizeRef" :callBack="addPrize" :prize="newPrize"></edit-prize-dialog>
    </div>
  </div>
</template>

<script>
import { bulkDeletePrize, addPrize, updatePrize } from '@/api/getData'
export default {
  components: {
    'edit-prize-dialog': () => import('@/components/editPrizeDialog.vue')
  },
  data() {
    let that = this
    return {
      cPid: '',
      prize: { name: '', note: '' },
      newPrize: { name: '', note: '' },
      prizes: [],
      cDynamic: this.dynamic || {
        actionbutton: [
          { label: '编辑', type: 'primary', size: 'mini', action: async function (row) { that.handleEdit(row) } },
          { label: '删除', type: 'danger', size: 'mini', action: async function (row) { await that.handleDelete(row) } }
        ],
        bluckActionbutton: [
          { label: '新建奖品', type: 'primary', size: 'mini', action: async function () { that.handleCreate() } },
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
    async handleEdit(data) {
      this.prize = Object.assign({}, data)
      this.$refs.editPrizeRef.open()
    },
    async handleCreate(data) {
      this.$refs.newPrizeRef.open()
    },
    async editPrize(data) {
      if (!data.id || !data.name || !data.note) {
        this.$message({ message: '请完善信息', type: 'warning' })
        return
      }
      let fileData = new FormData()
      fileData.append('id', data.id)
      fileData.append('name', data.name)
      fileData.append('note', data.note)
      data.icon ? (fileData.append('icon', data.icon)) : ''
      let res = await updatePrize(fileData)
      if (res.status === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.editIcon = true
        this.$refs.editPrizeRef.close()
        this.callBack && this.callBack()
      }
    },
    async addPrize(data) {
      if (!data.name || !data.note || !data.icon) {
        this.$message({ message: '请完善信息', type: 'warning' })
        return
      }
      console.log('@this.cPid: ', this.cPid)
      console.log('@data: ', data)
      let fileData = new FormData();
      fileData.append('pid', this.cPid);
      fileData.append('name', data.name);
      fileData.append('note', data.note);
      data.icon ? (fileData.append('icon', data.icon)) : ''
      let res = await addPrize(fileData)
      if (res.status === 200) {
        this.$message({ message: '添加成功', type: 'success' })
        this.$refs.newPrizeRef.close()
        this.callBack && this.callBack()
      }
    },
    async handleDelete(row) {
      this.$confirm('确认删除该选项?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async () => {
        let res = await bulkDeletePrize({ ids: [row.id] })
        if (res.status === 200) {
          this.$message({ message: '删除成功', type: 'success' })
          this.callBack && this.callBack()
        }
      })
    },
    async handleSelectionChange(data) {
      this.prizes = data
    },
    async handleBluckEdit() {
      if (this.prizes.length < 1) {
        this.$message({ message: '请选择要删除的选项', type: 'warning' })
        return
      }
      let ids = []
      this.prizes.forEach(ele => {
        ids.push(ele.id)
      })
      let res = await bulkDeletePrize({ ids: ids })
      if (res.status === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.callBack && this.callBack()
      }
    }
  },
  props: ['prizeList', 'isEdit', 'callBack', 'dynamic', 'total', 'pid'], // isEdit false: 只显示：true: 可操作, 'dynamic': 外部传入操作按钮详情以及回调函数
  watch: {
    'dynamic': function (newVal, oldVal) {
      this.cDynamic = newVal
    },
    'pid': function (newVal, oldVal) {
      console.log('cPid: 1312312312312', this.cPid)
      this.cPid = newVal
      console.log('cPid: ', this.cPid)
    },
  }
}
</script>

<style lang="less">
.g-icon {
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
  margin: 5px 0 3px 0;
}
</style>
