'use client'

import { Plus, Minus } from 'lucide-react'

interface GridSizeControlsProps {
  rows: number
  cols: number
  minSize: number
  maxSize: number
  hasPlantInLastRow: boolean
  hasPlantInLastCol: boolean
  onResize: (rows: number, cols: number) => void
}

export default function GridSizeControls({
  rows,
  cols,
  minSize,
  maxSize,
  hasPlantInLastRow,
  hasPlantInLastCol,
  onResize,
}: GridSizeControlsProps) {
  return (
    <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-4">
        {/* Rows */}
        <div className="flex items-center gap-2">
          <span id="rows-label" className="text-sm text-gray-600">Rows:</span>
          <button
            onClick={() => onResize(rows - 1, cols)}
            disabled={rows <= minSize}
            className={`p-1.5 rounded transition ${
              rows <= minSize
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : hasPlantInLastRow
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={hasPlantInLastRow ? 'Warning: Last row has plants' : 'Remove row'}
            aria-label={`Remove row${hasPlantInLastRow ? ' (warning: last row has plants)' : ''}`}
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="w-6 text-center font-medium text-gray-800" aria-labelledby="rows-label">{rows}</span>
          <button
            onClick={() => onResize(rows + 1, cols)}
            disabled={rows >= maxSize}
            className={`p-1.5 rounded transition ${
              rows >= maxSize
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Add row"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Columns */}
        <div className="flex items-center gap-2">
          <span id="cols-label" className="text-sm text-gray-600">Cols:</span>
          <button
            onClick={() => onResize(rows, cols - 1)}
            disabled={cols <= minSize}
            className={`p-1.5 rounded transition ${
              cols <= minSize
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : hasPlantInLastCol
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={hasPlantInLastCol ? 'Warning: Last column has plants' : 'Remove column'}
            aria-label={`Remove column${hasPlantInLastCol ? ' (warning: last column has plants)' : ''}`}
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="w-6 text-center font-medium text-gray-800" aria-labelledby="cols-label">{cols}</span>
          <button
            onClick={() => onResize(rows, cols + 1)}
            disabled={cols >= maxSize}
            className={`p-1.5 rounded transition ${
              cols >= maxSize
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Add column"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <span className="text-sm text-gray-500">
        {rows}×{cols} = {rows * cols} cells
      </span>
    </div>
  )
}
