import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Menu, Provider, IconButton } from 'react-native-paper';
import Config from 'react-native-config';
import { Dimensions } from 'react-native';

const Home = ({ navigation, route }: any) => {
  const [quote, setQuote] = useState('');
  const [journals, setJournals] = useState<any>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  //Fetch date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  //Dynamic screen change logic
  useEffect(() => {
    const onChange = ({ window }: any) => {
      setScreenWidth(window.width);
    };

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => {
      subscription.remove();
    };
  }, []);

  //Fetch quotes
  useEffect(() => {
    fetch(Config.API_QUOTES_URL)
      .then(res => res.json())
      .then(data => {
        setQuote(`${data[0].q} — ${data[0].a}`);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch quote:', err);
        setQuote('Keep going. Your story is not over yet.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchInitialJournals();
  }, []);

  //Updates after adding and updating journals
  useEffect(() => {
    if (route.params?.refresh) {
      fetchInitialJournals();
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  //First few journals 
  const fetchInitialJournals = async () => {
    setLoading(true);
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('journals')
        .orderBy('date', 'desc')
        .limit(5)
        .get();

      const newJournals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setJournals(newJournals); 
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
    }
  };

  //Next few journals for pagination
  const fetchMoreJournals = async () => {
    if (!lastVisible || loadingMore) return;
    setLoadingMore(true);
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('journals')
        .orderBy('date', 'desc')
        .startAfter(lastVisible)
        .limit(5)
        .get();

      const moreJournals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setJournals((prev: any) => [...prev, ...moreJournals]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching more journals:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  //Delete a journal
  const handleDelete = async (id: string) => {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) return;

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('journals')
        .doc(id)
        .delete();

      setJournals((prev: any) => prev.filter((j: any) => j.id !== id));
    } catch (error) {
      console.error('Failed to delete journal:', error);
    } finally {
      setMenuVisible(false);
      setSelectedItemId(null);
    }
  };

  return (
    <Provider>
      <View style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator size="large" color="#4A90E2" />
            ) : (
              <Text style={styles.quoteText}>{quote}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('JournalPage')}
          >
            <Text style={styles.buttonText}>Create Journal</Text>
          </TouchableOpacity>

          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={journals}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={{ padding: 12, marginBottom: 10, backgroundColor: '#f0f0f0', borderRadius: 8, width: (screenWidth - 60) }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {item.title.length > 50 ? `${item.title.slice(0, 50)}` : item.title}
                    </Text>

                    <Menu
                      visible={selectedItemId === item.id && menuVisible}
                      onDismiss={() => {
                        setMenuVisible(false);
                        setSelectedItemId(null);
                      }}
                      anchor={
                        <IconButton
                          icon="menu"
                          size={20}
                          onPress={() => {
                            setSelectedItemId(item.id);
                            setMenuVisible(true);
                          }}
                        />
                      }
                    >
                      <Menu.Item onPress={() => {
                        setMenuVisible(false);
                        setSelectedItemId(null);
                        navigation.navigate('JournalPage', { journal: item });
                      }} title="Edit" />

                      <Menu.Item onPress={() => handleDelete(item.id)} title="Delete" />
                    </Menu>
                  </View>

                  <Text>
                    {item.journal.length > 50 ? `${item.journal.slice(0, 50)}...` : item.journal}
                  </Text>
                  <Text style={{ color: 'gray', marginTop: 4 }}>
                    {new Date(item.date).toLocaleString()}
                  </Text>
                </View>
              )}

              onEndReached={fetchMoreJournals}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loadingMore ? <Text>Loading more...</Text> : <Text>No journal to load</Text>}
              contentContainerStyle={{ paddingBottom: 180 }}
            />
          )}
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    marginBottom: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#34495E',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Home;