<p align="center">
  <img src="snowflake.png" height="96" />
</p>

<p align="center">Enforces state immutability on react components.</p>

## What is it for?

React suggests that you do not mutate the state of your components directly. Unfortunately there is nothing enforcing this suggestion. Not even linting rules can guarantee that you don't do something like this:

    const Component = React.createClass({
        getInitialState(){
            return {
                count: 1
            }
        },
        onClick(){
            const state = this.state;
            state.count = state.count + 1; // ----- direct state mutation -----
            this.setState(state);
        },
        render(){
            return <div>
                <div>{this.state.count}</div>
                <button onClick={this.onClick}>add 1</button>
            </div>
        }
    });

react-immutable-state gives you an utility function that prevents direct state mutations on components

    import immutableState from 'react-immutable-state';

    const Component = immutableState(React.createClass({
        getInitialState(){
            return {
                count: 1
            }
        },
        onClick(){
            const state = this.state;
            state.count = state.count + 1; // ----- this line will throw an exception when executed in development mode -----
            this.setState(state);
        },
        render(){
            return <div>
                <div>{this.state.count}</div>
                <button onClick={this.onClick}>add 1</button>
            </div>
        }
    }));

## How to install it?

```bash
npm install --save react-immutable-state
```

## The API

you can both use

    import immutableState from 'react-immutable-state';

    const Component = immutableState(React.createClass({
        ...
    }));

or

    import immutableState from 'react-immutable-state';

    const Component = immutableState(class extends React.Component {
        ...
    });

importing 'react-immutable-state' through CommonJS and AMD is also supported

## Why this library?

The React documentation states: "Never mutate this.state directly, as calling setState() afterwards may replace the mutation you made. Treat this.state as if it were immutable."

Furthermore, is very easy to implement the shouldComponentUpdate() method of your components if their state is an immutable object, you can in fact just use the === operator to understand what object is changed.

Extra info can be found here:

https://stackoverflow.com/questions/37755997/why-cant-i-directly-modify-a-components-state-really

## Is this library a performance overhead?

this library does something only when

    process.env.NODE_ENV !== "production";

so it doesn't add a performance overhead when your code is running in production
