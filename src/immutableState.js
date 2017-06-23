import deepFreeze from 'deep-freeze';

const isDev = process.env.NODE_ENV !== "production";

export default (Component) => {

    let result = Component;

    if (isDev) {

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
