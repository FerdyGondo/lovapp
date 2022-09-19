/* eslint-disable prettier/prettier */
import React from 'react';
import { TextInput, View, Text } from 'react-native';

// const LoginRegInput = ({ value, onChangeText, onSubmitEditing, placeholder, secureTextEntry }) => {
const LoginRegInput:React.FC = ({ value, onChangeText, onSubmitEditing, placeholder, secureTextEntry }) => {
  const { inputStyle, containerStyle } = styles;
  // const onChangeProp = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log('event',event);
  // }
  return (
    <View style={containerStyle}>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
		    placeholderTextColor = '#807F83'
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize= 'none'
        underlineColorAndroid='transparent'
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    flex: 1,
    color: '#C6C3CC',
    // paddingTop: 5,
    paddingRight: 15,
    paddingLeft: 15,
    fontSize: 14,
    lineHeight: 16,
  },
  /*
  labelStyle: {
	color: '#807F83',
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  */
  containerStyle: {
    height: 35,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
	  backgroundColor: '#191C21',
	  borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
  }
};

export { LoginRegInput };
