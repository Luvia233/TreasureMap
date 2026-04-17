const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { code } = event

  try {
    const openid = wxContext.openid

    const db = cloud.database()
    const users = await db.collection('users')
      .where({ openid: openid })
      .limit(1)
      .get()

    let userInfo
    let userId
    let familyId

    if (users.data.length > 0) {
      const user = users.data[0]
      userId = user._id
      familyId = user.family_id
      userInfo = {
        nickname: user.nickname,
        avatar: user.avatar
      }
    } else {
      userInfo = { nickname: '新用户', avatar: '' }
    }

    return {
      success: true,
      data: { userId, userInfo, familyId }
    }

  } catch (err) {
    console.error('登录云函数错误', err)
    return { success: false, error: err.message || '登录失败' }
  }
}
