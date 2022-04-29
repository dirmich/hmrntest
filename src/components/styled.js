import {Dimensions} from 'react-native'
import styled from 'styled-components/native'
import {getStatusBarHeight} from '../common/statusBarUtil'
import theme, {COLORS, SIZES} from '../common/theme'
// import {getBottomSpace, getStatusBarHeight, isIphoneX} from 'react-native-iphone-x-helper'
export const WINDOW = Dimensions.get('window')
export const SCREEN = Dimensions.get('screen')

export const Axis = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  even: 'space-evenly',
  stretch: 'stretch',
}

export const Column = styled.View`
  flex-direction: ${({reverse, row}) =>
    row
      ? reverse
        ? 'row-reverse'
        : 'row'
      : reverse
      ? 'column-reverse'
      : 'column'};
  /* ${({row}) => row && `height:100%;`} */
  /* flexglow: 0;
  flexshrink: 0; */

  width: 100%;
  height: 100%;
  ${({padding = 0}) => `padding:${padding}px`}
  ${({margin = 0}) => `margin:${margin}px`}
  ${({marginTop}) => marginTop && `margin-top:${marginTop}px`}
  ${({center}) => {
    return center ? 'align-items:center;justify-content:center' : ''
  }}
  /* ${({fbox}) => fbox && `flex: 1`} */
  /* ${({fbox = 1}) => `flex: ${fbox}`} */
  ${({fbox}) => fbox && `flex: ${fbox === true ? 1 : fbox}`}
  ${({mainAxis = Axis.center}) => {
    return `justify-content: ${mainAxis}`
  }}
  ${({crossAxis = Axis.center}) => {
    return `align-items: ${crossAxis}`
  }}
  ${({debug}) => debug && 'border:1px solid red;'}
  /* align-items: ${props => (props.center ? 'center' : 'flex-start')};
  justify-content: ${props => (props.vcenter ? 'center' : 'flex-start')}; */
  background-color: ${p => p.backgroundColor ?? 'transparent'};
`

export const Card = styled.View`
  flex-direction: ${({reverse}) => (reverse ? 'column-reverse' : 'column')};
  /* flex: 1; */
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  height: ${p => (p ? p.height + 'px' : '32px')};

  ${({center}) => {
    return center ? 'align-items:center;justify-content:center' : ''
  }}
  ${({mainAxis = Axis.start}) => {
    return `justify-content: ${mainAxis}`
  }}
  ${({crossAxis = Axis.start}) => {
    return `align-items: ${crossAxis}`
  }}
  ${({debug}) => debug && 'border:1px solid red;'}
  background-color: ${p => p.backgroundColor ?? 'transparent'};
`

export const Row = styled(Column)`
  flex-direction: ${({reverse}) => (reverse ? 'row-reverse' : 'row')};
`
export const Container = styled(Column)`
  ${({overlay}) => overlay && `position:absolute`}
  height: 100%;
`

export const ScrollView = styled.ScrollView`
  ${({fbox = true}) => fbox && `flex: 1`}
  ${({mainAxis}) => {
    return `justify-content: ${mainAxis}`
  }}
  ${({crossAxis}) => {
    return `align-items: ${crossAxis}`
  }}
  ${({debug}) => debug && 'border:1px solid red;'}
`

export const Image = styled.Image`
  width: ${p => p.width ?? '32px'};
  height: ${p => p.height ?? '32px'};
`
export const FullImage = styled.Image`
  width: 100%;
  height: 100%;
`
export const Avatar = styled(Image)`
  border-radius: ${p => p.borderRadius ?? '16px'};
`

export const FullScreen = styled.View`
  position: absolute;
  padding: ${p => (p.padding ? p.padding + 'px' : 0)};
  top: ${p => (p.statusbar ? getStatusBarHeight() + 'px' : 0)};
  left: 0;
  bottom: ${p => (p.bottom ? 130 : 0) + 'px'};
  right: 0;
`

