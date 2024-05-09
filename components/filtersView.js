import { View, Text, StyleSheet, Pressable } from 'react-native'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'
import { capitalize } from 'lodash'

export const SectionView = ({title, content}) => {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>

            <View>
                {content}
            </View>

        </View>
    )
}

export const CommonFilterRow = ({data, filterName, filters, setFilters}) => {

    return (
        <View styles={styles.flexRowWrap}>
            {
                data && data.map((item,index) => {
                    return (
                        <Pressable key={index}>
                            <Text>{capitalize(item)}</Text>
                        </Pressable>
                    )
                })
            }

        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.neutral(0.8)
    }
})