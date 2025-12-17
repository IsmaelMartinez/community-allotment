'use client'

import Link from 'next/link'
import { RotateCcw, Leaf, Bug, Flower2, Sprout, ArrowRight, Star, Info, CheckCircle, AlertTriangle, Calendar } from 'lucide-react'

const rotationBenefits = [
  {
    icon: Leaf,
    title: 'Soil Health',
    description: 'Different plant families use different nutrients. Rotation prevents soil depletion and maintains fertility.',
    detail: 'Legumes fix nitrogen, heavy feeders use it, light feeders give soil a rest.'
  },
  {
    icon: Bug,
    title: 'Pest & Disease Control',
    description: 'Many pests and diseases are family-specific. Moving crops breaks their life cycles.',
    detail: 'Club root, carrot fly, and blight are reduced through proper rotation.'
  },
  {
    icon: Flower2,
    title: 'Weed Suppression',
    description: 'Different crops compete with weeds differently. Varying your plantings keeps weeds in check.',
    detail: 'Fast-growing brassicas smother weeds; roots break up compacted soil.'
  },
  {
    icon: Sprout,
    title: 'Better Yields',
    description: 'Crops grow stronger in fresh soil. Following rotation guidelines maximizes your harvest.',
    detail: 'Studies show 15-25% yield increase with proper rotation practices.'
  }
]

const rotationCycle = [
  {
    year: 'Year 1',
    group: 'Legumes',
    color: 'bg-lime-500',
    borderColor: 'border-lime-500',
    description: 'Beans and peas fix nitrogen in the soil through their root nodules.',
    vegetables: ['Broad Beans', 'Runner Beans', 'French Beans', 'Peas'],
    benefit: 'Nitrogen fixers - enrich the soil for next year\'s heavy feeders'
  },
  {
    year: 'Year 2',
    group: 'Brassicas',
    color: 'bg-purple-500',
    borderColor: 'border-purple-500',
    description: 'Heavy feeders that use the nitrogen fixed by legumes in the previous year.',
    vegetables: ['Cabbage', 'Broccoli', 'Cauliflower', 'Brussels Sprouts', 'Kale'],
    benefit: 'Heavy feeders - use up the nitrogen left by legumes'
  },
  {
    year: 'Year 3',
    group: 'Roots & Others',
    color: 'bg-orange-500',
    borderColor: 'border-orange-500',
    description: 'Light feeders that thrive in less rich soil and break pest cycles.',
    vegetables: ['Carrots', 'Parsnips', 'Beetroot', 'Onions', 'Garlic', 'Lettuce'],
    benefit: 'Light feeders - rest the soil and break pest cycles'
  }
]

const rotationGroups = [
  {
    name: 'Brassicas (Cabbage Family)',
    color: 'bg-purple-100 border-purple-400',
    textColor: 'text-purple-800',
    vegetables: ['Cabbage', 'Broccoli', 'Cauliflower', 'Brussels Sprouts', 'Kale', 'Kohlrabi', 'Swede'],
    notes: 'Heavy feeders. Prone to club root - never plant in same spot within 4 years if infected.',
    icon: '🥦'
  },
  {
    name: 'Legumes (Beans & Peas)',
    color: 'bg-lime-100 border-lime-400',
    textColor: 'text-lime-800',
    vegetables: ['Broad Beans', 'Runner Beans', 'French Beans', 'Peas'],
    notes: 'Nitrogen fixers. Leave roots in ground after harvest to release nitrogen.',
    icon: '🫛'
  },
  {
    name: 'Roots & Leafy Greens',
    color: 'bg-orange-100 border-orange-400',
    textColor: 'text-orange-800',
    vegetables: ['Carrots', 'Parsnips', 'Beetroot', 'Turnips', 'Radishes', 'Lettuce', 'Spinach', 'Chard'],
    notes: 'Light feeders. Carrots and parsnips attract carrot fly - use barriers.',
    icon: '🥕'
  },
  {
    name: 'Solanaceae (Nightshades)',
    color: 'bg-red-100 border-red-400',
    textColor: 'text-red-800',
    vegetables: ['Tomatoes', 'Peppers', 'Chillies', 'Potatoes', 'Aubergines'],
    notes: 'Susceptible to blight. Never follow potatoes with tomatoes or vice versa.',
    icon: '🍅'
  },
  {
    name: 'Alliums (Onion Family)',
    color: 'bg-amber-100 border-amber-400',
    textColor: 'text-amber-800',
    vegetables: ['Onions', 'Garlic', 'Leeks', 'Shallots', 'Spring Onions'],
    notes: 'Repel many pests. Plant near carrots for mutual protection.',
    icon: '🧅'
  },
  {
    name: 'Cucurbits (Squash Family)',
    color: 'bg-yellow-100 border-yellow-400',
    textColor: 'text-yellow-800',
    vegetables: ['Courgettes', 'Cucumbers', 'Squash', 'Pumpkins', 'Melons'],
    notes: 'Heavy feeders and space-hungry. Benefit from compost-rich soil.',
    icon: '🥒'
  },
  {
    name: 'Perennial Herbs',
    color: 'bg-emerald-100 border-emerald-400',
    textColor: 'text-emerald-800',
    vegetables: ['Rosemary', 'Thyme', 'Sage', 'Mint', 'Chives', 'Oregano'],
    notes: 'Don\'t need rotation - give them a permanent spot in your garden.',
    icon: '🌿'
  }
]

