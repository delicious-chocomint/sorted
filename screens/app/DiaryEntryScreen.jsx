import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import { format } from 'date-fns';
import { useCavy } from 'cavy';
import { Context as DiaryContext } from '../../config/DiaryContext';
import HookedButton from '../../components/HookedButton';

function makeSentimentString(score, magnitude) {
  let str = "Google's algorithms think that your feelings are ";
  if (score > -0.2 && score < 0.2) {
    if (magnitude < 1) {
      str += 'neutral';
    } else {
      str += 'mixed';
    }
  } else if (score >= 0.2) {
    if (magnitude < 0.7) {
      str += 'positive';
    } else {
      str += 'very positive';
    }
  } else if (magnitude > -0.7) {
    str += 'negative';
  } else {
    str += 'very negative';
  }
  return `${str}.`;
}

function makeStringFromTimestamp(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  const formatted = format(date, "do 'of' MMMM, R");
  return formatted;
}

const propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const DiaryEntryScreen = ({ navigation }) => {
  const generateTestHook = useCavy();

  const id = navigation.getParam('id');
  const { state, deleteDiaryEntry, getDiaryEntries } = useContext(DiaryContext);
  const entry = state.find((x) => x.id === id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setParams({ title: entry.title, entry });

    const listener = navigation.addListener('didFocus', () => {
      navigation.setParams({ title: entry.title, entry });
    });

    return () => {
      listener.remove();
    };
  }, []);

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, height: Dimensions.get('window').height - 50 }}>
        <Text
          h3
          style={{ margin: 5, textAlign: 'center', marginVertical: 20 }}
          ref={generateTestHook('DiaryEntryScreen.TitleText')}
        >
          {entry.title}
        </Text>
        <Text
          style={{ marginLeft: 5 }}
          ref={generateTestHook('DiaryEntryScreen.CreatedDateText')}
        >
          Created on {makeStringFromTimestamp(entry.createdDate)}
        </Text>
        {'updatedDate' in entry ? (
          <Text
            style={{ marginLeft: 5 }}
            ref={generateTestHook('DiaryEntryScreen.EditedDateText')}
          >
            Edited on {makeStringFromTimestamp(entry.updatedDate)}
          </Text>
        ) : null}
        <ScrollView>
          <Text
            style={{ margin: 5, fontSize: 24 }}
            ref={generateTestHook('DiaryEntryScreen.ContentText')}
          >
            {entry.content}
          </Text>
        </ScrollView>
        {'sentimentScore' in entry && 'sentimentMagnitude' in entry ? (
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                flex: 9,
                margin: 5,
                marginHorizontal: 30,
                textAlign: 'center',
              }}
              ref={generateTestHook('DiaryEntryScreen.SentimentText')}
            >
              {makeSentimentString(
                entry.sentimentScore,
                entry.sentimentMagnitude
              )}
            </Text>
            {'emotions' in entry ? (
              <Button
                title="Emotions"
                type="clear"
                style={{ flex: 1, margin: 5 }}
                onPress={() =>
                  navigation.navigate('Emoji', { emotions: entry.emotions })
                }
                ref={generateTestHook('DiaryEntryScreen.EmotionsButton')}
              />
            ) : null}
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              getDiaryEntries(() => setLoading(false));
            }}
            ref={generateTestHook('DiaryEntryScreen.AnalyzingText')}
          >
            <Text
              style={{
                margin: 15,
                marginHorizontal: 30,
                textAlign: 'center',
              }}
            >
              We are analyzing your text. Tap this text to check for updates.
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ flex: 0.08 }}>
        <Button
          title="Delete"
          onPress={() => {
            setLoading(true);
            deleteDiaryEntry(id, () => {
              getDiaryEntries(() => navigation.navigate('Diary'));
            });
          }}
          style={{
            alignSelf: 'center',
          }}
          ref={generateTestHook('DiaryEntryScreen.DeleteButton')}
        />
      </View>
    </View>
  );
};

DiaryEntryScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title', 'Loading...'),
  headerRight: (
    <HookedButton
      title="Edit"
      onPress={() => {
        navigation.navigate('Edit', { entry: navigation.getParam('entry') });
      }}
      testHook="DiaryEntryScreen.EditButton"
    />
  ),
});

DiaryEntryScreen.propTypes = propTypes;

export default DiaryEntryScreen;
