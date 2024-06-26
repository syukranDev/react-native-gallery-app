import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { data } from '../constants/data'
import { wp, hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Animated, { FadeInRight } from 'react-native-reanimated'

const Categories = ({activeCategory, handleChangeCategory}) => {
  return (
    <FlatList
        horizontal={true}
        contentContainerStyle={styles.flatlistContainer}
        showsHorizontalScrollIndicator={false}
        data={data.categories}
        keyExtractor={item => item}
        renderItem={({item, index}) => (
            <CategoryItem
                isActive ={activeCategory==item}
                handleChangeCategory={handleChangeCategory}
                index={index}
                title={item}
            />
        )}
    />
  )
}

const CategoryItem = ({title, index, isActive, handleChangeCategory}) => {
    //color and backgrouldColor are reserved in css native, STRICTLY USE THIS OR WONT WORK
    let color = isActive? theme.colors.white : theme.colors.neutral(0.8);
    let backgroundColor = isActive? theme.colors.neutral(0.8) : theme.colors.white;
    return (
        <Animated.View entering={FadeInRight.delay(index*200).duration(1000).springify().damping(14)}>
            <Pressable 
                onPress={() => handleChangeCategory(isActive ? null : title)} 
                style={[styles.category, {backgroundColor}]}
            >
                <Text style={[styles.title, {color}]}>{title}</Text>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    flatlistContainer: {
        gap: 8,
        paddingHorizontal: wp(4)
    },
    category: {
        padding: 12,
        paddingHorizontal:15,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous'
    },
    title: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeight.medium
    }

})

export default Categories