const planningTips = [
  {
    title: 'Draw Your Plot',
    description: 'Sketch your allotment divided into sections. Label each section for the current year.',
    icon: '📝'
  },
  {
    title: 'Keep Records',
    description: 'Note what you planted where each year. This is essential for tracking rotation.',
    icon: '📋'
  },
  {
    title: 'Plan 3 Years Ahead',
    description: 'Map out your rotation for the next 3 years so you know what\'s coming where.',
    icon: '📅'
  },
  {
    title: 'Use Markers',
    description: 'Label your beds with the rotation group to avoid confusion during planting.',
    icon: '🏷️'
  }
]

const seasonalTips = [
  {
    season: 'Winter',
    icon: '❄️',
    tips: [
      'Plan next year\'s rotation on paper',
      'Review this year\'s records and yields',
      'Order seeds based on your rotation plan',
      'Prepare beds for early spring planting'
    ]
  },
  {
    season: 'Spring',
    icon: '🌱',
    tips: [
      'Plant legumes to start fixing nitrogen',
      'Sow brassica seeds indoors for transplanting',
      'Prepare root vegetable beds with fine tilth',
      'Add compost to heavy-feeder sections'
    ]
  },
  {
    season: 'Summer',
    icon: '☀️',
    tips: [
      'Transplant brassicas to their rotation beds',
      'Successional sow roots and salads',
      'Watch for family-specific pests',
      'Keep rotation beds clearly marked'
    ]
  },
  {
    season: 'Autumn',
    icon: '🍂',
    tips: [
      'Cut legume plants but leave roots in soil',
      'Add green manure to resting beds',
      'Record final yields by rotation group',
      'Plant garlic for next year\'s allium bed'
    ]
  }
]

const commonMistakes = [
  {
    mistake: 'Planting potatoes after tomatoes',
    why: 'Both are nightshades - shares blight and soil-borne diseases',
    fix: 'Wait at least 2 years between any nightshade crops'
  },
  {
    mistake: 'Growing brassicas in the same spot yearly',
    why: 'Club root builds up in soil and persists for 20+ years',
    fix: 'Rotate brassicas on a minimum 4-year cycle'
  },
  {
    mistake: 'Ignoring the "other" crops',
    why: 'Cucurbits and alliums also have specific pests and needs',
    fix: 'Include all families in your rotation plan'
  },
  {
    mistake: 'Not keeping records',
    why: 'It\'s impossible to remember what grew where 3 years ago',
    fix: 'Use a garden journal, app, or our Garden Planner'
  }
]

