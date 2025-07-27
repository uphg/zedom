import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import toElement from '../src/toElement'

describe('toElement', () => {
  afterEach(() => {
    // 清理可能添加到 DOM 中的元素
    const testElements = document.querySelectorAll('[data-test="true"]')
    testElements.forEach(el => el.remove())
  })

  it('应该能从简单的 HTML 字符串创建元素', () => {
    const element = toElement('<div>Hello World</div>')

    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.textContent).toBe('Hello World')
  })

  it('应该能创建带属性的元素', () => {
    const element = toElement('<div id="test" class="container">Content</div>')

    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.id).toBe('test')
    expect(element.className).toBe('container')
    expect(element.textContent).toBe('Content')
  })

  it('应该能创建嵌套结构的元素', () => {
    const element = toElement('<div><span>Child 1</span><p>Child 2</p></div>')

    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.children.length).toBe(2)
    expect(element.children[0].tagName.toLowerCase()).toBe('span')
    expect(element.children[1].tagName.toLowerCase()).toBe('p')
    expect(element.children[0].textContent).toBe('Child 1')
    expect(element.children[1].textContent).toBe('Child 2')
  })

  it('应该能创建不同类型的元素', () => {
    const button = toElement('<button type="submit">Submit</button>')
    const input = toElement('<input type="text" placeholder="Enter text">')
    const img = toElement('<img src="test.jpg" alt="Test Image">')

    expect(button.tagName.toLowerCase()).toBe('button')
    expect(button.getAttribute('type')).toBe('submit')
    expect(button.textContent).toBe('Submit')

    expect(input.tagName.toLowerCase()).toBe('input')
    expect(input.getAttribute('type')).toBe('text')
    expect(input.getAttribute('placeholder')).toBe('Enter text')

    expect(img.tagName.toLowerCase()).toBe('img')
    expect(img.getAttribute('src')).toBe('test.jpg')
    expect(img.getAttribute('alt')).toBe('Test Image')
  })

  it('应该能处理包含特殊字符的内容', () => {
    const element = toElement('<div>&lt;script&gt;alert("test")&lt;/script&gt;</div>')

    expect(element.textContent).toBe('<script>alert("test")</script>')
  })

  it('应该能处理空白字符', () => {
    const element = toElement('  <div>  Content  </div>  ')

    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.textContent).toBe('  Content  ')
  })

  it('应该能添加子元素', () => {
    const child1 = document.createElement('span')
    child1.textContent = 'Child 1'
    const child2 = document.createElement('em')
    child2.textContent = 'Child 2'

    const element = toElement('<div>Original</div>', [child1, child2])

    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.textContent).toBe('OriginalChild 1Child 2')
    expect(element.children.length).toBe(2)
    expect(element.children[0]).toBe(child1)
    expect(element.children[1]).toBe(child2)
  })

  it('应该能处理 null 或 undefined 的 innerHTML', () => {
    expect(() => {
      toElement(null as any)
    }).not.toThrow()

    expect(() => {
      toElement(undefined as any)
    }).not.toThrow()
  })

  it('应该能创建表格相关元素', () => {
    const table = toElement('<table><tr><td>Cell</td></tr></table>')

    expect(table.tagName.toLowerCase()).toBe('table')
    expect(table.querySelector('tr')).toBeTruthy()
    expect(table.querySelector('td')?.textContent).toBe('Cell')
  })

  it('应该能创建表单元素', () => {
    const form = toElement(`
      <form>
        <input type="text" name="username">
        <select name="country">
          <option value="us">US</option>
          <option value="cn">China</option>
        </select>
        <textarea name="message"></textarea>
      </form>
    `)

    expect(form.tagName.toLowerCase()).toBe('form')
    expect(form.querySelector('input')).toBeTruthy()
    expect(form.querySelector('select')).toBeTruthy()
    expect(form.querySelector('textarea')).toBeTruthy()
    expect(form.querySelectorAll('option').length).toBe(2)
  })

  it('应该能处理 SVG 元素', () => {
    const svg = toElement('<svg><circle r="10"></circle></svg>')

    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(svg.querySelector('circle')).toBeTruthy()
    expect(svg.querySelector('circle')?.getAttribute('r')).toBe('10')
  })

  it('应该能处理自闭合标签', () => {
    const img = toElement('<img src="test.jpg" alt="Test" />')
    const input = toElement('<input type="text" />')
    const br = toElement('<br />')

    expect(img.tagName.toLowerCase()).toBe('img')
    expect(img.getAttribute('src')).toBe('test.jpg')

    expect(input.tagName.toLowerCase()).toBe('input')
    expect(input.getAttribute('type')).toBe('text')

    expect(br.tagName.toLowerCase()).toBe('br')
  })

  it('应该返回第一个子元素', () => {
    // 当模板包含多个顶级元素时，应该返回第一个
    const element = toElement('<div>First</div><span>Second</span>')

    expect(element.tagName.toLowerCase()).toBe('div')
    expect(element.textContent).toBe('First')
  })
})
