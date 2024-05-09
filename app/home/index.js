import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AntDesign, Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { wp, hp } from '../../helpers/common';
import Categories from '../../components/categories';
import { apiCall } from '../../api';
import ImageGrid from '../../components/imageGrid';
import {debounce, filter} from 'lodash';
import FiltersModal from '../../components/filtersModal';
import { useRouter } from 'expo-router';

var page = 1;

const HomeScreen = () => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10: 30;

    const [filters, setFilters] = useState(null);
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [search, setSearch] = useState('')
    const searchInputRef = useRef(null);
    const modalRef = useRef(null);
    const scrollRef = useRef(null);
    const router = useRouter();
    const [isEndReached, setIsEndReached] = useState(false)

    const openFiltersModal = () => {
        modalRef?.current?.present();
    }

    const closeFiltersModal = () => {
        modalRef?.current?.close();
    }

    const applyFilters = () => {
        if(filters) {
            page = 1
            setImages([]);
            let params = {
                page,
                ...filters
            }

            if(activeCategory) params.category = activeCategory;
            if(search) params.q = search
            fetchImages(params, false)
        }
        console.log('applying filters');
        closeFiltersModal();
    }

    const resetFilters = () => {
        if(filters) {
            setFilters(null)
            page = 1
            setImages([]);
            let params = {
                page,
            }

            if(activeCategory) params.category = activeCategory;
            if(search) params.q = search
            fetchImages(params, false)
        }
        closeFiltersModal();
    }

    const clearThisFilter = filterName => {
        let fliterz = {...filters};
        delete fliterz[filterName];
        setFilters({...fliterz});

        page = 1
        setImages([]);
        let params = {
            page,
            ...fliterz
        }

        if(activeCategory) params.category = activeCategory;
        if(search) params.q = search
        fetchImages(params, false)
    }

    const handleChangeCategory = (cat) => {
        setActiveCategory(cat)
        // console.log(activeCategory)
        clearSearch();
        setImages([]);
        page=1
        let params = {
            page,
            ...filters
        };

        if (cat) params.category = cat;
        fetchImages(params, false);
    }

    const handleSearch = (text) => {
        setSearch(text);

        if(text.length>2) {
            page = 1
            setImages([]);
            setActiveCategory(null); // clear category while searching
            fetchImages({page:1, q: text, ...filters}, false);

        }

        if (text =='') {
            page = 1;
            searchInputRef?.current?.clear();
            setImages([]);
            setActiveCategory(null); // clear category while searching
            fetchImages({page, ...filters}, false);
        }
    }

    const clearSearch = () => {
        setSearch("");
        searchInputRef?.current?.clear();
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []); //debounce text in input after 400ms


    useEffect(() => {
        fetchImages();
    }, []);

    //note dev: append here is to append new fetched images into exisitng array images.
    const fetchImages = async (params = {page:1}, append=true) => {
        console.log('params: ', params, append)
        let res = await apiCall(params); //
        if(res.success && res?.data?.hits) {
            if(append) {
                setImages([...images, ...res.data.hits])
                // console.log(images)
            } else {
                setImages([...res.data.hits])
            }
        }
      
    }

    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const ScrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const bottomPosition = contentHeight - ScrollViewHeight;

        if (scrollOffset >= bottomPosition -1) {
            if(!isEndReached) {
                setIsEndReached(true)
                console.log('reached bottom of the screen')
                
                //run api to fetch more image here
                ++page;
                let params = {
                    page,
                    ...filters
                }

                if(activeCategory) params.category = activeCategory;
                if(search) params.q = search;
                fetchImages(params)
            }

        } else if (isEndReached) {
            setIsEndReached(false);
        }
    }

    const handleScrollUp = () => {
        scrollRef?.current?.scrollTo({
            y: 0,
            animated: true
        })
    }
    

    // console.log('filters ', filters)

    return (
        // padding top to void element behind dynamic island ios @ top bar android
        <View style={[styles.container, { paddingTop }]}> 
            <View style={styles.header}>
                <Pressable onPress={handleScrollUp}>
                    <Text style={styles.title}>
                        Pixels
                    </Text>
                </Pressable>
                <Pressable onPress={openFiltersModal}>
                    <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)}>
                    </FontAwesome6>
                </Pressable>
            </View>

            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={5} //how often scroll event will fire while scrolling (in ms)
                ref={scrollRef}
                contentContainerStyle={{gap: 15}}
            >   
                <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                        <Feather name="search" size={24} color={theme.colors.neutral(0.4)}/>
                    </View>
                    <TextInput 
                        placeholder='Search for photos..'
                        // value={search}
                        ref={searchInputRef}
                        onChangeText={handleTextDebounce}
                        style={styles.searchInput}
                    />
                    {
                        search &&
                        <Pressable onPress={() => handleSearch("")} style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)}/>
                        </Pressable>

                    }
                </View>

                {/* categories */}
                <View style={styles.categories}>
                    <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory}/>
                </View>

                {/* filters */}
                {
                    filters && (
                        <View>
                            <ScrollView 
                                horizontal
                                showsHorizontalScrollIndicator={false} 
                                contentContainerStyle={styles.filters}
                            >
                                {
                                    Object.keys(filters).map((key, index) => {
                                        return (
                                            <View 
                                                key={key}
                                                style={styles.filterItem}
                                            >
                                                {
                                                    key == 'colors' ? (
                                                        <View style={{
                                                            height: 20,
                                                            width: 30, 
                                                            borderRadius: 7,
                                                            backgroundColor: filters[key]
                                                        }}/>
                                                    ) : (
                                                        <Text style={styles.filterItemText}>{filters[key]}</Text>
                                                    )
                                                }
                                                <Pressable 
                                                    style={styles.filterCloseIcon} 
                                                    onPress={() => clearThisFilter(key)}
                                                >
                                                     <Ionicons name="close" size={24} color={theme.colors.neutral(0.9)}/>
                                                </Pressable>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }

                {/* images listing grid */}
                <View>
                    { 
                        images.length > 0 && <ImageGrid images={images} router={router}/>
                    }
                </View>

                 {/* loading spinnner */}
                 <View style={{marginBottom: 70, marginTop: images.length > 0 ? 10 : 70}}>
                    <ActivityIndicator size={"large"}/>
                 </View>
            </ScrollView>

                {/*  Filters modal */}
                <FiltersModal 
                    modalRef={modalRef}
                    filters={filters}
                    setFilters={setFilters}
                    onClose={closeFiltersModal}
                    onApply={applyFilters}
                    onReset={resetFilters}
                    />
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        gap: 15
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.neutral(0.9)

    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.lg

    },
    searchIcon: {
        padding: 8
    },
    searchInput: {
        flex: 1, //make it to the left in its own div
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(1.8)
    },
    closeIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 8,
        borderRadius: theme.radius.sm
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10
    },
    filterItem: {
        backgroundColor: theme.colors.grayBG,
        padding: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.xs,
        padding: 8,
        gap: 10,
        paddingHorizontal: 10
    },
    filterItemText:{
        fontSize: hp(1.9)
    },
    filterCloseIcon : {
        backgroundColor: theme.colors.neutral(0.2),
        padding: 4,
        borderRadius : 7
    }

})

export default HomeScreen