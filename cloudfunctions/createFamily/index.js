const cloud = require('wx-server-sdk')
const { generateInviteCode: generateCode } = require('../utils/inviteCode')
const { generateUniqueInviteCode } = require('../utils/common')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { familyName, nickname } = event

  // 输入校验
  if (!familyName || typeof familyName !== 'string' || familyName.trim().length === 0) {
    return { success: false, error: '请输入家庭名称' }
  }
  if (familyName.trim().length > 50) {
    return { success: false, error: '家庭名称不能超过50个字符' }
  }
  if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
    return { success: false, error: '请输入昵称' }
  }
  if (nickname.trim().length > 30) {
    return { success: false, error: '昵称不能超过30个字符' }
  }

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    const familyRes = await db.collection('families').add({
      data: {
        name: familyName.trim(),
        owner_openid: openid,
        created_at: db.serverDate()
      }
    })

    const familyId = familyRes._id

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

    await db.collection('users').add({
      data: {
        openid: openid,
        nickname: nickname.trim(),
        family_id: familyId,
        role: 'owner',
        created_at: db.serverDate()
      }
    })

    const userRes = await db.collection('users')
      .where({ openid: openid })
      .limit(1)
      .get()

    const userId = userRes.data[0]._id

    return {
      success: true,
      data: { familyId, userId, inviteCode: codeResult.code }
    }

  } catch (err) {
    console.error('创建家庭云函数错误', err)
    return { success: false, error: err.message || '创建失败' }
  }
}