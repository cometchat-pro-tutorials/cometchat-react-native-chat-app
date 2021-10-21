import React from 'react';
import {View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {styles} from '../../styles';

export default function Login({navigation}) {
  const [uid, setUsername] = React.useState('');

  const handleSignIn = async () => {};

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Input
          placeholder="username"
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={value => setUsername(value)}
        />

        <Button title="Sign In" loading={false} onPress={handleSignIn} />
        <Button
          title="Sign Up"
          type="outline"
          style={styles.mt10}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
