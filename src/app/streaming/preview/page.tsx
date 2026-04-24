'use client'

import StreamingPlayer from '@/app/streaming/[slug]/StreamingPlayer'
import type { StreamingDados } from '@/app/streaming/[slug]/page'

const MOCK_DADOS: StreamingDados = {
  nome1: 'Gabriel',
  nome2: 'Maria',
  data_inicio: '2022-03-15',
  cidade: 'Sorocaba',
  mensagem: 'Você é o melhor episódio da minha vida. Te amo infinito.',
  msg_final: 'Do primeiro episódio até aqui, cada cena com você foi a melhor parte.\n\nObrigado por ser meu par favorito nessa série que a gente escreve junto, sem roteiro, sem spoiler.\n\nTe amo mais que qualquer final de temporada. 🎬❤️',
  pos_creditos: 'Avengers: Doomsday',
  sinopse: 'Uma história que começou com um olhar e virou a melhor série de todos os tempos.',
  conquistas: [
    { key: 'inveja' },
    { key: 'melhor_casal' },
    { key: 'melhor_quimica' },
    { key: 'melhor_comedia' },
    { key: 'spinoff_pet' },
    { key: 'cenario_novo' },
    { key: 'ep_caotico' },
    { key: 'playlist_casal' },
  ],
  fotos: [
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    'https://images.unsplash.com/photo-1621112904887-419379ce6824?w=800&q=80',
  ],
  fotos_titulos: [
    'O Começo de Tudo',
    'Nosso Primeiro Cinema',
    'Aquela Viagem Inesquecível',
    'Domingo em Casa',
  ],
  musica: { videoId: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
  quiz: [
    {
      pergunta: 'Onde foi nosso primeiro encontro?',
      opcoes: ['Shopping', 'Parque', 'Cafeteria', 'Cinema'],
      correta: 2,
    },
    {
      pergunta: 'Qual filme assistimos juntos primeiro?',
      opcoes: ['Titanic', 'Up', 'La La Land', 'Interestelar'],
      correta: 3,
    },
  ],
}

export default function StreamingPreviewPage() {
  return <StreamingPlayer dados={MOCK_DADOS} />
}