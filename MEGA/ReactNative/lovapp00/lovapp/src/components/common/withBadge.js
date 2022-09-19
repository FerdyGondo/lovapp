
import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Badge } from "react-native-elements";

const withBadge = (value, options = {}) => WrappedComponent =>
  class extends React.Component {
    render() {
      const { 
          top = Platform.OS === 'android' ? 0:-5, 
          right = 0, 
          left = 0, 
          bottom = 0, 
          hidden = !value,
           ...badgeProps
         } = options;
      const badgeValue = typeof value === "function" ? value(this.props) : value;
      return (
        <View>
          <WrappedComponent {...this.props} />
          {!hidden && (
            <Badge
              // badgeStyle={styles.badge}
              textStyle={styles.badgeText}
              value={badgeValue}
              status="error"
              // Hidden={screenProps.unreadMessagesCount === 0}
              containerStyle={[styles.badgeContainer, { 
                  top, 
                  right, 
                  left, 
                  bottom 
                }]}
              {...badgeProps}
            />
          )}
        </View>
      );
    }
  };

  // Platform.OS === 'android' ? 
  const styles = StyleSheet.create({
    badge: {
      backgroundColor: 'blue',
      borderRadius: Platform.OS === 'android' ? 9:9,
      minWidth: 0,
      // height: Platform.OS === 'android' ? 30:18, 
      width: Platform.OS === 'android' ? 30:18,  
    },
    badgeContainer: { //size of the round badge
      position: "absolute",
      backgroundColor: 'red',
      height: Platform.OS === 'android' ? 30:20,
      width: Platform.OS === 'android' ? 30:20,
    },
    badgeText: {
      fontSize: Platform.OS === 'android' ? 8:12,
      paddingHorizontal: 0,
      marginLeft: Platform.OS === 'android' ? 3:3
    }
  });

export default withBadge;