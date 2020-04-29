import React, { useState, useContext } from 'react'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators'
import Input from '../../shared/components/FormElements/Input'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import './Auth.css'

const Auth = () => {
    const auth = useContext(AuthContext)
    const [isLogin, setIsLogin] = useState(true)
    const { isLoading, error, sendRequest, clearError } = useHttpClient()
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)
    const authSubmitHandler = async event => {
        event.preventDefault()
        if (isLogin) {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-type': 'application/json'
                    }
                )
                console.log(responseData)
                console.log(responseData.userId)
                auth.login(responseData.userId, responseData.token)

            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            try {
                const formData = new FormData()
                formData.append('email', formState.inputs.email.value)
                formData.append('name', formState.inputs.name.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value)
                const responseData = await sendRequest('http://localhost:5000/api/users/signup',
                    'POST',
                    // JSON.stringify({
                    //     name: formState.inputs.name.value,
                    //     email: formState.inputs.email.value,
                    //     password: formState.inputs.password.value
                    // }),
                    // {
                    //     'Content-type': 'application/json'
                    // },
                    formData
                )
                auth.login(responseData.userId, responseData.token)
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    const switchModeHandler = () => {
        if (!isLogin) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }
                , false)
        }
        setIsLogin(prevMode => !prevMode)
    }

    // const errorHandler = () => {
    //     setError(null)
    // }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}></ErrorModal>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
                <h2>{!isLogin ? 'SignUp' : 'Login'} Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLogin && (<Input
                        element="input"
                        id="name"
                        type="text"
                        label="Your Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Enter a Name"
                        onInput={inputHandler} />
                    )}
                    {!isLogin && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide a valid image"></ImageUpload>}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address"
                        onInput={inputHandler}
                    ></Input>
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password. (At least 6 characters)"
                        onInput={inputHandler}
                    ></Input>
                    <Button type="submit" disabled={!formState.isValid}>
                        {!isLogin ? 'SignUp' : 'Login'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>SWITCH TO {isLogin ? 'SignUp' : 'Login'}</Button>
            </Card>
        </React.Fragment >
    )
}

export default Auth