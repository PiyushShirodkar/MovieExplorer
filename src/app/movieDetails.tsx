
import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Card,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import {
  getMovieDetails,
  IMAGE_URL,
} from '../../services/movieApi';

type MovieDetailsType = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
};

export default function MovieDetailsScreen() {
  const router = useRouter();
  const { movieId } = useLocalSearchParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const goToHome = () => {
    router.replace('/home');
  };

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);

        const data = await getMovieDetails(Number(movieId));
        setMovie(data);

        const user = auth.currentUser;

        if (user) {
          const movieRef = doc(
            db,
            'users',
            user.uid,
            'watchlist',
            String(data.id)
          );

          const savedMovie = await getDoc(movieRef);
          setIsSaved(savedMovie.exists());
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadDetails();
    }
  }, [movieId]);

  const addToWatchlist = async () => {
    if (!movie) return;

    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Login Required', 'Please login first.');
      return;
    }

    try {
      setSaving(true);

      const movieRef = doc(
        db,
        'users',
        user.uid,
        'watchlist',
        String(movie.id)
      );

      await setDoc(movieRef, {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      });

      setIsSaved(true);
      Alert.alert('Success', 'Movie added to your Watchlist!');
    } catch (error) {
      Alert.alert('Error', 'Could not save movie. Please try again.');
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.topBackButton}
          onPress={goToHome}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>

        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>
          Loading movie details...
        </Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Movie not found</Text>

        <TouchableOpacity
          style={styles.topBackButton}
          onPress={goToHome}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goToHome}
        >
          <Text style={styles.backButtonText}>
            ← Back to Home
          </Text>
        </TouchableOpacity>
      </View>

      {movie.backdrop_path && (
        <Image
          source={{
            uri: `${IMAGE_URL}${movie.backdrop_path}`,
          }}
          style={styles.backdrop}
        />
      )}

      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.movieHeader}>
            {movie.poster_path && (
              <Image
                source={{
                  uri: `${IMAGE_URL}${movie.poster_path}`,
                }}
                style={styles.poster}
              />
            )}

            <View style={styles.movieInfo}>
              <Text style={styles.title}>
                {movie.title}
              </Text>

              <Text style={styles.rating}>
                ⭐ {movie.vote_average.toFixed(1)} / 10
              </Text>

              <Text style={styles.info}>
                Release: {movie.release_date || 'Unknown'}
              </Text>

              <Text style={styles.info}>
                Runtime: {movie.runtime
                  ? `${movie.runtime} minutes`
                  : 'Unknown'}
              </Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity
          style={[
            styles.watchlistButton,
            isSaved && styles.savedButton,
          ]}
          onPress={addToWatchlist}
          disabled={saving || isSaved}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.watchlistButtonText}>
              {isSaved
                ? '✓ Added to Watchlist'
                : '+ Add to Watchlist'}
            </Text>
          )}
        </TouchableOpacity>

        {movie.tagline ? (
          <Text style={styles.tagline}>
            "{movie.tagline}"
          </Text>
        ) : null}

        <Text style={styles.heading}>Genres</Text>

        <View style={styles.genreContainer}>
          {movie.genres?.map((genre) => (
            <View key={genre.id} style={styles.genre}>
              <Text style={styles.genreText}>
                {genre.name}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Overview</Text>

        <Text style={styles.overview}>
          {movie.overview || 'No description available.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
  },
  error: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  header: {
    padding: 15,
    paddingTop: 25,
    backgroundColor: '#121212',
  },
  topBackButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 9,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#E50914',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 9,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  backdrop: {
    width: '100%',
    height: 230,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 12,
  },
  movieHeader: {
    flexDirection: 'row',
  },
  poster: {
    width: 125,
    height: 185,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  movieInfo: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
  },
  rating: {
    color: '#F5C518',
    marginTop: 12,
    fontSize: 15,
  },
  info: {
    color: '#AAAAAA',
    marginTop: 10,
    fontSize: 12,
  },
  watchlistButton: {
    backgroundColor: '#E50914',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  savedButton: {
    backgroundColor: '#267A45',
  },
  watchlistButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagline: {
    color: '#AAAAAA',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  heading: {
    color: '#E50914',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genre: {
    backgroundColor: '#292929',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreText: {
    color: '#FFFFFF',
  },
  overview: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
  },
});
