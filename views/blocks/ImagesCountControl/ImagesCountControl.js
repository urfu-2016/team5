/* global React:true */

import './ImagesCountControl.css';
import './../Input.css';

class ImagesCountControl extends React.Component {
    render() {
        const {value, name} = this.props;

        return (
            <div className="imagesCountControl">
                <div className="imagesCountControl__item">
                    <span>От:</span>
                    <input className="imagesCountControl__input input" type="number"
                        value={value.from} name={name.from}></input>
                </div>
                <div className="imagesCountControl__item">
                    <span>До:</span>
                    <input className="imagesCountControl__input input" type="number"
                        value={value.to} name={name.to}></input>
                </div>
            </div>);
    }
}

export default ImagesCountControl;
