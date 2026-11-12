
import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Searchbar,
  Card,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import {
  getPopularMovies,
  IMAGE_URL,
  type Movie,
} from '../../services/movieApi';

export default function HomeScreen() {
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const results = await getPopularMovies();
      setMovies(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load movies'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>
            MOVIE<Text style={styles.logoRed}>EXPLORER</Text>
          </Text>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Discover your next favourite movie
        </Text>
      </View>

      <TouchableOpacity onPress={() => router.push('/search')}>
        <Searchbar
          placeholder="Search movies..."
          editable={false}
          style={styles.search}
          iconColor="#E50914"
        />
      </TouchableOpacity>

      <Text style={styles.heading}>Popular Movies</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#E50914"
          style={styles.loader}
        />
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={loadMovies}>
            <Text style={styles.retry}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
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
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[styles.poster, styles.noPoster]}>
                    <Text style={styles.noPosterText}>No Image</Text>
                  </View>
                )}

                <Card.Content style={styles.cardContent}>
                  <Text numberOfLines={2} style={styles.movieTitle}>
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
    paddingTop: 55,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
  logoRed: {
    color: '#E50914',
  },
  profileButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 8,
  },
  profileText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#AAAAAA',
    marginTop: 8,
    fontSize: 14,
  },
  search: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#252525',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  loader: {
    marginTop: 50,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
  },
  error: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  retry: {
    color: '#E50914',
    marginTop: 12,
  },
  movieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 22,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  movieItem: {
    width: '44%',
    maxWidth: 230,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
    borderRadius: 10,
  },
  poster: {
    width: '100%',
    height: 300,
    backgroundColor: '#252525',
  },
  noPoster: {
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
