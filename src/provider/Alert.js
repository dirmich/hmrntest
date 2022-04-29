import React, {useEffect, useState} from 'react'
import Alert from '../common/Alert'
import Context, {initialState} from '../context/Alert'

export default ({children, ...props}) => {
  const alert = (title, body, back = false) => {
    let ret
    let retval
    setState(prev => {
      ret = new Promise((resolve, reject) => {
        retval = {resolve, reject}
      })
      return {
        ...prev,
        isAlert: true,
        title: body ? title : null,
        body: body ? body : title,
        back,
        show: true,
        _stack: [...prev._stack, retval],
      }
    })
    return ret
  }

  const confirm = (title, body) => {
    let ret
    let retval
    setState(prev => {
      ret = new Promise((resolve, reject) => {
        retval = {resolve, reject}
      })
      return {
        ...prev,
        isAlert: false,
        title: body ? title : null,
        body: body ? body : title,
        show: true,
        _stack: [...prev._stack, retval],
      }
    })
    return ret
  }

  const onOK = () => {
    const retval = state._stack?.pop()
    setState({...state, show: false, _stack: [...state._stack]})
    return retval.resolve()
  }
  const onCancel = () => {
    const retval = state._stack?.pop()
    setState({...state, show: false, _stack: [...state._stack]})
    return retval.reject()
  }

  const initData = {...initialState, alert, confirm}
  const [state, setState] = useState(initData)

  return (
    <Context.Provider value={state}>
      {children}
      <Alert
        isVisible={state.show}
        title={state.title}
        body={state.body}
        renderLeftBtn={state.isAlert ? false : true}
        leftBtnText="확인"
        leftBtnPress={() => (state.isAlert ? {} : onOK())}
        btnText={state.isAlert ? '확인' : '취소'}
        btnPress={() => (state.isAlert ? onOK() : onCancel())}
        {...props}
      />
    </Context.Provider>
  )
}
