/**
 * Comprehensive vegetable database for the Garden Planner
 * Contains 30+ common allotment vegetables with planting and care information
 * Planting times are based on UK climate zones
 */

import { Vegetable, VegetableCategory } from '@/types/garden-planner'

export const vegetables: Vegetable[] = [
  // ============ LEAFY GREENS ============
  {
    id: 'lettuce',
    name: 'Lettuce',
    category: 'leafy-greens',
    description: 'Fast-growing salad crop with many varieties. Great for succession planting.',
    planting: {
      sowIndoorsMonths: [2, 3],
      sowOutdoorsMonths: [3, 4, 5, 6, 7, 8],
      transplantMonths: [4, 5, 6, 7, 8],
      harvestMonths: [5, 6, 7, 8, 9, 10],
      daysToHarvest: { min: 45, max: 75 }
    },
    care: {
      sun: 'partial-shade',
      water: 'moderate',
      spacing: { between: 25, rows: 30 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Sow little and often for continuous harvest',
        'Bolts quickly in hot weather',
        'Harvest outer leaves for cut-and-come-again'
      ]
    },
    companionPlants: ['Carrots', 'Radishes', 'Strawberries', 'Chives'],
    avoidPlants: []
  },
  {
    id: 'spinach',
    name: 'Spinach',
    category: 'leafy-greens',
    description: 'Nutritious leafy green rich in iron. Prefers cooler temperatures.',
    planting: {
      sowIndoorsMonths: [2, 3],
      sowOutdoorsMonths: [3, 4, 5, 8, 9],
      transplantMonths: [4, 5],
      harvestMonths: [4, 5, 6, 7, 10, 11],
      daysToHarvest: { min: 40, max: 50 }
    },
    care: {
      sun: 'partial-shade',
      water: 'moderate',
      spacing: { between: 15, rows: 30 },
      depth: 2,
      difficulty: 'beginner',
      tips: [
        'Grows best in cool weather',
        'Mulch to keep roots cool in summer',
        'Pick outer leaves regularly'
      ]
    },
    companionPlants: ['Strawberries', 'Peas', 'Beans'],
    avoidPlants: []
  },
  {
    id: 'kale',
    name: 'Kale',
    category: 'leafy-greens',
    description: 'Hardy winter green that improves in flavor after frost.',
    planting: {
      sowIndoorsMonths: [3, 4, 5],
      sowOutdoorsMonths: [4, 5, 6, 7],
      transplantMonths: [5, 6, 7, 8],
      harvestMonths: [9, 10, 11, 12, 1, 2, 3],
      daysToHarvest: { min: 55, max: 75 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 45, rows: 60 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Frost improves flavor',
        'Harvest lower leaves first',
        'Net against pigeons and cabbage whites'
      ]
    },
    companionPlants: ['Beetroot', 'Celery', 'Onions', 'Potatoes'],
    avoidPlants: ['Strawberries', 'Tomatoes']
  },
  {
    id: 'chard',
    name: 'Swiss Chard',
    category: 'leafy-greens',
    description: 'Colorful, productive leafy green with edible stems.',
    planting: {
      sowIndoorsMonths: [3, 4],
      sowOutdoorsMonths: [4, 5, 6, 7],
      transplantMonths: [5, 6],
      harvestMonths: [6, 7, 8, 9, 10, 11],
      daysToHarvest: { min: 50, max: 60 }
    },
    care: {
      sun: 'partial-shade',
      water: 'moderate',
      spacing: { between: 30, rows: 45 },
      depth: 2,
      difficulty: 'beginner',
      tips: [
        'Cut-and-come-again harvesting',
        'Tolerates heat better than spinach',
        'Rainbow varieties are ornamental'
      ]
    },
    companionPlants: ['Beans', 'Brassicas', 'Onions'],
    avoidPlants: []
  },
  {
    id: 'rocket',
    name: 'Rocket (Arugula)',
    category: 'leafy-greens',
    description: 'Peppery salad leaf that grows quickly and easily.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [3, 4, 5, 6, 7, 8, 9],
      transplantMonths: [],
      harvestMonths: [4, 5, 6, 7, 8, 9, 10],
      daysToHarvest: { min: 21, max: 40 }
    },
    care: {
      sun: 'partial-shade',
      water: 'moderate',
      spacing: { between: 15, rows: 20 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Fast to bolt in heat',
        'Sow every 2-3 weeks for continuous harvest',
        'Pick leaves young for milder flavor'
      ]
    },
    companionPlants: ['Bush beans', 'Beets', 'Carrots', 'Lettuce'],
    avoidPlants: []
  },

  // ============ ROOT VEGETABLES ============
  {
    id: 'carrots',
    name: 'Carrots',
    category: 'root-vegetables',
    description: 'Sweet root vegetable available in many colors. Prefers loose, stone-free soil.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [3, 4, 5, 6, 7],
      transplantMonths: [],
      harvestMonths: [6, 7, 8, 9, 10, 11, 12],
      daysToHarvest: { min: 70, max: 80 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 5, rows: 30 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Thin seedlings for larger roots',
        'Sow thinly to reduce thinning',
        'Cover with fleece against carrot fly'
      ]
    },
    companionPlants: ['Onions', 'Leeks', 'Rosemary', 'Sage'],
    avoidPlants: ['Dill', 'Parsnips']
  },
  {
    id: 'potatoes',
    name: 'Potatoes',
    category: 'root-vegetables',
    description: 'Staple crop with early, second early, and maincrop varieties.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [3, 4, 5],
      transplantMonths: [],
      harvestMonths: [6, 7, 8, 9, 10],
      daysToHarvest: { min: 70, max: 140 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 30, rows: 60 },
      depth: 15,
      difficulty: 'beginner',
      tips: [
        'Chit seed potatoes before planting',
        'Earth up as plants grow',
        'Watch for blight in wet summers'
      ]
    },
    companionPlants: ['Beans', 'Cabbage', 'Corn', 'Horseradish'],
    avoidPlants: ['Tomatoes', 'Cucumbers', 'Squash']
  },
  {
    id: 'beetroot',
    name: 'Beetroot',
    category: 'root-vegetables',
    description: 'Versatile root vegetable with edible leaves. Easy to grow.',
    planting: {
      sowIndoorsMonths: [3, 4],
      sowOutdoorsMonths: [4, 5, 6, 7],
      transplantMonths: [5, 6],
      harvestMonths: [6, 7, 8, 9, 10, 11],
      daysToHarvest: { min: 50, max: 70 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 10, rows: 30 },
      depth: 2,
      difficulty: 'beginner',
      tips: [
        'Soak seeds before sowing',
        'Each seed cluster produces multiple plants',
        'Harvest young for tender roots'
      ]
    },
    companionPlants: ['Onions', 'Brassicas', 'Lettuce'],
    avoidPlants: ['Runner beans']
  },
  {
    id: 'parsnips',
    name: 'Parsnips',
    category: 'root-vegetables',
    description: 'Sweet winter root vegetable. Frost improves flavor.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [3, 4, 5],
      transplantMonths: [],
      harvestMonths: [10, 11, 12, 1, 2, 3],
      daysToHarvest: { min: 100, max: 130 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 15, rows: 30 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Use fresh seed each year',
        'Slow to germinate - be patient',
        'Leave in ground until after frost'
      ]
    },
    companionPlants: ['Onions', 'Garlic', 'Radishes'],
    avoidPlants: ['Carrots', 'Celery']
  },
  {
    id: 'radishes',
    name: 'Radishes',
    category: 'root-vegetables',
    description: 'Quick-growing root crop ideal for beginners and intercropping.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [3, 4, 5, 6, 7, 8, 9],
      transplantMonths: [],
      harvestMonths: [4, 5, 6, 7, 8, 9, 10],
      daysToHarvest: { min: 25, max: 35 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 3, rows: 15 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Harvest promptly to avoid woodiness',
        'Great for intercropping',
        'Sow little and often'
      ]
    },
    companionPlants: ['Carrots', 'Lettuce', 'Peas', 'Spinach'],
    avoidPlants: ['Hyssop']
  },
  {
    id: 'turnips',
    name: 'Turnips',
    category: 'root-vegetables',
    description: 'Fast-growing root with edible greens. Best harvested young.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [3, 4, 5, 7, 8],
      transplantMonths: [],
      harvestMonths: [5, 6, 7, 9, 10, 11],
      daysToHarvest: { min: 40, max: 60 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 15, rows: 30 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Harvest when golf ball sized',
        'Young leaves are edible',
        'Fast summer varieties available'
      ]
    },
    companionPlants: ['Peas', 'Beans'],
    avoidPlants: ['Potatoes']
  },

  // ============ BRASSICAS ============
  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'brassicas',
    description: 'Classic vegetable with spring, summer, autumn and winter varieties.',
    planting: {
      sowIndoorsMonths: [2, 3, 4, 5],
      sowOutdoorsMonths: [4, 5],
      transplantMonths: [4, 5, 6, 7],
      harvestMonths: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3],
      daysToHarvest: { min: 70, max: 120 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 45, rows: 60 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Net against pigeons and butterflies',
        'Firm soil well when transplanting',
        'Collar against cabbage root fly'
      ]
    },
    companionPlants: ['Beetroot', 'Celery', 'Onions', 'Potatoes'],
    avoidPlants: ['Strawberries', 'Tomatoes']
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: 'brassicas',
    description: 'Nutritious vegetable producing multiple side shoots after main head.',
    planting: {
      sowIndoorsMonths: [3, 4, 5],
      sowOutdoorsMonths: [],
      transplantMonths: [5, 6, 7],
      harvestMonths: [7, 8, 9, 10, 11],
      daysToHarvest: { min: 60, max: 90 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 45, rows: 60 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Harvest before flowers open',
        'Cut main head to encourage side shoots',
        'Net against pests'
      ]
    },
    companionPlants: ['Beetroot', 'Celery', 'Onions', 'Potatoes'],
    avoidPlants: ['Strawberries', 'Tomatoes']
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    category: 'brassicas',
    description: 'Demanding but rewarding crop with beautiful white curds.',
    planting: {
      sowIndoorsMonths: [1, 2, 3, 4, 5],
      sowOutdoorsMonths: [],
      transplantMonths: [4, 5, 6, 7],
      harvestMonths: [6, 7, 8, 9, 10, 11],
      daysToHarvest: { min: 80, max: 120 }
    },
    care: {
      sun: 'full-sun',
      water: 'high',
      spacing: { between: 60, rows: 60 },
      depth: 1,
      difficulty: 'advanced',
      tips: [
        'Keep consistently watered',
        'Bend leaves over curd to protect',
        'Needs rich, firm soil'
      ]
    },
    companionPlants: ['Beetroot', 'Celery', 'Beans'],
    avoidPlants: ['Strawberries', 'Tomatoes']
  },
  {
    id: 'brussels-sprouts',
    name: 'Brussels Sprouts',
    category: 'brassicas',
    description: 'Winter staple that improves after frost. Long growing season.',
    planting: {
      sowIndoorsMonths: [2, 3, 4],
      sowOutdoorsMonths: [],
      transplantMonths: [5, 6],
      harvestMonths: [10, 11, 12, 1, 2, 3],
      daysToHarvest: { min: 150, max: 180 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 60, rows: 75 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Stake tall plants',
        'Remove yellowing lower leaves',
        'Harvest from bottom up'
      ]
    },
    companionPlants: ['Beetroot', 'Carrots', 'Onions'],
    avoidPlants: ['Strawberries', 'Tomatoes']
  },

  // ============ LEGUMES ============
  {
    id: 'runner-beans',
    name: 'Runner Beans',
    category: 'legumes',
    description: 'Prolific climbing bean. Traditional British favorite.',
    planting: {
      sowIndoorsMonths: [4, 5],
      sowOutdoorsMonths: [5, 6],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9, 10],
      daysToHarvest: { min: 60, max: 75 }
    },
    care: {
      sun: 'full-sun',
      water: 'high',
      spacing: { between: 15, rows: 60 },
      depth: 5,
      difficulty: 'beginner',
      tips: [
        'Need sturdy supports',
        'Pick regularly for more beans',
        'Water well especially when flowering'
      ]
    },
    companionPlants: ['Carrots', 'Corn', 'Squash', 'Cabbage'],
    avoidPlants: ['Onions', 'Garlic', 'Fennel']
  },
  {
    id: 'french-beans',
    name: 'French Beans',
    category: 'legumes',
    description: 'Bush or climbing beans with tender pods. Easy to grow.',
    planting: {
      sowIndoorsMonths: [4, 5],
      sowOutdoorsMonths: [5, 6, 7],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9, 10],
      daysToHarvest: { min: 55, max: 65 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 10, rows: 45 },
      depth: 5,
      difficulty: 'beginner',
      tips: [
        'Bush varieties need no support',
        'Harvest when pencil thin',
        'Sow successionally for longer harvest'
      ]
    },
    companionPlants: ['Carrots', 'Corn', 'Cucumber', 'Cabbage'],
    avoidPlants: ['Onions', 'Garlic']
  },
  {
    id: 'broad-beans',
    name: 'Broad Beans',
    category: 'legumes',
    description: 'Hardy beans that can be autumn or spring sown.',
    planting: {
      sowIndoorsMonths: [2, 3],
      sowOutdoorsMonths: [2, 3, 4, 10, 11],
      transplantMonths: [],
      harvestMonths: [5, 6, 7, 8],
      daysToHarvest: { min: 80, max: 100 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 20, rows: 45 },
      depth: 5,
      difficulty: 'beginner',
      tips: [
        'Pinch out tips when first pods form',
        'Support tall varieties',
        'Watch for blackfly on tips'
      ]
    },
    companionPlants: ['Brassicas', 'Carrots', 'Celery', 'Potatoes'],
    avoidPlants: ['Onions', 'Garlic']
  },
  {
    id: 'peas',
    name: 'Peas',
    category: 'legumes',
    description: 'Sweet garden peas including mange tout and sugar snap varieties.',
    planting: {
      sowIndoorsMonths: [2, 3],
      sowOutdoorsMonths: [3, 4, 5, 6, 7],
      transplantMonths: [4, 5],
      harvestMonths: [6, 7, 8, 9],
      daysToHarvest: { min: 60, max: 80 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 5, rows: 60 },
      depth: 5,
      difficulty: 'beginner',
      tips: [
        'Provide support for climbing',
        'Sow in guttering for easy planting out',
        'Mulch to keep roots cool'
      ]
    },
    companionPlants: ['Carrots', 'Radishes', 'Turnips', 'Corn'],
    avoidPlants: ['Onions', 'Garlic']
  },

  // ============ SOLANACEAE ============
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    category: 'solanaceae',
    description: 'Popular summer crop with hundreds of varieties. Bush or cordon types.',
    planting: {
      sowIndoorsMonths: [2, 3, 4],
      sowOutdoorsMonths: [],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9, 10],
      daysToHarvest: { min: 60, max: 85 }
    },
    care: {
      sun: 'full-sun',
      water: 'high',
      spacing: { between: 45, rows: 60 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Remove side shoots on cordon types',
        'Feed weekly when fruiting',
        'Water consistently to prevent splitting'
      ]
    },
    companionPlants: ['Basil', 'Carrots', 'Marigolds', 'Peppers'],
    avoidPlants: ['Fennel', 'Brassicas', 'Corn']
  },
  {
    id: 'peppers',
    name: 'Sweet Peppers',
    category: 'solanaceae',
    description: 'Colorful bell peppers. Best grown under cover in cooler climates.',
    planting: {
      sowIndoorsMonths: [2, 3],
      sowOutdoorsMonths: [],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9, 10],
      daysToHarvest: { min: 60, max: 90 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 45, rows: 45 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Start early indoors',
        'Best in greenhouse or polytunnel',
        'Pinch growing tip at 30cm for bushier plants'
      ]
    },
    companionPlants: ['Tomatoes', 'Basil', 'Carrots', 'Onions'],
    avoidPlants: ['Fennel', 'Beans']
  },
  {
    id: 'chillies',
    name: 'Chillies',
    category: 'solanaceae',
    description: 'Hot peppers in various heat levels. Excellent container plants.',
    planting: {
      sowIndoorsMonths: [1, 2, 3],
      sowOutdoorsMonths: [],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9, 10],
      daysToHarvest: { min: 70, max: 120 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 40, rows: 40 },
      depth: 1,
      difficulty: 'intermediate',
      tips: [
        'Need long growing season - start early',
        'Great for pots and containers',
        'Dry or freeze excess harvest'
      ]
    },
    companionPlants: ['Tomatoes', 'Basil', 'Carrots'],
    avoidPlants: ['Fennel']
  },
  {
    id: 'aubergine',
    name: 'Aubergine (Eggplant)',
    category: 'solanaceae',
    description: 'Glossy purple fruits. Needs warmth and long growing season.',
    planting: {
      sowIndoorsMonths: [2, 3],
      sowOutdoorsMonths: [],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9],
      daysToHarvest: { min: 80, max: 100 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 60, rows: 60 },
      depth: 1,
      difficulty: 'advanced',
      tips: [
        'Best under cover',
        'Limit to 4-5 fruits per plant',
        'Stake plants when fruiting'
      ]
    },
    companionPlants: ['Peppers', 'Tomatoes', 'Beans'],
    avoidPlants: ['Fennel']
  },

  // ============ CUCURBITS ============
  {
    id: 'courgettes',
    name: 'Courgettes (Zucchini)',
    category: 'cucurbits',
    description: 'Prolific summer squash. Pick regularly for best yields.',
    planting: {
      sowIndoorsMonths: [4, 5],
      sowOutdoorsMonths: [5, 6],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9, 10],
      daysToHarvest: { min: 45, max: 60 }
    },
    care: {
      sun: 'full-sun',
      water: 'high',
      spacing: { between: 90, rows: 90 },
      depth: 2,
      difficulty: 'beginner',
      tips: [
        'Pick when 10-15cm long',
        'One or two plants is enough',
        'Remove lower leaves for air circulation'
      ]
    },
    companionPlants: ['Beans', 'Corn', 'Nasturtiums', 'Radishes'],
    avoidPlants: ['Potatoes']
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'cucurbits',
    description: 'Climbing or trailing vine. Indoor and outdoor varieties available.',
    planting: {
      sowIndoorsMonths: [4, 5],
      sowOutdoorsMonths: [5, 6],
      transplantMonths: [5, 6],
      harvestMonths: [7, 8, 9],
      daysToHarvest: { min: 50, max: 70 }
    },
    care: {
      sun: 'full-sun',
      water: 'high',
      spacing: { between: 45, rows: 90 },
      depth: 2,
      difficulty: 'intermediate',
      tips: [
        'Keep consistently watered',
        'Train up supports',
        'Pick regularly to encourage more fruits'
      ]
    },
    companionPlants: ['Beans', 'Corn', 'Peas', 'Radishes'],
    avoidPlants: ['Potatoes', 'Aromatic herbs']
  },
  {
    id: 'squash',
    name: 'Winter Squash',
    category: 'cucurbits',
    description: 'Includes butternut, crown prince, and more. Stores well.',
    planting: {
      sowIndoorsMonths: [4, 5],
      sowOutdoorsMonths: [5, 6],
      transplantMonths: [5, 6],
      harvestMonths: [9, 10],
      daysToHarvest: { min: 85, max: 110 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 90, rows: 120 },
      depth: 2,
      difficulty: 'beginner',
      tips: [
        'Needs space to sprawl',
        'Cure in sun before storing',
        'Limit fruits for larger squash'
      ]
    },
    companionPlants: ['Beans', 'Corn', 'Nasturtiums'],
    avoidPlants: ['Potatoes']
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'cucurbits',
    description: 'Traditional autumn favourite. Various sizes available.',
    planting: {
      sowIndoorsMonths: [4, 5],
      sowOutdoorsMonths: [5, 6],
      transplantMonths: [5, 6],
      harvestMonths: [9, 10],
      daysToHarvest: { min: 90, max: 120 }
    },
    care: {
      sun: 'full-sun',
      water: 'high',
      spacing: { between: 120, rows: 180 },
      depth: 2,
      difficulty: 'beginner',
      tips: [
        'Very space hungry',
        'Place boards under fruits',
        'Cut with stem attached for storage'
      ]
    },
    companionPlants: ['Corn', 'Beans', 'Nasturtiums'],
    avoidPlants: ['Potatoes']
  },

  // ============ ALLIUMS ============
  {
    id: 'onions',
    name: 'Onions',
    category: 'alliums',
    description: 'Kitchen essential grown from sets or seed. Many varieties.',
    planting: {
      sowIndoorsMonths: [1, 2],
      sowOutdoorsMonths: [3, 4],
      transplantMonths: [3, 4],
      harvestMonths: [7, 8, 9],
      daysToHarvest: { min: 100, max: 175 }
    },
    care: {
      sun: 'full-sun',
      water: 'low',
      spacing: { between: 10, rows: 30 },
      depth: 2,
      difficulty: 'beginner',
      tips: [
        'Sets are easier than seed',
        'Stop watering when leaves fall over',
        'Cure in sun before storing'
      ]
    },
    companionPlants: ['Carrots', 'Beetroot', 'Lettuce', 'Tomatoes'],
    avoidPlants: ['Beans', 'Peas']
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'alliums',
    description: 'Plant in autumn for summer harvest. Easy and rewarding.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [10, 11, 2, 3],
      transplantMonths: [],
      harvestMonths: [6, 7, 8],
      daysToHarvest: { min: 180, max: 270 }
    },
    care: {
      sun: 'full-sun',
      water: 'low',
      spacing: { between: 15, rows: 30 },
      depth: 5,
      difficulty: 'beginner',
      tips: [
        'Autumn planting gives bigger bulbs',
        'Remove flower stalks (scapes)',
        'Harvest when lower leaves yellow'
      ]
    },
    companionPlants: ['Roses', 'Tomatoes', 'Beetroot'],
    avoidPlants: ['Beans', 'Peas']
  },
  {
    id: 'leeks',
    name: 'Leeks',
    category: 'alliums',
    description: 'Hardy winter vegetable. Mild onion flavor.',
    planting: {
      sowIndoorsMonths: [2, 3],
      sowOutdoorsMonths: [3, 4],
      transplantMonths: [5, 6, 7],
      harvestMonths: [9, 10, 11, 12, 1, 2, 3, 4],
      daysToHarvest: { min: 120, max: 150 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 15, rows: 30 },
      depth: 15,
      difficulty: 'beginner',
      tips: [
        'Plant in deep holes for blanched stems',
        'Earth up as they grow',
        'Harvest as needed through winter'
      ]
    },
    companionPlants: ['Carrots', 'Celery', 'Onions'],
    avoidPlants: ['Beans', 'Peas']
  },
  {
    id: 'spring-onions',
    name: 'Spring Onions',
    category: 'alliums',
    description: 'Quick-growing salad onion. Sow successionally.',
    planting: {
      sowIndoorsMonths: [],
      sowOutdoorsMonths: [3, 4, 5, 6, 7, 8],
      transplantMonths: [],
      harvestMonths: [5, 6, 7, 8, 9, 10],
      daysToHarvest: { min: 60, max: 80 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 2, rows: 15 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Sow every 2-3 weeks',
        'Can be grown in containers',
        'Harvest when pencil thickness'
      ]
    },
    companionPlants: ['Carrots', 'Lettuce', 'Tomatoes'],
    avoidPlants: ['Beans', 'Peas']
  },

  // ============ HERBS ============
  {
    id: 'basil',
    name: 'Basil',
    category: 'herbs',
    description: 'Aromatic herb essential for Mediterranean cooking. Frost tender.',
    planting: {
      sowIndoorsMonths: [3, 4, 5],
      sowOutdoorsMonths: [5, 6],
      transplantMonths: [5, 6],
      harvestMonths: [6, 7, 8, 9],
      daysToHarvest: { min: 40, max: 60 }
    },
    care: {
      sun: 'full-sun',
      water: 'moderate',
      spacing: { between: 20, rows: 30 },
      depth: 0.5,
      difficulty: 'beginner',
      tips: [
        'Pinch out flower heads',
        'Water from below to prevent disease',
        'Harvest from the top down'
      ]
    },
    companionPlants: ['Tomatoes', 'Peppers', 'Oregano'],
    avoidPlants: ['Sage', 'Rue']
  },
  {
    id: 'parsley',
    name: 'Parsley',
    category: 'herbs',
    description: 'Versatile herb for cooking. Flat-leaf and curly varieties.',
    planting: {
      sowIndoorsMonths: [3, 4],
      sowOutdoorsMonths: [4, 5, 6, 7],
      transplantMonths: [5, 6],
      harvestMonths: [5, 6, 7, 8, 9, 10, 11],
      daysToHarvest: { min: 70, max: 90 }
    },
    care: {
      sun: 'partial-shade',
      water: 'moderate',
      spacing: { between: 20, rows: 30 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Slow to germinate - be patient',
        'Soak seeds overnight before sowing',
        'Cut outer stems first'
      ]
    },
    companionPlants: ['Tomatoes', 'Asparagus', 'Roses'],
    avoidPlants: ['Lettuce']
  },
  {
    id: 'coriander',
    name: 'Coriander (Cilantro)',
    category: 'herbs',
    description: 'Fast-growing herb that bolts quickly in heat. Seeds also useful.',
    planting: {
      sowIndoorsMonths: [3, 4],
      sowOutdoorsMonths: [4, 5, 6, 7, 8],
      transplantMonths: [],
      harvestMonths: [5, 6, 7, 8, 9, 10],
      daysToHarvest: { min: 40, max: 60 }
    },
    care: {
      sun: 'partial-shade',
      water: 'moderate',
      spacing: { between: 15, rows: 20 },
      depth: 1,
      difficulty: 'beginner',
      tips: [
        'Bolts quickly in hot weather',
        'Sow every 2-3 weeks',
        'Let some plants set seed for coriander seeds'
      ]
    },
    companionPlants: ['Spinach', 'Tomatoes', 'Peppers'],
    avoidPlants: ['Fennel']
  },
  {
    id: 'mint',
    name: 'Mint',
    category: 'herbs',
    description: 'Vigorous perennial herb. Best grown in containers to contain spread.',
    planting: {
      sowIndoorsMonths: [3, 4],
      sowOutdoorsMonths: [4, 5],
      transplantMonths: [4, 5, 6],
      harvestMonths: [5, 6, 7, 8, 9, 10],
      daysToHarvest: { min: 60, max: 90 }
    },
    care: {
      sun: 'partial-shade',
      water: 'high',
      spacing: { between: 45, rows: 45 },
      depth: 0.5,
      difficulty: 'beginner',
      tips: [
        'Contains invasive roots',
        'Best grown in pots sunk into ground',
        'Cut back after flowering'
      ]
    },
    companionPlants: ['Cabbage', 'Tomatoes', 'Peas'],
    avoidPlants: ['Chamomile', 'Parsley']
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    category: 'herbs',
    description: 'Woody perennial herb. Drought tolerant once established.',
    planting: {
      sowIndoorsMonths: [3, 4],
      sowOutdoorsMonths: [],
      transplantMonths: [5, 6, 9, 10],
      harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      daysToHarvest: { min: 365, max: 730 }
    },
    care: {
      sun: 'full-sun',
      water: 'low',
      spacing: { between: 60, rows: 60 },
      depth: 0.5,
      difficulty: 'beginner',
      tips: [
        'Prefers poor, well-drained soil',
        'Protect from cold winds',
        'Prune after flowering'
      ]
    },
    companionPlants: ['Beans', 'Cabbage', 'Carrots', 'Sage'],
    avoidPlants: []
  },
  {
    id: 'thyme',
    name: 'Thyme',
    category: 'herbs',
    description: 'Low-growing perennial herb. Many varieties available.',
    planting: {
      sowIndoorsMonths: [3, 4],
      sowOutdoorsMonths: [5, 6],
      transplantMonths: [5, 6, 9],
      harvestMonths: [5, 6, 7, 8, 9, 10],
      daysToHarvest: { min: 90, max: 180 }
    },
    care: {
      sun: 'full-sun',
      water: 'low',
      spacing: { between: 30, rows: 30 },
      depth: 0.5,
      difficulty: 'beginner',
      tips: [
        'Needs well-drained soil',
        'Trim after flowering',
        'Replace every 3-4 years'
      ]
    },
    companionPlants: ['Cabbage', 'Tomatoes', 'Aubergine'],
    avoidPlants: []
  }
]

// Helper functions for working with vegetable data
export function getVegetableById(id: string): Vegetable | undefined {
  return vegetables.find(v => v.id === id)
}

export function getVegetablesByCategory(category: VegetableCategory): Vegetable[] {
  return vegetables.filter(v => v.category === category)
}

export function searchVegetables(query: string): Vegetable[] {
  const lowerQuery = query.toLowerCase()
  return vegetables.filter(v => 
    v.name.toLowerCase().includes(lowerQuery) ||
    v.description.toLowerCase().includes(lowerQuery)
  )
}

export function getVegetablesForMonth(month: number, type: 'sow' | 'harvest'): Vegetable[] {
  return vegetables.filter(v => {
    if (type === 'sow') {
      return v.planting.sowOutdoorsMonths.includes(month as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12) ||
             v.planting.sowIndoorsMonths.includes(month as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)
    }
    return v.planting.harvestMonths.includes(month as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)
  })
}

export function getAllCategories(): VegetableCategory[] {
  return [...new Set(vegetables.map(v => v.category))]
}

