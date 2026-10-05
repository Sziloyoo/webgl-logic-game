import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from '@mantine/core'

/** Shades around aquamarine (3) and darkcyan (8), the colors of the original menu. */
const aqua: MantineColorsTuple = [
  '#e5fff8',
  '#cefff1',
  '#9fffe2',
  '#7fffd4',
  '#5df5c6',
  '#3fe0b3',
  '#25c39d',
  '#11a487',
  '#008b8b',
  '#006b6b',
]

const fontFamily = '"Barlow Condensed", sans-serif'

export const theme = createTheme({
  fontFamily,
  headings: { fontFamily, fontWeight: '700' },
  colors: { aqua },
  primaryColor: 'aqua',
  primaryShade: 3,
  autoContrast: true,
  defaultRadius: 'lg',
})

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {},
  dark: {
    '--mantine-color-body': '#2f4f4f', // darkslategrey
    '--mantine-color-text': '#f0ffff', // azure
  },
})
