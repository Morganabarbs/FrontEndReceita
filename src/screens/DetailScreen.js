import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { excluirReceita } from '../services/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function DetailScreen({ route, navigation }) {
  const { receita } = route.params;

  const confirmarExclusao = () => {
    Alert.alert('🗑️ Excluir Receita', `Excluir "${receita.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
  };

  const excluir = async () => {
    try {
      await excluirReceita(receita._id);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir.');
    }
  };

  const InfoRow = ({ icon, label, value, color }) => (
    <View style={s.infoRow}>
      <View
        style={[
          s.infoIcon,
          { backgroundColor: (color || COLORS.primary) + '15' },
        ]}
      >
        <Ionicons name={icon} size={20} color={color || COLORS.primary} />
      </View>
      <View style={s.infoContent}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhes</Text>
        <TouchableOpacity
          style={s.editHeaderBtn}
          onPress={() => navigation.navigate('Formulario', { receita })}
        >
          <Ionicons name="pencil" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section */}
        <View style={s.hero}>
          <View style={[s.bookIcon, { backgroundColor: COLORS.primary + '20' }]}>
            <Ionicons name="restaurant" size={48} color={COLORS.primary} />
          </View>
          <Text style={s.titulo}>{receita.nome}</Text>
          <Text style={s.autor}>Categoria: {receita.categoria}</Text>
          <Text style={s.autor}>Origem: {receita.origem || '—'}</Text>
          {receita.favorito && (
            <View style={s.lidoBadge}>
              <Ionicons name="heart" size={16} color={COLORS.success} />
              <Text style={s.lidoText}>Favorito</Text>
            </View>
          )}
        </View>

        {/* Info card */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Informações</Text>
          <InfoRow icon="book-outline" label="Nome" value={receita.nome} />
          <InfoRow icon="pricetag-outline" label="Categoria" value={receita.categoria} />
          <InfoRow icon="earth-outline" label="Origem" value={receita.origem || '—'} />
          <InfoRow
            icon="list-outline"
            label="Ingredientes"
            value={receita.ingredientes.join(', ')}
          />
          <InfoRow
            icon="document-text-outline"
            label="Instruções"
            value={receita.instrucoes}
          />
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.editBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Formulario', { receita })}
          >
            <Ionicons name="pencil" size={20} color={COLORS.white} />
            <Text style={s.editBtnText}>Editar Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.deleteBtn}
            activeOpacity={0.8}
            onPress={confirmarExclusao}
          >
            <Ionicons name="trash" size={20} color={COLORS.danger} />
            <Text style={s.deleteBtnText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl + 10,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: FONTS.large, fontWeight: '700', color: COLORS.text },
  editHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: { padding: SPACING.lg, paddingBottom: SPACING.xxl },

  hero: { alignItems: 'center', marginBottom: SPACING.lg },
  bookIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titulo: {
    fontSize: FONTS.title,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  autor: { fontSize: FONTS.large, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  lidoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.round,
    marginTop: SPACING.sm,
  },
  lidoText: { fontSize: FONTS.small, color: COLORS.success, fontWeight: '700', marginLeft: 6 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  cardTitle: {
    fontSize: FONTS.large,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: FONTS.xsmall, color: COLORS.textMuted, fontWeight: '500' },
  infoValue: { fontSize: FONTS.regular, color: COLORS.text, fontWeight: '600', marginTop: 2 },

  actions: { flexDirection: 'row', gap: SPACING.md },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  editBtnText: { fontSize: FONTS.regular, fontWeight: '700', color: COLORS.white },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger + '15',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
  },
  deleteBtnText: { fontSize: FONTS.regular, fontWeight: '700', color: COLORS.danger },
});
