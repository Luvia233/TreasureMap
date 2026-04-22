const cloud = require('wx-server-sdk')
const { checkUserExists, verifyInviteCode } = require('../utils/common')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { inviteCode, nickname } = event

  // 输入校验
  if (!inviteCode || typeof inviteCode !== 'string') {
    return { success: false, error: '请提供邀请码' }
  }
  if (!nickname || typeof nickname !== 'string' || nickname.trim().length === 0) {
    return { success: false, error: '请输入昵称' }
  }
  if (nickname.trim().length > 30) {
    return { success: false, error: '昵称不能超过30个字符' }
  }

  const db = cloud.database()
  const openid = wxContext.openid

  try {
    // 1. 检查用户是否已存在（防止重复加入）
    const { exists } = await checkUserExists(db, openid)
    if (exists) {
      return { success: false, error: '您已经加入过家庭了' }
    }

    // 2. 验证邀请码
    const codeResult = await verifyInviteCode(db, inviteCode)
    if (!codeResult.success) {
      return { success: false, error: codeResult.error }
    }

    const { codeRecord, familyId } = codeResult

    // 3. 创建用户
    const userRes = await db.collection('users').add({
      data: {
        openid: openid,
        nickname: nickname.trim(),
        family_id: familyId,
        role: 'member',
        created_at: db.serverDate()
      }
    })

    // 4. 更新邀请码使用次数（带条件检查防止超限）
    const updateResult = await db.collection('invite_codes')
      .doc(codeRecord._id)
      .update({
        data: {
          used_count: db.command.inc(1)
        }
      })

    // 检查更新是否成功（affected = 0 表示条件不满足）
    if (updateResult.stats.updated === 0) {
      // 回滚：删除刚创建的用户
      await db.collection('users').doc(userRes._id).remove()
      return { success: false, error: '邀请码已达到使用上限' }
    }

    return {
      success: true,
      data: { familyId, userId: userRes._id }
    }

  } catch (err) {
    console.error('加入家庭云函数错误', err)
    return { success: false, error: err.message || '加入失败' }
  }
}