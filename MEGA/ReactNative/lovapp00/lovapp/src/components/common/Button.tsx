import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  // children:'no need if use React.FC'; 
}

// const Button = ({ onPress, children }:ButtonProps ) => {
const Button: React.FC<ButtonProps> = ({ onPress, children }) => {
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
    color: '#807F83',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    //paddingBottom: 10,
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
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
export { Button };
