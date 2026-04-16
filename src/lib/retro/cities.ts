// ─── Banco de cidades ─────────────────────────────────────────────────────────
// Extraído de RetrospectivaPlayer.tsx (linhas 106-119)

export type CityCoords = {
  lat: number
  lng: number
  label: string
}

export const CITY_DB: Record<string, CityCoords> = {
  // Brasil
  'são paulo':      { lat: -23.5, lng: -46.6, label: 'São Paulo, Brasil' },
  'sao paulo':      { lat: -23.5, lng: -46.6, label: 'São Paulo, Brasil' },
  'rio de janeiro': { lat: -22.9, lng: -43.2, label: 'Rio de Janeiro, Brasil' },
  'rio':            { lat: -22.9, lng: -43.2, label: 'Rio de Janeiro, Brasil' },
  'curitiba':       { lat: -25.4, lng: -49.3, label: 'Curitiba, Brasil' },
  'brasília':       { lat: -15.8, lng: -47.9, label: 'Brasília, Brasil' },
  'brasilia':       { lat: -15.8, lng: -47.9, label: 'Brasília, Brasil' },
  'belo horizonte': { lat: -19.9, lng: -43.9, label: 'Belo Horizonte, Brasil' },
  'fortaleza':      { lat: -3.7,  lng: -38.5, label: 'Fortaleza, Brasil' },
  'salvador':       { lat: -12.9, lng: -38.5, label: 'Salvador, Brasil' },
  'sorocaba':       { lat: -23.5, lng: -47.5, label: 'Sorocaba, Brasil' },
  'porto alegre':   { lat: -30.0, lng: -51.2, label: 'Porto Alegre, Brasil' },
  'recife':         { lat: -8.0,  lng: -34.9, label: 'Recife, Brasil' },
  'manaus':         { lat: -3.1,  lng: -60.0, label: 'Manaus, Brasil' },
  'belém':          { lat: -1.5,  lng: -48.5, label: 'Belém, Brasil' },
  'belem':          { lat: -1.5,  lng: -48.5, label: 'Belém, Brasil' },
  'goiânia':        { lat: -16.7, lng: -49.3, label: 'Goiânia, Brasil' },
  'goiania':        { lat: -16.7, lng: -49.3, label: 'Goiânia, Brasil' },
  'campinas':       { lat: -22.9, lng: -47.1, label: 'Campinas, Brasil' },
  'florianópolis':  { lat: -27.6, lng: -48.5, label: 'Florianópolis, Brasil' },
  'florianopolis':  { lat: -27.6, lng: -48.5, label: 'Florianópolis, Brasil' },
  'vitória':        { lat: -20.3, lng: -40.3, label: 'Vitória, Brasil' },
  'vitoria':        { lat: -20.3, lng: -40.3, label: 'Vitória, Brasil' },
  'natal':          { lat: -5.8,  lng: -35.2, label: 'Natal, Brasil' },
  'maceió':         { lat: -9.7,  lng: -35.7, label: 'Maceió, Brasil' },
  'maceio':         { lat: -9.7,  lng: -35.7, label: 'Maceió, Brasil' },
  'joão pessoa':    { lat: -7.1,  lng: -34.9, label: 'João Pessoa, Brasil' },
  'joao pessoa':    { lat: -7.1,  lng: -34.9, label: 'João Pessoa, Brasil' },
  'são luís':       { lat: -2.5,  lng: -44.3, label: 'São Luís, Brasil' },
  'sao luis':       { lat: -2.5,  lng: -44.3, label: 'São Luís, Brasil' },
  'teresina':       { lat: -5.1,  lng: -42.8, label: 'Teresina, Brasil' },
  'campo grande':   { lat: -20.4, lng: -54.6, label: 'Campo Grande, Brasil' },
  'cuiabá':         { lat: -15.6, lng: -56.1, label: 'Cuiabá, Brasil' },
  'cuiaba':         { lat: -15.6, lng: -56.1, label: 'Cuiabá, Brasil' },
  'aracaju':        { lat: -10.9, lng: -37.1, label: 'Aracaju, Brasil' },
  'londrina':       { lat: -23.3, lng: -51.2, label: 'Londrina, Brasil' },
  'joinville':      { lat: -26.3, lng: -48.8, label: 'Joinville, Brasil' },
  'santos':         { lat: -23.9, lng: -46.3, label: 'Santos, Brasil' },
  'jundiaí':        { lat: -23.2, lng: -46.9, label: 'Jundiaí, Brasil' },
  'jundiai':        { lat: -23.2, lng: -46.9, label: 'Jundiaí, Brasil' },
  'ribeirão preto': { lat: -21.2, lng: -47.8, label: 'Ribeirão Preto, Brasil' },
  'ribeirao preto': { lat: -21.2, lng: -47.8, label: 'Ribeirão Preto, Brasil' },
  'uberlândia':     { lat: -18.9, lng: -48.3, label: 'Uberlândia, Brasil' },
  'uberlandia':     { lat: -18.9, lng: -48.3, label: 'Uberlândia, Brasil' },
  'niterói':        { lat: -22.9, lng: -43.1, label: 'Niterói, Brasil' },
  'niteroi':        { lat: -22.9, lng: -43.1, label: 'Niterói, Brasil' },
  'guarulhos':      { lat: -23.5, lng: -46.5, label: 'Guarulhos, Brasil' },
  'osasco':         { lat: -23.5, lng: -46.8, label: 'Osasco, Brasil' },
  'são josé dos campos': { lat: -23.2, lng: -45.9, label: 'São José dos Campos, Brasil' },
  'sao jose dos campos': { lat: -23.2, lng: -45.9, label: 'São José dos Campos, Brasil' },
  'piracicaba':     { lat: -22.7, lng: -47.6, label: 'Piracicaba, Brasil' },
  'bauru':          { lat: -22.3, lng: -49.1, label: 'Bauru, Brasil' },
  'maringá':        { lat: -23.4, lng: -51.9, label: 'Maringá, Brasil' },
  'maringa':        { lat: -23.4, lng: -51.9, label: 'Maringá, Brasil' },

  // Internacional
  'buenos aires':   { lat: -34.6, lng: -58.4, label: 'Buenos Aires, Argentina' },
  'santiago':       { lat: -33.5, lng: -70.7, label: 'Santiago, Chile' },
  'lisboa':         { lat: 38.7,  lng: -9.1,  label: 'Lisboa, Portugal' },
  'porto':          { lat: 41.2,  lng: -8.6,  label: 'Porto, Portugal' },
  'paris':          { lat: 48.9,  lng: 2.3,   label: 'Paris, França' },
  'london':         { lat: 51.5,  lng: -0.1,  label: 'Londres, UK' },
  'londres':        { lat: 51.5,  lng: -0.1,  label: 'Londres, UK' },
  'new york':       { lat: 40.7,  lng: -74.0, label: 'Nova York, EUA' },
  'nova york':      { lat: 40.7,  lng: -74.0, label: 'Nova York, EUA' },
  'miami':          { lat: 25.8,  lng: -80.2, label: 'Miami, EUA' },
  'tokyo':          { lat: 35.7,  lng: 139.7, label: 'Tóquio, Japão' },
  'bogotá':         { lat: 4.7,   lng: -74.1, label: 'Bogotá, Colômbia' },
  'bogota':         { lat: 4.7,   lng: -74.1, label: 'Bogotá, Colômbia' },
  'lima':           { lat: -12.0, lng: -77.0, label: 'Lima, Peru' },
  'montevidéu':     { lat: -34.9, lng: -56.2, label: 'Montevidéu, Uruguai' },
  'montevideu':     { lat: -34.9, lng: -56.2, label: 'Montevidéu, Uruguai' },
  'madrid':         { lat: 40.4,  lng: -3.7,  label: 'Madrid, Espanha' },
  'roma':           { lat: 41.9,  lng: 12.5,  label: 'Roma, Itália' },
  'berlim':         { lat: 52.5,  lng: 13.4,  label: 'Berlim, Alemanha' },
}

/** Fallback: São Paulo */
const FALLBACK: CityCoords = { lat: -23.5, lng: -46.6, label: 'Brasil' }

/** Busca coordenadas por nome da cidade (case insensitive, fuzzy match) */
export function getCoords(city: string): CityCoords {
  const k = city.toLowerCase().trim()

  // Match exato
  if (CITY_DB[k]) return CITY_DB[k]

  // Match parcial: primeira palavra
  for (const key in CITY_DB) {
    if (k.includes(key) || key.includes(k.split(' ')[0])) {
      return CITY_DB[key]
    }
  }

  return { ...FALLBACK, label: city + ', Brasil' }
}