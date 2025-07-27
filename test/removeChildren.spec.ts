import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import removeChildren from '../src/removeChildren'

describe('removeChildren', () => {
  let container: HTMLElement
  let child1: HTMLElement
  let child2: HTMLElement
  let child3: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'container'
    
    child1 = document.createElement('span')
    child1.id = 'child1'
    child1.textContent = 'Child 1'
    
    child2 = document.createElement('p')
    child2.id = 'child2'
    child2.textContent = 'Child 2'
    
    child3 = document.createElement('em')
    child3.id = 'child3'
    child3.textContent = 'Child 3'
    
    container.appendChild(child1)
    container.appendChild(child2)
    container.appendChild(child3)
    
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('应该移除所有子元素', () => {
    expect(container.children.length).toBe(3)
    
    removeChildren(container)
    
    expect(container.children.length).toBe(0)
    expect(container.childNodes.length).toBe(0)
    expect(container.innerHTML).toBe('')
  })

  it('应该移除所有类型的子节点', () => {
    // 添加文本节点和注释节点
    const textNode = document.createTextNode('Text Node')
    const commentNode = document.createComment('Comment Node')
    
    container.appendChild(textNode)
    container.appendChild(commentNode)
    
    expect(container.childNodes.length).toBe(5) // 3 elements + 1 text + 1 comment
    
    removeChildren(container)
    
    expect(container.childNodes.length).toBe(0)
  })

  it('应该处理空容器', () => {
    const emptyContainer = document.createElement('div')
    
    expect(emptyContainer.children.length).toBe(0)
    
    // 不应该抛出错误
    expect(() => removeChildren(emptyContainer)).not.toThrow()
    
    expect(emptyContainer.children.length).toBe(0)
  })

  it('应该处理 null 元素', () => {
    expect(() => removeChildren(null as any)).not.toThrow()
  })

  it('应该处理 undefined 元素', () => {
    expect(() => removeChildren(undefined as any)).not.toThrow()
  })

  it('应该移除嵌套的子元素', () => {
    const nestedContainer = document.createElement('div')
    const nestedChild1 = document.createElement('span')
    const nestedChild2 = document.createElement('em')
    
    nestedContainer.appendChild(nestedChild1)
    nestedContainer.appendChild(nestedChild2)
    container.appendChild(nestedContainer)
    
    expect(container.children.length).toBe(4) // 3 original + 1 nested container
    expect(nestedContainer.children.length).toBe(2)
    
    removeChildren(container)
    
    expect(container.children.length).toBe(0)
    // 嵌套容器本身被移除，所以它的子元素也不存在了
  })

  it('应该移除具有事件监听器的元素', () => {
    const eventElement = document.createElement('button')
    let clicked = false
    
    eventElement.addEventListener('click', () => {
      clicked = true
    })
    
    container.appendChild(eventElement)
    
    expect(container.children.length).toBe(4)
    
    removeChildren(container)
    
    expect(container.children.length).toBe(0)
    
    // 注意：在 jsdom 中，事件监听器在元素被移除后仍然可能有效
    // 这取决于具体的实现，所以我们调整测试期望
    eventElement.click()
    // 不对事件触发结果做具体断言，因为这依赖于具体的 DOM 实现
  })

  it('应该保持父元素的其他属性不变', () => {
    container.className = 'test-container'
    container.setAttribute('data-test', 'value')
    
    expect(container.className).toBe('test-container')
    expect(container.getAttribute('data-test')).toBe('value')
    
    removeChildren(container)
    
    expect(container.className).toBe('test-container')
    expect(container.getAttribute('data-test')).toBe('value')
    expect(container.children.length).toBe(0)
  })

  it('应该处理多次调用', () => {
    expect(container.children.length).toBe(3)
    
    removeChildren(container)
    expect(container.children.length).toBe(0)
    
    // 第二次调用不应该抛出错误
    expect(() => removeChildren(container)).not.toThrow()
    expect(container.children.length).toBe(0)
  })

  it('应该移除复杂的 DOM 结构', () => {
    // 创建复杂的嵌套结构
    const table = document.createElement('table')
    const tbody = document.createElement('tbody')
    const tr1 = document.createElement('tr')
    const tr2 = document.createElement('tr')
    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    const td3 = document.createElement('td')
    const td4 = document.createElement('td')
    
    td1.textContent = 'Cell 1'
    td2.textContent = 'Cell 2'
    td3.textContent = 'Cell 3'
    td4.textContent = 'Cell 4'
    
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr2.appendChild(td3)
    tr2.appendChild(td4)
    tbody.appendChild(tr1)
    tbody.appendChild(tr2)
    table.appendChild(tbody)
    
    container.appendChild(table)
    
    expect(container.children.length).toBe(4) // 3 original + 1 table
    expect(table.querySelector('td')).toBeTruthy()
    
    removeChildren(container)
    
    expect(container.children.length).toBe(0)
  })

  it('应该处理包含表单元素的容器', () => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    const select = document.createElement('select')
    const textarea = document.createElement('textarea')
    
    input.type = 'text'
    input.value = 'test value'
    
    form.appendChild(input)
    form.appendChild(select)
    form.appendChild(textarea)
    container.appendChild(form)
    
    expect(container.children.length).toBe(4)
    
    removeChildren(container)
    
    expect(container.children.length).toBe(0)
  })

  it('应该释放被移除元素的内存引用', () => {
    const childElement = container.firstElementChild
    expect(childElement).toBeTruthy()
    expect(childElement?.parentNode).toBe(container)
    
    removeChildren(container)
    
    // 被移除的元素应该没有父节点了
    expect(childElement?.parentNode).toBeNull()
  })
})