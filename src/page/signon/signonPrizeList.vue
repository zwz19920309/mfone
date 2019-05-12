<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="mar10 pad10">
        <h3>奖品管理</h3>
      </div>
      <div class="mar10">
        <el-table border :data="prizeList" stripe style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.prize.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <span>{{scope.row.prize.note}}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <span>{{scope.row.prize_num}}</span>
            </template>
          </el-table-column>
          <el-table-column class="header" label="图片icon" width="150">
            <template slot-scope="scope">
              <img class="g-icon" :src="scope.row.prize.icon">
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="DeletePrizes(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrizeList, getPrizesBySignonById, signonBulkDeletePrizes } from '@/api/getData'
export default {
  data() {
    return {
      signonId: 0,
      number: 0,
      prizeList: []
    }
  },
  components: {
    'prize-list': () => import('@/components/prizeList.vue')
  },
  created() {
    this.signonId = this.$route.query.signonId
    this.number = this.$route.query.number
    this.initData({ id: this.signonId, number: this.number })
  },
  methods: {
    async initData(params) {
      let res = await getPrizesBySignonById(params)
      if (res.status === 200) {
        this.prizeList = res.data.list
      }
    },
    async DeletePrizes(index, row) {
      console.log('row: ', row)
      let res = await signonBulkDeletePrizes({ id: this.signonId, number: this.number, prizeIds: [row.prize.id] })
      if (res.status === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.initData({ id: this.signonId, number: this.number })
      }
    }
  }
}
</script>

<style lang="less">
</style>
