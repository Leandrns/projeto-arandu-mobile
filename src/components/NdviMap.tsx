import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  Polygon,
  Rect,
} from 'react-native-svg';
import { colors, fonts, fontSizes, radius, spacing } from '../theme';
import { Ponto } from '../types';

interface Props {
  poligono: Ponto[];
  ndviBase: number;
  seed: string;
  height?: number;
}

const GRID = 12;

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/** Cor por valor de NDVI: vermelho (baixo vigor) → amarelo → verde (alto). */
function ndviColor(v: number): string {
  if (v < 0.35) return '#C0392B';
  if (v < 0.45) return '#E05A3A';
  if (v < 0.55) return '#F2B705';
  if (v < 0.68) return '#9CCB5A';
  return '#3FA85C';
}

export function NdviMap({ poligono, ndviBase, seed, height = 220 }: Props) {
  const pointsStr = poligono.map((p) => `${p.x * 100},${p.y * 100}`).join(' ');

  const cells = useMemo(() => {
    const rng = mulberry32(hashSeed(seed));
    const size = 100 / GRID;
    const list: { x: number; y: number; color: string }[] = [];
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        const noise = (rng() - 0.5) * 0.3;
        const v = clamp(ndviBase + noise);
        list.push({ x: gx * size, y: gy * size, color: ndviColor(v) });
      }
    }
    return { list, size };
  }, [seed, ndviBase]);

  return (
    <View>
      <View style={[styles.frame, { height }]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Defs>
            <ClipPath id="farm">
              <Polygon points={pointsStr} />
            </ClipPath>
          </Defs>

          {/* terreno fora da propriedade */}
          <Rect x={0} y={0} width={100} height={100} fill="#EEF3EA" />

          {/* grade NDVI recortada pelo polígono */}
          <Rect x={0} y={0} width={100} height={100} fill="#DfeAdC" clipPath="url(#farm)" />
          {cells.list.map((c, i) => (
            <Rect
              key={i}
              x={c.x}
              y={c.y}
              width={cells.size + 0.4}
              height={cells.size + 0.4}
              fill={c.color}
              clipPath="url(#farm)"
            />
          ))}

          {/* contorno da propriedade */}
          <Polygon
            points={pointsStr}
            fill="none"
            stroke={colors.text}
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={styles.tag}>Mapa NDVI · simulado</Text>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Menos vigor</Text>
        <View style={styles.bar}>
          {['#C0392B', '#E05A3A', '#F2B705', '#9CCB5A', '#3FA85C'].map((c) => (
            <View key={c} style={[styles.barStep, { backgroundColor: c }]} />
          ))}
        </View>
        <Text style={styles.legendLabel}>Mais vigor</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#EEF3EA',
  },
  tag: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(31,42,36,0.7)',
    color: '#fff',
    fontFamily: fonts.regular,
    fontSize: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  legendLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  bar: { flexDirection: 'row', flex: 1, height: 10, borderRadius: 5, overflow: 'hidden' },
  barStep: { flex: 1 },
});
