import { images } from '@/constants'

export const RANK_TIERS = [
  {
    minScore: 0,
    maxScore: 1000,
    rank: images.rankBronze,
    nextRank: images.rankSliver,
    nextScore: 1000,
    name: 'HẠNG ĐỒNG',
    nameNext: 'HẠNG BẠC',
  },
  {
    minScore: 1000,
    maxScore: 3000,
    rank: images.rankSliver,
    nextRank: images.rankGold,
    nextScore: 3000,
    name: 'HẠNG BẠC',
    nameNext: 'HẠNG VÀNG',
  },
  {
    minScore: 3000,
    maxScore: 5000,
    rank: images.rankGold,
    nextRank: images.rankPlatinum,
    nextScore: 5000,
    name: 'HẠNG VÀNG',
    nameNext: 'HẠNG PLATINUM',
  },
  {
    minScore: 5000,
    maxScore: 8000,
    rank: images.rankPlatinum,
    nextRank: images.rankDiamond,
    nextScore: 8000,
    name: 'HẠNG PLATINUM',
    nameNext: 'HẠNG KIM CƯƠNG',
  },
  {
    minScore: 8000,
    maxScore: Infinity,
    rank: images.rankDiamond,
    nextRank: images.rankDiamond,
    nextScore: Infinity,
    name: 'HẠNG KIM CƯƠNG',
    nameNext: 'HẠNG KIM CƯƠNG',
  },
]

export const listDefaultRank = [
  {
    image: images.rankBronze,
    name: 'Hạng Đồng',
    description: 'Mới học chơi, đang làm quen với các quân cờ và luật chơi cơ bản.',
    star: '0',
  },
  {
    image: images.rankSliver,
    name: 'Hạng Bạc',
    description: 'Biết chơi rồi! Bắt đầu học chiến thuật và cách bảo vệ Vua.',
    star: '1,000',
  },
  {
    image: images.rankGold,
    name: 'Hạng Vàng',
    description: 'Chơi khá cứng! Biết suy nghĩ trước vài nước và ra đòn bất ngờ',
    star: '3,000',
  },
  {
    image: images.rankPlatinum,
    name: 'Platinum',
    description: 'Chơi như pro! Gài bẫy, tính toán và lật ngược thế cờ.',
    star: '5,000',
  },
  {
    image: images.rankDiamond,
    name: 'Kim cương',
    description: 'Đỉnh cao cờ vua! Không ngán ai, tự tin đối đầu mọi thử thách.',
    star: '8,000',
  },
]
