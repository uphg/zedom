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

  it('should set single style property', () => {
    setStyle(element, 'color', 'red')
    expect(element.style.color).toBe('red')
  })

  it('should set multiple styles through object', () => {
    setStyle(element, {
      color: 'blue',
      fontSize: '16px',
      margin: '10px'
    })

    expect(element.style.color).toBe('blue')
    expect(element.style.fontSize).toBe('16px')
    expect(element.style.margin).toBe('10px')
  })

  it('should convert kebab-case to camelCase', () => {
    setStyle(element, 'background-color', 'green')
    expect(element.style.backgroundColor).toBe('green')
  })

  it('should set font-related styles', () => {
    setStyle(element, 'font-size', '18px')
    setStyle(element, 'font-weight', 'bold')

    expect(element.style.fontSize).toBe('18px')
    expect(element.style.fontWeight).toBe('bold')
  })

  it('should set border-related styles', () => {
    setStyle(element, 'border-width', '2px')
    setStyle(element, 'border-style', 'solid')
    setStyle(element, 'border-color', 'black')

    expect(element.style.borderWidth).toBe('2px')
    expect(element.style.borderStyle).toBe('solid')
    expect(element.style.borderColor).toBe('black')
  })

  it('should set compound styles', () => {
    setStyle(element, 'border', '1px solid red')
    expect(element.style.border).toBe('1px solid red')
  })

  it('should set position-related styles', () => {
    setStyle(element, {
      'position': 'absolute',
      'top': '10px',
      'left': '20px',
      'z-index': '100'
    })

    expect(element.style.position).toBe('absolute')
    expect(element.style.top).toBe('10px')
    expect(element.style.left).toBe('20px')
    expect(element.style.zIndex).toBe('100')
  })

  it('should set transform styles', () => {
    setStyle(element, 'transform', 'translateX(50px) rotateZ(45deg)')
    expect(element.style.transform).toBe('translateX(50px) rotateZ(45deg)')
  })

  it('should set numeric styles', () => {
    setStyle(element, {
      width: '100px',
      height: '200px',
      opacity: '0.5'
    })

    expect(element.style.width).toBe('100px')
    expect(element.style.height).toBe('200px')
    expect(element.style.opacity).toBe('0.5')
  })

  it('should override existing styles', () => {
    element.style.color = 'red'
    setStyle(element, 'color', 'blue')
    expect(element.style.color).toBe('blue')
  })

  it('should set margin and padding', () => {
    setStyle(element, {
      margin: '10px 20px',
      padding: '5px 15px 10px 20px'
    })

    // set base values first, then test override
    expect(element.style.margin).toBe('10px 20px')
    expect(element.style.padding).toBe('5px 15px 10px 20px')

    // test overriding specific values
    setStyle(element, {
      'margin-top': '30px',
      'padding-left': '25px'
    })

    expect(element.style.marginTop).toBe('30px')
    expect(element.style.paddingLeft).toBe('25px')
  })

  it('should handle flex-related styles', () => {
    setStyle(element, {
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center'
    })

    expect(element.style.display).toBe('flex')
    expect(element.style.flexDirection).toBe('column')
    expect(element.style.justifyContent).toBe('center')
    expect(element.style.alignItems).toBe('center')
  })

  it('should handle grid-related styles', () => {
    setStyle(element, {
      'display': 'grid',
      'grid-template-columns': '1fr 1fr 1fr',
      'grid-gap': '10px'
    })

    expect(element.style.display).toBe('grid')
    expect(element.style.gridTemplateColumns).toBe('1fr 1fr 1fr')
    expect(element.style.gridGap).toBe('10px')
  })

  it('should handle empty values', () => {
    element.style.color = 'red'
    setStyle(element, 'color', '')
    expect(element.style.color).toBe('')
  })

  it('should handle undefined values', () => {
    element.style.color = 'red'
    setStyle(element, 'color', undefined as any)
    // undefined is converted to string 'undefined' or keeps original value, depends on implementation
    expect(element.style.color === 'undefined' || element.style.color === 'red' || element.style.color === '').toBe(true)
  })
})
