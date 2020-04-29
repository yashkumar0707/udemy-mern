import React, { useEffect, useState } from 'react'
import PlaceList from '../components/PlaceList'
import { useParams } from 'react-router-dom'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
const UserPlaces = () => {
    // const DUMMY_PLACES = [
    //     {
    //         id: 'p1',
    //         title: 'EMpire STate Building',
    //         description: 'One of the most famous sky scrapers in the world!',
    //         imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg',
    //         address: 'Midtown Manhattan, New York City',
    //         location: {
    //             lat: 40.7484405,
    //             lng: -73.9878584
    //         },
    //         creator: 'u1'
    //     },
    //     {
    //         id: 'p2',
    //         title: 'empire STate Building 2',
    //         description: 'One of the most famous sky scrapers in the world!',
    //         imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg',
    //         address: 'Midtown Manhattan, New York City',
    //         location: {
    //             lat: 40.7484405,
    //             lng: -73.9878584
    //         },
    //         creator: 'u2'
    //     }
    // ]
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedPlaces, setLoadedPlaces] = useState()
    const userId = useParams().userId
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                console.log(responseData)
                setLoadedPlaces(responseData.places);
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchPlaces()
    }, [sendRequest, userId]);
    const placeDeleteHandler = deltedPlaceId => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deltedPlaceId))
    }
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}></ErrorModal>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner></LoadingSpinner>
                </div>
            )}
            {!isLoading && loadedPlaces && (< PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />)
            }
        </React.Fragment>
    )
}


export default UserPlaces