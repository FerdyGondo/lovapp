import React from 'react';
import {View, ActivityIndicator} from 'react-native';

interface Props {
  size:number;
}

// const Spinner = ({ size } : Props) => {
const Spinner: React.FC<Props> = ({size}) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator
        animating={true}
        size={size || 'large'}
        color={'#333'}
      />
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
    marginLeft: 5,
    marginRight: 5,
    height: 42,
  },
};
export {Spinner};
