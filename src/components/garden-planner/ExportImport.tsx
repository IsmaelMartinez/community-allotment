'use client'

import { useState, useRef } from 'react'
import { Download, Upload, FileJson, AlertCircle, CheckCircle, X } from 'lucide-react'
import { GardenPlan } from '@/types/garden-planner'
import { downloadPlanAsJson, importPlan, readFileAsText } from '@/lib/garden-storage'

interface ExportImportProps {
  currentPlan: GardenPlan | null
  onImportPlan: (plan: GardenPlan) => void
}

export default function ExportImport({ currentPlan, onImportPlan }: ExportImportProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    if (currentPlan) {
      downloadPlanAsJson(currentPlan)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportError(null)
    setImportSuccess(false)

    try {
      const content = await readFileAsText(file)
      const result = importPlan(content)

      if (result.error) {
        setImportError(result.error)
      } else if (result.plan) {
        onImportPlan(result.plan)
        setImportSuccess(true)
        setTimeout(() => setImportSuccess(false), 3000)
      }
    } catch {
      setImportError('Failed to read file')
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FileJson className="w-6 h-6 text-green-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Export & Import</h2>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Save your garden plans as JSON files or import previously exported plans.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Export */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Download className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Export Plan</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Download your current plan as a JSON file for backup or sharing.
          </p>
          <button
            onClick={handleExport}
            disabled={!currentPlan}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            {currentPlan ? `Export "${currentPlan.name}"` : 'No plan selected'}
          </button>
        </div>

        {/* Import */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center mb-3">
            <Upload className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-gray-800">Import Plan</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Load a previously exported garden plan from a JSON file.
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Select JSON File'}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {importError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">Import Failed</p>
            <p className="text-sm text-red-600">{importError}</p>
          </div>
          <button
            onClick={() => setImportError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {importSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <p className="text-sm text-green-800">Plan imported successfully!</p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Export your plans regularly as backups</li>
          <li>• Share plans with fellow gardeners by sending the JSON file</li>
          <li>• Imported plans are given new IDs to avoid conflicts</li>
          <li>• All your vegetables and plot assignments are preserved on export</li>
        </ul>
      </div>
    </div>
  )
}

