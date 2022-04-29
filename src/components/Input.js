import React, {useState} from 'react'
import {StyleSheet, Text, View, TextInput} from 'react-native'
import {Icon, Input} from 'react-native-elements'
import {TextInputMask} from 'react-native-masked-text'

export default ({title, use, inputs, secret, format, ...props}) => {
  const [showPassword, setShowPassword] = useState(false)
  const toggle = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      {/* {inputs?.values[use]?.length > 0 ? (
        <Text style={{paddingLeft: 10, fontSize: 10, color: 'red'}}>{title}</Text>
      ) : null} */}
      {secret ? (
        <View style={{height: 0}}>
          <TextInput placeholder={'foo'} style={{height: 1}} placeholderTextColor="transparent" />
        </View>
      ) : null}
      {format ? (
        <View style={{borderColor: '#cccccc', borderBottomWidth: 1, marginHorizontal: 10, paddingBottom: 8}}>
          <TextInputMask
            style={{...styles.formInput}}
            inputContainerStyle={{borderColor: '#cccccc'}}
            // underlineColorAndroid="#cccccc"
            type={'datetime'}
            placeholderTextColor="#cccccc"
            placeholder={title}
            options={{format}}
            refInput={inputs.setRef(use)}
            onSubmitEditing={inputs.onSubmitEnd}
            value={inputs.values[use]}
            onChangeText={inputs.onChange(use)}
            onFocus={() => inputs.reset(use)}
            secureTextEntry={secret ? !showPassword : false}
            errorMessage={inputs.errors[use] ? inputs.errors[use] : null}
          />
          {inputs.errors[use] ? <Text>{inputs.errors[use]}</Text> : null}
        </View>
      ) : (
        <Input
          style={{...styles.formInput}}
          inputContainerStyle={{borderColor: 'transparent'}}
          placeholderTextColor="#cccccc"
          placeholder={title}
          ref={inputs.setRef(use)}
          onSubmitEditing={inputs.onSubmitEnd}
          value={inputs.values[use]}
          onChangeText={inputs.onChange(use)}
          onFocus={() => inputs.reset(use)}
          secureTextEntry={secret ? !showPassword : false}
          errorStyle={{height: inputs.errors[use] ?? 0}}
          errorMessage={inputs.errors[use] ? inputs.errors[use] : null}
          rightIcon={
            secret ? (
              <Icon
                type="material"
                name={showPassword ? 'visibility' : 'visibility-off'}
                color={showPassword ? 'black' : 'grey'}
                onPress={toggle}
              />
            ) : null
          }
          {...props}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  formInput: {
    flex: 1,
    padding: 0,
    fontSize: 15,
    textDecorationLine: 'none',
  },
})
