import React from 'react';

export default class Photo extends React.Component {
    constructor(props) {
        super(props);

        this.handleSendGeolocaion = this.handleSendGeolocaion.bind(this);
    }

    handleSendGeolocaion() {
        this.props.canSend(canSend => {
            if (canSend) {
                this.props.onAction();
            }
        });
    }

    render() {
        const {src, status} = this.props;

        return (
            <div className={'block block_gray'}>
                <div >
                    <img src={src}></img>
                </div>
                    {status}
                <div>
                </div>
                <button onClick={this.handleSendGeolocaion}>Отметиться</button>
            </div>
        );
    }
}
