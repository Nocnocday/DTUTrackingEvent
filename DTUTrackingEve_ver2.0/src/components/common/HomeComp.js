import { View, Text, ScrollView, Pressable, FlatList } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import withBaseComponent from '../../hocs/withBaseComponent'
import { SliderBox } from 'react-native-image-slider-box'
import CardEvent from '../event/CardEvent'
import clsx from 'clsx'
import { apiGetEvents } from '../../apis'
import moment from 'moment'
import { useSelector } from 'react-redux'
import EmptyData from './EmptyData'
import { getEventsHot, getEventsToday } from '../../store/event/asyncActions'

const HomeComp = ({ navigation: { navigate }, layout, dispatch }) => {
	const { current, isLoggedIn } = useSelector(state => state.user)
	const { todayEvents, hotEvents } = useSelector(state => state.event)

	useEffect(() => {
		dispatch(
			getEventsToday({
				limit: 10,
				page: 1,
				date: moment().format('YYYY-MM-DD'),
			}),
		)
		dispatch(
			getEventsHot({
				limit: 5,
				page: 1,
				hot: true,
			}),
		)
	}, [dispatch, isLoggedIn])

	return (
		<View
			showsVerticalScrollIndicator={false}
			className={clsx('px-3 my-3 flex-1')}>
			{hotEvents?.length > 0 && (
				<View className='mb-2'>
					<View className='mb-3 flex-row justify-between items-center'>
						<Text className='capitalize text-[16px] font-[700] text-text-white--dark'>
							sự kiện hot
						</Text>
						<Pressable
							onPress={() => navigate('ListEvent', { chooseTabList: 'hot' })}>
							<Text className='capitalize text-[14px] font-[700] text-login--text--navigate--dark'>
								xem tất cả
							</Text>
						</Pressable>
					</View>
					<SliderBox
						images={hotEvents?.map(el => el?.image)}
						ImageComponentStyle={{
							marginRight: 24,
							width: layout.width - 24,
							borderRadius: 6,
						}}
						autoplay={true}
						circleLoop={true}
						dotColor='#061d8d'
						inactiveDotColor='#737377'
						autoplayInterval={5000}
						onCurrentImagePressed={index => {
							const eventTarget = hotEvents?.find((el, id) => index === id)
							navigate('DetailEvent', {
								eventId: eventTarget?.id,
							})
						}}
					/>
				</View>
			)}
			<View className={clsx(hotEvents?.length > 0 && 'my-1', 'flex-1')}>
				<View className='mb-3 flex-row justify-between items-center'>
					<Text className='capitalize text-[16px] font-[700] text-text-white--dark'>
						sự kiện hôm nay
					</Text>
					<Pressable
						onPress={() => navigate('ListEvent', { chooseTabList: 'today' })}>
						<Text className='capitalize text-[14px] font-[700] text-login--text--navigate--dark'>
							xem tất cả
						</Text>
					</Pressable>
				</View>
				{todayEvents?.length > 0 ? (
					<FlatList
						showsVerticalScrollIndicator={false}
						data={todayEvents}
						renderItem={({ item, index }) => (
							<CardEvent
								item={item}
								key={item.id}
								userId={current?.id || 0}
								borderHiden={index === todayEvents?.length - 1 ? false : true}
							/>
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
				) : (
					<EmptyData />
				)}
			</View>
		</View>
	)
}

export default withBaseComponent(memo(HomeComp))
