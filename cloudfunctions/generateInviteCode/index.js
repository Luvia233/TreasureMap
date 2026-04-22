const cloud = require('wx-server-sdk')
const { generateInviteCode: generateCode } = require('../utils/inviteCode')
const { getUserWithFamily, generateUniqueInviteCode } = require('../utils/common')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    // 使用公共模块获取用户及家庭信息
    const userResult = await getUserWithFamily(db, openid)
    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    const { user, familyId } = userResult

    if (user.role !== 'owner') {
      return { success: false, error: '只有房主可以生成邀请码' }
    }

    // 使用公共模块生成唯一邀请码
    const codeResult = await generateUniqueInviteCode(db, generateCode, 8, 5)
    if (!codeResult.success) {
      return { success: false, error: codeResult.error }
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await db.collection('invite_codes').add({
      data: {
        family_id: familyId,
        code: codeResult.code,
        max_uses: 5,
        used_count: 0,
        expires_at: expiresAt,
        created_at: db.serverDate()
      }
    })

    return {
      success: true,
      data: {
        inviteCode: codeResult.code,
        expiresAt: expiresAt.toISOString()
      }
    }

  } catch (err) {
    console.error('生成邀请码云函数错误', err)
    return { success: false, error: err.message || '生成失败' }
  }
}