export const View = styled.View`
  ${({fbox}) => fbox && `flex: ${fbox === true ? 1 : fbox}`}

  ${({fill, vfill, hfill}) =>
    fill
      ? 'width:100%;height:100%'
      : hfill
      ? 'width:100%'
      : vfill
      ? 'height:100%'
      : ''}

${({center}) => center && `justify-content:center;align-items:center`}
${({absolute, relative}) => {
    if (absolute) return 'position:absolute'
    if (relative) return 'position:relative'
  }}
  ${({mainAxis = Axis.start, center}) => {
    return !center && `justify-content: ${mainAxis}`
  }}
  ${({crossAxis = Axis.start, center}) => {
    return !center && `align-items: ${crossAxis}`
  }}
  ${({debug}) => debug && 'border:1px solid green;'}

  background-color: ${p =>
    p.transparent ? 'transparent' : p.backgroundColor ?? 'white'};
`

export const Text = styled.Text`
  ${({fbox}) => fbox && `flex: 1`}

  ${({debug}) => debug && 'border:1px solid grey;'}
  ${({center}) => center && 'text-align:center'}
  color: ${p => (p.color ? p.color : p.dark ? 'white' : 'black')};
  margin: ${p => p.margin ?? 0};
  margin-left: ${p => p.marginh ?? 0};
  margin-right: ${p => p.marginh ?? 0};
  margin-top: ${p => p.marginv ?? 0};
  margin-bottom: ${p => p.marginv ?? 0};
  padding: ${p => p.padding ?? 0};
  background-color: ${p => p.backgroundColor ?? 'transparent'};

  ${({shadow}) => shadow && `text-shadow-color: 'rgba(0, 0, 0, 0.75)'`}
  ${({shadow}) => shadow && `text-shadow-offset: -1px 1px`}
  ${({shadow}) => shadow && `text-shadow-radius: 6px`}
  /* ${({shadow}) => shadow && `textShadowColor: 'rgba(0, 0, 0, 0.75)'`}
  ${({shadow}) => shadow && `textShadowOffset: {width: -1, height: 1}`}
  ${({shadow}) => shadow && `textShadowRadius: 6px`} */
  /* ${({shadow}) =>
    shadow && {
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 6,
      // textShadowColor: 'rgba(0, 0, 0, 0.75)',
      // textShadowOffset: {width: -1, height: 1},
      // textShadowRadius: 6,
    }} */

  ${({title, large, medium, small, tiny}) => {
    switch (true) {
      case title:
        return `font-size:32px`
      case large:
        return `font-size:20px`
      case medium:
        return `font-size:15px`
      case small:
        return `font-size:11px`
      case tiny:
        return `font-size:10px`
      default:
        return `font-size:13px`
    }
  }}
  ${({light, bold, heavy, black}) => {
    switch (true) {
      case light:
        return `font-weight: 200`
      case bold:
        return `font-weight: 600`
      case heavy:
        return `font-weight: 700`
      case black:
        return `font-weight: 900`
      default:
        return `font-weight: 400`
    }
  }}
    ${({center, right}) => {
    switch (true) {
      case center:
        return `text-align:center`
      case right:
        return `text-align:right`
      default:
        return `text-align:left`
    }
  }};
`

export const Divider = styled.View`
  ${({vert, width, color}) => {
    switch (true) {
      case vert:
        return `border-right-color: ${color ? color : COLORS.lightGray1};
                border-right-width: 1px;
                height: ${width ? width + 'px' : '20px'};
                margin: 8px;`
      default:
        return `border-bottom-color: ${color ? color : COLORS.lightGray1};
                border-bottom-width: 1px;
                width: ${width ? width + 'px' : '30px'};
                margin-top: 8px;`
    }
  }}
`

export const Space = styled.View`
  flex: 1;
  ${({debug}) => debug && 'border:1px solid blue;'}/* border: 1px solid blue; */
  /* align-self: stretch; */
`
