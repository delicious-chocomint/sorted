import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableNativeFeedback,
  Text,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useCavy } from 'cavy';
import { useFonts, Raleway_600SemiBold } from '@expo-google-fonts/raleway'; //eslint-disable-line
import { Context as DiaryContext } from '../../config/DiaryContext';
import { withFirebaseHOC } from '../../config/Firebase';

const DiaryScreen = ({ navigation, firebase }) => {
  const generateTestHook = useCavy();

  const [fontsLoaded] = useFonts({ Raleway_600SemiBold });

  const { state, getDiaryEntries } = useContext(DiaryContext);
  const [loading, setLoading] = useState(true);

  const [userEmoji, setUserEmoji] = useState('');

  async function getUserInfo(callback) {
    const user = await firebase.retrieveUser();
    const userData = (await firebase.retrieveUserDocument(user)).data();

    setUserEmoji('userEmoji' in userData ? userData.userEmoji : '');

    if (callback) {
      callback();
    }
  }

  useEffect(() => {
    getUserInfo(() => getDiaryEntries(() => setLoading(false)));
  }, []);

  return loading || !fontsLoaded ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <>
      <View
        style={{ flex: 1, alignItems: 'center', backgroundColor: '#EBBC31' }}
        ref={generateTestHook('DiaryScreen.LoadedDiaryView')}
      >
        <FlatList
          numColumns={2}
          data={state}
          keyExtractor={(entry) => entry.id}
          renderItem={({ item, index }) => (
            <TouchableNativeFeedback
              ref={generateTestHook(`DiaryScreen.EntryCard.${index}`)}
              onPress={() => navigation.navigate('DiaryEntry', { id: item.id })}
            >
              <ImageBackground
                source={require('../../assets/black_book.png')} // eslint-disable-line
                style={{
                  width: Dimensions.get('window').width * 0.45,
                  height: Dimensions.get('window').height * 0.25,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    top: 10,
                    right: 10,
                    margin: 40,
                    textAlign: 'center',
                  }}
                  numberOfLines={5}
                >
                  {item.title}
                </Text>
              </ImageBackground>
              {/* <Card
                title={item.title}
                titleNumberOfLines={1}
                dividerStyle={{ marginBottom: 3 }}
                titleStyle={{ marginBottom: 3 }}
                containerStyle={{
                  paddingTop: 3,
                  marginBottom: 3,
                  width: Dimensions.get('window').width * 0.42,
                  height: Dimensions.get('window').height * 0.25,
                }}
              >
                <Text numberOfLines={9}>{item.content}</Text>
              </Card> */}
            </TouchableNativeFeedback>
          )}
          refreshing={loading}
          onRefresh={() => {
            setLoading(true);
            getDiaryEntries(() => setLoading(false));
          }}
        />
      </View>
      <View
        style={{
          flex: 0.08,
          backgroundColor: '#91751F',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SelectUserEmoji');
          }}
        >
          <Text
            style={{
              fontSize: 24,
              textAlign: 'center',
              fontFamily: 'Raleway_600SemiBold',
              color: 'white',
            }}
          >
            How are you feeling today?{userEmoji ? `\nYou: ${userEmoji}` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

DiaryScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    retrieveUser: PropTypes.func.isRequired,
    retrieveUserDocument: PropTypes.func.isRequired,
  }).isRequired,
};

export default withFirebaseHOC(DiaryScreen);
