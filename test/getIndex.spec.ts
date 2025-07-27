import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import getIndex from '../src/getIndex'

describe('getIndex', () => {
  let container: HTMLElement
  let element1: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement
  let element4: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'container'

    element1 = document.createElement('div')
    element1.id = 'element1'
    element1.textContent = 'Element 1'

    element2 = document.createElement('span')
    element2.id = 'element2'
    element2.textContent = 'Element 2'

    element3 = document.createElement('p')
    element3.id = 'element3'
    element3.textContent = 'Element 3'

    element4 = document.createElement('em')
    element4.id = 'element4'
    element4.textContent = 'Element 4'

    container.appendChild(element1)
    container.appendChild(element2)
    container.appendChild(element3)
    container.appendChild(element4)

    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
  })

  it('应该返回第一个元素的索引', () => {
    const index = getIndex(element1)
    expect(index).toBe(0)
  })

  it('应该返回第二个元素的索引', () => {
    const index = getIndex(element2)
    expect(index).toBe(1)
  })

  it('应该返回第三个元素的索引', () => {
    const index = getIndex(element3)
    expect(index).toBe(2)
  })

  it('应该返回最后一个元素的索引', () => {
    const index = getIndex(element4)
    expect(index).toBe(3)
  })

  it('应该处理 null 元素', () => {
    const index = getIndex(null)
    expect(index).toBe(-1)
  })

  it('应该处理 undefined 元素', () => {
    const index = getIndex(undefined as any)
    expect(index).toBe(-1)
  })

  it('应该处理没有父节点的元素', () => {
    const orphanElement = document.createElement('div')
    const index = getIndex(orphanElement)
    expect(index).toBe(-1)
  })

  it('应该处理父节点没有子元素的情况', () => {
    const emptyContainer = document.createElement('div')
    const index = getIndex(emptyContainer)
    expect(index).toBe(-1)
  })

  it('应该处理单个子元素的情况', () => {
    const singleContainer = document.createElement('div')
    const singleChild = document.createElement('span')
    singleContainer.appendChild(singleChild)

    const index = getIndex(singleChild)
    expect(index).toBe(0)
  })

  it('应该在动态添加元素后返回正确的索引', () => {
    const newElement = document.createElement('strong')

    // 在 element2 后面插入新元素
    container.insertBefore(newElement, element3)

    expect(getIndex(element1)).toBe(0)
    expect(getIndex(element2)).toBe(1)
    expect(getIndex(newElement)).toBe(2)
    expect(getIndex(element3)).toBe(3)
    expect(getIndex(element4)).toBe(4)
  })

  it('应该在移除元素后返回正确的索引', () => {
    // 移除第二个元素
    container.removeChild(element2)

    expect(getIndex(element1)).toBe(0)
    expect(getIndex(element3)).toBe(1)
    expect(getIndex(element4)).toBe(2)

    // 已移除的元素应该返回 -1
    expect(getIndex(element2)).toBe(-1)
  })

  it('应该在重新排序元素后返回正确的索引', () => {
    // 将第一个元素移动到最后
    container.appendChild(element1)

    expect(getIndex(element2)).toBe(0)
    expect(getIndex(element3)).toBe(1)
    expect(getIndex(element4)).toBe(2)
    expect(getIndex(element1)).toBe(3)
  })

  it('应该处理不同层级的元素', () => {
    const nestedContainer = document.createElement('div')
    const nestedElement = document.createElement('span')
    nestedContainer.appendChild(nestedElement)
    container.appendChild(nestedContainer)

    // 嵌套元素在其父容器中的索引
    expect(getIndex(nestedElement)).toBe(0)

    // 嵌套容器在主容器中的索引
    expect(getIndex(nestedContainer)).toBe(4)
  })

  it('应该处理文本节点和元素混合的情况', () => {
    const mixedContainer = document.createElement('div')
    const childElement1 = document.createElement('span')
    const childElement2 = document.createElement('div')

    mixedContainer.appendChild(childElement1)
    mixedContainer.appendChild(document.createTextNode('Text Node'))
    mixedContainer.appendChild(childElement2)

    // 只计算元素节点，不计算文本节点
    expect(getIndex(childElement1)).toBe(0)
    expect(getIndex(childElement2)).toBe(1)
  })

  it('应该保持索引的一致性', () => {
    // 多次调用应该返回相同的结果
    const index1 = getIndex(element2)
    const index2 = getIndex(element2)
    const index3 = getIndex(element2)

    expect(index1).toBe(index2)
    expect(index2).toBe(index3)
    expect(index1).toBe(1)
  })

  it('应该正确处理连续的索引', () => {
    const indices = [element1, element2, element3, element4].map(getIndex)

    expect(indices).toEqual([0, 1, 2, 3])
    expect(indices).toHaveLength(4)

    // 检查是否是连续的索引
    for (let i = 0; i < indices.length; i++) {
      expect(indices[i]).toBe(i)
    }
  })
})
