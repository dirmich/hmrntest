import React, {useCallback, useEffect, useRef, useState} from 'react'

export default (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)
  const refs = useRef({})

  useEffect(() => {
    Object.keys(initialValues).map(k => (refs.current[k] = null))
  }, [])

  const setRef = useCallback(name => el => {
    // console.log(name, el?.focus, values)
    refs.current = {...refs.current, [name]: el}
  })

  const next = useCallback(e => {
    const k = Object.keys(refs.current).filter(c => {
      const v = refs.current[c]
      return v && v.input && v.input._nativeTag === e.currentTarget._nativeTag
    })
    if (k.length === 0) {
      return {el: null, idx: -1, curr: null}
    } else {
      const keys = Object.keys(refs.current)
      const cidx = keys.indexOf(k[0])
      return {
        el: cidx + 1 < keys.length ? keys[cidx + 1] : null,
        idx: cidx + 1,
        curr: keys[cidx],
      }
    }
  })
  const reset = useCallback(field => {
    if (field) setErrors({...errors, [field]: null})
    else setErrors({})
  })

  const onSubmitEnd = useCallback(e => {
    const {el, idx, curr} = next(e)

    // if (curr && validate[curr]) {
    //   if (!validate[curr].fn()) {
    //     setErrors({...errors, [curr]: validate[curr].msg})
    //     return
    //   }
    // }
    if (el && refs.current[el]) {
      refs.current[el].focus && refs.current[el].focus()
      // console.log('setFocus', refs.current[el].focus)
    } else if (idx > 0) {
      //   console.log('I] finished')
      Submit()
    }
  })

  const Submit = useCallback(() => {
    const list = {}
    Object.keys(validate).map(v => {
      // console.log(v)
      if (!validate[v].fn()) list[v] = validate[v].msg
    })
    setErrors(list)
    if (Object.keys(list).length === 0) {
      onSubmit()
    }
  })

  const checkValid = useCallback(() => {
    const list = {}
    Object.keys(validate).map(v => {
      // console.log(v)
      if (!validate[v].fn()) list[v] = validate[v].msg
    })
    return Object.keys(list).length === 0
  })

  const onChange = useCallback(name => e => {
    // console.log('I]', e, values)
    setValues({...values, [name]: e})
  })

  const setVal = (field, data) => {
    setValues({...values, [field]: data})
  }

  // useEffect(() => {
  //   console.log('isValid', isValid)
  // }, [isValid])

  useEffect(() => {
    setIsValid(checkValid())
    // console.log('value changed', values)
  }, [values])

  return {
    values,
    refs,
    errors,
    setRef,
    reset,
    onSubmitEnd,
    onChange,
    isValid,
    setVal,
    Submit,
  }
}
