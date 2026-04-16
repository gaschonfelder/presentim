// ─── Destinos a partir de cidades brasileiras ────────────────────────────────
// Distâncias rodoviárias aproximadas em km.
// Usado na retrospectiva pra "se cada dia fosse 1 km, iriam até..."

export type Destination = {
  /** Distância em km desde a cidade de origem */
  km: number
  /** Nome curto pra exibição */
  label: string
  /** Emoji ilustrativo */
  emoji: string
}

// Lista genérica ordenada — funciona pra qualquer origem brasileira.
// A exibição escolhe o destino mais próximo da distância do casal.
// Valores são referências aproximadas (saindo do sudeste do Brasil como média).

export const DESTINATIONS: Destination[] = [
  { km: 50, label: 'a cidade vizinha', emoji: '🏘️' },
  { km: 100, label: 'uma cidade próxima', emoji: '🌆' },
  { km: 200, label: 'o litoral mais próximo', emoji: '🏖️' },
  { km: 400, label: 'Curitiba', emoji: '🌲' },
  { km: 600, label: 'Belo Horizonte', emoji: '⛰️' },
  { km: 900, label: 'o Rio de Janeiro', emoji: '🗿' },
  { km: 1100, label: 'Florianópolis', emoji: '🏝️' },
  { km: 1400, label: 'Brasília', emoji: '🏛️' },
  { km: 1700, label: 'Porto Alegre', emoji: '🧉' },
  { km: 2100, label: 'Salvador', emoji: '🥁' },
  { km: 2500, label: 'Recife', emoji: '🦀' },
  { km: 2900, label: 'Fortaleza', emoji: '🌞' },
  { km: 3200, label: 'Natal', emoji: '🌊' },
  { km: 3600, label: 'Manaus', emoji: '🐠' },
  { km: 4100, label: 'Belém', emoji: '🌴' },
  { km: 4700, label: 'Buenos Aires', emoji: '🇦🇷' },
  { km: 5500, label: 'Santiago', emoji: '🏔️' },
  { km: 7000, label: 'Miami', emoji: '🌴' },
  { km: 8500, label: 'Lisboa', emoji: '🇵🇹' },
  { km: 9500, label: 'Madrid', emoji: '🇪🇸' },
  { km: 10000, label: 'Paris', emoji: '🗼' },
  { km: 11000, label: 'Londres', emoji: '🇬🇧' },
  { km: 13500, label: 'Roma', emoji: '🏛️' },
  { km: 16000, label: 'Cairo', emoji: '🏺' },
  { km: 18500, label: 'Tóquio', emoji: '🗾' },
  { km: 40075, label: 'volta ao mundo inteiro', emoji: '🌍' },
]

/** Retorna o destino mais relevante para uma quantidade de dias/km. */
export function getDestinationForKm(km: number): Destination {
  // Casos extremos
  if (km < DESTINATIONS[0].km) {
    return { km, label: `${km} km percorridos`, emoji: '🚶' }
  }

  // Volta ao mundo: se passou, mostra quantas voltas
  const ultima = DESTINATIONS[DESTINATIONS.length - 1]
  if (km >= ultima.km) {
    const voltas = (km / ultima.km).toFixed(1)
    return {
      km,
      label: `${voltas} voltas ao mundo`,
      emoji: '🌍',
    }
  }

  // Encontra o destino mais próximo sem ultrapassar muito
  // Preferimos um destino já "alcançado" (km menor ou igual)
  let best = DESTINATIONS[0]
  for (const dest of DESTINATIONS) {
    if (dest.km <= km) best = dest
    else break
  }
  return best
}