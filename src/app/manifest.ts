import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Brazil MEI',
    short_name: 'Brazil MEI',
    description: 'Inteligência prática para Microempreendedores Individuais no Brasil — DAS, faturamento, DASN-SIMEI, nota fiscal, obrigações e ferramentas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}