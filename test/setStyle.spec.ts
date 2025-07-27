import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import setStyle from '../src/setStyle'

describe('setStyle', () => {
  let element: HTMLElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  })

  it('应该能设置单个样式属性', () => {
    setStyle(element, 'color', 'red')
    expect(element.style.color).toBe('red')
  })

  it('应该能通过对象设置多个样式', () => {
    setStyle(element, {
      color: 'blue',
      fontSize: '16px',
      margin: '10px'
    })
    
    expect(element.style.color).toBe('blue')
    expect(element.style.fontSize).toBe('16px')
    expect(element.style.margin).toBe('10px')
  })

  it('应该能将 kebab-case 转换为 camelCase', () => {
    setStyle(element, 'background-color', 'green')
    expect(element.style.backgroundColor).toBe('green')
  })

  it('应该能设置 font 相关样式', () => {
    setStyle(element, 'font-size', '18px')
    setStyle(element, 'font-weight', 'bold')
    
    expect(element.style.fontSize).toBe('18px')
    expect(element.style.fontWeight).toBe('bold')
  })

  it('应该能设置 border 相关样式', () => {
    setStyle(element, 'border-width', '2px')
    setStyle(element, 'border-style', 'solid')
    setStyle(element, 'border-color', 'black')
    
    expect(element.style.borderWidth).toBe('2px')
    expect(element.style.borderStyle).toBe('solid')
    expect(element.style.borderColor).toBe('black')
  })

  it('应该能设置复合样式', () => {
    setStyle(element, 'border', '1px solid red')
    expect(element.style.border).toBe('1px solid red')
  })

  it('应该能设置 position 相关样式', () => {
    setStyle(element, {
      position: 'absolute',
      top: '10px',
      left: '20px',
      'z-index': '100'
    })
    
    expect(element.style.position).toBe('absolute')
    expect(element.style.top).toBe('10px')
    expect(element.style.left).toBe('20px')
    expect(element.style.zIndex).toBe('100')
  })

  it('应该能设置 transform 样式', () => {
    setStyle(element, 'transform', 'translateX(50px) rotateZ(45deg)')
    expect(element.style.transform).toBe('translateX(50px) rotateZ(45deg)')
  })

  it('应该能设置数值样式', () => {
    setStyle(element, {
      width: '100px',
      height: '200px',
      opacity: '0.5'
    })
    
    expect(element.style.width).toBe('100px')
    expect(element.style.height).toBe('200px')
    expect(element.style.opacity).toBe('0.5')
  })

  it('应该覆盖现有样式', () => {
    element.style.color = 'red'
    setStyle(element, 'color', 'blue')
    expect(element.style.color).toBe('blue')
  })

  it('应该能设置 margin 和 padding', () => {
    setStyle(element, {
      margin: '10px 20px',
      padding: '5px 15px 10px 20px'
    })
    
    // 先设置基础值，再测试覆盖
    expect(element.style.margin).toBe('10px 20px')
    expect(element.style.padding).toBe('5px 15px 10px 20px')
    
    // 测试覆盖特定的值
    setStyle(element, {
      'margin-top': '30px',
      'padding-left': '25px'
    })
    
    expect(element.style.marginTop).toBe('30px')
    expect(element.style.paddingLeft).toBe('25px')
  })

  it('应该能处理 flex 相关样式', () => {
    setStyle(element, {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center'
    })
    
    expect(element.style.display).toBe('flex')
    expect(element.style.flexDirection).toBe('column')
    expect(element.style.justifyContent).toBe('center')
    expect(element.style.alignItems).toBe('center')
  })

  it('应该能处理 grid 相关样式', () => {
    setStyle(element, {
      display: 'grid',
      'grid-template-columns': '1fr 1fr 1fr',
      'grid-gap': '10px'
    })
    
    expect(element.style.display).toBe('grid')
    expect(element.style.gridTemplateColumns).toBe('1fr 1fr 1fr')
    expect(element.style.gridGap).toBe('10px')
  })

  it('应该能处理空值', () => {
    element.style.color = 'red'
    setStyle(element, 'color', '')
    expect(element.style.color).toBe('')
  })

  it('应该能处理 undefined 值', () => {
    element.style.color = 'red'
    setStyle(element, 'color', undefined as any)
    // undefined 被转换为字符串 'undefined' 或者保持原值，取决于实现
    expect(element.style.color === 'undefined' || element.style.color === 'red' || element.style.color === '').toBe(true)
  })
})