export default function CropRotationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <RotateCcw className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Crop Rotation Guide</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Master the art of crop rotation to maintain healthy soil, reduce pests and diseases, 
            and maximize your allotment yields year after year.
          </p>
        </div>

        {/* Why Rotate Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Why Crop Rotation Matters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rotationBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <benefit.icon className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                  <p className="text-xs text-green-700">{benefit.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Year Rotation Cycle */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            The Simple 3-Year Rotation
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow this classic rotation to keep your soil healthy and your crops thriving. 
            Each year, move your crop groups to the next section.
          </p>
          
          {/* Rotation Visual */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-8">
            {rotationCycle.map((year, index) => (
              <div key={year.year} className="flex items-center">
                <div className={`bg-white rounded-xl p-6 shadow-lg border-t-4 ${year.borderColor} w-full lg:w-72`}>
                  <div className="flex items-center mb-3">
                    <span className={`${year.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {year.year}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{year.group}</h3>
                  <p className="text-sm text-gray-600 mb-4">{year.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {year.vegetables.slice(0, 4).map((veg) => (
                      <span key={veg} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {veg}
                      </span>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600 flex items-start">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                      {year.benefit}
                    </p>
                  </div>
                </div>
                {index < rotationCycle.length - 1 && (
                  <ArrowRight className="w-8 h-8 text-gray-400 mx-2 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
          
          {/* Then back to Year 1 indicator */}
          <div className="flex justify-center">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Then back to Year 1 - Legumes</span>
            </div>
          </div>
        </section>

        {/* All Rotation Groups */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            All Rotation Groups
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Understanding which vegetables belong to which family is key to successful rotation. 
            Here are the main groups you&apos;ll work with.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rotationGroups.map((group) => (
              <div key={group.name} className={`bg-white rounded-lg p-6 shadow-lg border-l-4 ${group.color}`}>
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">{group.icon}</span>
                  <h3 className={`text-lg font-bold ${group.textColor}`}>{group.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.vegetables.map((veg) => (
                    <span key={veg} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {veg}
                    </span>
                  ))}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600 flex items-start">
                    <Info className="w-3 h-3 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                    {group.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Planning Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Planning Your Rotation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planningTips.map((tip, index) => (
              <div key={tip.title} className="bg-white rounded-lg p-6 shadow-lg text-center">
                <div className="text-4xl mb-3">{tip.icon}</div>
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Seasonal Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Seasonal Rotation Calendar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalTips.map((season) => (
              <div key={season.season} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-2">{season.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800">{season.season}</h3>
                </div>
                <ul className="space-y-2">
                  {season.tips.map((tip) => (
                    <li key={tip} className="flex items-start">
                      <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Common Rotation Mistakes to Avoid
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {commonMistakes.map((item) => (
              <div key={item.mistake} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-start mb-3">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" />
                  <h3 className="text-lg font-bold text-gray-800">{item.mistake}</h3>
                </div>
                <div className="ml-9">
                  <p className="text-sm text-red-600 mb-2">
                    <strong>Why it&apos;s a problem:</strong> {item.why}
                  </p>
                  <p className="text-sm text-green-600 flex items-start">
                    <CheckCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span><strong>Solution:</strong> {item.fix}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Garden Planner CTA */}
        <section className="mb-12 bg-gradient-to-r from-green-600 to-orange-500 rounded-lg p-8 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Track Your Rotation Digitally</h2>
            </div>
            <p className="text-lg mb-6 text-green-100">
              Our Garden Planner includes built-in rotation tracking. Plan your beds, 
              assign crops, and the system will warn you about rotation conflicts!
            </p>
            <Link 
              href="/garden-planner" 
              className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Open Garden Planner
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* AI Advisor CTA */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <RotateCcw className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Need Rotation Help?</h2>
            </div>
            <p className="text-lg mb-6 text-green-100">
              Get personalized crop rotation advice from our AI garden expert, Aitor. 
              Ask about specific crops, soil conditions, or help planning your rotation!
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Info className="w-5 h-5 text-green-200 mr-2" />
                <span className="text-green-200 font-medium">Ask Aitor about:</span>
              </div>
              <ul className="text-sm text-green-100 space-y-1">
                <li>Which family does my crop belong to?</li>
                <li>What should I plant after potatoes?</li>
                <li>How do I deal with club root in my rotation?</li>
                <li>Custom rotation plans for small plots</li>
              </ul>
            </div>
            <Link 
              href="/ai-advisor" 
              className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Ask Aitor About Rotation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="mt-12">
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded">
            <div className="flex items-center mb-3">
              <Info className="w-6 h-6 text-amber-600 mr-2" />
              <h3 className="text-lg font-semibold text-amber-800">Golden Rules of Crop Rotation</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">The 3-Year Minimum:</h4>
                <p className="text-amber-700">Wait at least 3 years before planting the same family in the same spot.</p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Follow the Feeders:</h4>
                <p className="text-amber-700">Legumes → Brassicas → Roots. Let nitrogen flow through your rotation.</p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Keep Good Records:</h4>
                <p className="text-amber-700">What you can&apos;t remember, you can&apos;t rotate. Write it down!</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

