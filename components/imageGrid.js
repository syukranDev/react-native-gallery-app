import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from './imageCard';
import { wp, hp, getColumnCount } from '../helpers/common';

const ImageGrid = ({images, router}) => {
    const columns = getColumnCount();
    // console.log(columns)
  return (
    <View style={styles.container}>
       <MasonryFlashList
        data={images}
        numColumns={columns}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => <ImageCard index={index} item={item} columns={columns} router={router}/>}
        estimatedItemSize={200}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        minHeight: 3,
        width: wp(100)
    },
    listContainerStyle: {
        paddingHorizontal: wp(4)
    }
    
})

export default ImageGrid