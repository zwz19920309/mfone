<template>
  <div class="fillcontain">
    <div class="mar10">
      <div class="pad10">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="模板名称">
            <el-input placeholder="请填写模板名称" v-model="params.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10">
        <span>签到类型：</span>
        <checkin-type-list :callBack="getCheckinType"></checkin-type-list>
      </div>
      <div class="pad10">
        <span>签到时间：</span>
        <date-type-list :type="checkinTypeVal" :callBack="getDateType"></date-type-list>
      </div>
      <div class="pad10" v-if="dateTypeVal === deteMethods.USERDEFINED">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="自定义时间段:">
            <el-input placeholder="请填写时间" v-model="params.number"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10" v-show="checkinTypeVal === 2">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="支持补签:">
            <el-select v-model="resign.isResign" placeholder="请选择">
              <el-option
                v-for="item in supports"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10" v-show="checkinTypeVal === 2 && resign.isResign === 2">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="补签形式:">
            <el-select v-model="resign.formId" placeholder="请选择">
              <el-option
                v-for="item in resignFormList"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10" v-show="checkinTypeVal === 2 && resign.isResign === 2">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="补签消耗:">
            <el-select v-model="resign.cost" placeholder="请选择">
              <el-option
                v-for="item in consts"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10" v-show="(checkinTypeVal === 2 && resign.isResign === 2)">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="可补签日期: ">
            <textarea
              rows="10"
              v-model="calendarObj.display"
              cols="40"
              @click="openMultiByDrop($event)"
            ></textarea>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="模板规则描述">
            <el-input
              type="textarea"
              :rows="8"
              style="width: 450px;"
              placeholder="请填写描述"
              v-model="params.desc"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10">
        <el-button type="primary" @click="submit">确认提交</el-button>
      </div>
    </div>
    <transition name="fade">
      <div class="calendar-dropdown" v-if="calendarObj.show">
        <calendar
          :zero="calendarObj.zero"
          :lunar="calendarObj.lunar"
          :value="calendarObj.value"
          :multi="calendarObj.multi"
          @select="calendarObj.select"
        ></calendar>
      </div>
    </transition>
  </div>
</template>

<script>
import calendar from '@/components/common/calendar/calendar.vue'
import { DATETYPE } from '@/common/common'
import { addSignon, getResignFormList, getResignDateList } from '@/api/getData'
export default {
  data() {
    return {
      arr: [],
      isEdit: true,
      dateList: [],
      deteMethods: {},
      dateTypeVal: 0,
      checkinTypeVal: 0,
      supports: [{ type: 1, name: '否' }, { type: 2, name: '是' }],
      consts: [{ type: 1, name: '无偿补签' }, { type: 2, name: '有偿补签' }],
      params: { name: '', desc: '', number: 0 },
      resign: { isResign: 1, formId: '', cost: '' },
      resignFormList: [],
      calendarObj: {
        display: '',
        multi: true,
        show: false,
        zero: true,
        value: [], // 默认日期
        lunar: true, // 显示农历
        select: value => {
          let displayValue = []
          let newResignData = []
          value.forEach(v => {
            let date =
              v[0] +
              '-' +
              (v[1] >= 10 ? v[1] : '0' + v[1]) +
              '-' +
              (v[2] >= 10 ? v[2] : '0' + v[2])
            displayValue.push(date)
            newResignData.push(date)
          })
          this.calendarObj.value = value
          this.resignDateList = newResignData
          this.calendarObj.display = displayValue.join(',')
        }
      }
    }
  },
  components: {
    calendar,
    'date-type-list': () => import('@/components/dateTypeList.vue'),
    'checkin-type-list': () => import('@/components/checkinTypeList.vue')
  },
  created() {
    this.deteMethods = DATETYPE
    this.initData()
  },
  methods: {
    async initData() {
      let res = await getResignFormList()
      if (res.status === 200) {
        this.resignFormList = res.data.list
      }
      let dateRes = await getResignDateList()
      if (dateRes.status === 200) {
        let datas = dateRes.data.list
        let arr = []
        datas.forEach(ele => {
          let dates = ele.split('-')
          arr.push([
            parseInt(dates[0]),
            parseInt(dates[1]),
            parseInt(dates[2])
          ])
        })
        this.arr = arr
        this.calendarObj.select(arr)
      }
    },
    getDateType(data) {
      this.params.dateType = this.dateTypeVal = data.type
    },
    getCheckinType(data) {
      this.params.checkinType = this.checkinTypeVal = data.type
    },
    openMultiByDrop(e) {
      this.calendarObj.show = true
      e.stopPropagation()
      window.setTimeout(() => {
        document.addEventListener(
          'click',
          e => {
            this.calendarObj.show = false
            document.removeEventListener('click', () => { }, false)
          },
          false
        )
      }, 1000)
    },
    async submit() {
      if (!this.params.name || !this.params.dateType || !this.params.checkinType || !this.params.desc) {
        this.$message({ message: '请补充信息', type: 'warning' })
        return
      }
      if (this.dateTypeVal === this.deteMethods.USERDEFINED) {
        if (this.params.number === 0) {
          this.$message({ message: '自定义周期不能为0', type: 'warning' })
          return
        }
      }
      this.params.isResign = this.resign.isResign
      this.params.formId = this.resign.formId
      this.params.cost = this.resign.cost
      this.params.pid = 1
      if (this.resign.cost === 2) {
        this.params.resignDates = this.resignDateList
      }
      let res = await addSignon(this.params)
      if (res.status === 200) {
        this.$message({ message: '操作成功', type: 'success' })
      }
    }
  }
}
</script>

<style lang="less">
.price-box {
  border: 1px solid #eee;
  border-radius: 3px;
  max-width: 400px;
  min-width: 100px;
  min-height: 100px;
  max-height: 200px;
  width: 200px;
  height: 100px;
  margin-left: 80px;
}
.price_num {
  padding: 0 5px;
  font-size: 11px;
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}
/*demo*/
.flex {
  box-sizing: border-box;

  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: start;

  display: -webkit-flex;
  -webkit-justify-content: space-between;
  -webkit-align-items: top;

  display: flex;
  justify-content: space-between;
  align-items: top;
  flex-flow: row wrap;
}
.flex > div {
  margin: 10px;
  padding: 20px;
  width: 25%;
  min-width: 300px;
  border: 1px solid #eee;
  border-radius: 2px;
  position: relative;
}
.flex > div > span {
  position: absolute;
  left: 0px;
  top: 0px;
  padding: 2px 10px;
  font-size: 10px;
  border-radius: 0 0 2px 0;
  background: #ea6151;
  color: #fff;
}
.flex > div > input {
  box-sizing: border-box;
  width: 100%;
  margin-top: 20px;
  border-radius: 2px;
  border: 1px solid #dedede;
  padding: 10px;
  font-size: 16px;
  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==)
    no-repeat 8px 10px;
  padding-left: 36px;
  color: #666;
}

/*transition*/
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}

/*下拉框*/
.calendar-dropdown {
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 2px;
  margin-left: -250px;
  margin-top: -300px;
}
.calendar-dropdown:before {
  position: absolute;
  left: 30px;
  top: -10px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #dedede;
}
.calendar-dropdown:after {
  position: absolute;
  left: 30px;
  top: -9px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #fff;
}

/*弹出框*/
.calendar-dialog {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.calendar-dialog-mask {
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
}

.calendar-dialog-body {
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 2px;
}
</style>
