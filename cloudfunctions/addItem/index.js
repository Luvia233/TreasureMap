const cloud = require('wx-server-sdk')
const { getUserWithFamily } = require('../utils/common')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { name, space, container, position, category, photoUrl } = event

  // 输入校验
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { success: false, error: '请输入物品名称' }
  }
  if (name.trim().length > 100) {
    return { success: false, error: '物品名称不能超过100个字符' }
  }
  if (!space || typeof space !== 'string' || space.trim().length === 0) {
    return { success: false, error: '请选择放置空间' }
  }
  if (container && container.length > 100) {
    return { success: false, error: '容器描述不能超过100个字符' }
  }
  if (position && position.length > 100) {
    return { success: false, error: '位置描述不能超过100个字符' }
  }

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    // 使用公共模块获取用户及家庭信息
    const userResult = await getUserWithFamily(db, openid)
    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    const { user, familyId } = userResult

    const itemRes = await db.collection('items').add({
      data: {
        family_id: familyId,
        name: name.trim(),
        space: space.trim(),
        container: container ? container.trim() : '',
        position: position ? position.trim() : '',
        category: category || '',
        photoUrl: photoUrl || '',
        added_by: user.nickname,
        added_by_id: user._id,
        created_at: db.serverDate(),
        updated_at: db.serverDate()
      }
    })

    return {
      success: true,
      data: { itemId: itemRes._id }
    }

  } catch (err) {
    console.error('添加物品云函数错误', err)
    return { success: false, error: err.message || '添加失败' }
  }
}