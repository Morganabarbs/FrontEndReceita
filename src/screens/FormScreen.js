import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Switch, StatusBar,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { criarReceita, atualizarReceita } from '../services/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const CATEGORIAS = [
  'Sobremesa', 'Prato Principal', 'Entrada', 'Bebida',
  'Vegetariano', 'Vegano', 'Outro',
];

export default function FormScreen({ route, navigation }) {
  const receitaExistente = route.params?.receita;
  const editando = !!receitaExistente;

  const [nome, setNome] = useState(receitaExistente?.nome || '');
  const [categoria, setCategoria] = useState(receitaExistente?.categoria || '');
  const [origem, setOrigem] = useState(receitaExistente?.origem || '');
  const [ingredientes, setIngredientes] = useState(
    receitaExistente?.ingredientes?.join(', ') || ''
  );
  const [instrucoes, setInstrucoes] = useState(receitaExistente?.instrucoes || '');
  const [favorito, setFavorito] = useState(receitaExistente?.favorito || false);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState({});

  const validar = () => {
    const e = {};
    if (!nome.trim()) e.nome = 'Informe o nome da receita';
    if (!categoria) e.categoria = 'Selecione uma categoria';
    if (!ingredientes.trim()) e.ingredientes = 'Informe os ingredientes';
    if (!instrucoes.trim()) e.instrucoes = 'Informe as instruções';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;
    setSalvando(true);
    try {
      const dados = {
        nome: nome.trim(),
        categoria,
        origem: origem.trim(),
        ingredientes: ingredientes.split(',').map((i) => i.trim()),
        instrucoes: instrucoes.trim(),
        favorito,
      };
      if (editando) {
        await atualizarReceita(receitaExistente._id, dados);
      } else {
        await criarReceita(dados);
      }
      navigation.goBack();
    } catch (error) {
      const msg =
        error.response?.data?.erros?.join('\n') ||
        error.response?.data?.mensagem ||
        'Erro ao salvar.';
      Alert.alert('Erro', msg);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>
            {editando ? 'Editar Receita' : 'Nova Receita'}
          </Text>
          <Text style={s.headerSub}>
            {editando ? 'Atualize as informações' : 'Preencha os dados'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nome */}
        <View style={s.field}>
          <Text style={s.label}>Nome</Text>
          <View style={[s.inputWrap, errors.nome && s.inputErr]}>
            <Ionicons name="restaurant" size={20} color={COLORS.textMuted} />
            <TextInput
              style={s.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Bolo de Cenoura"
              placeholderTextColor={COLORS.textMuted}
              maxLength={200}
            />
          </View>
          {errors.nome && <Text style={s.errText}>{errors.nome}</Text>}
        </View>

        {/* Categoria */}
        <View style={s.field}>
          <Text style={s.label}>Categoria</Text>
          {errors.categoria && <Text style={s.errText}>{errors.categoria}</Text>}
          <View style={s.genreGrid}>
            {CATEGORIAS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[s.chip, categoria === c && s.chipActive]}
                onPress={() => {
                  setCategoria(c);
                  setErrors((p) => ({ ...p, categoria: null }));
                }}
              >
                <Text style={[s.chipText, categoria === c && s.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Origem */}
        <View style={s.field}>
          <Text style={s.label}>Origem</Text>
          <View style={s.inputWrap}>
            <Ionicons name="earth" size={20} color={COLORS.textMuted} />
            <TextInput
              style={s.input}
              value={origem}
              onChangeText={setOrigem}
              placeholder="Ex: Brasil"
              placeholderTextColor={COLORS.textMuted}
              maxLength={100}
            />
          </View>
        </View>

        {/* Ingredientes */}
        <View style={s.field}>
          <Text style={s.label}>Ingredientes</Text>
          <View style={[s.inputWrap, errors.ingredientes && s.inputErr]}>
            <Ionicons name="list" size={20} color={COLORS.textMuted} />
            <TextInput
              style={s.input}
              value={ingredientes}
              onChangeText={setIngredientes}
              placeholder="Separe por vírgula (ex: ovo, leite, farinha)"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          {errors.ingredientes && (
            <Text style={s.errText}>{errors.ingredientes}</Text>
          )}
        </View>

        {/* Instruções */}
        <View style={s.field}>
          <Text style={s.label}>Instruções</Text>
          <View style={[s.inputWrap, errors.instrucoes && s.inputErr]}>
            <Ionicons name="document-text" size={20} color={COLORS.textMuted} />
            <TextInput
              style={[s.input, { height: 100 }]}
              value={instrucoes}
              onChangeText={setInstrucoes}
              placeholder="Descreva o modo de preparo"
              placeholderTextColor={COLORS.textMuted}
              multiline
            />
          </View>
          {errors.instrucoes && (
            <Text style={s.errText}>{errors.instrucoes}</Text>
          )}
        </View>

        {/* Switch Favorito */}
        <View style={s.switchBox}>
          <View style={s.switchInfo}>
            <Ionicons
              name={favorito ? 'heart' : 'heart-outline'}
              size={24}
              color={favorito ? COLORS.success : COLORS.textMuted}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={s.switchLabel}>Marcar como favorito?</Text>
              <Text style={s.switchHint}>
                {favorito ? 'Receita favorita ❤️' : 'Não marcada como favorita'}
              </Text>
            </View>
          </View>
          <Switch
            value={favorito}
            onValueChange={setFavorito}
            trackColor={{ false: COLORS.border, true: COLORS.success + '60' }}
            thumbColor={favorito ? COLORS.success : COLORS.textMuted}
          />
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[s.saveBtn, salvando && { opacity: 0.6 }]}
          onPress={salvar}
          disabled={salvando}
          activeOpacity={0.8}
        >
          {salvando ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons
                name={editando ? 'checkmark-done' : 'add-circle'}
                size={22}
                color={COLORS.white}
              />
              <Text style={s.saveBtnText}>
                {editando ? 'Salvar Alterações' : 'Cadastrar Receita'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    marginRight: SPACING.md,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONTS.title,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSub: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.lg },

  field: { marginBottom: SPACING.lg },
  label: {
    fontSize: FONTS.large,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTS.regular,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  inputErr: {
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  errText: {
    fontSize: FONTS.small,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },

  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  chip: {
    flexBasis: '48%',
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONTS.large,
    color: COLORS.primaryDark,
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  switchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: FONTS.large,
    color: COLORS.text,
  },
  switchHint: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },

  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.xl,
    ...SHADOWS.md,
  },
  saveBtnText: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
});
