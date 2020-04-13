import React from 'react'
import PlaceList from '../components/PlaceList'
import { useParams } from 'react-router-dom'
const UserPlaces = () => {
    const DUMMY_PLACES = [
        {
            id: 'p1',
            title: 'EMpire STate Building',
            description: 'One of the most famous sky scrapers in the world!',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg',
            address: 'Midtown Manhattan, New York City',
            location: {
                lat: 40.7484405,
                lng: -73.9878584
            },
            creator: 'u1'
        },
        {
            id: 'p2',
            title: 'empire STate Building 2',
            description: 'One of the most famous sky scrapers in the world!',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg',
            address: 'Midtown Manhattan, New York City',
            location: {
                lat: 40.7484405,
                lng: -73.9878584
            },
            creator: 'u2'
        }
    ]

    const userId = useParams().userId
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId)
    return (< PlaceList items={loadedPlaces} />
    )
}


export default UserPlaces