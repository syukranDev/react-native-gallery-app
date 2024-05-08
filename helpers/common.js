import { Dimensions } from "react-native"

const { width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export const wp = percentage => {
    const width = deviceWidth;
    console.log('W: ' + width)
    return (percentage * width) / 100;
}

export const hp = percentage => {
    const height = deviceHeight;
    console.log('H: ' + height)
    return (percentage * height) / 100;
}

export const getColumnCount = () => {
    if (deviceWidth >= 1024) {
        return 4 //desktop
    } else if (deviceWidth >= 768) {
        return 3 //tablet
    } else return 2 // phone
}

export const getImageSize = (height, width) => {
    if (width>height) return 250 //landscape
    else if (width<height) return 300 //potrait
    else return 200 // square
}