import React, { useState, useContext } from 'react'
import './PlaceItem.css'
import Modal from '../../shared/components/UIElements/Modal'
import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'

const PlaceItem = props => {
    const [showMap, setShowMap] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const openMapHandler = () => {
        setShowMap(true)
    }
    const closeMapHandler = () => {
        setShowMap(false)
    }
    const showDeleteWarning = () => {
        setShowConfirmModal(true)
    }
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false)
    }
    const confirmDeleteHandler = () => {
        setShowConfirmModal(false)
        console.log('DELETING')
    }
    return (
        <React.Fragment>
            <Modal show={showMap} onCancel={closeMapHandler} header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}

            >
                <div className="map-container">
                    <h2>The map</h2>
                </div>
            </Modal>
            <Modal show={showConfirmModal} header="Are you sure?" footerClass="place-item__modal-actions" footer={
                <React.Fragment>
                    <Button inverse onClick={cancelDeleteHandler}>
                        CANCEL
                    </Button>
                    <Button danger onClick={confirmDeleteHandler}>
                        DELETE
                    </Button>
                </React.Fragment>
            }>
                <p>
                    Do you want to proceed and delete this place? Please note that it can't be undone thereafter
                </p>
            </Modal>
            < li className="place-item">
                <Card className="place-item__content">
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title}></img>
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button reverse onClick
                            ={openMapHandler}>VIEW ON MAP</Button>
                        <Button to={`/places/${props.id}`}>EDIT</Button>
                        <Button danger onClick={showDeleteWarning}>DELETE</Button>
                    </div>
                </Card>
            </li>
        </React.Fragment >
    )
}

export default PlaceItem