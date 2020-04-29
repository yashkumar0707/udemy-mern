import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './PlaceForm.css';

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

const UpdatePlace = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [loadedPlace, setLoadedPlace] = useState()
    const auth = useContext(AuthContext)
    const placeId = useParams().placeId;
    const history = useHistory()
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(() => {

        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
                setLoadedPlace(responseData.place)
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        }
                    },
                    true
                );
            }
            catch (err) {
                console.log(err)
            }

        }
        fetchPlace()
    }, [sendRequest, placeId, setFormData]
    )




    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs);
        try {
            await sendRequest(`http://localhost:5000/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )
            history.push('/' + auth.userId + '/places')
        }
        catch (err) {

        }
    };
    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner></LoadingSpinner>
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2> Could not find place!</h2>
                </Card>
            </div >
        );
    }


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}></ErrorModal>
            {!isLoading && loadedPlace && (
                <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        initialValue={loadedPlace.title}
                        initialValid={true}
                    />
                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (min. 5 characters)."
                        onInput={inputHandler}
                        initialValue={loadedPlace.description}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                </Button>
                </form>
            )}
        </React.Fragment>
    );
};

export default UpdatePlace;
