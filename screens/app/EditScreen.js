import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import EntryComponent from "../../components/EntryComponent";
import { Context as DiaryContext } from "../../config/DiaryContext";

const EditScreen = ({ navigation }) => {
  const { editDiaryEntry, getDiaryEntries } = useContext(DiaryContext);
  const [loading, setLoading] = useState(false);
  const { id, title, content } = navigation.getParam("entry");

  useEffect(() => {
    navigation.setParams({ origTitle: navigation.getParam("entry").title });
  }, []);

  return loading ? (
    <ActivityIndicator />
  ) : (
    <View>
      <EntryComponent
        initialValues={{ title, content }}
        onSubmit={(values) => {
          {
            setLoading(true);
            editDiaryEntry(id, values, () =>
              getDiaryEntries(() => {
                setLoading(false);
                navigation.navigate("Diary");
              })
            );
          }
        }}
      />
    </View>
  );
};

EditScreen.navigationOptions = ({ navigation }) => ({
  title: `Editing ${navigation.getParam("origTitle", "loading...")}`,
});

const styles = StyleSheet.create({});

export default EditScreen;