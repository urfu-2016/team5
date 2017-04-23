import React from 'react';
import states from './states';

export default function Sender(Component) {
    return class Sender extends React.Component {
        constructor(props) {
            super(props);

            this.state = states.defaultState;

            this.handleSuccessfulSend = this.handleSuccessfulSend.bind(this);
            this.handleFailedSend = this.handleFailedSend.bind(this);
            this.handleNoConnecting = this.handleNoConnecting.bind(this);
            this.handleAction = this.handleAction.bind(this);
        }

        handleAction(data) {
            this.setState(states.actionState);
            this.props.handleAction(data,
                {
                    handleSuccessfulSend: this.handleSuccessfulSend,
                    handleFailedSend: this.handleFailedSend,
                    handleNoConnecting: this.handleNoConnecting
                }
            );
        }

        handleNoConnecting() {
            this.setState(states.noConnectionState);
        }

        handleSuccessfulSend(data) {
            this.setState(states.defaultState);
            this.props.onSuccesfulEnd(data);
        }

        handleFailedSend() {
            this.setState(states.failedState);
        }

        render() {
            return (
                <Component onAction={this.handleAction}
                    {...this.state} {...this.props}
                />
            );
        }
    };
}
