<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%;"
          theme="dark"
          router
          @select="goToPath"
        >
          <el-menu-item index="manage">
            <i class="el-icon-menu"></i>首页
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>平台</span>
            </template>
            <el-submenu v-for="menu in menus" :key="menu.index" index="menu.index">
              <template slot="title">{{menu.name}}</template>
              <el-menu-item
                v-for="submenu in menu.submenus"
                :key="submenu.index"
                :index="submenu.path"
              >{{submenu.name}}</el-menu-item>
              <!-- <el-menu-item index="sceneList">应用</el-menu-item>
              <el-menu-item index="signonList">模板</el-menu-item>
              <el-menu-item index="awardList">奖品</el-menu-item>-->
            </el-submenu>
          </el-submenu>
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-plus"></i>设置
            </template>
            <el-menu-item index="settings">
              <i class="el-icon-edit"></i>补签设置
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-plus"></i>场景管理
            </template>
            <el-menu-item index="sceneList">
              <i class="el-icon-tickets"></i>场景列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-plus"></i>签到活动模板管理
            </template>
            <el-menu-item index="signonList">
              <i class="el-icon-tickets"></i>模板活动列表
            </el-menu-item>
            <el-menu-item index="buildSignon">
              <i class="el-icon-edit"></i>新建活动模板
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-plus"></i>奖品管理
            </template>
            <el-menu-item index="awardList">
              <i class="el-icon-tickets"></i>奖品列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-plus"></i>奖励管理
            </template>
            <el-menu-item index="awardRecordList">
              <i class="el-icon-tickets"></i>奖励记录
            </el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <!-- <keep-alive> -->
        <router-view></router-view>
        <!-- </keep-alive> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPlatFormList } from '@/api/getData'
export default {
  data() {
    return {
      menus: [
        // {
        //   name: '金十', index: '1', submenus:
        //     [{ index: 1, path: 'sceneList?id=1', name: '应用' }, { index: 2, path: 'signonList?id=1', name: '模板' }, { index: 3, path: 'awardList?id=1', name: '奖品' }]
        // },
        // {
        //   name: '百度小程序', index: '2', submenus:
        //     [{ index: 1, path: 'sceneList?id=2', name: '应用' }, { index: 2, path: 'signonList?id=2', name: '模板' }, { index: 3, path: 'awardList?id=2', name: '奖品' }]
        // }
      ]
    }
  },
  computed: {
    defaultActive: function () {
      return this.$route.path.replace('/', '')
    }
  },
  created() {
    this.initData(this.pageInfo)
  },
  methods: {
    async initData(params) {
      let res = await getPlatFormList({})
      if (res.status === 200) {
        this.menus = res.data.list
        console.log()
      }
    },
    async goToPath(params) {
      console.log('@click: goPath,', params)
      this.$router.push({ path: params })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../style/mixin";
</style>
