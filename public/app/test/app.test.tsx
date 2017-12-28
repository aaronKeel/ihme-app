import { expect } from 'chai';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import * as React from 'react';

const globalAny: any = global;

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

globalAny.window = window;
globalAny.document = window.document;

Enzyme.configure({ adapter: new Adapter() });

import App from '../containers/app';

describe('<App />', () => {
  it('allows us to set props', () => {
    const wrapper = Enzyme.mount(<App title={'TEST'} />);

    expect(wrapper.props().title).to.equal('TEST');
  });
});
