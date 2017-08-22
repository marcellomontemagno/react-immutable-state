import React from 'react';
import immutableState from '../src/immutableState';
import {mount, render} from 'enzyme';

global.__is__dev__ = true;

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
    },

    render(){
        return <div/>
    }

}

const exceptionMessage = "Cannot assign to read only property";

let component;

describe('Immutable State --- using createClass ---', () => {

    it('should be applicable to the minimal definition', () => {
        let Component = immutableState(React.createClass({render: () => null}));
        component = mount(<Component />).get(0);
    });

    it('the automatic methods binding should BE in place', () => {
        const onClick = jest.fn(function(){
            expect(this).toBe(component);
        });
        const Component = immutableState(React.createClass({
            ...defaultSpec,
            onClick,
            render(){
                return <button onClick={this.onClick}/>;
            }
        }));
        const wrapper = mount(<Component />);
        component = wrapper.get(0);
        let button = wrapper.find('button');
        button.simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    describe('basic usage', () => {

        beforeEach(() => {
            const Component = immutableState(React.createClass(defaultSpec));
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

    describe('lifecycle methods', () => {

        it('should prevent state mutations in the componentWillMount lifecycle method', () => {
            let Component = immutableState(React.createClass({
                ...defaultSpec,
                componentWillMount(){
                    this.state.a = 2;
                }
            }));
            expect(() => {
                mount(<Component />);
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentWillReceiveProps lifecycle method', () => {
            let InnerComponent = immutableState(React.createClass({
                ...defaultSpec,
                componentWillReceiveProps(){
                    this.state.a = 2;
                }
            }));
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
            let Component = immutableState(React.createClass({
                ...defaultSpec,
                componentDidMount(){
                    this.state.a = 2;
                }
            }));
            expect(() => {
                mount(<Component />);
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the shouldComponentUpdate lifecycle method', () => {
            let Component = immutableState(React.createClass({
                ...defaultSpec,
                shouldComponentUpdate(){
                    this.state.a = 2;
                }
            }));
            component = mount(<Component />).get(0);
            expect(() => {
                component.setState({a: 1});
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentWillUpdate lifecycle method', () => {
            let Component = immutableState(React.createClass({
                ...defaultSpec,
                componentWillUpdate(){
                    this.state.a = 2;
                }
            }));
            component = mount(<Component />).get(0);
            expect(() => {
                component.setState({a: 1});
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentDidUpdate lifecycle method', () => {
            let Component = immutableState(React.createClass({
                ...defaultSpec,
                componentDidUpdate(){
                    this.state.a = 2;
                }
            }));
            component = mount(<Component />).get(0);
            expect(() => {
                component.setState({a: 1});
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the componentWillUnmount lifecycle method', () => {
            let Component = immutableState(React.createClass({
                ...defaultSpec,
                componentWillUnmount(){
                    this.state.a = 2;
                }
            }));
            component = mount(<Component />);
            expect(() => {
                component.unmount();
            }).toThrow(exceptionMessage);
        });

        it('should prevent state mutations in the render lifecycle method', () => {
            let Component = immutableState(React.createClass({
                ...defaultSpec,
                render(){
                    this.state.a = 2;
                    return <div/>;
                }
            }));
            expect(() => {
                mount(<Component />);
            }).toThrow(exceptionMessage);
        });

    });

});
