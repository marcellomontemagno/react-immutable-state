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

      /* componentDidUpdate is invoked before setState callback,
       this override guarantee the state is frozen both in componentDidUpdate and the set state callback */
      componentDidUpdate (prevProps, prevState) {
        Object.freeze(this.state);
        if (super.componentDidUpdate) {
          super.componentDidUpdate(prevProps, prevState);
        }
      }

      setState (state, callback) {
        super.setState(deepFreeze(state), callback);
      }

    }

  }

  return result;

}
