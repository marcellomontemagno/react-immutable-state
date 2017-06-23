import React from 'react';
import immutableState from '../src/immutableState';
import {mount, render} from 'enzyme';

let defaultSpec = {

    getInitialState(){
        return {
            a: 1,
            b: 1,
            c: {
                c1: 1,
                c2: 1
            }
        }
    }

}

const exceptionMessage = "Cannot assign to read only property";

let component;

describe('Immutable State --- using extends React.Component ---', () => {

    it('should be applicable to the minimal definition', () => {
        let Component = immutableState(class TestClass extends React.Component {
            render () {
                return null;
            }
        });
        component = mount(<Component />).get(0);
    });

    it('the automatic methods binding should - NOT - be in place', () => {
        const onClick = jest.fn(function(){
            expect(this).toBe(undefined);
        });
        let Component = immutableState(class TestClass extends React.Component {
            onClick = onClick
            render(){
                return <button onClick={this.onClick}/>;
            }
        });
        let button = mount(<Component />).find('button');
        button.simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    describe('basic usage', () => {

        beforeEach(() => {

            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                render () {
                    return <div/>;
                }
            });

            component = mount(<Component />).get(0);

        });

        it('should prevent state mutations', () => {
            expect(() => {
                component.state.a = 2;
            }).toThrow(exceptionMessage);
        });

        it('should prevent deep state mutations', () => {
            expect(() => {
                component.state.c.c1 = 2;
            }).toThrow(exceptionMessage);
        });

        it('should allow state replacement through setState', (done) => {
            expect(component.state.a).toBe(1);
            component.setState({a: 2}, () => {
                expect(component.state.a).toBe(2);
                done();
            });
        });

        it('should still prevent state mutations after the state has been replaced using setState', (done) => {
            expect(component.state.a).toBe(1);
            component.setState({a: 2}, () => {
                expect(component.state.a).toBe(2);
                expect(() => {
                    component.state.a = 3;
                }).toThrow(exceptionMessage);
                expect(() => {
                    component.state.b = 3;
                }).toThrow(exceptionMessage);
                expect(() => {
                    component.state.c.c1 = 2;
                }).toThrow(exceptionMessage);
                done();
            });
        });

    });

    describe('lifecycle methods extends React.Component', () => {

        it('should prevent state mutations in the componentWillMount lifecycle method', () => {
            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                componentWillMount () {
                    this.state.a = 2;
                }

                render () {
                    return <div/>
                }
            });
            expect(() => {
                mount(<Component />);
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentWillReceiveProps lifecycle method', () => {
            const InnerComponent = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                componentWillReceiveProps () {
                    this.state.a = 2;
                }

                render () {
                    return <div/>
                }
            });
            let WrapperComponent = immutableState(React.createClass({
                ...defaultSpec,
                render(){
                    return <InnerComponent aProp={this.state.a}/>
                }
            }));
            component = mount(<WrapperComponent />).get(0);
            expect(() => {
                component.setState({a: 1})
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentDidMount lifecycle method', () => {
            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                componentDidMount () {
                    this.state.a = 2;
                }

                render () {
                    return <div/>
                }
            });
            expect(() => {
                mount(<Component />);
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the shouldComponentUpdate lifecycle method', () => {
            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                shouldComponentUpdate () {
                    this.state.a = 2;
                }

                render () {
                    return <div/>
                }
            });
            component = mount(<Component />).get(0);
            expect(() => {
                component.setState({a: 1});
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentWillUpdate lifecycle method', () => {
            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                componentWillUpdate () {
                    this.state.a = 2;
                }

                render () {
                    return <div/>
                }
            });
            component = mount(<Component />).get(0);
            expect(() => {
                component.setState({a: 1});
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentDidUpdate lifecycle method', () => {
            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                componentDidUpdate () {
                    this.state.a = 2;
                }

                render () {
                    return <div/>
                }
            });
            component = mount(<Component />).get(0);
            expect(() => {
                component.setState({a: 1});
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentWillUnmount lifecycle method', () => {
            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                componentWillUnmount () {
                    this.state.a = 2;
                }

                render () {
                    return <div/>
                }
            });
            component = mount(<Component />);
            expect(() => {
                component.unmount();
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the render lifecycle method', () => {
            const Component = immutableState(class TestClass extends React.Component {
                constructor (props) {
                    super(props);
                    this.state = defaultSpec.getInitialState();
                }

                render () {
                    this.state.a = 2;
                    return <div/>
                }
            });
            expect(() => {
                mount(<Component />);
            }).toThrow(exceptionMessage);
        });

    });


});
