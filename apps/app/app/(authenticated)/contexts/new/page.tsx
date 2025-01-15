import { redirect } from 'next/navigation'
import { createContext } from '../../../actions/context'
import { Button } from '@repo/design-system'

export default function NewContextPage() {
  async function create(formData: FormData) {
    'use server'
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as 'TEMPLATE' | 'CUSTOM' | 'FORK'
    
    const context = await createContext({
      name,
      description,
      type,
    })
    
    redirect(`/contexts/${context.id}`)
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">New Context</h1>
      
      <form action={create} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            name="type"
            id="type"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="TEMPLATE">Template</option>
            <option value="CUSTOM">Custom</option>
            <option value="FORK">Fork</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" href="/contexts">
            Cancel
          </Button>
          <Button type="submit">
            Create Context
          </Button>
        </div>
      </form>
    </div>
  )
} 