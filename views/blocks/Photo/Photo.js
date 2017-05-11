import React from 'react';

export default class Photo extends React.Component {
    render() {
        const {src, answered, rigthAnswered} = this.props;

        return (
            <div className={'block block_gray'}>
                <div >
                    <img src={src}></img>
                </div>
                    {answered}
                <div>
                </div>
                <div>
                    {rigthAnswered}
                </div>
                <button onClick={this.props.onAction}>Отметиться</button>
            </div>
        );
    }
}
