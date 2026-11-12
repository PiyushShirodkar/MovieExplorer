
import { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {
  Text,
  Searchbar,
  ActivityIndicator,
  Card,
  Button,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import {
  searchMovies,
  IMAGE_URL,
  type Movie,
} from '../../services/movieApi';

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a movie name');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const results = await searchMovies(query.trim());
      setMovies(results);

      if (results.length === 0) {
        setError('No movies found');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to search movies'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          icon="arrow-left"
          mode="contained"
          buttonColor="#E50914"
          textColor="#FFFFFF"
          style={styles.backButton}
          onPress={() => router.replace('/home')}
        >
          Back to Home
        </Button>

        <Text style={styles.title}>Search Movies</Text>

        <Text style={styles.subtitle}>
          Find your favourite movies
        </Text>
      </View>

      <Searchbar
        placeholder="Enter movie name..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        onIconPress={handleSearch}
        style={styles.search}
        inputStyle={styles.searchInput}
        iconColor="#E50914"
        placeholderTextColor="#AAAAAA"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#E50914"
          style={styles.loader}
        />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <View style={styles.movieGrid}>
          {movies.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.movieItem}
              onPress={() =>
                router.push({
                  pathname: '/movieDetails',
                  params: { movieId: String(movie.id) },
                })
              }
            >
              <Card style={styles.card}>
                {movie.poster_path ? (
                  <Image
                    source={{
                      uri: `${IMAGE_URL}${movie.poster_path}`,
                    }}
                    style={styles.poster}
                  />
                ) : (
                  <View style={[styles.poster, styles.noPoster]}>
                    <Text style={styles.noPosterText}>No Image</Text>
                  </View>
                )}

                <Card.Content style={styles.cardContent}>
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.title}
                  </Text>

                  <Text style={styles.rating}>
                    ⭐ {movie.vote_average.toFixed(1)} / 10
                  </Text>

                  <Text style={styles.release}>
                    {movie.release_date || 'Release date unavailable'}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!searched && !loading && (
        <Text style={styles.message}>
          Search for a movie to see results.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 35,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginBottom: 25,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#AAAAAA',
    marginTop: 6,
  },
  search: {
    marginHorizontal: 16,
    backgroundColor: '#252525',
  },
  searchInput: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#E50914',
    marginHorizontal: 16,
    marginTop: 15,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  message: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 35,
    paddingHorizontal: 15,
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 30,
  },
  movieItem: {
    width: '44%',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 235,
    resizeMode: 'cover',
  },
  noPoster: {
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 10,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  rating: {
    color: '#F5C518',
    marginTop: 7,
    fontSize: 12,
  },
  release: {
    color: '#AAAAAA',
    marginTop: 5,
    fontSize: 11,
  },
});
