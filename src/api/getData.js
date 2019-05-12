import fetch from '@/config/fetch'

/**
 * 获取签到日期类型列表
 */
export const getDateTypeList = data => fetch('/admin/datetype/getDateTypeList', data, 'POST')

/**
 * 获取签到类型列表
 */
export const getCheckInTypeList = data => fetch('/admin/checkintype/getCheckInTypeList', data, 'POST')

/**
 * 获取签到模板列表
 */
export const getSignonList = data => fetch('/admin/signon/getSignonList', data, 'POST')

/**
 * 新建签到模板
 */
export const addSignon = data => fetch('/admin/signon/addSignon', data, 'POST')

/**
 * 签到模板配置奖励
 */
export const signonBulkAddPrizes = data => fetch('/admin/signon/bulkAddPrizes', data, 'POST')

/**
 * 签到模板删除奖励
 */
export const signonBulkDeletePrizes = data => fetch('/admin/signon/bulkDeletePrizes', data, 'POST')

/**
 * 根据id删除签到模板
 */
export const deleteSignon = data => fetch('/admin/signon/deleteSignon', data, 'POST')

/**
 * 更新签到模板
 */
export const updateSignonById = data => fetch('/admin/signon/updateSignonById', data, 'POST')

/**
 * 批量删除签到活动模板
 */
export const bulkDeleteSignOn = data => fetch('/admin/signon/bulkDeleteSignOn', data, 'POST')

/**
 * 获取场景列表
 */
export const getSceneList = data => fetch('/admin/scene/getSceneList', data, 'POST')

/**
 * 新建签到场景
 */
export const addScene = data => fetch('/admin/scene/addScene', data, 'POST')

/**
 * 新建签到场景
 */
export const updateScene = data => fetch('/admin/scene/updateScene', data, 'POST')

/**
 * 批量删除签到场景
 */
export const bulkDeleteScene = data => fetch('/admin/scene/bulkDeleteScene', data, 'POST')

/**
 * 批量新建场景签到活动数据
 */
export const bulkAddScenesign = data => fetch('/admin/scenesign/bulkAddScenesign', data, 'POST')
/**
 * 批量删除场景签到活动数据
 */

export const bulkDeleteScenesign = data => fetch('/admin/scenesign/bulkDeleteScenesign', data, 'POST')

/**
 * 根据id获取签到场景
 */
export const getSignonById = data => fetch('/admin/signon/getSignonById', data, 'POST')

/**
 * 根据场景id获取签到活动列表
 */
export const getSignonListBySceneId = data => fetch('/admin/signon/getSignonListBySceneId', data, 'POST')

/**
 * 获取奖品列表
 */
export const getPrizeList = data => fetch('/admin/prize/getPrizeList', data, 'POST')

/**
 * 增加奖品
 */
export const addPrize = data => fetch('/admin/prize/addPrize', data, 'POST')

/**
 * 更新奖品
 */
export const updatePrize = data => fetch('/admin/prize/updatePrize', data, 'POST')

/**
 * 删除奖品
 */
export const deletePrize = data => fetch('/admin/prize/deletePrize', data, 'POST')

/**
 * 批量删除奖品
 */
export const bulkDeletePrize = data => fetch('/admin/prize/bulkDeletePrize', data, 'POST')

/**
 * 获取模板日期奖品列表
 */
export const getPrizesBySignonById = data => fetch('/admin/signon/getPrizesBySignonById', data, 'POST')

/**
 * 获取模板日期奖品列表
 */
export const getConsumesBySignonById = data => fetch('/admin/signon/getConsumesBySignonById', data, 'POST')

/**
 * 批量添加补签消耗
 */
export const bulkAddConsumes = data => fetch('/admin/signon/bulkAddConsumes', data, 'POST')

/**
 * 批量删除奖品消耗
 */
export const bulkDeleteConsumes = data => fetch('/admin/signon/bulkDeleteConsumes', data, 'POST')

/**
 * 获取补签形式列表
 */
export const getResignFormList = data => fetch('/admin/resignform/getResignFormList', data, 'POST')

/**
 * 添加可补签日期
 */
export const addResignDate = data => fetch('/admin/resigndate/addResignDate', data, 'POST')

/**
 * 补签日期列表
 */
export const getResignDateList = data => fetch('/admin/resigndate/getResignDateList', data, 'POST')

/**
 * 奖励记录列表
 */
export const getAwardRecordList = data => fetch('/admin/awardrecord/getAwardRecordList', data, 'POST')

/**
 * 奖励记录列表
 */
export const userSignon = data => fetch('/client/signon/userSignon', data, 'POST')

/**
 * 获取签到情况
 */
export const getSelfSignon = data => fetch('/client/signon/getSelfSignon', data, 'POST')

/**
 * 重新签到
 */
export const reSignon = data => fetch('/client/signon/reSignon', data, 'POST')

/** 
*获取平台列表
*/
export const getPlatFormList = data => fetch('/admin/platform/getPlatFormList', data, 'POST')
