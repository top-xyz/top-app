import { describe, it, expect, beforeEach } from 'vitest'
import { PreviewGenerator } from '../../core/preview/preview-generator.js'
import { PreviewConfig } from '../../core/types.js'

describe('PreviewGenerator', () => {
  let config: PreviewConfig
  let generator: PreviewGenerator

  beforeEach(() => {
    config = {
      enabled: true,
      type: 'markdown',
      components: ['typescript', 'javascript', 'jsx', 'tsx']
    }
    generator = new PreviewGenerator(config)
  })

  it('should return null when preview is disabled', async () => {
    const disabledConfig: PreviewConfig = {
      ...config,
      enabled: false
    }
    const disabledGenerator = new PreviewGenerator(disabledConfig)
    const preview = await disabledGenerator.generatePreview('Some content')
    expect(preview).toBeNull()
  })

  it('should detect markdown content type', async () => {
    const content = '# Heading\n\nSome paragraph text'
    const preview = await generator.generatePreview(content)
    
    expect(preview).not.toBeNull()
    expect(preview?.type).toBe('document')
    expect(preview?.metadata?.format).toBe('markdown')
    expect(preview?.content).toContain('<h1')
    expect(preview?.content).toContain('<p')
  })

  it('should detect and process component content', async () => {
    const content = '```typescript\nconst x: number = 1;\n```'
    const preview = await generator.generatePreview(content)
    
    expect(preview).not.toBeNull()
    expect(preview?.type).toBe('component')
    
    const components = JSON.parse(preview?.content || '[]')
    expect(components).toHaveLength(1)
    expect(components[0].language).toBe('typescript')
    expect(components[0].code).toBe('const x: number = 1;')
  })

  it('should handle multiple code blocks', async () => {
    const content = `
      \`\`\`typescript
      interface User {
        name: string;
      }
      \`\`\`
      
      \`\`\`javascript
      const user = { name: 'Test' };
      \`\`\`
    `
    const preview = await generator.generatePreview(content)
    
    expect(preview).not.toBeNull()
    expect(preview?.type).toBe('component')
    
    const components = JSON.parse(preview?.content || '[]')
    expect(components).toHaveLength(2)
    expect(components[0].language).toBe('typescript')
    expect(components[1].language).toBe('javascript')
  })

  it('should generate iframe preview for URLs', async () => {
    const content = 'https://example.com'
    const preview = await generator.generatePreview(content, 'iframe')
    
    expect(preview).not.toBeNull()
    expect(preview?.type).toBe('app')
    expect(preview?.url).toBe('https://example.com')
    expect(preview?.metadata?.type).toBe('iframe')
  })

  it('should throw error for invalid iframe content', async () => {
    const content = 'Not a URL'
    await expect(generator.generatePreview(content, 'iframe'))
      .rejects
      .toThrow('No URL found for iframe preview')
  })

  it('should validate preview data', async () => {
    const content = '# Valid markdown'
    const preview = await generator.generatePreview(content)
    
    expect(preview).not.toBeNull()
    expect(preview?.type).toBe('document')
    expect(preview?.content).toBeDefined()
    expect(preview?.metadata).toBeDefined()
    expect(preview?.metadata?.timestamp).toBeDefined()
  })

  it('should handle complex markdown with code and links', async () => {
    const content = `
      # Title
      
      Some text with a [link](https://example.com)
      
      \`\`\`typescript
      const x = 1;
      \`\`\`
      
      More text
    `
    const preview = await generator.generatePreview(content)
    
    expect(preview).not.toBeNull()
    expect(preview?.type).toBe('document')
    expect(preview?.content).toContain('<h1')
    expect(preview?.content).toContain('<a href')
    expect(preview?.content).toContain('<code')
  })
}) 