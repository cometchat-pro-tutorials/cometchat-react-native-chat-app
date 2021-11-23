import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 3,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 5,
    marginBottom: 10,
  },
  subTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
  },
  content: {
    color: '#000',
    fontSize: 14,
    padding: 5,
  },
  mt10: {
    marginTop: 10,
  },
  mr10: {
    marginRight: 10,
  },
  ml10: {
    marginLeft: 10,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  headerContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
