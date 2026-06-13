import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert, Animated, StatusBar, Image
} from 'react-native';
import api, { listarReceitas, excluirReceita } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pratosDoDia, setPratosDoDia] = useState([]);

  // Buscar pratos do dia
  useEffect(() => {
    api.get('/receitas/pratos-do-dia')
      .then(res => setPratosDoDia(res.data))
      .catch(err => console.log(err));
  }, []);

  const carregarReceitas = async () => {
    try {
      const response = await listarReceitas();
      if (response.data.sucesso) {
        setReceitas(response.data.dados);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as receitas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregarReceitas();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarReceitas();
  };

  const confirmarExclusao = (id, nome) => {
    Alert.alert(
      '🗑️ Excluir Receita',
      `Tem certeza que deseja excluir "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirReceita(id) }
      ]
    );
  };

  // Cabeçalho com "Minhas receitas" e "Pratos do dia"
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerGreeting}>Minhas</Text>
          <Text style={styles.headerTitle}>Receitas 🍲</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{receitas.length}</Text>
          <Text style={styles.headerBadgeLabel}>receitas</Text>
        </View>
      </View>

      {/* Seção Pratos do Dia */}
      <Text style={styles.sectionTitle}>Pratos do dia 🍽️</Text>
      <FlatList
        data={pratosDoDia}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dishCard}
            onPress={() => navigation.navigate('Detalhes', { receita: item })}
          >
            <Image source={{ uri: item.imagem }} style={styles.dishImage} />
            <Text style={styles.dishName}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // Card de receita normal
  const renderRecipeCard = ({ item }) => (
    <Animated.View style={[styles.card, { opacity: 1 }]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate('Detalhes', { receita: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardAuthor}>{item.categoria}</Text>
          <Text style={styles.cardAuthor}>Origem: {item.origem}</Text>

          {item.favorito && (
            <View style={styles.lidoBadge}>
              <Ionicons name="heart" size={14} color={COLORS.success} />
              <Text style={styles.lidoText}>Favorito</Text>
            </View>
          )}

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Formulario', { receita: item })}
            >
              <Ionicons name="pencil" size={18} color={COLORS.primaryLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => confirmarExclusao(item._id, item.nome)}
            >
              <Ionicons name="trash" size={18} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando receitas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={receitas}
        keyExtractor={(item) => item._id}
        renderItem={renderRecipeCard}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* FAB - Botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Formulario')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primaryLight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: FONTS.lg,
    color: COLORS.dark,
  },
  headerTitle: {
    fontSize: FONTS.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerBadge: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },
  headerBadgeText: {
    fontSize: FONTS.md,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerBadgeLabel: {
    fontSize: FONTS.sm,
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONTS.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardBody: {
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONTS.lg,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  cardAuthor: {
    fontSize: FONTS.sm,
    color: COLORS.gray,
  },
  lidoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  lidoText: {
    marginLeft: 4,
    fontSize: FONTS.sm,
    color: COLORS.success,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  actionBtn: {
    marginRight: SPACING.sm,
  },
  deleteBtn: {
    backgroundColor: COLORS.lightDanger,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: FONTS.md,
    color: COLORS.gray,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    padding: SPACING.md,
    ...SHADOWS.lg,
  },
  dishCard: {
    width: 140,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
    alignItems: 'center',
    padding: SPACING.sm,
  },
  dishImage: {
    width: 120,
    height: 90,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
    resizeMode: 'cover', // garante que a imagem se ajuste corretamente
  },
  dishName: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});