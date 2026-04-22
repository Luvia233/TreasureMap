const cloud = require('wx-server-sdk')
const { getUserWithFamily } = require('../utils/common')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { itemId } = event

  // 输入校验
  if (!itemId || typeof itemId !== 'string') {
    return { success: false, error: '物品ID无效' }
  }

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    // 使用公共模块获取用户及家庭信息
    const userResult = await getUserWithFamily(db, openid)
    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    await db.collection('items')
      .doc(itemId)
      .remove()

    return { success: true }

  } catch (err) {
    console.error('删除物品云函数错误', err)
    return { success: false, error: err.message || '删除失败' }
  }
}