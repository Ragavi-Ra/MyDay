import React, { useState, useEffect } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type JournalTypes = {
  Journal: string;
  date: Date;
  Title: string;
};

const JournalPage = ({ navigation, route }: any) => {
  const [show, setShow] = useState(false);

  const { control, handleSubmit, reset, watch, } = useForm<JournalTypes>();

  const watchedTitle = watch('Title');
  const watchedJournal = watch('Journal');
  const isButtonDisabled = !watchedTitle?.trim() || !watchedJournal?.trim();

  const editingJournal = route?.params?.journal;

  //Displayes current value as a placeholder for editing journals
  useEffect(() => {
    if (editingJournal) {
      reset({
        Title: editingJournal.title,
        Journal: editingJournal.journal,
        date: new Date(editingJournal.date),
      });
    }
  }, [editingJournal]);

  const onSubmit = async (data: JournalTypes) => {
    try {
      const currentUser = auth().currentUser;
      const userId = currentUser?.uid;
      if (!userId) return;

      const journalRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('journals');

      if (editingJournal) {
        //Editing journal
        await journalRef.doc(editingJournal.id).update({
          title: data?.Title,
          journal: data?.Journal,
          date: data.date.toISOString(),
        });
        Alert.alert('Updated', 'Your journal was updated successfully!');
      } else {
        //New journal
        const journalId = journalRef.doc().id;
        await journalRef.doc(journalId).set({
          title: data?.Title,
          journal: data?.Journal,
          date: data.date.toISOString(),
        });
        Alert.alert('Saved', 'Your journal was saved successfully!');
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { refresh: true } }],
      });
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert('Error', 'Something went wrong while saving your journal.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Create your Journal</Text>

        <Controller
          control={control}
          name="date"
          defaultValue={new Date()}
          render={({ field: { value, onChange } }) => (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShow(true)}
                style={styles.inputWrapper}
              >
                <TextInput
                  placeholder="Pick a date"
                  value={value ? value.toDateString() : ''}
                  editable={false}
                  pointerEvents="none"
                  style={styles.input}
                />
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>📅</Text>
                </View>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShow(Platform.OS === 'ios');
                    if (selectedDate) onChange(selectedDate);
                  }}
                  style={styles.datePicker}
                />
              )}
            </>
          )}
        />

        <Text style={styles.label}>Highlight of the day</Text>
        <Controller
          control={control}
          name="Title"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              maxLength={100}
              style={styles.textInput}
            />
          )}
        />

        <Text style={styles.label}>So what happened? How was your day?</Text>
        <Controller
          control={control}
          name="Journal"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline
              numberOfLines={6}
              style={styles.longTextInput}
            />
          )}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            isButtonDisabled && { backgroundColor: '#ccc' },
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#555',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  longTextInput: {
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    height: 120,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 18,
    color: '#555',
  },
  datePicker: {
    backgroundColor: 'white',
  },
});

export default JournalPage;
