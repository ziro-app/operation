import React from 'react'
import ToastNotification from '@bit/vitorbarbosa19.ziro.toast-notification'
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import { successColor, warningColor, alertColor } from '@ziro/theme'
import { labelStyle, toastStyle } from './styles'

export default ({ openToastRoot, setOpenToastRoot, messageToastRoot, type }) => {
  return (
    <ToastNotification isOpen={openToastRoot} setIsOpen={setOpenToastRoot} boxStyle={toastStyle}>
      <Icon
        type={type === 'alert' ? 'alert' : type === 'warning' ? 'warning' : 'success'}
        color={type === 'alert' ? alertColor : type === 'warning' ? warningColor : successColor}
      />
      <label style={labelStyle}>{messageToastRoot}</label>
    </ToastNotification>
  )
}
