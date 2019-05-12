<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="mar10 pad10">
        <h3>应用列表</h3>
      </div>
      <div class="mar10">
        <scene-list
          :callBack="callBackHanlder"
          :sceneList="sceneList"
          :isEdit="isEdit"
          ref="sceneListRef"
        ></scene-list>
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
  </div>
</template>

<script>
import { getSceneList } from '@/api/getData'
export default {
  data() {
    return {
      scene: {},
      handleType: 0,
      sceneList: [],
      signonList: [],
      isEdit: true,
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    'scene-list': () => import('@/components/sceneList.vue')
  },
  created() {
    this.platformId = this.$route.query.platformId
    console.log('@platformId: ', this.platformId)
    this.initData(this.pageInfo)
  },
  methods: {
    async initData(params) {
      let res = await getSceneList({ page: this.pageInfo.page, pageSize: this.pageInfo.pageSize, pid: this.platformId })
      if ((res.status === 200)) {
        this.sceneList = res.data.list
        this.pageInfo.total = res.data.total
      }
    },
    async callBackHanlder() {
      this.initData(this.pageInfo)
    },
    async handleSizeChange(data) {
      this.pageInfo.pageSize = data
      this.initData(this.pageInfo)
    },
    async handleCurrentChange(data) {
      this.pageInfo.page = data
      this.initData(this.pageInfo)
    }
  }
}
</script>

<style lang="less">
</style>
