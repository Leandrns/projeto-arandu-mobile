import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Polygon, Polyline } from 'react-native-svg';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { Ponto } from '../types';

interface Props {
  pontos: Ponto[];
  onChange: (pontos: Ponto[]) => void;
}

export function PoligonoDraw({ pontos, onChange }: Props) {
  const [size, setSize] = useState({ w: 1, h: 1 });

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  }

  function addPonto(e: GestureResponderEvent) {
    const { locationX, locationY } = e.nativeEvent;
    const x = Math.min(1, Math.max(0, locationX / size.w));
    const y = Math.min(1, Math.max(0, locationY / size.h));
    onChange([...pontos, { x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) }]);
  }

  const desfazer = () => onChange(pontos.slice(0, -1));
  const limpar = () => onChange([]);

  const pointsStr = pontos.map((p) => `${p.x * 100},${p.y * 100}`).join(' ');

  return (
    <View>
      <Pressable style={styles.canvas} onPress={addPonto} onLayout={onLayout}>
        <View style={styles.fill} pointerEvents="none">
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            {pontos.length >= 3 && (
              <Polygon
                points={pointsStr}
                fill="rgba(96,199,123,0.25)"
                stroke={colors.primaryDark}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            )}
            {pontos.length === 2 && (
              <Polyline
                points={pointsStr}
                fill="none"
                stroke={colors.primaryDark}
                strokeWidth={1.5}
              />
            )}
            {pontos.map((p, i) => (
              <Circle
                key={i}
                cx={p.x * 100}
                cy={p.y * 100}
                r={2.6}
                fill={colors.primaryDark}
                stroke={colors.surface}
                strokeWidth={1.2}
              />
            ))}
          </Svg>
        </View>

        {pontos.length === 0 && (
          <View pointerEvents="none" style={styles.hint}>
            <MaterialCommunityIcons
              name="gesture-tap"
              size={32}
              color={colors.primaryDark}
            />
            <Text style={styles.hintText}>
              Toque no mapa para marcar os cantos da sua plantação
            </Text>
          </View>
        )}
      </Pressable>

      <View style={styles.actions}>
        <Text style={styles.count}>{pontos.length} ponto(s)</Text>
        <View style={styles.btnRow}>
          <Pressable
            onPress={desfazer}
            disabled={!pontos.length}
            style={[styles.smallBtn, !pontos.length && styles.smallBtnOff]}
          >
            <MaterialCommunityIcons name="undo" size={18} color={colors.text} />
            <Text style={styles.smallBtnText}>Desfazer</Text>
          </Pressable>
          <Pressable
            onPress={limpar}
            disabled={!pontos.length}
            style={[styles.smallBtn, !pontos.length && styles.smallBtnOff]}
          >
            <MaterialCommunityIcons name="delete-outline" size={18} color={colors.text} />
            <Text style={styles.smallBtnText}>Limpar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    height: 240,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#EEF3EA',
    overflow: 'hidden',
  },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  hint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  hintText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  count: { fontFamily: fonts.bold, fontSize: fontSizes.caption, color: colors.textMuted },
  btnRow: { flexDirection: 'row', gap: spacing.sm },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
  },
  smallBtnOff: { opacity: 0.4 },
  smallBtnText: { fontFamily: fonts.bold, fontSize: 13, color: colors.text },
});
