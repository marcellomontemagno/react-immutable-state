import deepFreeze from 'deep-freeze';

export default (Component) => {

    let result = Component;

    if (__is__dev__) {

        window.__IS_REACT_IMMUTABLE_STATE_ACTIVE__ = true;

        result = class extends Component {
            constructor (props) {
                super(props);
                if (this.state) {
                    this.state = deepFreeze(this.state);
                }
            }
        }

        const originalSetState = Component.prototype.setState;
        const originalComponentDidUpdate = Component.prototype.componentDidUpdate;

        /* componentDidUpdate is invoked before setState callback,
         this override guarantee the state is frozen both in componentDidUpdate and the set state callback */
        Component.prototype.componentDidUpdate = function (prevProps, prevState) {
            Object.freeze(this.state);
            if (originalComponentDidUpdate) {
                originalComponentDidUpdate.call(this, prevProps, prevState);
            }
        }

        Component.prototype.setState = function (state, callback) {
            originalSetState.call(this, deepFreeze(state), callback);
        };

    }

    return result;

}
