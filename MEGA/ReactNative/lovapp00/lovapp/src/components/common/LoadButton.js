/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const LoadButton = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    //alignItems: 'center',
    color: '#fff',
    //fontSize: 16,
    fontWeight: '400',
    paddingTop: 12,
    //lineHeight: 44,
    //paddingBottom: 10,
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#CBC9CF',
    borderRadius: 6,
    marginLeft: 5,
    marginRight: 5,
    height: 44
  }
};

/*
const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    //alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 5,
    marginRight: 5
  }
};
*/
export { LoadButton };
