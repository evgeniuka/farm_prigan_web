import compareHabanero from '../assets/figma/compare-habanero.png'
import compareJalapeno from '../assets/figma/compare-jalapeno.png'
import compareLemonDrop from '../assets/figma/compare-lemon-drop.png'
import catalog1 from '../assets/figma/pepper-catalog-1.png'
import catalog2 from '../assets/figma/pepper-catalog-2.png'
import catalog3 from '../assets/figma/pepper-catalog-3.png'
import catalog4 from '../assets/figma/pepper-catalog-4.png'
import catalog5 from '../assets/figma/pepper-catalog-5.png'
import catalog6 from '../assets/figma/pepper-catalog-6.png'
import pepperDetailMain from '../assets/figma/pepper-detail-main.png'

export const pepperImages: Record<string, string> = {
  'lemon-drop': catalog1,
  jalapeno: catalog2,
  habanero: catalog3,
  'sweet-pepper': catalog4,
  poblano: catalog5,
  cayenne: catalog6,
}

export const compareImages: Record<string, string> = {
  'lemon-drop': compareLemonDrop,
  jalapeno: compareJalapeno,
  habanero: compareHabanero,
}

export const pepperDetailFallback = pepperDetailMain
