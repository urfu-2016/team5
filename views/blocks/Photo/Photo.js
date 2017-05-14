import React from 'react';

export default class Photo extends React.Component {
    constructor(props) {
        super(props);

        this.sendGeolocaion = this.sendGeolocaion.bind(this);
    }

    sendGeolocaion() {
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
                <button onClick={this.sendGeolocaion}>Отметиться</button>
            </div>
        );
    }
}
