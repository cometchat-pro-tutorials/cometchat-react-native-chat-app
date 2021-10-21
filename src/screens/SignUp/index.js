import React from 'react';
import {View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {styles} from '../../styles';

export default function SignUp() {
  const [data, setData] = React.useState({
    name: '',
    uid: '',
    email: '',
  });

  const handleSignUp = async () => {};

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Input
          placeholder="username"
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={value => setData({...data, uid: value})}
        />
        <Input
          placeholder="name"
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={value => setData({...data, name: value})}
        />

        <Input
          placeholder="email"
          leftIcon={{type: 'font-awesome', name: 'envelope'}}
          onChangeText={value => setData({...data, email: value})}
        />

        <Button title="Sign Up" loading={false} onPress={handleSignUp} />
      </View>
    </View>
  );
}
