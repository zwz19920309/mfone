<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="mar10 pad10">
        <h3>奖品管理</h3>
      </div>
      <div class="mar10">
        <prize-list
          :pid="platformId"
          :isEdit="isEdit"
          :callBack="initData"
          :prizeList="prizeList"
          ref="prizeListRef"
        ></prize-list>
      </div>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageInfo.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageInfo.pageSize"
          layout="sizes, prev, pager, next, total"
          :total="pageInfo.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrizeList } from '@/api/getData'
export default {
  data() {
    return {
      isEdit: true,
      prizeList: [],
      platformId: '',
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    'prize-list': () => import('@/components/prizeList.vue')
  },
  created() {
    this.platformId = this.$route.query.platformId
    console.log('@123123123123platformId: ', this.platformId)
    this.initData(this.pageInfo)
  },
  methods: {
    async initData(params) {
      let res = await getPrizeList({ page: this.pageInfo.page, pageSize: this.pageInfo.pageSize, pid: this.platformId })
      if (res.status === 200) {
        this.prizeList = res.data.list
        this.pageInfo.total = res.data.total
      }
    },
    async handleSizeChange(data) {
      this.pageInfo.pageSize = data
      await this.initData(this.pageInfo)
    },
    async handleCurrentChange(data) {
      this.pageInfo.page = data
      await this.initData(this.pageInfo)
    }
  }
}
</script>

<style lang="less">
</style>
